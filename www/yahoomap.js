function YahooMap() {
    this.init();
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
    },

    drawMap: function() {
        this.ymap.drawMap(new Y.LatLng(35.66572, 139.73100), 17, Y.LayerSetId.NORMAL);
    },
    
    getPositionSuccess: function(pos) {
        var crd = pos.coords;
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        this.ymap = new Y.Map("map", {
            configure: {
                mapType: Y.Map.TYPE.STANDARD,
                wheatherOverlay: true,
                continuousZoom: true
            }
        });
        ymap.bind('dblclick', function(latlng) {
            confirm(latlng.toString());
        });
        ymap.addControl(centerMark);
        ymap.addControl(searchBox);
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
    }
};
