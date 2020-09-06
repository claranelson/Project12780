function loadcats() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            //parse HTTP response string
            var JSONstring = xhttp.responseText;
            var categorystrings = JSONstring.split(";");

            var categorytable = $("#categorytable"); //get the category table

            for(var i = 0; i<categorystrings.length;i++)
            {//split into attribute strings and add to table
                var catstring = categorystrings[i];
                var attributeStrings = catstring.split(",");

                strTask = "<tr><td>"+ attributeStrings[0] +"</td>";
                strTask = strTask + "<td>"+ attributeStrings[1] +"</td>";
                strTask = strTask + "<td>"+ attributeStrings[2] +"</td>";

                strTask = strTask + "</tr>";

                categorytable.append(strTask);
            }

        }

    };
    xhttp.open("GET", "/loadCats/", true);
    xhttp.send();
}

function addCategory() {

    var xhttp2 = new XMLHttpRequest();
    var name = $("#catname").val();
    var col = $("#color").val();
    xhttp2.onreadystatechange = function()
    {
        if(xhttp2.readyState == 4 && xhttp2.status == 200)
        {
            //reset table to headers and then reload the table
            $("#categorytable").html("<tr id = \'header\'>\n" +
            "    <td>ID</td>\n" +
            "    <td>Category Name</td>\n" +
            "    <td>Color</td>\n" +
            "</tr>");
            loadcats();

        }};
    xhttp2.open("GET", "/addCategory?CatName="+name+"&Color="+col, true);
    xhttp2.send();

    //clear values
    $("#catname").val("");
    $("#color").val("");

}