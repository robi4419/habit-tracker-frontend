import { useDeleteHabit, useFetchHabit } from "./habitQueryHooks";
import { useHabitContext } from "./context";

function DeleteHabit() {
  const { habitToDelete, setHabitToDelete } = useHabitContext();
  const {
    data: habit,
    isPending,
    isError,
    error,
  } = useFetchHabit(habitToDelete);
  const { mutate: deleteHabit, isPending: isPendingDelete } = useDeleteHabit();

  if (isPending) {
    return (
      <dialog className="habit-delete" open={habitToDelete != null}>
        Pending...
      </dialog>
    );
  }

  if (isError) {
    return <h1>{error.response?.data?.message || "Something went wrong"}</h1>;
  }

  if (!habit) return;

  return (
    <dialog className="habit-delete" open={habitToDelete != null}>
      <p>
        Are you sure you want to permanently delete this habit?{" "}
        <b>{habit.title}</b>
        <br />
        All entries of this habit will be deleted as well
      </p>
      <div className="delete-controls">
        <button
          onClick={() => setHabitToDelete(null)}
          disabled={isPendingDelete}
        >
          No
        </button>
        <button
          onClick={() => {
            deleteHabit(habit.id);
            setHabitToDelete(null);
          }}
          disabled={isPendingDelete}
        >
          Yes
        </button>
      </div>
    </dialog>
  );
}
export default DeleteHabit;
