'use strict';
import 'jquery';

/**
 * Plugin skeleton
 */
export default class {

    // define your properties here if you have "transform-class-properties" bable plugin or in constructor
    //aPropery = 'a value';
    //bPropery = 'b value';

    constructor()
    {
        // this.aPropery = 'a value';
        // this.bPropery = 'b value';
    }

    // Events methods

    onRendered($original, $container)
    {

    }

    onClose($original, $container)
    {

    }

    onOpen($original, $container)
    {

    }

    onOverItem($item, item)
    {

    }

    onLeaveItem($item, item)
    {

    }

    onInputKeyEvent(event, $input)
    {

    }

    onSelectItem(item)
    {

    }

    onUnselectItem(item)
    {

    }

    // not sure about that
    // onBeforeAddItem(item)
    // {
    //     // return item or false;
    // }
    //
    // onAddItem($item, item)
    // {
    //
    // }
    //
    // onBeforeDeleteItem($item, item)
    // {
    //     // return true or false;
    // }
    //
    // onDeleteItem(item)
    // {
    //
    // }

    // preProcessors methods

    renderChoice($view, items, $original, $container, settings)
    {
        // $view.addClass('my-class-name');
        // return $view;
    }

    renderItem($item, item, $original, $container, settings)
    {
        // $item.addClass('my-class-name');
        // return $item;
    }

    renderGroup($group, group, $items, $original, $container, settings)
    {
        // $group.addClass('my-class-name');
        // $group.find('.pf-group-item').html('&#9679; ' + group.label);
        // return $group;
    }

    ajaxDataBuilder(currentData, $original, $container, settings)
    {
        //return $.extend(currentData, {myParam: 'my value'});
    }

    ajaxResponseFilter(json, settings)
    {
        // @see select-3.json and select-4.json for example of response
        // let response = [];
        // for (let item of json)  response.push({title: item.header, value: item.id, dataset: {hey: 'you!'}});
        // return response;
    }

    // using for setNewItems() method
    newItemsFilter(json, settings)
    {
        // @see select-3.json and select-4.json for example of response
        // let response = [];
        // for (let item of json)  response.push({title: item.header, value: item.id, dataset: {hey: 'you!'}});
        // return response;
    }
}


