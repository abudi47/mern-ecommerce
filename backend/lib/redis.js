import { createClient } from "redis";
import 'dotenv/config';

const redisClient = createClient({
  url: process.env.UPSTASH_URI,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// Connect only once
await redisClient.connect();

export default redisClient;
