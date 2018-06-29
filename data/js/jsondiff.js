/**
 * jsondiff namespace.
 */
if (typeof jsondiff == "undefined") {
  var jsondiff = {
    isArray: function(value) {
    	return value && typeof value === "object" && value.constructor === Array;
    },
    typeOf: function(value) {
	    return this.isArray(value) ? "array" : typeof value;
	},
	stringify: function(value) {
		return this.typeOf(value) === "object" || this.typeOf(value) === "array"?this.typeOf(value):undefined === value?undefined:value.valueOf();
	},
	recursivelyFillDiffObj: function(obj, diff) {
		var typeObj = this.typeOf(obj);
		if (typeObj == 'object' || typeObj == 'array') {
			for (var key in obj) {
				diff.values[key] = this.getFilledTemplateDiffObject({"key":key, "value":obj[key], "status":diff.status});
				this.recursivelyFillDiffObj(obj[key], diff.values[key]);
			}
		}
	},
	getFilledTemplateDiffObject: function(options) {
		var template = { 
			"id": options.key,
			"type": this.typeOf(options.value),
			"status":options.status || "untouched", 
			"values":{},
			"representation": {
				"original": this.stringify(options.value)
			}
		}
		return template;
	},
	generateDiff: function(originJSON, copyJSON) {
		if (('object' !== this.typeOf(originJSON) && 'array' !== this.typeOf(originJSON)) || ('object' !== this.typeOf(copyJSON) && 'array' !== this.typeOf(copyJSON))) {
			//throw  new Exception('Invalid data');
			return false;
		}

		var diff = { "id": "root", "type": "", "status":"untouched", "values":{}, "representation":{}};
		this.populateDiff(originJSON, copyJSON, diff);
		return diff;
	},
	populateDiff: function(origin, copy, diff) {
	    // This method populate the diff object with all the differences between the two JSON objects
		// What are we?
		var typeOrigin = this.typeOf(origin);
	    var typeCopy   = this.typeOf(copy);

        diff.type = typeOrigin;
        diff.representation = {
            "original": this.stringify(origin),
            "copy": this.stringify(copy)
        }
        if (typeOrigin != typeCopy) {
	    	diff.status     = "changed";
	    	diff.substitute = copy;
	    	return;
        }

		if (typeOrigin == 'object') {
		    // Recursively populate the diff object if the type of the source object is 'object'
			this.process_object(origin, copy, diff)
			return
		}
		if (typeOrigin == 'array') {
            this.process_array(origin, copy, diff)
        } else {
            if (origin === undefined)
                diff.status = "added";
            if (copy === undefined)
                diff.status = "removed";

            diff.type = this.typeOf(origin);
            if (origin === copy)
                diff.status = "untouched";
            else
                diff.status = "changed";
        }
	},
	process_object: function(origin, copy, diff) {
	    // Check the added elements and the removed ones
	    this.handle_object(origin, copy, diff, 'removed', 1)
	    this.handle_object(origin, copy, diff, 'added', 0)
	},
	handle_object: function(origin, copy, diff, label, selector) {
	    // Inspect each element between two JSON objects
	    var source = copy;
	    var destination = origin;

	    if (selector == 1) {
	        source = origin;
	        destination = copy;
	    }

	    for (var key in source) {
            diff.values[key] = this.getFilledTemplateDiffObject({"key":key, "value":source[key], "status":"untouched"});
            if (!destination.hasOwnProperty(key)) {
                // The key has been removed
                diff.values[key].status = label;
                this.recursivelyFillDiffObj(source[key], diff.values[key]);
            } else {
                // The key is there, let's check if it is changed
                this.populateDiff(origin[key], copy[key], diff.values[key]);
            }
        }
	},
	process_array: function(origin, copy, diff) {
	    var minLength = Math.min(origin.length, copy.length);
        for (var common_index = 0; common_index < minLength; common_index++) {
            var common_object = origin[common_index];
            var valueOfCopy = copy[common_index];
            diff.values[common_index] = this.getFilledTemplateDiffObject({"key":common_index, "value":common_object, "status":"untouched"});
            this.populateDiff(common_object, valueOfCopy, diff.values[common_index]);
        }

        for (var source_index = minLength; source_index < origin.length; source_index++) {
            var source_object = origin[source_index];
            diff.values[source_index] = this.getFilledTemplateDiffObject({"key":source_index, "value":source_object, "status":"untouched"});
            diff.values[source_index].status = "removed";
            this.recursivelyFillDiffObj(origin[source_index], diff.values[source_index]);
        }
        for (var destination_index = minLength; destination_index < copy.length; destination_index++) {
            var destination_object = copy[destination_index];
            diff.values[destination_index] = this.getFilledTemplateDiffObject({"key":destination_index, "value":destination_object, "status":"untouched"});
            diff.values[destination_index].status = "added";
            this.recursivelyFillDiffObj(copy[destination_index], diff.values[destination_index]);
        }
    }
  };
}

try{
    exports.jsondiff = jsondiff;
}catch(e){
}