function SpeedDB() {
    this.init(name);
};

SpeedDB.prototype = {
    init: function() {
        this._name = "SpeedDB";
        this.speeds = {"walk": null, "jog": null, "run": null};
        this.setSpeeds();
        this._db = window.openDatabase(this._name, "1.0", this._name, 100);
    },
    
    errorCallBack: function(err) {
        console.warn("Error occured while executing SQL: " + err.code);
    },

    submit: function() {
        var speeds = [];
        for (var i = 0; i < document["speed-form"].length; ++i) {
            var speed = document["speed-form"][i].options[document["speed-form"][i].selectedIndex].value;
            console.log(speed + " [m/s]");
            speeds.push(speed);
        }
        this._db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS '+ this._name);
            tx.executeSql('CREATE TABLE IF NOT EXISTS '+ this._name + ' (walk, jog, run)');
            tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
                var len = results.rows.length;
                tx.executeSql('INSERT INTO ' + this._name + ' (walk, jog, run) VALUES (?, ?, ?)', speeds);
            }, this.errorCallBack);
        }, this.errorCallBack);
    },
    
    show: function() {
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + this._name+ ' (walk, jog, run)');
            tx.executeSql('SELECT * FROM ' + this._name, [], SpeedDB.prototype.genList, this.errorCallBack);
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
                "　walk: " + results.rows.item(i).walk + "<br>" + 
                "　jog : " + results.rows.item(i).jog + "<br>" +
                "　run : "+ results.rows.item(i).run + "<br>" + 
                "==========================================================<br>";
        }
        field.innerHTML = htmlText;
    },

    setSpeeds: function() {
        var self = this;
        console.log("HELLO");
        this._db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + this._name + ' (walk, jog, run)');
            tx.executeSql('SELECT * FROM ' + this._name, [], function(tx, results) {
                var len = results.rows.length;
                if (len == 1) {
                    for (key in speeds) {
                        self.speeds[key] = parseFloat(results.rows.item(0)[key]);
                    }
                } else {
                    self.speeds["walk"] = 1.0;
                    self.speeds["jog"] = 2.0;
                    self.speeds["run"] = 6.0;
                }
            }, this.errorCallBack);
        }, this.errorCallBack);
    },
    
    addSpeedOptions: function(mode) {
        console.log("HELLO");
        var speedOptions = { "walk": ["0.8", "1.0", "1.2"],
                             "jog":  ["1.5", "2.0", "2,5"],
                             "run":  ["5.0", "6.0", "7.0"] };
        var selbox = document.getElementById(mode + "-speed-selbox");
        var options = selbox.options;
        options.length = 0;
        for (var i = 0; i < speedOptions[mode].length; ++i) {
            options[options.length] =
                new Option(speedOptions[mode][i] + " [m/s]", speedOptions[mode][i]);
        }
    }
};
