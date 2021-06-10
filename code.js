var searchInfo = new URLSearchParams(location.search);
var docWidth = parseFloat(searchInfo.get("docWidth"));
var docHeight = parseFloat(searchInfo.get("docHeight"));
var portal = searchInfo.get("portal");
var preset = searchInfo.get("preset");

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
    var shift = (flareconfig.toX - flareconfig.lightx) * flareconfig.streak.shift;
    streak.setAttribute("points", `${flareconfig.lightx},${flareconfig.lighty - flareconfig.streak.height / 2} ${flareconfig.lightx + flareconfig.streak.length / 2 + shift},${flareconfig.lighty} ${flareconfig.lightx},${flareconfig.lighty + flareconfig.streak.height / 2} ${flareconfig.lightx - flareconfig.streak.length / 2 + shift},${flareconfig.lighty}`);
    streak.style.fill = "white";
    streak.setAttribute("filter", "url(#streakBlur)");
    document.querySelector("#streakBlur feGaussianBlur").setAttribute("stdDeviation", flareconfig.streak.blur);
    view.appendChild(streak);
    var colorLayer1 = document.createElementNS(namespace, "rect");
    colorLayer1.setAttribute("x", 0); colorLayer1.setAttribute("y", 0);
    colorLayer1.setAttribute("width", docWidth); colorLayer1.setAttribute("height", docHeight);
    colorLayer1.style.fill = flareconfig.primaryColor;
    colorLayer1.style.mixBlendMode = "overlay";
    view.appendChild(colorLayer1);
    var multiIris = document.createElementNS(namespace, "g");
    view.appendChild(multiIris);
    var rng = new Math.seedrandom(flareconfig.multiIris.seed);
    var currentx = 0;
    var currenty = 0;
    for (var i = -25; i < 50; i++) {
        currentx = flareconfig.lightx + i * (flareconfig.toX - flareconfig.lightx) / 20;
        currenty = flareconfig.lighty + i * (flareconfig.toY - flareconfig.lighty) / 20;
        if (rng() < 0.35) {
            var sclFac = rng() * Math.abs(i) / 25;
            var iris = regpoly(currentx, currenty, flareconfig.multiIris.sides, flareconfig.multiIris.radius * sclFac, flareconfig.multiIris.rotation);
            iris.setAttribute("fill-opacity", flareconfig.multiIris.opacity / sclFac);
            iris.style.fill = flareconfig.multiIris.color;
            iris.style.mixBlendMode = "screen";
            iris.setAttribute("filter", "url(#MIBlur)");
            //iris.style.stroke = "white";
            document.querySelector("#MIBlur feGaussianBlur").setAttribute("stdDeviation", flareconfig.multiIris.blur);
            multiIris.appendChild(iris);
        }
    }
    var orbs = document.createElementNS(namespace, "g");
    view.appendChild(orbs);
    var rng = new Math.seedrandom(flareconfig.orbs.seed);
    var vector = [0, 0];
    for (var angle = vector[1]; angle < Math.PI * 2; angle += 2 * Math.PI / flareconfig.orbs.count) {
        vector[1] = angle;
        vector[0] = rng() * flareconfig.orbs.spread;
        var orb = document.createElementNS(namespace, "circle");
        orb.setAttribute("cx", flareconfig.lightx + vector[0] * Math.cos(vector[1]));
        orb.setAttribute("cy", flareconfig.lighty + vector[0] * Math.sin(vector[1]));
        var sclFac = rng();
        orb.setAttribute("r", sclFac * flareconfig.orbs.scale);
        orb.style.fill = flareconfig.orbs.color;
        orb.setAttribute("fill-opacity", flareconfig.orbs.opacity / sclFac);
        orb.style.mixBlendMode = "screen";
        document.querySelector("#orbsBlur feGaussianBlur").setAttribute("stdDeviation", flareconfig.orbs.blur);
        orb.setAttribute("filter", "url(#orbsBlur)");
        orbs.appendChild(orb);
    }
}

function test_svg_download() {
    var a = document.createElement("a");
    var s = (new XMLSerializer()).serializeToString(svg);
    var encodedData = window.btoa(s);
    a.href = "data:image/svg+xml;base64," + encodedData;
    a.download = "yessir";
    a.click();
}

async function rasterize(svgElem, scale=1) {
    var svgData = new XMLSerializer().serializeToString(svgElem);
    var imgElem = document.createElement("img");
    imgElem.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    const myPromise = new Promise((resolve, reject) => {
        imgElem.onload = function() {
            var svgClientRect = {
                width: parseFloat(svgElem.getAttribute("viewBox").split(" ")[2]) * scale,
                height: parseFloat(svgElem.getAttribute("viewBox").split(" ")[3]) * scale
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

document.querySelector("#lightx").value = docWidth * 0.19;
document.querySelector("#lighty").value = docHeight * 0.19;
document.querySelector("#toX").value = docWidth * 0.5;
document.querySelector("#toY").value = docHeight * 0.5;

function drawFromInputs() {
    var inputObject = {glow:{},starburst:{},glint:{},ring:{},streak:{},multiIris:{},orbs:{}};
    for (var input of document.querySelectorAll("#controlpanel input")) {
        if (!(input.getAttribute("id").includes("_"))) {
            if (input.getAttribute("type") == "number") inputObject[input.getAttribute("id")] = parseFloat(input.value);
            else inputObject[input.getAttribute("id")] = input.value;
        }
        else {
            var category = input.getAttribute("id").split("_")[0];
            var control = input.getAttribute("id").split("_")[1];
            var value = input.value;
            var type = input.getAttribute("type");
            if (type == "number") inputObject[category][control] = parseFloat(value);
            else inputObject[category][control] = value;
        }
    }
    drawFlare(view, inputObject);
    return inputObject;
}

for (var input of document.querySelectorAll("#controlpanel input")) {
    input.addEventListener("input", function() {
        if (this.getAttribute("type") == "number" && parseFloat(this.value) < 0) this.value = 0;
        drawFromInputs();
    });
}

drawFromInputs();

function Randomizer(inputElem) {
    inputElem.value = Math.random().toFixed(10).split(".")[1];
    for (var evtType of ["input", "change"]) {
        inputElem.dispatchEvent(new Event(evtType, {
            bubbles: true,
            cancelable: true,
        }));
    }
}

document.querySelector("#randomizeMI").addEventListener("click", function() { Randomizer(document.querySelector("#multiIris_seed")); });
document.querySelector("#randomizedirt").addEventListener("click", function() { Randomizer(document.querySelector("#orbs_seed")); });

var tabs = document.querySelectorAll("#tabbar td");
tabs[0].style.backgroundColor = "white";
var panelsections = document.querySelectorAll("#controlpanel div");
panelsections[0].style.display = "block";

for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", new Function(`
        for (var j = 0; j < panelsections.length; j++) {
            if (j == ${i}) {
                panelsections[j].style.display = "block";
                tabs[j].style.backgroundColor = "white";
            }
            else {
                panelsections[j].style.display = "none";
                tabs[j].style.backgroundColor = "";
            }
        }
    `));
}

document.querySelector("#exportpanel button").addEventListener("click", function() {
    switch (document.querySelector("#exportpanel select").value) {
        case "SVG":
            test_svg_download();
            break;
        case "PNG":
            downloadFlare();
            break;
        case "JSON":
            var saveFile = JSON.stringify(drawFromInputs());
            var a = document.createElement("a");
            a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(saveFile);
            a.download = "flare_data.json";
            a.click();
            break;
    }
});

if (portal == "photopea") {
    document.querySelector("#exportpanel").innerHTML = "<button>Update live preview</button> <button>Finish</button>";

    // advanced preview
    var OGstate = {};
    var addLayerAndChangeBlendmode = async function(imageURI, setScale=true) {
        var layers_count = (await Photopea.runScript(window.parent, `
            function cnt(d) { var r=0; if (d.layers) { for (var i=0; i<d.layers.length; i++)  r+=cnt(d.layers[i])+1; } return r; } app.echoToOE(cnt(app.activeDocument));
        `))[0]; // Script thanks to @hxim
        var layerCheckInterval = async function () {
            var new_layers_count = (await Photopea.runScript(window.parent, `
                function cnt(d) { var r=0; if (d.layers) { for (var i=0; i<d.layers.length; i++)  r+=cnt(d.layers[i])+1; } return r; } app.echoToOE(cnt(app.activeDocument));
            `))[0]; // Script thanks to @hxim
            if (new_layers_count == layers_count + 1) {
                await Photopea.runScript(window.parent, "app.activeDocument.activeLayer.blendMode = 'lddg';");
                if (setScale) await Photopea.runScript(window.parent, `app.activeDocument.activeLayer.resize(${100 / previewScale},${100 / previewScale},AnchorPosition.TOPLEFT);`);
                return;
            }
            else setTimeout(layerCheckInterval, 50);
        };
        layerCheckInterval();
        await Photopea.runScript(window.parent, `app.open("${imageURI}", null, true);`);
    };
    var previewScale = (docWidth > 690)?(690 / docWidth):1;
    rasterize(svg, previewScale).then(async function(imageURI) {
        OGstate = (await Photopea.runScript(window.parent, "app.echoToOE(app.activeDocument.activeHistoryState);"))[0];
        addLayerAndChangeBlendmode(imageURI);
    });
    document.querySelector("#exportpanel button").onclick = function() {
        rasterize(svg, previewScale).then(async function(imageURI) {
            await Photopea.runScript(window.parent, `app.activeDocument.activeHistoryState = ${JSON.stringify(OGstate)};`);
            addLayerAndChangeBlendmode(imageURI);
        });
    };
    document.querySelectorAll("#exportpanel button")[1].onclick = function() {
        rasterize(svg, 1).then(async function(imageURI) {
            await Photopea.runScript(window.parent, `app.activeDocument.activeHistoryState = ${JSON.stringify(OGstate)};`);
            addLayerAndChangeBlendmode(imageURI, false);
        });
    };
    for (var input of document.querySelectorAll("#controlpanel input")) {
        input.addEventListener("change", function() {
            document.querySelector("#exportpanel button").click();
        });
        document.querySelector("#exportpanel button").style.display = "none";
    }
    svg.addEventListener("mouseup", function() {
        document.querySelector("#exportpanel button").click();
    });
}

if (preset) {
    var preset_data = JSON.parse(preset);
    for (var component in preset_data) {
        if (typeof(preset_data[component]) == "string") {
            document.querySelector(`#${component}`).value = preset_data[component];
        }
        else {
            for (var jcomponent in preset_data[component]) {
                document.querySelector(`#${component}_${jcomponent}`).value = preset_data[component][jcomponent];
            }
        }
    }
    drawFromInputs();
    if (portal == "api") {
        rasterize(svg).then(function(imageURI) {
            window.parent.postMessage(imageURI);
        });
    }
}

function posFromCursor(e) {
    var hitbox = svg.getBoundingClientRect();
    var truex = e.clientX - hitbox.x;
    var truey = e.clientY - hitbox.y;
    var scale = hitbox.width / docWidth;
    var pointX = truex / scale;
    var pointY = truey / scale;
    return [pointX, pointY];
}

var centerpoint = document.createElement("div");
centerpoint.className = "controlpoint";
document.querySelector("#leftwrap").appendChild(centerpoint);
centerpoint.style.left = "19%";
centerpoint.style.top = "19%";

function dragFunc(e, target) {
    var pos = posFromCursor(e);
    pos[0] = 100 * pos[0] / docWidth;
    pos[1] = 100 * pos[1] / docHeight;
    target.style.left = `${pos[0]}%`;
    target.style.top = `${pos[1]}%`;
}
centerpoint.addEventListener("mousedown", function() {
    var listener = function(e) {
        dragFunc(e, centerpoint);
    };
    document.body.addEventListener("mousemove", listener);
    this.addEventListener("mouseup", function() {
        document.body.removeEventListener("mousemove", listener);
    })
});