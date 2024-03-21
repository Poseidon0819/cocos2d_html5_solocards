var TopBar = cc.Sprite.extend({

    _topScore: null,
    _score: null,

    init: function (params) {
        this.initWithFile(res.box);
        this.setCascadeOpacityEnabled(true);
        this.addTopScore();
        this.addScore();
        this.addTime(params.cbSaveTime);
    },

    addTopScore: function () {
        this._topScore = Score.create(
            {
                label: Database.getGameString("STR_TEXT_SCORE_BEST") + " : "
            }
        );
        this._topScore.setPosition(cc.p(TopBar.TOPSCOREX, TopBar.TOPSCOREY));
        this.addChild(this._topScore);
    },

    addScore: function () {
        this._score = Score.create(
            {
                label: Database.getGameString("STR_TEXT_SCORE") + " : "
            }
        );
        this._score.setPosition(cc.p(TopBar.SCOREX, TopBar.SCOREY));
        this.addChild(this._score);
    },

    addTime: function (cbst) {
        this._time = Time.create(
            {
                label: Database.getGameString("STR_TEXT_TIME") + " : ",
                cbSaveTime: cbst
            }
        );
        this._time.setPosition(cc.p(TopBar.TIMEX, TopBar.TIMEY));
        this.addChild(this._time);
    },

    setScoreBest: function (value) {
        this._topScore.setScore(value);
    },

    setScore: function (value) {
        this._score.setScore(value);
    },

    setSeconds: function (t) {
        this._time.setSeconds(t);
    }
});

TopBar.TOPSCOREX = 135;
TopBar.TOPSCOREY = 24;
TopBar.SCOREX = 370;
TopBar.SCOREY = 24;
TopBar.TIMEX = 605;
TopBar.TIMEY = 24;


TopBar.create = function (params) {
    var instance = new TopBar();
    instance.init(params);
    return instance;

};


