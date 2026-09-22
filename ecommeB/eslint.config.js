/** @format */
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "build", "node_modules", "coverage"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,js}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node, // process, __dirname, require, module...
      },
    },
    rules: {
      // كشف المتغيرات غير المستخدمة (تجاهل التي تبدأ بـ _)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // تنبيه عند استخدام any بدل تحديد النوع
      "@typescript-eslint/no-explicit-any": "warn",

      // إجبار استخدام === بدل ==
      eqeqeq: ["error", "always"],

      // السماح بـ console (مفيد للـ logging في الباك إند) لكن تحذير عند console.log فقط
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // منع debugger في الكود النهائي
      "no-debugger": "error",

      // منع imports مكررة
      "no-duplicate-imports": "error",

      // إجبار وجود أقواس {} حتى للجمل القصيرة
      curly: ["warn", "multi-line"],

      // كشف الـ async functions التي لا تحتوي على await (غالبًا خطأ منطقي)
      "@typescript-eslint/require-await": "warn",

      // تنبيه عند عدم التعامل مع Promise (شائع جدًا في الباك إند - سبب رئيسي للأخطاء الصامتة)
      "@typescript-eslint/no-floating-promises": "warn",

      // منع return await غير الضروري إلا داخل try/catch
      "no-return-await": "off",
      "@typescript-eslint/return-await": ["warn", "in-try-catch"],

      // تحذير عند وجود متغيرات shadow (تعريف متغير بنفس اسم متغير خارجي)
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "warn",
    },
  },
);
