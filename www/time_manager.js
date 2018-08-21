function TimeManager() {
    this.init();
}

TimeManager.prototype = {
    init: function() {
        this.defaultSpeed = {
            walk: 1.2,
            jog:  2.5,
            run:  5.0
        };
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
        this.remainingTime = (this.getTargetTime().getTime() - new Date().getTime()) / 1000;
        console.log("Remaining time:" + (this.remainingTime/1000));
    }
};
