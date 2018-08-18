function YahooMap() {
    YahooMap.prototype.init();
}

YahooMap.prototype = {
    init: function() {
        this.ymap = new Y.Map("map", {
            configure: {
                mapType: Y.Map.TYPE.STANDARD,
                wheatherOverlay: true,
                continuousZoom: true
            }
        });
        this.ymap.bind('dblclick', function(latlng) {
            confirm(latlng.toString());
        });
        this.ymap.addControl(new Y.CenterMarkControl());
        this.ymap.addControl(new Y.SearchControl());
        this.drawInitialMap();
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
    
    getPositionSuccess: function(pos) {
        var crd = pos.coords;
        ymap.drawMap(new Y.LatLng(crd.latitude, crd.longitude),
                     17,
                     Y.LayerSetId.NORMAL);
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
    }
};
