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


        console.log("remainingTime: " + remainingTime);
        console.log("walkingTime: " + walkingTime);
        console.log("joggingTime: " + joggingTime);
        console.log("runningTime: " + runningTime);

        if (walkingTime <= remainingTime) {
            d.setHours(d.getHours()+w_hour);
            d.setMinutes(d.getMinutes()+w_min);
            alert("歩いても間に合うよ\n" + "到着予想時刻: "+ d.getHours() + ":" + d.getMinutes());
        } else if (joggingTime <= remainingTime) {
            d.setHours(d.getHours()+j_hour);
            d.setMinutes(d.getMinutes()+j_min);
            alert("ジョギングすれば間に合うよ\n" + "到着予想時刻: "+ d.getHours() + ":" + d.getMinutes());
        } else if (runningTime <= remainingTime) {
            d.setHours(d.getHours()+r_hour);
            d.setMinutes(d.getMinutes()+r_min);
            alert("ダッシュすれば間に合うよ\n" + "到着予想時刻: "+ d.getHours() + ":" + d.getMinutes());
        } else {
            alert("諦めろ。");
        }
    }
};
