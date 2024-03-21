var StockPile = StackBase.extend({

    _waistStackRequestCardsBack: null,
    _getWaistStack: null,

    init: function (params) {
        this.setContentSize(cc.size(StockPile.SIZEX, StockPile.SIZEY));
        StackBase.prototype.init.call(this, params);
        this.addListener();
        this._waistStackRequestCardsBack = params.waistStackRequestCardsBack;
        this._getWaistStack = params.getWaistStack;
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
        cc.eventManager.addListener(eventListener, this);
    },

    touchStart: function (touch) {
        var rect = this.getBoundingBox();
        var touchPos = this.getParent().convertToNodeSpace(touch.getLocation());
        if (cc.rectContainsPoint(rect, touchPos)) {
            this.tryDealCards();
            return true;
        }
        return false;
    },

    tryDealCards: function () {
        if (this.isEmpty() == false) {
            this.moveCardsToSlot(this._getWaistStack(), false, StockPile.DEALNUM, Card.FLIPTIME * 1.1);
        } else {
            var ws = this._getWaistStack();
            if (ws.contentInDragSlot() == false) {
                Manager.SAVETOFILEDISABLED = true; //avoid stutter, save to disk expensive
                ws.moveCardsToSlot(this, true, -1, .01, 0,
                    function () {
                        Manager.SAVETOFILEDISABLED = false;
                        this._callbackAccepted();//to save table state
                    }.bind(this)
                );
            }
        }
    },

    getCardHomePos: function () {
        return cc.p(StockPile.SIZEX * .5, StockPile.SIZEY * .5);
    },

    getTabSelectPos: function () {
        return this.getCardHomePos();
    },

    cardTaken: function () {

    },

    isAcceptAllowed: function (card) {
        return false;
    }

});

StockPile.SIZEX = 136;
StockPile.SIZEY = 191;
StockPile.DEALNUM = 1;

StockPile.create = function (params) {
    var instance = new StockPile();
    instance.init(params);
    return instance;
};
