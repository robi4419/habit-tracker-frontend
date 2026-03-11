import { EntryContextProvider } from "./context";
import DateSelector from "./DateSelector";
import EntryList from "./List";

function EntriesPage() {
  return (
    <EntryContextProvider>
      <div className="entries-page">
        <DateSelector />
        <EntryList />
      </div>
    </EntryContextProvider>
  );
}
export default EntriesPage;
