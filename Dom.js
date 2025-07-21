function inputchange() {
    console.log("something is been texted");
}
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    //check the input is not empty
    if (taskText === '') {
        alert("please enter the task!");
        return;
    }
    // create a new list item 
    const listItem = document.createElement("li");
    //create a span to hold the task text
    const taskspan = document.createElement("span");
    taskspan.textContent = taskText;

    // create a delete button
    const deleteButton = document.createElement("deleteButton");
    deleteButton.textContent = "Delete";
    deleteButton.style.colour = "red";

    // deleting task
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(listItem);
    });

    //append tasktext and delete button to the list item 
    listItem.appendChild(taskspan);
    listItem.appendChild(deleteButton);

    //append the list to the task list
    taskList.appendChild(listItem);

    //clear the input 
    taskInput.value = '';
}
);