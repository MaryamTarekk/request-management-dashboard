import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      requests: "Requests",
      settings: "Settings",
      search: "Search...",
      loading: "Loading...",
      save: "Save Changes",
      cancel: "Cancel",
      title: "Title",
      status: "Status",
      priority: "Priority",
      owner: "Owner",
      createdAt: "Created At",
      updatedAt: "Updated At",
      language: "Language",

      appName: "RequestFlow",
      appSubtitle: "Request Management Dashboard",

      requestsTitle: "Requests",
      requestsDescription:
        "Manage, track and organize your requests in one place.",

      liveSync: "Live sync",
      updating: "Updating...",
      lastUpdated: "Last updated",

      totalRequests: "Total Requests",

      open: "Open",
      inProgress: "In Progress",
      blocked: "Blocked",
      completed: "Completed",

      waitingToProcess: "Waiting to be processed",
      currentlyHandled: "Currently being handled",
      successfullyCompleted: "Successfully completed",

      searchRequests: "Search requests...",

      allStatuses: "All Statuses",
      allPriorities: "All Priorities",
      allOwners: "All Owners",

      low: "Low",
      medium: "Medium",
      high: "High",

      clear: "Clear",
      clearFilters: "Clear filters",

      workspace: "Workspace",
      allRequests: "All Requests",

      noRequests: "No requests found",
      matchingRequests: "matching requests",
      request: "request",

      showing: "Showing",
      of: "of",

      refreshingIn: "Refreshing in",

      page: "Page",
      previous: "Previous",
      next: "Next",

      failedToLoad: "Failed to load requests",
      loadingError: "Something went wrong while loading your requests.",

      noMatchingRequests:
        "We couldn't find any requests matching your current search or filters.",

      /* =========================
         API Simulation
      ========================== */

      apiSimulation: {
        title: "API simulation",
        fail: "fail",

        settingsTitle: "Mock API settings",

        settingsDescription:
          "Tweak to test slow, failing, and out-of-order responses.",

        latency: "Latency",
        ms: "ms",

        failureRate: "Failure rate",

        simulateUsers: "Simulate other users",

        simulateUsersDescription: "Random status changes on refresh",
      },
    },
  },

  ar: {
    translation: {
      dashboard: "لوحة التحكم",
      requests: "الطلبات",
      settings: "الإعدادات",
      search: "ابحث...",
      loading: "جاري التحميل...",
      save: "حفظ التغييرات",
      cancel: "إلغاء",

      title: "العنوان",
      status: "الحالة",
      priority: "الأولوية",
      owner: "المسؤول",
      createdAt: "تاريخ الإنشاء",
      updatedAt: "آخر تحديث",
      language: "اللغة",

      appName: "RequestFlow",
      appSubtitle: "لوحة إدارة الطلبات",

      requestsTitle: "الطلبات",

      requestsDescription: "إدارة الطلبات ومتابعتها وتنظيمها في مكان واحد.",

      liveSync: "مزامنة مباشرة",
      updating: "جاري التحديث...",
      lastUpdated: "آخر تحديث",

      totalRequests: "إجمالي الطلبات",

      open: "مفتوح",
      inProgress: "قيد التنفيذ",
      blocked: "متوقف",
      completed: "مكتمل",

      waitingToProcess: "في انتظار المعالجة",
      currentlyHandled: "جاري العمل عليه",
      successfullyCompleted: "تم إكماله بنجاح",

      searchRequests: "ابحث عن الطلبات...",

      allStatuses: "كل الحالات",
      allPriorities: "كل الأولويات",
      allOwners: "كل المسؤولين",

      low: "منخفضة",
      medium: "متوسطة",
      high: "عالية",

      clear: "مسح",
      clearFilters: "مسح الفلاتر",

      workspace: "مساحة العمل",
      allRequests: "كل الطلبات",

      noRequests: "لا توجد طلبات",
      matchingRequests: "طلبات مطابقة",
      request: "طلب",

      showing: "عرض",
      of: "من",

      refreshingIn: "التحديث خلال",

      page: "صفحة",
      previous: "السابق",
      next: "التالي",

      failedToLoad: "فشل تحميل الطلبات",

      loadingError: "حدث خطأ أثناء تحميل الطلبات.",

      noMatchingRequests:
        "لم نتمكن من العثور على طلبات تطابق البحث أو الفلاتر الحالية.",

      /* =========================
         محاكاة API
      ========================== */

      apiSimulation: {
        title: "محاكاة API",
        fail: "فشل",

        settingsTitle: "إعدادات API التجريبية",

        settingsDescription:
          "عدّل الإعدادات لاختبار الاستجابات البطيئة أو الفاشلة أو غير المرتبة.",

        latency: "زمن الاستجابة",
        ms: "مللي ثانية",

        failureRate: "معدل الفشل",

        simulateUsers: "محاكاة مستخدمين آخرين",

        simulateUsersDescription: "تغييرات عشوائية في الحالة عند التحديث",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
