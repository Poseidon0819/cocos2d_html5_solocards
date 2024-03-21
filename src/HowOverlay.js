var HowOverlay = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addStage();
        this.addInterface();
    },

    addStage: function() {
        var stage = HowStage.create();
        this.addChild(stage);
        return stage;
    },

    addInterface: function (params) {
        var controls = HowInterface.create(params);
        this.addChild(controls);
    }

});

HowOverlay.create = function (params) {
    var instance = new HowOverlay();
    instance.init(params);
    return instance;
};


