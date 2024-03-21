//version_code 1
var Timer = cc.Layer.extend({

    _left: null,
    _right: null,
    _seconds: -1,
    _ticking: false,
    _callbackUpdate: null,
    _forward: false,

    init: function (params) {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setCascadeOpacityEnabled(true);
        this.setContentSize(cc.size(Timer.WIDTH, Timer.HEIGHT));
        this.addLeftSegment();
        this.addMiddle();
        this.addRightSegment();
        this.scheduleTick();
        this._callbackUpdate = (params && params.callbackUpdate) ? params.callbackUpdate : null;
        this._forward = params.forward;
    },

    setSeconds: function (seconds) {
        this._ticking = true;
        this._seconds = seconds;
        this.syncSeconds();
    },

    addLeftSegment: function () {
        this._left = Counter.create(
            {
                double: true
            }
        );
        this._left.setPosition(cc.p(this.getContentSize().width * .33 - Timer.SHIFT, Timer.POS_Y));
        this.addChild(this._left);
    },

    addMiddle: function () {
        var label = new cc.LabelBMFont(":", res.fontMontserratFNT, 0, cc.TEXT_ALIGNMENT_CENTER);
        label.setScale(.9);
        label.setColor(cc.color.BLACK);
        label.setPosition(cc.p(this.getContentSize().width * .5 - 6, 11))
        label.setAnchorPoint(cc.p(0, .5));
        this.addChild(label);
    },

    addRightSegment: function () {
        this._right = Counter.create(
            {
                double: true
            }
        );
        this._right.setPosition(cc.p(this.getContentSize().width * .66 + Timer.SHIFT, Timer.POS_Y));
        this.addChild(this._right);
    },

    syncSeconds: function () {
        var mins = Math.floor(this._seconds / 60);
        var secs = this._seconds % 60;
        this._left.setNumber(mins);
        this._right.setNumber(secs);
    },

    scheduleTick: function () {
        this.getScheduler().schedule(
            function () {
                if (this._ticking == true) {
                    if (this._forward == false) {
                        this._seconds--;
                        this._seconds = Math.max(0, this._seconds);
                    } else {
                        this._seconds++;
                    }
                    this.syncSeconds();
                    if (this._callbackUpdate) {
                        this._callbackUpdate(this._seconds);
                    }
                    if (this._forward == false && this._seconds == 0) {
                        this._ticking = false;
                    }
                }
            }.bind(this),
            this,
            1,
            cc.REPEAT_FOREVER,
            1,
            false,
            "timer_tick"
        );
    }

});

Timer.SHIFT = 10;
Timer.POS_Y = 10;
Timer.WIDTH = 110;
Timer.HEIGHT = 28;

Timer.create = function (params) {
    var instance = new Timer();
    instance.init(params);
    return instance;
};
