import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

async function callGemini(apiKey: string, prompt: string): Promise<GenerateContentResponse> {
  const genAI = new GoogleGenAI({ apiKey });
  return genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
}

function cleanResponse(text: string, lang: string = ''): string {
  let cleaned = text.trim();
  const startFence = '```' + lang;
  if (cleaned.startsWith('```') && cleaned.includes('\n')) {
      cleaned = cleaned.substring(cleaned.indexOf('\n') + 1);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on the server.' });
  }

  const { action, payload } = req.body;
  if (!action || !payload) {
    return res.status(400).json({ error: 'Missing action or payload in request body' });
  }

  try {
    let prompt = '';
    let responseText = '';

    if (action === 'generateMongo') {
      const { userPrompt } = payload;
      prompt = `You are an expert MongoDB developer. Given the following natural language request, generate a full, executable MongoDB shell command.
- The output must be a single line of code.
- Do not include any explanations, markdown backticks, or anything other than the command itself.
- Assume the database context is already set.

Request: "${userPrompt}"

MongoDB Shell Command:`;
      const apiResponse = await callGemini(apiKey, prompt);
      responseText = cleanResponse(apiResponse.text);

    } else if (action === 'formatSql') {
      const { sql } = payload;
       prompt = `You are an expert SQL developer. Given the following SQL code, format it according to standard best practices (e.g., consistent indentation, capitalization of keywords).
- The output must be only the formatted SQL code.
- Do not include any explanations, markdown backticks, or anything other than the SQL code itself.

SQL to format:
\`\`\`sql
${sql}
\`\`\`

Formatted SQL:`;
      const apiResponse = await callGemini(apiKey, prompt);
      responseText = cleanResponse(apiResponse.text, 'sql');
    } else {
      return res.status(400).json({ error: `Invalid action: ${action}` });
    }

    res.status(200).json({ text: responseText });

  } catch (error) {
    console.error(`Error in action "${action}" for Gemini API:`, error);
    res.status(500).json({ error: 'Failed to generate content from Gemini API.' });
  }
}
