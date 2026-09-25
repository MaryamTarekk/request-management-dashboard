import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { render, screen, cleanup } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import RequestDetailsPage from "../features/requests/pages/RequestDetailsPage";

import * as requestsApi from "../features/requests/api/requests.api";

vi.mock("../features/requests/api/requests.api", () => ({
  getRequests: vi.fn(),
  updateRequest: vi.fn(),
}));

describe("RequestDetailsPage", () => {
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

  afterEach(() => {
    cleanup();
  });

  it("shows validation error when title is empty", async () => {
    const request = {
      id: "REQ-0001",
      title: "Request 1",
      status: "open",
      priority: "high",
      owner: "Ahmed Ali",
      createdAt: "2026-09-01T10:00:00Z",
      updatedAt: "2026-09-01T14:30:00Z",
      description: "Test request",
    };

    requestsApi.getRequests.mockResolvedValue([request]);

    queryClient.setQueryData(["requests"], [request]);

    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        {
          path: "/requests/:id",
          element: <RequestDetailsPage />,
        },
      ],
      {
        initialEntries: ["/requests/REQ-0001"],
      },
    );

    render(
      <QueryClientProvider client={queryClient}>
        <>
          <RouterProvider router={router} />
          <Toaster />
        </>
      </QueryClientProvider>,
    );

    // Click Edit
    await user.click(
      screen.getByRole("button", {
        name: "Edit request",
      }),
    );

    // Find title input
    const titleInput = screen.getByLabelText("Title");

    // Remove the title
    await user.clear(titleInput);

    expect(titleInput).toHaveValue("");

    // Try to save
    await user.click(
      screen.getByRole("button", {
        name: "Save changes",
      }),
    );

    // Check whether the validation error appears
    const validationMessage = await screen.findByText(
      "Title is required",
      {},
      {
        timeout: 1000,
      },
    );

    expect(validationMessage).toBeInTheDocument();
  });

  it("warns before leaving when there are unsaved changes", async () => {
    const request = {
      id: "REQ-0001",
      title: "Request 1",
      status: "open",
      priority: "high",
      owner: "Ahmed Ali",
      createdAt: "2026-09-01T10:00:00Z",
      updatedAt: "2026-09-01T14:30:00Z",
      description: "Test request",
    };

    requestsApi.getRequests.mockResolvedValue([request]);

    queryClient.setQueryData(["requests"], [request]);

    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        {
          path: "/requests/:id",
          element: <RequestDetailsPage />,
        },
        {
          path: "/requests",
          element: <div>Requests List</div>,
        },
      ],
      {
        initialEntries: ["/requests/REQ-0001"],
      },
    );

    render(
      <QueryClientProvider client={queryClient}>
        <>
          <RouterProvider router={router} />
          <Toaster />
        </>
      </QueryClientProvider>,
    );

    // Click Edit
    await user.click(
      screen.getByRole("button", {
        name: "Edit request",
      }),
    );

    // Find title input
    const titleInput = screen.getByLabelText("Title");

    // Change the title
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Request");

    // Try to go back
    await user.click(
      screen.getByRole("button", {
        name: "Back to requests",
      }),
    );

    // Check that the custom confirmation appears
    expect(
      await screen.findByText(
        "You have unsaved changes. Do you want to leave without saving?",
      ),
    ).toBeInTheDocument();

    // Stay on the page
    await user.click(
      screen.getByRole("button", {
        name: "Stay",
      }),
    );

    // Confirm that we are still on the details page
    expect(
      screen.getByRole("heading", {
        name: "Request 1",
      }),
    ).toBeInTheDocument();

    // Confirm that the edited value is still present
    expect(titleInput).toHaveValue("Updated Request");
  });
});
