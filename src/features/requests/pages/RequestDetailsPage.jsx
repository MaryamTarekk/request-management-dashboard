import { useEffect, useState } from "react";
import { useParams, useNavigate, useBlocker } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Flag,
  Pencil,
  RotateCcw,
  Save,
  AlertCircle,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import { useRequests } from "../hooks/useRequests";
import { useUpdateRequest } from "../hooks/useUpdateRequest";
import { requestSchema } from "../utils/requestSchema";

// =============================
// Translations
// =============================

const translations = {
  en: {
    back: "Back to requests",
    manage: "Manage and track your request details",
    edit: "Edit request",
    info: "Request information",
    infoDesc: "Basic information and description",
    title: "Title",
    titlePlaceholder: "Enter request title",
    description: "Description",
    descriptionPlaceholder: "Add a description...",
    noDescription: "No description provided.",
    assignment: "Assignment & status",
    assignmentDesc: "Manage the status, priority, and owner",
    status: "Status",
    priority: "Priority",
    owner: "Owner",
    selectOwner: "Select owner",
    assignedOwner: "Assigned owner",
    activity: "Activity",
    activityDesc: "Request creation and last update",
    createdAt: "Created at",
    updatedAt: "Last updated",
    unsaved: "Unsaved changes",
    unsavedMessage:
      "You have unsaved changes. Do you want to leave without saving?",
    stay: "Stay",
    leave: "Leave",
    failedLoad: "Failed to load request",
    loadError: "Something went wrong while loading this request.",
    notFound: "Request not found",
    notFoundMessage: "The request you're looking for doesn't exist.",
    saveSuccess: "Changes saved successfully!",
    saveError: "Failed to save changes. Please try again.",
    discard: "Discard",
    saving: "Saving...",
    save: "Save changes",
    unsavedHint: "Changes won't be saved until you click Save.",
    open: "Open",
    inProgress: "In Progress",
    blocked: "Blocked",
    done: "Done",
    low: "Low",
    medium: "Medium",
    high: "High",
  },

  ar: {
    back: "الرجوع إلى الطلبات",
    manage: "إدارة تفاصيل الطلب ومتابعة حالته",
    edit: "تعديل الطلب",
    info: "معلومات الطلب",
    infoDesc: "المعلومات الأساسية ووصف الطلب",
    title: "عنوان الطلب",
    titlePlaceholder: "أدخلي عنوان الطلب",
    description: "الوصف",
    descriptionPlaceholder: "أضيفي وصفًا للطلب...",
    noDescription: "لا يوجد وصف لهذا الطلب.",
    assignment: "التعيين والحالة",
    assignmentDesc: "إدارة الحالة والأولوية والمسؤول",
    status: "الحالة",
    priority: "الأولوية",
    owner: "المسؤول",
    selectOwner: "اختاري المسؤول",
    assignedOwner: "المسؤول عن الطلب",
    activity: "النشاط",
    activityDesc: "تاريخ إنشاء الطلب وآخر تحديث",
    createdAt: "تاريخ الإنشاء",
    updatedAt: "آخر تحديث",
    unsaved: "تغييرات غير محفوظة",
    unsavedMessage: "لديك تغييرات غير محفوظة. هل تريدين المغادرة دون حفظها؟",
    stay: "البقاء",
    leave: "مغادرة الصفحة",
    failedLoad: "تعذر تحميل الطلب",
    loadError: "حدث خطأ أثناء تحميل هذا الطلب.",
    notFound: "الطلب غير موجود",
    notFoundMessage: "الطلب الذي تبحثين عنه غير موجود.",
    saveSuccess: "تم حفظ التغييرات بنجاح!",
    saveError: "فشل حفظ التغييرات. حاولي مرة أخرى.",
    discard: "إلغاء التغييرات",
    saving: "جارٍ الحفظ...",
    save: "حفظ التغييرات",
    unsavedHint: "لن يتم حفظ التغييرات إلا بعد الضغط على حفظ.",
    open: "مفتوح",
    inProgress: "قيد التنفيذ",
    blocked: "متوقف",
    done: "مكتمل",
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
  },
};

const statusConfig = {
  open: {
    key: "open",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  in_progress: {
    key: "inProgress",
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  blocked: {
    key: "blocked",
    className:
      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  done: {
    key: "done",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
};

const priorityConfig = {
  low: {
    key: "low",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  medium: {
    key: "medium",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  high: {
    key: "high",
    className: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  },
};

// =============================
// Reusable Components
// =============================

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="break-words text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        {description && (
          <p className="mt-1 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
    >
      {children}
    </label>
  );
}

const inputClass =
  "w-full min-w-0 rounded-xl border bg-white px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:px-4 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500";

function getFieldClass(hasError) {
  return `${inputClass} ${
    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
      : "border-slate-200 dark:border-slate-700"
  }`;
}

function FieldError({ children }) {
  if (!children) return null;

  return (
    <p className="mt-2 flex items-start gap-1.5 break-words text-xs font-medium text-rose-600 dark:text-rose-400">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      {children}
    </p>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatDate(date, isArabic) {
  if (!date) return "—";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

// =============================
// Main Page
// =============================

function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const lang = isArabic ? "ar" : "en";
  const t = translations[lang];

  const updateRequestMutation = useUpdateRequest();
  const { data: requests, isLoading, isError } = useRequests();

  const request = requests?.find((item) => item.id === id);

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: "",
      status: "open",
      priority: "medium",
      owner: "",
      description: "",
    },
  });

  // =============================
  // Block navigation
  // =============================

  const blocker = useBlocker(isEditing && isDirty);

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    const toastId = toast.custom(
      (toastItem) => (
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <AlertCircle size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.unsaved}
              </h3>

              <p className="mt-1 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
                {t.unsavedMessage}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastItem.id);
                blocker.reset();
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t.stay}
            </button>

            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastItem.id);
                blocker.proceed();
              }}
              className="w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 sm:w-auto"
            >
              {t.leave}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );

    return () => toast.dismiss(toastId);
  }, [blocker.state, isArabic, t]);

  // =============================
  // Initialize form
  // =============================

  useEffect(() => {
    if (!isEditing || !request) return;

    reset({
      title: request.title,
      status: request.status,
      priority: request.priority,
      owner: request.owner,
      description: request.description || "",
    });
  }, [isEditing, request?.id, reset]);

  // =============================
  // Loading
  // =============================

  if (isLoading) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-[calc(100vh-80px)] bg-slate-50 px-3 py-6 sm:px-6 sm:py-10 dark:bg-[#0b1120]"
      >
        <div className="mx-auto max-w-5xl animate-pulse space-y-5 sm:space-y-6">
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-32 rounded-2xl bg-slate-200 sm:rounded-3xl dark:bg-slate-800" />
          <div className="h-80 rounded-2xl bg-slate-200 sm:h-96 sm:rounded-3xl dark:bg-slate-800" />
        </div>
      </main>
    );
  }

  // =============================
  // Error
  // =============================

  if (isError || !request) {
    const title = isError ? t.failedLoad : t.notFound;
    const message = isError ? t.loadError : t.notFoundMessage;

    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-[calc(100vh-80px)] bg-slate-50 px-3 py-6 sm:px-6 sm:py-10 dark:bg-[#0b1120]"
      >
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 text-center sm:rounded-3xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            <AlertCircle size={26} />
          </div>

          <h2 className="mt-5 break-words text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
            {title}
          </h2>

          <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-slate-400">
            {message}
          </p>

          <button
            type="button"
            onClick={() => navigate("/requests")}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
          >
            {t.back}
          </button>
        </div>
      </main>
    );
  }

  // =============================
  // Actions
  // =============================

  const handleEdit = () => setIsEditing(true);

  const handleDiscard = () => {
    reset({
      title: request.title,
      status: request.status,
      priority: request.priority,
      owner: request.owner,
      description: request.description || "",
    });
    setIsEditing(false);
  };

  const handleSave = async (formData) => {
    try {
      await updateRequestMutation.mutateAsync({
        id: request.id,
        data: formData,
      });

      setIsEditing(false);
      reset(formData);
      toast.success(t.saveSuccess);
    } catch (error) {
      toast.error(error.message || t.saveError);
    }
  };

  const status = statusConfig[request.status] || statusConfig.open;
  const priority = priorityConfig[request.priority] || priorityConfig.low;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-80px)] overflow-x-hidden bg-slate-50 pb-8 sm:pb-12 dark:bg-[#0b1120]"
    >
      <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/requests")}
          className="group mb-4 inline-flex max-w-full items-center gap-2 rounded-xl px-3 py-2 text-start text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-indigo-600 sm:mb-6 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
        >
          {isArabic ? (
            <ArrowRight
              size={17}
              className="shrink-0 transition group-hover:translate-x-1"
            />
          ) : (
            <ArrowLeft
              size={17}
              className="shrink-0 transition group-hover:-translate-x-1"
            />
          )}
          <span className="break-words">{t.back}</span>
        </button>

        {/* Page Header */}
        <div className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:mb-7 sm:rounded-3xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="pointer-events-none absolute -end-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 start-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4 sm:gap-3">
                <span className="inline-flex max-w-full items-center gap-2 break-all rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <FileText size={14} className="shrink-0" />
                  {request.id}
                </span>

                <span
                  className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                  />
                  {t[status.key]}
                </span>
              </div>

              <h1 className="break-words text-xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {request.title}
              </h1>

              <p className="mt-3 flex items-start gap-2 break-words text-xs leading-6 text-slate-500 sm:text-sm dark:text-slate-400">
                <Sparkles size={15} className="mt-1 shrink-0 text-indigo-500" />
                <span>{t.manage}</span>
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-200 hover:-translate-y-0.5 sm:w-auto"
              >
                <Pencil size={16} />
                {t.edit}
              </button>
            )}
          </div>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit(handleSave)}
          className="space-y-4 sm:space-y-6"
        >
          {/* Request information */}
          <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-900">
            <SectionHeading
              icon={FileText}
              title={t.info}
              description={t.infoDesc}
            />

            <div className="space-y-5 sm:space-y-6">
              <div className="min-w-0">
                <FieldLabel htmlFor="request-title">{t.title}</FieldLabel>

                {isEditing ? (
                  <>
                    <input
                      id="request-title"
                      type="text"
                      placeholder={t.titlePlaceholder}
                      {...register("title")}
                      className={getFieldClass(!!errors.title)}
                    />
                    <FieldError>{errors.title?.message}</FieldError>
                  </>
                ) : (
                  <div className="break-words rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3 text-sm font-semibold leading-6 text-slate-800 sm:px-4 sm:py-4 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                    {request.title}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <FieldLabel htmlFor="request-description">
                  {t.description}
                </FieldLabel>

                {isEditing ? (
                  <>
                    <textarea
                      id="request-description"
                      rows={5}
                      placeholder={t.descriptionPlaceholder}
                      {...register("description")}
                      className={`${getFieldClass(!!errors.description)} resize-y`}
                    />
                    <FieldError>{errors.description?.message}</FieldError>
                  </>
                ) : (
                  <div className="min-h-28 whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3 text-sm leading-7 text-slate-600 sm:px-4 sm:py-4 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                    {request.description || t.noDescription}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Assignment & status */}
          <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-900">
            <SectionHeading
              icon={Flag}
              title={t.assignment}
              description={t.assignmentDesc}
            />

            <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
              <div className="min-w-0">
                <FieldLabel htmlFor="request-status">{t.status}</FieldLabel>

                {isEditing ? (
                  <>
                    <select
                      id="request-status"
                      {...register("status")}
                      className={`${getFieldClass(!!errors.status)} dark:[color-scheme:dark]`}
                    >
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <option key={value} value={value}>
                          {t[config.key]}
                        </option>
                      ))}
                    </select>
                    <FieldError>{errors.status?.message}</FieldError>
                  </>
                ) : (
                  <div className="flex min-h-12 items-center">
                    <span
                      className={`inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                      />
                      {t[status.key]}
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <FieldLabel htmlFor="request-priority">{t.priority}</FieldLabel>

                {isEditing ? (
                  <>
                    <select
                      id="request-priority"
                      {...register("priority")}
                      className={`${getFieldClass(!!errors.priority)} dark:[color-scheme:dark]`}
                    >
                      {Object.entries(priorityConfig).map(([value, config]) => (
                        <option key={value} value={value}>
                          {t[config.key]}
                        </option>
                      ))}
                    </select>
                    <FieldError>{errors.priority?.message}</FieldError>
                  </>
                ) : (
                  <div className="flex min-h-12 items-center">
                    <span
                      className={`inline-flex max-w-full rounded-full px-4 py-2 text-sm font-semibold ${priority.className}`}
                    >
                      {t[priority.key]}
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 md:col-span-2">
                <FieldLabel htmlFor="request-owner">{t.owner}</FieldLabel>

                {isEditing ? (
                  <>
                    <select
                      id="request-owner"
                      {...register("owner")}
                      className={`${getFieldClass(!!errors.owner)} dark:[color-scheme:dark]`}
                    >
                      <option value="">{t.selectOwner}</option>
                      <option value="Ahmed Ali">Ahmed Ali</option>
                      <option value="Sara Mohamed">Sara Mohamed</option>
                      <option value="Omar Hassan">Omar Hassan</option>
                      <option value="Mariam Tarek">Mariam Tarek</option>
                    </select>
                    <FieldError>{errors.owner?.message}</FieldError>
                  </>
                ) : (
                  <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3 sm:px-4 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {request.owner
                        ?.split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {request.owner}
                      </p>
                      <p className="mt-1 break-words text-xs text-slate-500 dark:text-slate-400">
                        {t.assignedOwner}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Activity */}
          <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-900">
            <SectionHeading
              icon={Clock3}
              title={t.activity}
              description={t.activityDesc}
            />

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <InfoItem
                icon={CalendarDays}
                label={t.createdAt}
                value={formatDate(request.createdAt, isArabic)}
              />

              <InfoItem
                icon={Clock3}
                label={t.updatedAt}
                value={formatDate(request.updatedAt, isArabic)}
              />
            </div>
          </section>

          {/* Actions */}
          {isEditing && (
            <div className="sticky bottom-2 z-20 flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:bottom-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4 dark:border-slate-800 dark:bg-slate-900/95">
              <p className="hidden min-w-0 break-words text-xs leading-5 text-slate-500 sm:block dark:text-slate-400">
                {t.unsavedHint}
              </p>

              <div className="flex w-full min-w-0 flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={handleDiscard}
                  disabled={updateRequestMutation.isPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto sm:px-5 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <RotateCcw size={16} />
                  {t.discard}
                </button>

                <button
                  type="submit"
                  disabled={updateRequestMutation.isPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6"
                >
                  {updateRequestMutation.isPending ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      {t.saving}
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      {t.save}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default RequestDetailsPage;
