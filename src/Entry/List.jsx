import { useQueries } from "@tanstack/react-query";
import EntryCard from "./Card";
import { useEntryContext } from "./context";
import { useFetchEntries } from "./entryQueryHooks";
import { motion, AnimatePresence } from "framer-motion";
import { fetchHabitQueryOptions } from "../Habit/habitQueryHooks";

function EntryList() {
  const { selectedDate, direction } = useEntryContext();
  const { data: entries, isPending, isError } = useFetchEntries(selectedDate);

  const habitIds = entries
    ? [...entries.daily, ...entries.weekly].map((e) => e.habit_id)
    : [];

  const habitQueries = useQueries({
    queries: habitIds.map((id) => fetchHabitQueryOptions(id)),
  });

  const habitsLoading = habitQueries.some((q) => q.isPending);

  let dailyEntries = <h3>Loading...</h3>;
  let weeklyEntries = <h3>Loading...</h3>;

  if (!isPending && !isError && !habitsLoading) {
    const habitsMap = {};
    habitQueries.forEach((q, i) => {
      if (q.data) habitsMap[habitIds[i]] = q.data;
    });

    dailyEntries = (
      <>
        {entries.daily.map((entry) => (
          <EntryCard
            key={entry.id}
            {...entry}
            habit={habitsMap[entry.habit_id]}
          />
        ))}
        {entries.daily.length == 0 && <h3>No daily habits today</h3>}
      </>
    );

    weeklyEntries = (
      <>
        {entries.weekly.map((entry) => (
          <EntryCard
            key={entry.id}
            {...entry}
            habit={habitsMap[entry.habit_id]}
          />
        ))}
        {entries.weekly.length == 0 && <h3>No weekly habits this week</h3>}
      </>
    );
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={selectedDate}
        className="list-container"
        custom={direction}
        variants={{
          enter: (dir) => ({ x: dir * 60, opacity: 0 }),
          center: { x: 0, opacity: 1 },
          exit: (dir) => ({ x: dir * -60, opacity: 0 }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        <div className="list-wrap">
          <h2>Daily</h2>
          <div className="list">{dailyEntries}</div>
        </div>
        <div className="list-wrap">
          <h2>Weekly</h2>
          <div className="list">{weeklyEntries}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
export default EntryList;
