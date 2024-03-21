var LangInterface = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addBack();
        var tbkg = this.addTitleBkg();
        this.addTitleText(tbkg);
        this.addLanguages();
    },

    addBack: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress7 = Button.create(
            {
                strPicFile: res.back_purple,
                keyScan: [cc.KEY["7"], cc.KEY.num7],
                textSize: 32,
                textColor: cc.color.BLACK,
                callback:
                    function () {
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_HOME, {}, function (overlayCreated) { });
                    }.bind(this)
            }
        );
        buttonPress7.setPosition(cc.p(100, pos.y - 53));
        buttonPress7.setText(Database.getGameString("STR_BUTTON_BACK"));
        this.addChild(buttonPress7);
    },

    addTitleBkg: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var titleBkg = cc.Sprite.create(res.lang_bar);
        titleBkg.setPosition(cc.p(pos.x * .5, pos.y * .5 + 223));
        titleBkg.setCascadeOpacityEnabled(true);
        this.addChild(titleBkg);
        return titleBkg;
    },

    addTitleText: function (tbkg) {
        var pos = cc.pFromSize(tbkg.getContentSize());
        var label = cc.LabelTTF.create(Database.getGameString("STR_TEXT_LANGUAGES"), getFontNamePlatform(res.fontMontserrat), 50, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color.BLACK);
        label.setPosition(cc.p(pos.x * .5, pos.y * .5));
        tbkg.addChild(label);
    },

    addLanguages: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var languages = Languages.create();
        languages.setPosition(cc.p(pos.x * .5, pos.y * .5 - 75));
        this.addChild(languages);
    }

});

LangInterface.create = function (params) {
    var instance = new LangInterface();
    instance.init(params);
    return instance;
};
