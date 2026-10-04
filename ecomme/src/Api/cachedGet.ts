/** @format */

import api from "./baseURL"; // عدّل المسار ليطابق مكان نسخة axios عندك

// التصنيفات والماركات نادرًا ما تتغير: نجلبها مرة ونعيد استخدامها 5 دقائق.
// إذا طلبها مكوّنان في نفس اللحظة، يُرسل طلب واحد ويتشاركان نتيجته.
const TTL = 5 * 60 * 1000;
const cache = new Map<string, { promise: Promise<unknown>; time: number }>();

export function cachedGet<T>(url: string): Promise<T> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.time < TTL) return hit.promise as Promise<T>;

  const promise = api.get<T>(url).then((res) => res.data);
  promise.catch(() => cache.delete(url)); // لا نخزّن الفشل: المحاولة التالية تعيد الطلب
  cache.set(url, { promise, time: Date.now() });
  return promise;
}

export function invalidateCache(url: string) {
  cache.delete(url);
}
