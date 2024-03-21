var CardListeners = cc.Class.extend({

    _listeners: null,

    ctor: function () {
        this._listeners = [];
    },

    init: function (params) {
    },

    addListener: function (listener) {
        this._listeners.push(listener);
    },

    onCardArrive: function (card) {
        for (var i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i].cardArrived(card)) {
                return true;
            }
        }
        return false;
    }

});

CardListeners.create = function (params) {
    var instance = new CardListeners();
    instance.init(params);
    return instance;
};

