'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else {
            alert('Нельзя добавить пустое дело!');
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', () => {
            if (event.target.classList.contains('todo-remove')) {
                this.deleteItem(event);
            } else if (event.target.classList.contains('todo-complete')) {
                this.completedItem(event);
            } else if (event.target.classList.contains('todo-edit')) {
                this.editItem(event);
            }
        });
    }

    deleteItem(e) {
        this.todoData.forEach(item => {
            if (item.key === e.path[2].key) {
                this.todoData.delete(item.key);
            }
            this.render();
        });
    }

    completedItem(e) {
        this.todoData.forEach(item => {
            if (item.key === e.path[2].key) {
                if (item.completed) {
                    item.completed = false;
                } else {
                    item.completed = true;
                }
            }
            this.render();
        });
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-edit"></button>
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.handler();
        this.render();
    }
}




const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
