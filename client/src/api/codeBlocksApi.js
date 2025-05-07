const API_URL = "http://localhost:3000";

/**
 * Fetch all code blocks (excluding solution)
 */
export async function fetchCodeblocks() {
  const res = await fetch(`${API_URL}/codeblocks`);
  if (!res.ok) throw new Error("Failed to fetch code blocks");
  return res.json();
}

/**
 * Fetch a specific code block by ID (excluding solution)
 * @param {string} id
 */
export async function fetchCodeblockById(id) {
  const res = await fetch(`${API_URL}/codeblocks/${id}`);
  if (!res.ok) throw new Error("Code block not found");
  return res.json();
}
