var Highlighter = cc.Class.extend({

    _highlighted: null,
    _cbGetPossibleSlots: null,

    ctor: function () {
        this._highlighted = [];
    },

    init: function (params) {
        this._cbGetPossibleSlots = params.cbGetPossibleSlots;
    },

    highlightPossible: function (card) {
        var possibleSlots = this._cbGetPossibleSlots(card);
        if (card) {
            for (var i = 0; i < possibleSlots.length; i++) {
                var ps = possibleSlots[i];
                ps.setModeMin(TabSelectable.MODE_MOVE);
                ps.resetMode();
                this._highlighted.push(ps);
            }
        } else {
            for (var i = 0; i < this._highlighted.length; i++) {
                var hl = this._highlighted[i];
                hl.setModeMin(TabSelectable.MODE_NONE);
                hl.resetMode();
            }
            this._highlighted = [];
        }
    }

});

Highlighter.create = function (params) {
    var instance = new Highlighter();
    instance.init(params);
    return instance;
};

