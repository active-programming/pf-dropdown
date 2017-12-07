/**
 * TODO Plugin example
 */
'use strict';
import 'jquery';

export default class {

    constructor() {

    }

    onRendered($original, $container) {

    }

    renderItem(item, settings) {
        //return $('<tags>');
    }

    renderGroup(group, $items, settings) {
        //return $('<tags>');
    }

    onOverItem($item, item) {

    }

    onLeaveItem($item, item) {

    }

    onSelectItem(item) {

    }

    beforeAddItem(item) {
        return true;
    }

    onAddItem($item, item) {

    }

    beforeDeleteItem($item, item) {
        return true;
    }

    onDeleteItem(item) {

    }

}


