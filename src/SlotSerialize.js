var SlotSerialize = {

    _id: -1, //currently used only in bottom slot

    setID: function (id) {
        this._id = id;
    },

    getID: function () {
        return this._id;
    },

    load: function (state) {
        state.forEach(function (p) {
            this.getBottom().addCard(p[0], p[1], p[2]);
        }.bind(this));
    },

    save: function (state) { //ignore bottom slot, not a card
        if (this == this.getBottom()) {
            state[this._id] = [];
        } else {
            state[this.getBottom().getID()].push([this.getValue(), this.getSuite(), this.isFaceDown()]);
        }
        var next = this.getNext();
        if (next) {
            next.save(state)
        }
    }

};