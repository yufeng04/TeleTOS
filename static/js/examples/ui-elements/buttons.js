$(function () {

    "use strict";

    //LOADING BUTTONS EXAMPLE
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    $('.btn-loading').on('click',function(e){
        var button = $(this);

        btnStartSpinning(button);

        setTimeout(function () {
            btnStopSpinning(button);
        }, 2000);
    });
});
