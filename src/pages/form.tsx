import { FormEvent, useEffect, useState } from "react";

export default function Page1() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await (await fetch("/api/todo-list")).json();
      setTodos(data);
    };
    fetchData();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/todos", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });

    const { data } = await response.json();
    setTodos(data);
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" name="todo" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </>
  );
}
