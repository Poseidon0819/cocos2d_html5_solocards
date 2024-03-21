var GameStage = cc.Layer.extend({

    _callbackInterface: null,
    _callbackManager: null,
    _table: null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this._callbackInterface = params.callbackInterface;
        this._callbackManager = params.callbackManager;
        this.addTableHelpers();
        this.addTable(params.difficulty);
    },

    callbackStage: function (params) {
        switch (params.id) {
            case CallbackID.GET_BOTTOM_SLOTS:
                return this._table.getBottomSlots();
            case CallbackID.INIT_TABLE:
                this._table.initLayout();
                break;
            case CallbackID.UNDO:
                this._table.undo();
                break;
        }
    },

    addTableHelpers: function () {
        var tableHelpers = cc.Layer.create();
        tableHelpers.setCascadeOpacityEnabled(true);
        this.addWaistStackHelper(tableHelpers);
        this.addFoundationStackHelpers(tableHelpers);
        this.addChild(tableHelpers);
    },

    addWaistStackHelper: function (parent) {
        var sprite = cc.Sprite.create(res.wstack);
        sprite.setPosition(cc.p(Table.WSTACKX, Table.WSTACKY));
        parent.addChild(sprite);
    },

    addFoundationStackHelpers: function (parent) {
        for (var i = 0; i < Table.FOUNDSTACKS_NUM; i++) {
            var sprite = cc.Sprite.create(res.fstacka);
            sprite.setPosition(cc.p(Table.FOUNDSTACKS_START + Table.FOUNDSTACKS_SPACE * i, Table.FOUNDSTACKS_Y));
            parent.addChild(sprite);
        }
    },

    addTable: function (diff) {
        this._table = Table.create(
            {
                difficulty: diff,
                addCallbacksDpad: function (cb) {
                    this._callbackInterface({ id: CallbackID.ADD_DPAD_CALLBACK, value: cb });
                }.bind(this),
                /*callbackScoreUpdate: function (s) {
                    this._callbackInterface({ id: CallbackID.UPDATE_SCORE_CALLBACK, value: s });//TODO: replace with manager call, instead of direct interface update, score should be updated from the manager
                }.bind(this),*/
                cbGetPossibleSlots: function (p) {
                    return this._callbackManager({ id: CallbackID.GET_POSSIBLE_SLOTS, value: p });
                }.bind(this),
                cbGetAutoSlots: function (p) {
                    return this._callbackManager({ id: CallbackID.GET_AUTO_SLOTS, value: p });
                }.bind(this),
                cbCardAccepted: function () {
                    this._callbackManager({ id: CallbackID.CARD_ACCEPTED });
                }.bind(this),
                cbLoadTable: function () {
                    return this._callbackManager({ id: CallbackID.LOAD_TABLE });
                }.bind(this)
            }
        );
        this.addChild(this._table);
    },

    finalize: function () {
        this._table.finalize();
    }

});

GameStage.create = function (params) {
    var instance = new GameStage();
    instance.init(params);
    return instance;
};
