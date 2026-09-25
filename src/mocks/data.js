const owners = ["Ahmed Ali", "Sara Mohamed", "Omar Hassan", "Mariam Tarek"];

const statuses = ["open", "in_progress", "blocked", "done"];

const priorities = ["low", "medium", "high"];

export const requests = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1;

  return {
    id: `REQ-${String(id).padStart(4, "0")}`,
    title: `Request ${id}`,
    status: statuses[index % statuses.length],
    priority: priorities[index % priorities.length],
    owner: owners[index % owners.length],
    createdAt: `2026-09-${String((index % 20) + 1).padStart(2, "0")}T10:00:00Z`,
    updatedAt: `2026-09-${String((index % 20) + 1).padStart(2, "0")}T14:30:00Z`,
    description: `This is a sample description for request ${id}.`,
  };
});
