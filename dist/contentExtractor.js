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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processNewsLink = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const vectorDB_1 = require("./vectorDB");
function processNewsLink(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            const html = response.data;
            const $ = cheerio_1.default.load(html);
            // Basic extraction (adjust selectors based on site structure)
            const title = $('title').text().trim() || 'Untitled';
            const bodyText = $('body').text().trim();
            const content = bodyText.slice(0, 1000); // Extract a snippet (for demo)
            const date = new Date().toISOString(); // Placeholder date; ideally parse from metadata
            const article = { title, content, url, date };
            console.log('Extracted article:', article);
            // Save the article in the vector DB (in-memory simulation)
            yield (0, vectorDB_1.addArticle)(article);
        }
        catch (error) {
            console.error('Error processing news link:', url, error);
        }
    });
}
exports.processNewsLink = processNewsLink;
