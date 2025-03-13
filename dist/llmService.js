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
exports.generateAnswer = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize OpenAI API
const openaiApiKey = process.env.OPENAI_API_KEY;
const configuration = new openai_1.Configuration({ apiKey: openaiApiKey });
const openai = new openai_1.OpenAIApi(configuration);
// Create a custom Axios instance for OpenAI requests
const openaiAxios = axios_1.default.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json"
    }
});
// Apply retry mechanism
(0, axios_retry_1.default)(openaiAxios, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.warn(`Retrying OpenAI request... Attempt ${retryCount}`);
        return retryCount * 2000; // Exponential backoff (2s, 4s, 6s)
    },
    retryCondition: (error) => {
        var _a;
        // Only retry on 429 (Too Many Requests)
        return ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 429;
    },
    shouldResetTimeout: true,
});
console.log("Axios instance configured with retry:", openaiAxios.defaults);
/**
 * Generates an answer using OpenAI's chat completion.
 */
function generateAnswer(query, articles) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Combine the content of retrieved articles to form context
            const context = articles.map(article => article.content).join("\n\n");
            const prompt = `Based on the following context, answer the query.\n\nContext:\n${context}\n\nQuery: ${query}`;
            console.log("Sending request to OpenAI with prompt:", prompt);
            // Send request using the custom Axios instance with retry logic
            const response = yield openaiAxios.post("/chat/completions", {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful news assistant.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.7
            });
            // Extract answer safely using optional chaining
            const answer = ((_d = (_c = (_b = (_a = response.data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim()) || "No answer generated.";
            console.log("OpenAI Response:", answer);
            return answer;
        }
        catch (error) {
            console.error("Error calling OpenAI API:", ((_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) || error.message);
            return "Sorry, an error occurred while fetching the answer.";
        }
    });
}
exports.generateAnswer = generateAnswer;
