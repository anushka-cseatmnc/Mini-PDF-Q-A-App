import { NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import { openai } from '../../../lib/openai.js'
import { vectorStore } from '../../../lib/chroma.js'

function chunkText(text, chunkSize = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function POST(request) {
  console.log('Upload route called');
  
  try {
    const formData = await request.formData()
    const file = formData.get('pdf')
    
    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 })
    }

    console.log('File received:', file.name, file.size);
    
    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfData = await pdf(buffer)
    
    console.log('PDF extracted, text length:', pdfData.text.length);
    
    // Chunk the text
    const chunks = chunkText(pdfData.text, 500)
    console.log('Created chunks:', chunks.length);
    
    // Process first 3 chunks only for speed
    const limitedChunks = chunks.slice(0, 3);
    
    for (let i = 0; i < limitedChunks.length; i++) {
      console.log(`Processing chunk ${i + 1}/${limitedChunks.length}`);
      
      const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: limitedChunks[i]
      })
      
      await vectorStore.upsert([{
        id: `chunk-${Date.now()}-${i}`,
        values: embedding.data[0].embedding,
        metadata: { text: limitedChunks[i] }
      }])
      
      console.log(`Chunk ${i + 1} processed successfully`);
    }
    
    console.log('All chunks processed successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: `Processed ${limitedChunks.length} chunks from PDF`,
      totalChunks: chunks.length,
      processedChunks: limitedChunks.length
    })
    
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json({ 
      error: `Upload failed: ${error.message}`,
      details: error.name
    }, { status: 500 })
  }
}



