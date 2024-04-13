import { createClient } from "redis";

const redisClient = createClient();
redisClient.on("error", (err: Error) => console.log("Redis Client Error", err));

export default redisClient;
