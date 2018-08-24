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
                              [origin.lat() + ',' + origin.lng(),
                               dest.lat() + ',' + dest.lng(), targetTime, new Date]);
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
        var round = function(num) {
            var dig = 0.001;
            return Math.round(num / dig) * dig
        }

        var len = results.rows.length;
        var htmlText = '';
        for (var i = 0; i < len; ++i) {
            var originLatlng = results.rows.item(i).origin.split(',');
            console.log(results.rows.item(i).origin);
            var destLatlng = results.rows.item(i).dest.split(',');
            var targetTime = new Date(results.rows.item(i).targettime);
            var timeStamp = new Date(results.rows.item(i).timestamp);
            htmlText +=
                '<div style="border: solid 3px lavender; margin: 10px; padding-left: 10%; float: center;">' +
                '・出発点: 緯度=' + round(originLatlng[0]) + ', 経度=' + round(originLatlng[1]) + '<br>' +
                '・到着点: 緯度=' + round(destLatlng[0]) + ', 経度=' + round(destLatlng[1]) + '<br>' +
                '・目標時刻: ' + targetTime.getHours() + ':' + targetTime.getMinutes()+ '<br>' +
                '・入力日時: '+ timeStamp.getFullYear()  + '年 '
                + timeStamp.getMonth() + '月 '
                + timeStamp.getDay()+ '日 <br>' +
                '</div>';
        }
        var field = document.getElementById("historylist");
        field.innerHTML = htmlText + '</div>';
    }
};
