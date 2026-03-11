import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import habitsAPI from "../lib/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const useFetchEntries = (date) => {
  const query = useQuery({
    queryKey: ["data", "entries", date],
    queryFn: async () => {
      const today = new Date().toLocaleDateString("en-CA");
      const { data } = await habitsAPI.get(
        "/entries?date=" + date + "&today=" + today,
      );
      return data;
    },
    staleTime: 15 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.response?.data?.message);
    }
  }, [query.error]);

  return query;
};

export const useUpdateEntry = (date) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: ({ id, value, completed }) =>
      habitsAPI.put("/entries/" + id, { value, completed }),
    onSuccess: (_, { id, value, completed }) => {
      // update current date
      queryClient.setQueryData(["data", "entries", date], (old) =>
        old
          ? {
              ...old,
              daily: old.daily.map((e) =>
                e.id === id ? { ...e, value, completed } : e,
              ),
              weekly: old.weekly.map((e) =>
                e.id === id ? { ...e, value, completed } : e,
              ),
            }
          : old,
      );

      // update rest of the week's cached dates
      const [year, month, day] = date.split("-").map(Number);
      const current = new Date(year, month - 1, day);
      const dayOfWeek = current.getDay(); // 0 = Sunday
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

      for (let i = 0; i < 7; i++) {
        const d = new Date(year, month - 1, day + mondayOffset + i);
        const dateStr = d.toLocaleDateString("en-CA");
        if (dateStr === date) continue;

        queryClient.setQueryData(["data", "entries", dateStr], (old) =>
          old
            ? {
                ...old,
                weekly: old.weekly.map((e) =>
                  e.id === id ? { ...e, value, completed } : e,
                ),
              }
            : old,
        );
      }
    },
  });

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.response?.data?.message);
    }
  }, [query.error]);

  return query;
};
