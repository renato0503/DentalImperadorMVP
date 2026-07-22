import { Injectable, Logger } from "@nestjs/common";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private store = new Map<string, CacheEntry<unknown>>();
  private hits = 0;
  private misses = 0;

  private get enabled(): boolean {
    return process.env.REDIS_URL ? true : false;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled) {
      this.misses++;
      return null;
    }

    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    this.logger.debug(`Cache HIT: ${key} (taxa: ${this.hitRate}%)`);
    return entry.data as T;
  }

  async set<T>(key: string, data: T, ttlSeconds = 3600): Promise<void> {
    if (!this.enabled) return;

    this.store.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    });
    this.logger.debug(`Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
  }

  async invalidate(key: string): Promise<void> {
    this.store.delete(key);
    this.logger.debug(`Cache INVALIDATE: ${key}`);
  }

  async clear(): Promise<void> {
    this.store.clear();
    this.logger.log("Cache limpo");
  }

  get stats() {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hitRate,
      enabled: this.enabled,
    };
  }

  private get hitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? Math.round((this.hits / total) * 100) : 0;
  }
}
