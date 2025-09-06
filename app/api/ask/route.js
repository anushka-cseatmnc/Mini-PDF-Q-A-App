export async function POST(request) {
  const { question } = await request.json()
  
  // Get question embedding
  const questionEmbedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: question
  })
  
  // Search similar chunks
  const results = await pinecone.query({
    vector: questionEmbedding.data[0].embedding,
    topK: 3,
    includeMetadata: true
  })
  
  // Create context from results
  const context = results.matches.map(match => match.metadata.text).join('\n')
  
  // Generate answer
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Answer based on the context provided" },
      { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` }
    ]
  })
  
  return NextResponse.json({ answer: response.choices[0].message.content })
}