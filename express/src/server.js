import express from 'express';
import { loadData } from './loadData.js';
import { config } from './config/config.js';
import documentsRouter from './routers/documents.js';

const app = express();

(async () => {
  try {
    console.log('Initializing application...');
    await loadData();

    console.log('Setting up middleware...');

    app.use(express.json());
    app.use((req, res, next) => {
      console.log(`Incoming request: ${req.method} ${req.url}`);
      next();
    });

    app.get('/', (req, res) => {
      res.send('Server is running!');
    });

    app.use('/documents', documentsRouter);

    const PORT = config.server || 4000;

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to initialize application:', error.message);
    process.exit(1);
  }
})();
