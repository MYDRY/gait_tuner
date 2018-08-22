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
        return date.getHours() + ":" + ("0"+(date.getMinutes())).slice(-2);
    },

    getTargetTime: function() {
        var form = document.forms['target_time_form']
        var target_time = form.target_time.value;
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
    }
};
