//version_code 3
var Counter = cc.Layer.extend({

    _label: null,
    _numberTo: 0,
    _numberCurrent: -1,
    _step: 0,
    _double: false,

    init: function (params) {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setCascadeOpacityEnabled(true);
        if (params) {
            this._double = params.double ? true : false;
        }
        this.addLabel();
    },

    addLabel: function () {
        this._label = new cc.LabelBMFont("", res.fontMontserratFNT, 0, cc.TEXT_ALIGNMENT_CENTER);
        this._label.setScale(Counter.SCALEMAX);
        this._label.setColor(cc.color.BLACK);
        this.addChild(this._label);
        this.setContentSize(this._label.getContentSize());
        var pos = cc.pFromSize(this.getContentSize());
        this._label.setPosition(cc.p(pos.x * .5, pos.y * .5));
    },

    setNumber: function (score, animate, delay) {
        if (this._numberCurrent == score) {
            return;
        }
        this._numberTo = score;
        if (animate) {
            var step = Math.abs(this._numberTo - this._numberCurrent);
            step = step / Counter.STEPS;
            step = Math.ceil(step);
            this._step = this._numberCurrent > this._numberTo ? -step : step;
            this._label.stopAllActions();
            if (delay === undefined) {
                delay = 0;
            }
            this.animateSegment(delay);
        } else {
            this._numberCurrent = this._numberTo;
            this._label.setString(this.paddedNumberString());
        }
    },

    animateSegment: function (delayTime) {
        this._label.runAction(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.spawn(
                    cc.fadeTo(Counter.ANIMTIME, Counter.OPACITYMIN),
                    cc.scaleTo(Counter.ANIMTIME, Counter.SCALEMIN)
                ),
                cc.callFunc(
                    function () {
                        this._numberCurrent += this._step;
                        if (this._step < 0) {
                            this._numberCurrent = Math.max(this._numberCurrent, this._numberTo);
                        } else {
                            this._numberCurrent = Math.min(this._numberCurrent, this._numberTo);
                        }
                        this._label.setString(this.paddedNumberString());
                    }.bind(this)
                ),
                cc.spawn(
                    cc.fadeTo(Counter.ANIMTIME, Counter.OPACITYMAX).easing(cc.easeSineOut()),
                    cc.scaleTo(Counter.ANIMTIME, Counter.SCALEMAX).easing(cc.easeSineOut())
                ),
                cc.callFunc(
                    function () {
                        if (this._numberCurrent != this._numberTo) {
                            this.animateSegment(0);
                        }
                    }.bind(this)
                )
            )
        );
    },

    paddedNumberString: function () {
        var s = parseInt(this._numberCurrent).toString();
        if (this._double && this._numberCurrent < 10) {
            s = "0" + s;
        }
        return s;
    }

});

Counter.OPACITYMIN = 128;
Counter.OPACITYMAX = 255;
Counter.ANIMTIME = .05;
Counter.SCALEMIN = .7;
Counter.SCALEMAX = .9;
Counter.STEPS = 20;

Counter.create = function (params) {
    var instance = new Counter();
    instance.init(params);
    return instance;
};
