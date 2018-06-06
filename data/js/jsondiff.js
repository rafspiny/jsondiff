/**
 * jsondiff namespace.
 */
// var EXPORTED_SYMBOLS = ["jsonDiff"];
// function jsondiff() {
  	
//   };
if (typeof jsondiff == "undefined") {
  var jsondiff = {
    isArray: function(value) {
    	// console.log("TYPEOF: ");
	    // console.log(typeof value);
	    // console.log("CONSTRUCTOR: ");
	    // console.log(value.constructor);
	    // console.log(value.constructor === Array);
    	// console.log("INSIDE: ");
    	// console.log(value && typeof value === "object" && value.constructor === Array);
    	return value && typeof value === "object" && value.constructor === Array;
    },
    typeOf: function(value) {
	    return this.isArray(value) ? "array" : typeof value;
	},
	stringify: function(value) {
		return this.typeOf(value) === "object" || this.typeOf(value) === "array" || undefined === value?undefined:value.valueOf();
	},
	recursivelyFillDiffObj: function(obj, diff) {
		var typeObj = this.typeOf(obj);
		if (typeObj == 'object') {
			for (var key in obj) {
				diff.values[key] = this.getFilledTemplateDiffObject({"key":key, "value":obj[key], "status":diff.status});
				this.recursivelyFillDiffObj(obj[key], diff.values[key]);
			}
		} else {
			if (typeObj == 'array') {
				for (var i = 0; i < obj.length; i++) {
					var value = obj[i];
					diff.values[i] = this.getFilledTemplateDiffObject({"key":i, "value":obj[i], "status":diff.status});
					this.recursivelyFillDiffObj(value, diff.values[i]);
				}
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
		// What are we?
		var typeOrigin = this.typeOf(origin);
	    var typeCopy   = this.typeOf(copy);
	    if (typeOrigin != typeCopy) {
	    	diff.status     = "changed";
	    	diff.substitute = copy; 
	    	return;
	    } else {
	    	diff.type = typeOrigin;
	    	diff.representation = {
				"original": this.stringify(origin),
				"copy": this.stringify(copy)
			}
	    }
		if (typeOrigin == 'object') {
			for (var key_origin in origin) {
				diff.values[key_origin] = this.getFilledTemplateDiffObject({"key":key_origin, "value":origin[key_origin], "status":"untouched"});

				if (!copy.hasOwnProperty(key_origin)) {
					// The key has been removed
					diff.values[key_origin].status = "removed";
					this.recursivelyFillDiffObj(origin[key_origin], diff.values[key_origin]);
				} else {
					// The key is there, let's check if it is changed
					this.populateDiff(origin[key_origin], copy[key_origin], diff.values[key_origin]);
				}
			}
			for (var key_copy in copy) {
				diff.values[key_copy] = this.getFilledTemplateDiffObject({"key":key_copy, "value":copy[key_copy], "status":"untouched"});

				if (!origin.hasOwnProperty(key_copy)) {
					// The key has been added
					diff.values[key_copy].status = "added";
					this.recursivelyFillDiffObj(copy[key_copy], diff.values[key_copy]);
				} else {
					// The key is there, let's check if it is changed 
					this.populateDiff(origin[key_copy], copy[key_copy], diff.values[key_copy]);
				}
			}
		} else {
			if (typeOrigin == 'array') {
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
		}
	}
  };
};

try{
    exports.jsondiff = jsondiff;
}catch(e){
}