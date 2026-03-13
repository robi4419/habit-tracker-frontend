import { useState } from "react";
import { useHabitContext } from "./context";
import { useCreateHabit } from "./habitQueryHooks";

function CreateHabit() {
  const { setHabitToEdit } = useHabitContext();
  const { mutate: createHabit, isPending } = useCreateHabit();

  const [type, setType] = useState("binary");
  const [frequency, setFrequency] = useState("daily");

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { title, description, type, target, unit, frequency, ...days } =
      Object.fromEntries(formData);

    const days_of_week = Object.keys(days).join(",");

    if (title.trim() !== "") {
      const newHabit = {
        title,
        description,
        type,
        target,
        unit,
        frequency,
        days_of_week,
        created_at: new Date().toLocaleDateString("en-CA"),
      };
      console.log(newHabit);

      createHabit(newHabit, {
        onSuccess: () => setHabitToEdit(null),
      });
    }
  };

  return (
    <div className="habit-create">
      <h1>Create a habit</h1>
      <form className="habit-form" onSubmit={handleSubmit}>
        <div className="form-input">
          <label htmlFor="title">title</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div className="form-input">
          <label htmlFor="description">description</label>
          <textarea id="description" name="description" />
        </div>
        <div className="form-input">
          <label htmlFor="type">type</label>
          <select
            name="type"
            id="type"
            onChange={handleTypeChange}
            value={type}
          >
            <option value="binary">checkbox</option>
            <option value="count">with progress</option>
          </select>
        </div>
        {type == "count" && (
          <div className="input-pair">
            <div className="form-input">
              <label htmlFor="target">target</label>
              <input type="number" step="any" id="target" name="target" />
            </div>
            <div className="form-input">
              <label htmlFor="unit">unit</label>
              <input type="text" id="unit" name="unit" />
            </div>
          </div>
        )}
        <div className="form-input">
          <label htmlFor="frequency">frequency</label>
          <select
            id="frequency"
            name="frequency"
            value={frequency}
            onChange={handleFrequencyChange}
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
          </select>
        </div>
        {frequency == "daily" && (
          <div className="form-dow-input">
            <label htmlFor="days_of_week">Days of week</label>
            <ul className="dow-input-list" id="days_of_week">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <li className="input-list-item" key={day}>
                  <input type="checkbox" name={day} defaultChecked={true} />
                  {day}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" disabled={isPending}>
          Create
        </button>
      </form>
    </div>
  );
}
export default CreateHabit;
