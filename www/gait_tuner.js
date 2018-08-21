function judge(distance, remainingTime, defaultSpeed) {
    var walkingTime = distance / defaultSpeed.walk;
    console.log("walkingTime: " + walkingTime);
    var joggingTime = distance / defaultSpeed.jog;
    console.log("joggingTime: " + joggingTime);
    var runningTime = distance / defaultSpeed.run;
    console.log("runningTime: " + runningTime);
    if (walkingTime <= remainingTime) {
        alert("歩いても間に合うよ");
    } else if (joggingTime <= remainingTime) {
        alert("ジョギングで行けば間に合うよ");
    } else if (runningTime <= remainingTime) {
        alert("走ったら間に合うよ");
    } else {
        alert("諦めろ。");
    }
}
