/** @format */

// حدث بسيط بين المكوّنات: صفحة الرسائل تطلقه عند تغيير حالة رسالة،
// والقائمة الجانبية تستمع له لتحدّث عدد غير المقروء فورًا
export const ADMIN_MESSAGES_CHANGED = "admin:messages-changed";

export const notifyMessagesChanged = () =>
  window.dispatchEvent(new Event(ADMIN_MESSAGES_CHANGED));
