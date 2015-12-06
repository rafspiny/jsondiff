document.addEventListener("click", clickHandler, false);
function clickHandler(e) {
    var e = e || window.event;
    if (e.target.nodeName.toLowerCase() === "ul") {
        switch(e.target.getAttribute("open")) {
            case 'no':
                e.target.setAttribute("open", "yes");
                break;
            case 'yes':
                e.target.setAttribute("open", "no");
                break;
        }
    }
};
function runEffect() {
	var selectedEffect = 'puff';
	// run the effect
	$( "#result" ).show( selectedEffect, {}, 500 ); // callback not needed
};
function fillDiv(diff) {
	// TODO check if it is an object or not.
	// If not thron an exception
	div = $("#diff").get(0);
	$("#diff").empty();
	// Traverse the diff object
	printSingleDiff(diff, div);
};

function printSingleDiff(diff, div) {
	var ul = document.createElement("ul");

	var singleLine = document.createElement("span");
	singleLine.setAttribute('class', 'jsonline jsondiff'+diff.status);

	var name = document.createElement("span");
	name.appendChild(document.createTextNode(diff.id));
    name.setAttribute("class", "jsonobjname");

    var value = document.createElement("span");
    var textValue = (undefined !== diff.representation.original)?diff.representation.original:(undefined !== diff.representation.copy)?diff.representation.copy:'';
	value.appendChild(document.createTextNode(': '+textValue));
    value.setAttribute("class", "jsonobjvalue");

	var changed = document.createElement("span");
	changed.setAttribute("class", "jsonobjchanged");

    if ("changed" === diff.status) {
    	var arrow = document.createElement("span");
		arrow.appendChild(document.createTextNode(' => '));
        arrow.setAttribute("class", "jsonobjvalue");

    	var newValue = document.createElement("span");
		newValue.appendChild(document.createTextNode(diff.representation.copy));
        newValue.setAttribute("class", "jsonobjvalue");

        var typeSpanB = document.createElement("span");
        typeSpanB.appendChild(document.createTextNode(' ('+diff.type+') '))
        typeSpanB.setAttribute("class", "jsontype jsondiff"+diff.type);

    	changed.appendChild(arrow);
    	changed.appendChild(newValue);
    	changed.appendChild(typeSpanB);
    }

	var typeSpanA = document.createElement("span");
    typeSpanA.appendChild(document.createTextNode(' ('+diff.type+') '))
    typeSpanA.setAttribute("class", "jsontype jsondiff"+diff.type);

    singleLine.appendChild(name);
    singleLine.appendChild(value);
    singleLine.appendChild(typeSpanA);
    singleLine.appendChild(changed);
    ul.appendChild(singleLine);

    if (diff.type === 'object' || diff.type ==='array') {
        for (var child in diff.values) {
        	var li = document.createElement("li");
        	printSingleDiff(diff.values[child], li);
        	ul.appendChild(li);
    	}
        ul.setAttribute('open', 'yes');
    }

	div.appendChild(ul);
};
$(function() {
	$( "#resizable" ).resizable();
});
function formatJsonInTextArea(node) {
    var text1 = node.val();
    // Remove newlines
    var text1 = text1.replace("\n", "");
    try{
        value = JSON.parse(text1);
        indendent_text = JSON.stringify(value, null, "  ");
        node.val(indendent_text);

    }catch(e){
        $('#primary').addClass("invalidJson");
        alert('The input is not valid JSON. Please check the checkboes.');
    }
};
$(function() {
    $( "#format1" ).click(function( event ) {
        event.preventDefault();
        node = $('textarea#primary');
        $('#primary').removeClass("invalidJson");
        formatJsonInTextArea(node);
    });
});
$(function() {
    $( "#format2" ).click(function( event ) {
        event.preventDefault();
        node = $('textarea#secondary');
        $('#secondary').removeClass("invalidJson");
        formatJsonInTextArea(node);
    });
});
$(function() {
    $( "#checkdiff" ).click(function( event ) {
        event.preventDefault();
        var text1 = $('textarea#primary').val();
        var text2 = $('textarea#secondary').val();

        $('#primary').removeClass("invalidJson");
        $('#secondary').removeClass("invalidJson");

	    origin = null;
		copy   = null;
		try{
	        origin = JSON.parse(text1);
	    }catch(e){
	    	$('#primary').addClass("invalidJson");
	    	alert('The input is not valid JSON. Please check the checkboes.');
	    }

	    try{
	        copy = JSON.parse(text2);
	    }catch(e){
	    	$('#secondary').addClass("invalidJson");
	    	alert('The input is not valid JSON. Please check the checkboes.');
	    }

		if (null == origin || null == copy) {
			return false;
		}
		var diff = jsondiff.generateDiff(origin, copy);

        if (diff == false) {
        	alert("Input not valid");
        } else {
        	fillDiv(diff);
        	runEffect();
        }
    });
});