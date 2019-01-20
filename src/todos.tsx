import { types, onAction } from "mobx-state-tree";

interface TodoDto {
    id: string,
    title: string,
    done: boolean
}

const Todo = types.model({
  id: types.identifier,
  title: types.string,
  done: false
});

const TodoStore = types
  .model({
    todos: types.array(Todo),
    selectedTodo: types.reference(Todo)
  })
  .views(self => {
    return {
      get completedTodos() {
        return self.todos.filter(t => t.done);
      }
    };
  })
  .actions(self => ({
    addTodo(newTodo: TodoDto) {
      self.todos.push(Todo.create(newTodo));
    },
    changeTodo() {
      self.selectedTodo.title = "Get Done";
    }
  }));

// create a store with a normalized snapshot
const storeInstance = TodoStore.create({
  todos: [
    {
      id: "47",
      title: "Get coffee"
    }
  ],
  selectedTodo: "47"
});

onAction(storeInstance, call => {
  console.log("Action was called: ", call);
});

storeInstance.addTodo({
  id: "48",
  title: "Get suggar",
  done: true
});

storeInstance.changeTodo();

console.dir(storeInstance.completedTodos);
