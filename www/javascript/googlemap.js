function GoogleMap() {
    this.init();
}

GoogleMap.prototype = {
    init: function() {
        if (!(this instanceof GoogleMap)) {
            return new GoogleMap();
        }
        this.json_data = null;
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
