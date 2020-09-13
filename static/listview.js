$(document).ready(function(){
    //make the appropriate input boxes into jQuery UI datepickers
    $("#startdate").datepicker({dateFormat: "yy-mm-dd"});
    $("#duedate").datepicker({dateFormat: "yy-mm-dd"});
    loadcats()
  });

function loadcats() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            //split JSON string
            var JSONstring = xhttp.responseText;
            var categorystrings = JSONstring.split(";");

            //get the select boxes that will be filled with the category names
            var categoryselect = $("#cats");
            var filterselect = $("#catfilt");

            optionstring = "<option>N/A</option>"; //set initial option in string
            for(var i = 0; i<categorystrings.length;i++)
            {
                //split the category into the different category attributes
                var catstring = categorystrings[i];
                var attributeStrings = catstring.split(",");

                //form string of the category names as HTML options
                optionstring = optionstring + "<option>" + attributeStrings[1] + "</option>";

            }
            //fill the select boxes
            categoryselect.html(optionstring);
            filterselect.html(optionstring);
        }

    };
    xhttp.open("GET", "/loadCats/", true); //AJAX request to load categories
    xhttp.send();
}

function Task(id,name, des,start,due,cat,stat,prog)
{ //Task object
    this.id = id;
    this.TaskName = name;
    this.Description = des;
    this.StartDate = start;
    this.DueDate = due;
    this.Categories = cat;
    this.Status = stat;
    this.Progress =prog;
}

function showtaskentry() { //open the add task section
    $("#addtask").show(); //show div
    $("#add").show(); //show the add task button
    $("#edit").hide(); //hide the edit taek button
}

function canceladdtask() { //cancel the add or edit task window.
    $("#addtask").hide(); //hide the div
}

function loadtasks() {
    //load tasks into table for initial page load
    $("#addtask").hide();
    var xhttp = new XMLHttpRequest();
    tasks = []; //create global variable
    console.log("______-----______-----_____-----");
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            //parse the response string JSON and sent to constructTable to make the table
            var JSONstring = xhttp.responseText;
            var json_obj = JSON.parse(JSONstring);
            tasks = constructTable(json_obj, "#listviewtable");
        }

    };
    xhttp.open("GET", "/loadTasks/", true);
    xhttp.send();
}

function constructTable(list, selector) { 
	// reference from https://www.geeksforgeeks.org/how-to-convert-json-data-to-a-html-table-using-javascript-jquery/
	// Getting the all column names 
	tasks = []
	//construct header
	var colnames = ["ID","Task Name","Description","Start Date","Due Date","Categories","Progress","Status"];
	
	var header = $('<tr/>');
	for (var j = 0; j < colnames.length; j++) {
		header.append($('<th/>').html(colnames[j]))
	}
	$(selector).html(header);
	
	//keys for data
	var cols = ["TaskName","Description","StartDate","DueDate","Categories","Progress","Status"];
	
	// Traversing the JSON data 
	for (var i = 0; i < list.length; i++) { 
		var row = $('<tr/>'); 
        var db_id = list[i]["pk"];
		row.append($('<td/>').html(db_id));


        var task = new Task(); //Create task object for compatibility with previous code (filling in edit task, etc)
        task.id = db_id;

		
        for (var colIndex = 0; colIndex < cols.length; colIndex++) 
		{ 
		    var colname = cols[colIndex];
			var val = list[i]["fields"][colname]; 
			
			// If there is any key, which is matching 
			// with the column name 
			if (val == null) val = "";   
			row.append($('<td/>').html(val)); 

            task[colname] = val;

		} 
		
		//add on click event
// 		row.click(edittaskopen(list[i]["pk"]))
		row.attr('onClick', 'edittaskopen('+ String(db_id)+')');
		// Adding each row to the table 
		$(selector).append(row); 
        tasks.push(task)
	} 
	return tasks;
}

function addTask() {

    var xhttp2 = new XMLHttpRequest();

    //pull values from task input boxes
    var descr = $("#taskdesc").val();
    var name = $("#taskname").val();
    var due = $("#duedate").val();
    var start = $("#startdate").val();
    var cat = $("#cats").val();
    var prog = $("#prog").val();
    var stat = $("#stat").val();

    xhttp2.onreadystatechange = function() {
        if(xhttp2.readyState == 4 && xhttp2.status == 200) {
            //reset the list view table
            reset()

        }};
    //send attributes to be added to the database
    xhttp2.open("GET", "/addTask?TaskName="+name+"&Description="+descr+"&DueDate="+due+"&StartDate="+start+"&Categories="+cat+"&Progress="+prog+"&Status="+ stat, true);
    xhttp2.send();
    $("#addtask").hide(); //hide the div so it disappears

    //clear the values of the task input boxes
    $("#taskdesc").val("");
    $("#taskname").val("");
    $("#duedate").val("");
    $("#startdate").val("");
    $("#cats").val("");
    $("#prog").val("");
    $("#stat").val("");

}

function edittaskopen(idarg) {//open add/edit task div and fill in the attributes of the task being edited
    console.log("meat1");
    $("#addtask").show(); //show the div
    $("#add").hide(); //ensure add task button is hidden
    $("#edit").show(); //ensure edit task button is showing
    console.log("I made it to the meat");

    //find index in tasks list that corresponds to the ID of the current task
    var index = 0;
    for(var i = 0; i<tasks.length;i++) {
        if (tasks[i].id==idarg.toString()) {
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

function filter() {
    var name = $("#namefilter").val();
    var stat = $("#statfilter").val();
    var cur = $("#currentfilt").val();
    var cat = $("#catfilt").val();
    var xhttp = new XMLHttpRequest();
    //starting here, we're doing a similar thing to loadtasks, but it's just easier to repeat the function than do it more smoothly
    //though given the number of times things in this function were changed, it actually would've probably been easier to make a function used in both
    //the load tasks function and the filter function
    //please see the loadtasks function for comments and explanations
    tasks = [];
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            var JSONstring = xhttp.responseText;
            var json_obj = JSON.parse(JSONstring);
            $('#listviewtable').empty();
            constructTable(json_obj, "#listviewtable");

        }

    };
    //if there is a name criteria, send it in the AJAX request, otherwise send AJAX request without it
    //then the python function filter will select only the tasks that fill the criteria
    if (name == "None" || name == "") {
        xhttp.open("GET","/filter?stat="+stat+"&cur="+cur+"&cat="+cat,true);
    } else {
        xhttp.open("GET", "/filter?namefilt=" + name + "&stat=" + stat + "&cur=" + cur + "&cat="+cat, true);
    }
    xhttp.send();
}

function editTask() {

    var xhttp2 = new XMLHttpRequest();

    //grab values in the input boxes
    var id = $("#taskid").val();
    var descr = $("#taskdesc").val();
    var name = $("#taskname").val();
    var due = $("#duedate").val();
    var start = $("#startdate").val();
    var cat = $("#cats").val();
    var prog = $("#prog").val();
    var stat = $("#stat").val();

    xhttp2.onreadystatechange = function() {
        if(xhttp2.readyState == 4 && xhttp2.status == 200) {

            //reset listview table
            reset()

        }};
    xhttp2.open("GET", "/editTask?ID="+id+"&TaskName="+name+"&Description="+descr+"&DueDate="+due+"&StartDate="+start+"&Categories="+cat+"&Progress="+prog+"&Status="+ stat, true);
    xhttp2.send();
    $("#addtask").hide(); //hide div

    //reset all the input and select boxes to be blank
    $("#taskdesc").val("");
    $("#taskname").val("");
    $("#duedate").val("");
    $("#startdate").val("");
    $("#cats").val("");
    $("#prog").val("");
    $("#stat").val("");
    $("#taskid").val("");

}

function reset() {
    //reset the list view table to just be the headers
    $('#listviewtable').empty();
    //actually load the tasks
    loadtasks();
}

function sortTable(n) {
    // from https://www.w3schools.com/howto/howto_js_sort_table.asp
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("listviewtable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}