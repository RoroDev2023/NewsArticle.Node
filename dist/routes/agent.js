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
const express_1 = require("express");
const vectorDB_1 = require("../vectorDB");
const llmService_1 = require("../llmService");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return;
    }
    try {
        // Retrieve relevant articles from our in-memory vector DB (simulate similarity search)
        const articles = yield (0, vectorDB_1.searchArticles)(query);
        // Generate answer using the LLM with the retrieved article context
        const answer = yield (0, llmService_1.generateAnswer)(query, articles);
        // Build sources array from articles
        const sources = articles.map(article => ({
            title: article.title,
            url: article.url,
            date: article.date
        }));
        res.json({ answer, sources });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
