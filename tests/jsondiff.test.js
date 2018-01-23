describe('jsondiff', function() {
    describe('isArray', function() {
        it('It should be false if not an array', function(done) {
            expect(jsondiff.isArray(false)).to.equal(false);
            done();
        });
    });
    describe('foo', function() {
        it('test generateDiff OK1', function(done) {
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
                        "original":undefined,
                        "copy":undefined
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
                        "original":undefined,
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
                        "h":{
                            "id":"h",
                            "type":"number",
                            "status":"added",
                            "values":{

                            },
                            "representation":{
                                "original":3
                            }
                          }
                     },
                     "representation":{
                        "original":undefined,
                     }
                  }
               },
               "representation":{
                    "original":undefined,
                    "copy":undefined
               }
            };
            var comparison = jsondiff.generateDiff(
                {"a":3, "c":8, "obj":{"d":6}, "obj2":{"f":6}},
                {"a":6, "b":7, "obj":{"g":5}, "obj3":{"h":3}}
      		);
            expect(comparison).to.deep.equal(expectedResult);
            done()
        });
    });
    describe('foo', function() {
        it('test generateDiff OK2', function(done) {
            var expectedResult = {
               "id":"root",
               "type":"array",
               "status":"untouched",
               "values":{
                  "0":{
                     "id":0,
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
                     "id":1,
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
                    "original":undefined,
                    "copy":undefined
               }
            };
            var actual_result = jsondiff.generateDiff([3,5], [4,6]);
            expect(actual_result).to.deep.equal(expectedResult);
            done()
        });
    });
    describe('foo', function() {
        it('test generateDiff OK3', function(done) {
            var expectedResult = {
                "id":"root",
                "type":"object",
                "status":"untouched",
                "values":{
                   "obj1":{
                        "id":"obj1",
                        "type":"object",
                        "status":"untouched",
                        "values":{
                            "obj2":{
                                "id":"obj2",
                                "type":"object",
                                "status":"untouched",
                                "values":{
                                    "obj3":{
                                        "id":"obj3",
                                        "type":"object",
                                        "status":"untouched",
                                        "values":{
                                            "prop1":{
                                                "id":"prop1",
                                                "type":"string",
                                                "status":"untouched",
                                                "values":{

                                                },
                                                "representation":{
                                                    "original":"value1",
                                                    "copy":"value1"
                                                }
                                            },
                                            "prop2":{
                                                "id":"prop2",
                                                "type":"string",
                                                "status":"untouched",
                                                "values":{

                                                },
                                                "representation":{
                                                    "original":"value2",
                                                    "copy":"value2"
                                                }
                                            },
                                            "prop3":{
                                                "id":"prop3",
                                                "type":"string",
                                                "status":"untouched",
                                                "values":{

                                                },
                                                "representation":{
                                                    "original":"value3",
                                                    "copy":"value3"
                                                }
                                            },
                                            "prop4":{
                                                "id":"prop4",
                                                "type":"string",
                                                "status":"untouched",
                                                "values":{

                                                },
                                                "representation":{
                                                    "original":"value4",
                                                    "copy":"value4"
                                                }
                                            }
                                        },
                                        "representation":{
                                            "original":undefined,
                                            "copy":undefined
                                        }
                                    },
                                    "obj_added":{
                                        "id":"obj_added",
                                        "type":"object",
                                        "status":"added",
                                        "values":{
                                            "prop1":{
                                                "id":"prop1",
                                                "type":"string",
                                                "status":"added",
                                                "values":{

                                                },
                                                "representation":{
                                                    "original":"value1",
                                                    "copy":"value1"
                                                }
                                            },
                                            "prop2":{
                                                "id":"prop2",
                                                "type":"string",
                                                "status":"added",
                                                "values":{

                                                },
                                                "representation":{
                                                    "original":"value2",
                                                    "copy":"value2"
                                                }
                                            },
                                            "prop3":{
                                                "id":"prop3",
                                                "type":"string",
                                                "status":"added",
                                                "values":{

                                                },
                                                "representation":{
                                                    "original":"value3",
                                                    "copy":"value3"
                                                }
                                            },
                                            "prop4":{
                                                "id":"prop4",
                                                "type":"string",
                                                "status":"added",
                                                "values":{

                                                },
                                                "representation":{
                                                    "original":"value4",
                                                    "copy":"value4"
                                                }
                                            }
                                        },
                                        "representation":{
                                            "original":undefined
                                        }
                                    }
                                },
                                "representation":{
                                    "original":undefined,
                                    "copy":undefined
                                }
                            }
                        },
                        "representation":{
                            "original":undefined,
                            "copy":undefined
                        }
                    }
                },
                "representation":{
                    "original":undefined,
                    "copy":undefined
                }
            };
            var comparison = jsondiff.generateDiff(
                {"obj1":{"obj2":{"obj3":{"prop1":"value1","prop2":"value2","prop3":"value3","prop4":"value4"}}}},
    			{"obj1":{"obj2":{"obj_added":{"prop1":"value1","prop2":"value2","prop3":"value3","prop4":"value4"},"obj3":{"prop1":"value1","prop2":"value2","prop3":"value3","prop4":"value4"}}}}
      		);
      		console.log(expectedResult.values.obj1.values.obj2.values);
            console.log(comparison.values.obj1.values.obj2.values);
            expect(comparison.values.obj1.values.obj2.values).to.deep.equal(expectedResult.values.obj1.values.obj2.values);
            done()
        });
    });
});
