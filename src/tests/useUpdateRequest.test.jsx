import { describe, it, expect, beforeEach, vi } from "vitest";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { renderHook, act, waitFor } from "@testing-library/react";

import { useUpdateRequest } from "../features/requests/hooks/useUpdateRequest";
import * as requestsApi from "../features/requests/api/requests.api";

describe("useUpdateRequest", () => {
  let queryClient;
  it("keeps the new value when the API succeeds", async () => {
    const initialRequests = [
      {
        id: "REQ-0001",
        title: "Request 1",
        status: "open",
        priority: "high",
        owner: "Ahmed Ali",
        createdAt: "2026-09-01T10:00:00Z",
        updatedAt: "2026-09-01T14:30:00Z",
        description: "Test request",
      },
    ];

    queryClient.setQueryData(["requests"], initialRequests);

    vi.spyOn(requestsApi, "updateRequest").mockResolvedValue({
      ...initialRequests[0],
      status: "done",
    });

    const { result } = renderHook(() => useUpdateRequest(), { wrapper });

    act(() => {
      result.current.mutate({
        id: "REQ-0001",
        data: {
          status: "done",
        },
      });
    });

    // Wait for the optimistic update
    await waitFor(() => {
      expect(queryClient.getQueryData(["requests"])[0].status).toBe("done");
    });

    // Wait until the mutation succeeds
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // The new value should remain
    expect(queryClient.getQueryData(["requests"])[0].status).toBe("done");
  });
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

    vi.restoreAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("rolls back the optimistic update when the API fails", async () => {
    const initialRequests = [
      {
        id: "REQ-0001",
        title: "Request 1",
        status: "open",
        priority: "high",
        owner: "Ahmed Ali",
        createdAt: "2026-09-01T10:00:00Z",
        updatedAt: "2026-09-01T14:30:00Z",
        description: "Test request",
      },
    ];

    queryClient.setQueryData(["requests"], initialRequests);

    vi.spyOn(requestsApi, "updateRequest").mockImplementation(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("API failed"));
          }, 100);
        }),
    );

    const { result } = renderHook(() => useUpdateRequest(), { wrapper });

    act(() => {
      result.current.mutate({
        id: "REQ-0001",
        data: {
          status: "done",
        },
      });
    });

    // Wait for the optimistic update
    await waitFor(() => {
      expect(queryClient.getQueryData(["requests"])[0].status).toBe("done");
    });

    // Wait for the API failure and rollback
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // The original value should be restored
    expect(queryClient.getQueryData(["requests"])[0].status).toBe("open");
  });
});
