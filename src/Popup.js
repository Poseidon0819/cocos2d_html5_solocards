var Popup = Modal.extend({

    init: function (params) {
        Modal.prototype.init.call(this);
        var bkg = this.addBkg();
        this.addTitle(bkg, params.title);
        this.addText(bkg, params.text);
        this.addButtonYes(bkg);
        this.addButtonNo(bkg)
    },

    addBkg: function () {
        var size = this._moving.getContentSize();
        var image = cc.Sprite.create(res.game_over);
        image.setCascadeOpacityEnabled(true);
        image.setPosition(cc.p(size.width / 2.0, size.height / 2.0));
        this._moving.addChild(image);
        return image;
    },

    addTitle: function (bkg, title) {
        var pos = cc.pFromSize(bkg.getContentSize());
        var label = cc.LabelTTF.create(title, getFontNamePlatform(res.fontMontserrat), 65, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color.BLACK);
        label.setPosition(cc.p(pos.x * .5, pos.y * .5 + 140));
        label.setScale(.75);
        bkg.addChild(label);
    },

    addText: function (bkg, text) {
        var pos = cc.pFromSize(bkg.getContentSize());
        var label = cc.LabelTTF.create(text, getFontNamePlatform(res.fontMontserrat), 55, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color.BLACK);
        label.setPosition(cc.p(pos.x * .5 + 20, pos.y * .5 + -40));
        label.setScale(.9);
        bkg.addChild(label);
    },

    addButtonYes: function (bkg) {
        var pos = cc.pFromSize(bkg.getContentSize());
        var button = Button.create(
            {
                strPicFile: res.yes,
                textColor: cc.color.BLACK,
                textSize: 45,
                keyScan: [cc.KEY["6"], cc.KEY.num6],
                callback:
                    function () {
                        this.hide();
                    }.bind(this)
            }
        );
        button.setPosition(cc.p(pos.x * .5 + 160, -10));
        button.setText(Database.getGameString("STR_BUTTON_YES"));
        bkg.addChild(button);
    },

    addButtonNo: function (bkg) {
        var pos = cc.pFromSize(bkg.getContentSize());
        var button = Button.create(
            {
                strPicFile: res.no,
                textColor: cc.color.BLACK,
                textSize: 45,
                keyScan: [cc.KEY["4"], cc.KEY.num4],
                callback:
                    function () {
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_HOME, {}, function () {});
                        this.hide();
                    }.bind(this)
            }
        );
        button.setPosition(cc.p(pos.x * .5 - 160, -10));
        button.setText(Database.getGameString("STR_BUTTON_NO"));
        bkg.addChild(button);
    }

});

Popup.create = function (params) {
    var layer = new Popup();
    layer.init(params);
    return layer;
}

