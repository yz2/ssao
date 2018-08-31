var CEAnimate = false;
var SCEAnimate = false;
var HBAnimate = false;

function viewAnimate(canvas) {
    if (canvas == "CECanvas") {
        return CEAnimate;
    } else if (canvas == "SCECanvas") {
        return SCEAnimate;
    } else if (canvas == "HBAOCanvas") {
        return HBAnimate;
    }
}

function switchAnimate(canvas) {
    if (canvas == "CECanvas") {
        CEAnimate = CEAnimate ? false : true;
    } else if (canvas == "SCECanvas") {
        SCEAnimate = SCEAnimate ? false : true;
    } else if (canvas == "HBAOCanvas") {
        HBAnimate = HBAnimate ? false : true;
    }
    return;
}

