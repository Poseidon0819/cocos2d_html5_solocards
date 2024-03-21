var Languages = cc.Layer.extend({

    init: function (params) {
        this.initParams();
        this.fillLanguages();
    },

    initParams: function () {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setCascadeOpacityEnabled(true);
        this.setContentSize(cc.size(Languages.SIZEX, Languages.SIZEY));
    },

    fillLanguages: function () {
        var num = Globals.LANGUAGE_AVAIL.length;
        var rows = Math.ceil(num / Languages.COLS);
        var lastRowEmptyNum = Languages.COLS - num % Languages.COLS;
        var spaceX = Language.SIZEX + (Languages.SIZEX - Languages.COLS * Language.SIZEX) / (Languages.COLS - 1);
        var spaceY = Language.SIZEY + (Languages.SIZEY - rows * Language.SIZEY) / (rows - 1);
        for (var i = 0; i < num; i++) {
            var col = i % Languages.COLS;
            var row = Math.floor(i / Languages.COLS);
            var n = i + 1;
            var language = Language.create(
                {
                    lang: Globals.LANGUAGE_AVAIL[i],
                    keyName: (i + 1).toString(),
                    keyScan: [cc.KEY[n.toString()], cc.KEY["num" + n.toString()]]
                }
            );
            var lastRowShift = 0;
            if (row == rows - 1) {
                lastRowShift = lastRowEmptyNum * spaceX * .5;
            }
            language.setPosition(cc.p(col * spaceX + lastRowShift, Languages.SIZEY - row * spaceY));
            this.addChild(language);
        }
    }

});

Languages.SIZEX = 950;
Languages.SIZEY = 400;
Languages.COLS = 4;

Languages.create = function (params) {
    var instance = new Languages();
    instance.init(params);
    return instance;
};


