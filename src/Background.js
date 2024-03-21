var Background = cc.Layer.extend({

    init: function (params) {
        var background0 = cc.Sprite.create(res.background);
        background0.setAnchorPoint(cc.p(0,0));
        this.addChild(background0);
    }

});

Background.create = function (params) {
    var instance = new Background();
    instance.init(params);
    return instance;
};


