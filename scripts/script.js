let DOMmanipulator = (function() {
    // start form manipulation
    let $form = $("form");
    let $submit = $("#submit");
    let $startPage = $(".start");
    $("#vs-player").click(function() {
        if ($form[0].style.display == "none") {
            $form.slideDown(300);
        } else {
            $form.slideUp(300);
        }
    });
    
    $submit.click(function(e) {
        e.preventDefault();
        setTimeout(function() {
            $startPage.slideUp(1000);
        },
            500
        );
    })

})()

let pubSub = (function() {

})()