import axios from 'axios';
import cheerio from 'cheerio';
import { addArticle } from './vectorDB';

export async function processNewsLink(url: string) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    
    const title = $('title').text().trim() || 'Untitled';
    const bodyText = $('body').text().trim();
    const content = bodyText.slice(0, 1000); 
    const date = new Date().toISOString();

    const article = { title, content, url, date };

    console.log('Extracted article:', article);

    await addArticle(article);
  } catch (error) {
    console.error('Error processing news link:', url, error);
  }
}
