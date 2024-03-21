var Table = cc.Layer.extend({

    _diff: "",
    _stockPile: null,
    _waistStack: null,
    _fstacks: null,
    _columns: null,
    _cardListeners: null,
    _dragSlot: null,
    _addCallbacksDpad: null,
    _callbackGameOver: null, //replace with _callbackPassFieldState, remove game state logic from here i e check game over etc
    _tabSelector: null,
    _undo: null,
    _highlighter: null,
    //_callbackScoreUpdate: null,
    _cbCardAccepted: null,
    _cbLoadTable: null,

    ctor: function () {
        this._super();
        this._fstacks = [];
        this._columns = [];
    },

    init: function (params) {
        this.initParams();
        this.addCardListeners();
        this._addCallbacksDpad = params.addCallbacksDpad;
        this._callbackGameOver = params.callbackGameOver;
//        this._callbackScoreUpdate = params.callbackScoreUpdate;
        this._cbCardAccepted = params.cbCardAccepted;
        this._cbLoadTable = params.cbLoadTable;
        this._diff = params.difficulty;
        this.addUndo();
        this.addTabSelector(params.cbGetAutoSlots);
        this.addHighlighter(params.cbGetPossibleSlots);
        this.addDragSlot();
        this.addStockPile();
        this.addWaistStack();
        this.addFoundationStacks();
        this.addColumns();
    },

    initParams: function () {
        this.setCascadeOpacityEnabled(true);
    },

    addTabSelector: function (getAutoSlots) {
        this._tabSelector = TabSelector.create(
            {
                cbHighlightPossible: function (card) {
                    this._highlighter.highlightPossible(card);
                }.bind(this),
                cbGetAutoSlots: function (card) {
                    return getAutoSlots(card);
                }
            }
        );
    },

    addUndo: function () {
        this._undo = Undo.create();
    },

    addHighlighter: function (getPossibleSlots) {
        this._highlighter = Highlighter.create(
            {
                cbGetPossibleSlots: function (p) {
                    return getPossibleSlots(p);
                }
            }
        );
    },

    addCardListeners: function () {
        this._cardListeners = CardListeners.create();
    },

    addDragSlot: function () {
        this._dragSlot = cc.Layer.create();
        this._dragSlot.setCascadeOpacityEnabled(true);
        this.addChild(this._dragSlot, 1);
    },

    addStockPile: function () {
        this._stockPile = StockPile.create(
            {
                getWaistStack: function () {
                    return this._waistStack;
                }.bind(this),
                callbackAccepted: function (p, s, c) {
                    this.cardAccepted(p, s, c);
                }.bind(this),
                callbackAddCard: function (v, s, f) {
                    return this.addCard(v, s, f);
                }.bind(this),
                dragSlot: this._dragSlot
            }
        );
        this._stockPile.setPosition(cc.p(93, 474));
        this.addChild(this._stockPile);
    },

    addWaistStack: function () {
        this._waistStack = WaistStack.create(
            {
                callbackAccepted: function (p, s, c) {
                    this.cardAccepted(p, s, c);
                }.bind(this),
                callbackAddCard: function (v, s, f) {
                    return this.addCard(v, s, f);
                }.bind(this),
                dragSlot: this._dragSlot
            }
        );
        this._waistStack.setPosition(cc.p(Table.WSTACKX, Table.WSTACKY));
        this.addChild(this._waistStack);
    },

    addFoundationStacks: function () {
        for (var i = 0; i < Table.FOUNDSTACKS_NUM; i++) {
            var fs = FoundationStack.create(
                {
                    callbackAccepted: function (p, s, c) {
                        this.cardAccepted(p, s, c);
                    }.bind(this),
                    callbackAddCard: function (v, s, f) {
                        return this.addCard(v, s, f);
                    }.bind(this),
                    dragSlot: this._dragSlot
                }
            );
            this._cardListeners.addListener(fs);
            fs.setPosition(cc.p(Table.FOUNDSTACKS_START + Table.FOUNDSTACKS_SPACE * i, Table.FOUNDSTACKS_Y));
            fs.setScale(FoundationStack.SCALE);
            this.addChild(fs);
            this._fstacks.push(fs);
        }
    },

    addColumns: function () {
        for (var i = 0; i < Table.COLUMNS_NUM; i++) {
            var col = Column.create(
                {
                    callbackAccepted: function (p, s, c) {
                        this.cardAccepted(p, s, c);
                    }.bind(this),
                    callbackAddCard: function (v, s, f) {
                        return this.addCard(v, s, f);
                    }.bind(this),
                    dragSlot: this._dragSlot
                }
            );
            col.setLadder(true);
            this._cardListeners.addListener(col);
            col.setPosition(cc.p(Table.COLUMNS_START + Table.COLUMNS_SPACE * i, Table.COLUMNS_Y));
            this.addChild(col);
            this._columns.push(col);
        }
    },

    addCard: function (value, suite, faceDown) {
        var card = Card.create(
            {
                value: value,
                suite: suite,
                rank: CARD_VALUES.indexOf(value),
                faceDown: faceDown,
                dragSlot: this._dragSlot,
                callbackArrive: function (card) {
                    return this._cardListeners.onCardArrive(card);
                }.bind(this),
                callbackTabSelReset: function () {
                    this._tabSelector.moveToHomeInitSlot();
                }.bind(this)
            }
        );
        return card;
    },

    addCards: function (diff) {
        if (this._cbLoadTable() == true) {
            return;
        }
        var cards = [];
        for (var i = 0; i < CARD_VALUES.length; i++) {
            for (var j = 0; j < CARD_SUITS.length; j++) {
                var card = this.addCard(CARD_VALUES[i], CARD_SUITS[j], true);
                card.retain();
                cards.push(card);
            }
        }
        if (diff == "normal") {
            cards = Globals.shuffleArrayJS(cards);
        }
        for (var i = 0; i < cards.length; i++) {
            var item = cards[i];
            item.setPosition(StockPile.SIZEX * .5, StockPile.SIZEY * .5);
            this._stockPile.addTop(item);
            item.release();
        }
        this.dealCards();
    },

    dealCards: function () {
        Manager.SAVETOFILEDISABLED = true;//avoid stutter by turning off save to file temporary on each acceptCard() call
        var sod = Table.ORDERED_DELAY;
        for (var i = 0; i < Table.COLUMNS_NUM; i++) {
            var doneCallback = null;
            if (i == Table.COLUMNS_NUM - 1) {
                doneCallback = function () {
                    this.flipOver();
                    Manager.SAVETOFILEDISABLED = false;
                    this._undo.setEnabled(true);
                    this._cbCardAccepted();//to save table state ater manual flip over 
                }.bind(this)
            }
            sod = this._stockPile.moveCardsToSlot(this._columns[i], true, i + 1, Table.ORDERED_DELAY, sod, doneCallback) + Table.ORDERED_DELAY;
        }
    },

    flipOver: function () {
        for (var i = 0; i < Table.COLUMNS_NUM; i++) {
            var col = this._columns[i]
            var top = col.getTop();
            if (top != col) {
                top.faceDown(false, true, i * .1);
            }
        }
    },

    finalize: function () {
        this.setIDs();
        this.tabSelLink();
        this.tabSelCallbacks();
    },

    tabSelLink: function () {
        this._stockPile.setNeighbours([null, null, this._waistStack, this._columns[0]]);
        this._waistStack.setNeighbours([this._stockPile, null, this._fstacks[0], this._columns[1]]);
        this._fstacks[0].setNeighbours([this._waistStack, null, this._fstacks[1], this._columns[2]]);
        this._fstacks[1].setNeighbours([this._fstacks[0], null, this._fstacks[2], this._columns[3]]);
        this._fstacks[2].setNeighbours([this._fstacks[1], null, this._fstacks[3], this._columns[4]]);
        this._fstacks[3].setNeighbours([this._fstacks[2], null, this._columns[6], this._columns[5]]);
        this._columns[0].setNeighbours([null, this._stockPile, this._columns[1], null]);
        this._columns[1].setNeighbours([this._columns[0], this._waistStack, this._columns[2], null]);
        this._columns[2].setNeighbours([this._columns[1], this._fstacks[0], this._columns[3], null]);
        this._columns[3].setNeighbours([this._columns[2], this._fstacks[1], this._columns[4], null]);
        this._columns[4].setNeighbours([this._columns[3], this._fstacks[2], this._columns[5], null]);
        this._columns[5].setNeighbours([this._columns[4], this._fstacks[3], this._columns[6], null]);
        this._columns[6].setNeighbours([this._columns[5], this._fstacks[3], null, null]);
    },

    tabSelCallbacks: function () {
        this._addCallbacksDpad(
            function (d) {
                this.dirControl(d);
            }.bind(this._tabSelector)
        );
    },

    cardAccepted: function (prevSlot, targetSlot, card) {
        this._undo.setLastMove(prevSlot, targetSlot, card);
        this._cbCardAccepted();
    },

    undo: function() {
        this._undo.doUndo();
    },

    getBottomSlots: function () {
        var bslots = [];
        bslots.push(this._stockPile);
        bslots.push(this._waistStack);
        bslots = bslots.concat(this._fstacks);
        bslots = bslots.concat(this._columns);
        return bslots;
    },

    setIDs: function () {
        var bs = this.getBottomSlots();
        for (var i = 0; i < bs.length; i++) {
            bs[i].setID(i.toString());
        }
    },

    initLayout: function () {
        this.addCards(this._diff);
        this._tabSelector.setHomeInit(this._stockPile);
        this._tabSelector.moveToHomeInitSlot();
    }

});

Table.WSTACKX = 251;
Table.WSTACKY = 474;
Table.COLUMNS_Y = 343;
Table.COLUMNS_START = 100;
Table.COLUMNS_SPACE = 156;
Table.COLUMNS_NUM = 7;
Table.FOUNDSTACKS_START = 464;
Table.FOUNDSTACKS_SPACE = 125;
Table.FOUNDSTACKS_NUM = 4;
Table.FOUNDSTACKS_Y = 474;
Table.ORDERED_DELAY = 0.08;

Table.create = function (params) {
    var instance = new Table();
    instance.init(params);
    return instance;
};


