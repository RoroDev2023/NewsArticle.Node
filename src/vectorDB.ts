export interface Article {
    title: string;
    content: string;
    url: string;
    date: string;
  }
  
  let articles: Article[] = [];
  
  /**
   * Adds an article to the in-memory "vector database"
   */
  export async function addArticle(article: Article): Promise<void> {
    articles.push(article);
  }
  
  /**
   * Simulated similarity search.
   * In production, replace with a proper vector database search (e.g., Pinecone, FAISS, pgvector).
   */
  export async function searchArticles(query: string): Promise<Article[]> {
    return articles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase())
    );
  }
  