import path from "path";
import fs from "fs/promises";
import type {
    CacheOptions,
    ICacheManager,
    IDatabaseCacheAdapter,
    UUID,
} from "./types";

export interface ICacheAdapter {
    get(key: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
}

export class MemoryCacheAdapter implements ICacheAdapter {
    data: Map<string, string>;

    constructor(initalData?: Map<string, string>) {
        this.data = initalData ?? new Map<string, string>();
    }

    async get(key: string): Promise<string | undefined> {
        return this.data.get(key);
    }

    async set(key: string, value: string): Promise<void> {
        this.data.set(key, value);
    }

    async delete(key: string): Promise<void> {
        this.data.delete(key);
    }
}

export class FsCacheAdapter implements ICacheAdapter {
    constructor(private dataDir: string) {}

    async get(key: string): Promise<string | undefined> {
        try {
            return await fs.readFile(path.join(this.dataDir, key), "utf8");
        } catch {
            // console.error(error);
            return undefined;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            const filePath = path.join(this.dataDir, key);
            // Ensure the directory exists
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, value, "utf8");
        } catch (error) {
            console.error(error);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            const filePath = path.join(this.dataDir, key);
            await fs.unlink(filePath);
        } catch {
            // console.error(error);
        }
    }
}

export class DbCacheAdapter implements ICacheAdapter {
    constructor(
        private db: IDatabaseCacheAdapter,
        private agentId: UUID
    ) {}

    async get(key: string): Promise<string | undefined> {
        return this.db.getCache({ agentId: this.agentId, key });
    }

    async set(key: string, value: string): Promise<void> {
        await this.db.setCache({ agentId: this.agentId, key, value });
    }

    async delete(key: string): Promise<void> {
        await this.db.deleteCache({ agentId: this.agentId, key });
    }
}

export class CacheManager<CacheAdapter extends ICacheAdapter = ICacheAdapter>
    implements ICacheManager
{
    adapter: CacheAdapter;

    constructor(adapter: CacheAdapter) {
        this.adapter = adapter;
    }

    async get<T = unknown>(key: string): Promise<T | undefined> {
        const data = await this.adapter.get(key);

        if (data) {
            const { value, expires } = JSON.parse(data) as {
                value: T;
                expires: number;
            };

            if (!expires || expires > Date.now()) {
                return value;
            }

            this.adapter.delete(key).catch(() => {});
        }

        return undefined;
    }

    async getAndKeep<T = unknown>(key: string): Promise<T | undefined> {
        const data = await this.adapter.get(key);
        if (data) {
            const { value } = JSON.parse(data) as {
                value: T;
                expires: number;
            };
            return value;
        }
        return undefined;
    }

    async getAllMatching<T = unknown>(pattern: RegExp, mainCacheKey: string): Promise<T[]> {
        console.log("[getAllMatching] Fetching all cached data for key:", mainCacheKey);
    
        const rawData = await this.adapter.get(mainCacheKey); // Using the dynamic key
        if (!rawData) {
            console.log("[getAllMatching] No cached data found.");
            return [];
        }
    
        let parsedData;
        try {
            parsedData = JSON.parse(rawData) as { count: number; data: any[] };
            console.log("[getAllMatching] Parsed data:", parsedData);
        } catch (error) {
            console.error("[getAllMatching] Error parsing cached data:", error);
            return [];
        }
    
        if (!parsedData.data || !Array.isArray(parsedData.data)) {
            console.log("[getAllMatching] No valid data array found.");
            return [];
        }
    
        const matchedItems = parsedData.data.filter(item => pattern.test(item.key));
        console.log("[getAllMatching] Matched items:", matchedItems);
    
        const results = matchedItems.map(item => {
            try {
                const parsedValue = JSON.parse(item.value);
                console.log(`[getAllMatching] Parsed value for key ${item.key}:`, parsedValue);
                return parsedValue.value; // Extract actual stored value
            } catch (error) {
                console.error(`[getAllMatching] Error parsing value for key ${item.key}:`, error);
                return undefined;
            }
        }).filter(item => item !== undefined) as T[];
    
        console.log("[getAllMatching] Final filtered results:", results);
        return results;
    }
    

    async set<T>(key: string, value: T, opts?: CacheOptions): Promise<void> {

        return this.adapter.set(
            key,
            JSON.stringify({ value, expires: opts?.expires ?? 0 })
        );
    }

    async delete(key: string): Promise<void> {
        return this.adapter.delete(key);
    }
}
