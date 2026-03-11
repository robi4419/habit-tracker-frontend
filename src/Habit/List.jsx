import HabitCard from "./Card";

import { useHabitContext } from "./context";
import { useFetchHabits } from "./habitQueryHooks";

function HabitList() {
  const { data: habits, isPending, isError, error } = useFetchHabits();
  const { setHabitToEdit } = useHabitContext();

  if (isPending) {
    return <h1>Pending...</h1>;
  }

  if (isError) {
    console.log(error);
    return <h1>{error.response?.data?.message || "Something went wrong"}</h1>;
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitCard key={habit.id} {...habit} />
      ))}
      <div className="add-btn-container">
        <button onClick={() => setHabitToEdit("new")}>Add habit</button>
      </div>
    </div>
  );
}
export default HabitList;
