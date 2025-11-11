import NodeCache from 'node-cache';
import { CacheEntry } from '@/types';

class CacheManager {
  private cache: NodeCache;
  private defaultTTL: number;

  constructor(ttl: number = 120) {
    this.cache = new NodeCache();
    this.defaultTTL = ttl;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expirationTime = ttl || this.defaultTTL;
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (expirationTime * 1000)
    };
    this.cache.set(key, cacheEntry, expirationTime);
  }

  get<T>(key: string): T | null {
    const cacheEntry = this.cache.get<CacheEntry<T>>(key);
    if (!cacheEntry) return null;

    if (Date.now() > cacheEntry.expiresAt) {
      this.cache.del(key);
      return null;
    }

    return cacheEntry.data;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  del(key: string): void {
    this.cache.del(key);
  }

  clear(): void {
    this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }
}

export const cacheManager = new CacheManager(
  parseInt(process.env.CACHE_DURATION_SECONDS || '120')
);