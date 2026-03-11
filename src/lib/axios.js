import axios from "axios";

const habitsAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

// Attach token ot every request
habitsAPI.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Auto-refresh on 401
habitsAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthRoute = original.url.includes("/auth/");

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return habitsAPI(original);
      } catch {
        setAccessToken(null);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default habitsAPI;
