"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchArticles = exports.addArticle = void 0;
let articles = [];
/**
 * Adds an article to the in-memory "vector database"
 */
function addArticle(article) {
    return __awaiter(this, void 0, void 0, function* () {
        articles.push(article);
    });
}
exports.addArticle = addArticle;
/**
 * Simulated similarity search.
 * In production, replace with a proper vector database search (e.g., Pinecone, FAISS, pgvector).
 */
function searchArticles(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return articles.filter(article => article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()));
    });
}
exports.searchArticles = searchArticles;
