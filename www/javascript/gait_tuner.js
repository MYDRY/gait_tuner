function GaitTuner() {
}

GaitTuner.prototype = {
    judge: function(gm, tm, sdb, hdb) {
        var distance = gm.getDistance();
        var remainingTime = tm.remainingTime;
        var defaultSpeed = sdb.getSpeeds();
        var walkingTime = distance / defaultSpeed["walk"];
        var joggingTime = distance / defaultSpeed["jog"];
        var runningTime = distance / defaultSpeed["run"];

        var sec = Math.round((walkingTime % 60) % 60);
        var w_min = Math.floor(walkingTime / 60) % 60;
        var w_hour = Math.floor(walkingTime / 3600);
        var j_min = Math.floor(joggingTime / 60) % 60;
        var j_hour = Math.floor(joggingTime / 3600);
        var r_min = Math.floor(runningTime / 60) % 60;
        var r_hour = Math.floor(runningTime / 3600);
        var date = new Date();
        var walk = new Date();
        var jog = new Date();
        var run = new Date();
        walk.setHours(date.getHours()+w_hour);
        walk.setMinutes(date.getMinutes()+w_min);

        jog.setHours(date.getHours()+j_hour);
        jog.setMinutes(date.getMinutes()+j_min);

        run.setHours(date.getHours()+r_hour);
        run.setMinutes(date.getMinutes()+r_min);

        console.log("remainingTime: " + remainingTime);
        console.log("walkingTime: " + walkingTime);
        console.log("joggingTime: " + joggingTime);
        console.log("runningTime: " + runningTime);

        hdb.register(gm, tm.getTargetTime());

        var resultText = '<div style="text-align: left; float: left;">';
        if (walkingTime <= remainingTime) {
            resultText = '歩いても間に合うよ<br>' +
                '到着予想時刻: '+ walk.getHours() + ':' + ('0'+(walk.getMinutes())).slice(-2) + '<br>' + 
                'ちなみに・・・<br>' +
                'ジョギングしたら<br>'　+ '到着予想時刻: '+ jog.getHours() + ':' + ('0'+(jog.getMinutes())).slice(-2) + '<br>' + 
                'ダッシュしたら<br>'　+ '到着予想時刻: '+ run.getHours() + ':' + ('0'+(run.getMinutes())).slice(-2);
        } else if (joggingTime <= remainingTime) {
            resultText = 'ジョギングすれば間に合うよ<br>' +
                '到着予想時刻: '+ jog.getHours() + ':' + ('0'+(jog.getMinutes())).slice(-2) + '<br>' +
                'ちなみに・・・<br>' + 
                'ダッシュしたら<br>'　+ '到着予想時刻: '+ run.getHours() + ':' + ('0'+(run.getMinutes())).slice(-2) + '<br>' + 
                '（遅刻）歩いたら<br>'　+ '到着予想時刻: '+ walk.getHours() + ':' + ('0'+(walk.getMinutes())).slice(-2);
        } else if (runningTime <= remainingTime) {
            resultText = 'ダッシュすれば間に合うよ<br>' +
                '到着予想時刻: '+ run.getHours() + ':' + ('0'+(run.getMinutes())).slice(-2) + '<br>' +
                'ちなみに・・・<br>' + 
                '（遅刻）ジョギングしたら<br>'　+ '到着予想時刻: '+ jog.getHours() + ':' + ('0'+(jog.getMinutes())).slice(-2) + '<br>' + 
                '（遅刻）歩いたら<br>'　+ '到着予想時刻: '+ walk.getHours() + ':' + ('0'+(walk.getMinutes())).slice(-2);
        } else {
            resultText = 'ダッシュしても間に合わないよ＼(^o^)／<br>' +
                'ちなみに・・・<br>' +
                'ダッシュしたら<br>' + '到着予想時刻: '+ run.getHours() + ':' + ('0'+(run.getMinutes())).slice(-2) + '<br>' +
                '（遅刻)ジョギングしたら<br>'　+ '到着予想時刻: '+ jog.getHours() + ':' + ('0'+(jog.getMinutes())).slice(-2) + '<br>' +
                '（遅刻）歩いたら\n'　+ '到着予想時刻: '+ walk.getHours() + ':' + ('0'+(walk.getMinutes())).slice(-2);
        }
        var resultField = document.getElementById("result");
        resultField.innerHTML = resultText;
    }
};
