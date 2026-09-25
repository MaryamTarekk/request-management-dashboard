import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle2,
  CircleDot,
  AlertCircle,
  Clock3,
  X,
  Sparkles,
} from "lucide-react";

import { useRequests } from "../hooks/useRequests";
import RequestsTable from "../components/RequestsTable";
import { useUpdateRequest } from "../hooks/useUpdateRequest";

function RequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const owner = searchParams.get("owner") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const page = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(search);
  const [refreshCountdown, setRefreshCountdown] = useState(15);

  const pageSize = 10;

  const {
    data: requests,
    isLoading,
    isError,
    error,
    isFetching,
  } = useRequests();

  const updateRequestMutation = useUpdateRequest();

  // Search debounce
  useEffect(() => {
    if (searchInput === search) return;

    const timer = setTimeout(() => {
      setSearchParams((currentParams) => {
        const newParams = new URLSearchParams(currentParams);

        if (searchInput) {
          newParams.set("search", searchInput);
        } else {
          newParams.delete("search");
        }

        newParams.delete("page");
        return newParams;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, search, setSearchParams]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Refresh countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCountdown((current) => (current <= 1 ? 15 : current - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFetching) {
      setRefreshCountdown(15);
    }
  }, [isFetching]);

  // Update URL params
  const updateParam = (key, value) => {
    setSearchParams((currentParams) => {
      const newParams = new URLSearchParams(currentParams);

      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }

      newParams.delete("page");
      return newParams;
    });
  };

  // Filter
  const filteredRequests = useMemo(() => {
    return (requests || []).filter((request) => {
      const matchesSearch =
        !search || request.title.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !status || request.status === status;
      const matchesPriority = !priority || request.priority === priority;
      const matchesOwner = !owner || request.owner === owner;

      return matchesSearch && matchesStatus && matchesPriority && matchesOwner;
    });
  }, [requests, search, status, priority, owner]);

  // Sort
  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      if (!sortBy) return 0;

      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [filteredRequests, sortBy, sortOrder]);

  // Owners
  const owners = useMemo(() => {
    return [...new Set((requests || []).map((request) => request.owner))];
  }, [requests]);

  // Statistics
  const statistics = useMemo(() => {
    const allRequests = requests || [];

    return {
      total: allRequests.length,
      open: allRequests.filter((r) => r.status === "open").length,
      inProgress: allRequests.filter((r) => r.status === "in_progress").length,
      blocked: allRequests.filter((r) => r.status === "blocked").length,
      done: allRequests.filter((r) => r.status === "done").length,
    };
  }, [requests]);

  // Last updated
  const lastUpdated = useMemo(() => {
    if (!requests?.length) return null;

    return requests.reduce((latest, request) => {
      if (!latest) return request.updatedAt;

      return new Date(request.updatedAt) > new Date(latest)
        ? request.updatedAt
        : latest;
    }, null);
  }, [requests]);

  // Pagination
  const totalRequests = sortedRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalRequests / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedRequests = sortedRequests.slice(startIndex, endIndex);

  const handleSort = (field) => {
    setSearchParams((currentParams) => {
      const newParams = new URLSearchParams(currentParams);
      const currentSortBy = newParams.get("sortBy");
      const currentSortOrder = newParams.get("sortOrder");

      if (currentSortBy === field) {
        newParams.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
      } else {
        newParams.set("sortBy", field);
        newParams.set("sortOrder", "asc");
      }

      newParams.delete("page");
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((currentParams) => {
      const newParams = new URLSearchParams(currentParams);
      newParams.set("page", String(newPage));
      return newParams;
    });
  };

  const handleStatusChange = (id, newStatus) => {
    updateRequestMutation.mutate({
      id,
      data: { status: newStatus },
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(search || status || priority || owner);

  // Loading
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-3 py-5 transition-colors duration-300 sm:px-6 sm:py-8 lg:px-10 dark:bg-[#0b1120]">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-5 sm:space-y-8">
            <div className="h-9 w-48 max-w-full rounded-xl bg-slate-200 sm:h-10 sm:w-64 dark:bg-slate-800" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-2xl bg-white shadow-sm sm:h-32 dark:bg-slate-900"
                />
              ))}
            </div>

            <div className="h-20 rounded-2xl bg-white shadow-sm dark:bg-slate-900" />
            <div className="h-[350px] rounded-2xl bg-white shadow-sm sm:h-[500px] dark:bg-slate-900" />
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50 px-3 py-5 transition-colors duration-300 sm:px-6 sm:py-8 lg:px-10 dark:bg-[#0b1120]">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-10 dark:border-red-900/50 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 sm:h-14 sm:w-14 sm:rounded-2xl dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle size={24} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900 sm:mt-5 sm:text-xl dark:text-white">
              {t("failedToLoad", "Failed to load requests")}
            </h2>

            <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400">
              {error?.message ||
                t(
                  "loadingError",
                  "Something went wrong while loading your requests.",
                )}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Main UI
  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-5 transition-colors duration-300 sm:px-6 sm:py-8 lg:px-10 lg:py-10 dark:bg-[#0b1120]"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  {t("liveSync", "Live sync")}
                </span>

                {isFetching && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <RefreshCw size={13} className="animate-spin" />
                    {t("updating", "Updating...")}
                  </span>
                )}
              </div>

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 sm:h-12 sm:w-12 sm:rounded-2xl">
                  <Sparkles size={20} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {t("requestsTitle", "Requests")}
                  </h1>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6 dark:text-slate-400">
                    {t(
                      "requestsDescription",
                      "Manage, track and organize your requests in one place.",
                    )}
                  </p>
                </div>
              </div>
            </div>

            {lastUpdated && (
              <div className="text-start text-xs sm:text-end">
                <p className="font-medium text-slate-400">
                  {t("lastUpdated", "Last updated")}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(lastUpdated).toLocaleTimeString(
                    isArabic ? "ar-EG" : "en-US",
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {[
            {
              label: t("totalRequests", "Total Requests"),
              value: statistics.total,
              icon: CircleDot,
              description: null,
            },
            {
              label: t("open", "Open"),
              value: statistics.open,
              icon: Clock3,
              description: t("waitingToProcess", "Waiting to be processed"),
            },
            {
              label: t("inProgress", "In Progress"),
              value: statistics.inProgress,
              icon: RefreshCw,
              description: t("currentlyHandled", "Currently being handled"),
            },
            {
              label: t("completed", "Completed"),
              value: statistics.done,
              icon: CheckCircle2,
              description: t("successfullyCompleted", "Successfully completed"),
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:shadow-md sm:p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:mt-3 sm:text-3xl dark:text-white">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:h-11 sm:w-11 sm:rounded-xl dark:bg-indigo-950/40 dark:text-indigo-400">
                    <Icon size={19} />
                  </div>
                </div>

                {stat.description && (
                  <p className="mt-3 hidden text-xs font-medium text-slate-400 sm:block">
                    {stat.description}
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {/* Toolbar */}
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:mt-6 sm:p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                  isArabic ? "right-3.5" : "left-3.5"
                }`}
              />

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("searchRequests", "Search requests...")}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800 ${
                  isArabic ? "pr-10 pl-10" : "pl-10 pr-10"
                }`}
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  aria-label={t("clear", "Clear")}
                  className={`absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white ${
                    isArabic ? "left-2" : "right-2"
                  }`}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="hidden h-10 w-px bg-slate-200 xl:block dark:bg-slate-700" />

            <div className="grid w-full grid-cols-1 gap-2 min-[480px]:grid-cols-3 xl:w-auto xl:flex xl:flex-wrap xl:items-center">
              <select
                value={status}
                onChange={(event) => updateParam("status", event.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 xl:w-auto xl:min-w-[150px]"
              >
                <option value="">{t("allStatuses", "All Statuses")}</option>
                <option value="open">{t("open", "Open")}</option>
                <option value="in_progress">
                  {t("inProgress", "In Progress")}
                </option>
                <option value="blocked">{t("blocked", "Blocked")}</option>
                <option value="done">{t("completed", "Completed")}</option>
              </select>

              <select
                value={priority}
                onChange={(event) =>
                  updateParam("priority", event.target.value)
                }
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 xl:w-auto xl:min-w-[150px]"
              >
                <option value="">{t("allPriorities", "All Priorities")}</option>
                <option value="low">{t("low", "Low")}</option>
                <option value="medium">{t("medium", "Medium")}</option>
                <option value="high">{t("high", "High")}</option>
              </select>

              <select
                value={owner}
                onChange={(event) => updateParam("owner", event.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 xl:w-auto xl:min-w-[150px]"
              >
                <option value="">{t("allOwners", "All Owners")}</option>
                {owners.map((ownerName) => (
                  <option key={ownerName} value={ownerName}>
                    {ownerName}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400 xl:w-auto"
                >
                  <X size={15} />
                  {t("clear", "Clear")}
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800">
              <SlidersHorizontal size={14} />
              <span>
                {t("showing", "Showing")} {totalRequests}{" "}
                {t("matchingRequests", "matching requests")}
              </span>
            </div>
          )}
        </section>

        {/* Table Header */}
        <section className="mb-4 mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500 dark:text-indigo-400">
              {t("workspace", "Workspace")}
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              {t("allRequests", "All Requests")}
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              {totalRequests === 0
                ? t("noRequests", "No requests found")
                : `${t("showing", "Showing")} ${startIndex + 1} - ${Math.min(
                    endIndex,
                    totalRequests,
                  )} ${t("of", "of")} ${totalRequests} ${t("requests", "requests")}`}
            </p>
          </div>

          <div className="flex w-fit max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            {isFetching ? (
              <>
                <RefreshCw size={13} className="animate-spin text-indigo-500" />
                <span className="text-indigo-500 dark:text-indigo-400">
                  {t("updating", "Updating...")}
                </span>
              </>
            ) : (
              <>
                <span>{t("refreshingIn", "Refreshing in")}</span>
                <span className="min-w-[20px] text-center font-bold text-slate-900 dark:text-white">
                  {refreshCountdown}
                  {isArabic ? "ث" : "s"}
                </span>
              </>
            )}
          </div>
        </section>

        {/* Table / Empty */}
        {totalRequests === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center shadow-sm sm:rounded-3xl sm:px-6 sm:py-20 dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 sm:h-16 sm:w-16 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Search size={25} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              {t("noRequests", "No requests found")}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t(
                "noMatchingRequests",
                "We couldn't find any requests matching your current search or filters.",
              )}
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
            >
              {t("clearFilters", "Clear filters")}
            </button>
          </div>
        ) : (
          <RequestsTable
            requests={paginatedRequests}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-3 py-4 shadow-sm sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-center text-sm text-slate-500 sm:text-start dark:text-slate-400">
              {t("page", "Page")}{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {safePage}
              </span>{" "}
              {t("of", "of")}{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {totalPages}
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => handlePageChange(safePage - 1)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("previous", "Previous")}
              </button>

              <div className="flex max-w-full flex-wrap items-center justify-center gap-1">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => handlePageChange(pageNumber)}
                    className={`h-9 min-w-8 rounded-lg px-2 text-xs font-semibold transition sm:min-w-9 sm:px-3 sm:text-sm ${
                      pageNumber === safePage
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
                        : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => handlePageChange(safePage + 1)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("next", "Next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default RequestsPage;
