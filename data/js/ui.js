document.addEventListener("click", clickHandler, false);
function clickHandler(e) {
    var event = e || window.event;
    if (event.target.nodeName.toLowerCase() === "ul") {
        switch(event.target.getAttribute("open")) {
            case 'no':
                event.target.setAttribute("open", "yes");
                break;
            case 'yes':
                event.target.setAttribute("open", "no");
                break;
        }
    }
}
function runEffect() {
	var selectedEffect = 'puff';
	// run the effect
	$( "#result" ).show( selectedEffect, {}, 500 ); // callback not needed
}
function fillDiv(diff) {
	// TODO check if it is an object or not.
	// If not, throw an exception
	var div = $("#diff").get(0);
	$("#diff").empty();
	// Traverse the diff object
	printSingleDiff(diff, div);
}

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
        typeSpanB.appendChild(document.createTextNode(' ('+diff.representation.copy+') '))
        typeSpanB.setAttribute("class", "jsontype jsondiff"+diff.representation.copy);

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
}
$(function() {
	$( "#resizable" ).resizable();
})
function formatJsonInTextArea(node) {
    var text = node.val();
    // Remove newlines
    var text1 = text.replace("\n", "");
    try{
        const value = JSON.parse(text1);
        const indendent_text = JSON.stringify(value, null, "  ");
        node.val(indendent_text);

    }catch(e){
        // computing node id
        const node_id = node[0].id
        $('#' + node_id).addClass("invalidJson");
        alert('The input is not valid JSON. Please check the checkbox.');
    }
}
$(function() {
    const ids = ['primary', 'secondary']
    for (id_key in ids) {
        var id_value = ids[id_key]
        $( "#format_"+id_value ).click(function( event ) {
            const target_id = event.target.id.replace('format_', '')
            event.preventDefault();
            let node = $('textarea#'+target_id);
            $('#'+target_id).removeClass("invalidJson");
            formatJsonInTextArea(node);
        });
    }
})
$(function() {
    $( "#checkdiff" ).click(function( event ) {
        event.preventDefault();
        var text1 = $('textarea#primary').val();
        var text2 = $('textarea#secondary').val();

        $('#primary').removeClass("invalidJson");
        $('#secondary').removeClass("invalidJson");

	    let origin = null;
		let copy   = null;
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