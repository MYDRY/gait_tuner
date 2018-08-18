function YahooMap() {
    YahooMap.prototype.init();
}

YahooMap.prototype = {
    init: function() {
        this.ymap = this.initMap();
        this.startPosition = null;
        this.goalPosition  = null;
        this.drawInitialMap();
    },

    initMap: function(name) {
       var map = new Y.Map("map", {
            configure: {
                mapType: Y.Map.TYPE.STANDARD,
                wheatherOverlay: true,
                continuousZoom: true
            }
        });
        map.bind('dblclick', function(latlng) {
            confirm(latlng.toString());
        });
        map.addControl(new Y.CenterMarkControl());
        map.addControl(new Y.SearchControl());
        return map;
    },
    
    drawInitialMap: function() {
        var self = this;
        var defaultPos = new Y.LatLng(35.66572, 139.73100); // TOKYO
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log("Success to get cuurent position.");
            self.currentPos = new Y.LatLng(pos.coords.latitude, pos.coords.longitude);
            self.drawMap();
        }, function(err) {
            console.warn("Failue to get cuurent position.");
            self.currentPos = defaultPos;
            self.drawMap();
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    },
    
    drawMap: function() {
        this.ymap.drawMap(this.currentPos, 17, Y.LayerSetId.NORMAL);
    },
    
    getPositionError: function(err) {
        console.warn("ERROR(" + err.code + ": " + err.message);
    },
    
    setCoodinates: function(crd) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            crd = pos.coords;
        }, YahooMap.prototype.getPositionError, YahooMap.prototype.getPositionOptions);
    },

    getCenter: function() {
        alert(this.ymap.getCenter());
    },

    setStartPosition: function() {
        console.log("setStartPosition");
        this.startPosition = this.ymap.getCenter();
    },

    setGoalPosition: function() {
        console.log("setGoalPosition");
        this.goalPosition = this.ymap.getCenter();
    },

    calcDistance: function(gm) {
        if (this.startPosition == null) {
            alert("出発点を設定してください。");
        } else if (this.goalPosition == null) {
            alert("到着点を設定してください。");
        } else {
            alert("距離を計測します。");            
            ;
        }
    }
};
