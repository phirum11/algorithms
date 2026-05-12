const API_BASE_URL = "http://localhost:8000";

export async function analyzeAlgorithm(code) {
  try {
    const response = await fetch(API_BASE_URL + "/api/analyze", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || "Server error: " + response.status);
    }

    return await response.json();
  } catch (error) {
    console.error("Backend API Error:", error);
    throw error;
  }
}

export async function generateAiImage(prompt, width = 1024, height = 512) {
  try {
    const response = await fetch(API_BASE_URL + "/api/image-gen", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, width, height }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || "Server error: " + response.status);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
}
