// Simple in-memory vector storage for demo
let documentStore = [];

export const vectorStore = {
  upsert: async (vectors) => {
    vectors.forEach(vector => {
      documentStore.push(vector);
    });
    console.log(`✅ Stored ${vectors.length} vectors. Total: ${documentStore.length}`);
    console.log(`📄 Sample text:`, vectors[0]?.metadata?.text?.substring(0, 100) + '...');
  },
  
  query: async ({ vector, topK = 3 }) => {
    console.log(`🔍 Querying ${documentStore.length} stored documents`);
    console.log(`🔍 Query vector length: ${vector.length}`);
    
    if (documentStore.length === 0) {
      console.log('⚠️ No documents in storage!');
      return { matches: [] };
    }
    
    // Simple cosine similarity
    const similarities = documentStore.map((doc, index) => {
      const score = cosineSimilarity(vector, doc.values);
      console.log(`📊 Doc ${index} similarity: ${score.toFixed(4)} - "${doc.metadata.text.substring(0, 50)}..."`);
      return {
        id: doc.id,
        score: score,
        metadata: doc.metadata
      };
    });
    
    // Sort by score and get top results
    const results = similarities
      .filter(s => s.score > 0.1) // Lower threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    console.log(`📊 After filtering, found ${results.length} matches above threshold`);
    console.log(`📊 Top scores:`, results.map(r => r.score.toFixed(4)));
    
    return { matches: results };
  },
  
  clear: () => {
    documentStore = [];
    console.log('🗑️ Storage cleared');
  }
};

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) {
    console.log('⚠️ Vector problem - a:', !!a, a?.length, 'b:', !!b, b?.length);
    return 0;
  }
  
  const dotProduct = a.reduce((sum, a_i, i) => sum + a_i * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, a_i) => sum + a_i * a_i, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, b_i) => sum + b_i * b_i, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    console.log('⚠️ Zero magnitude vectors');
    return 0;
  }
  
  const similarity = dotProduct / (magnitudeA * magnitudeB);
  return similarity;
}
