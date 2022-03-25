
function posFromCursor(e) {
    var hitbox = document.querySelector("#leftwrap").getBoundingClientRect();
    var truex = e.clientX - hitbox.x;
    var truey = e.clientY - hitbox.y;
    var scale = hitbox.width / docWidth;
    var pointX = truex / scale;
    var pointY = truey / scale;
    return [Math.round(pointX), Math.round(pointY)];
}

var centerpoint = document.createElement("div");
centerpoint.className = "controlpoint";
document.querySelector("#leftwrap").appendChild(centerpoint);
centerpoint.style.left = `${100 * parseFloat(document.querySelector("#lightx").value) / docWidth}%`;
centerpoint.style.top = `${100 * parseFloat(document.querySelector("#lighty").value) / docHeight}%`;

var topoint = document.createElement("div");
topoint.className = "controlpoint";
document.querySelector("#leftwrap").appendChild(topoint);
topoint.style.left = `${100 * parseFloat(document.querySelector("#toX").value) / docWidth}%`;
topoint.style.top = `${100 * parseFloat(document.querySelector("#toY").value) / docHeight}%`;

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
        var pos = posFromCursor(e);
        document.querySelector("#lightx").value = pos[0];
        document.querySelector("#lighty").value = pos[1];
        drawFromInputs();
        e.preventDefault();
    };
    document.body.addEventListener("mousemove", listener);
    this.addEventListener("mouseup", function() {
        document.body.removeEventListener("mousemove", listener);
    })
});
topoint.addEventListener("mousedown", function() {
    var listener = function(e) {
        dragFunc(e, topoint);
        var pos = posFromCursor(e);
        document.querySelector("#toX").value = pos[0];
        document.querySelector("#toY").value = pos[1];
        drawFromInputs();
        e.preventDefault();
    };
    document.body.addEventListener("mousemove", listener);
    this.addEventListener("mouseup", function() {
        document.body.removeEventListener("mousemove", listener);
    })
});
document.querySelector("#lightx").addEventListener("change", function() {
    centerpoint.style.left = `${100 * parseFloat(this.value) / docWidth}%`;
});
document.querySelector("#lighty").addEventListener("change", function() {
    centerpoint.style.top = `${100 * parseFloat(this.value) / docHeight}%`;
});
document.querySelector("#toX").addEventListener("change", function() {
    topoint.style.left = `${100 * parseFloat(this.value) / docWidth}%`;
});
document.querySelector("#toY").addEventListener("change", function() {
    topoint.style.top = `${100 * parseFloat(this.value) / docHeight}%`;
});

fetch("presetlibrary.json").then(x => x.json()).then(function(data) {
    console.log(data);
    var gallery = document.querySelector("#presetlib");
    gallery.style.textAlign = "center";
    for (var presetName in data) {
        var img = new Image(90, 90);
        gallery.appendChild(img);
        img.src = "images/previews/" + presetName + ".jpg";
        img.style.padding = "5px";
        img.style.verticalAlign = "bottom";
        img.setAttribute("draggable", "false");
        img.style.backgroundColor = "#111111";
        img.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#333333";
        });
        img.addEventListener("mouseout", function() {
            this.style.backgroundColor = "#111111";
        });
        img.dataset.corres = JSON.stringify(data[presetName]);
        img.addEventListener("click", function() {
            loadPreset(this.dataset.corres, true);
        });
    }
});