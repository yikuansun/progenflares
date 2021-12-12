var helpbutton = document.createElement("div");
document.body.appendChild(helpbutton);
helpbutton.style.width = "30px";
helpbutton.style.height = "30px";
helpbutton.style.position = "fixed";
helpbutton.style.bottom = "10px";
helpbutton.style.right = "10px";
helpbutton.style.backgroundColor = "red";
helpbutton.style.opacity = "0.69";
helpbutton.addEventListener("mouseover", function(e) { this.style.opacity = "0.85" });
helpbutton.addEventListener("mouseout", function(e) { this.style.opacity = "0.69" });
helpbutton.addEventListener("click", function(e) {
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = "https://github.com/yikuansun/progenflares#readme";
    a.click();
});