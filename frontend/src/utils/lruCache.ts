// LRU (Least Recently Used) Cache Implementation
// Enforces a maximum of 15 items and a 30-minute Time-To-Live (TTL)
// Automatically evicts the least recently used item when capacity is reached.
// Cleared immediately when a user persona session ends or logs out.

export interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: number;
  lastAccessed: number;
}

export interface LRUCacheOptions {
  maxItems?: number;      // Maximum items to keep in cache (default: 15)
  ttlMinutes?: number;    // Time-To-Live in minutes (default: 30)
}

export class LRUCache<T = any> {
  private maxItems: number;
  private ttlMs: number;
  private cache: Map<string, CacheEntry<T>>;
  private hits: number = 0;
  private misses: number = 0;

  constructor(options: LRUCacheOptions = {}) {
    this.maxItems = options.maxItems ?? 15;
    this.ttlMs = (options.ttlMinutes ?? 30) * 60 * 1000;
    this.cache = new Map();
  }

  /**
   * Retrieve an item from the cache.
   * If found and unexpired, promotes it to Most Recently Used (MRU).
   * If expired, removes it and returns null.
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check expiration (30-minute TTL)
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Refresh LRU recency: delete and re-insert at end of Map (MRU)
    this.cache.delete(key);
    entry.lastAccessed = Date.now();
    this.cache.set(key, entry);
    this.hits++;

    return entry.value;
  }

  /**
   * Store an item in the cache.
   * If capacity (15) is exceeded, the Least Recently Used (oldest unaccessed) item is evicted.
   */
  set(key: string, value: T, customTtlMs?: number): void {
    // If key exists, delete first to reinsert as MRU
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxItems) {
      // Evict Least Recently Used (first key in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    const ttl = customTtlMs !== undefined ? customTtlMs : this.ttlMs;
    const now = Date.now();
    this.cache.set(key, {
      key,
      value,
      expiresAt: now + ttl,
      lastAccessed: now,
    });
  }

  /**
   * Check if a key exists and has not expired.
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific key from the cache.
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Invalidate all keys matching a prefix or pattern (e.g. 'GET:/events').
   */
  invalidatePattern(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Completely clear and purge all items from the cache.
   * Called automatically when user persona session ends or logs out.
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Current number of stored items.
   */
  size(): number {
    this.purgeExpired();
    return this.cache.size;
  }

  /**
   * Diagnostic statistics for monitoring.
   */
  stats() {
    this.purgeExpired();
    return {
      size: this.cache.size,
      maxItems: this.maxItems,
      ttlMinutes: this.ttlMs / (60 * 1000),
      hits: this.hits,
      misses: this.misses,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Remove any expired keys.
   */
  private purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Global Singleton Application Cache (Max 15 items, 30 minutes TTL)
export const appCache = new LRUCache({ maxItems: 15, ttlMinutes: 30 });
