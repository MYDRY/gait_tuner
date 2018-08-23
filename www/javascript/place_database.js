function PlaceDB() {
    this.init(name);
};

PlaceDB.prototype = {
    init: function() {
        this._name = "PlaceDB";
        this._db = window.openDatabase(this._name, "1.0", this._name, 100);
    },
    
    errorCallBack: function(err) {
        console.warn("Error occured while executing SQL: " + err.code);
    },
    
    getNameFromPrompt: function(tx, results) {
        var name = prompt("この地点の名前を入力してください");
        if (name == null) {
            throw "No Name Error."
        }
        return name;
    },

    register: function(gm) {
        alert("この地点を登録します");
        var latlng = gm.map.getCenter();
        console.log("lat: " + latlng.lat());
        console.log("lng: " + latlng.lng());
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS '+ this._name + ' (id unique, name, lat, lng)');
            tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
                var len = results.rows.length;
                var name = PlaceDB.prototype.getNameFromPrompt();
                tx.executeSql('INSERT INTO ' + this._name + ' (id, name, lat, lng) VALUES (?, ?, ?, ?)',
                              [len + 1, name, latlng.lat(), latlng.lng()]);
            }, this.errorCallBack);
        }, this.errorCallBack);
    },
    
    show: function() {
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS NameTable (id unique, name, lat, lng)');
            tx.executeSql('SELECT * FROM ' + this._name, [], MyDatabase.prototype.genList, this.errorCallBack);
        }, this.errorCallBack);
    },
    
    genList: function(tx, results) {
        var field = document.getElementById("placelist");
        var len = results.rows.length;
        console.log("data num = " + len);
        for (var i = 0; i < len; ++i) {
            field.innerHTML =
                "id: " + results.rows.item(i).id +   ", name: " + results.rows.item(i).name +
                ", lat: " + results.rows.item(i).lat + ", lng: "+ results.rows.item(i).lng + "<br>";
        }
    },

    hideList: function() {
        var field = document.getElementById("placelist");
        field.innerHTML = "<br>";
    }
};
