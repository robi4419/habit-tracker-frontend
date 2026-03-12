import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import habitsAPI from "../lib/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const useFetchHabits = () => {
  return useQuery({
    queryKey: ["data", "habits"],
    queryFn: async () => {
      const { data } = await habitsAPI.get("/habits");
      return data;
    },
    refetchOnWindowFocus: false,
  });
};

export const fetchHabitQueryOptions = (id) => ({
  queryKey: ["data", "habits", { id }],
  queryFn: async () => {
    if (!id) return null;
    const { data } = await habitsAPI.get("/habits/" + id);

    return data;
  },
  retry: (failureCount, error) => {
    if (error.response?.status === 404) return false;
    return failureCount < 3;
  },
  refetchOnWindowFocus: false,
  staleTime: Infinity,
});

export const useFetchHabit = (id) => {
  return useQuery(fetchHabitQueryOptions(id));
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: (newHabit) => habitsAPI.post("/habits", newHabit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data"] });
      toast.success("Habit added");
    },
  });

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.response?.data?.message);
    }
  }, [query.error]);

  return query;
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: ({ id, habitData }) =>
      habitsAPI.put("/habits/" + id, habitData),
    onSuccess: (response) => {
      const { title } = response.data;
      queryClient.invalidateQueries({ queryKey: ["data", "habits"] });
      toast.success("Habit updated: " + title);
    },
  });

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.response?.data?.message);
    }
  }, [query.error]);

  return query;
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: (id) => habitsAPI.delete("/habits/" + id),
    onSuccess: (response) => {
      const { title } = response.data;
      queryClient.invalidateQueries({ queryKey: ["data"] });
      toast.success("Habit deleted: " + title);
    },
  });

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.response?.data?.message);
    }
  }, [query.error]);

  return query;
};

export const useToggleActiveHabit = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: (id) => habitsAPI.put("/habits/" + id + "/toggle-active"),
    onSuccess: (response) => {
      const { title, is_active } = response.data;
      queryClient.invalidateQueries({ queryKey: ["data"] });
      toast.success(
        `Habit ${is_active ? "activated" : "deactivated"}: ` + title,
      );
    },
  });

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.response?.data?.message);
    }
  }, [query.error]);

  return query;
};
