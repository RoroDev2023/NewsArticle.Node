export interface Article {
    title: string;
    content: string;
    url: string;
    date: string;
  }
  
  let articles: Article[] = [];
  

  export async function addArticle(article: Article): Promise<void> {
    articles.push(article);
  }
  
  export async function searchArticles(query: string): Promise<Article[]> {
    return articles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase())
    );
  }
  