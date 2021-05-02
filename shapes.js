function regpoly(x, y, s, r) {
    // center x, center y, sides, radius
    var points = [];
    var myvector = [r, 0];
    for (var i = 0; i < s; i++) {
        points.push([x + Math.cos(myvector[1]) * myvector[0], y + Math.sin(myvector[1]) * myvector[0]]);
        myvector[1] += 2 * Math.PI / s;
    }
    var outstring = "";
    for (var point of points) {
        outstring += point[0].toString() + "," + point[1].toString() + " ";
    }
    var element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    element.setAttribute("points", outstring);
    return element;
}