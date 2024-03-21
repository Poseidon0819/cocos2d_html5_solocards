var HomeOverlay = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addStage();
        this.addInterface();
    },

    addStage: function() {
        var stage = HomeStage.create();
        this.addChild(stage);
        return stage;
    },

    addInterface: function (params) {
        var controls = HomeInterface.create(params);
        this.addChild(controls);
    }

});

HomeOverlay.create = function (params) {
    var instance = new HomeOverlay();
    instance.init(params);
    return instance;
};


