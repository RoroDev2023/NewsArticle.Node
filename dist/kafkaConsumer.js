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
exports.runConsumer = void 0;
const kafkajs_1 = require("kafkajs");
const contentExtractor_1 = require("./contentExtractor");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const kafka = new kafkajs_1.Kafka({
    clientId: 'news-article-agent',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD
    }
});
const topic = process.env.KAFKA_TOPIC_NAME || 'news';
const groupId = process.env.KAFKA_GROUP_ID_PREFIX ? process.env.KAFKA_GROUP_ID_PREFIX + 'group' : 'news-agent-group';
function runConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId });
        yield consumer.connect();
        yield consumer.subscribe({ topic, fromBeginning: true });
        yield consumer.run({
            eachMessage: ({ message }) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const newsLink = (_a = message.value) === null || _a === void 0 ? void 0 : _a.toString();
                if (newsLink) {
                    console.log(`Received news link: ${newsLink}`);
                    // Process the news link: fetch, extract, and store article data
                    yield (0, contentExtractor_1.processNewsLink)(newsLink);
                }
            })
        });
    });
}
exports.runConsumer = runConsumer;
