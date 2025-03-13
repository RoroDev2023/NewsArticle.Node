import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { Article } from './vectorDB';

dotenv.config();

// Initialize OpenAI API
const openaiApiKey = process.env.OPENAI_API_KEY as string;
const configuration = new Configuration({ apiKey: openaiApiKey });
const openai = new OpenAIApi(configuration);

// Create a custom Axios instance for OpenAI requests
const openaiAxios: AxiosInstance = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Authorization": `Bearer ${openaiApiKey}`,
    "Content-Type": "application/json"
  }
});

// Apply retry mechanism
axiosRetry(openaiAxios, {
  retries: 3, // Number of retry attempts
  retryDelay: (retryCount) => {
    console.warn(`Retrying OpenAI request... Attempt ${retryCount}`);
    return retryCount * 2000; // Exponential backoff (2s, 4s, 6s)
  },
  retryCondition: (error) => {
    // Only retry on 429 (Too Many Requests)
    return error.response?.status === 429;
  },
  shouldResetTimeout: true,
});

console.log("Axios instance configured with retry:", openaiAxios.defaults);

/**
 * Generates an answer using OpenAI's chat completion.
 */
export async function generateAnswer(query: string, articles: Article[]): Promise<string> {
  try {
    // Combine the content of retrieved articles to form context
    const context = articles.map(article => article.content).join("\n\n");
    const prompt = `Based on the following context, answer the query.\n\nContext:\n${context}\n\nQuery: ${query}`;

    console.log("Sending request to OpenAI with prompt:", prompt);

    // Send request using the custom Axios instance with retry logic
    const response = await openaiAxios.post("/chat/completions", {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful news assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    // Extract answer safely using optional chaining
    const answer = response.data.choices?.[0]?.message?.content?.trim() || "No answer generated.";

    console.log("OpenAI Response:", answer);
    return answer;

  } catch (error: any) {
    console.error("Error calling OpenAI API:", error?.response?.data || error.message);
    return "Sorry, an error occurred while fetching the answer.";
  }
}
