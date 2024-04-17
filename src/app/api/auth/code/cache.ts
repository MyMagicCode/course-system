const cache = new Map<string, { createdAt: number; value: string }>();

// 缓存的时间(毫秒)
const CACHE_TIME = 60 * 1000;

/**
 * 添加缓存
 */
export function addCodeCache(key: string, value: string) {
  cache.set(key, {
    createdAt: +new Date(),
    value,
  });
  const now = +new Date();
  cache.forEach((val, k) => {
    if (now - val.createdAt > CACHE_TIME) {
      cache.delete(k);
    }
  });
}

/**
 * 校验是否缓存是否正确
 */
export function validateCodeCache(key: string, value: string) {
  if (cache.has(key)) {
    const now = +new Date();
    const item = cache.get(key)!;
    return now - item.createdAt <= CACHE_TIME && item.value === value;
  } else {
    return false;
  }
}
