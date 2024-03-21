var LangOverlay = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addStage();
        this.addInterface();
    },

    addStage: function() {
        var stage = LangStage.create();
        this.addChild(stage);
        return stage;
    },

    addInterface: function (params) {
        var controls = LangInterface.create(params);
        this.addChild(controls);
    }

});

LangOverlay.create = function (params) {
    var instance = new LangOverlay();
    instance.init(params);
    return instance;
};


