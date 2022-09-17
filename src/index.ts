import http from "./modules/http";

const Main = async () => {
  const todos = await http.findAll<Todo[]>('/todos');
  console.log(JSON.stringify(todos));
}

Main();