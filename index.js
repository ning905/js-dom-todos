const todosUL = document.getElementById("todo-list");
const form = document.querySelector("form");

let state;
const updateState = (updated) => {
  state = [...updated];
};

//Complete button
const createCompleteBtn = (todo) => {
  const btn = document.createElement("button");
  btn.style.marginLeft = "1rem";
  getCompleteBtnText(btn, todo);

  listenToCompleteBtn(btn, todo);

  return btn;
};

const getCompleteBtnText = (btn, todo) => {
  if (todo.completed === true) {
    btn.innerText = "Incomplete";
  } else {
    btn.innerText = "Complete";
  }
};

const setTodoComplete = (todo) => {
  fetch(`http://localhost:3000/todos/${todo.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  });
};

const setTodoIncomplete = (todo) => {
  fetch(`http://localhost:3000/todos/${todo.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: false }),
  });
};

const listenToCompleteBtn = (btn, todo) => {
  btn.addEventListener("click", () => {
    if (todo.completed === true) {
      setTodoIncomplete(todo);
    } else {
      setTodoComplete(todo);
    }

    readTodo();
  });
};

//Delete button
const createDeleteBtn = (todo) => {
  const btn = document.createElement("button");
  btn.innerText = "Delete";
  btn.style.marginLeft = "1rem";

  listenToDeleteBtn(btn, todo);

  return btn;
};

const listenToDeleteBtn = (btn, todo) => {
  btn.addEventListener("click", () => {
    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "DELETE",
    });

    readTodo();
  });
};

//HTML
const createTodo = (todo) => {
  const li = document.createElement("li");
  li.innerText = todo.title;

  if (todo.completed) {
    li.classList.add("completed");
  }

  li.append(createCompleteBtn(todo), createDeleteBtn(todo));

  todosUL.append(li);
};

const createTodoList = () => {
  todosUL.innerHTML = "";
  state.forEach((todo) => createTodo(todo));
};

const listenToForm = () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const todo = {
      title: form.title.value,
      completed: false,
    };

    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
      .then((res) => res.json())
      .then((todo) => createTodo(todo));
  });

  form.reset();
};

const readTodo = () => {
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((todos) => {
      updateState(todos);
      createTodoList();
    });
};

const init = () => {
  listenToForm();

  readTodo();
};

init();
