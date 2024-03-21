var WaistStack = StackBase.extend({

    init: function (params) {
        this.setContentSize(cc.size(WaistStack.SIZEX, WaistStack.SIZEY));
        StackBase.prototype.init.call(this, params);
    },

    getCardHomePos: function () {
        var length = this.getCount();
        var shiftX = 0;
        if (length == 0) {
            shiftX = 0;
        } else if (length < StockPile.DEALNUM) {
            shiftX = WaistStack.SHIFT;
        } else {
            if (length % StockPile.DEALNUM == 0) {
                shiftX = -(StockPile.DEALNUM - 1) * WaistStack.SHIFT;
            } else {
                shiftX = WaistStack.SHIFT;
            }
        }
        return cc.p(WaistStack.SIZEX * .5 + shiftX, WaistStack.SIZEY * .5);
    },

    getTabSelectPos: function () {
        return cc.p(WaistStack.SIZEX * .5, WaistStack.SIZEY * .5);
    },

    cardTaken: function () {

    },

    isAcceptAllowed: function (card) {
        return false;
    }
});

WaistStack.SIZEX = 136;
WaistStack.SIZEY = 191;
WaistStack.SHIFT = 20;

WaistStack.create = function (params) {
    var instance = new WaistStack();
    instance.init(params);
    return instance;
};
