/**
 * TODO Plugin example
 */
'use strict';
import 'jquery';

export default class {

    lastIndex = 0;
    colors = ['red', 'blue', 'green', 'magenta', 'orange'];

    constructor()
    {

    }

    // Events methods

    onSelectItem(item)
    {
        $('#select-3-value').html(item.value + ', ' + item.title);
    }

    // preProcessors methods

    renderItem($item, item, $original, $container, settings)
    {
        $item.css('color', this.colors[this.lastIndex]);
        this.lastIndex++;
        if (this.colors.length === this.lastIndex) {
            this.lastIndex = 0;
        }
        return $item;
    }

    ajaxDataBuilder(currentData, $original, $container, settings)
    {
        return $.extend(currentData, {myParam: 'my value'});
    }

    ajaxResponseFilter(json, settings)
    {
        let response = [];
        for (let item of json)  response.push({title: item.header, value: item.id, dataset: item.dataset});
        return response;
    }
}


