function GaitTuner() {
    this.init();
}

GaitTuner.prototype = {
    init: function() {
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
        return target_time;
    },

    showTargetTime: function() {
        var field = document.getElementById("target_time_shower");
        field.innerHTML = this.getTargetTime();
    }
};
