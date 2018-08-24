function SpeedDB() {
    this.init(name);
};

SpeedDB.prototype = {
    init: function() {
        this._name = "SpeedDB";
        this._db = window.openDatabase(this._name, "1.0", this._name, 100);
    },
    
    errorCallBack: function(err) {
        console.warn("Error occured while executing SQL: " + err.code);
    },

    register: function() {
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS '+ this._name + ' (walk, jog, run)');
            tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
                var len = results.rows.length;
                tx.executeSql('INSERT INTO ' + this._name + ' (walk, jog, run) VALUES (?, ?, ?)',
                              [len + 1, name, latlng.lat(), latlng.lng()]);
            }, this.errorCallBack);
        }, this.errorCallBack);
    },
    
    show: function() {
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + this._name+ ' (walk, jog, run)');
            tx.executeSql('SELECT * FROM ' + this._name, [], PlaceDB.prototype.genList, this.errorCallBack);
        }, this.errorCallBack);
    },
    
    genList: function(tx, results) {
        var field = document.getElementById("speedlist");
        var len = results.rows.length;
        console.log("data num = " + len);
        var htmlText = "";
        for (var i = 0; i < len; ++i) {
            htmlText +=
                "==========================================================<br>" + 
                "　name: " + results.rows.item(i).walk + "<br>" + 
                "　lat: " + results.rows.item(i).jog + "<br>" +
                "　lng: "+ results.rows.item(i).run + "<br>" + 
                "==========================================================<br>";
        }
        field.innerHTML = htmlText;
    },

    hideList: function() {
        var field = document.getElementById("speedlist");
        field.innerHTML = "<br>";
    },

    genSelectBox: function(pointName, onChangeFunc) {
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + this._name + ' (id unique, name, lat, lng)');
            tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
                var field = document.getElementById(pointName + "pointselector");
                var len = results.rows.length;
                console.log("data num: " + len);
                var htmlText =
                    '<div id="' + pointName + 'pointselector">' + 
                    '<form name="' + pointName + 'pointform">' + 
                    '<select name="' + pointName + 'point" required="true" onChange="' + onChangeFunc + '()">' +
                    '<option value="" >選択してください</option>';
                for (var i = 0; i < len; ++i) {
                    var pos = results.rows.item(i).lat + "," +  results.rows.item(i).lng;
                    htmlText += '<option value="' + pos + '">' + results.rows.item(i).name + '</option>';
                }
                htmlText += '</select></form></div>'
                field.innerHTML = htmlText;
            }, this.errorCallBack);
        }, this.errorCallBack);        
    }
};
