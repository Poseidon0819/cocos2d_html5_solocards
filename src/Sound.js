function Sound() {

    if (arguments.callee.instance) {

        return arguments.callee.instance;
    }

    arguments.callee.instance = this;

    this.m_bSoundEnabled = true;
    this.m_bMusicEnabled = true;
    this.m_bMute = false;

    this.m_strMusicLast = '';

    this.init = function () {

        //this.m_bSoundEnabled = LocalSave.loadSettingsBool("sound");
        //this.m_bMusicEnabled = LocalSave.loadSettingsBool("music");
        this.m_bMute = Globals.MUTE_ON;

        cc.audioEngine.setMusicVolume(0.2);
        cc.audioEngine.setEffectsVolume(0.15);

    };

    this.playMusic = function (strMusic) {

        if (this.m_bMusicEnabled && this.m_bMute == false) {

            if (this.m_strMusicLast == strMusic && cc.audioEngine.isMusicPlaying()) {
                return;
            }

            cc.audioEngine.playMusic(strMusic, true);
        }

        this.m_strMusicLast = strMusic;
    };

    this.playSound = function (strSound) {

        if (this.m_bSoundEnabled && this.m_bMute == false) {
            cc.audioEngine.playEffect(strSound);
        }
    };

    this.isSoundEnabled = function () {

        return this.m_bSoundEnabled;
    };

    this.isMusicEnabled = function () {

        return this.m_bMusicEnabled;
    };

    this.enableSound = function (bEnabled) {

        this.m_bSoundEnabled = bEnabled;

        //LocalSave.saveSettingsBool("sound", bEnabled);
    };

    this.enableMusic = function (bEnabled) {

        if (this.m_bMusicEnabled == true) {

            if (bEnabled == false) {

                cc.audioEngine.stopMusic();
            }
        }
        else {

            if (bEnabled == true && this.m_bMute == false) {

                if (this.m_strMusicLast) {
                    cc.audioEngine.playMusic(this.m_strMusicLast, true);
                }
            }
        }

        this.m_bMusicEnabled = bEnabled;

        //LocalSave.saveSettingsBool("music", bEnabled);
    };

    this.mute = function (bTrue) {

        if (this.m_bMusicEnabled == true) {

            if (bTrue) {
                cc.audioEngine.stopMusic();
            }
            else {
                if (this.m_strMusicLast) {
                    cc.audioEngine.playMusic(this.m_strMusicLast, true);
                }
            }
        }

        this.m_bMute = bTrue;
    };

    this.isMute = function () {
        return this.m_bMute;
    };

};

Sound.getInstance = function () {

    var singletonClass = new Sound();
    return singletonClass;

};
