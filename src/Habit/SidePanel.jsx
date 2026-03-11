import { useHabitContext } from "./context";
import CreateHabit from "./Create";
import UpdateHabit from "./Update";

function SidePanel() {
  const { habitToEdit, setHabitToEdit } = useHabitContext();

  let content;

  if (habitToEdit == "new") {
    content = <CreateHabit />;
  } else if (habitToEdit != null) {
    content = <UpdateHabit key={habitToEdit} habitToEdit={habitToEdit} />;
  } else return;

  return (
    <section className="habit-side-panel">
      <button
        onClick={() => {
          setHabitToEdit(null);
        }}
      >
        close
      </button>
      {content}
    </section>
  );
}
export default SidePanel;
