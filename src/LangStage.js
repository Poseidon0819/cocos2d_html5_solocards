var LangStage = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
    }

});

LangStage.create = function (params) {
    var instance = new LangStage();
    instance.init(params);
    return instance;
};
