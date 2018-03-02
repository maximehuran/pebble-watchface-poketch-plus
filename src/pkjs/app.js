var initialized = false;
var options = {
    "vibe_on_disconnect": false,
};
var formUrl = "https://www.maximehuran.fr/pebble/poketch/config.html";

Pebble.addEventListener("ready", function() {
    initialized = true;
    var json = window.localStorage.getItem('pktch-config');
    if (typeof json === 'string') {
        try {
            options = JSON.parse(json);
            Pebble.sendAppMessage(options);
            console.log("Loaded stored config: " + json);
        } catch(e) {
            console.log("Stored config json parse error: " + json + ' - ' + e);
        }
    }
});

Pebble.addEventListener("showConfiguration", function() {
    var config = '?config=' + encodeURI(JSON.stringify(options));
    try
    {
        var watch = Pebble.getActiveWatchInfo();
    } catch(e) {
        console.log("getActiveWatchInfo error: " + e);
        var watch = null;
    }
    var platform = "&platform=" + ((watch != null) ? watch.platform : "unknown");
    var config_version = "&v=4";
    console.log("Showing configuration");
    Pebble.openURL(formUrl + config + platform + config_version);
});

Pebble.addEventListener("webviewclosed", function(e) {
    var response = decodeURIComponent(e.response);
    if (response.charAt(0) == "{" && response.slice(-1) == "}" && response.length > 5) {
        window.localStorage.setItem('pktch-config', response);
        try {
            options = JSON.parse(response);
            Pebble.sendAppMessage(options);
        } catch(e) {
            console.log("Response config json parse error: " + response + ' - ' + e);
        }
        console.log("Sent Options : " + response);
    }
});
