import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const dataContext = createContext("");

export function DataProvider({ children }: PropsWithChildren) {
  const [text, setText] = useState("default data");
  useEffect(() => {
    setTimeout(() => {
      setText("data change");
    }, 4000);
  }, []);
  return <dataContext.Provider value={text}>{children}</dataContext.Provider>;
}

export function useDataContext() {
  return useContext(dataContext);
}
