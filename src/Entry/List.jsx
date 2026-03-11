import EntryCard from "./Card";
import { useEntryContext } from "./context";
import { useFetchEntries } from "./entryQueryHooks";

function EntryList() {
  const { selectedDate } = useEntryContext();
  const { data: entries, isPending, isError } = useFetchEntries(selectedDate);

  if (isPending) {
    return <h1>Pending...</h1>;
  }

  if (isError) {
    return;
  }

  return (
    <div className="list-container">
      <div className="list-wrap">
        <h2>Daily</h2>
        <div className="list">
          {entries.daily.map((entry) => (
            <EntryCard key={entry.id} {...entry} />
          ))}
          {entries.daily.length == 0 && <h3>No daily habits today</h3>}
        </div>
      </div>
      <div className="list-wrap">
        <h2>Weekly</h2>
        <div className="list">
          {entries.weekly.map((entry) => (
            <EntryCard key={entry.id} {...entry} />
          ))}
          {entries.weekly.length == 0 && <h3>No weekly habits this week</h3>}
        </div>
      </div>
    </div>
  );
}
export default EntryList;
