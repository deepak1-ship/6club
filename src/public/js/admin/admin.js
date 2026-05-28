$(window).on('load', function () {
    setTimeout(() => {
        $('#preloader').fadeOut(0);
    }, 100);
});

// Fallback: force hide preloader after 3s if window.load is blocked by CDN resources
setTimeout(function () {
    if ($('#preloader').is(':visible')) {
        $('#preloader').fadeOut(300);
    }
}, 3000);
$(document).ready(function () {
    $(`a[href="${window.location.pathname}"]`).addClass('active');
    $(`a[href="${window.location.pathname}"]`).css('pointerEvents', 'none');
});

$('.back-to-tops').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 800);
    return false;

});

function formatMoney(money) {
    return String(money).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

let checkID = $('html').attr('data-change');
let i = 0;
if(checkID == 1) i = 30; // 30 seconds
if(checkID == 2) i = 1;  // 1 minute
if(checkID == 3) i = 3;  // 3 minutes
if(checkID == 4) i = 5;  // 5 minutes

function cownDownTimer() {
    var countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();
    setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        var minute = Math.ceil(minutes % i);
        var seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
        var seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);

        if (checkID == 1) { // 30 seconds game logic
            minute = 0;
            if (seconds1 > 2) seconds1 = seconds1 - 3;
        } else {
             // For minute-based games
             // If i is 1, minute (minutes % 1) is always 0, which is incorrect for display if we want to show 0.
             // Actually, the original code: Math.ceil(minutes % i)
             // For 1 min game (i=1): minutes % 1 is 0. Math.ceil(0) is 0. 
             // Ideally for 1 min game we don't show minutes, or show 0.
             // The original code was i=1 for 1 min game. 
        }

        if(checkID != 1 && checkID != 2) { // Show minutes for > 1 min games
             $(".time .time-sub:eq(1)").text(minute);
        } else {
             $(".time .time-sub:eq(1)").text(0);
        }

        $(".time .time-sub:eq(2)").text(seconds1);
        $(".time .time-sub:eq(3)").text(seconds2);
    }, 0);
}

cownDownTimer();