var TabSelectable = {

    _highlight: null,
    _selector: null,
    _neighbours: null, //left first, clock wise
    _mode: 0,
    _modeMin: 0,

    initTabSelectable: function () {
        this.addHighlight();
        this.addSelector();
    },

    addHighlight: function () {
        this._highlight = cc.Sprite.create(res.wstack);
        this._highlight.setPosition(this.getTabSelectPos());
        this._highlight.setVisible(false);
        this.addChild(this._highlight);
    },

    addSelector: function () {
        this._selector = cc.Sprite.create(res.wstack);
        this._selector.setPosition(this.getTabSelectPos());
        this._selector.setVisible(false);
        this.addChild(this._selector);
    },

    setNeighbours: function (neigh) {
        this._neighbours = neigh;
    },

    getNeighbours: function () {
        return this._neighbours;
    },

    getNeighbour: function (dir) {
        return this._neighbours[dir];
    },

    setModeElevated: function (mode) {
        if (mode > this._mode) {
            this.setMode(mode);
        }
    },

    setModeMin: function (mode) {
        this._modeMin = mode;
    },

    setMode: function (mode) {
        this._mode = mode;
        switch (mode) {
            case TabSelectable.MODE_NONE:
                this._highlight.stopAllActions();
                this._highlight.setVisible(false);
                this._selector.setVisible(false);
                break;
            case TabSelectable.MODE_MOVE:
                this._selector.setVisible(false);
                if (this._highlight.getNumberOfRunningActions() == 0) {
                    this._highlight.setVisible(true);
                    this._highlight.setColor(TabSelectable.COLOR_SELECTED);
                    this._highlight.runAction(
                        cc.repeatForever(
                            cc.sequence(
                                cc.fadeOut(.3),
                                cc.fadeIn(.3),
                                cc.delayTime(.3)
                            )
                        )
                    );
                }
                break;
            case TabSelectable.MODE_OVER:
                this._selector.setVisible(true);
                this._selector.setColor(cc.color.YELLOW);
                break;
            case TabSelectable.MODE_OVER_SELECTED:
                this._selector.setVisible(true);
                this._selector.setColor(cc.color.GREEN);
                break;
            case TabSelectable.MODE_SELECTED:
                this._selector.setVisible(true);
                this._selector.setColor(cc.color(0, 255, 255));
                break;
        }
    },

    getMode: function () {
        return this._mode;
    },

    resetMode: function () {
        this.setMode(Math.max(TabSelectable.MODE_NONE, this._modeMin));
    }
};

TabSelectable.MODE_NONE = 0;
TabSelectable.MODE_MOVE = 1;
TabSelectable.MODE_OVER = 2;
TabSelectable.MODE_OVER_SELECTED = 3;
TabSelectable.MODE_SELECTED = 4;
TabSelectable.COLOR_SELECTED = cc.color(0, 255, 255);