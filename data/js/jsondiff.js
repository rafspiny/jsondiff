function isArray(value) {
    return value && typeof value === "object" && value.constructor === Array;
}

function typeOf(value) {
    return isArray(value) ? "array" : typeof value;
}

function stringify(value) {
	return typeOf(value) === "object" || typeOf(value) === "array" || undefined === value?undefined:value.valueOf();
}

function checkDiff(string1, string2) {
	origin = null;
	copy   = null;
	try{
        origin = JSON.parse(string1);
    }catch(e){
    	// TODO could remember which one is not a JSON object
    }

    try{
        copy = JSON.parse(string2);
    }catch(e){
    	// TODO could remember which one is not a JSON object
    }

	if (null == origin || null == copy) {
		return false;
	}

	diff = { "id": "root", "type": "", "status":"untouched", "values":{}, "representation":{}};
	populateDiff(origin, copy, diff);
	console.log(diff);
	return diff;
}

function populateDiff(origin, copy, diff) {
	// What are we?
	var typeOrigin = typeOf(origin);
    var typeCopy   = typeOf(copy);
    if (typeOrigin != typeCopy) {
    	diff.status     = "changed";
    	diff.substitute = copy; 
    	return;
    } else {
    	diff.type = typeOrigin;
    	diff.representation = {
			"original": stringify(origin),
			"copy": stringify(copy)
		}
    }
	if (typeOrigin == 'object') {
		for (var key in origin) {
			diff.values[key] = getFilledTemplateDiffObject({"key":key, "value":origin[key], "status":"untouched"});

			if (!copy.hasOwnProperty(key)) {
				// The key has been removed
				diff.values[key].status = "removed";
				recursivelyFillDiffObj(origin[key], diff.values[key]);
			} else {
				// The key is there, let's check if it is changed
				populateDiff(origin[key], copy[key], diff.values[key]);
			}
		}
		for (var key in copy) {
			diff.values[key] = getFilledTemplateDiffObject({"key":key, "value":copy[key], "status":"untouched"});

			if (!origin.hasOwnProperty(key)) {
				// The key has been removed
				diff.values[key].status = "added";
				recursivelyFillDiffObj(origin[key], diff.values[key]);
			} else {
				// The key is there, let's check if it is changed
				populateDiff(origin[key], copy[key], diff.values[key]);
			}
		}
	} else {
		if (typeOrigin == 'array') {
			for (var i = 0; i < origin.length; i++) {
				diff.values[i] = { "id": i, "type": typeOf(origin[i]), "status":"untouched", "values":{}};
				populateDiff(item, item2, diff);
			};
			for (var i = 0; i < copy.length; i++) {
				if (!diff.values.hasOwnProperty(i))
					diff.values[i] = { "id": i, "type": typeOf(copy[i]), "status":"untouched", "values":{}};

				populateDiff(item, item2, diff.values[i]);
			};
		} else {
			if (origin === undefined)
				diff.status = "added";
			if (copy === undefined)
				diff.status = "removed";

			diff.type   = typeOf(origin); 
			if (origin === copy)
				diff.status = "untouched";
			else
				diff.status = "changed";
		}
	}
}

function recursivelyFillDiffObj(obj, diff) {
	var typeObj = typeOf(obj);
	if (typeObj == 'object') {
		for (var key in obj) {
			diff.values[key] = getFilledTemplateDiffObject({"key":key, "value":obj[key], "status":diff.status});
			recursivelyFillDiffObj(obj[key], diff.values[key]);
		}
	} else {
		if (typeObj == 'array') {
			for (var i = 0; i < obj.length; i++) {
				diff.values[i] = { "id": i, "type": typeOf(origin[i]), "status":diff.status, "values":{}};
				recursivelyFillDiffObj(item2, diff.values[key]);
			};
		}
	}
}

function getFilledTemplateDiffObject(options) {
	var template = { 
		"id": options.key,
		"type": typeOf(options.value),
		"status":options.status || "untouched", 
		"values":{},
		"representation": {
			"original": stringify(options.value)
		}
	}

	return template;
}