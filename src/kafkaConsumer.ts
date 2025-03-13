import { Kafka } from 'kafkajs';
import { processNewsLink } from './contentExtractor';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: 'news-article-agent',
  brokers: [process.env.KAFKA_BROKER as string],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME as string,
    password: process.env.KAFKA_PASSWORD as string
  }
});

const topic = process.env.KAFKA_TOPIC_NAME || 'news';
const groupId = process.env.KAFKA_GROUP_ID_PREFIX ? process.env.KAFKA_GROUP_ID_PREFIX + 'group' : 'news-agent-group';

export async function runConsumer() {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ message }) => {
      const newsLink = message.value?.toString();
      if (newsLink) {
        console.log(`Received news link: ${newsLink}`);
        await processNewsLink(newsLink);
      }
    }
  });
}
