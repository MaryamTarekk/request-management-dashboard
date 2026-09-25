import { describe, it, expect, beforeEach, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import RequestsPage from "../features/requests/pages/RequestsPage";

import * as requestsApi from "../features/requests/api/requests.api";

vi.mock("../features/requests/api/requests.api", () => ({
  getRequests: vi.fn(),
  updateRequest: vi.fn(),
}));

describe("RequestsPage", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    vi.clearAllMocks();
  });
  it("keeps search and filters in the URL", async () => {
    const requests = [
      {
        id: "REQ-0001",
        title: "Login issue",
        status: "open",
        priority: "high",
        owner: "Ahmed Ali",
        createdAt: "2026-09-01T10:00:00Z",
        updatedAt: "2026-09-01T14:30:00Z",
        description: "Login problem",
      },
      {
        id: "REQ-0002",
        title: "Payment issue",
        status: "done",
        priority: "medium",
        owner: "Sara Mohamed",
        createdAt: "2026-09-02T10:00:00Z",
        updatedAt: "2026-09-02T14:30:00Z",
        description: "Payment problem",
      },
    ];

    requestsApi.getRequests.mockResolvedValue(requests);

    queryClient.setQueryData(["requests"], requests);

    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        {
          path: "/requests",
          element: <RequestsPage />,
        },
      ],
      {
        initialEntries: ["/requests"],
      },
    );

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    // Search
    const searchInput = screen.getByPlaceholderText("Search requests...");

    await user.type(searchInput, "Login");

    // Wait for debounce search to finish
    await waitFor(() => {
      expect(router.state.location.search).toContain("search=Login");
    });

    // Status filter
    const selects = screen.getAllByRole("combobox");

    await user.selectOptions(selects[0], "open");

    // Check that both values exist
    await waitFor(() => {
      expect(router.state.location.search).toContain("search=Login");

      expect(router.state.location.search).toContain("status=open");
    });
  });
});
