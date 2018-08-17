var getPositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function getPositionSuccess(pos) {
    var crd = startCoordinates = goalCoordinates = pos.coords;
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    var ymap = new Y.Map("map", {
        configure: {
            mapType: Y.Map.TYPE.STANDARD,
            wheatherOverlay: true,
            continuousZoom: true
        }
    });
    var centerMark = new Y.CenterMarkControl();
    var searchBox = new Y.SearchControl();
    ymap.bind('dblclick', function(latlng) {
        confirm(latlng.toString());
    });
    ymap.addControl(centerMark);
    ymap.addControl(searchBox);
    ymap.drawMap(new Y.LatLng(crd.latitude, crd.longitude), 17, Y.LayerSetId.NORMAL);
}

function getPositionError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

var startCoordinates = new Coordinates();
var goalCoordinates =  new Coordinates();

function setCoodinates(crd) {
    navigator.geolocation.getCurrentPosition(function(pos) {
        crd = pos.coords;
    }, getPositionError, getPositionOptions);
}
