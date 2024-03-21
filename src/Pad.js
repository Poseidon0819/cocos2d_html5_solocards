var Pad = cc.Layer.extend({

    _callbacks : null,

    ctor: function () {
        cc.Layer.prototype.ctor.call(this);
        this._callbacks = [];
    },

    init: function (params) {
        this.initParams();
        this.addButtons(params);
    },

    initParams: function () {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setCascadeOpacityEnabled(true);
        this.setContentSize(cc.size(Pad.SIZE, Pad.SIZE));
    },

    addButtons: function (params) {
        this.addButton(Pad.BTN_LEFT, params.keyLeftScan, function () { this.onDir(Pad.ON_LEFT); }.bind(this));
        this.addButton(Pad.BTN_UP, params.keyUpScan, function () { this.onDir(Pad.ON_UP); }.bind(this));
        this.addButton(Pad.BTN_RIGHT, params.keyRightScan, function () { this.onDir(Pad.ON_RIGHT); }.bind(this));
        this.addButton(Pad.BTN_BOTTOM, params.keyBottomScan, function () { this.onDir(Pad.ON_DOWN); }.bind(this));
        this.addButton(Pad.BTN_CENTER, params.keyCenterScan, function () { this.onDir(Pad.ON_CENTER); }.bind(this));
    },

    addButton: function (dir, keyScan, cb) {
        var buttonPress = Button.create(
            {
                strPicFile: res.pad_btn,
                keyScan: keyScan,
                textSize: 18,
                textColor: cc.color.BLACK,
                callback: cb
            }
        );
        var p = null;
        var rect = this.getContentSize();
        var brect = buttonPress.getContentSize();
        if (dir == Pad.BTN_LEFT) {
            p = cc.p(brect.width * .5, rect.height * .5);
        } else if (dir == Pad.BTN_UP) {
            p = cc.p(rect.width * .5, rect.height - brect.height * .5);
        } else if (dir == Pad.BTN_RIGHT) {
            p = cc.p(rect.width - brect.width * .5, rect.height * .5);
        } else if (dir == Pad.BTN_BOTTOM) {
            p = cc.p(rect.width * .5, brect.height * .5);
        } else if (dir == Pad.BTN_CENTER) {
            p = cc.p(rect.width * .5, rect.height * .5);
        }
        buttonPress.setPosition(p);
        buttonPress.setText(Database.getGameString("STR_PAD_" + dir));
        this.addChild(buttonPress);
    },

    addControlsCallbacks: function (callbacks) {
        this._callbacks.push(callbacks);
    },

    onDir: function (dir) {
        var length = this._callbacks.length;
        for (var i = 0; i < length; i++) {
            this._callbacks[i](dir);
        }
    }

});

Pad.SIZE = 210;
Pad.BTN_LEFT = "LEFT";
Pad.BTN_UP = "UP";
Pad.BTN_RIGHT = "RIGHT";
Pad.BTN_BOTTOM = "BOTTOM";
Pad.BTN_CENTER = "CENTER";
Pad.ON_LEFT = 0;
Pad.ON_UP = 1;
Pad.ON_RIGHT = 2;
Pad.ON_DOWN = 3;
Pad.ON_CENTER = 4;


Pad.create = function (params) {
    var instance = new Pad();
    instance.init(params);
    return instance;
};


