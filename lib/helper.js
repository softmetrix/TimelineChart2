/**
 * TimeLineChart Helper Object (Literal)
 * Imported in TimeLineChart
 *
 * @type {{}}
 */
const HP = {};

/**
 * Shorthand of document.querySelector
 *
 * @param ele
 * @return {any}
 */
HP.ge = function (ele) {
    let element = document.querySelector(ele);
    return element !== null ? element : false;
};

/**
 * Shorthand of document.querySelectorAll
 *
 * @param ele
 * @return {any}
 */
HP.geAll = function (ele) {
    let element = document.querySelectorAll(ele);
    return element !== null ? element : false;
};