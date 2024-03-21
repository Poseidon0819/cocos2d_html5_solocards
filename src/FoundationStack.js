var FoundationStack = StackBase.extend({

    init: function (params) {
        this.setContentSize(cc.size(FoundationStack.SIZEX, FoundationStack.SIZEY));
        StackBase.prototype.init.call(this, params);
    },

    getCardHomePos: function (card) {
        var length = this.getCount();
        if (length > 0) {
            return cc.p(Card.SIZEX * .5, Card.SIZEY * .5);
        }
        return cc.p(FoundationStack.SIZEX * .5, FoundationStack.SIZEY * .5);
    },

    getTabSelectPos: function () {
        return cc.p(FoundationStack.SIZEX * .5, FoundationStack.SIZEY * .5);
    },

    isAcceptAllowed: function (card) {
        if (this.contentInDragSlot() == true) {
            return false;
        }
        if (card.getNext()) { //cards chain not allowed
            return false;
        }
        var count = this.getCount();
        if (count == 0) {
            if (card.getRank() == Card.RANKACE) {
                return true;
            }
        } else {
            var top = this.getTop();
            if (count == 1 &&
                card.getRank() == Card.RANKTWO &&
                card.getSuite() == top.getSuite() &&
                top.getRank() == Card.RANKACE) {
                return true
            } else {
                return (card.getRank() - top.getRank()) == 1 && card.getSuite() == top.getSuite();
            }
        }
        return false;
    },

    cardTaken: function () {

    }
});

//FoundationStack.SIZEX = 106;
//FoundationStack.SIZEY = 148;
FoundationStack.SIZEX = 136;
FoundationStack.SIZEY = 191;
FoundationStack.SCALE = .78;


FoundationStack.create = function (params) {
    var instance = new FoundationStack();
    instance.init(params);
    return instance;
};
