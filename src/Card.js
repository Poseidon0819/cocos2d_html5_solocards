var Card = Slot.extend({

    _face: null,
    _back: null,
    _facedDown: true,
    _value: null,
    _suite: null,
    _rank: -1,
    _hotPoint: null,
    _callbackArrive: null,
    _callbackTabSelReset: null,
    _homeSlot: null, //always bottom slot (deck holder)

    init: function (params) {
        this.initParams();
        this.addBack();
        this.addFace(params.value, params.suite);
        //this.addHelperLayer();
        //this.addNextCardHolder();
        this._value = params.value;
        this._suite = params.suite;
        this._rank = params.rank;
        this._callbackArrive = params.callbackArrive;
        this._callbackTabSelReset = params.callbackTabSelReset;
        this.faceDown(params.faceDown, false);
        this.addListener();
        Slot.prototype.init.call(this, params);
    },

    initParams: function () {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setCascadeOpacityEnabled(true);
        this.setContentSize(cc.size(Card.SIZEX, Card.SIZEY));
    },

    addFace: function (val, suite) {
        this._face = cc.Sprite.create("res/graph/cards/" + val + "_" + suite + ".png");
        this._face.setPosition(cc.p(Card.SIZEX * .5, Card.SIZEY * .5));
        this.addChild(this._face);
    },

    addBack: function () {
        this._back = cc.Sprite.create(res.card_back);
        this._back.setPosition(cc.p(Card.SIZEX * .5, Card.SIZEY * .5));
        this.addChild(this._back);
    },

    faceDown: function (turnDown, animated, delay) {
        if (animated) {
            this._back.stopAllActions();
            this._face.stopAllActions();
            if (turnDown) {
                this._facedDown = true;
                this._face.runAction(
                    cc.sequence(
                        cc.delayTime(delay ? delay : 0),
                        cc.scaleTo(Card.FLIPTIME * .5, 0, 1),
                        cc.callFunc(
                            function () {
                                this._back.runAction(cc.scaleTo(Card.FLIPTIME * .5, 1, 1));
                            }.bind(this)
                        )
                    )
                );
            } else {
                this._facedDown = false;
                this._back.runAction(
                    cc.sequence(
                        cc.delayTime(delay ? delay : 0),
                        cc.scaleTo(Card.FLIPTIME * .5, 0, 1),
                        cc.callFunc(
                            function () {
                                this._face.runAction(
                                    cc.sequence(
                                        cc.scaleTo(Card.FLIPTIME * .5, 1, 1),
                                        cc.callFunc(
                                            function () {
                                                //this._facedDown = false;
                                            }.bind(this)
                                        )
                                    )
                                );
                            }.bind(this)
                        )
                    )
                );
            }
        } else {
            if (turnDown) {
                this._facedDown = true;
                this._back.setScaleX(1);
                this._face.setScaleX(0);
            } else {
                this._facedDown = false;
                this._back.setScaleX(0);
                this._face.setScaleX(1);
            }
        }
    },

    addListener: function () {
        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE
        });
        eventListener.setSwallowTouches(true);
        eventListener.onTouchBegan =
            function (touch, event) {
                return this.touchStart(touch);
            }.bind(this);
        eventListener.onTouchMoved =
            function (touch, event) {
                this.touchDrag(touch);
            }.bind(this);
        eventListener.onTouchEnded =
            function (touch, event) {
                this.touchEnd(touch);
            }.bind(this);
        cc.eventManager.addListener(eventListener, this);
    },

    touchStart: function (touch) {
        var rect = this.getBoundingBox();
        var touchPos = this.getParent().convertToNodeSpace(touch.getLocation());
        if (this._facedDown == false && cc.rectContainsPoint(rect, touchPos) && this.isBlockedInSlot() == false && this._homeSlot.contentInDragSlot() == false) {
            this._callbackTabSelReset();
            this.passToDragSlot(touch);
            return true;
        }
        return false;
    },

    touchEnd: function (touch) {
        if (this._callbackArrive(this) == false) {
            this.slideToHomeInDragSlot();
        }
    },

    touchDrag: function (touch) {
        var pos = this.getParent().convertToNodeSpace(touch.getLocation())
        if (pos) {
            this.setPosition(cc.pAdd(pos, this._hotPoint));
        }
    },

    getTabSelectPos: function () {
        return cc.p(Card.SIZEX * .5, Card.SIZEY * .5);
    },

    passToDragSlot: function (touch) { //TODO: create drag layer class, move these three functions there
        this.stopAllActions(); //?? refactor to card states, card MOVING, DRAG, DEAL etc, maybe remove that
        var next = this.getBottom();//.getNext();
        if (next) { //check if not in drag slot
            this.setScale(next.getScale()); //always higher scale could be in drag slot, no need to check scale direction like in Stackbase.acceptcard
        }
        this.scaleAdjust();
        var posWorld = this.getParent().convertToWorldSpace(this.getPosition());
        this.retain();
        this.removeFromParent(false);
        var posDragSlot = this._dragSlot.convertToNodeSpace(posWorld);
        this.setPosition(posDragSlot);
        var children = this._dragSlot.getChildren(); //TODO: create drag layer class move move under there?
        var length = children.length;
        var lzo = length > 0 ? children[length - 1].getLocalZOrder() - 1 : 0;
        this._dragSlot.addChild(this);
        this.setLocalZOrder(lzo); //move under in drag slot
        this.release();
        if (touch !== undefined) {
            var touchPos = this.getParent().convertToNodeSpace(touch.getLocation());
            this._hotPoint = cc.pSub(this.getPosition(), touchPos);
        } else {
            this._hotPoint = cc.p(0, 0);
        }
    },

    retrieveFromDragSlot: function () {
        console.assert(this.getParent() == this._dragSlot);
        var posWorld = this.getParent().convertToWorldSpace(this.getPosition());
        this.retain();
        this.setLocalZOrder(0);
        this.removeFromParent(false);
        var top = this._homeSlot.getTop();
        var posHomeSlot = top.convertToNodeSpace(posWorld);
        this.setPosition(posHomeSlot);
        top.addTop(this);
        this.release();
        this.stopAllActions()
        this.setScale(1 / top.getBottom().getScale()); //always lower scale could be from drag slot, no need to check scale direction like in Stackbase.acceptcard
        this.scaleAdjust(top);
    },

    slideToHomeInDragSlot: function () {
        var homePos = this._homeSlot.getBottom().getCardHomePos(this);
        var worldPos = this._homeSlot.getTop().convertToWorldSpace(homePos)
        var homePosDragSlot = this._dragSlot.convertToNodeSpace(worldPos);
        this.runAction(
            cc.sequence(
                cc.moveTo(.2, homePosDragSlot).easing(cc.easeSineOut()),
                cc.callFunc(
                    function () {
                        this.retrieveFromDragSlot();
                    }.bind(this)
                )
            )
        );
    },

    getDragSlot: function () {
        return this._dragSlot;
    },

    setHomeSlot: function (slot) {
        this._homeSlot = slot;
    },

    scaleAdjust: function (slot) {
        var cardX = this.getContentSize().width;
        var parentX = slot ? slot.getContentSize().width : cardX;
        this.runAction(cc.scaleTo(.1, parentX / cardX).easing(cc.easeSineOut()));
    },

    isBlockedInSlot: function () {
        return this._homeSlot.isCardBlocked(this);
    },

    isCardBlocked: function () { //card chain not blocked
        return false;
    },

    isRed: function () {
        return (this._suite == "hearts" || this._suite == "diamonds");
    },

    getRank: function () { //0 - 2, 13 - ace
        return this._rank;
    },

    getHomeSlot: function () {
        return this._homeSlot;
    },

    getValue: function () {
        return this._value;
    },

    getSuite: function () {
        return this._suite;
    },

    getHelperLayer: function () {
        return this._helperLayer;
    },

    isFaceDown: function () {
        return this._facedDown;
    }

});

Card.SIZEX = 136;
Card.SIZEY = 191;
Card.FLIPTIME = .085;
Card.RANKTWO = 0;
Card.RANKKING = 11;
Card.RANKACE = 12;

Card.create = function (params) {
    var instance = new Card();
    instance.init(params);
    return instance;
};


