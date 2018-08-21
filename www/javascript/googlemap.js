function GoogleMap() {
    this.init();
    this.setInitialPosition();
}

GoogleMap.prototype = {
    init: function() {
        if (!(this instanceof GoogleMap)) {
            return new GoogleMap();
        }
        this.map = new google.maps.Map(document.getElementById("map"), { zoom: 16 });
        this.currentPos;
        this.json_data = null;
        this.startPosition = null;
        this.goalPosition = null;
    },

    setInitialPosition: function() {
        var self = this;
        var defaultPos = new google.maps.LatLng(35.66572, 139.73100); // TOKYO
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log("Success to get current position.");
            self.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }, function(err) {
            console.warn("Failue to get current position.");
            self.map.setCenter(defaultPos);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
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
            }
        };
        origin_coord = origin.split(" ");
        destination_coord = destination.split(" ");
        req.open("GET",
                 "https://maps.googleapis.com/maps/api/directions/json?"
                 + "origin=" + origin + "&"
                 + "destination=" + destination + "&"
                 + "key=AIzaSyDFDIYBco398B-xvcJ9ND0ENWlk1vifgPs", false);
        req.send(null);
    },

    setStartPosition: function() {
        this.startPosition = this.map.getBounds().getCenter();
        alert("出発点を設定しました。");
        console.log("startPosition: " + this.startPosition.toString());
    },

    setGoalPosition: function() {
        this.goalPosition = this.map.getBounds().getCenter();
        alert("到着点を設定しました。");
        console.log("goalPosition: " + this.goalPosition.toString());
    },

    calcDistance: function() {
        if (this.startPosition == null) {
            alert("出発点を設定してください。");
            return;
        }
        if (this.goalPosition == null) {
            alert("到着点を設定してください。");
            return;
        }
        alert("距離を計測します。");
        var originString = this.startPosition.lat() + "," + this.startPosition.lng();
        var destinationString = this.goalPosition.lat() + "," + this.goalPosition.lng();
        this.getJson(originString, destinationString);
        var distance = this.getDistance();
        alert("距離は" + distance + " [m]です。");
    }
};
