var Language = cc.Layer.extend({

    init: function (params) {
        this.initParams();
        this.addLangTitle(params.lang);
        this.addIcon(params.lang);
        this.addButton(params.keyName, params.keyScan, params.lang);
    },

    initParams: function () {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0, 1));
        this.setCascadeOpacityEnabled(true);
        this.setContentSize(cc.size(Language.SIZEX, Language.SIZEY));
    },

    addLangTitle: function (lang) {
        var bkg = cc.Sprite.create(res.lang_title);
        bkg.setCascadeOpacityEnabled(true);
        bkg.setPosition(cc.p(Language.SIZEX * .5, 163));
        this.addChild(bkg);
        var pos = cc.pFromSize(bkg.getContentSize());
        var label = cc.LabelTTF.create(Database.getGameString("STR_TEXT_LANGUAGE_" + Globals.LANGUAGE.toUpperCase(), lang), getFontNamePlatform(res.fontMontserrat), 28, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color.BLACK);
        label.setPosition(cc.p(pos.x * .5, pos.y * .5 - 3));
        bkg.addChild(label);
        var sizexBkg = bkg.getContentSize().width*.9;
        var sizexLabel = label.getContentSize().width;
        if (sizexLabel > sizexBkg) {
            label.setScale(sizexBkg/sizexLabel);
        }
    },

    addIcon: function (lang) {
        var icon = cc.Sprite.create("res/graph/flag_" + lang + ".png");
        icon.setPosition(cc.p(Language.SIZEX * .5, 93));
        this.addChild(icon);
    },

    addButton: function (keyName, keyScan, lang) {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPress = Button.create(
            {
                strPicFile: res.lang_button,
                keyScan: keyScan,
                textSize: 20,
                textColor: cc.color.BLACK,
                callback:
                    function () {
                        //Globals.LANGUAGE = lang;
                        //Overlays.getInstance().changeOverlay(OverlaysStates.OVER_HOME, {}, function (overlayCreated) { });
                        Language.setLanguage(lang);
                    }.bind(this)
            }
        );
        buttonPress.setPosition(cc.p(pos.x * .5, 22));
        buttonPress.setText(Database.getGameString("STR_TEXT_PRESS") + "\n" + keyName);
        this.addChild(buttonPress);
    },

});

Language.SIZEX = 172;
Language.SIZEY = 182;

Language.setLanguage = function (language, country) {
    /*if (country === undefined) {
        if (language == "en") {
            Globals.COUNTRY = "us";
        } else if (language == "fr") {
            Globals.COUNTRY = "fr";
        }
    } else {
        Globals.COUNTRY = country;
    }*/
    Globals.LANGUAGE = language;    
    Overlays.getInstance().changeOverlay(OverlaysStates.OVER_HOME, {}, function (overlayCreated) { });
};


Language.create = function (params) {
    var instance = new Language();
    instance.init(params);
    return instance;
};


