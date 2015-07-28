var { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var button = ToggleButton(
        {
                id : "json-mainButton",
                id: "mozilla-link",
                label: "Open JSON diff",
                disabled: false,
                icon: {
                "16": self.data.url("images/icon-16.png"),
                        "32": self.data.url("images/icon-32.png"),
                        "64": self.data.url("images/icon-64.png")
                },
                onClick: function(state) {
                        tabs.open(self.data.url("html/panel.html"));
                }
        }
);