
$(document).ready(function() {
    $("#createButton").click(function() {
        $(".grid-x:last-child").append('<div class="cell large-4"><div class="projectTile"><div class="projectImg"></div><div class="projectInfo"><h2>Project Title</h2></div></div></div>')
    });
    $(".projectTile").click(function() {
        window.location.href = "newProject.html";
    });
});