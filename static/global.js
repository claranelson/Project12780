import {constructTable} from './listview.js'

function reset_tasks() {
    source_page = location.pathname.split('/').pop();
    emptytasks(source_page);
    loadtasks(source_page);

}

function loadtasks(source_page) {

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

function pullTaskInputs(inputList) {

    const newTask = new Task();

    inputList.forEach(input => {
        const propertyValue = $(input).val();
        const propertyName = mapIdToProperty(input);
        newTask[propertyName] = propertyValue;
    })

    return newTask
}

function mapIdToProperty(inputId) {
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

function clearInputs(inputList) {
    inputList.forEach(input => {
        $(input).val("");
    })
}

function addTask() {

    var xhttp2 = new XMLHttpRequest();

    var inputIdList = ["#taskdesc", "#taskname", "#duedate",
        "#startdate", "#cats", "#prog", "#stat"
    ];

    //pull values from task input boxes
    const newTask = pullTaskInputs(inputIdList);
    task_string = JSON.stringify(newTask);

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

function editTask() {

    var xhttp2 = new XMLHttpRequest();
    var inputIdList = ["#taskid", "#taskdesc", "#taskname", "#duedate",
        "#startdate", "#cats", "#prog", "#stat"
        ];

    //grab values in the input boxes
    editedTask = pullTaskInputs(inputIdList);
    task_string = JSON.stringify(editedTask);

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

function emptytasks(source_page) {
    if (source_page == 'listview.html') {
        $('#listviewtable').empty();
    } else if (source_page == 'kanbanview.html') {
        $("#In_Progressul").html("");
        $("#Not_Startedul").html("");
        $("#Completeul").html("");
    }

}

export {reset_tasks, loadtasks, pullTaskInputs, mapIdToProperty, clearInputs, addTask, editTask, emptytasks};