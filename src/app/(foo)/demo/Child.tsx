import { useDataContext } from "./DataContext";

export default function Child() {
  const data = useDataContext();

  return <div>data: {data}</div>;
}
