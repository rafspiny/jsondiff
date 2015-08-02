/**
 * jsondiff namespace.
 */
// var EXPORTED_SYMBOLS = ["jsonDiff"];
// function jsondiff() {
  	
//   };
if (typeof jsondiff == "undefined") {
  var jsondiff = {
    isArray: function(value) {
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
					diff.values[i] = { "id": i, "type": this.typeOf(origin[i]), "status":diff.status, "values":{}};
					this.recursivelyFillDiffObj(item2, diff.values[key]);
				};
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
		if ('object' !== this.typeOf(originJSON) || 'object' !== this.typeOf(copyJSON)) {
			//throw  new Exception('Invalid data');
			return false;
		}

		diff = { "id": "root", "type": "", "status":"untouched", "values":{}, "representation":{}};
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
			for (var key in origin) {
				diff.values[key] = this.getFilledTemplateDiffObject({"key":key, "value":origin[key], "status":"untouched"});

				if (!copy.hasOwnProperty(key)) {
					// The key has been removed
					diff.values[key].status = "removed";
					this.recursivelyFillDiffObj(origin[key], diff.values[key]);
				} else {
					// The key is there, let's check if it is changed
					this.populateDiff(origin[key], copy[key], diff.values[key]);
				}
			}
			for (var key in copy) {
				diff.values[key] = this.getFilledTemplateDiffObject({"key":key, "value":copy[key], "status":"untouched"});

				if (!origin.hasOwnProperty(key)) {
					// The key has been removed
					diff.values[key].status = "added";
					this.recursivelyFillDiffObj(origin[key], diff.values[key]);
				} else {
					// The key is there, let's check if it is changed
					this.populateDiff(origin[key], copy[key], diff.values[key]);
				}
			}
		} else {
			if (typeOrigin == 'array') {
				for (var i = 0; i < origin.length; i++) {
					diff.values[i] = { "id": i, "type": this.typeOf(origin[i]), "status":"untouched", "values":{}};
					this.populateDiff(item, item2, diff);
				};
				for (var i = 0; i < copy.length; i++) {
					if (!diff.values.hasOwnProperty(i))
						diff.values[i] = { "id": i, "type": this.typeOf(copy[i]), "status":"untouched", "values":{}};

					this.populateDiff(item, item2, diff.values[i]);
				};
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