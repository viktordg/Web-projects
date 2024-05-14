
$("h1").addClass("big-title margin-50 ");
console.log($("h1").hasClass("big-title"));

$("h1").attr("style", "text-align:right");

$("button").on("click", function() {
    
    $("h1").removeAttr("style", "text-align:right");
    $("h1").css("color", "purple").animate({opacity: 0.5});

})



