var Manager = cc.Class.extend({

    _callbackStage: null,
    _callbackInterface: null,
    _difficulty: null,

    init: function (params) {
        this._callbackStage = params.callbackStage;
        this._callbackInterface = params.callbackInterface;
        this._difficulty = params.difficulty;
    },

    callbackManager: function (params) {
        switch (params.id) {
            case CallbackID.GET_POSSIBLE_SLOTS:
                return this.getPossibleSlots(params.value);
            case CallbackID.GET_AUTO_SLOTS:
                return this.getAutoSlots(params.value);
            case CallbackID.CARD_ACCEPTED:
                this.cardAccepted();
                break;
            case CallbackID.LOAD_TABLE:
                return this.loadTable();
            case CallbackID.SAVE_TIME:
                this.saveTime(params.value);
                return;
            case CallbackID.RESET_GAME:
                this.resetGame();
                break;
        }
    },

    getBottomSlots: function () {
        return this._callbackStage({ id: CallbackID.GET_BOTTOM_SLOTS });
    },

    getPossibleSlots: function (card) {
        var bslots = this.getBottomSlots();
        var variants = [];
        if (card) {
            for (var i = 0; i < bslots.length; i++) {
                var fs = bslots[i];
                if (fs.isAcceptAllowed(card)) {
                    var top = fs.getTop();
                    variants.push(top);
                }
            }
        }
        return variants;
    },

    getAutoSlots: function (card) {
        var possibleSlots = this.getPossibleSlots(card);
        if (card != null &&
            (
                (card.getRank() == Card.RANKACE && possibleSlots.length > 0) ||
                possibleSlots.length == 1
            )
        ) {
            return possibleSlots[0];
        }
        return null;
    },

    getFoundtationStacks: function () {
        var bslots = this.getBottomSlots();
        var fs = bslots.slice(2, 6);//foundation stacks 2-5
        return fs;
    },

    checkWin: function () {
        var fs = this.getFoundtationStacks();
        var win = true;
        fs.forEach(
            function (s) {
                if (s.getCount() != 13) {
                    win = false;
                }
            }
        );
        if (win) {
            this.resetGame();
            Modals.getInstance().show('Popup',
                {
                    title: Database.getGameString("STR_TEXT_WIN_TITLE"),
                    text: Database.getGameString("STR_TEXT_WIN")
                },
                false);
        }
    },

    calcScore: function () {
        var fs = this.getFoundtationStacks();
        var score = 0;
        fs.forEach(
            function (s) {
                score += s.getCount();
            }
        );
        return score;
    },

    updateScores: function () {
        this._callbackInterface({ id: CallbackID.UPDATE_SCORE_CALLBACK, value: Manager.PROGRESS["difficulty"][this._difficulty]["score"] });
        this._callbackInterface({ id: CallbackID.UPDATE_SCORE_BEST_CALLBACK, value: Manager.PROGRESS["difficulty"][this._difficulty]["bscore"] });
    },

    saveScore: function (s) {
        Manager.PROGRESS["difficulty"][this._difficulty]["score"] = s;
        var bscore = Manager.PROGRESS["difficulty"][this._difficulty]["bscore"];
        if (s > bscore) {
            Manager.PROGRESS["difficulty"][this._difficulty]["bscore"] = s;
        }
    },

    saveTime: function (t) {
        Manager.PROGRESS["difficulty"][this._difficulty]["time"] = t;
    },

    restoreTime: function () {
        this._callbackInterface({ id: CallbackID.RESTORE_TIME_CALLBACK, value: Manager.PROGRESS["difficulty"][this._difficulty]["time"] });
    },

    cardAccepted: function () {
        this.saveScore(this.calcScore());
        this.saveTable();
        Manager.saveToFile();
        this.updateScores();
        this.checkWin();
    },

    saveTable: function () {
        var state = {};
        var bslots = this.getBottomSlots();
        bslots.forEach(
            function (s) {
                s.save(state);
            }
        );
        Manager.PROGRESS["difficulty"][this._difficulty]["table"] = state;
    },

    loadTable: function () {
        this.clearTable();
        var state = Manager.PROGRESS["difficulty"][this._difficulty]["table"];
        if (state == 0) {
            return false;
        }
        var bslots = this.getBottomSlots();
        for (var i = 0; i < bslots.length; i++) {
            bslots[i].load(state[i]);
        }
        return true;
    },

    clearTable: function () {
        var bslots = this.getBottomSlots();
        for (var i = 0; i < bslots.length; i++) {
            bslots[i].clear();
        }
    },

    initGame: function () {
        this.updateScores();
        this.restoreTime();
        this._callbackStage({ id: CallbackID.INIT_TABLE });
    },

    resetGame: function () {
        Manager.PROGRESS.difficulty[this._difficulty] = Manager.getDefaultsDifficulty();
        this.initGame();
    }
});

Manager.loadFromFile = function () { //expensive call, dont use too frequently
    var ls = cc.sys.localStorage;
    var data = ls.getItem('solocards_progress');
    var progress = null;
    if (data != null) {
        progress = JSON.parse(data);
    } else {
        progress = Manager.fillDefaults();
    }
    Manager.PROGRESS = progress;
};

Manager.SAVETOFILEDISABLED = false;

Manager.saveToFile = function () { //expensive call, dont use too frequently
    if (Manager.SAVETOFILEDISABLED) {
        return;
    }
    //console.log("save to file system");
    var ls = cc.sys.localStorage;
    ls.setItem('solocards_progress', JSON.stringify(Manager.PROGRESS));
};

Manager.reset = function () {
    Manager.PROGRESS = Manager.fillDefaults();
};

Manager.getDefaultsDifficulty = function() {
    return {
        bscore: 0,
        score: 0,
        time: 0,
        table: 0
    }
},

Manager.fillDefaults = function () {
    var progress = {
        difficulty: {
            easy: Manager.getDefaultsDifficulty(),
            normal: Manager.getDefaultsDifficulty()
        }
    };
    return progress;
};

Manager.create = function (params) {
    var instance = new Manager();
    instance.init(params);
    return instance;
};

