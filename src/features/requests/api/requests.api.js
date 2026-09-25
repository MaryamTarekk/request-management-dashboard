const API_URL = "/api/requests";

export async function getRequests() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch requests");
  }

  const result = await response.json();

  return result.data;
}

export async function updateRequest(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update request");
  }

  return result.data;
}
