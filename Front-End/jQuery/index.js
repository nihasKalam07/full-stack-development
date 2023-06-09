$(document).ready(function () {
    $("h1").css("color", "red");
    console.log($("h1").css("font-size"));

});


$("button").on("click", function(event){
    //show - hide
    $("h1").hide(); //hide h1
    $("h1").show(); //show h1
    $("h1").toggle();//toggle between hide and show

    //fade
    $("h1").fadeOut(); //fade out 
    $("h1").fadeIn(); //fade in
    $("h1").fadeToggle(); //toggle between fade-in and fade-out 

    //slide
    $("h1").slideUp(); //slide up
    $("h1").slideDown(); //slide down
    $("h1").slideToggle();//toggle between slide-up and slide-down



    $("h1").slideUp().slideDown().animate({opacity: 0.5});
});




