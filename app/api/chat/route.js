import { NextResponse } from 'next/server'

// Use absolute imports to avoid path issues
const openai = {
  embeddings: {
    create: async ({ input }) => ({
      data: [{ embedding: Array.from({length: 1536}, () => Math.random() - 0.5) }]
    })
  },
  chat: {
    completions: {
      create: async ({ messages }) => ({
        choices: [{ message: { content: `Mock answer for: ${messages[messages.length-1].content}` } }]
      })
    }
  }
};

// Import the vectorStore directly
import('../../../lib/chroma.js').then(module => {
  console.log('VectorStore imported:', !!module.vectorStore);
});

let vectorStore;
try {
  const module = await import('../../../lib/chroma.js');
  vectorStore = module.vectorStore;
} catch (error) {
  console.log('Import error, using fallback');
  vectorStore = { query: async () => ({ matches: [] }) };
}

export async function POST(request) {
  console.log('=== CHAT ROUTE CALLED ===');
  
  try {
    const { question } = await request.json();
    console.log('Question:', question);
    
    // Mock response for now
    return NextResponse.json({
      answer: `Mock answer: Based on the PDF, here's what I found about "${question}". This is working!`,
      sources: 1
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
