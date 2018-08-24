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
            tx.executeSql('SELECT * FROM ' + this._name, [], PlaceDB.prototype.genList, this.errorCallBack);
        }, this.errorCallBack);
    },

    genList: function(tx, results) {
        var field = document.getElementById("placelist");
        var len = results.rows.length;
        console.log("data num = " + len);
        var htmlText = "";
        for (var i = 0; i < len; ++i) {
            htmlText +=
                "==========================================================<br>" +
                "　id: " + results.rows.item(i).id + "<br>" +
                "　name: " + results.rows.item(i).name + "<br>" +
                "　lat: " + results.rows.item(i).lat + "<br>" +
                "　lng: "+ results.rows.item(i).lng + "<br>" +
                "==========================================================<br>";
        }
        field.innerHTML = htmlText;
    },

    hideList: function() {
        var field = document.getElementById("placelist");
        field.innerHTML = "<br>";
    },

    genSelectBox: function(pointName, onChangeFunc) {
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS NameTable (id unique, name, lat, lng)');
            tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
                var field = document.getElementById(pointName + "pointselector");
                var len = results.rows.length;
                console.log("data num: " + len);
                var htmlText =
                    '<div id="' + pointName + 'pointselector">' +
                    '<form name="' + pointName + 'pointform">' +
                    '<select name="' + pointName + 'point" required="true" onChange="' + onChangeFunc + '()" class="form-control input-lg">' +
                    '<option value="" >選択してください</option>';
                for (var i = 0; i < len; ++i) {
                    var pos = results.rows.item(i).lat + "," +  results.rows.item(i).lng;
                    htmlText += '<option value="' + pos + '">' + results.rows.item(i).name + '</option>';
                }
                htmlText += '</select></form></div><br>'
                field.innerHTML = htmlText;
            }, this.errorCallBack);
        }, this.errorCallBack);
    }
};
