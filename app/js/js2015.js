'use strict';

$(document).ready(function () {
    $(document).on('scroll', checkDots);
    $(document).on('scroll', checkNextToActive);
    // $(window).on("scroll", stickyHeader);
    //
    // function stickyHeader() {
    //     if ($(window).scrollTop() >= 100) {
    //         $('.header-wrapper').addClass('addBg-active');
    //     }
    //     else {
    //         $('.header-wrapper').removeClass('addBg-active');
    //     }
    // }


    $('.benefits__infograph, .benefits__package').on('mousemove', parallaxBg);
    clipThru();
    checkDots();

    var $window = $(window);
    var scrollTime = 0.7;
    var scrollDistance = 150;
    $window.on("mousewheel DOMMouseScroll", function (event) {
        event.preventDefault();
        var delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
        var scrollTop = $window.scrollTop();
        var finalScroll = scrollTop - parseInt(delta * scrollDistance);

        TweenMax.to($window, scrollTime, {
            scrollTo: { y: finalScroll, autoKill: true },
            ease: Power1.easeOut,
            autoKill: true,
            overwrite: 5
        });
    });

    function parallaxBg(e) {
        var topStart = $('.infograph__img').offset().top;
        var xpos = e.clientX;
        var ypos = e.clientY;
        var centerScreen = $(window).innerWidth() / 2;
        TweenMax.to($('.infograph__img'), 0.1, {
            ease: Power1.easeInOut,
            'backgroundPositionX': 50 + (xpos - centerScreen) / 100 + '%' // I counted +/-10% for changing bg
        });
        TweenMax.to($('.infograph__img'), 0.1, {
            ease: Power1.easeInOut,
            'backgroundPositionY': topStart / 100 + ypos / 9 + '%'
        });
    }

    $('.slider').slick({
        infinite: false,
        dots: true,
        arrows: false
    });
});

function checkDots() {
    $('.circle:visible').each(function (i, e) {
        if ($(window).height() / 2 + 20 >= $(e).offset().top - $(window).scrollTop()) {
            $(e).addClass('active');
            drawSvgImg(e);
        }
        // else {
        //     $(e).removeClass('active');
        // }
    });
}

function drawSvgImg(e) {
    var svgToAnimate = $(e).find('.pathSVG');
    TweenMax.from(svgToAnimate, 0.5, { drawSVG: '0%', delay: 0.4, ease: Power3.easeOut });
    $(svgToAnimate).removeClass('pathSVG');
}

function checkNextToActive() {
    $('.circle:visible').each(function (i, e) {
        if ($(window).height() / 2 >= $(e).offset().top - $(window).scrollTop()) {
            if ($(e).closest('.roadmap__row').hasClass('lastInRowJS')) {
                $(e).closest('.figureContainer').nextAll('.figureContainer').first().find('.firstInRowJS .circle').addClass('nextToActive');
            } else {
                $(e).closest('.roadmap__row').next('.roadmap__row').find('.circle').addClass('nextToActive');
            }
        } else {
            $(e).closest('.roadmap__row').next('.roadmap__row').find('.circle').removeClass('nextToActive');
        }
    });
}

function clipThru() {
    $('.benefits__roadmap').clipthru({
        keepClonesInHTML: true,
        autoUpdate: true,
        autoUpdateInterval: 10
    });
}