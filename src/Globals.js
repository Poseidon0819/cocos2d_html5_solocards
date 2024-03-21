function Globals() {
}

Globals.CLOUD_ENABLED = ("__CLOUD_ON__" != "__CLOUD_OFF__");
Globals.SHOP_ENABLED = ("__SHOP_ON__" != "__SHOP_OFF__");
Globals.ADS_ENABLED = ("__ADS_ON__" != "__ADS_OFF__");
Globals.FACEBOOK_ENABLED = ("__FACEBOOK_ON__" != "__FACEBOOK_OFF__");
Globals.SDKBOXWEB_ENABLED = ("__SDKBOXWEB_ON__" != "__SDKBOXWEB_OFF__");
Globals.DPAD = ("__DPAD_OFF__" == "__DPAD_ON__");; //d-pad/joystic controls
Globals.NODRAGSUPPORT = ("__NODRAGSUPPORT_OFF__" == "__NODRAGSUPPORT_ON__");//for mouse-alike or touch devices without drag(mouseMove) and touchUP(mouseUP) events, such as TV remotes
Globals.TOUCH = ("__TOUCH_OFF__" == "__TOUCH_ON__"); //touch or keys
Globals.GAMENAME = "__GAMENAME__"
Globals.GAME = "__GAME__"; //"easy"
Globals.COUNTRY = "__COUNTRY__"; //"us"
Globals.debugGame = 0;
Globals.debugCountry = 0;
Globals.TEXT_COLOR = cc.color(39, 154, 141);
Globals.FONT_SIZE_FACTOR = 32;
Globals.STROKE_COLOR = cc.color(255, 101, 0);
Globals.CHEATS = false;
Globals.TUTORIAL = false; //Globals.TUTORIAL = ("__TUTORIAL_ON__" != "__TUTORIAL_OFF__");
Globals.LANGUAGE = "en";
Globals.LANGUAGE_AVAIL = ["en", "fr", "de", "it", "nl", "pt", "es"];
Globals.MUTE_ON = ("__MUTE_OFF__" == "__MUTE_ON__");

var c_tokens = [25, 67, 23, 78, 11, 67, 90, 18, 31, 18, 25, 87, 25, 71]; //kee save:)

Globals.doubleNums = function (n) {
    return n > 9 ? "" + n : ("0" + n).slice(-2);
};

Globals.actionsPause = function (pNode, bPause) {
    if (bPause)
        pNode.pause();
    else
        pNode.resume();


    var arr = pNode.getChildren();
    var arrSize = arr.length;
    for (var i = 0; i < arrSize; i++) {
        Globals.actionsPause(arr[i], bPause);
    }
};

Globals.chopChop = function (vOut, strIn, delim) {

    if (delim === undefined) {
        delim = '|';
    }

    vOut.push.apply(vOut, strIn.split(delim));
};

Globals.chopChopLength = function (vOut, strIn, width) {

    var seek = 0;
    var left = 0;

    while (true) {

        var pos = seek + width;

        if (pos < strIn.length) {

            seek = strIn.lastIndexOf(" ", pos);

            var strOut = strIn.slice(left, seek);
            strOut = strOut.trim();
            vOut.push(strOut);

            left = seek;

        } else {

            var strOut = strIn.slice(left, strIn.length - 1);
            strOut = strOut.trim();
            vOut.push(strOut);

            break;
        }
    }
};

Globals.findParentWithMethod = function (parent, method) {
    while (parent = parent.getParent()) {
        if (typeof parent[method] === "function") {
            return parent;
        }
    }
    return null;
};

Globals.getChildByNameRecursive = function (node, nodeName) {
    var child = node.getChildByName(nodeName);
    if (child != null) {
        return child;
    }
    var children = node.getChildren();
    for (var i = 0; i < children.length; i++) {
        var res = Globals.getChildByNameRecursive(children[i], nodeName);
        if (res) {
            return res;
        }
    }
    return null;
};

Globals.strReturnReplace = function (strString, strWhat, strTo) {

    if (strWhat === undefined) {

        strWhat = "/n";
    }

    if (strTo === undefined) {

        strTo = "\n";
    }

    return strString.replace(new RegExp(strWhat, "g"), strTo);
};

String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

//if(cc.sys.isNative == false) {
Globals.isFirefox = function () {

    var isFirefox = typeof InstallTrigger !== 'undefined';
    return isFirefox;
};

Globals.strReturnErase = function (strString) {

    return strString.replace(/[\n\r]/g, '');
};

cc.pDiv = function (point, floatVar) {
    return cc.p(point.x / floatVar, point.y / floatVar);
};

Array.prototype.erase = function (val) {

    var index = this.indexOf(val);
    this.splice(index, 1);

};

if (typeof console.assert === 'undefined') { //for spydermonkey on android
    console.assert = function () {
        // fallback code here
    }
}

Globals.shuffleArrayJS = function (array) {

    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

Globals.hexStringtoCCcolor = function (snum) {
    var num = parseInt(snum.replace(/\W/g, ''), 16);
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    return cc.color(r, g, b, a);
};

///////////////////////////////////////////////////////////////////////////////////////////////////
//old IE fixes
//////////////////////////////////////////////////////////////////////////////////////////////////
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function (predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        }
    });
}




