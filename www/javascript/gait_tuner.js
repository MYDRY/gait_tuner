function GaitTuner() {
}

GaitTuner.prototype = {
    judge: function(distance, remainingTime, defaultSpeed) {
        var walkingTime = distance / defaultSpeed.walk;
        var joggingTime = distance / defaultSpeed.jog;
        var runningTime = distance / defaultSpeed.run;

        var sec = Math.round((walkingTime % 60) % 60);
        var w_min = Math.floor(walkingTime/ 60) % 60;
        var w_hour = Math.floor(walkingTime/ 3600);
        var j_min = Math.floor(joggingTime/ 60) % 60;
        var j_hour = Math.floor(joggingTime/ 3600);
        var r_min = Math.floor(runningTime/ 60) % 60;
        var r_hour = Math.floor(runningTime/ 3600);
        var d = new Date();
        var w = new Date();
        var j = new Date();
        var r = new Date();
        w.setHours(d.getHours()+w_hour);
        w.setMinutes(d.getMinutes()+w_min);

        j.setHours(d.getHours()+j_hour);
        j.setMinutes(d.getMinutes()+j_min);

        r.setHours(d.getHours()+r_hour);
        r.setMinutes(d.getMinutes()+r_min);

        console.log("remainingTime: " + remainingTime);
        console.log("walkingTime: " + walkingTime);
        console.log("joggingTime: " + joggingTime);
        console.log("runningTime: " + runningTime);

        if (walkingTime <= remainingTime) {
            alert("歩いても間に合うよ\n" + "到着予想時刻: "+ w.getHours() + ":" + w.getMinutes() + "\nちなみに・・・"
              + "\nジョギングしたら\n"　+ "到着予想時刻: "+ j.getHours() + ":" + j.getMinutes()
              + "\nダッシュしたら\n"　+ "到着予想時刻: "+ r.getHours() + ":" + r.getMinutes()
            );
        } else if (joggingTime <= remainingTime) {
            alert("ジョギングすれば間に合うよ\n" + "到着予想時刻: "+ j.getHours() + ":" + j.getMinutes() + "\nちなみに・・・"
            + "\nダッシュしたら\n"　+ "到着予想時刻: "+ r.getHours() + ":" + r.getMinutes()
            + "\n（遅刻）歩いたら\n"　+ "到着予想時刻: "+ w.getHours() + ":" + w.getMinutes()
          );
        } else if (runningTime <= remainingTime) {
            alert("ダッシュすれば間に合うよ\n" + "到着予想時刻: "+ r.getHours() + ":" + r.getMinutes() + "\nちなみに・・・"
            + "\n（遅刻）ジョギングしたら\n"　+ "到着予想時刻: "+ j.getHours() + ":" + j.getMinutes()
            + "\n（遅刻）歩いたら\n"　+ "到着予想時刻: "+ w.getHours() + ":" + w.getMinutes()
          );
        } else {
            alert("ダッシュしても間に合わないよ\n＼(^o^)／" + "ちなみに・・・\n"
              + "ダッシュしたら\n" + "到着予想時刻: "+ d.getHours() + ":" + d.getMinutes()
              + "\n（遅刻)ジョギングしたら\n"　+ "到着予想時刻: "+ j.getHours() + ":" + j.getMinutes()
              + "\n（遅刻）歩いたら\n"　+ "到着予想時刻: "+ w.getHours() + ":" + w.getMinutes()
          );
        }
    }
};
