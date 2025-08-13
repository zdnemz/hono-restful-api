import { getRedisClient } from "@/lib/redis";

export default class Session {
    private static readonly TTL_SECONDS = 604_800 //7 days

    private static getSessionKey(user_id: string): { setKey: string }
    private static getSessionKey(user_id: string, session_id: string): { key: string; setKey: string }

    private static getSessionKey(user_id: string, session_id?: string) {
        if (!session_id) {
            return {
                setKey: `refresh_tokens_set:${user_id}`,
            }
        }
        return {
            key: `refresh_token:${user_id}:${session_id}`,
            setKey: `refresh_tokens_set:${user_id}`,
        }
    }


    public static async save(user_id: string, session_id: string, refresh_token: string) {

        const { key, setKey } = this.getSessionKey(user_id, session_id)

        const redis = getRedisClient()
        const pipeline = redis.pipeline()

        pipeline.set(key, refresh_token, "EX", this.TTL_SECONDS)
        pipeline.sadd(setKey, session_id)

        pipeline.expire(setKey, this.TTL_SECONDS + 3600)

        await pipeline.exec()
    }

    public static async get(user_id: string, session_id: string) {
        const { key } = this.getSessionKey(user_id, session_id);

        const redis = getRedisClient()

        const refresh_token = await redis.get(key)
        if (!refresh_token) return null

        return { refresh_token }
    }

    public static async delete(user_id: string, session_id: string) {
        const { key, setKey } = this.getSessionKey(user_id, session_id)

        const redis = getRedisClient()
        const pipeline = redis.pipeline()

        pipeline.del(key)
        pipeline.srem(setKey, session_id)

        await pipeline.exec()
    }

    public static async getAll(user_id: string) {
        const { setKey } = this.getSessionKey(user_id)

        const redis = getRedisClient()

        const session_ids = await redis.smembers(setKey)
        if (session_ids.length <= 0) return []

        const pipeline = redis.pipeline()

        session_ids.forEach((session_id) => {
            const { key } = this.getSessionKey(user_id, session_id)

            pipeline.get(key)
        })

        const results = await pipeline.exec()
        if (!results) return []

        return session_ids.map((sessionId, i) => {
            const token = results[i]?.[1] ?? null;
            return { sessionId, refreshToken: token };
        });
    }

}