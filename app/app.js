class ToDoList {
    constructor (parentId) {
        this.tasks = [];

        //This is a tasks data template.
        //You can uncomment it and ToDoList will be initiated with them.

        // this.tasks = [
        //     {
        //         id : 0,
        //         status : "unFinished",
        //         value : `Just some veeeeeeeeeeeeeeeeeeeeery long task
        //         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et massa maximus, pretium eros non, 
        //         fringilla nisi. Pellentesque nec finibus ante. Etiam eu tellus quis ante lacinia bibendum quis congue sem. 
        //         Fusce feugiat risus eu tincidunt pulvinar. Nunc finibus mi non est mollis consequat. Nulla varius molestie 
        //         purus, et placerat quam interdum non. Nam non fermentum ex. Cras ut ex dignissim, semper lorem placerat, 
        //         rutrum justo. Nullam ex felis, faucibus et interdum vitae, consequat vel tortor.`
        //     },
        //     {
        //         id : 1,
        //         status : "Finished",
        //         value : "Wake up"
        //     },{
        //         id : 2,
        //         status : "Finished",
        //         value : "Watch Godfather"
        //     },{
        //         id : 3,
        //         status : "unFinished",
        //         value : "Become JS ninja"
        //     },{
        //         id : 4,
        //         status : "unFinished",
        //         value : "Buy milk"
        //     }
        // ];

        if(!parentId) throw new Error('Failed to create to do list: You have to define Parent element Id!');
        this.parentId = "#" + parentId;

        this.addNewTask = this.addNewTask.bind(this);
        this.markTaskAsDone = this.markTaskAsDone.bind(this);
        this.editTask = this.editTask.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    initiateToDoList () {
        let container = document.createElement('div');
        container.id = 'toDoListContainer';
        
        let addTaskField = document.createElement('div');
        addTaskField.id = 'addTaskField';
        addTaskField.innerHTML = "<textarea id = 'addTaskTextarea'></textarea><button id = 'addTaskBtn'>Add</button></div>";

        let listOfTasks = document.createElement('div');
        listOfTasks.id = 'listOfTasks';

        container.appendChild(addTaskField);
        container.appendChild(listOfTasks);
        document.querySelector(this.parentId).appendChild(container);

        document.getElementById('addTaskBtn').addEventListener('click', this.addNewTask);
    }

    addNewTask() {   
        try {
            let newTask = {};
            newTask.value = document.querySelector(`${this.parentId} #addTaskTextarea`).value;
            document.querySelector(`${this.parentId} #addTaskTextarea`).value = '';

            if (this.isNotEmptyStr(newTask.value)) {
                newTask.id = (this.tasks.length > 0 ? this.tasks.length : 0);
                newTask.status = 'unFinished';

                this.tasks.push(newTask);
                this.sortTasksForRender();
                this.renderTasks();
            }
        } catch (err) {
            alert(err);
            throw err;
        }
    }

    isNotEmptyStr (str) {
        if (str.length > 0) return true;
        else throw new Error ('Your task description is incorrect! It has to have at least one alphanumeric character.');
    }

    sortTasksForRender() {
        this.tasks = this.tasks.sort((a,b) => b.id - a.id);
        this.tasks = this.tasks.filter((i) => i.status === 'unFinished').concat(this.tasks.filter((i) => i.status === 'Finished'));
    }

    removeChildrenElements (parentId) {
        let parent = document.querySelector(`${this.parentId} #${parentId}`);
        while(parent.firstChild) parent.removeChild(parent.firstChild);
    }

    renderTasks() {
        this.removeChildrenElements('listOfTasks');

        for(let i = 0 ; i < this.tasks.length; i++) {
            let task = document.createElement('div');
            
            task.id = `task${this.tasks[i].id}`;
            if (this.tasks[i].status === 'unFinished') {
                task.className = 'task unFinished';
                task.innerHTML = `<p class = 'unFinishedTaskText'>${this.tasks[i].value}</p><button class = 'doneBtn'>Done</button>`;
            } else if (this.tasks[i].status === 'Finished') {
                task.className = 'task finished';
                task.innerHTML = `<p class = 'finishedTaskText'>${this.tasks[i].value}</p>`;
            }
            
            document.querySelector(`${this.parentId} #listOfTasks`).appendChild(task);
        }

        Array.from(document.querySelectorAll(`${this.parentId} .doneBtn`)).forEach((i) => i.addEventListener('click', this.markTaskAsDone));
        Array.from(document.querySelectorAll(`${this.parentId} .unFinishedTaskText`)).forEach((i) => i.addEventListener('dblclick', this.editTask));
    }

    trimLettersFromid (elementId) {
        return elementId.replace(/[^0-9]/gim, '');
    }

    markTaskAsDone(e) {
        let chosenElementId = e.target.parentElement.id;

        this.tasks.forEach(i => {
            if (i.id == this.trimLettersFromid(chosenElementId)) i.status = 'Finished';
        });
        this.sortTasksForRender();
        this.renderTasks();
    }

    editTask (e) {
        let chosenElementId = e.target.parentElement.id;
        e.target.parentElement.innerHTML = `<textarea class = 'editTaskTextarea'>${
            this.tasks.filter((i) => i.id == this.trimLettersFromid(chosenElementId))[0].value}</textarea>
        <button class = 'saveEditBtn'>Save</button><button class = 'cancelEditBtn'>Cancel</button>`;
        document.querySelector(`${this.parentId} #${chosenElementId} .saveEditBtn`).addEventListener('click', this.saveEdit);
        document.querySelector(`${this.parentId} #${chosenElementId} .cancelEditBtn`).addEventListener('click', this.cancelEdit);
    }

    saveEdit (e) {
        let chosenElementId = e.target.parentElement.id;
        let newValue = document.querySelector(`${this.parentId} #${chosenElementId} textarea`).value;
        try {
            if (this.isNotEmptyStr(newValue)){
                this.tasks.forEach((i) => {
                    if (i.id == this.trimLettersFromid(chosenElementId)) i.value = newValue;
                });
                this.removeChildrenElements(chosenElementId);
                this.renderSpecificTask(chosenElementId);
            }
        } catch (err) {
            alert(err);
            throw err;
        }
    }

    cancelEdit (e) {
        let chosenElementId = e.target.parentElement.id;

        this.removeChildrenElements(chosenElementId);
        this.renderSpecificTask(chosenElementId);
    }

    renderSpecificTask (taskId) {
        document.querySelector(`${this.parentId} #${taskId}`).innerHTML = `<p class = 'unFinishedTaskText'>
        ${this.tasks.filter((i) => i.id == this.trimLettersFromid(taskId))[0].value}</p>
        <button class = 'doneBtn'>Done</button>`;

        document.querySelector(`${this.parentId} #${taskId} .doneBtn`).addEventListener('click', this.markTaskAsDone);
        document.querySelector(`${this.parentId} #${taskId} .unFinishedTaskText`).addEventListener('dblclick', this.editTask);
    }
}


class ToDoListAPI extends ToDoList {
    //How to use: just create instance of ToDoListAPI with parentElementID and dataURL 
    //  => inside of the parentElement will be rendered ToDoList with tasks from dataURL.
    // if we won`t tell dataURL to constructor it will work without server syncronization.
    // if we won`t tell parentElementID to constructor it will throw an error
    // It means that parentId is necessary argument and dataURL is optional.
    constructor (parentId, dataURL) {
        super(parentId);
        this.dataURL = dataURL;
        this.saveEdit = this.saveEdit.bind(this);
        
        if(!!this.dataURL) {
            this.fetchGetTasks();
            this.sortTasksForRender();
        }
        this.initiateToDoList();        
    }

    initiateToDoList() {
        super.initiateToDoList();
        if(this.tasks.length > 0) {
            this.sortTasksForRender()
            this.renderTasks(true)
        };
    }

    renderTasks(isInitial) {
        //When we use render on the initial state tasks will be the same as the tasks from the server,
        // so there`s no need to send tasks to server. In all other cases - each time we render tasks means that tasks
        // were changed, so we have to send new data to server.
        super.renderTasks();
        if (!isInitial && !!this.dataURL) this.fetchPostTasks();
    }

    saveEdit(e) {
        //If changes was saved - we have to upload new data to server. 
        // If task Name will be incorrect it`ll cause an error and data won`t be updated.
        super.saveEdit(e);
        if(!!this.dataURL) this.fetchPostTasks();
    }
    fetchGetTasks() {
        try {
            fetch(this.dataURL, {method: 'GET'})
            .then((response) => {
                this.tasks = response.data;
            });
        } catch (e){
            console.log(e);
            this.tasks = [];
        }
    }

    fetchPostTasks () {
        //Assuming that server holds data sorting it only by tasks` Ids
        try {
            fetch(this.dataURL, {
                method: 'POST', 
                body: this.tasks.sort((a,b) => a.id - b.id)
            });
        } catch (e) {
            console.log(e);
        }
    }
}

let todoList = new ToDoListAPI('main');