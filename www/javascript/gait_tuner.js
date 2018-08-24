function GaitTuner() {
}

GaitTuner.prototype = {
    judge: function(distance, remainingTime, defaultSpeed) {
        console.log(defaultSpeed != null);
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

        if (walkingTime <= remainingTime) {
            alert("歩いても間に合うよ\n" + "到着予想時刻: "+ walk.getHours() + ":" + ("0"+(walk.getMinutes())).slice(-2) + "\nちなみに・・・"
              + "\nジョギングしたら\n"　+ "到着予想時刻: "+ jog.getHours() + ":" + ("0"+(jog.getMinutes())).slice(-2)
              + "\nダッシュしたら\n"　+ "到着予想時刻: "+ run.getHours() + ":" + ("0"+(run.getMinutes())).slice(-2)
            );
        } else if (joggingTime <= remainingTime) {
            alert("ジョギングすれば間に合うよ\n" + "到着予想時刻: "+ jog.getHours() + ":" + ("0"+(jog.getMinutes())).slice(-2) + "\nちなみに・・・"
            + "\nダッシュしたら\n"　+ "到着予想時刻: "+ run.getHours() + ":" + ("0"+(run.getMinutes())).slice(-2)
            + "\n（遅刻）歩いたら\n"　+ "到着予想時刻: "+ walk.getHours() + ":" + ("0"+(walk.getMinutes())).slice(-2)
          );
        } else if (runningTime <= remainingTime) {
            alert("ダッシュすれば間に合うよ\n" + "到着予想時刻: "+ run.getHours() + ":" + ("0"+(run.getMinutes())).slice(-2) + "\nちなみに・・・"
            + "\n（遅刻）ジョギングしたら\n"　+ "到着予想時刻: "+ jog.getHours() + ":" + ("0"+(jog.getMinutes())).slice(-2)
            + "\n（遅刻）歩いたら\n"　+ "到着予想時刻: "+ walk.getHours() + ":" + ("0"+(walk.getMinutes())).slice(-2)
          );
        } else {
            alert("ダッシュしても間に合わないよ\n＼(^o^)／" + "ちなみに・・・\n"
              + "ダッシュしたら\n" + "到着予想時刻: "+ run.getHours() + ":" + ("0"+(run.getMinutes())).slice(-2)
              + "\n（遅刻)ジョギングしたら\n"　+ "到着予想時刻: "+ jog.getHours() + ":" + ("0"+(jog.getMinutes())).slice(-2)
              + "\n（遅刻）歩いたら\n"　+ "到着予想時刻: "+ walk.getHours() + ":" + ("0"+(walk.getMinutes())).slice(-2)
          );
        }
    }
};
