# News Article Agent

## Overview
This application is a Node.js-based query-response system that uses Kafka for real-time ingestion of news article links. It extracts and cleans article content, stores data in a vector database (simulated in-memory for now), and uses a large language model (LLM) to answer user queries. This forms a Retrieval-Augmented Generation (RAG) system.

## Features
- **Data Ingestion:** Kafka consumer that processes news article links as they arrive.
- **Content Extraction:** Uses Axios and Cheerio to fetch and parse HTML content.
- **Vector Database:** Simulated in-memory storage for article data (replaceable with Pinecone, FAISS, pgvector, etc.).
- **LLM Integration:** Uses OpenAI's API to generate answers based on retrieved article context.
- **Query-Response API:** A POST `/agent` endpoint that accepts queries and returns answers along with source articles.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Kafka broker access with the provided credentials
- An OpenAI API key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/news-article-agent.git
   cd news-article-agent
# NewsArticle.Node
