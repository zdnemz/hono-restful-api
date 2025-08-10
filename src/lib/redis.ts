import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient(): Redis {
    if (!redis) {
        redis = new Redis(process.env.REDIS_URL!, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        });

        redis.on("connect", () => {
            console.info("Redis connected");
        });

        redis.on("error", (err) => {
            console.error("Redis error:", err);
        });
    }

    return redis;
}
