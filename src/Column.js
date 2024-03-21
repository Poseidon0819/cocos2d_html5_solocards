var Column = StackBase.extend({

    init: function (params) {
        this.setContentSize(cc.size(Column.SIZEX, Column.SIZEY));
        StackBase.prototype.init.call(this, params);
        this.setAnchorPoint(cc.p(0.5, 1));
        this._blockExceptTopCard = false;
    },

    getCardHomePos: function (card) {
        var length = this.getCount();
        if (length > 0) {
            return cc.p(Column.STARTX, Card.SIZEY * .5 - Column.VERTOFFSET);
        }
        return cc.p(Column.STARTX, Column.STARTY);
    },

    getTabSelectPos: function () {
        return cc.p(Column.STARTX, Column.SIZEY - Card.SIZEY * .5);
    },

    isAcceptAllowed: function (card) {
        if (this.contentInDragSlot() == true) {
            return false;
        }
        var top = this.getTop();
        if (top == this) { //empty 
            if (card.getRank() == Card.RANKKING) {
                return true;
            }
        } else { //cards present
            var cardTopRank = top.getRank();
            var cardRank = card.getRank();
            if (/*cardTopRank != Card.RANKACE &&*/
                cardTopRank - cardRank == 1 && 
                top.isRed() != card.isRed()) {
                return true;
            }
        }
        return false;
    },

    cardTaken: function () {
        if (this.isEmpty() == false) {
            this.getTop().faceDown(false, true);
        }
    }

});

Column.SIZEX = 136;
Column.SIZEY = 320;
Column.STARTX = Column.SIZEX * .5;
Column.STARTY = Column.SIZEY - Card.SIZEY * .5;
Column.VERTOFFSET = 24;

Column.create = function (params) {
    var instance = new Column();
    instance.init(params);
    return instance;
};

