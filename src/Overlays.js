
var OverlaysStates = {
    OVER_UNKNOWN: -1,
    OVER_HOME: 0,
    OVER_GAME: 1,
    OVER_HOW: 2,
    OVER_LANG: 3
};

function Overlays() {

    if (arguments.callee.instance) {
        return arguments.callee.instance;
    }

    arguments.callee.instance = this;
    historyStack = [];

    this.changeOverlay = function (gameOverlay, params, onCreateCallback) {
        var overlayHolder = cc.director.getRunningScene().getChildByName("root").getChildByName("overlay_holder");
        var curOverlay = overlayHolder.getChildren()[0];
        if (curOverlay) {
            cc.eventManager.pauseTarget(curOverlay, true);
            var fadeOut = cc.fadeOut(Overlays.TRANSITION_TIME).easing(cc.easeSineOut());
            curOverlay.runAction(
                cc.sequence(
                    fadeOut,
                    cc.callFunc(
                        function (sender) {
                            sender.removeFromParent();
                            //Manager.saveToFile();
                            this.createNextOverlay(gameOverlay, params, overlayHolder, onCreateCallback);
                        }.bind(this)
                    )
                )
            );
        } else {
            this.createNextOverlay(gameOverlay, params, overlayHolder, onCreateCallback);
        }
    };

    this.createNextOverlay = function (gameOverlay, params, overlayHolder, onCreateCallback) {
        var overlay = null;
        switch (gameOverlay) { //TODO: remove this switch use text to class name to create ?
            case OverlaysStates.OVER_HOME:
                {
                    overlay = HomeOverlay.create(params);
                    break;
                }
            case OverlaysStates.OVER_GAME:
                {
                    overlay = GameOverlay.create(params);
                    break;
                }
            case OverlaysStates.OVER_HOW:
                {
                    overlay = HowOverlay.create(params);
                    break;
                }
            case OverlaysStates.OVER_LANG:
                {
                    overlay = LangOverlay.create(params);
                    break;
                }
            default:
                console.assert(false);
                break;
        }
        overlay.setOpacity(0);
        overlayHolder.addChild(overlay);
        onCreateCallback(overlay);
        Modals.getInstance().onStartWindow();
        var fadeIn = cc.fadeIn(Overlays.TRANSITION_TIME).easing(cc.easeSineIn());
        overlay.runAction(fadeIn);
        historyStack.push({ o: gameOverlay, p: params });
    };

    this.rollbackOverlay = function () {
        if (historyStack.length < 2) {
            return;
        }
        historyStack.pop();//current
        var savedOverlay = historyStack.pop();
        this.changeOverlay(savedOverlay.o, savedOverlay.p, function () { });
    };
};

Overlays.TRANSITION_TIME = .4;
Overlays.getInstance = function () {
    var singletonClass = new Overlays();
    return singletonClass;
};
