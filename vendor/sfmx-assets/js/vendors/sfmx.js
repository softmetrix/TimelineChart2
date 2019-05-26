'use strict';
/**
 * SOFTMETRIX assets JS
 */
const SFMX = {};

/**
 * Arrow creator
 * EXAMPLE:
 * SFMX.arrow('.arrow-container', '#f30838', 300, 30);
 *
 * @param ele [element selector]
 * @param c   [color]
 * @param w   [width]
 * @param h   [height]
 */
SFMX.arrow = function (ele, c, w, h, hideTail, hideHead) {
    // Sum of tail + head
    let tailHead = parseInt(10 + 24);
    // Prevent if arrow size smaller then tail + head
    SFMX.ele(ele).style.width = w < tailHead ? tailHead + 1 + 'px' : w + 'px';
    SFMX.ele(ele).style.height = h + 'px';
    SFMX.ele(ele).innerHTML = SFMX.arrowSvg(c, w, h, hideTail, hideHead);
};

/**
 *
 * @param ele
 * @returns {element}
 */
SFMX.ele = function (ele) {
    let element = document.querySelector(ele);
    return element !== null ? element : false;
};

/**
 * Arrow SVG
 * Tail + Body + Head
 * @param color
 * @param w
 * @param h
 * @returns {string}
 */
SFMX.arrowSvg = function (color, w, h, hideTail, hideHead) {
    // Sum of tail + head
    let tailHead = 0;
    if(!hideTail) {
        tailHead += 10;
    }
    if(!hideHead) {
        tailHead += 24;
    }

    // Prevent if arrow size smaller then tail + head
    w = w < tailHead ? 1 + 'px' : w - tailHead + 'px';
    h = h + 'px';

    let tailSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="10" height="32" viewBox="0 0 10 32"' +
        ' preserveAspectRatio="none" style="fill: ' + color + ';height: ' + h + '" class="svg-arrow' +
        ' arrow-tail">' +
        '        <path d="M-0.003 1.959l10.314 14.024-10.314 14.059h10.314v-28.083z"></path>' +
        '    </svg>\n';
    let bodySvg ='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32" preserveAspectRatio="none" style="fill: ' +
        color + ';width: ' + w + ';height: ' + h + '" class="svg-arrow arrow-body">' +
        '        <path d="M0 1.956h28.086v28.086h-28.086v-28.086z"></path>\n' +
        '    </svg>\n';
    let headSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" preserveAspectRatio="none" style="fill: ' +
        color + ';height: ' + h + '" class="svg-arrow arrow-head">' +
        '        <path d="M-0.018 1.959l0.024 28.083 24.302-14.059z"></path>' +
        '    </svg>';

    let resultSvg = '';
    if(!hideTail) {
        resultSvg += tailSvg;
    }
    resultSvg += bodySvg;
    if(!hideHead) {
        resultSvg += headSvg;
    }

    return resultSvg;
};
