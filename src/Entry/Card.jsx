import { useState, useCallback, useEffect, useRef } from "react";
import { useUpdateEntry } from "./entryQueryHooks";
import { useEntryContext } from "./context";

function EntryCard({ id, completed, value, habit }) {
  const { selectedDate } = useEntryContext();
  const { mutate: updateEntry } = useUpdateEntry(selectedDate);

  const [isDirty, setIsDirty] = useState(false);
  const [inputValue, setInputValue] = useState(() =>
    habit ? Math.min(Number(value), Number(habit.target)) : Number(value),
  );
  const [isCompleted, setIsCompleted] = useState(() =>
    habit
      ? habit.type === "count"
        ? Number(value) >= Number(habit.target)
        : completed
      : completed,
  );

  const isDirtyRef = useRef(false);
  const inputValueRef = useRef(inputValue);
  const isCompletedRef = useRef(isCompleted);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  useEffect(() => {
    isCompletedRef.current = isCompleted;
  }, [isCompleted]);

  const sendUpdate = useCallback(
    (val, comp = isCompleted) => {
      const newCompleted =
        habit.type === "count" ? val >= Number(habit.target) : comp;
      updateEntry({ id, value: val, completed: newCompleted });
      setIsCompleted(newCompleted);
      isCompletedRef.current = newCompleted;
    },
    [habit, id, isCompleted, updateEntry],
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDirty(false);
    isDirtyRef.current = false;
  };

  const handleButtonClick = (name) => {
    const delta =
      Math.round(habit.target / 10) >= 1 ? Math.round(habit.target / 10) : 1;
    const newValue =
      name === "increase"
        ? Math.min(inputValue + delta, Number(habit.target))
        : Math.max(inputValue - delta, 0);
    setInputValue(newValue);
    setIsDirty(true);
    isDirtyRef.current = true;
  };

  const handleToggleCompleted = () => {
    if (habit.type === "count") {
      setInputValue(!isCompleted ? habit.target : 0);
      sendUpdate(!isCompleted ? habit.target : 0, !isCompleted);
    } else sendUpdate(inputValue, !isCompleted);
  };

  // triggers on input blur and tab change
  const handleInputValidation = useCallback(() => {
    const clamped = Math.min(
      Math.max(Number(inputValue), 0),
      Number(habit.target),
    );
    setInputValue(clamped);
    setIsDirty(false);
    isDirtyRef.current = false;
    sendUpdate(clamped);
  }, [habit, inputValue, sendUpdate]);

  useEffect(() => {
    if (!habit || habit.type !== "count") return;
    const clamped = Math.min(Number(value), Number(habit.target));
    if (clamped !== Number(value)) {
      inputValueRef.current = clamped;
      updateEntry({ id, value: clamped, completed: true });
    }
  }, [habit]);

  // debounce timer
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      sendUpdate(inputValue);
      setIsDirty(false);
      isDirtyRef.current = false;
    }, 1000);
    return () => clearTimeout(timer);
  }, [inputValue, isDirty, sendUpdate]);

  // flush on unmount
  useEffect(() => {
    return () => {
      if (isDirtyRef.current) {
        const newCompleted =
          habit.type === "count"
            ? inputValueRef.current >= Number(habit.target)
            : isCompletedRef.current;
        updateEntry({
          id,
          value: inputValueRef.current,
          completed: newCompleted,
        });
      }
    };
  }, []);

  // flush on tab hide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleInputValidation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleInputValidation]);

  return (
    <div className="entry">
      <div className="entry-info">
        <h2 title={habit.title}>{habit.title}</h2>
        <p title={habit.description}>{habit.description || "No description"}</p>
      </div>
      <div className="entry-progress">
        {habit.type === "count" && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-parameters">
                <input
                  type="number"
                  className="no-arrows"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputValidation}
                />
                <span>{habit.target}</span>
              </div>
              <progress value={inputValue} max={habit.target} />
              <div className="progress-unit">
                <span>{habit.unit}</span>
              </div>
            </div>
            <div className="progress-controls">
              <button onClick={() => handleButtonClick("increase")}>+</button>
              <button onClick={() => handleButtonClick("decrease")}>-</button>
            </div>
          </div>
        )}
        <button
          className={`progress-completed ${isCompleted && "complete"}`}
          onClick={handleToggleCompleted}
        ></button>
      </div>
    </div>
  );
}

export default EntryCard;
