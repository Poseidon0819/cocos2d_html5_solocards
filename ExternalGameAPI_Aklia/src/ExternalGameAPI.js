var ExternalGameAPI = {};

ExternalGameAPI.OpaqueToKey = {
    HOME_MENU :  18,
    BACK :       6,
    KEY_1 :      49,
    KEY_2 :      50,
    KEY_3 :      51,
    KEY_4 :      52,
    KEY_5 :      53,
    KEY_6 :      54,
    KEY_7 :      55,
    KEY_8 :      56,
    KEY_9 :      57,
    KEY_0 :      48,
    KEY_UP :     38,
    KEY_DOWN :   40,
    KEY_LEFT :   37,
    KEY_RIGHT :  39,
    KEY_ENTER :  13,
    UNDEFINED : 99999
};

ExternalGameAPI.setMute = function(val) { //set mute for the game, boolean true(silence),false(sound on)
    Sound.getInstance().mute(val);
};

ExternalGameAPI.setLanguage = function(val) { //set language for the game string, ISO 2 Letter Language Code "en", "fr" ... etc.
    Language.setLanguage(val);
};