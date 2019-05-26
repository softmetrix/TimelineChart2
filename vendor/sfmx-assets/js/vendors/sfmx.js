'use strict';
/**
 * SOFTMETRIX assets JS
 * Created by SoftMetrix
 */

/**
 * Import Helper module
 */
import HE from 'lib/helper.js';

/**
 * Main JS object (literal)
 *
 * @type {{}}
 */
const SFMX = {};

/**
 * Arrow creator
 * EXAMPLE:
 * SFMX.arrow('.arrow-container', '#f30838', 300, 30, true, false);
 *
 * @param ele [element selector]
 * @param c   [color]
 * @param w   [width]
 * @param h   [height]
 * @param hideTail [bool]
 * @param hideHead [bool]
 * @return mixed
 */
SFMX.arrow = function (ele, c, w, h, hideTail, hideHead) {
    // Sum of tail + head
    let tailHead = parseInt(10 + 24);
    // Prevent if arrow size smaller then tail + head
    HE.ge(ele).style.width = w < tailHead ? tailHead + 1 + 'px' : w + 'px';
    HE.ge(ele).style.height = h + 'px';
    // noinspection JSUndefinedPropertyAssignment
    HE.ge(ele).innerHTML = SFMX.arrowSvg(c, w, h, hideTail, hideHead);
};

/**
 * Arrow SVG
 * Tail + Body + Head
 *
 * @param color [string]
 * @param w [int]
 * @param h [int]
 * @param hideTail [bool]
 * @param hideHead [bool]
 * @returns string [SVG for arrow]
 */
SFMX.arrowSvg = function (color, w, h, hideTail, hideHead) {
    // Sum of tail + head
    let tailHead = 0;
    tailHead += !hideTail ? 10 : tailHead;
    tailHead += !hideHead ? 24 : tailHead;

    // Prevent if arrow size smaller then tail + head
    w = w < tailHead ? 1 + 'px' : w - tailHead + 'px';
    h = h + 'px';

    // 3 part of arrow (tail, body and head)
    let tailSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="10" height="32" viewBox="0 0 10 32"' +
        ' preserveAspectRatio="none" style="fill: ' + color + ';height: ' + h + '" class="svg-arrow' +
        ' arrow-tail">' +
        '        <path d="M-0.003 1.959l10.314 14.024-10.314 14.059h10.314v-28.083z"></path>' +
        '    </svg>\n';
    let bodySvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32" preserveAspectRatio="none" style="fill: ' +
        color + ';width: ' + w + ';height: ' + h + '" class="svg-arrow arrow-body">' +
        '        <path d="M0 1.956h28.086v28.086h-28.086v-28.086z"></path>\n' +
        '    </svg>\n';
    let headSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" preserveAspectRatio="none" style="fill: ' +
        color + ';height: ' + h + '" class="svg-arrow arrow-head">' +
        '        <path d="M-0.018 1.959l0.024 28.083 24.302-14.059z"></path>' +
        '    </svg>';

    let resultSvg = '';

    // Set what include in arrow
    resultSvg += !hideTail ? tailSvg : '';
    resultSvg += bodySvg;
    resultSvg += !hideHead ? headSvg : '';

    return resultSvg;
};
