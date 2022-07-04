const todosUL = document.getElementById("todo-list");
const form = document.querySelector("form");

let state = [];
const updateState = (updated) => {
  state = [...updated];
};

const getTodos = () => {
  //  console.log("getTodos() called");
  fetch("http://localhost:3000/todos")
    .then(function (res) {
      return res.json();
    })
    .then(function (todos) {
      updateState(todos);
      //console.log("todos updated", state);
      createTodoList();
    });
};

const postTodo = (todo) => {
  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: todo,
      completed: false,
    }),
  });
};

const completeTodo = (id) => {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  });
};

const incompleteTodo = (id) => {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: false }),
  });
};

const toggleTodoStatus = (todo) => {
  if (todo.completed === true) {
    incompleteTodo(todo.id);
  } else {
    completeTodo(todo.id);
  }
};

const toggleBtnText = (btn, todo) => {
  if (todo.completed === true) {
    btn.innerText = "Incomplete";
  } else {
    btn.innerText = "Complete";
  }
};

const deleteTodo = (id) => {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  });
};

const createCompleteBtn = (todo) => {
  const btn = document.createElement("button");
  btn.classList.add("complete-btn");
  btn.style.marginLeft = "1rem";
  toggleBtnText(btn, todo);

  btn.addEventListener("click", () => {
    console.log(todo);
    toggleBtnText(btn, todo);
    toggleTodoStatus(todo);

    render();
  });

  return btn;
};

const createDeleteBtn = (todo) => {
  const btn = document.createElement("button");
  btn.innerText = "Delete";
  btn.classList.add("delete-btn");
  btn.style.marginLeft = "1rem";

  btn.addEventListener("click", (e) => {
    deleteTodo(todo.id);

    render();
  });

  return btn;
};

const createTodo = (todo) => {
  const li = document.createElement("li");
  li.innerText = todo.title;
  if (todo.completed) {
    li.classList.add("completed");
  }
  li.append(createCompleteBtn(todo));
  li.append(createDeleteBtn(todo));
  return li;
};

const createTodoList = () => {
  todosUL.innerHTML = "";
  for (const todo of state) {
    todosUL.append(createTodo(todo));
  }
};

const render = () => {
  getTodos();
};

render();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const todo = e.target[0].value;
  postTodo(todo);
  setTimeout(() => {
    render();
  }, 0);
});
