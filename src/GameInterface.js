var GameInterface = cc.Layer.extend({

    _callbackStage: null,
    _callbackManager: null,
    _dpad: null,
    _score: null,
    _topBar: null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this._callbackManager = params.callbackManager;
        this._callbackStage = params.callbackStage;
        this.addBack();
        this.addTopBar();
        this.addNewGame();
        this.addUndo();
        this.addPad();
    },

    callbackInterface: function (params) {
        switch (params.id) {
            case CallbackID.ADD_DPAD_CALLBACK:
                this._dpad.addControlsCallbacks(params.value);
                break;
            case CallbackID.UPDATE_SCORE_BEST_CALLBACK:
                this._topBar.setScoreBest(params.value);
                break;
            case CallbackID.UPDATE_SCORE_CALLBACK:
                this._topBar.setScore(params.value);
                break;
            case CallbackID.RESTORE_TIME_CALLBACK:
                this._topBar.setSeconds(params.value);
                break;

        }
    },

    addBack: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress7 = Button.create(
            {
                strPicFile: res.exit,
                keyScan: [cc.KEY["7"], cc.KEY.num7],
                textSize: 32,
                textColor: cc.color.BLACK,
                callback:
                    function () {
                        Manager.saveToFile();
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_HOME, {}, function (overlayCreated) { });
                    }.bind(this)
            }
        );
        buttonPress7.setPosition(cc.p(70, pos.y - 33));
        buttonPress7.setScale(.6);
        buttonPress7.setText(Database.getGameString("STR_BUTTON_BACK"));
        this.addChild(buttonPress7);
    },

    addTopBar: function () {
        var pos = cc.pFromSize(this.getContentSize());
        this._topBar = TopBar.create(
            {
                cbSaveTime: function (t) {
                    this._callbackManager({ id: CallbackID.SAVE_TIME, value: t });
                }.bind(this)
            }
        );
        this._topBar.setPosition(cc.p(pos.x * .5 - 50, pos.y - 33));
        this.addChild(this._topBar);
    },

    addPad: function () {
        this._dpad = Pad.create(
            {
                keyLeftScan: [cc.KEY["4"], cc.KEY.num4, cc.KEY.left],
                keyUpScan: [cc.KEY["2"], cc.KEY.num2, cc.KEY.up],
                keyRightScan: [cc.KEY["6"], cc.KEY.num6, cc.KEY.right],
                keyBottomScan: [cc.KEY["8"], cc.KEY.num8, cc.KEY.down],
                keyCenterScan: [cc.KEY["5"], cc.KEY.num5, cc.KEY.enter]
            }
        );
        this._dpad.setPosition(cc.p(1021, 469));
        this.addChild(this._dpad);
    },

    addNewGame: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress = Button.create(
            {
                strPicFile: res.exit,
                keyScan: [cc.KEY["1"], cc.KEY.num1],
                textSize: 32,
                textColor: cc.color.BLACK,
                callback:
                    function () {
                        this._callbackManager({ id: CallbackID.RESET_GAME });
                    }.bind(this)
            }
        );
        buttonPress.setPosition(cc.p(pos.x - 170, pos.y - 33));
        buttonPress.setScale(.6);
        buttonPress.setText(Database.getGameString("STR_BUTTON_NEW_GAME"));
        this.addChild(buttonPress);
    },

    addUndo: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress = Button.create(
            {
                strPicFile: res.exit,
                keyScan: [cc.KEY["9"], cc.KEY.num9],
                textSize: 32,
                textColor: cc.color.BLACK,
                callback:
                    function () {
                        this._callbackStage({ id: CallbackID.UNDO });
                    }.bind(this)
            }
        );
        buttonPress.setPosition(cc.p(pos.x - 70, pos.y - 33));
        buttonPress.setScale(.6);
        buttonPress.setText(Database.getGameString("STR_BUTTON_UNDO"));
        this.addChild(buttonPress);
    }

});


GameInterface.create = function (params) {
    var instance = new GameInterface();
    instance.init(params);
    return instance;
};
