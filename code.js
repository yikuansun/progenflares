var searchInfo = new URLSearchParams(location.search);
var docWidth = parseFloat(searchInfo.get("docWidth"));
var docHeight = parseFloat(searchInfo.get("docHeight"));
var portal = searchInfo.get("portal");
var preset = searchInfo.get("preset");

if (isNaN(docWidth) || isNaN(docHeight)) {
    if (portal != "photopea") location.replace("index.html");
    else location.replace("photopea_plugin.html");
}

var svg = document.querySelector("svg");
var namespace = "http://www.w3.org/2000/svg";
svg.setAttribute("width", docWidth);
svg.setAttribute("height", docHeight);

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
            //iris.style.stroke = flareconfig.multiIris.color;
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
    a.download = "yessir.svg";
    a.click();
}

async function rasterize(svgElem, quality=1, format="png") {
    var svgData = new XMLSerializer().serializeToString(svgElem);
    var imgElem = document.createElement("img");
    imgElem.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    const myPromise = new Promise((resolve, reject) => {
        imgElem.onload = function() {
            var svgClientRect = {
                width: parseFloat(svgElem.getAttribute("width")),
                height: parseFloat(svgElem.getAttribute("height"))
            };
            var canvas = document.createElement("canvas");
            canvas.width = svgClientRect.width;
            canvas.height = svgClientRect.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imgElem, 0, 0, svgClientRect.width, svgClientRect.height);
            resolve(canvas.toDataURL("image/" + format, quality));
        }
    });
    return await myPromise;
}

function downloadFlare(format="png") {
    rasterize(svg, 1, format).then((x) => {
        var a = document.createElement("a");
        a.href = x;
        a.download = "joe." + format;
        a.click();
    });
}

document.querySelector("#lightx").max = docWidth;
document.querySelector("#lighty").max = docHeight;
document.querySelector("#lightx").value = Math.round(docWidth * 0.19);
document.querySelector("#lighty").value = Math.round(docHeight * 0.19);
document.querySelector("#toX").max = docWidth;
document.querySelector("#toY").max = docHeight;
document.querySelector("#toX").value = Math.round(docWidth * 0.5);
document.querySelector("#toY").value = Math.round(docHeight * 0.5);

function drawFromInputs() {
    var inputObject = {glow:{},starburst:{},glint:{},ring:{},streak:{},multiIris:{},orbs:{}};
    for (var input of document.querySelectorAll("#controlpanel input, #controlpanel ADVANCED-SLIDER")) {
        if (!(input.getAttribute("id").includes("_"))) {
            if (input.getAttribute("type") == "number" || input.tagName == "ADVANCED-SLIDER") inputObject[input.getAttribute("id")] = parseFloat(input.value);
            else inputObject[input.getAttribute("id")] = input.value;
        }
        else {
            var category = input.getAttribute("id").split("_")[0];
            var control = input.getAttribute("id").split("_")[1];
            var value = input.value;
            var type = input.getAttribute("type");
            if (type == "number" || input.tagName == "ADVANCED-SLIDER") inputObject[category][control] = parseFloat(value);
            else inputObject[category][control] = value;
        }
    }
    drawFlare(view, inputObject);

    var svgData = new XMLSerializer().serializeToString(svg);
    document.querySelector("#imgpreview").src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    
    return inputObject;
}

for (var input of document.querySelectorAll("#controlpanel input, #controlpanel ADVANCED-SLIDER")) {
    input.addEventListener("input", function() {
        if (this.tagName == "ADVANCED-SLIDER" && parseFloat(this.value) < 0) this.value = 0;
        drawFromInputs();
    });

    if (input.tagName == "ADVANCED-SLIDER") input.numberElement.style.width = "69px";
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
var panelsections = document.querySelectorAll("#controlpanel div:not(#emptypanelsection)");
panelsections[0].style.display = "block";

for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", new Function(`
        for (var j = 0; j < panelsections.length; j++) {
            if (j == ${i}) {
                if (panelsections[j].style.display != "block") {
                    panelsections[j].style.display = "block";
                    tabs[j].style.backgroundColor = "white";

                    document.querySelector("#emptypanelsection").style.display = "none";
                }
                else {
                    panelsections[j].style.display = "none";
                    tabs[j].style.backgroundColor = "";

                    document.querySelector("#emptypanelsection").style.display = "block";
                }
            }
            else {
                panelsections[j].style.display = "none";
                tabs[j].style.backgroundColor = "";
            }
        }
    `));
}

function savePreset() {
    var saveFile = JSON.stringify(drawFromInputs());
    var a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(saveFile);
    a.download = "flare_data.json";
    a.click();
}

document.querySelector("#exportpanel button").addEventListener("click", function() {
    switch (document.querySelector("#exportpanel select").value) {
        case "SVG":
            test_svg_download();
            break;
        case "PNG":
            downloadFlare();
            break;
        case "JPG":
            downloadFlare("jpeg");
            break;
        case "JSON":
            savePreset();
            break;
    }
});
document.querySelectorAll("#exportpanel button")[1].addEventListener("click", function() {
    Cookies.set("defaultinputs", JSON.stringify(drawFromInputs()), { expires: 69696969 });
});
document.querySelectorAll("#exportpanel button")[2].addEventListener("click", savePreset);

function loadPreset(preset="{}", excludePos=false) {
    var preset_data = JSON.parse(preset);
    for (var component in preset_data) {
        if (typeof(preset_data[component]) != "object") {
            if ((component == "lightx" || component == "toX" || component == "lighty" || component == "toY") && excludePos) continue;
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
if (preset) loadPreset(preset);
else if (Cookies.get("defaultinputs")) {
    var preset_data = JSON.parse(Cookies.get("defaultinputs"));
    for (var component in preset_data) {
        if (typeof(preset_data[component]) != "object") {
            document.querySelector(`#${component}`).value = preset_data[component];
        }
        else {
            for (var jcomponent in preset_data[component]) {
                document.querySelector(`#${component}_${jcomponent}`).value = preset_data[component][jcomponent];
            }
        }
    }
    drawFromInputs();
}

if (portal == "photopea") {
    document.querySelector("#exportpanel").innerHTML = `
    <button>Update live preview</button>
    <button>Finish</button>
    <button>Set defaults</button>
    <button>Save preset</button>
    `;

    // advanced preview
    var addLayerAndChangeBlendmode = async function(imageURI) {
        var layers_count = (await Photopea.runScript(window.parent, `
            function cnt(d) { var r=0; if (d.layers) { for (var i=0; i<d.layers.length; i++)  r+=cnt(d.layers[i])+1; } return r; } app.echoToOE(cnt(app.activeDocument));
        `))[0]; // Script thanks to @hxim
        var layerCheckInterval = async function () {
            var new_layers_count = (await Photopea.runScript(window.parent, `
                function cnt(d) { var r=0; if (d.layers) { for (var i=0; i<d.layers.length; i++)  r+=cnt(d.layers[i])+1; } return r; } app.echoToOE(cnt(app.activeDocument));
            `))[0]; // Script thanks to @hxim
            if (new_layers_count == layers_count + 1) {
                await Photopea.runScript(window.parent, "app.activeDocument.activeLayer.blendMode = 'lddg';");
                return;
            }
            else setTimeout(layerCheckInterval, 50);
        };
        layerCheckInterval();
        await Photopea.runScript(window.parent, `app.open("${imageURI}", null, true);`);
    };
    var previewScale = (docWidth > 400)?(400 / docWidth):1;
    rasterize(svg, previewScale, "jpeg").then(async function(imageURI) {
        addLayerAndChangeBlendmode(imageURI);
    });
    document.querySelector("#exportpanel button").onclick = function() {
        rasterize(svg, previewScale, "jpeg").then(async function(imageURI) {
            await Photopea.runScript(window.parent, `app.activeDocument.activeLayer.remove();`);
            addLayerAndChangeBlendmode(imageURI);
        });
    };
    document.querySelectorAll("#exportpanel button")[1].onclick = function() {
        rasterize(svg).then(async function(imageURI) {
            await Photopea.runScript(window.parent, `app.activeDocument.activeLayer.remove();`);
            addLayerAndChangeBlendmode(imageURI, false);
        });
    };
    for (var input of document.querySelectorAll("#controlpanel input, #controlpanel ADVANCED-SLIDER")) {
        input.addEventListener("change", function() {
            document.querySelector("#exportpanel button").click();
        });
        document.querySelector("#exportpanel button").style.display = "none";
    }
    document.querySelector("#leftwrap").addEventListener("mouseup", function() {
        document.querySelector("#exportpanel button").click();
    });

    document.querySelectorAll("#exportpanel button")[2].onclick = function() {
        Cookies.set("defaultinputs", JSON.stringify(drawFromInputs()), { expires: 69696969 });
    };
    document.querySelectorAll("#exportpanel button")[3].onclick = savePreset;
}

// Handle savedata dragged onto document
document.body.addEventListener("drop", function(e) {
    e.stopPropagation();
    e.preventDefault();

    for (var file of e.dataTransfer.files) {
        if (file.type == "application/json") {
            var reader = new FileReader();

            reader.onload = function(e2) {
                var data = e2.target.result;
                loadPreset(data, true);
                if (portal == "photopea") document.querySelector("#exportpanel button").click();
            }

            reader.readAsText(file);
        }
    }
});
document.body.addEventListener("dragover", function(e) { e.preventDefault(); });
