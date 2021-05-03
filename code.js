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
    var starburst = star(flareconfig.lightx, flareconfig.lighty, flareconfig.starburst.sides, flareconfig.starburst.innerRadius, flareconfig.starburst.outerRadius, 0);
    starburst.style.fill = "white";
    view.appendChild(starburst);
    var glint = star(flareconfig.lightx, flareconfig.lighty, flareconfig.glint.sides, flareconfig.glint.innerRadius, flareconfig.glint.outerRadius, 0);
    glint.style.fill = "white";
    view.appendChild(glint);
}

drawFlare(view, {
    lightx: 100,
    lighty: 100,
    toX: 400,
    toY: 225,
    starburst: {
        sides: 18,
        innerRadius: 8,
        outerRadius: 80,
        rotation: 0
    },
    glint: {
        sides: 69,
        innerRadius: 5,
        outerRadius: 69,
        rotation: 0
    }
});