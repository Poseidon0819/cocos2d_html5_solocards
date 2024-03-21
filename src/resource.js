var CARD_VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];
var CARD_SUITS = ["clubs", "diamonds", "hearts", "spades"];

var res = {

    fontMontserrat: {
        type: 'font',
        name: 'Montserrat-Bold',
        srcs: ['res/fonts/montserrat_bold.ttf']
    },

    fontMontserratFNT: "res/fonts/montserrat_bold.fnt",
    fontMontserratPNG: "res/fonts/montserrat_bold.png",

    database: 'res/database.json',

    placed_sound: "res/sound/placed_sound.mp3",
    button: "res/sound/button.mp3",

    background: "res/graph/background.jpg",
    play: "res/graph/play.png",
    how_to_play: "res/graph/how_to_play.png",
    language: "res/graph/language.png",
    exit: "res/graph/exit.png",
    how_bkg: "res/graph/how_bkg.png",
    back_purple: "res/graph/back_purple.png",
    lang_title: "res/graph/lang_title.png",
    lang_bar: "res/graph/lang_bar.png",
    lang_button: "res/graph/lang_button.png",
    pad_btn: "res/graph/pad_btn.png",
    card_back: "res/graph/card_back.png",
    fstacka: "res/graph/fstacka.png",
    wstack: "res/graph/wstack.png",
    game_over: "res/graph/game_over.png",
    yes: "res/graph/yes.png",
    no: "res/graph/no.png",
    box: "res/graph/box.png"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

for (var i = 0; i < CARD_VALUES.length; i++) {
    for (var j = 0; j < CARD_SUITS.length; j++) {
        g_resources.push("res/graph/cards/" + CARD_VALUES[i] + "_" + CARD_SUITS[j] + ".png");
    }
}

var getFontNamePlatform = function (resource) {
    if (cc.sys.isNative) {
        return resource.srcs[0];
    } else {
        return resource.name;
    }
};
