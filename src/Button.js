//code version TTF 2

var Button = cc.Layer.extend({

    labelLetter: null,
    textWidthLimit: -1,
    //sideSpaceWidth: -1,
    callback: null,
    button: null,
    buttonPressed: null,
    buttonOff: null,
    base: null,
    keyScan: [],

    init: function (params) {

        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setCascadeOpacityEnabled(true);

        this.base = cc.Layer.create();
        this.base.ignoreAnchorPointForPosition(false);
        this.base.setAnchorPoint(cc.p(0.5, 0.5));
        this.base.setCascadeColorEnabled(true);
        this.base.setCascadeOpacityEnabled(true);
        this.addChild(this.base);

        this.button = cc.Sprite.create(params.strPicFile);
        this.setContentSize(this.button.getContentSize());
        this.base.setContentSize(this.button.getContentSize());
        this.base.setPosition(cc.pMult(cc.pFromSize(this.button.getContentSize()), .5));
        this.button.setCascadeColorEnabled(true);
        this.button.setCascadeOpacityEnabled(true);
        this.button.setPosition(cc.pMult(cc.pFromSize(this.button.getContentSize()), .5));
        this.base.addChild(this.button);

        if (params.strPicFilePressed) {
            this.buttonPressed = cc.Sprite.create(params.strPicFilePressed);
            this.buttonPressed.setCascadeColorEnabled(true);
            this.buttonPressed.setCascadeOpacityEnabled(true);
            this.buttonPressed.setOpacity(0);
            this.buttonPressed.setPosition(cc.pMult(cc.pFromSize(this.buttonPressed.getContentSize()), .5));
            this.base.addChild(this.buttonPressed);
        }

        if (params.strPicFileOff) {

            this.buttonOff = cc.Sprite.create(params.strPicFileOff);
            this.buttonOff.setPosition(cc.pMult(cc.pFromSize(this.buttonOff.getContentSize()), .5));
            this.base.addChild(this.buttonOff);

        }

        this.callback = params.callback;

        this.textWidthLimit = params.textWidthLimit ? params.textWidthLimit : -1;

        this.labelLetter = cc.LabelTTF.create("  ", getFontNamePlatform(res.fontMontserrat), params.textSize, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        if (cc.sys.isNative == false) {
            this.labelLetter.setLineHeight(params.textSize * .94);
        }
        //this.sideSpaceWidth = this.labelLetter.getContentSize().width;

        var pos = cc.pMult(cc.pFromSize(this.getContentSize()), .5);// = (params.textCoordX == -1 || params.textCoordY == -1) ? cc.pDiv(cc.pFromSize(this.getContentSize()), 2) : cc.p(params.textCoordX, params.textCoordY);

        if (params.textCoordX) {
            pos.x = params.textCoordX;
        }

        if (params.textCoordY) {
            pos.y = params.textCoordY;
        }

        this.labelLetter.setPosition(pos);
        this.labelLetter.setColor(params.textColor);
        if (params.textColorStroke) {
            this.labelLetter.enableStroke(params.textColorStroke, params.textSizeStroke);
        }
        this.button.addChild(this.labelLetter);

        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE
        });
        eventListener.setSwallowTouches(false);
        eventListener.onTouchBegan =
            function (touch, event) {

                var rect = this.getBoundingBox();
                var leftMin = cc.p(rect.x, rect.y);
                var rightMax = cc.p(rect.x + rect.width, rect.y + rect.height);
                leftMin = this.getParent().convertToWorldSpace(leftMin);
                rightMax = this.getParent().convertToWorldSpace(rightMax);
                rect = cc.rect(leftMin.x, leftMin.y, rightMax.x - leftMin.x, rightMax.y - leftMin.y);

                if (cc.rectContainsPoint(rect, touch.getLocation())) {

                    Sound.getInstance().playSound(res.button);

                    this.onButtonActivated();

                    return true;
                }
                return false;
            }.bind(this);
        cc.eventManager.addListener(eventListener, this);

        if (params.keyScan.length > 0) {

            this.keyScan = params.keyScan;

            var keyboardListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD
            });

            keyboardListener.onKeyPressed =
                function (keyCode, event) {
                    if (this.keyScan.indexOf(keyCode) != -1) {
                        this.onButtonActivated();
                    }
                }.bind(this);

            cc.eventManager.addListener(keyboardListener, this);


            ///////////////////////////////////////////////
            /*cc.eventManager.addListener({
                event : cc.EventListener.KEYBOARD,
                onKeyPressed : function(k, e) {
                    //if (k == cc.KEY.back) {
                        this.onButtonActivated();
                    //}
                }.bind(this)
            }, this);*/


        }
    },

    setText: function (text) {
        //this.labelLetter.setString(" " + text + " ");
        this.labelLetter.setString(text);
        if (this.textWidthLimit == -1) {
            var w = this.getContentSize().width;
            this.textWidthLimit =  w - w/10;
        }
        var labelSizeWidth = this.labelLetter.getContentSize().width;// - this.sideSpaceWidth;
        if (labelSizeWidth > this.textWidthLimit) {
            this.labelLetter.setScale(this.textWidthLimit / labelSizeWidth);
        }
    },

    getbase: function (node) {

        return this.base;
    },

    setOn: function (bMode) {

        if (this.buttonOff) {

            if (bMode == false) {

                this.buttonOff.setVisible(true);
                this.button.setVisible(false);
            }
            else {

                this.button.setVisible(true);
                this.buttonOff.setVisible(false);
            }
        }

    },

    onButtonActivated: function () {

        if (this.base.getNumberOfRunningActions() != 0) {
            this.base.stopAllActions();
        }


        if (this.buttonPressed == null) {

            var scaleShrink = cc.scaleTo(0.1, .92);
            var tintShrink = cc.tintTo(0.1, 210, 210, 210);
            var spawnShink = cc.spawn(scaleShrink, tintShrink);

            var scaleInflate = cc.scaleTo(0.1, 1.);
            var tintInflate = cc.tintTo(0.1, 255, 255, 255);
            var spawnInflate = cc.spawn(scaleInflate, tintInflate);

            this.base.runAction(cc.sequence(spawnShink,

                cc.callFunc(function () {
                    if (this.buttonOff) //2 mode
                    {
                        if (this.button.isVisible()) {
                            this.setOn(false);
                        }
                        else {
                            this.setOn(true);
                        }
                    }
                }.bind(this)),

                spawnInflate, cc.callFunc(function () { this.callback(this.button.isVisible()); }.bind(this))));
        } else {

            this.button.setOpacity(0);
            this.buttonPressed.setOpacity(255);

            this.buttonPressed.runAction(cc.sequence(cc.delayTime(0.3),

                cc.callFunc(function () {

                    this.button.setOpacity(255);
                    this.buttonPressed.setOpacity(0);

                    if (this.buttonOff) //2 mode
                    {
                        if (this.button.isVisible()) {
                            this.setOn(false);
                        }
                        else {
                            this.setOn(true);
                        }
                    }
                }.bind(this)), cc.callFunc(function () { this.callback(this.button.isVisible()); }.bind(this))));

        }

    }

});

Button.PARAMS = function () {

    this.strPicFile = "";
    this.strPicFilePressed = "";
    this.strPicFileOff = "";
    this.textSize = 18;
    this.textWidthLimit = -1;
    this.textColor = cc.color.WHITE;
    this.textColorStroke = null;
    this.textCoordX = -1;
    this.textCoordY = -1;
    this.callback = null;
    this.keyScan = [];

};

Button.create = function (param) {

    var layer = new Button();
    layer.init(param);
    return layer;

};