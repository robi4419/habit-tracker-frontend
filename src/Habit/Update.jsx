import { useFetchHabit, useUpdateHabit } from "./habitQueryHooks";

function UpdateHabit({ habitToEdit }) {
  const { data: habit, isPending, isError, error } = useFetchHabit(habitToEdit);
  const { mutate: updateHabit, isPending: isPendingUpdate } = useUpdateHabit();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { title, description, target, unit, ...days } =
      Object.fromEntries(formData);

    const days_of_week = Object.keys(days).join(",");

    if (title.trim() !== "") {
      const updatedHabit = {
        title,
        description,
        target,
        unit,
        days_of_week,
      };

      updateHabit({ id: habit.id, habitData: updatedHabit });
    }
  };

  if (isPending) {
    return <h1>Pending...</h1>;
  }

  if (isError) {
    return <h1>{error.response?.data?.message || "Something went wrong"}</h1>;
  }

  return (
    <div className="habit-update">
      <h1>Update {habit.title}</h1>
      <form className="habit-form" onSubmit={handleSubmit}>
        <div className="form-input">
          <label htmlFor="title">title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={habit.title}
            required
          />
        </div>
        <div className="form-input">
          <label htmlFor="description">description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={habit.description}
          />
        </div>
        <p>Type: {habit.type == "binary" ? "checkbox" : "with progress"}</p>
        {habit.type == "count" && (
          <div className="input-pair">
            <div className="form-input">
              <label htmlFor="target">target</label>
              <input
                type="number"
                step="any"
                id="target"
                name="target"
                defaultValue={habit.target}
              />
            </div>
            <div className="form-input">
              <label htmlFor="unit">unit</label>
              <input
                type="text"
                id="unit"
                name="unit"
                defaultValue={habit.unit}
              />
            </div>
          </div>
        )}
        <p>Frequency: {habit.frequency}</p>
        {habit.frequency == "daily" && (
          <div className="form-dow-input">
            <label htmlFor="days_of_week">Days of week</label>
            <ul className="dow-input-list" id="days_of_week">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <li className="input-list-item" key={day}>
                  {day}
                  <input
                    type="checkbox"
                    name={day}
                    defaultChecked={habit.days_of_week?.includes(day)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" disabled={isPendingUpdate}>
          Save
        </button>
      </form>
    </div>
  );
}
export default UpdateHabit;
