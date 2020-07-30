window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let link = document.querySelector('.m-menu-hamburger'),
        close = document.querySelector('.close-menu'),
        menu = document.querySelector('.m-menu');

    link.addEventListener('click', function (e) {
        e.preventDefault();

        menu.classList.toggle('m-menu__active');
    });

    close.addEventListener('click', function (e) {

        e.preventDefault();

        menu.classList.toggle('m-menu__active');
    });

    function scrolling(upSelector) {
        const upElem = document.querySelector(upSelector);

        window.addEventListener('scroll', () => {
            if (document.documentElement.scrollTop > 500) {
                upElem.classList.add('animated', 'fadeIn');
                upElem.classList.remove('fadeOut');
            } else {
                upElem.classList.add('fadeOut');
                upElem.classList.remove('fadeIn');
            }
        });

        // Scrolling with animation frame
        let links = document.querySelectorAll('[href^="#"]'),
            speed = 0.3;

        links.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                let widthTop = document.documentElement.scrollTop,
                    hash = this.hash,
                    toBlock = document.querySelector(hash).getBoundingClientRect().top,
                    start = null;

                requestAnimationFrame(step);

                function step(time) {
                    if (start === null) start = time;

                    let progress = time - start,
                        r = (toBlock < 0 ? Math.max(widthTop - progress / speed, widthTop + toBlock) : Math.min(widthTop + progress / speed, widthTop + toBlock));

                    document.documentElement.scrollTo(0, r);

                    if (r != widthTop + toBlock) requestAnimationFrame(step);
                    else location.hash = hash;
                }
            });
        });
    }

    scrolling('.pageup');
});