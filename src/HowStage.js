var HowStage = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
    }

});

HowStage.create = function (params) {
    var instance = new HowStage();
    instance.init(params);
    return instance;
};
