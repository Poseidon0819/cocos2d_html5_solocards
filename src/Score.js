var Score = cc.Layer.extend({

    _label: null,

    init: function (params) {
        this.initParams();
        this.addLabel(params.label);
        this.addCounter();
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
        this._label.setPosition(cc.p(Score.LABEL_X, Score.LABEL_Y))
        this.adjustLabel();
        this.addChild(this._label);
    },

    adjustLabel: function () {
        var csw = this._label.getContentSize().width
        if (csw > Score.LABEL_WIDTH) {
            this._label.setScaleX(Score.LABEL_WIDTH / csw);
        }
    },

    addCounter: function () {
        this._counter = Counter.create();
        this.adjustCounterPos();
        this.addChild(this._counter);
    },

    adjustCounterPos: function () {
        var sizeX = this.getContentSize().width;
        var right = cc.rectGetMaxX(this._label.getBoundingBox());
        var x = right + (sizeX - right) / 2;
        this._counter.setPosition(cc.p(x, Score.COUNTERY));
    },

    setScore: function (value) {
        this._counter.setNumber(value, true, 0);
    }
});

Score.WIDTH = 230;
Score.HEIGHT = 40;
Score.LABEL_WIDTH = Score.WIDTH * 4 / 5;
Score.LABEL_X = Score.LABEL_WIDTH / 2;
Score.LABEL_Y = 17;
Score.COUNTERY = 19;


Score.create = function (params) {
    var instance = new Score();
    instance.init(params);
    return instance;
};
