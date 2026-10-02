/** @format */
import { useState } from "react";

// ألوان الحروف الأولى: كل اسم يأخذ لونًا ثابتًا من القائمة،
// فيسهل التمييز بين المستخدمين بنظرة، ويبقى لون كل شخص نفسه في كل مكان
const PALETTE = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-indigo-100 text-indigo-700",
];

const colorFor = (name: string) => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
};

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

interface UserAvatarProps {
  name: string;
  src?: string | null | undefined;
  // القطر بالبكسل (شاملًا الإطار إن وُجد)
  size?: number;
  // حلقة بتدرج لوني حول الصورة، مع فاصل أبيض رفيع
  framed?: boolean;
  className?: string;
}

// سُمك الحلقة الملونة والفاصل الأبيض، بالبكسل
const RING = 3;
const GAP = 2;

const UserAvatar = ({
  name,
  src,
  size = 40,
  framed = false,
  className = "",
}: UserAvatarProps) => {
  // مع الإطار: الحجم الكلي يبقى size، والصورة تصغر داخله، فلا يتحرك شيء في التصميم
  if (framed) {
    const inner = size - 2 * (RING + GAP);
    return (
      <span
        style={{ width: size, height: size, padding: RING }}
        className={`inline-flex shrink-0 rounded-full bg-linear-to-tr from-sky-500 via-cyan-400 to-indigo-500 shadow-md ${className}`}>
        <span
          style={{ padding: GAP }}
          className="inline-flex h-full w-full rounded-full bg-white">
          <UserAvatar name={name} src={src} size={inner} />
        </span>
      </span>
    );
  }

  return <AvatarCore name={name} src={src} size={size} className={className} />;
};

const AvatarCore = ({
  name,
  src,
  size,
  className,
}: {
  name: string;
  src?: string | null | undefined;
  size: number;
  className: string;
}) => {
  // صورة لم تُحمَّل (رابط محلي قديم بعد النشر مثلًا): نعود للحروف الأولى
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  const style = {
    width: size,
    height: size,
    fontSize: Math.max(10, size * 0.38),
  };

  if (showImage) {
    return (
      <img
        src={src!}
        alt={name}
        loading="lazy"
        onError={() => setFailedSrc(src ?? null)}
        style={style}
        className={`shrink-0 rounded-full bg-gray-100 object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={style}
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-semibold ${colorFor(name)} ${className}`}>
      {initialsOf(name)}
    </span>
  );
};

export default UserAvatar;
