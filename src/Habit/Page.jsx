import { HabitContextProvider } from "./context";
import DeleteHabit from "./Delete";
import HabitList from "./List";
import SidePanel from "./SidePanel";

function HabitsPage() {
  return (
    <HabitContextProvider>
      <div className="habit-page">
        <HabitList />
        <SidePanel />
        <DeleteHabit />
      </div>
    </HabitContextProvider>
  );
}
export default HabitsPage;
