/** @format */
import { useEffect, useState } from "react";
import {
  IconArchive,
  IconInbox,
  IconMail,
  IconMailOpened,
} from "@tabler/icons-react";
import api from "../../Api/baseURL";
import PaginationComponent from "../Utility/Pagination";
import { apiErrorMessage, formatDate } from "../User/orderUi";
import { notifyMessagesChanged } from "./adminEvents";

type MessageStatus = "new" | "read" | "archived";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

interface MessagesResponse {
  messages: ContactMessage[];
  total: number;
  page: number;
  pages: number;
  counts: Record<MessageStatus, number>;
}

const PAGE_SIZE = 20;

const TABS: { id: MessageStatus | ""; label: string }[] = [
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "archived", label: "Archived" },
  { id: "", label: "All" },
];

// رابط mailto: برنامج البريد يفتح رسالة جاهزة، والرد يبقى في صندوق "المرسل" كسجل
const buildReplyLink = (m: ContactMessage) => {
  const subject = `Re: ${m.subject || "Your message"}`;
  // روابط mailto الطويلة جدًا قد لا تفتح في بعض البرامج: نقتبس أول 1500 حرف فقط
  const quoted = m.message
    .slice(0, 1500)
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const body = `\n\n---\nOn ${formatDate(m.createdAt, true)}, ${m.name} wrote:\n${quoted}`;
  return `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const AdminMessages = () => {
  const [tab, setTab] = useState<MessageStatus | "">("new");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MessagesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  // يُعاد الجلب بزيادة هذا الرقم، بعد الأرشفة مثلًا
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- إظهار التحميل عند تغيّر التبويب أو الصفحة
    setLoading(true);
    setError("");

    const q = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    });
    if (tab) q.set("status", tab);

    api
      .get(`/contact/admin?${q.toString()}`)
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, page, reloadKey]);

  const selectTab = (next: MessageStatus | "") => {
    setTab(next);
    setPage(1);
    setOpenId(null);
  };

  // يحدّث الرسالة في القائمة المعروضة دون إعادة جلب:
  // رسالة تُفتح في تبويب "New" تبقى ظاهرة بدل أن تختفي فجأة
  const replaceLocal = (updated: ContactMessage) =>
    setData((prev) =>
      prev
        ? {
            ...prev,
            messages: prev.messages.map((m) =>
              m._id === updated._id ? updated : m,
            ),
          }
        : prev,
    );

  const setStatus = async (m: ContactMessage, status: MessageStatus) => {
    if (busyId) return;
    setBusyId(m._id);
    setActionError("");
    try {
      const res = await api.patch(`/contact/admin/${m._id}/status`, { status });
      const updated: ContactMessage = res.data.message;
      notifyMessagesChanged();

      // الأرشفة أو الإرجاع للوارد: الرسالة تنتقل لتبويب آخر، فنعيد الجلب
      if (status === "archived" || m.status === "archived") {
        setOpenId(null);
        setReloadKey((k) => k + 1);
      } else {
        replaceLocal(updated);
      }
    } catch (err) {
      setActionError(apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const toggleOpen = (m: ContactMessage) => {
    if (openId === m._id) {
      setOpenId(null);
      return;
    }
    setOpenId(m._id);
    // فتح رسالة جديدة يعلّمها كمقروءة
    if (m.status === "new") void setStatus(m, "read");
  };

  const counts = data?.counts;
  const allCount = counts ? counts.new + counts.read + counts.archived : null;

  const tabClass = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-sky-500 text-white"
        : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
    }`;

  const emptyText =
    tab === "new"
      ? "No new messages. You're all caught up!"
      : tab === "read"
        ? "No read messages."
        : tab === "archived"
          ? "No archived messages."
          : "No messages yet.";

  return (
    <div className="flex flex-col gap-4 py-3">
      <h2 className="text-lg font-bold text-gray-900">Support messages</h2>

      <nav
        aria-label="Filter messages"
        className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const count = t.id === "" ? allCount : counts?.[t.id];
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => selectTab(t.id)}
              aria-pressed={tab === t.id}
              className={tabClass(tab === t.id)}>
              {t.label}
              {count !== null && count !== undefined ? ` (${count})` : ""}
            </button>
          );
        })}
      </nav>

      {actionError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </p>
      )}

      {error ? (
        <p className="py-10 text-center text-sm text-red-600">{error}</p>
      ) : !data ? (
        <p className="py-10 text-center text-sm text-gray-500">
          Loading messages...
        </p>
      ) : data.messages.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-14 text-center 
        shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <IconInbox size={26} />
          </div>
          <p className="text-sm font-semibold text-gray-900">{emptyText}</p>
        </div>
      ) : (
        <ul
          className={`flex flex-col gap-2 transition-opacity ${loading ? "opacity-50" : ""}`}
          aria-busy={loading}>
          {data.messages.map((m) => {
            const isOpen = openId === m._id;
            const isNew = m.status === "new";
            const busy = busyId === m._id;
            return (
              <li
                key={m._id}
                className={`overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] ${
                  isNew ? "ring-1 ring-sky-200" : ""
                }`}>
                <button
                  type="button"
                  onClick={() => toggleOpen(m)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-3 p-4 text-left hover:bg-gray-50">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isNew ? "bg-sky-500" : "bg-transparent"}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span
                        className={`text-sm ${isNew ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {m.name}
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          {m.email}
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(m.createdAt, true)}
                      </span>
                    </span>
                    <span
                      className={`mt-0.5 block truncate text-sm ${isNew ? "font-medium text-gray-900" : "text-gray-600"}`}>
                      {m.subject || "(no subject)"}
                    </span>
                    {!isOpen && (
                      <span className="mt-0.5 block truncate text-xs text-gray-400">
                        {m.message}
                      </span>
                    )}
                  </span>
                  {m.status === "archived" && (
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      Archived
                    </span>
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3 sm:pl-9">
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700">
                      {m.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <a
                        href={buildReplyLink(m)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold 
                        text-white no-underline hover:bg-sky-600">
                        <IconMail size={16} />
                        Reply by email
                      </a>
                      {m.status === "archived" ? (
                        <button
                          type="button"
                          onClick={() => void setStatus(m, "read")}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm 
                          font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                          <IconInbox size={16} />
                          Move to inbox
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => void setStatus(m, "new")}
                            disabled={busy || m.status === "new"}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm 
                            font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                            <IconMailOpened size={16} />
                            Mark as unread
                          </button>
                          <button
                            type="button"
                            onClick={() => void setStatus(m, "archived")}
                            disabled={busy}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm 
                            font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                            <IconArchive size={16} />
                            Archive
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {data && data.pages > 1 && (
        <PaginationComponent
          count={data.pages}
          page={Math.min(page, data.pages)}
          onPageChange={(p) => {
            setPage(p);
            setOpenId(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
};

export default AdminMessages;
