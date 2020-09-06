

$(document).ready(function(){
    //these functions make the jQuery UI elements active, making the proper things sortable and datepicker
    $("#startdate").datepicker({dateFormat: "yy-mm-dd"});
    $("#duedate").datepicker({dateFormat: "yy-mm-dd"});
    $( ".sortable" ).sortable({
      connectWith: ".connectedSortable",
        receive: taskmoved

      })
  });

function loader() {
    //load the categories and the tasks as a callback function
    loadcats(function() {loadtasks()});
}

function Task(id,name, des,start,due,cat,stat,prog)
{ //task object
    this.id = id;
    this.taskname = name;
    this.description = des;
    this.startdate = start;
    this.duedate = due;
    this.category = cat;
    this.stat = stat;
    this.progressy = prog;
}

function Category(id,name,color) {
    //category object
    this.catid = id;
    this.catname = name;
    this.catcolor = color;
}

function loadcats(callback) { //pass loadtasks as the callback argument function
    //create categories
    var xhttp = new XMLHttpRequest();
        catslist = []; //global variable declaration
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState == 4 && xhttp.status == 200)
            {   //parse the string returned by the http.responseText
                //this code was modelled after examples used in class for the drawing management system
                var JSONstring = xhttp.responseText;
                var categorystrings = JSONstring.split(";");

                //grab the select boxes that will need to be filled
                var categoryselect = $("#cats");
                var filterselect = $("#catfilt");

                optionstring = "<option>N/A</option>"; //add initial option

                for(var i = 0; i<categorystrings.length;i++) {

                    var catstring = categorystrings[i];
                    var attributeStrings = catstring.split(",");

                    //Create category object
                    var newcat = new Category(attributeStrings[0],attributeStrings[1],attributeStrings[2]);
                    catslist.push(newcat); //add category to global variable catslist so that the colors can be retrieved

                    //create string that can be added to the relevent select boxes
                    optionstring = optionstring + "<option>" + attributeStrings[1] + "</option>";

                }
                categoryselect.html(optionstring);
                filterselect.html(optionstring);
                callback(); //calls the loadtasks function

            }

        };
    xhttp.open("GET", "/loadCats/", true);
    xhttp.send();

}

function loadtasks() {
    //many parts of this code were modelled after the drawings example used in close
    $("#addtask").hide();
    var xhttp = new XMLHttpRequest();
    tasks = []; //global variable declaration
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {   //parse string to get tasks
            var JSONstring = xhttp.responseText;
            var tasksstrings = JSONstring.split(";");

            for(var i = 0; i<tasksstrings.length;i++)
            {
                catcol = "white"; //set in case there's no cat color

                //split each task into its task attributes
                var taskstring = tasksstrings[i];
                var attributeStrings = taskstring.split(",");

                //create task attribute
                var newTask = new Task(attributeStrings[0],attributeStrings[1],attributeStrings[2],attributeStrings[3],attributeStrings[4],attributeStrings[5],attributeStrings[6],attributeStrings[7]);
                tasks.push(newTask); //add to task list

                for (var j = 0; j<catslist.length;j++) { //cycle through categories and see if the category of the task matches the category of each category object

                    if (catslist[j].catname == attributeStrings[5]) { //if it matches
                        //set catcol to the color for that category
                        var catcol = catslist[j].catcolor;
                    }
                }
                //create string of list, which is the card, to be added to the proper column
                //also set the color, the on double click event, and the class to card
                //add the proper task attributes to the card
                strTask = "<li ondblclick = edittaskopen(" + attributeStrings[0] + ") style='background-color:"+ catcol + "' class='card'><ul style='list-style:none;padding-left:0;'><li id = 'taskid' style = 'visibility:hidden;'>"+attributeStrings[0]+"</li><li>Name: "+attributeStrings[1]+"</li><li>Category: " + attributeStrings[5]+ "</li><li>Due Date: " + attributeStrings[4] + "</li></ul></li>";

                //find the the id of the column corresponding to the task's status
                if (attributeStrings[6] == "Not started") {
                    var tagname = "#Not_Startedul";
                } else if (attributeStrings[6] == "In Progress"){
                     var tagname = "#In_Progressul";
                }else {
                    var tagname = "#Completeul";
                }
                $(tagname).append(strTask); //add task to column

            }

        }

    };

    xhttp.open("GET", "/loadTasks/",true);
    xhttp.send();
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
    tasks = [];
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            var JSONstring = xhttp.responseText;
            var tasksstrings = JSONstring.split(";");
            //need to clear the kanban board
            $("#In_Progressul").html("");
            $("#Not_Startedul").html("");
            $("#Completeul").html("");


            for(var i = 0; i<tasksstrings.length;i++)
            {

                catcol = "white"; //set to white in case there is no color
                var taskstring = tasksstrings[i];
                var attributeStrings = taskstring.split(",");

                var newTask = new Task(attributeStrings[0],attributeStrings[1],attributeStrings[2],attributeStrings[3],attributeStrings[4],attributeStrings[5],attributeStrings[6],attributeStrings[7]);
                tasks.push(newTask);
                var status = attributeStrings[7];

                for (var j = 0; j<catslist.length;j++) {
                    if (catslist[j].catname == attributeStrings[5]) {
                        var catcol = catslist[j].catcolor;
                    }
                }
                strTask = "<li ondblclick = edittaskopen(" + attributeStrings[0] + ") style='background-color:"+ catcol + "' class='card'><ul style='list-style:none;padding-left:0;'><li id = 'taskid' style = 'visibility:hidden;'>"+attributeStrings[0]+"</li><li>Name: "+attributeStrings[1]+"</li><li>Category: " + attributeStrings[5]+ "</li><li>Due Date: " + attributeStrings[4] + "</li></ul></li>";

                if (attributeStrings[6] == "Not started") {
                    var tagname = "#Not_Startedul";
                } else if (attributeStrings[6] == "In Progress"){
                     var tagname = "#In_Progressul";
                }else {
                    var tagname = "#Completeul";
                }
                $(tagname).append(strTask); //add task to column

            }

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

function edittaskopen(idarg) {
    //open the edit task menu and fill all the input boxes with the correct values for the task
    $("#addtask").show(); //open the menu
    $("#add").hide(); //hide the add task button
    var index = 0;
    //find the index of the task in the tasks global variable that was created when tasks were loaded
    for(var i = 0; i<tasks.length;i++) {
        if (tasks[i].id==idarg.toString()) {
            index = i;
        }
    }
    //grab the task object from the list using that index
    var currenttask = tasks[index];

    //fill the input boxes with the task attributes
    $("#taskdesc").val(currenttask.description);
    $("#taskname").val(currenttask.taskname);
    $("#duedate").val(currenttask.duedate);
    $("#startdate").val(currenttask.startdate);
    $("#cats").val(currenttask.category);
    $("#prog").val(currenttask.progressy);
    $("#stat").val(currenttask.stat);
    $("#taskid").val(currenttask.id);
}

function taskmoved(event,ui) {
    //change the status of the task when it's moved
    var xhttp2 = new XMLHttpRequest();
    var taskcard = ui.item; //get the card that was moved
    var taskid = taskcard.find("#taskid").html(); //get the inner html of the part with ID "#taskid", which will be the ID of the task

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
    xhttp2.open("GET", "/editTaskstatus?ID="+taskid+"&Status="+ newstatus, true);
    xhttp2.send();
}

function addTask() {

    var xhttp2 = new XMLHttpRequest();

    //grab values in input boes
    var descr = $("#taskdesc").val();
    var name = $("#taskname").val();
    var due = $("#duedate").val();
    var start = $("#startdate").val();
    var cat = $("#cats").val();
    var prog = $("#prog").val();
    var stat = $("#stat").val();

    xhttp2.onreadystatechange = function() {
        if(xhttp2.readyState == 4 && xhttp2.status == 200)
        {
            //need to clear the kanban board
            $("#In_Progressul").html("");
            $("#Not_Startedul").html("");
            $("#Completeul").html("");

            //clear input boxes
            $("#taskdesc").val("");
            $("#taskname").val("");
            $("#duedate").val("");
            $("#startdate").val("");
            $("#cats").val("");
            $("#prog").val("");
            $("#stat").val("");
            $("#taskid").val("");

            //now load
            loadtasks();

        }};
    //send http with task attributes
    xhttp2.open("GET", "/addTask?TaskName="+name+"&Description="+descr+"&DueDate="+due+"&StartDate="+start+"&Categories="+cat+"&Progress="+prog+"&Status="+ stat, true);
    xhttp2.send();

    $("#addtask").hide();

    }

function editTask() {

    var xhttp2 = new XMLHttpRequest();

    //grab the input boxes' values
    var id = $("#taskid").val();
    var descr = $("#taskdesc").val();
    var name = $("#taskname").val();
    var due = $("#duedate").val();
    var start = $("#startdate").val();
    var cat = $("#cats").val();
    var prog = $("#prog").val();
    var stat = $("#stat").val();

    xhttp2.onreadystatechange = function() {
        if(xhttp2.readyState == 4 && xhttp2.status == 200)
        {    //need to clear the kanban board
            $("#In_Progressul").html("");
            $("#Not_Startedul").html("");
            $("#Completeul").html("");

            //clear the values in the input boxes
            $("#taskdesc").val("");
            $("#taskname").val("");
            $("#duedate").val("");
            $("#startdate").val("");
            $("#cats").val("");
            $("#prog").val("");
            $("#stat").val("");
            $("#taskid").val("");
            loadtasks();

        }};
    //send http with the attributes
    xhttp2.open("GET", "/editTask?ID="+id+"&TaskName="+name+"&Description="+descr+"&DueDate="+due+"&StartDate="+start+"&Categories="+cat+"&Progress="+prog+"&Status="+ stat, true);
    xhttp2.send();
    //hide the menu
    $("#addtask").hide();

    }

function canceladdtask() {
    //cancel the add task menu
    $("#addtask").hide();
}

function showtaskentry() {
    //open the task entry menu
    $("#addtask").show();
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

function reset() { //reset the contents of the Kanban board
    $("#In_Progressul").html("");
    $("#Not_Startedul").html("");
    $("#Completeul").html("");
    loadtasks()
}