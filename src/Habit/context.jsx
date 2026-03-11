import { createContext, useContext, useState } from "react";

const HabitContext = createContext();

export const HabitContextProvider = ({ children }) => {
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [habitToDelete, setHabitToDelete] = useState(null);

  return (
    <HabitContext.Provider
      value={{
        habitToEdit,
        setHabitToEdit,
        habitToDelete,
        setHabitToDelete,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useHabitContext = () => useContext(HabitContext);
