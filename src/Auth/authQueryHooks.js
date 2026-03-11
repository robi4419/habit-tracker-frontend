import { useMutation, useQueryClient } from "@tanstack/react-query";
import habitsAPI from "../lib/axios";
import { useAuth } from "./context";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) =>
      habitsAPI.post("/auth/register", credentials).then((r) => r.data),
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      queryClient.invalidateQueries({ queryKey: ["data"] });
      navigate("/");
    },
    retry: false,
  });
};

export const useLogin = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) =>
      habitsAPI.post("/auth/login", credentials).then((r) => r.data),
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      queryClient.invalidateQueries({ queryKey: ["data"] }); // Refresh any user-specific data
      navigate("/");
    },
    retry: false,
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => habitsAPI.post("/auth/logout").then((r) => r.data),
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached data on logout
    },
    retry: false,
  });
};
