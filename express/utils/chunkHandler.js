class ChunkHandler {
    constructor() {
        this.processedChunks = [];
        this.cache = '';
    }

    processChunk(chunk) {
        this.cache += chunk;
        const regex = new RegExp("{[^{}]*}", "g");
        let match;

        while ((match = regex.exec(this.cache)) !== null) {
            try {
                const json = JSON.parse(match[0]);
                this.processedChunks.push(json);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }

            this.cache = this.cache.slice(match.index + match[0].length);
            regex.lastIndex = 0;
        }
    }
}

export default ChunkHandler;
