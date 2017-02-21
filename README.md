#ToDoList-VanillaJS

Todo List Assignment

Summary

Implement a simple todo list application on a client-side using JavaScript, HTML, CSS.

Functional features to implement:

1.	List all tasks in a table fashion. 
    a.	Each task is just a task contents (plain text; potentially multilined). 
    b.	Sorting: 
        i.	task creation date descending (newest on top);
        ii.	completed tasks go to the bottom of the list.

2.	Add a new task to the list via the textarea displayed above the task list table. 

3.	Complete a task. User should be able to do that by clicking a button displayed next to the task. 
Button should only appear upon the table row hover.

4.	Inline editing of a task details.
    a.	User should be able to enter the edit mode by double-clicking the task text. 
    b.	In the edit mode static text is replaced with a textarea with task contents in it.
    c.	“Save” and “Cancel” buttons are displayed next to the textarea.
    d.	Pressing “Save” button should cause the update of the task contents.
    e.	“Cancel” resets the changes made to the task contents. 
    f.	Leaving the edit mode should cause back-replacing of the textarea with the static task contents (see p.1).
    g.	Potentially user can be editing several tasks at once. 
    h.	Tasks cannot be completed while in the “editing” state.

5.	Task validation.
    a.	Task contents must have at least one alphanumeric character. 
    b.	An attempt to create or update task contents which do not pass the validation must result in 
    a validation error displayed to a user.

Requirements:

1.	 Consistent and well-designed architecture:
    a.	UI is built in a component approach.
    b.	Model provides an API; API is covered with unit tests.
    c.	Model must be designed with the server synchronization or HTML5 localstorage persistence in mind. 
    d.	Model and UI layers are not coupled. Ideally, an async command/event approach is used to communicate 
    between UI and Model, so that UI has no compile dependencies on Model API and vice versa.

2.	No external JS frameworks should be used except for jQuery, if needed.

3.	Unit testing framework of choice can be used.

4.	CSS & HTML implemented should provide a decent UX and do not look ugly. However, that’s not an important 
part of the task. To implement the UI part faster, the usage of CSS frameworks like Twitter Bootstrap CSS is 
acceptable.


