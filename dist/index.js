"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const agent_1 = __importDefault(require("./routes/agent"));
const kafkaConsumer_1 = require("./kafkaConsumer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use('/agent', agent_1.default);
app.get('/', (req, res) => {
    res.send('News Article Agent is running!');
});
// Start Kafka consumer (optional, if you set it up)
(0, kafkaConsumer_1.runConsumer)().catch(console.error);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
