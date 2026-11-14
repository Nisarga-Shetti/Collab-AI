const API_URL = 'http://127.0.0.1:5000';

// Check backend connection
export async function checkBackend() {
  try {
    const response = await fetch(`${API_URL}/api/health`);

    if (!response.ok) {
      throw new Error('Backend request failed');
    }

    return await response.json();

  } catch (error) {
    console.error('Backend connection error:', error);
    throw error;
  }
}

// Get all projects
export async function getProjects() {
  const response = await fetch(`${API_URL}/api/projects`);

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }

  const data = await response.json();

  return data.projects;
}