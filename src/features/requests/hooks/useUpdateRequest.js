import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRef } from "react";
import { updateRequest } from "../api/requests.api";

export function useUpdateRequest() {
  const queryClient = useQueryClient();

  // Keeps track of the latest update for each request
  const mutationVersions = useRef(new Map());

  return useMutation({
    mutationFn: ({ id, data }) => updateRequest(id, data),

    // Runs BEFORE the API request
    onMutate: async ({ id, data }) => {
      // Create a new version for this request
      const currentVersion = (mutationVersions.current.get(id) || 0) + 1;

      mutationVersions.current.set(id, currentVersion);

      // Stop any request that is currently fetching
      await queryClient.cancelQueries({
        queryKey: ["requests"],
      });

      // Save the current data
      const previousRequests = queryClient.getQueryData(["requests"]);

      // Update the UI immediately
      queryClient.setQueryData(["requests"], (currentRequests) => {
        if (!currentRequests) {
          return currentRequests;
        }

        return currentRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                ...data,
              }
            : request,
        );
      });

      // Return the old data + version
      return {
        previousRequests,
        version: currentVersion,
      };
    },

    // Runs if API fails
    onError: (error, variables, context) => {
      const { id } = variables;

      const latestVersion = mutationVersions.current.get(id);

      // Only rollback if this is still
      // the latest update
      if (context?.version !== latestVersion) {
        return;
      }

      if (context?.previousRequests) {
        queryClient.setQueryData(["requests"], context.previousRequests);
      }
    },

    // Runs after success OR failure
    onSettled: (data, error, variables, context) => {
      const { id } = variables;

      const latestVersion = mutationVersions.current.get(id);

      // Ignore old responses
      if (context?.version !== latestVersion) {
        return;
      }

      // Only the latest update
      // should trigger a refetch
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
    },
  });
}
