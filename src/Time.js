var Time = cc.Layer.extend({

    _label: null,
    _timer: null,

    init: function (params) {
        this.initParams();
        this.addLabel(params.label);
        this.addTimer(params.cbSaveTime);
    },

    initParams: function () {
        this.setCascadeOpacityEnabled(true);
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setContentSize(cc.size(Score.WIDTH, Score.HEIGHT));
    },

    addLabel: function (label) {
        this._label = cc.LabelTTF.create(label, getFontNamePlatform(res.fontMontserrat), 27, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        this._label.setColor(cc.color.BLACK);
        this._label.setPosition(cc.p(Time.LABEL_X, Time.LABEL_Y))
        this.adjustLabel();
        this.addChild(this._label);
    },

    adjustLabel: function () {
        var csw = this._label.getContentSize().width
        if (csw > Time.LABEL_WIDTH) {
            this._label.setScaleX(Time.LABEL_WIDTH / csw);
        }
    },

    addTimer: function (cb) {
        this._timer = Timer.create(
            {
                forward: true,
                callbackUpdate: cb
            }
        );
        this.adjustTimerPos();
        this.addChild(this._timer);
    },

    adjustTimerPos: function () {
        var sizeX = this.getContentSize().width;
        var right = cc.rectGetMaxX(this._label.getBoundingBox());
        var x = right + (sizeX - right) / 2;
        this._timer.setPosition(cc.p(x, Time.TIMERY));
    },

    setSeconds: function (s) {
        this._timer.setSeconds(s);
    }
});

Time.WIDTH = 240;
Time.HEIGHT = 40;
Time.LABEL_WIDTH = Time.WIDTH * .55;
Time.LABEL_X = Time.LABEL_WIDTH / 2;
Time.LABEL_Y = 17;
Time.TIMERY = 22;

Time.create = function (params) {
    var instance = new Time();
    instance.init(params);
    return instance;
};
