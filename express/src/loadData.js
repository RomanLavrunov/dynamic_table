import { get } from 'https';
import knex from './db.js';
import ChunkHandler from '../utils/chunkHandler.js';
import { urlConfig } from './config/urlConfig.js';
import { config } from './config/config.js';

const DATA_URL = urlConfig['2M'];
const DATA_TABLE = config.database;

async function clearTable() {
  await knex(DATA_TABLE).del();
}

async function insertChunk(chunk) {
  const chunkSize = 200;
  await knex.batchInsert(DATA_TABLE, chunk, chunkSize);
}

async function fetchAndInsertData() {
  return new Promise((resolve, reject) => {
    const chunkHandler = new ChunkHandler(); 
    let rowsInserted = 0;

    get(DATA_URL, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch data, status code: ${res.statusCode}`));
        return;
      }

      res.on('data', async (chunk) => {
        chunkHandler.processChunk(chunk.toString());
        if (chunkHandler.processedChunks.length >= 200) {
          const chunkToInsert = chunkHandler.processedChunks.splice(0, 200);
          await insertChunk(chunkToInsert);
          rowsInserted += chunkToInsert.length;
        }
      });

      res.on('end', async () => {
        if (chunkHandler.processedChunks.length > 0) {
          await insertChunk(chunkHandler.processedChunks);
          rowsInserted += chunkHandler.processedChunks.length;
        }
        resolve(rowsInserted);
      });
    }).on('error', (err) => reject(err));
  });
}

async function checkDataExists() {
  const count = await knex(DATA_TABLE).count('* as total');
  return count[0].total > 0;
}

export async function loadData() {
  try {
    const alreadyLoaded = await checkDataExists();
    if (alreadyLoaded) {
      console.log("Loading from DB")
      return;
    }
    await clearTable();
    const rowsInserted = await fetchAndInsertData();
    console.log(`Data successfully loaded. Total rows inserted: ${rowsInserted}`);
  } catch (error) {
    console.error('Error loading data:', error.message);
  }
}


