import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  UserRound,
} from "lucide-react";

const statusConfig = {
  open: {
    en: "Open",
    ar: "مفتوح",
    className:
      "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-300",
    dotClass: "bg-blue-500",
  },
  in_progress: {
    en: "In Progress",
    ar: "قيد التنفيذ",
    className:
      "bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-500/10 dark:text-violet-300",
    dotClass: "bg-violet-500",
  },
  blocked: {
    en: "Blocked",
    ar: "متوقف",
    className:
      "bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-300",
    dotClass: "bg-rose-500",
  },
  done: {
    en: "Done",
    ar: "مكتمل",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
};

const priorityConfig = {
  low: {
    en: "Low",
    ar: "منخفضة",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  medium: {
    en: "Medium",
    ar: "متوسطة",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  high: {
    en: "High",
    ar: "عالية",
    className: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  },
};

const translations = {
  en: {
    request: "Request",
    status: "Status",
    priority: "Priority",
    owner: "Owner",
    created: "Created",
    updated: "Updated",
    openRequest: "Open",
  },
  ar: {
    request: "الطلب",
    status: "الحالة",
    priority: "الأولوية",
    owner: "المسؤول",
    created: "تاريخ الإنشاء",
    updated: "آخر تحديث",
    openRequest: "فتح الطلب",
  },
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(date, isArabic) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function SortButton({ label, column, sortBy, sortOrder, onSort }) {
  const isActive = sortBy === column;

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className="group inline-flex items-center gap-2 whitespace-nowrap text-start text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    >
      <span>{label}</span>

      {isActive ? (
        sortOrder === "asc" ? (
          <ArrowUp size={14} className="shrink-0 text-indigo-500" />
        ) : (
          <ArrowDown size={14} className="shrink-0 text-indigo-500" />
        )
      ) : (
        <ArrowUpDown
          size={14}
          className="shrink-0 text-slate-300 transition group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400"
        />
      )}
    </button>
  );
}

function RequestsTable({
  requests,
  sortBy,
  sortOrder,
  onSort,
  onStatusChange,
}) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const lang = isArabic ? "ar" : "en";
  const t = translations[lang];

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition duration-300 sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[900px] border-collapse sm:min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/40">
              <th className="px-3 py-4 text-start sm:px-5 lg:px-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.request}
                </span>
              </th>

              <th className="px-3 py-4 text-start sm:px-5 lg:px-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.status}
                </span>
              </th>

              <th className="px-3 py-4 text-start sm:px-5 lg:px-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.priority}
                </span>
              </th>

              <th className="px-3 py-4 text-start sm:px-5 lg:px-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.owner}
                </span>
              </th>

              <th className="px-3 py-4 text-start sm:px-5 lg:px-6">
                <SortButton
                  label={t.created}
                  column="createdAt"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="px-3 py-4 text-start sm:px-5 lg:px-6">
                <SortButton
                  label={t.updated}
                  column="updatedAt"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </th>

              <th className="w-12 px-3 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.map((request) => {
              const status = statusConfig[request.status] || statusConfig.open;

              const priority =
                priorityConfig[request.priority] || priorityConfig.low;

              return (
                <tr
                  key={request.id}
                  className="group transition duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  {/* REQUEST */}
                  <td className="px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                    <button
                      type="button"
                      onClick={() => navigate(`/requests/${request.id}`)}
                      className="flex min-w-0 max-w-full items-center gap-2 text-start sm:gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white shadow-sm transition duration-200 group-hover:scale-105 group-hover:shadow-indigo-500/20 sm:h-10 sm:w-10">
                        {request.id.replace("REQ-", "").slice(-2)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900 transition group-hover:text-indigo-600 sm:max-w-[240px] dark:text-white dark:group-hover:text-indigo-400">
                          {request.title}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-400 dark:text-slate-500">
                          {request.id}
                        </p>
                      </div>
                    </button>
                  </td>

                  {/* STATUS */}
                  <td className="px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                    <div className="relative w-fit">
                      <span
                        className={`pointer-events-none absolute start-3 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full ${status.dotClass}`}
                      />

                      <select
                        value={request.status}
                        onChange={(event) =>
                          onStatusChange(request.id, event.target.value)
                        }
                        aria-label={t.status}
                        className={`max-w-[150px] appearance-none rounded-full py-2 ps-8 pe-7 text-xs font-semibold ring-1 ring-inset outline-none transition focus:ring-2 focus:ring-indigo-500 sm:max-w-none ${status.className} dark:[color-scheme:dark]`}
                      >
                        {Object.entries(statusConfig).map(([value, config]) => (
                          <option
                            key={value}
                            value={value}
                            className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
                          >
                            {config[lang]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* PRIORITY */}
                  <td className="px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${priority.className}`}
                    >
                      {priority[lang]}
                    </span>
                  </td>

                  {/* OWNER */}
                  <td className="px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 ring-4 ring-indigo-50 sm:h-9 sm:w-9 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/5">
                        {getInitials(request.owner)}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[130px] truncate text-sm font-medium text-slate-700 sm:max-w-[180px] dark:text-slate-200">
                          {request.owner}
                        </p>

                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                          <UserRound size={11} className="shrink-0" />
                          <span>{t.owner}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CREATED */}
                  <td className="whitespace-nowrap px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-slate-400"
                      />
                      {formatDate(request.createdAt, isArabic)}
                    </div>
                  </td>

                  {/* UPDATED */}
                  <td className="whitespace-nowrap px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-slate-400"
                      />
                      {formatDate(request.updatedAt, isArabic)}
                    </div>
                  </td>

                  {/* OPEN DETAILS */}
                  <td className="px-3 py-4 sm:px-4 sm:py-5">
                    <button
                      type="button"
                      onClick={() => navigate(`/requests/${request.id}`)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition duration-200 hover:bg-indigo-50 hover:text-indigo-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                      aria-label={`${t.openRequest} ${request.title}`}
                    >
                      {isArabic ? (
                        <ChevronLeft size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestsTable;
