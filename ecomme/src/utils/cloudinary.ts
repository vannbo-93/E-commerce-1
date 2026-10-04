/** @format */

// يضيف تحويلات Cloudinary لرابط صورة: صيغة حديثة، وضغط تلقائي، وعرض أقصى.
// الروابط الأخرى (صور محلية أو من مصادر أخرى) تُعاد كما هي
export function optimizeImage(url: string | undefined, width = 600): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/"))
    return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
