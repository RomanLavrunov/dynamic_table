
import { IDocument } from '../../../shared/utilities/dataStorage/data.types';
import {ChunkHandler} from '../../../shared/utilities/streammig/chunkHandler'
import { NextRequest, NextResponse } from "next/server";
import dataStorage from '../../../shared/utilities/dataStorage/DataStorage';

const createStream = (path: string) => {
  return new ReadableStream({
    async start(controller) {
      const response = await fetch(path, { cache: "no-cache" });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      const chunkHandler = new ChunkHandler();
      let isFirstBatchSent = false;

      try {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          chunkHandler.processChunk(chunk)

          while (chunkHandler.processedChunks.length >= 200) {
            const chunkToSend: IDocument[] = chunkHandler.processedChunks.splice(0, 200)

            if (!isFirstBatchSent) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunkToSend)}`));
              isFirstBatchSent = true;
            } else {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunkToSend)}`));
            }

            dataStorage.addToStorage(chunkToSend);
          }
        }
      } catch (error) {
        console.error("Error data streaming...", error);
        controller.error(error);
      } finally {
        if (chunkHandler.processedChunks.length) {
          dataStorage.addToStorage(chunkHandler.processedChunks);
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunkHandler.processedChunks)}`));
        }
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              ready: true,
              documentAmount: dataStorage.documentAmout,
            })}`
          )
        );
        dataStorage.isDownloaded = true;
        controller.close();
      }
    },
  });
}

export async function GET(req: NextRequest) {
  const path = `${process.env.API_URL_100K}`;
  const { searchParams } = new URL(req.url);
  const sortParam = searchParams.get("sort");

  let searchQuery = null;
  if (sortParam) {
    try {
      searchQuery = JSON.parse(sortParam);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  if (dataStorage.storage.length) {
    let filteredDocuments: IDocument[] = [];

    if(searchQuery){
      const {searchValue, sortData, locale} = searchQuery;
      filteredDocuments = dataStorage.filterAndSortDocuments(sortData, searchValue, locale);
    }
     
      return NextResponse.json([
        filteredDocuments,
        { ready: true, documentAmount: dataStorage.documentAmout },
      ]);
    
  }

  const stream = createStream(path);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
