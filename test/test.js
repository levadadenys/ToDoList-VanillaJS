(function() {
    let parent = document.getElementById('main');
    while(parent.firstChild) parent.removeChild(parent.firstChild);
})();

//////////////////////////////////////////// alert mute
window.alert = '';
////////////////////////////////////////////
function clearTestDiv () {
    let parent = document.querySelector(`#toDoListTest`);
    while(parent.firstChild) parent.removeChild(parent.firstChild);
};


describe('Checking initialization.', function() {
    it('Initiate with existing parentID & without DataUrl.', function() {
        assert.doesNotThrow(() => new ToDoListAPI('toDoListTest'), Error);

        let isCreated = !!document.querySelector(`#toDoListTest #toDoListContainer`);
        assert.equal(isCreated, true);

        clearTestDiv();
    });

    it('Initiate with unexisting parentID & without DataUrl.', function() {
        assert.throws(() => new ToDoListAPI('falseId'), Error);
        
        let isCreated = !!document.querySelector(`#falseId #toDoListContainer`);
        assert.equal(isCreated, false);  
    });

    it('Initiate without parentID & without DataUrl.', function() {
        assert.throws(() => new ToDoListAPI(), Error);
        
        let isCreated = document.querySelector(`#toDoListContainer`);
        assert.equal(!!isCreated, false);  
    });

    it('Initiate with existing parentID & with some DataUrl.', function() {
        assert.doesNotThrow(() => new ToDoListAPI('toDoListTest','http://somesthing.com'), Error);
        
        let isCreated = !!document.querySelector(`#toDoListTest #toDoListContainer`);
        assert.equal(isCreated, true);
        clearTestDiv();
    });
    
});

describe('Checking Adding & Rendering tasks.', function() {
    it('Adding correct task doesn`t raise error and renders it.', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        assert.doesNotThrow(() => document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click), Error);
        
        let newestTask = document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task p`).innerHTML;
        assert.equal(newestTask, newVal);
        clearTestDiv();
    });

        it('Adding correct task doesn`t raise error and renders it. (Very long task)', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis accumsan luctus nulla at posuere. 
        Nam nibh metus, laoreet eget lacinia ut, pellentesque nec leo. Suspendisse egestas congue dolor ac efficitur. 
        Nunc vulputate felis ullamcorper ligula hendrerit consectetur. Etiam tincidunt congue cursus. Donec sollicitudin 
        ligula ac est ornare, sit amet venenatis mi dapibus. Phasellus fermentum pellentesque enim vel interdum.`;

        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        assert.doesNotThrow(() => document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click), Error);
        
        let newestTask = document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task p`).innerHTML;
        assert.equal(newestTask, newVal);
        clearTestDiv();
    });

    it('Adding empty task causes error, task won`t be rendered.', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = '';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;

        assert.throws(todoList.addNewTask, Error);
        
        let newestTask = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task p`);
        assert.equal(newestTask, false);
        clearTestDiv();
    });   
});

describe('Checking Done button & Render', function() {
    it('Marking unFinished task makes this task Finished', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name and unFinished';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);
        
        let newestTask = document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task p`).innerHTML;
        assert.equal(newestTask, newVal);

        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .doneBtn`)
                                            .dispatchEvent(click), Error);

        let isFinished = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .finishedTaskText`);
        assert.equal(isFinished, true);
    });

    it('Marking Finished task is impossible', function() {
        //Using data from the previous test.

        let click = new Event('click');
        assert.throws(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .doneBtn`)
                                        .dispatchEvent(click), Error);

        let isMarkable = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .doneBtn`);

        assert.equal(isMarkable, false);
        clearTestDiv();
    });
    it('Marking task that is editing is impossible', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name and unFinished';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);

        let dblClick = new Event('dblclick');
        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .unFinishedTaskText`)
                                            .dispatchEvent(dblClick));
        assert.throws(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .doneBtn`)
                                        .dispatchEvent(click), Error);

        let isMarkable = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .doneBtn`);

        assert.equal(isMarkable, false);

        let isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, true);
        clearTestDiv();
    });
});

describe('Checking entering Edit mode', function() {
    it('Editing unfinished task works correctly', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name and unFinished';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);
        
        let newestTask = document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task.unFinished p`).innerHTML;
        assert.equal(newestTask, newVal);

        let dblClick = new Event('dblclick');
        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .unFinishedTaskText`)
                                            .dispatchEvent(dblClick));

        let isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, true);
        
        clearTestDiv();
    });

    it('We can edit several tasks at the same moment', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let click = new Event('click');
        let newVal;
        for(let i = 0; i < 3; i++) {
            newVal = `Correct task name and unFinished${i}`;
            document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
            
            document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);
            
            let newestTask = document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task.unFinished p`).innerHTML;
            assert.equal(newestTask, newVal);
        };

        let dblClick = new Event('dblclick');

        for(let i = 0; i < 3; i++) {
            assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks #task${i} .unFinishedTaskText`)
                                                .dispatchEvent(dblClick));
        };

        let isEditing;
        for(let i = 0; i < 3; i++) {
            isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks #task${i} .editTaskTextarea`);
            assert.equal(isEditing, true);
        }
        
        clearTestDiv();
    });

    it('We can`t edit finished task', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name and unFinished';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);

        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .doneBtn`)
                                            .dispatchEvent(click), Error);

        let dblClick = new Event('dblclick');
        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .finishedTaskText`)
                                            .dispatchEvent(dblClick));

        let isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, false);
    
        clearTestDiv();
    });
});

describe('Checking cancel Edit', function() {
    it('There will be no changes in task description if user will press cancel button, but user will leave edit mode', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name and unFinished';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);
        
        let newestTask = document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task.unFinished p`).innerHTML;
        assert.equal(newestTask, newVal);

        let dblClick = new Event('dblclick');
        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .unFinishedTaskText`)
                                            .dispatchEvent(dblClick));

        let isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, true);

        document.querySelector('#toDoListTest .task .editTaskTextarea').value = 'Some other task';
        assert.equal(document.querySelector('#toDoListTest #listOfTasks .task .editTaskTextarea').value, 'Some other task');

        assert.doesNotThrow(() => document.querySelector('#toDoListTest #listOfTasks .task .cancelEditBtn')
                                            .dispatchEvent(click), Error);
        let oldVal = newVal;
        newVal = document.querySelector('#toDoListTest #listOfTasks .task .unFinishedTaskText').innerHTML;

        assert.equal(newVal.trim(),oldVal);

        isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, false);
       
        clearTestDiv();
    });

    it('We can`t edit finished task', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name and unFinished';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);

        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .doneBtn`)
                                            .dispatchEvent(click), Error);

        let dblClick = new Event('dblclick');
        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .finishedTaskText`)
                                            .dispatchEvent(dblClick));

        let isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, false);
    
        clearTestDiv();
    });
});

describe('Checking save Edit', function() {
    it('If task description will be valid: Task description will be saved and rerendered', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name and unFinished';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);
        
        let newestTask = document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task.unFinished p`).innerHTML;
        assert.equal(newestTask, newVal);

        let dblClick = new Event('dblclick');
        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .unFinishedTaskText`)
                                            .dispatchEvent(dblClick));

        let isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, true);

        let checkingVal = 'Some other task';
        document.querySelector('#toDoListTest .task .editTaskTextarea').value = checkingVal;
        assert.equal(document.querySelector('#toDoListTest #listOfTasks .task .editTaskTextarea').value, checkingVal);

        assert.doesNotThrow(() => document.querySelector('#toDoListTest #listOfTasks .task .saveEditBtn')
                                            .dispatchEvent(click), Error);
        
        let currentVal = document.querySelector('#toDoListTest #listOfTasks .task .unFinishedTaskText').innerHTML;

        assert.equal(currentVal.trim(),checkingVal);

        isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, false);
       
        clearTestDiv();
    });

    it('If task description will be invalid: An Error will occur. User will stay in edit mode', function() {
        let todoList = new ToDoListAPI('toDoListTest');
        let newVal = 'Correct task name and unFinished';
        document.querySelector('#toDoListTest #addTaskTextarea').value = newVal;
        let click = new Event('click');
        document.querySelector('#toDoListTest #addTaskBtn').dispatchEvent(click);
        
        let newestTask = document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task.unFinished p`).innerHTML;
        assert.equal(newestTask, newVal);

        let dblClick = new Event('dblclick');
        assert.doesNotThrow(() => document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .unFinishedTaskText`)
                                            .dispatchEvent(dblClick));

        let isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, true);

        let checkingVal = '';
        document.querySelector('#toDoListTest .task .editTaskTextarea').value = checkingVal;
        assert.equal(document.querySelector('#toDoListTest #listOfTasks .task .editTaskTextarea').value, checkingVal);

        assert.throws(() => todoList.saveEdit(document.querySelector('#toDoListTest #listOfTasks .task .saveEditBtn'))
                                            .dispatchEvent(click), Error);

        isEditing = !!document.querySelector(`#toDoListTest #toDoListContainer #listOfTasks .task .editTaskTextarea`);
        assert.equal(isEditing, true);
        
        let currentVal = document.querySelector('#toDoListTest #listOfTasks .task .editTaskTextarea').value;
        assert.equal(currentVal,checkingVal);
        clearTestDiv();
    });
});