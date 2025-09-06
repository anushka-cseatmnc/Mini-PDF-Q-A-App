// Mock OpenAI that works 100%
export const openai = {
  embeddings: {
    create: async ({ input }) => {
      console.log('Creating embedding for:', input.substring(0, 50) + '...');
      return {
        data: [{
          embedding: Array.from({length: 1536}, () => Math.random() - 0.5)
        }]
      };
    }
  },
  chat: {
    completions: {
      create: async ({ messages }) => {
        const question = messages[messages.length - 1].content;
        console.log('Answering question:', question);
        return {
          choices: [{
            message: {
              content: `Based on the uploaded PDF content, here's what I found: This is a demo response for "${question.split('Question: ')[1] || question}". The system is working correctly with vector search and retrieval.`
            }
          }]
        };
      }
    }
  }
};
