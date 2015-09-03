var module = require("../data/js/jsondiff.js");

exports["test loading module OK"] = function(assert) {
  assert.ok(module !== {}, "Loaded ok");
};

// exports["test isArray OK"] = function(assert) {
// 	var emptyArray = [];
// 	var nonEmptyArray = ["Saab","Volvo","BMW"];
//   	assert.ok(module.jsondiff.isArray(emptyArray) === true, "Empty array ok");
//   	assert.ok(module.jsondiff.isArray(nonEmptyArray) == true, "Non empty array ok");
// };

exports["test isArray FAIL"] = function(assert) {
  assert.ok(module.jsondiff.isArray(false) == false, "Non array returns false");
};

exports["test generateDiff OK1"] = function(assert) {
    // assert.pass();
    var expectedResult = {
	   "id":"root",
	   "type":"object",
	   "status":"untouched",
	   "values":{
	      "a":{
	         "id":"a",
	         "type":"number",
	         "status":"changed",
	         "values":{

	         },
	         "representation":{
	            "original":3,
	            "copy":6
	         }
	      },
	      "c":{
	         "id":"c",
	         "type":"number",
	         "status":"removed",
	         "values":{

	         },
	         "representation":{
	            "original":8
	         }
	      },
	      "obj":{
	         "id":"obj",
	         "type":"object",
	         "status":"untouched",
	         "values":{
	            "d":{
	               "id":"d",
	               "type":"number",
	               "status":"removed",
	               "values":{

	               },
	               "representation":{
	                  "original":6
	               }
	            },
	            "g":{
	               "id":"g",
	               "type":"number",
	               "status":"added",
	               "values":{

	               },
	               "representation":{
	                  "original":5
	               }
	            }
	         },
	         "representation":{

	         }
	      },
	      "obj2":{
	         "id":"obj2",
	         "type":"object",
	         "status":"removed",
	         "values":{
	            "f":{
	               "id":"f",
	               "type":"number",
	               "status":"removed",
	               "values":{

	               },
	               "representation":{
	                  "original":6
	               }
	            }
	         },
	         "representation":{

	         }
	      },
	      "b":{
	         "id":"b",
	         "type":"number",
	         "status":"added",
	         "values":{

	         },
	         "representation":{
	            "original":7
	         }
	      },
	      "obj3":{
	         "id":"obj3",
	         "type":"object",
	         "status":"added",
	         "values":{

	         },
	         "representation":{

	         }
	      }
	   },
	   "representation":{

	   }
	};
	assert.ok(
    	module.jsondiff.generateDiff(
      		{"a":3, "c":8, "obj":{"d":6}, "obj2":{"f":6}},
      		{"a":6, "b":7, "obj":{"g":5}, "obj3":{"h":3}}
    	),
    	expectedResult
  );
};

exports["test generateDiff OK2"] = function(assert) {
    // assert.pass();
    // var expectedResult = {"id":"root","type":"object","status":"untouched","values":{"0":{"id":"0","type":"number","status":"changed","values":{},"representation":{"original":3,"copy":4}},"1":{"id":"1","type":"number","status":"changed","values":{},"representation":{"original":5,"copy":6}}},"representation":{}};
    var expectedResult = {
	   "id":"root",
	   "type":"object",
	   "status":"untouched",
	   "values":{
	      "0":{
	         "id":"0",
	         "type":"number",
	         "status":"changed",
	         "values":{

	         },
	         "representation":{
	            "original":3,
	            "copy":4
	         }
	      },
	      "1":{
	         "id":"1",
	         "type":"number",
	         "status":"changed",
	         "values":{

	         },
	         "representation":{
	            "original":5,
	            "copy":6
	         }
	      }
	   },
	   "representation":{

	   }
	};
	assert.ok(
    	module.jsondiff.generateDiff(
      		[3,5],
      		[4,6]
    	),
    	expectedResult
  );
};

require("sdk/test").run(exports);
