import { http, HttpResponse } from "msw";
import { requests } from "./data";

const STORAGE_KEY = "request-dashboard-data";
const SIMULATION_KEY = "api-simulation-settings";

const DEFAULT_SETTINGS = {
  latency: 1200,
  failureRate: 10,
  simulateUsers: true,
};

function getSimulationSettings() {
  try {
    const saved = localStorage.getItem(SIMULATION_KEY);
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function getStoredRequests() {
  const savedRequests = localStorage.getItem(STORAGE_KEY);

  if (savedRequests) {
    return JSON.parse(savedRequests);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  return requests;
}

function saveRequests(updatedRequests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));
}

function getRandomDelay() {
  const { latency } = getSimulationSettings();
  const min = Math.max(0, latency - 300);
  const max = latency + 300;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function waitForApi() {
  await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
}

function shouldFail() {
  const { failureRate } = getSimulationSettings();
  return Math.random() * 100 < failureRate;
}

function simulateOtherUsers() {
  const settings = getSimulationSettings();

  if (!settings.simulateUsers) return;

  const storedRequests = getStoredRequests();
  const statuses = ["open", "in_progress", "blocked", "done"];

  // Randomly update one request's status
  if (storedRequests.length > 0 && Math.random() < 0.5) {
    const randomIndex = Math.floor(Math.random() * storedRequests.length);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    storedRequests[randomIndex] = {
      ...storedRequests[randomIndex],
      status: randomStatus,
      updatedAt: new Date().toISOString(),
    };

    saveRequests(storedRequests);
  }
}

export const handlers = [
  // GET all requests
  http.get("/api/requests", async () => {
    await waitForApi();

    simulateOtherUsers();

    return HttpResponse.json({
      data: getStoredRequests(),
    });
  }),

  // PATCH request
  http.patch("/api/requests/:id", async ({ params, request }) => {
    await waitForApi();

    const { id } = params;
    const body = await request.json();

    const storedRequests = getStoredRequests();

    const requestIndex = storedRequests.findIndex((item) => item.id === id);

    if (requestIndex === -1) {
      return HttpResponse.json(
        { message: "Request not found" },
        { status: 404 },
      );
    }

    // Simulate API failure according to the selected percentage
    if (shouldFail()) {
      return HttpResponse.json(
        { message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    storedRequests[requestIndex] = {
      ...storedRequests[requestIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    saveRequests(storedRequests);

    return HttpResponse.json({
      data: storedRequests[requestIndex],
    });
  }),
];
