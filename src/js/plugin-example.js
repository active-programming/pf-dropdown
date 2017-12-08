/**
 * TODO Plugin example
 */
'use strict';
import 'jquery';

export default class {

    constructor() {
        // define your properties if needed
        // this.aPropery = 'a value';
        // this.bPropery = 'b value';
    }

    // Events methods

    onRendered($original, $container) {

    }

    onClose($original, $container) {

    }

    onOpen($original, $container) {

    }

    onOverItem($item, item) {

    }

    onLeaveItem($item, item) {

    }

    onInputKeyEvent(event, $input) {

    }

    onSelectItem(item) {

    }

    onBeforeAddItem(item) {
        // return item or false;
    }

    onAddItem($item, item) {

    }

    onBeforeDeleteItem($item, item) {
        // return true or false;
    }

    onDeleteItem(item) {

    }

    // Processors methods

    renderItem(item, settings) {
        // return $('<tags>');
    }

    renderGroup(group, $items, settings) {
        // return $('<tags>');
    }

    ajaxDataBuilder(url, currentData, $original, $container) {
        // return {url: {string}, data: {Object}};
    }

    ajaxResponseFilter(json) {
        // process response and return json;
    }
}


