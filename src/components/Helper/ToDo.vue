<template>
  <div class="container">
    <close-outline
      style="
        width: 20px;
        height: 20px;
        position: absolute;
        top: 5px;
        right: 5px;
      "
      @click="closeTodo"
    />
    <div style="color: white" class="header">
      <h4 style="padding: 0; margin: 8px 0px">Set Goals</h4>
      <div id="todostatus">
        <div
          style="
            height: 100%;
            position: absolute;
            left: 50%;
            border: 1px solid rgba(242, 116, 0, 0.33);
          "
        />
        <div id="totalNum">
          <span id="totalToDos" class="countData">{{ pendingTodoNum }}</span
          ><span class="countName">Pending</span>
        </div>
        <div id="totalComp">
          <span id="totalCompleted" class="countData">{{
            completedTodoNum
          }}</span>
          <span class="countName" id="comp">Completed</span>
        </div>
      </div>
    </div>
    <div id="input-container">
      <div class="listItem">
        <input
          type="text"
          v-model="newToDoName"
          placeholder="What's next?..."
          @keydown.enter="addToDo"
          @keydown.esc="removeTodo(todo[0].id)"
        />
      </div>
      <button
        class="addBtn"
        style="background-color: transparent; border: none; color: white"
        @click="addToDo"
      >
        <AddOutline style="width: 20px; height: 20px" />
        <span style="font-size: 1rem"> Add</span>
      </button>
    </div>
    <div id="todoList" v-for="todos in todo" :key="todos.id">
      <div class="listItem">
        <div style="width: 100%" v-if="todos.done">
          <div class="todoNameDone" @click="toggleTodo(todos.id)">
            <span>{{ todos.name }}</span>
            <div>
              <button
                @click="removeTodo(todos.id)"
                style="background-color: transparent; border: none"
              >
                <TableDeleteRow16Regular
                  style="width: 15px; height: 15px; color: black"
                />
              </button>
            </div>
          </div>
        </div>
        <div v-else style="width: 100%">
          <div class="todoName">
            <span>{{ todos.name }}</span>
            <div>
              <button
                @click="toggleTodo(todos.id)"
                style="background-color: transparent; border: none"
              >
                <CheckboxOutline
                  style="width: 15px; height: 15px; color: #4caf50"
                />
              </button>
              <button
                @click="removeTodo(todos.id)"
                style="background-color: transparent; border: none"
              >
                <TrashBinOutline
                  style="width: 15px; height: 15px; color: #f27400"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-for="list in completedTodo" :key="list.id">
      <div>{{list.name}}</div>
    </div> -->

    <div
      v-if="todo.length === 0"
      style="display: flex; flex-direction: column; align-items: center"
    >
      <img src="../../assets/images/image-9.png" alt="empty image" />
      <p style="font-size: 10px; text-align: center">
        Looks like there are no goals on your list yet. Don't worry, every
        journey starts with a single step! You can begin by adding your first
        goal below.
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import {
  CloseOutline,
  AddOutline,
  TrashBinOutline,
  CheckboxOutline,
} from "@vicons/ionicons5";
import { TableDeleteRow16Regular } from "@vicons/fluent";

interface Todo {
  id: number;
  name: string;
  done: boolean;
}

export default defineComponent({
  setup(props, { emit }) {
    let todo = ref<Todo[]>([]);
    const newToDoName = ref<string>("");
    const todoId = ref<number>(0);
    let count = ref<number>(0);
    // let completedTodo = ref<Todo[]>([]);

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
        done: false,
      });
      newToDoName.value = "";
      writeLocalStorage();
    };

    const removeTodo = (id: number) => {
      todo.value.splice(
        todo.value.findIndex((Todo) => Todo.id === id),
        1
      );
      count.value++;
      writeLocalStorage();
    };

    const toggleTodo = (id: number) => {
      todo.value = todo.value.map((ToDo) => {
        if (ToDo.id === id) {
          ToDo.done = !ToDo.done;
          // completedTodo.value.push(ToDo);
        }
        return ToDo;
      });
      writeLocalStorage();
    };
    const completedTodoNum = computed(() => {
      return todo.value.filter((ToDo) => ToDo.done).length;
    });

    readLocalStorage();

    function closeTodo() {
      emit("close");
    }

    const pendingTodoNum = computed(() => {
      return todo.value.length - completedTodoNum.value;
    });

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
      closeTodo,
      pendingTodoNum,
      // completedTodo,
    };
  },
  emits: ["close"],
  components: {
    CloseOutline,
    AddOutline,
    TrashBinOutline,
    CheckboxOutline,
    TableDeleteRow16Regular,
  },
});
</script>

<style scoped>
.container {
  width: 330px;
  padding: 0 30px;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(252, 252, 252, 0.12);
  border-radius: 8px;
  box-sizing: border-box;
  color: white;
}

#todostatus {
  display: flex;
  background-color: #fdd199;
  border-radius: 15px;
  justify-content: space-evenly;
  color: #5f00d7;
  height: 57px;
  position: relative;
}

#totalNum,
#totalComp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.countData {
  font-weight: 600;
}
.header {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  z-index: 2;
}
.header h2 {
  font-size: 1rem;
  font-weight: bold;
}
.header #todostatus {
  font-size: 1.2rem;
  font-weight: 500;
  z-index: 2;
}
.totalComp {
  border-right: 5px solid #f27400;
}

#totalCompleted {
  color: #9c0000;
}
#comp {
  color: #9c0000;
}
.countName {
  font-size: 0.5rem;
}
input {
  height: 25px;
  border-radius: 99px;
  background-color: #353535;
  border: 1px solid white;
  outline: none;
  color: white;
  padding: 4px 16px;
  z-index: 2;
  margin-top: 20px;
  margin-bottom: 22px;
}

.addBtn {
  display: flex;
}
#input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
.listItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
}

.todoName {
  width: 100%;
  /* height: 30px; */
  padding: 2px 8px;
  border-radius: 5px;
  margin: 12px 0;
  color: black;
  font-weight: 500;
  z-index: 2;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todoNameDone {
  width: 100%;
  /* height: 30px; */
  padding: 2px 8px;
  border-radius: 5px;
  margin: 12px 0;
  color: black;
  font-weight: 500;
  z-index: 2;
  background-color: #f7c856;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
button {
  font-size: 1.2rem;
  border-radius: 8px;
  background: rgb(249, 215, 128);
  cursor: pointer;
  z-index: 2;
}

@media all and (max-width: 601px) {
  .container {
    top: 25%;
    margin-left: 27%;
    padding: 0 15px;
    z-index: 1;
    width: 270px;
  }
  .header h2 {
    font-style: 0.5rem;
  }
  input {
    padding: 4px 8px;
  }
}
</style>
