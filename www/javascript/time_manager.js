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

    changeSpeedPara: function() {
        var param = document.forms['speedparaform'].speedpara.value;
        this.defaultSpeed.walk = param;
        console.log(this.defaultSpeed.walk);
    },

    getCurrentTime: function() {
        var date = new Date();
        return date.getHours() + ":" + ("0"+(date.getMinutes())).slice(-2);
    },

    getTargetTime: function() {
        var date = new Date();
        var form = document.forms['target_time_form']
        var target_date = form.target_date.value;
        var target_time = form.target_time.value;
        console.log(target_date);
        td = target_date.split("-");
        tmp = target_time.split(":");
        return new Date(td[0], td[1] - 1, td[2], tmp[0], tmp[1]);
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
