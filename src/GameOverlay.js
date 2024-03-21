var GameOverlay = cc.Layer.extend({

    _stage: null,
    _interface: null,
    _manager: null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addStage(params.diff);
        this.addInterface();
        this.addManager(params.diff);
        this.finalizeStage();
        this._manager.initGame();
    },

    addStage: function (diff) {
        this._stage = GameStage.create(
            {
                difficulty: diff,
                callbackInterface: function (p) {
                    this._interface.callbackInterface(p);
                }.bind(this),
                callbackManager: function (p) {
                    return this._manager.callbackManager(p)
                }.bind(this)
            }
        );
        this.addChild(this._stage);
        return this._stage;
    },

    addInterface: function () {
        this._interface = GameInterface.create(
            {
                callbackManager: function (p) {
                    return this._manager.callbackManager(p)
                }.bind(this),
                callbackStage: function (params) {
                    return this._stage.callbackStage(params)
                }.bind(this)
            }
        );
        this.addChild(this._interface);
    },

    finalizeStage: function () {
        this._stage.finalize();
    },

    addManager: function (diff) {
        this._manager = Manager.create(
            {
                callbackStage: function (params) {
                    return this._stage.callbackStage(params)
                }.bind(this),
                callbackInterface: function (p) {
                    this._interface.callbackInterface(p);
                }.bind(this),
                difficulty: diff
            }
        );
    }

});

GameOverlay.create = function (params) {
    var instance = new GameOverlay();
    instance.init(params);
    return instance;
};


