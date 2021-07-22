const keypressed = {};




onkeydown = function(e) {
    keypressed[e.keyCode] = true;
}

onkeyup = function(e) {
    keypressed[e.keyCode] = false;
}

function isKeyPressed(keyCode) {
    return keypressed[keyCode] ? true : false;
}


