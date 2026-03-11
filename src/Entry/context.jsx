import { createContext, useState, useContext } from "react";

const EntryContext = createContext();

export const EntryContextProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toLocaleDateString("en-CA"),
  );

  return (
    <EntryContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </EntryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEntryContext = () => useContext(EntryContext);
