import OpenAI from "openai";
import dotenv from "dotenv";


async function testOpenAI() {
  dotenv.config();
  console.debug(process.env.OPENAI_API_KEY);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required.');
  }
  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      instructions: 'Reply with a short greeting.',
      input: [{ role: 'user', content: 'Hello, OpenAI!' }],
    });
    console.log('OpenAI test response:', response.output?.[0]);
  } catch (error) {
    console.error('OpenAI API test failed:', error);
  }
}

await testOpenAI();
