import {constructTable} from './listview.js';
import {createcards} from './kanbanview.js';

export function reset_tasks() {
    const source_page = location.pathname.split('/').pop();
    console.log(source_page);
    emptytasks(source_page);
    loadtasks(source_page);

}

export function Category(id,name,color) {
    //category object
    this.catid = id;
    this.catname = name;
    this.catcolor = color;
}

export function edittaskopen(event) {//open add/edit task div and fill in the attributes of the task being edited

    $("#addtask").show(); //show the div
    $("#add").hide(); //ensure add task button is hidden
    $("#edit").show(); //ensure edit task button is showing

    //find index in tasks list that corresponds to the ID of the current task
    var index = 0;
    for(var i = 0; i<tasks.length;i++) {
        if (tasks[i].id==event.data.tasknum.toString()) {
            index = i;
        }
    }

    var currenttask = tasks[index]; //get the objects of the task that was clicked on
    console.log(currenttask);

    //fill the values of the input and select boxes
    $("#taskdesc").val(currenttask.Description);
    $("#taskname").val(currenttask.TaskName);
    $("#duedate").val(currenttask.DueDate);
    $("#startdate").val(currenttask.StartDate);
    $("#cats").val(currenttask.Categories);
    $("#prog").val(currenttask.Progress);
    $("#stat").val(currenttask.Status);
    $("#taskid").val(currenttask.id);
}


export class Task {
    constructor() {
        //todo: assign default values in task
    }

    assignProperties(id,name, descriptions,start,due,category,status,progress) {
        this.id = id;
        this.TaskName = name;
        this.Description = descriptions;
        this.StartDate = start;
        this.DueDate = due;
        this.Categories = categsory;
        this.Status = status;
        this.Progress =progress;
    }

}


export function loadtasks(source_page) {

    //load tasks into table for initial page load
    $("#addtask").hide();
    var xhttp = new XMLHttpRequest();
    window.tasks = []; //create global variable
    console.log("______-----______-----_____-----");
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            //parse the response string JSON and sent to constructTable to make the table
            var JSONstring = xhttp.responseText;
            var json_obj = JSON.parse(JSONstring);
            if (source_page == 'listview.html') {
                tasks = constructTable(json_obj, "#listviewtable");
            } else if (source_page == 'kanbanview.html') {
                createcards(json_obj);
            }

        }

    };
    xhttp.open("GET", "/loadTasks/", true);
    xhttp.send();

}

export function pullTaskInputs(inputList) {

    const newTask = new Task();

    inputList.forEach(input => {
        const propertyValue = $(input).val();
        const propertyName = mapIdToProperty(input);
        newTask[propertyName] = propertyValue;
        console.log(propertyValue);
        console.log(newTask);
    })

    return newTask
}

export function mapIdToProperty(inputId) {
    const map = {
        "#taskdesc": "Description",
        "#taskname": "TaskName",
        "#duedate": "DueDate",
        "#startdate": "StartDate",
        "#cats": "Categories",
        "#prog": "Progress",
        "#stat": "Status",
        "#taskid": "ID",
    };
    return map[inputId];
}

export function clearInputs(inputList) {
    inputList.forEach(input => {
        $(input).val("");
    })
}

export function addTask() {

    var xhttp2 = new XMLHttpRequest();

    var inputIdList = ["#taskdesc", "#taskname", "#duedate",
        "#startdate", "#cats", "#prog", "#stat"
    ];

    //pull values from task input boxes
    const newTask = pullTaskInputs(inputIdList);
    const task_string = JSON.stringify(newTask);

    xhttp2.onreadystatechange = function() {
        if(xhttp2.readyState == 4 && xhttp2.status == 200) {
            //reset the tasks
            reset_tasks();
        }};
    //send attributes to be added to the database
    xhttp2.open("POST", "/addTask/", true);
    xhttp2.send(task_string);
    $("#addtask").hide(); //hide the div so it disappears

    //clear the values of the task input boxes
    clearInputs(inputIdList)

}

export function editTask() {

    var xhttp2 = new XMLHttpRequest();
    var inputIdList = ["#taskid", "#taskdesc", "#taskname", "#duedate",
        "#startdate", "#cats", "#prog", "#stat"
        ];

    //grab values in the input boxes
    const editedTask = pullTaskInputs(inputIdList);
    const task_string = JSON.stringify(editedTask);
    console.log(task_string);

    xhttp2.onreadystatechange = function() {
        if(xhttp2.readyState == 4 && xhttp2.status == 200) {
            //reset listview table
            reset_tasks()
        }};

    xhttp2.open("PUT", "/editTask/", true);
    xhttp2.setRequestHeader("Content-Type", "application/json")
    xhttp2.send(task_string);
    $("#addtask").hide(); //hide div

    //reset all the input and select boxes to be blank
    clearInputs(inputIdList)
}

export function emptytasks(source_page) {
    if (source_page == 'listview.html') {
        $('#listviewtable').empty();
    } else if (source_page == 'kanbanview.html') {
        $("#In_Progressul").html("");
        $("#Not_Startedul").html("");
        $("#Completeul").html("");
    }

}

//export {reset_tasks, loadtasks, pullTaskInputs, mapIdToProperty, clearInputs, addTask, editTask, emptytasks};