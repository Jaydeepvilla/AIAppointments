export interface EmbeddingResult {
  embedding: number[];
  tokenCount: number;
}

export interface SearchMatch {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

// 1. Embedding Service Interface
export interface EmbeddingService {
  generateEmbedding(text: string): Promise<EmbeddingResult>;
  generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]>;
}

// 2. Vector Store Interface
export interface VectorStore {
  saveEmbedding(organizationId: string, chunkId: string, embedding: number[], metadata?: Record<string, any>): Promise<void>;
  deleteEmbeddings(chunkIds: string[]): Promise<void>;
}

// 3. Retrieval Interface & Similarity Search Interface
export interface RetrievalService {
  retrieveRelevantChunks(organizationId: string, query: string, limit?: number): Promise<SearchMatch[]>;
}

// Mock Implementations for abstract layers
export class MockEmbeddingService implements EmbeddingService {
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    // Generate placeholder 1536-dimension float array for text-embedding-3-small
    const embedding = Array.from({ length: 1536 }, () => 0.0);
    embedding[0] = 0.5; // simple mock values
    const tokenCount = Math.ceil(text.length / 4);

    return {
      embedding,
      tokenCount,
    };
  }

  async generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    return Promise.all(texts.map((text) => this.generateEmbedding(text)));
  }
}

export class MockVectorStore implements VectorStore {
  async saveEmbedding(
    organizationId: string,
    chunkId: string,
    embedding: number[],
    metadata?: Record<string, any>
  ): Promise<void> {
    console.log(`[VectorStore] Save embedding placeholder for chunk: ${chunkId} (Org: ${organizationId}). Vector dims: ${embedding.length}`);
  }

  async deleteEmbeddings(chunkIds: string[]): Promise<void> {
    console.log(`[VectorStore] Delete embeddings placeholder for chunks: ${chunkIds.join(", ")}`);
  }
}

export class MockRetrievalService implements RetrievalService {
  async retrieveRelevantChunks(
    organizationId: string,
    query: string,
    limit = 3
  ): Promise<SearchMatch[]> {
    console.log(`[RetrievalService] Similarity search query placeholder for "${query}" (Org: ${organizationId})`);
    
    // Returns empty array matches by default, ready for SQL pgvector vector similarity operators later
    return [];
  }
}

// Instances
export const embeddingService = new MockEmbeddingService();
export const vectorStore = new MockVectorStore();
export const retrievalService = new MockRetrievalService();
