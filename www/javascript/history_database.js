function HistoryDB() {
    this.init(name);
};

HistoryDB.prototype = {
    init: function() {
        this._name = "HistoryDB";
        this._db = window.openDatabase(this._name, "1.0", this._name, 100);
    },
    
    errorCallBack: function(err) {
        console.warn("Error occured while executing SQL: " + err.code);
    },
    
    register: function(gm, targetTime) {
        var origin = gm.startPosition;
        var dest   = gm.goalPosition;
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS '+ this._name + ' (origin, dest, targettime, timestamp)');
            tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
                tx.executeSql('INSERT INTO ' + this._name +
                              ' (origin, dest, targettime, timestamp) VALUES (?, ?, ?, ?)',
                              [origin, dest, targetTime, new Date]);
            }, this.errorCallBack);
        }, this.errorCallBack);
        console.log(origin);
        console.log(dest);
        console.log(targetTime);
        console.log(new Date());
    },
    
    show: function() {
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS NameTable (id unique, name, lat, lng)');
            tx.executeSql('SELECT * FROM ' + this._name, [], HistoryDB.prototype.genList, this.errorCallBack);
        }, this.errorCallBack);
    },
    
    genList: function(tx, results) {
        var field = document.getElementById("historylist");
        var len = results.rows.length;
        console.log("data num = " + len);
        var htmlText = "";
        for (var i = 0; i < len; ++i) {
            htmlText +=
                "==========================================================<br>" + 
                "　origin: " + results.rows.item(i).origin + "<br>" + 
                "　dest: " + results.rows.item(i).dest + "<br>" + 
                "　targettime: " + results.rows.item(i).targettime + "<br>" +
                "　timestamp: "+ results.rows.item(i).timestamp + "<br>" + 
                "==========================================================<br>";
        }
        field.innerHTML = htmlText;
    }
};
