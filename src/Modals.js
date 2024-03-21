function Modals() {

    if (arguments.callee.instance) {
        return arguments.callee.instance;
    }

    arguments.callee.instance = this;

    this.queueWindows = [];
    this.modalActive = false;
    var funcExecAfterAll = null;
    var scene = null;

    this.resetExecAfterAllWindows = function () {

        funcExecAfterAll = null;
    };

    this.execAfterAllWindows = function (func) {

        funcExecAfterAll = func;
    };


    this.onEndWindow = function (bTriggerNext) {

        if (this.modalActive == false) {
            return;
        }

        this.modalActive = false;

        //
        var pParent = scene;//cocos2d::Director::getInstance()->getRunningScene();
        var root = scene.getChildByName("root");
        cc.eventManager.resumeTarget(root, true);
        cc.eventManager.resumeTarget(root.getChildByName("overlay_holder"), true);

        Globals.actionsPause(root, false);
        Globals.actionsPause(root.getChildByName("overlay_holder"), false);

        //root.resumeJoyListener();

        if (this.queueWindows.length == 0 && funcExecAfterAll) {
            funcExecAfterAll();
            this.resetExecAfterAllWindows();
        }

        if (bTriggerNext) {
            this.onStartWindow();
        }

    };

    this.setScene = function (pScene) {

        scene = pScene;

    };

    this.onStartWindow = function () {

        if (this.queueWindows.length == 0) {
            return;
        }

        if (this.modalActive == false) {
            var func = this.queueWindows[0];
            this.queueWindows.shift();
            func();
            this.modalActive = true;
        }

    }.bind(this);

    this.show = function (strClass, params, bPostpone/* = false*/, bPause) { //pospone if you need to popup appear not instantly, in next scene

        if (bPostpone === undefined) {
            bPostpone = false;
        }

        var pFunc = function () {

            var pScene = scene;
            var root = pScene.getChildByName("root");
            if (bPause) {
                cc.eventManager.pauseTarget(root, true);
                cc.eventManager.pauseTarget(root.getChildByName("overlay_holder"), true);
                Globals.actionsPause(root, true);
                Globals.actionsPause(root.getChildByName("overlay_holder"), true);
            }
            //root.pauseJoyListener();

            var ObjClass = window[strClass];
            var pInstance = ObjClass.create(params);
            pInstance.setName("modal_window");
            pScene.getChildByName("root").getChildByName("modal_holder").addChild(pInstance, 1);
            pInstance.show();
            
        }.bind(this);

        this.queueWindows.push(pFunc);

        if (bPostpone == false) {
            this.onStartWindow();
        }
    };

    this.isActive = function () {

        return this.modalActive || (this.queueWindows.length > 0);
    };

    this.getScene = function () {

        return scene;
    };

};

Modals.getInstance = function () {

    var singletonClass = new Modals();
    return singletonClass;

};
