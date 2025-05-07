// provides api functions to fetch code block data from the server

// ───── CONFIGURATION ─────
const API_URL = import.meta.env.VITE_API_URL;

// ───── API CALLS ─────

// Fetch all code blocks (excluding solution)
export async function fetchCodeblocks() {
  const res = await fetch(`${API_URL}/codeblocks`);
  if (!res.ok) throw new Error("Failed to fetch code blocks");
  return res.json();
}

// Fetch a specific code block by ID (excluding solution)
export async function fetchCodeblockById(id) {
  const res = await fetch(`${API_URL}/codeblocks/${id}`);
  if (!res.ok) throw new Error("Code block not found");
  return res.json();
}
