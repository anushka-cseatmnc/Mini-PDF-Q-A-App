'use client';
import { useState } from 'react';

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    console.log('=== STARTING UPLOAD ===');

    const formData = new FormData(e.target);
    console.log('FormData created, file:', formData.get('pdf')?.name);

    try {
      console.log('Sending request to /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      if (result.success) {
        setUploaded(true);
        alert(`✅ ${result.message}`);
      } else {
        alert('❌ Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAsking(true);
    console.log('=== ASKING QUESTION ===');
    console.log('Question:', question);

    try {
      console.log('Sending request to /api/chat');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      if (result.answer) {
        setAnswers([{
          question: question.trim(),
          answer: result.answer,
          sources: result.sources || 0
        }, ...answers]);
        setQuestion('');
      } else {
        alert('❌ Error: ' + (result.error || 'No answer received'));
      }
    } catch (error) {
      console.error('Question error:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setAsking(false);
    }
  };

  const testAPI = async () => {
    console.log('=== TESTING API ===');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'test' })
      });
      const result = await response.json();
      console.log('Test result:', result);
      alert('API Test: ' + JSON.stringify(result));
    } catch (error) {
      console.error('Test error:', error);
      alert('API Test Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">📄 PDF Q&A App</h1>

        {/* Debug Button */}
        <div className="text-center mb-4">
          <button 
            onClick={testAPI}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            🔧 Test API
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">1. Upload PDF</h2>
              <form onSubmit={handleUpload}>
                <input
                  type="file"
                  name="pdf"
                  accept=".pdf"
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                />
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {uploading ? 'Processing...' : 'Upload PDF'}
                </button>
              </form>
            </div>

            {uploaded && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">2. Ask Question</h2>
                <form onSubmit={handleQuestion}>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What is this document about?"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                    rows="3"
                  />
                  <button
                    type="submit"
                    disabled={asking || !question.trim()}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {asking ? 'Thinking...' : 'Ask Question'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">3. Answers</h2>
            {answers.length === 0 ? (
              <p className="text-gray-500">Upload a PDF and ask questions to see answers here.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {answers.map((qa, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="mb-2">
                      <strong className="text-blue-600">Q:</strong> {qa.question}
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <strong className="text-green-600">A:</strong> {qa.answer}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Sources: {qa.sources}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className={`inline-block px-4 py-2 rounded ${uploaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {uploaded ? '✅ Ready for questions' : '⏳ Upload a PDF to start'}
          </div>
        </div>
      </div>
    </div>
  );
}
