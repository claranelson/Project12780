import * as global_module from './global.js';

$(document).ready(function(){
    //these functions make the jQuery UI elements active, making the proper things sortable and datepicker
    $("#startdate").datepicker({dateFormat: "yy-mm-dd"});
    $("#duedate").datepicker({dateFormat: "yy-mm-dd"});

    //define button click methods
    $("#showtasks").click(showtaskentry);
    $("#filter_button").click(filter);
    $("#reset_button").click(reset_filter);
    $("#cancel_addedit").click(canceladdtask);
    $("#add").click(global_module.addTask);
    $("#edit").click(global_module.editTask);

    loader()

    $( ".sortable" ).sortable({
      connectWith: ".connectedSortable",
        receive: taskmoved

      })
  });

function reset_filter() {
    //todo: fill in with old reset function (I think I overwrote it)
}

function loader() {
    //load the categories and the tasks as a callback function
    loadcats(function() {global_module.loadtasks('kanbanview.html')});
}
//
//function Task(id,name, des,start,due,cat,stat,prog)
//{ //task object
//    this.id = id;
//    this.TaskName = name;
//    this.Description = des;
//    this.StartDate = start;
//    this.DueDate = due;
//    this.Categories = cat;
//    this.Status = stat;
//    this.Progress = prog;
//}
//
//function Category(id,name,color) {
//    //category object
//    this.catid = id;
//    this.catname = name;
//    this.catcolor = color;
//}

function loadcats(callback) { //pass loadtasks as the callback argument function
    //create categories
    var xhttp = new XMLHttpRequest();
        window.catslist = []; //global variable declaration
        // tasks = []; //global variable declaration
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState == 4 && xhttp.status == 200)
            {   //parse the string returned by the http.responseText
                //this code was modelled after examples used in class for the drawing management system
                // var JSONstring = xhttp.responseText;
                // var categorystrings = JSONstring.split(";");
                var JSONstring = xhttp.responseText;
                var json_obj = JSON.parse(JSONstring);

                //grab the select boxes that will need to be filled
                var categoryselect = $("#cats");
                var filterselect = $("#catfilt");
                filterselect.append($('<option/>'));
                // categoryselect.append($('<option/>'));

                // optionstring = "<option>N/A</option>"; //add initial option

                for (var i = 0; i < json_obj.length;i++) {
                    var category = json_obj[i]["fields"];
                    var newcat = new global_module.Category(json_obj[i]["pk"],category.CatName,category.Color);
                    catslist.push(newcat);

                    var newopt = $('<option/>');
                    newopt.html(newcat.catname);
                    console.log(newopt);
                    categoryselect.append($('<option>', {
                        value: newcat.catname,
                        text: newcat.catname
                    }));
                    // categoryselect.append(newopt);
                    filterselect.append(newopt);
                }

                // for(var i = 0; i<categorystrings.length;i++) {

                //     var catstring = categorystrings[i];
                //     var attributeStrings = catstring.split(",");

                //     //Create category object
                //     var newcat = new Category(attributeStrings[0],attributeStrings[1],attributeStrings[2]);
                //     catslist.push(newcat); //add category to global variable catslist so that the colors can be retrieved

                //     //create string that can be added to the relevent select boxes
                //     optionstring = optionstring + "<option>" + attributeStrings[1] + "</option>";

                // }
                // categoryselect.html(optionstring);
                // filterselect.html(optionstring);
                callback(); //calls the loadtasks function

            }

        };
    xhttp.open("GET", "/loadCats/", true);
    xhttp.send();

}

//function loadtasks() {
//    //many parts of this code were modelled after the drawings example used in close
//    $("#addtask").hide();
//    var xhttp = new XMLHttpRequest();
//    window.tasks = []; //global variable declaration
//    xhttp.onreadystatechange = function() {
//        if(xhttp.readyState == 4 && xhttp.status == 200)
//        {   //parse string to get tasks
//            var JSONstring = xhttp.responseText;
//            var json_obj = JSON.parse(JSONstring);
//            createcards(json_obj);
//            // console.log(window.tasks);
//
//
//        }
//
//    };
//
//    xhttp.open("GET", "/loadTasks/",true);
//    xhttp.send();
//}

function createcards(list) {

    for (var i = 0; i < list.length; i++) {
        const task = createCard(list[i]);
        window.tasks.push(task);

    }

}

function createCard(list_task) {

    //column and field are used more or less interchangeably here as it is modified from the listview

    var task = new global_module.Task();

    var card = $('<li/>');

    var card_info = $('<ul/>');

    const card_fields = ["TaskName", "Categories","DueDate", "Status", "Description","StartDate","Progress"];
    const show_field = ["TaskName", "Categories","DueDate"]
    const card_labels = ["Name", "Category", "Due Date"];

    const fields = list_task["fields"];

    //add ID separately
    var db_id = list_task["pk"];
    var id_field = $('<li/>');
    id_field.html(db_id);
    id_field.css("visibility","hidden");
    id_field.attr("id","taskid");
    card_info.append(id_field);

    task.id = db_id;

    //cycle through fields we want on the card and fill the fields if there's one in our JSON
    for (var colIndex = 0; colIndex < card_fields.length; colIndex++) 
    {
        var colname=card_fields[colIndex];
        var val = list_task["fields"][colname];

        if (val == null) val = "N/A";

        if (colname != "Status") {
            const field_li = $('<li/>');
            field_li.html(card_labels[colIndex]+ ": " + String(val));
            card_info.append(field_li);
            if (show_field.indexOf(colname) < 0) {// check if colname in show_field list
                //if it's not in the list
                field_li.css("visibility","hidden");

            }
        }
        

        //add to object for housekeeping
        task[colname] = val;

    }


    //assign category colors
    //assign backup color
    var category_color = "white";
    console.log(catslist);
    //find the category color
    for (var j = 0; j<catslist.length;j++) { //cycle through categories and see if the category of the task matches the category of each category object
        if (j==0) {
            console.log(catslist[j]);
            console.log(task.Categories);
            console.log(task.Categories.length);
        }
        if (catslist[j].catname.trim() == task.Categories) { //if it matches
            //set catcol to the color for that category
            category_color = catslist[j].catcolor;

        }
    }
    console.log(category_color);
    //add attributes
    card.addClass("card");
    card.css("background-color",category_color);
    card_info.addClass("card_info");
    card.append(card_info);
//    card.attr("ondblclick", "edittaskopen(" + String(db_id)+ ")");
    card.dblclick({tasknum: db_id}, global_module.edittaskopen)

    if (task.Status == "Not started") {
        var tagname = "#Not_Startedul";
    } else if (task.Status == "In Progress"){
         var tagname = "#In_Progressul";
    }else {
        var tagname = "#Completeul";
    }
    $(tagname).append(card); //add task to column

    return task;


}


function filter() {
    var name = $("#namefilter").val();
    var stat = $("#statfilter").val();
    var cur = $("#currentfilt").val();
    var cat = $("#catfilt").val();
    var xhttp = new XMLHttpRequest();

    //starting here, we're doing a similar thing to loadtasks, but it's just easier to repeat the function than do it more smoothly
    //in a final version, these would be streamlined so this part was just one function
    //given all the times this function was changed, it probably would have saved time over all to create a separate function used in both loadtasks and filter
    //please see the loadtasks function for comments and explanations
    window.tasks = [];
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            //need to clear the kanban board
            $("#In_Progressul").html("");
            $("#Not_Startedul").html("");
            $("#Completeul").html("");

            //get response text
            var JSONstring = xhttp.responseText;
            var json_obj = JSON.parse(JSONstring);
            createcards(json_obj);

            // }

        }

    };
    //create the arguments to be sent to the filter function and send the request
    //do not include the name filter if it hasn't been changed
    if (name == "None" || name == "") {
        xhttp.open("GET","/filter?stat="+stat+"&cur="+cur+"&cat="+cat,true);
    } else {
        xhttp.open("GET", "/filter?namefilt=" + name + "&stat=" + stat + "&cur=" + cur + "&cat="+cat, true);
    }
    xhttp.send();
}
//
//function edittaskopen(idarg) {
//    //open the edit task menu and fill all the input boxes with the correct values for the task
//    $("#addtask").show(); //open the menu
//    $("#add").hide(); //hide the add task button
//    $("#edit").show();
//    var index = 0;
//    //find the index of the task in the tasks global variable that was created when tasks were loaded
//    for(var i = 0; i<window.tasks.length;i++) {
//        if (window.tasks[i].id==idarg.toString()) {
//            index = i;
//        }
//    }
//    //grab the task object from the list using that index
//    var currenttask = window.tasks[index];
//
//    //fill the input boxes with the task attributes
//    $("#taskdesc").val(currenttask.Description);
//    $("#taskname").val(currenttask.TaskName);
//    $("#duedate").val(currenttask.DueDate);
//    $("#startdate").val(currenttask.StartDate);
//    $("#cats").val(currenttask.Categories);
//    $("#prog").val(currenttask.Progress);
//    $("#stat").val(currenttask.Status);
//    $("#taskid").val(currenttask.id);
//}

function taskmoved(event,ui) {
    //change the status of the task when it's moved
    var xhttp2 = new XMLHttpRequest();
    var taskcard = ui.item; //get the card that was moved
    console.log(taskcard.html());
    var taskid = taskcard.find("#taskid").html(); //get the inner html of the part with ID "#taskid", which will be the ID of the task
    console.log(taskid);

    var newstatid = $(this).attr('id'); //get the HTML ID of the column the task was moved to

    //based on what the column's ID was, determine the new status of the task
    if (newstatid == "Not_Startedul") {
        var newstatus = "Not started";
    } else if (newstatid == "In_Progressul") {
        var newstatus = "In Progress";
    } else {
        var newstatus = "Complete"
    }

    //send HTTP request with the task's ID and new status
    xhttp2.open("GET", "/editTaskstatus?ID="+String(taskid)+"&Status="+ newstatus, true);
    xhttp2.send();
}
//
//function addTask() {
//
//    var xhttp2 = new XMLHttpRequest();
//
//    //grab values in input boes
//    var descr = $("#taskdesc").val();
//    var name = $("#taskname").val();
//    var due = $("#duedate").val();
//    var start = $("#startdate").val();
//    var cat = $("#cats").val();
//    var prog = $("#prog").val();
//    var stat = $("#stat").val();
//
//    xhttp2.onreadystatechange = function() {
//        if(xhttp2.readyState == 4 && xhttp2.status == 200)
//        {
//            //need to clear the kanban board
//            $("#In_Progressul").html("");
//            $("#Not_Startedul").html("");
//            $("#Completeul").html("");
//
//            //clear input boxes
//            $("#taskdesc").val("");
//            $("#taskname").val("");
//            $("#duedate").val("");
//            $("#startdate").val("");
//            $("#cats").val("");
//            $("#prog").val("");
//            $("#stat").val("");
//            $("#taskid").val("");
//
//            //now load
//            loadtasks();
//
//        }};
//    //send http with task attributes
//    // xhttp2.open("GET", "/addTask?", true);
//    // var csrftoken = getCookie('csrftoken');
//    xhttp2.open("POST", "/addTask/");
//    xhttp2.send("TaskName="+name+"&Description="+descr+"&DueDate="+due+"&StartDate="+start+"&Categories="+cat+"&Progress="+prog+"&Status="+ stat)
//
//
//    // xhttp2.send();
//
//    $("#addtask").hide();
//
//    }

// from Django docs to get csrf token using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//
//function editTask() {
//
//    var xhttp2 = new XMLHttpRequest();
//
//    //grab the input boxes' values
//    var id = $("#taskid").val();
//    var descr = $("#taskdesc").val();
//    var name = $("#taskname").val();
//    var due = $("#duedate").val();
//    var start = $("#startdate").val();
//    var cat = $("#cats").val();
//    var prog = $("#prog").val();
//    var stat = $("#stat").val();
//
//    xhttp2.onreadystatechange = function() {
//        if(xhttp2.readyState == 4 && xhttp2.status == 200)
//        {    //need to clear the kanban board
//            $("#In_Progressul").html("");
//            $("#Not_Startedul").html("");
//            $("#Completeul").html("");
//
//            //clear the values in the input boxes
//            $("#taskdesc").val("");
//            $("#taskname").val("");
//            $("#duedate").val("");
//            $("#startdate").val("");
//            $("#cats").val("");
//            $("#prog").val("");
//            $("#stat").val("");
//            $("#taskid").val("");
//            loadtasks();
//
//        }};
//    //send http with the attributes
//    xhttp2.open("GET", "/editTask?ID="+id+"&TaskName="+name+"&Description="+descr+"&DueDate="+due+"&StartDate="+start+"&Categories="+cat+"&Progress="+prog+"&Status="+ stat, true);
//    xhttp2.send();
//    //hide the menu
//    $("#addtask").hide();
//
//    }

function canceladdtask() {
    //cancel the add task menu
    $("#addtask").hide();
}

function showtaskentry() {
    //open the task entry menu
    $("#addtask").show();
    $("#add").show();
    $("#edit").hide(); //hide the edit task button

    //ensure the values are clear
    $("#taskdesc").val("");
    $("#taskname").val("");
    $("#duedate").val("");
    $("#startdate").val("");
    $("#cats").val("");
    $("#prog").val("");
    $("#stat").val("");

}

//function reset() { //reset the contents of the Kanban board
//    $("#In_Progressul").html("");
//    $("#Not_Startedul").html("");
//    $("#Completeul").html("");
//    loadtasks()
//}

export {createcards};