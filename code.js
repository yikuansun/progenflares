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
    var starburst = star(flareconfig.lightx, flareconfig.lighty, flareconfig.star1.sides, flareconfig.star1.innerRadius, flareconfig.star1.outerRadius, 0);
    view.appendChild(starburst);
}

drawFlare(view, {
    lightx: 100,
    lighty: 100,
    toX: 400,
    toY: 225,
    star1: {
        sides: 12,
        innerRadius: 8,
        outerRadius: 69,
        rotation: 0
    }
});