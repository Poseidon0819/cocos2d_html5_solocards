var HomeStage = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
    }

});


HomeStage.create = function (params) {
    var instance = new HomeStage();
    instance.init(params);
    return instance;
};
