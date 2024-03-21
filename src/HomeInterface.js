var HomeInterface = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addExit();
        this.addLanguage();
        this.addPlayEasy();
        this.addPlayNormal();
        this.addHow();
        this.addLogo();
    },

    addExit: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress7 = Button.create(
            {
                strPicFile: res.exit,
                keyScan: [cc.KEY["7"], cc.KEY.num7],
                textSize: 32,
                textColor: cc.color.BLACK,
                callback:
                    function () {
                        ExternalGameAPI_callbackGameExit();
                        cc.director.end();
                    }.bind(this)
            }
        );
        buttonPress7.setPosition(cc.p(100, pos.y - 53));
        buttonPress7.setText(Database.getGameString("STR_BUTTON_EXIT"));
        this.addChild(buttonPress7);
    },

    addLanguage: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress3 = Button.create(
            {
                strPicFile: res.language,
                keyScan: [cc.KEY["3"], cc.KEY.num3],
                textSize: 32,
                textColor: cc.color.BLACK,
                callback:
                    function () {
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_LANG, {}, function (overlayCreated) { });
                    }.bind(this)
            }
        );
        buttonPress3.setPosition(cc.p(pos.x - 100, pos.y - 53));
        buttonPress3.setText(Database.getGameString("STR_BUTTON_LANGUAGE"));
        this.addChild(buttonPress3);
    },

    addPlayEasy: function () {
        var pos = cc.pFromSize(this.getContentSize());
        this.addPlay(Database.getGameString("STR_BUTTON_PLAY_EASY"), pos.y - 270,
            function () {
                Overlays.getInstance().changeOverlay(OverlaysStates.OVER_GAME, { diff: "easy" }, function (overlayCreated) { });
            }.bind(this),
            [cc.KEY["4"], cc.KEY.num4]
        );
    },

    addPlayNormal: function () {
        var pos = cc.pFromSize(this.getContentSize());
        this.addPlay(Database.getGameString("STR_BUTTON_PLAY_NORMAL"), pos.y - 410,
            function () {
                Overlays.getInstance().changeOverlay(OverlaysStates.OVER_GAME, { diff: "normal" }, function (overlayCreated) { });
            }.bind(this),
            [cc.KEY["5"], cc.KEY.num5]
        );
    },

    addPlay: function (text, y, callbackPlay, keys) {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress5 = Button.create(
            {
                strPicFile: res.play,
                keyScan: keys,
                textSize: 50,
                textColor: cc.color.BLACK,
                callback: callbackPlay

            }
        );
        buttonPress5.setPosition(cc.p(pos.x * 0.5, y));
        buttonPress5.setText(text);
        this.addChild(buttonPress5);
    },

    addHow: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress6 = Button.create(
            {
                strPicFile: res.how_to_play,
                keyScan: [cc.KEY["6"], cc.KEY.num6],
                textSize: 45,
                textColor: cc.color.BLACK,
                callback:
                    function () {
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_HOW, {}, function (overlayCreated) { });
                    }.bind(this)
            }
        );
        buttonPress6.setPosition(cc.p(pos.x * 0.5, pos.y - 550));
        buttonPress6.setText(Database.getGameString("STR_BUTTON_HOWTOPLAY"));
        this.addChild(buttonPress6);
    },

    addLogo: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var label = cc.LabelTTF.create(Database.getGameString("STR_TEXT_TITLE"), getFontNamePlatform(res.fontMontserrat), 40, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color.BLACK);
        label.setPosition(cc.p(pos.x * .5, pos.y - 110));
        label.setScale(2);
        //label.enableStroke(cc.color(38, 33, 99), 6);
        this.addChild(label);
        /*label.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(.5, .98).easing(cc.easeSineInOut()),
                    cc.scaleTo(.5, 1.02).easing(cc.easeSineInOut())
                )
            )
        );*/
    }


});


HomeInterface.create = function (params) {
    var instance = new HomeInterface();
    instance.init(params);
    return instance;
};
