var StackBase = Slot.extend({

    _slot: null,
    _blockExceptTopCard: true,
    _callbackAccepted: null,
    _callbackAddCard: null,
    _ladder: false,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this._callbackAccepted = params.callbackAccepted;
        this._callbackAddCard = params.callbackAddCard;
        Slot.prototype.init.call(this, params);
    },

    cardArrived: function (card) {
        var cardWorldPos = card.getParent().convertToWorldSpace(card.getPosition());
        var cardColumnPos = this.getParent().convertToNodeSpace(cardWorldPos);
        var rect = this.getBoundingBox();
        if (cc.rectContainsPoint(rect, cardColumnPos) && this.isAcceptAllowed(card)) {
            this.acceptCard(card);
            return true;
        }
        return false;
    },

    acceptCard: function (card) {
        var homeSlot = card.getHomeSlot();
        homeSlot.getBottom().cardTaken();
        card.setLocalZOrder(0); //restore Z order, may be reversed from drag slot
        var cardPosWorld = card.getParent().convertToWorldSpace(card.getPosition());
        card.retain();
        card.removeFromParent(false);
        var top = this.getTop();
        var ns = this.getScale();
        var cs = card.getScale();
        card.stopAllActions();
        ns < cs ? card.setScale(1 / ns) : card.setScale(ns); //apply initial scale in parent candidate
        card.setPosition(top.convertToNodeSpace(cardPosWorld));
        card.runAction(
            cc.sequence(
                cc.moveTo(.1, top.getBottom().getCardHomePos()).easing(cc.easeSineOut()),
                cc.callFunc(
                    function () {
                        card.scaleAdjust(top);
                        Sound.getInstance().playSound(res.placed_sound);
                    }.bind(this)
                )
            )
        );
        top.addTop(card);
        card.release();
        if (this._callbackAccepted) {
            this._callbackAccepted(homeSlot, this, card);
        }
    },

    isCardBlocked: function (card) {
        if (this._blockExceptTopCard) {
            return this.getTop() != card;
        } else {
            return false;
        }
    },

    isAllBlockedExceptTop: function () {
        return this._blockExceptTopCard;
    },

    moveCardToSlotA: function (targetSlot, card, faceDown) {
        card.passToDragSlot();
        card.runAction(
            cc.sequence(
                cc.moveTo(StackBase.DEALMOVETIME, card.getDragSlot().convertToNodeSpace(targetSlot.getCardHomePosWorld())),
                cc.callFunc(
                    function () {
                        if (faceDown !== undefined) {
                            card.faceDown(faceDown, true);
                        }
                        targetSlot.acceptCard(card);
                    }.bind(this)
                )
            )
        );
    },

    moveCardToSlot: function (targetSlot, delay, faceDown, doneCallback) {
        var card = this.getTop();
        card.passToDragSlot();
        card.runAction(
            cc.sequence(
                cc.delayTime(delay),
                cc.moveTo(StackBase.DEALMOVETIME, card.getDragSlot().convertToNodeSpace(targetSlot.getCardHomePosWorld())),
                cc.callFunc(
                    function () {
                        //card.faceDown(faceDown, true);
                        targetSlot.acceptCard(card);
                        card.faceDown(faceDown, true);//moved here to save state in undo
                        if (doneCallback) {
                            doneCallback();
                        }
                    }.bind(this)
                )
            )
        );
    },

    moveCardsToSlot: function (slot, faceDown, num, orderedDelay, startOrderedDelay, doneCallback) {
        var length = this.getCount();
        var dealNum = (num === undefined || num == -1) ? length : Math.min(length, num);
        var sod = (startOrderedDelay === undefined ? 0 : startOrderedDelay);
        var od = 0;
        for (var i = 0; i < dealNum; i++) {
            od = (orderedDelay === undefined) ? .1 : orderedDelay * i + sod;
            var dc = null;
            if (i == dealNum - 1) {
                dc = doneCallback;
            }
            this.moveCardToSlot(slot, od, faceDown, dc);
        }
        return od;
    },

    getCardHomePosWorld: function () {
        return this.getTop().convertToWorldSpace(this.getCardHomePos());
    },

    setLadder: function (ladder) {
        this._ladder = ladder;
    },

    getLadder: function () {
        return this._ladder;
    },

    addCard: function (value, suite, faceDown) {
        var card = this._callbackAddCard(value, suite, faceDown);
        card.setPosition(this.getCardHomePos());
        this.addTop(card);
    }
});

for (var key in TabSelectable) StackBase.prototype[key] = TabSelectable[key];

StackBase.DEALMOVETIME = .08;