/**
 * TODO Plugin example
 */
'use strict';
import 'jquery';

export default class {

    constructor() { }

    // Events methods

    onOverItem($item, item)
    {
        $item.css('color', '#fff');
    }

    onLeaveItem($item, item)
    {
        $item.css('color', '');
    }

    onSelectItem(item)
    {
        $('#select-1-value').html(item.title);
    }

    // preProcessors methods

    renderItem($item, item, $original, $container, settings)
    {
        $item.addClass('my-class-name');
        return $item;
    }

}


