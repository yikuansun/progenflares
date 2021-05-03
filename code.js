var searchInfo = new URLSearchParams(location.search);
var docWidth = parseFloat(searchInfo.get("docWidth"));
var docHeight = parseFloat(searchInfo.get("docHeight"));

var svg = document.querySelector("svg");
var namespace = "http://www.w3.org/2000/svg";
svg.setAttribute("viewBox", `0 0 ${docWidth} ${docHeight}`);

var bgRect = document.createElementNS(namespace, "rect");
bgRect.setAttribute("x", 0); bgRect.setAttribute("y", 0);
bgRect.setAttribute("width", docWidth); bgRect.setAttribute("height", docHeight);
bgRect.style.fill = "black";
svg.appendChild(bgRect);

var view = document.createElementNS(namespace, "g");
svg.appendChild(view);

function drawFlare(view, flareconfig) {
    view.innerHTML = "";
    var glow = document.createElementNS(namespace, "circle");
    glow.style.fill = "url('#glowGradient')";
    glow.setAttribute("r", flareconfig.glow.radius);
    glow.setAttribute("cx", flareconfig.lightx);
    glow.setAttribute("cy", flareconfig.lighty);
    glow.setAttribute("fill-opacity", flareconfig.glow.opacity);
    view.appendChild(glow);
    var starburst = document.createElementNS(namespace, "g");
    view.appendChild(starburst);
    for (var i = 0; i < flareconfig.starburst.softness; i++) {
        var starburst_layer = star(flareconfig.lightx, flareconfig.lighty, flareconfig.starburst.sides, flareconfig.starburst.innerRadius, flareconfig.starburst.outerRadius, flareconfig.starburst.rotation + i / 500);
        starburst_layer.style.fill = "white";
        starburst_layer.setAttribute("fill-opacity", 1 / flareconfig.starburst.softness);
        starburst.appendChild(starburst_layer);
    }
    var glint = document.createElementNS(namespace, "g");
    view.appendChild(glint);
    for (var i = 0; i < flareconfig.glint.softness; i++) {
        var glint_layer = star(flareconfig.lightx, flareconfig.lighty, flareconfig.glint.sides, flareconfig.glint.innerRadius, flareconfig.glint.outerRadius, flareconfig.glint.rotation + i / 500);
        glint_layer.style.fill = "white";
        glint_layer.setAttribute("fill-opacity", 1 / flareconfig.glint.softness);
        glint.appendChild(glint_layer);
    }
    var ring = document.createElementNS(namespace, "g");
    view.appendChild(ring);
    for (var i = 0; i < flareconfig.ring.spread; i++) {
        var ring_layer = document.createElementNS(namespace, "circle");
        ring_layer.setAttribute("r", flareconfig.ring.radius - flareconfig.ring.spread + i / 2);
        ring_layer.setAttribute("opacity", flareconfig.ring.opacity / flareconfig.ring.spread);
        ring_layer.setAttribute("cx", flareconfig.lightx);
        ring_layer.setAttribute("cy", flareconfig.lighty);
        ring_layer.style.fill = "none";
        ring_layer.setAttribute("stroke", "white");
        ring.appendChild(ring_layer);
    }
}

drawFlare(view, {
    lightx: 100,
    lighty: 100,
    toX: 400,
    toY: 225,
    glow: {
        radius: 200,
        opacity: 0.1
    },
    starburst: {
        sides: 18,
        innerRadius: 10,
        outerRadius: 100,
        rotation: 0,
        softness: 100
    },
    glint: {
        sides: 50,
        innerRadius: 5,
        outerRadius: 150,
        rotation: 0,
        softness: 50
    },
    ring: {
        radius: 90,
        spread: 30,
        opacity: 0.5,
    },
    multiIris: {
        sides: 6,
        scale: 1,
        rotation: 0,
        opacity: 1
    },
});