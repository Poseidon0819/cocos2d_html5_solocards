var Slot = cc.Layer.extend({

    _holder: null, //next card
    _dragSlot: null,

    init: function (params) {
        this.initParams();
        this.initTabSelectable();
        this.addHolder();
        this._dragSlot = params.dragSlot;
    },

    initParams: function () {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
    },

    addHolder: function () {
        this._holder = cc.Layer.create();
        this._holder.setCascadeOpacityEnabled(true);
        this._holder.ignoreAnchorPointForPosition(false);
        this._holder.setAnchorPoint(cc.p(.5, .5));
        var sizeFixed = this.getContentSize();
        this._holder.setContentSize(sizeFixed);
        this._holder.setPosition(cc.p(sizeFixed.width * .5, sizeFixed.height * .5));
        this.addChild(this._holder);
    },

    isEmpty: function () {
        return this._holder.getChildren().length == 0;
    },

    setNext: function (slot) { //dont use outside of this class
        this._holder.addChild(slot, 1);
    },

    getNext: function () { //dont use outside of this class
        var children = this._holder.getChildren();
        var length = children.length;
        console.assert(length <= 1);
        return length == 1 ? children[0] : null;
    },

    addTop: function (top) {
        var slot = this.getTop();
        top.setHomeSlot(slot.getBottom());
        slot.setNext(top);
    },

    getTop: function () {
        var slot = this;
        while (next = slot.getNext()) {
            slot = next;
        }
        return slot;
    },

    getPrev: function () { // TODO: add back chain?
        var prevNSlot = this.getParent();
        var prevObj = prevNSlot.getParent();
        return prevObj instanceof Slot ? prevObj : null;
    },

    getBottom: function () {
        var prev = this;
        while (p = prev.getPrev()) {
            if (p instanceof Slot) {
                prev = p;
            } else {
                break;
            }
        }
        return prev;
    },

    getCount: function () {
        var slot = this;
        var count = 0;
        while (next = slot.getNext()) {
            slot = next;
            count++;
        }
        return count;
    },

    contentInDragSlot: function () {
        var childern = this._dragSlot.getChildren();
        var length = childern.length;
        for (var i = 0; i < length; i++) {
            var card = childern[i];
            if (card.getHomeSlot() == this) {
                return true;
            }
        }
        return false;
    },

    clear: function () { //always bottom slot
        var next = this.getNext();
        if (next) {
            next.getDragSlot().removeAllChildren();
            next.removeFromParent();
        }
    }

});

for (var key in TabSelectable) Slot.prototype[key] = TabSelectable[key];
for (var key in SlotSerialize) Slot.prototype[key] = SlotSerialize[key];