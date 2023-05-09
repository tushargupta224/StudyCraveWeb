<template>
  <div class="container">
    <div style="color: white" class="header">
      <h2>Set Goals</h2>
      <div id="todostatus">
        <div id="totalComp">
          <span id="totalCompleted" class="countData">{{
            count
          }}</span>
          <span class="countName" id="comp">Comp.</span>
        </div>
        <div id="totalNum">
          <span id="totalToDos" class="countData">{{ todo.length }}</span><span class="countName">Total</span>
        </div>
      </div>
    </div>
    <div id="input-container">
      <div class="listItem">
        <input
          type="text"
          v-model="newToDoName"
          placeholder="Set your goals here"
          @keydown.enter="addToDo"
          @keydown.esc="removeTodo(todo[0].id)"
        />
      </div>
    </div>
    <div id="todoList" v-for="todos in todo" :key="todos.id">
      <div class="listItem">
        <div
          v-if="todos.done"
          class="todoNameDone"
          @click="toggleTodo(todos.id)"
        >
          {{ todos.name }}
        </div>
        <div v-else class="todoName" @click="toggleTodo(todos.id)">
          {{ todos.name }}
        </div>
        <div>
          <button @click="removeTodo(todos.id)">×</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { count } from "console";
import { defineComponent, ref, computed } from "vue";

interface Todo {
  id: number;
  name: string;
  done: boolean;
}

export default defineComponent({
  setup() {
    let todo = ref<Todo[]>([]);
    const newToDoName = ref<string>("");
    const todoId = ref<number>(0);
    let count = ref<number>(0);

    const readLocalStorage = () => {
      const data = localStorage.getItem("todo");
      if (data) {
        todo.value = JSON.parse(data);
        todoId.value = todo.value.length;
      }
    };
    const writeLocalStorage = () => {
      localStorage.setItem("todo", JSON.stringify(todo.value));
    };

    const addToDo = () => {
      todo.value.push({
        id: todoId.value++,
        name: newToDoName.value || "New ToDo",
        done: true,
      });
      
      newToDoName.value = "";
      writeLocalStorage();
    };

    const removeTodo = (id: number) => {
      todo.value.splice(
        todo.value.findIndex((Todo) => Todo.id === id),
        1
      );
      count.value++
      writeLocalStorage();
    };

    const toggleTodo = (id: number) => {
      todo.value = todo.value.map((ToDo) => {
        if (ToDo.id === id) {
          ToDo.done = !ToDo.done;
        }
        return ToDo;
      });
      writeLocalStorage();
    };
    const completedTodoNum = computed(() => {
      return todo.value.filter((ToDo) => ToDo.done).length;
    });

    readLocalStorage();

    return {
      readLocalStorage,
      writeLocalStorage,
      addToDo,
      removeTodo,
      completedTodoNum,
      todo,
      newToDoName,
      todoId,
      toggleTodo,
      count,
    };
  },
});
</script>

<style scoped>
.container {
  width: 200px;
  /* height: 400px; */
  margin-top: 1%;
  margin-left: 15%;
  border: 1px solid white;
  padding: 0 30px;
  border-radius: 12px;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(17, 25, 40, 0.75);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  z-index: 2;
  position: fixed;
}
.header {
  display: flex;
  justify-content: space-between;
  z-index: 2;
}
.header h2 {
  font-size: 1.4rem;
  font-weight: bold;
}
.header #todostatus {
  font-size: 2rem;
  font-weight: bold;
  z-index: 2;
}
#totalCompleted{
  color: green;
}
#comp{
  color: green;
}
.countName{
    font-size: 0.5rem;
}
input {
  height: 25px;
  border-radius: 8px;
  background-color: transparent;
  border: 2px solid white;
  outline: none;
  color: white;
  padding-left: 4%;
  z-index: 2;
  margin-top: 5px;
  margin-bottom: 22px;
}
.listItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
}
.todoNameDone {
  width: 175px;
  height: 30px;
  border: 2px solid white;
  padding-left: 4%;
  margin: 12px 0;
  border-radius: 12px;
  color: white;
  z-index: 2;
}
button {
  font-size: 1.2rem;
  border-radius: 8px;
  background: rgb(249, 215, 128);
  cursor: pointer;
  z-index: 2;
}

@media all and (max-width: 601px){
  .container{
    top: 25%;
    margin-left: 25%;
    padding: 0 15px;
    z-index: 1;
  }
  .header h2{
    font-style: 0.5rem;
  }
}
</style>
