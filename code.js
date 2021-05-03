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
    var ring = document.createElementNS(namespace, "circle");
    ring.setAttribute("r", flareconfig.ring.radius);
    ring.setAttribute("filter", "url(#ringBlur)");
    document.querySelector("#ringBlur feGaussianBlur").setAttribute("stdDeviation", flareconfig.ring.softness);
    ring.setAttribute("cx", flareconfig.lightx);
    ring.setAttribute("cy", flareconfig.lighty);
    ring.style.fill = "none";
    ring.setAttribute("stroke", "white");
    view.appendChild(ring);
    var streak = document.createElementNS(namespace, "polygon");
    streak.setAttribute("points", `${flareconfig.lightx},${flareconfig.lighty - flareconfig.streak.height / 2} ${flareconfig.lightx + flareconfig.streak.length / 2},${flareconfig.lighty} ${flareconfig.lightx},${flareconfig.lighty + flareconfig.streak.height / 2} ${flareconfig.lightx - flareconfig.streak.length / 2},${flareconfig.lighty}`);
    streak.style.fill = "white";
    streak.setAttribute("filter", "url(#streakBlur)");
    document.querySelector("#streakBlur feGaussianBlur").setAttribute("stdDeviation", flareconfig.streak.blur);
    view.appendChild(streak);
}

function test_svg_download() {
    var a = document.createElement("a");
    var s = (new XMLSerializer()).serializeToString(svg);
    var encodedData = window.btoa(s);
    a.href = "data:image/svg+xml;base64," + encodedData;
    a.download = "yessir";
    a.click();
}

async function rasterize(svgElem) {
    var svgData = new XMLSerializer().serializeToString(svgElem);
    var imgElem = document.createElement("img");
    imgElem.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    const myPromise = new Promise((resolve, reject) => {
        imgElem.onload = function() {
            var svgClientRect = {
                width: parseFloat(svgElem.getAttribute("viewBox").split(" ")[2]),
                height: parseFloat(svgElem.getAttribute("viewBox").split(" ")[3])
            };
            var canvas = document.createElement("canvas");
            canvas.width = svgClientRect.width;
            canvas.height = svgClientRect.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imgElem, 0, 0, svgClientRect.width, svgClientRect.height);
            resolve(canvas.toDataURL("image/png"));
        }
    });
    return await myPromise;
}

function downloadFlare() {
    rasterize(svg).then((x) => {
        var a = document.createElement("a");
        a.href = x;
        a.download = "joe";
        a.click();
    });
}

drawFlare(view, {
    lightx: docWidth * 0.19,
    lighty: docHeight * 0.19,
    toX: docWidth * 0.5,
    toY: docHeight * 0.5,
    glow: {
        radius: 400,
        opacity: 0.1
    },
    starburst: {
        sides: 18,
        innerRadius: 20,
        outerRadius: 200,
        rotation: 0,
        softness: 100
    },
    glint: {
        sides: 50,
        innerRadius: 10,
        outerRadius: 300,
        rotation: 0,
        softness: 50
    },
    ring: {
        radius: 180,
        softness: 10
    },
    streak: {
        length: 1000,
        height: 15,
        blur: 6.9
    },
    multiIris: {
        sides: 6,
        scale: 1,
        rotation: 0,
        opacity: 1
    },
});