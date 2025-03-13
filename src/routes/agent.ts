import { Router, Request, Response } from 'express';
import { searchArticles } from '../vectorDB';
import { generateAnswer } from '../llmService';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }
  try {
    // Retrieve relevant articles from our in-memory vector DB (simulate similarity search)
    const articles = await searchArticles(query);
    
    // Generate answer using the LLM with the retrieved article context
    const answer = await generateAnswer(query, articles);

    // Build sources array from articles
    const sources = articles.map(article => ({
      title: article.title,
      url: article.url,
      date: article.date
    }));

    res.json({ answer, sources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
