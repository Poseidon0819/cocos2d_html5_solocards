var Undo = cc.Class.extend({

    _prev: null,
    _target: null,
    _card: null,
    _faceDown: false,
    _enabled: false,

    ctor: function () {
        //    this._listeners = [];
    },

    init: function (params) {

    },

    setLastMove: function (prevSlot, targetSlot, card) {
        if (this._enabled &&
            prevSlot !== undefined &&
            targetSlot !== undefined &&
            card !== undefined) {
            this._prev = prevSlot;
            this._target = targetSlot;
            this._card = card;
            this._faceDown = card.isFaceDown();
        }
    },

    doUndo: function () {
        if (this._prev == null) {
            return;
        }
        this._target.getBottom().moveCardToSlotA(this._prev.getBottom(), this._card, this._faceDown);
        this._prev = this._target = this._card = null;
    },

    setEnabled: function (enabled) {
        this._enabled = enabled;
    }
});

Undo.create = function (params) {
    var instance = new Undo();
    instance.init(params);
    return instance;
};

