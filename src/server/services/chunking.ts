export interface ChunkResult {
  content: string;
  chunkIndex: number;
  tokenCount: number;
}

export const chunkingService = {
  /**
   * Chunks a long document content into smaller overlapping parts.
   * Standard sliding-window character text splitter.
   */
  splitText(text: string, chunkSize = 800, chunkOverlap = 150): ChunkResult[] {
    const chunks: ChunkResult[] = [];
    if (!text || text.trim().length === 0) return chunks;

    const cleanedText = text.replace(/\r\n/g, "\n").trim();
    let startIndex = 0;
    let chunkIndex = 0;

    while (startIndex < cleanedText.length) {
      let endIndex = startIndex + chunkSize;
      
      // If we are not at the end of the text, try to find a natural break (period, newline, space)
      if (endIndex < cleanedText.length) {
        // Search back up to 100 characters for a sentence/paragraph break
        const searchBuffer = cleanedText.slice(endIndex - 100, endIndex + 20);
        const bestBreakIdx = searchBuffer.lastIndexOf("\n") !== -1 
          ? searchBuffer.lastIndexOf("\n") 
          : searchBuffer.lastIndexOf(". ");

        if (bestBreakIdx !== -1) {
          endIndex = endIndex - 100 + bestBreakIdx + 1; // Move index to the break point
        }
      } else {
        endIndex = cleanedText.length;
      }

      const content = cleanedText.slice(startIndex, endIndex).trim();
      if (content.length > 0) {
        const tokenCount = Math.ceil(content.length / 4); // Standard 4-character token approximation
        chunks.push({
          content,
          chunkIndex,
          tokenCount,
        });
        chunkIndex++;
      }

      if (endIndex >= cleanedText.length) {
        break;
      }

      // Calculate sliding window overlap
      startIndex = endIndex - chunkOverlap;
      if (startIndex >= endIndex) {
        startIndex = endIndex - 1;
      }
    }

    return chunks;
  },
};
