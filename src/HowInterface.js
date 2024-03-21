var HowInterface = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addBack();
        var bkg = this.addBkg();
        var tbkg = this.addTitleBkg(bkg);
        this.addTitleText(tbkg);
        this.addText(bkg);
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
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_HOME, {}, function (overlayCreated) { });
                    }.bind(this)
            }
        );
        buttonPress7.setPosition(cc.p(100, pos.y - 53));
        buttonPress7.setText(Database.getGameString("STR_BUTTON_BACK"));
        this.addChild(buttonPress7);
    },

    addBkg: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var bkg = cc.Sprite.create(res.how_bkg);
        bkg.setCascadeOpacityEnabled(true);
        bkg.setPosition(cc.p(pos.x * .5, pos.y * .5 - 60));
        this.addChild(bkg);
        return bkg;
    },

    addTitleBkg: function (bkg) {
        var pos = cc.pFromSize(bkg.getContentSize());
        var titleBkg = cc.Sprite.create(res.how_to_play);
        titleBkg.setPosition(cc.p(pos.x * .5, pos.y * .5 + 293));
        titleBkg.setCascadeOpacityEnabled(true);
        bkg.addChild(titleBkg);
        return titleBkg;
    },

    addTitleText: function (tbkg) {
        var pos = cc.pFromSize(tbkg.getContentSize());
        var label = cc.LabelTTF.create(Database.getGameString("STR_HOWTOPLAY_TITLE"), getFontNamePlatform(res.fontMontserrat), 50, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color.BLACK);
        label.setPosition(cc.p(pos.x * .5, pos.y * .5));
        tbkg.addChild(label);
    },

    addText: function (bkg) {
        var pos = cc.pFromSize(bkg.getContentSize());
        var label = cc.LabelTTF.create(Database.getGameString("STR_HOWTOPLAY_TEXT"), getFontNamePlatform(res.fontMontserrat), 18, cc.size(HowInterface.TEXTSIZE_X, 0), cc.TEXT_ALIGNMENT_LEFT, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color.BLACK);
        label.setPosition(cc.p(pos.x * .5, pos.y * .5));
        bkg.addChild(label);
    }

});

HowInterface.TEXTSIZE_X = 720;

HowInterface.create = function (params) {
    var instance = new HowInterface();
    instance.init(params);
    return instance;
};
