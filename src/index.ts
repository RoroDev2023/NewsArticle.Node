import express from 'express';
import bodyParser from 'body-parser';
import agentRouter from './routes/agent';
import { runConsumer } from './kafkaConsumer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/agent', agentRouter);

app.get('/', (req, res) => {
  res.send('News Article Agent is running!');
});

// Start Kafka consumer (optional, if you set it up)
runConsumer().catch(console.error);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
