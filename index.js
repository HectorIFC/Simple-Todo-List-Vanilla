const myInput = document.getElementById('myInput')
const todoList = document.getElementById('todoList')
const searchTodo = document.getElementById('searchTodo')
const btn_see_all = document.getElementById('see_all')
const btn_actived = document.getElementById('actived')
const btn_complited = document.getElementById('complited')
const btn_clean_complited = document.getElementById('clean_complited')

const counter_clean_complited = document.getElementById('counter_clean_complited')
const counter_complited = document.getElementById('counter_complited')
const counter_see_all = document.getElementById('counter_see_all')
const counter_actived = document.getElementById('counter_actived')

const createNode = (markup) => (new DOMParser().parseFromString(markup, "text/html").body.firstChild)

const removeTodo = (todo) => (todo.remove())
const doneTodo = (todo) => {
  let bool = todo.style.textDecoration === "line-through" ? todo.style.textDecoration = "" : todo.style.textDecoration = "line-through"
  bool ? todo.dataset.status = "complited" : todo.dataset.status = "actived"
	bool ? todo.className += ' active' : todo.className = todo.className.replace(/ active/,'')
}

const createObserver = (element) => {
  let config = {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
    attributeFilter: ["id", "dir", "style", "data"],
  }
  let observer = new MutationObserver((mutations) => {
    mutations.forEach(function(mutation) {
      setCounters()
    })
  })
  observer.observe(element, config)
  return {
    observer: () => observer,
    takeRecords: () => observer.takeRecords(),
    disconnect: () => observer.disconnect(),
  }
}
const setCounters = () => {
  let complited = 0,
    actived = 0
  todoList.childNodes.forEach((todo, index, array) => {
    todo.dataset.status === "complited" ? complited++ : null
    todo.dataset.status === "actived" ? actived++ : null
  })
  counter_clean_complited.textContent = complited
  counter_complited.textContent = complited
  counter_see_all.textContent = actived + complited
  counter_actived.textContent = actived
}
const addTodo = (parentNode, newTodo) => {
  let me = this,
    deletedBtn = createNode('<button class="btn btn-danger">Excluir</button>'),
    doneBtn = createNode('<button class="btn btn-primary">Feito</button>'),
		editBtn = createNode('<button class="btn btn-success">Editar</button>')
  deletedBtn.addEventListener('click', removeTodo.bind(me, newTodo))
  doneBtn.addEventListener('click', doneTodo.bind(me, newTodo))
  newTodo.appendChild(deletedBtn)
  newTodo.appendChild(doneBtn)
	newTodo.appendChild(editBtn)
  return parentNode.appendChild(newTodo)
}
const validInput = (event) => (event.target.value.length > 0 && event.keyCode === 13)
const cleanInput = (event) => (event.target.value = "")
const handleChange = (event) => {
  if (validInput(event)) {
    addTodo(todoList, createNode(`
		<li style="display: flex" class="list-group-item" data-status="actived">
		<div class="row">
		 	<div class="col-md-8">${event.target.value}</div>
  	 	<div class="col-md-4">.</div>
		</div>
		</li>`))
    cleanInput(event)
  }
  createObserver(todoList)
  event.preventDefault()
}
const handleFilter = (event) => {
  if (event.target.value.trim().length > 0) {
    todoList.childNodes.forEach((todo, index, array) => {
      let bool = !todo.textContent.toLowerCase().match(event.target.value.trim().toLowerCase())
      bool ? todo.style.display = "none" : todo.style.display = "block"
    })
  } else todoList.childNodes.forEach((todo, index, array) => todo.style.display = "block")
}
const clean_complited = (event) => {
  todoList.childNodes.forEach((todo, index, array) => {
    let bool = todo.style.textDecoration === "line-through"
    bool ? todo.style.textDecoration = "" : ""
    todo.dataset.status = "actived"
		todo.className = todo.className.replace(/ active/,'')
  })
}
const complited_filter = (event) => {
  todoList.childNodes.forEach((todo, index, array) => {
    let isDone = todo.style.textDecoration === "line-through"
    isDone ? todo.style.display = "block" : todo.style.display = "none"
  })
}
const actived = (event) => {
  todoList.childNodes.forEach((todo, index, array) => {
    let bool = todo.style.textDecoration === ""
    bool ? todo.style.display = "block" : todo.style.display = "none"
  })
}
const see_all = (event) => {
  todoList.childNodes.forEach((todo, index, array) => {
    let bool = todo.style.display === "block"
    bool ? "" : todo.style.display = "block"
  })
}

myInput.addEventListener('keyup', handleChange)
searchTodo.addEventListener('keyup', handleFilter)
btn_clean_complited.addEventListener('click', clean_complited)
btn_complited.addEventListener('click', complited_filter)
btn_actived.addEventListener('click', actived)
btn_see_all.addEventListener('click', see_all)
