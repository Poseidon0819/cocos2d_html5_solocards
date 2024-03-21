var TabSelector = cc.Class.extend({

    _selected: null,
    _focus: null,
    _homeInitSlot: null,
    _cbHighlightPossible: null,
    _cbGetAutoSlots: null,

    ctor: function () {
        this._listeners = [];
    },

    init: function (params) {
        this._cbHighlightPossible = params.cbHighlightPossible;
        this._cbGetAutoSlots = params.cbGetAutoSlots;
    },

    setHomeInit: function (item) {
        this._homeInitSlot = item;
    },

    moveToHomeInitSlot: function () {
        this.setFocus(this._homeInitSlot);
    },

    dirControl: function (dir) {
        var fbottom = this._focus.getBottom();
        var ftop = this._focus.getTop();
        var ladder = fbottom.getLadder();
        var fprev = this._focus.getPrev();
        var fnext = this._focus.getNext();
        switch (dir) {
            case TabSelector.DIR_UP:
                if (fbottom.isEmpty() == false && ladder) {
                    if (fprev && fprev != fbottom && fprev.isFaceDown() == false) {
                        this.setFocus(fprev);
                        return;
                    }
                }
                break;
            case TabSelector.DIR_DOWN:
                if (fnext && ladder) {
                    this.setFocus(fnext);
                    return;
                }
                break;
            case TabSelector.DIR_CENTER:
                if (this._selected == null) {
                    if (fbottom instanceof StockPile) { //TODO: refactor with isTabSelectable() onTabCenter() etc remove instance of
                        fbottom.tryDealCards();
                        this.setFocus(fbottom.getTop());
                    } else if (fbottom != ftop) {
                        this._selected = this._focus;
                        this._selected.setMode(TabSelectable.MODE_SELECTED);
                        this._cbHighlightPossible(this._selected);
                        var autoSlot = this._cbGetAutoSlots(this._selected);
                        if (autoSlot != null) {
                            this._selected.getBottom().moveCardToSlotA(autoSlot.getBottom(), this._selected);
                            this.selectedToFocus();
                        }
                    }
                } else {
                    if (this._selected == this._focus) {
                        this.selectedToFocus();
                    } else {
                        if (this._focus.getBottom().contentInDragSlot() == false &&
                            this._selected instanceof Card &&
                            fbottom.isAcceptAllowed(this._selected) &&
                            fbottom != this._selected.getBottom()) {
                            this._selected.getBottom().moveCardToSlotA(this._focus.getBottom(), this._selected);
                            this.selectedToFocus();
                        }
                    }
                }
                return;
        }
        var neigh = fbottom.getNeighbour(dir);
        if (neigh) {
            this.setFocus(neigh.getTop());
        }
    },

    setFocus: function (item, override) {
        if (this._focus &&
            this._focus.getMode() <= TabSelectable.MODE_OVER_SELECTED) {
            this._focus.resetMode();
        }
        item.setModeElevated((override || this._selected == null) ? TabSelectable.MODE_OVER : TabSelectable.MODE_OVER_SELECTED);
        this._focus = item;
    },

    selectedToFocus: function () {
        this._selected.resetMode();
        this.setFocus(this._selected, true);
        this._selected = null;
        this._cbHighlightPossible(this._selected);
    }

});

TabSelector.DIR_LEFT = 0;
TabSelector.DIR_UP = 1;
TabSelector.DIR_RIGHT = 2;
TabSelector.DIR_DOWN = 3;
TabSelector.DIR_CENTER = 4;

TabSelector.create = function (params) {
    var instance = new TabSelector();
    instance.init(params);
    return instance;
};

