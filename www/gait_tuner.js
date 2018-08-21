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
};
