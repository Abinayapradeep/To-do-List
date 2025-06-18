class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.remainingCount = document.getElementById('remainingCount');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.emptyState = document.getElementById('emptyState');

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.todoInput.addEventListener('input', () => this.updateAddButton());
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTodos());
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const newTodo = {
            id: Date.now().toString(),
            text,
            completed: false
        };

        this.todos.unshift(newTodo);
        this.todoInput.value = '';
        this.updateAddButton();
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompletedTodos() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
    }

    updateAddButton() {
        this.addBtn.disabled = !this.todoInput.value.trim();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        const activeTodos = this.todos.filter(todo => !todo.completed);
        const completedTodos = this.todos.filter(todo => todo.completed);

        this.remainingCount.textContent = `${activeTodos.length} remaining`;
        this.clearCompleted.disabled = completedTodos.length === 0;

        this.todoList.innerHTML = '';

        if (this.todos.length === 0) {
            this.todoList.appendChild(this.emptyState);
            return;
        }

        activeTodos.forEach(todo => {
            this.todoList.appendChild(this.createTodoElement(todo));
        });

        if (completedTodos.length > 0) {
            const completedSection = document.createElement('div');
            completedSection.className = 'completed-section';

            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'section-title';
            sectionTitle.textContent = `Completed (${completedTodos.length})`;
            completedSection.appendChild(sectionTitle);

            completedTodos.forEach(todo => {
                completedSection.appendChild(this.createTodoElement(todo));
            });

            this.todoList.appendChild(completedSection);
        }
    }

    createTodoElement(todo) {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';

        todoItem.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" 
                 onclick="app.toggleTodo('${todo.id}')"></div>
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <button class="delete-btn" onclick="app.deleteTodo('${todo.id}')" title="Delete task">🗑️</button>
        `;

        return todoItem;
    }
}

const app = new TodoApp();
