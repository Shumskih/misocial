window.addEventListener('DOMContentLoaded', function() {
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
});