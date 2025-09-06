import openai from './openai';

// Global storage (simplified for MVP)
let documentStore = [];

export function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function storeDocument(text) {
  // Clear previous (MVP limitation)
  documentStore = [];
  
  // Simple chunking
  const chunkSize = 1000;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  // Store with embeddings
  for (const chunk of chunks) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk,
    });
    
    documentStore.push({
      text: chunk,
      embedding: response.data[0].embedding,
    });
  }
  
  return chunks.length;
}

export async function searchDocument(query) {
  if (documentStore.length === 0) return [];

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  const queryEmbedding = response.data[0].embedding;
  
  const results = documentStore
    .map(item => ({
      text: item.text,
      similarity: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  return results;
}