var Modal = cc.Layer.extend({

    _background : null,
    _moving: null,
    _closeAnyTouch: false,

    ctor:function () {
        cc.Layer.prototype.ctor.call(this);
        //this.initJoyContainer();
    },

    init: function (closeAnyTouch) {

        var visibleSize = this.getContentSize();

        this.setCascadeOpacityEnabled(true);

        this._background = cc.LayerColor.create();
        this._background.ignoreAnchorPointForPosition(false);
        this._background.setAnchorPoint(cc.p(.5,.5));
        this._background.setPosition(cc.pMult(cc.pFromSize(visibleSize), .5));
        this._background.setColor(cc.color.BLACK);
        this._background.setOpacity(0);
        this.addChild(this._background);

        var punchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE
        });

        punchListener.setSwallowTouches(true);

        punchListener.onTouchBegan =
            function (touch, event) {
                if (this._closeAnyTouch) {                    
                    this.hide();
                }
                return true; 
            }.bind(this);
        cc.eventManager.addListener(punchListener, this);

        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:function (key, event) {
                if (this._closeAnyTouch) {
                    this.hide();
                }
            }.bind(this)
        });

        cc.eventManager.addListener(keyboardListener, this);

        this._closeAnyTouch = closeAnyTouch;

        this._moving = cc.Layer.create();
        this._moving.setContentSize(this.getContentSize());
        this._moving.ignoreAnchorPointForPosition(false);
        this._moving.setCascadeOpacityEnabled(true);
        this._moving.setAnchorPoint(cc.p(.5,.5));
        this._moving.setPosition(cc.pMult(cc.pFromSize(visibleSize), .5));
        this._moving.setScale(0.5);
        this._moving.setOpacity(0.0);
        this.addChild(this._moving);

        //this.registerJoystick(this);
    },

    show: function () {
        
        var scale = cc.scaleTo(Modal.POPUP_TIME*2.0, 1).easing(cc.easeElasticOut());
        var fade = cc.fadeIn(Modal.POPUP_TIME);
        var spawn = cc.spawn(scale, fade);
        this._moving.runAction(cc.sequence(spawn, cc.callFunc(function () { this.onShow(); }.bind(this))));

        this._background.runAction(cc.fadeTo(Modal.POPUP_TIME, 120));
    },

    hide: function () {

        if (this._moving.getNumberOfRunningActions() > 0) {
            this._moving.stopAllActions();
        }

        if (this._background.getNumberOfRunningActions() > 0) {
            this._background.stopAllActions();
        }
        
        if (this.getNumberOfRunningActions() > 0) {
            this.stopAllActions();
        }

        cc.eventManager.pauseTarget(this, true);
        var scale = cc.scaleTo(Modal.POPUP_TIME, .5).easing(cc.easeElasticIn(1));
        var fade = cc.fadeOut(Modal.POPUP_TIME);
        var spawn = cc.spawn(scale, fade);
        this._moving.runAction(cc.sequence(spawn, cc.callFunc(function () { this.onHide(); }.bind(this))));
        this._background.runAction(cc.fadeTo(Modal.POPUP_TIME, 0));
    },

    onShow: function() {

    },

    onHide: function () {

        Modals.getInstance().onEndWindow(true);
        this.removeFromParent();
    }

});

//for (var key in JoyContainer) Modal.prototype[key] = JoyContainer[key];

Modal.POPUP_TIME = 0.75; 


