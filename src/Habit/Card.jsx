import { useHabitContext } from "./context";
import { useToggleActiveHabit } from "./habitQueryHooks";
import { FaToggleOn, FaToggleOff, FaEdit, FaTrashAlt } from "react-icons/fa";

function HabitCard({
  id,
  title,
  description,
  type,
  target,
  unit,
  frequency,
  days_of_week,
  is_active,
}) {
  const { setHabitToEdit, habitToDelete, setHabitToDelete } = useHabitContext();
  const { mutate: toggleActive, isPending } = useToggleActiveHabit();

  return (
    <article className={`habit-card ${!is_active && "inactive"}`}>
      <div className="habit-content">
        <div className="habit-controls">
          <button
            onClick={() => {
              if (!habitToDelete) {
                setHabitToEdit(id);
              }
            }}
            disabled={habitToDelete != null}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              if (!habitToDelete) {
                toggleActive(id);
              }
            }}
            disabled={habitToDelete != null || isPending}
            title={is_active ? "Deactivate" : "Activate"}
          >
            {is_active ? <FaToggleOn /> : <FaToggleOff />}
          </button>
          <button
            onClick={() => {
              if (!habitToDelete) {
                setHabitToDelete(id);
              }
            }}
            disabled={habitToDelete != null}
            title="Delete"
          >
            <FaTrashAlt />
          </button>
        </div>
        <h2 className="habit-title" title={title}>
          {title}
        </h2>
        <p className="habit-description" title={description}>
          {description}
        </p>
        <p className="habit-type">
          <span>Type · </span>
          {type}
        </p>
        {type == "count" && (
          <p className="habit-target" title={unit}>
            <span>Target · </span>
            {target} {unit}
          </p>
        )}
        <p className="habit-frequency">
          <span>Frequency · </span>
          {frequency}
        </p>
        {frequency == "daily" && (
          <div className="habit-days-of-week">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <div
                key={day}
                className={`habit-day ${!days_of_week?.includes(day) && "disabled-day"}`}
              >
                {day}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
export default HabitCard;
