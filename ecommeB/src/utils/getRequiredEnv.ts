/** @format */

// يُرجع النوع string دائمًا حسب التوقيع المُعلن، بغض النظر عن استخدامه داخل أي دالة أخرى.
// هذا يتفادى مشكلة أن TypeScript لا ينقل تضييق النوع (narrowing) عبر حدود الدوال.
export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};
