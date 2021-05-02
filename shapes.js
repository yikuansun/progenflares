function regpoly(x, y, s, r, theta) {
    // center x, center y, sides, radius, rotation
    var points = [];
    var myvector = [r, theta];
    for (var i = 0; i < s; i++) {
        points.push([x + Math.cos(myvector[1]) * myvector[0], y + Math.sin(myvector[1]) * myvector[0]]);
        myvector[1] += 2 * Math.PI / s;
    }
    /*var outstring = "";
    for (var point of points) {
        outstring += point[0].toString() + "," + point[1].toString() + " ";
    }
    var element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    element.setAttribute("points", outstring);
    return element;*/
    return points;
}

function star(x, y, s, r1, r2, theta) {
    // center x, center y, sides, inner radius, outer radius, rotation
    var points = [];
    var myvector = [r2, theta];
    for (var i = 0; i < s; i++) {
        myvector[0] = r2;
        points.push([x + Math.cos(myvector[1]) * myvector[0], y + Math.sin(myvector[1]) * myvector[0]]);
        myvector[1] += 2 * Math.PI / (s * 2);
        myvector[0] = r1;
        points.push([x + Math.cos(myvector[1]) * myvector[0], y + Math.sin(myvector[1]) * myvector[0]]);
        myvector[1] += 2 * Math.PI / (s * 2);
    }
    /*var outstring = "";
    for (var point of points) {
        outstring += point[0].toString() + "," + point[1].toString() + " ";
    }
    var element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    element.setAttribute("points", outstring);
    return element;*/
    return points;
}