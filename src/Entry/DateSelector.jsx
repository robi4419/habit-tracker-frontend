import { useEntryContext } from "./context";
import {
  BiSolidChevronLeft,
  BiSolidChevronRight,
  BiSolidChevronsLeft,
  BiSolidChevronsRight,
} from "react-icons/bi";

function DateSelector() {
  const { selectedDate, setSelectedDate, setDirection } = useEntryContext();

  const today = new Date().toLocaleDateString("en-CA");

  const [year, month, day] = selectedDate.split("-").map(Number);
  const dayOfWeek = new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
  });

  const handleChangeDate = (nrOfDays) => {
    setDirection(nrOfDays > 0 ? 1 : -1);
    setSelectedDate((prevDate) => {
      const [year, month, day] = prevDate.split("-").map(Number);
      const newDate = new Date(year, month - 1, day);
      newDate.setDate(newDate.getDate() + nrOfDays);
      const newDateStr = newDate.toLocaleDateString("en-CA");
      return newDateStr > today ? today : newDateStr;
    });
  };

  return (
    <div className="date-selector">
      <button onClick={() => handleChangeDate(-7)}>
        <BiSolidChevronsLeft />
      </button>
      <div className="divider"></div>
      <button onClick={() => handleChangeDate(-1)}>
        <BiSolidChevronLeft />
      </button>
      <div className="current-date">
        <h3>{dayOfWeek}</h3>
        <span>{selectedDate}</span>
      </div>
      <button onClick={() => handleChangeDate(1)}>
        <BiSolidChevronRight />
      </button>
      <div className="divider"></div>
      <button onClick={() => handleChangeDate(7)}>
        <BiSolidChevronsRight />
      </button>
    </div>
  );
}
export default DateSelector;
