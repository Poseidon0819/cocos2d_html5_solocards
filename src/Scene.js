var Scene = cc.Layer.extend({

    ctor: function () {
        cc.Layer.prototype.ctor.call(this);
    },

    init: function () {
        var background = Background.create();
        this.addChild(background);
        //init first overlay, all resources loaded at once for whole game       
        this.scheduleOnce(
            function () {  //there is no running scene here in cc.director for Overlays.getInstance().changeOverlay to work, this is why such shamancy with scheduleOnce
                ExternalGameAPI_callbackGameStart();
                Modals.getInstance().setScene(cc.director.getRunningScene());
                Overlays.getInstance().changeOverlay(OverlaysStates.OVER_HOME, {}, function () { });
            }.bind(this),
            0);
    }

});

Scene.scene = function () {
    var scene = new cc.Scene();
    var root = new Scene();
    root.init();
    root.setName('root'); //TODO: add another subscene child to "root"(Scene) and move decorations there, not inside Scene itself (mainHolder)
    scene.addChild(root);
    var overlayHolder = cc.Layer.create();
    overlayHolder.setName("overlay_holder");
    root.addChild(overlayHolder);
    var animationsHolder = cc.Layer.create();
    animationsHolder.setName("animations_holder");
    root.addChild(animationsHolder);
    var modalHolder = cc.Layer.create();
    modalHolder.setName("modal_holder");
    root.addChild(modalHolder);
    var animationsTopHolder = cc.Layer.create();
    animationsTopHolder.setName("animations_top_holder");
    root.addChild(animationsTopHolder);
    return scene;
};
