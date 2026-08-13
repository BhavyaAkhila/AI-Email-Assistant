import axios from "axios";

// ==========================================
// API BASE URL
// ==========================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8097";

console.log("API BASE URL:", API_BASE_URL);

// ==========================================
// AXIOS CLIENT
// ==========================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ==========================================
// JWT TOKEN INTERCEPTOR
// ==========================================

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("API REQUEST:", config.method?.toUpperCase(), config.url);
    console.log("JWT TOKEN EXISTS:", !!token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("REQUEST INTERCEPTOR ERROR:", error);
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "API RESPONSE:",
      response.status,
      response.config.method?.toUpperCase(),
      response.config.url
    );

    return response;
  },

  (error) => {
    console.error("API RESPONSE ERROR:", error);

    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("URL:", error.config?.url);

    // Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

// ==========================================
// EXTRACT GENERATED EMAIL
// ==========================================

export const extractGeneratedEmail = (response) => {
  if (!response) {
    return "";
  }

  if (typeof response === "string") {
    return response;
  }

  if (typeof response === "object") {
    return (
      response.generatedEmail ||
      response.email ||
      response.content ||
      ""
    );
  }

  return String(response);
};

// ==========================================
// HANDLE API ERRORS
// ==========================================

const handleApiError = (error, defaultMessage) => {
  console.error("=================================");
  console.error("API ERROR");
  console.error("=================================");

  console.error("Message:", error?.message);
  console.error("Code:", error?.code);
  console.error("Status:", error?.response?.status);
  console.error("Response:", error?.response?.data);
  console.error("URL:", error?.config?.url);
  console.error("Method:", error?.config?.method);

  // Timeout
  if (error?.code === "ECONNABORTED") {
    throw new Error(
      "The request timed out. The server took too long to respond."
    );
  }

  // No response from backend
  if (!error?.response) {
    throw new Error(
      "Unable to connect to the server. Please make sure Spring Boot is running on port 8097."
    );
  }

  const status = error.response.status;
  const data = error.response.data;

  // 400
  if (status === 400) {
    const message =
      typeof data === "string"
        ? data
        : data?.message ||
          data?.error ||
          "Invalid request.";

    throw new Error(message);
  }

  // 401
  if (status === 401) {
    throw new Error(
      "Invalid or expired login session. Please login again."
    );
  }

  // 403
  if (status === 403) {
    throw new Error(
      "You are not authorized to access this resource."
    );
  }

  // 404
  if (status === 404) {
    const message =
      typeof data === "string"
        ? data
        : data?.message ||
          data?.error ||
          "The requested resource was not found.";

    throw new Error(message);
  }

  // 500
  if (status === 500) {
    const message =
      typeof data === "string"
        ? data
        : data?.message ||
          data?.error ||
          "Server error occurred.";

    throw new Error(message);
  }

  // Other errors
  const message =
    typeof data === "string"
      ? data
      : data?.message ||
        data?.error ||
        defaultMessage ||
        "Something went wrong.";

  throw new Error(message);
};

// ==========================================
// API SERVICE
// ==========================================

export const apiService = {

  // ==========================================
  // 1. GENERATE EMAIL
  // POST /api/ai/generate
  // ==========================================

  generateEmail: async ({
    prompt,
    tone,
    length,
    subject,
  }) => {
    try {
      console.log("=================================");
      console.log("GENERATING EMAIL");
      console.log("=================================");

      console.log("Prompt:", prompt);
      console.log("Tone:", tone);
      console.log("Length:", length);
      console.log("Subject:", subject);

      const response = await apiClient.post(
        "/api/ai/generate",
        {
          prompt,
          tone,
          length,
          subject: subject || "AI Generated Email",
        }
      );

      console.log("GENERATE SUCCESS:", response.data);

      const data = response.data;

      // If backend returns plain string
      if (typeof data === "string") {
        return {
          id: Date.now(),
          prompt,
          subject: subject || "AI Generated Email",
          generatedEmail: data,
          tone,
          length,
          createdAt: new Date().toISOString(),
        };
      }

      // Backend returns Email object
      return {
        ...data,
        generatedEmail: extractGeneratedEmail(data),
      };

    } catch (error) {

      console.error("=================================");
      console.error("GENERATE EMAIL FAILED");
      console.error("=================================");

      console.error("Error:", error);
      console.error("Message:", error?.message);
      console.error("Status:", error?.response?.status);
      console.error("Backend Response:", error?.response?.data);

      handleApiError(
        error,
        "Failed to generate email."
      );
    }
  },

  // ==========================================
  // 2. GET ALL EMAILS
  // GET /api/emails
  // ==========================================

  getEmails: async () => {
    try {

      const response = await apiClient.get(
        "/api/emails"
      );

      const data = response.data || [];

      return data.map((item) => ({
        ...item,
        generatedEmail:
          extractGeneratedEmail(item),
      }));

    } catch (error) {

      handleApiError(
        error,
        "Unable to load emails. Please make sure the backend is running."
      );
    }
  },

  // Alias
  getAllEmails: async () => {
    return await apiService.getEmails();
  },

  // ==========================================
  // 3. SEARCH BY SUBJECT
  // ==========================================

  searchEmailsBySubject: async (subject) => {
    try {

      if (!subject || !subject.trim()) {
        return await apiService.getEmails();
      }

      const query = encodeURIComponent(
        subject.trim()
      );

      const response = await apiClient.get(
        `/api/emails/subject/${query}`
      );

      const data = response.data || [];

      return data.map((item) => ({
        ...item,
        generatedEmail:
          extractGeneratedEmail(item),
      }));

    } catch (error) {

      handleApiError(
        error,
        "Unable to search emails."
      );
    }
  },

  // Alias
  searchBySubject: async (subject) => {
    return await apiService.searchEmailsBySubject(
      subject
    );
  },

  // ==========================================
  // 4. GET EMAILS BY TONE
  // ==========================================

  getEmailsByTone: async (tone) => {
    try {

      if (
        !tone ||
        tone === "All Tones" ||
        tone === "ALL"
      ) {
        return await apiService.getEmails();
      }

      const query = encodeURIComponent(tone);

      const response = await apiClient.get(
        `/api/emails/tone/${query}`
      );

      const data = response.data || [];

      return data.map((item) => ({
        ...item,
        generatedEmail:
          extractGeneratedEmail(item),
      }));

    } catch (error) {

      handleApiError(
        error,
        "Unable to load emails."
      );
    }
  },

  // Alias
  searchByTone: async (tone) => {
    return await apiService.getEmailsByTone(
      tone
    );
  },

  // ==========================================
  // 5. GET EMAIL BY ID
  // GET /api/emails/{id}
  // ==========================================

  getEmailById: async (id) => {
    try {

      const response = await apiClient.get(
        `/api/emails/${id}`
      );

      const data = response.data;

      return {
        ...data,
        generatedEmail:
          extractGeneratedEmail(data),
      };

    } catch (error) {

      handleApiError(
        error,
        `Failed to fetch email #${id}.`
      );
    }
  },

  // ==========================================
  // 6. REGENERATE EMAIL
  // POST /api/ai/regenerate/{id}
  // ==========================================

  regenerateEmail: async (
    id,
    {
      prompt,
      tone,
      length,
    }
  ) => {

    try {

      const response = await apiClient.post(
        `/api/ai/regenerate/${id}`,
        {
          prompt,
          tone,
          length,
        }
      );

      const data = response.data;

      return {
        ...data,
        id: data?.id || id,
        prompt: data?.prompt || prompt,
        generatedEmail:
          extractGeneratedEmail(data),
        tone: data?.tone || tone,
        length: data?.length || length,
      };

    } catch (error) {

      handleApiError(
        error,
        `Failed to regenerate email #${id}.`
      );
    }
  },

  // ==========================================
  // 7. UPDATE EMAIL
  // PUT /api/emails/{id}
  // ==========================================

  updateEmail: async (
    id,
    {
      prompt,
      subject,
      generatedEmail,
      tone,
      length,
    }
  ) => {

    try {

      const response = await apiClient.put(
        `/api/emails/${id}`,
        {
          prompt,
          subject,
          generatedEmail,
          tone,
          length,
        }
      );

      const data = response.data;

      return {
        ...data,
        id: data?.id || id,
        generatedEmail:
          extractGeneratedEmail(data) ||
          generatedEmail,
      };

    } catch (error) {

      handleApiError(
        error,
        `Failed to update email #${id}.`
      );
    }
  },

  // ==========================================
  // 8. DELETE EMAIL
  // DELETE /api/emails/{id}
  // ==========================================

  deleteEmail: async (id) => {

    try {

      const response = await apiClient.delete(
        `/api/emails/${id}`
      );

      return response.data;

    } catch (error) {

      handleApiError(
        error,
        `Failed to delete email #${id}.`
      );
    }
  },

  // ==========================================
  // 9. SAVE EMAIL
  // POST /api/ai/save
  // ==========================================

  saveEmail: async ({
    prompt,
    subject,
    generatedEmail,
    tone,
    length,
  }) => {

    try {

      const response = await apiClient.post(
        "/api/ai/save",
        {
          prompt,
          subject:
            subject || "AI Generated Email",
          generatedEmail,
          tone,
          length,
        }
      );

      const data = response.data;

      return {
        ...data,
        generatedEmail:
          extractGeneratedEmail(data) ||
          generatedEmail,
      };

    } catch (error) {

      handleApiError(
        error,
        "Failed to save email."
      );
    }
  },
};

export default apiService;