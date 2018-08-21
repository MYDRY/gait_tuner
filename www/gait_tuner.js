function GaitTuner() {
    this.init();
}

GaitTuner.prototype = {
    init: function() {
        this.defaultWalkingSpeed = 1.2;
        this.defaultJoggingSpeed = 2.5;
        this.defaultRunningSpeed = 5.0;
        this.remainingTime = 0;
    },

    getCurrentTime: function() {
        var date = new Date();
        return date.getHours() + ":" + date.getMinutes();
    },

    getTargetTime: function() {
        var form = document.forms['target_time_form']
        console.log("form: " + form);
        var target_time = form.target_time.value;
        console.log(target_time);
        tmp = target_time.split(":");
        return new Date(2018, 7, 21, tmp[0], tmp[1]);
    },

    showTargetTime: function() {
        var field = document.getElementById("target_time_shower");
        field.innerHTML = this.getTargetTime();
        this.calcRemainingTime();
    },

    calcRemainingTime: function() {
        this.remainingTime = this.getTargetTime().getTime() - new Date().getTime();
        console.log("Remaining time:" + (remainingTime/1000));
    }
};
