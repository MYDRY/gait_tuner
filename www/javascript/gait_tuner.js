function judge(distance, remainingTime, defaultSpeed) {
    var walkingTime = distance / defaultSpeed.walk;
    var joggingTime = distance / defaultSpeed.jog;
    var runningTime = distance / defaultSpeed.run;

    console.log("remainingTime: " + remainingTime);
    console.log("walkingTime: " + walkingTime);
    console.log("joggingTime: " + joggingTime);
    console.log("runningTime: " + runningTime);

    if (walkingTime <= remainingTime) {
        alert("所要時間:"+ Math.round(walkingTime) +"s 歩いても間に合うよ");

    } else if (joggingTime <= remainingTime) {
        alert("ジョギングで行けば間に合うよ");
    } else if (runningTime <= remainingTime) {
        alert("走ったら間に合うよ");
    } else {
        alert("諦めろ。");
    }
}
