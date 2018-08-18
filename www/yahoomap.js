function YahooMap() {
    YahooMap.prototype.init();
}

YahooMap.prototype = {
    init: function() {
        this.ymap = new Y.Map("map");
        this.centerMark = new Y.CenterMarkControl();
        this.searchBox = new Y.SearchControl();
        this.getPositionOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        this.drawMap();
    },

    drawMap: function() {
        this.ymap.drawMap(new Y.LatLng(35.66572, 139.73100), 17, Y.LayerSetId.NORMAL);
    },
    
    getPositionSuccess: function(pos) {
        var crd = pos.coords;
        ymap = new Y.Map("map", {
            configure: {
                mapType: Y.Map.TYPE.STANDARD,
                wheatherOverlay: true,
                continuousZoom: true
            }
        });
        ymap.bind('dblclick', function(latlng) {
            confirm(latlng.toString());
        });
        ymap.addControl(this.centerMark);
        ymap.addControl(this.searchBox);
        ymap.drawMap(new Y.LatLng(crd.latitude, crd.longitude),
                     17,
                     Y.LayerSetId.NORMAL);
    },
    
    getPositionError: function(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
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
