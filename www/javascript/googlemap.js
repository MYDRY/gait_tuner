function GoogleMap(id) {
    this.init();
    this.drawMap(id);
}

GoogleMap.prototype = {
    init: function() {
        if (!(this instanceof GoogleMap)) {
            return new GoogleMap();
        }
        this.map;
        this.json_data = null;
    },

    drawMap: function(id) {
        this.map = new google.maps.Map(document.getElementById(id), {
            center: {
                lat: 34.7019399,
                lng: 135.51002519999997
            },
            zoom: 19
        });
    },
    
    getDistance: function() {
        var distance = this.json_data.routes[0].legs[0].distance.value;
        console.log("The distance is " + distance + " [m].");
        return distance;
    },
    
    getJson: function(origin, destination) {
        var self = this;
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200){
                self.json_data = JSON.parse(req.responseText);
                console.log("JSON data chatched");
                console.log(self.json_data);
            }
        };
        req.open("GET",
                 "https://maps.googleapis.com/maps/api/directions/json?"
                 + "origin=" + origin + "&"
                 + "destination=" + destination + "&"
                 + "key=AIzaSyDFDIYBco398B-xvcJ9ND0ENWlk1vifgPs", false);
        req.send(null);
    }
};
