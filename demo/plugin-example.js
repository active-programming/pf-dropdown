/**
 * TODO Plugin example
 */
'use strict';
import 'jquery';

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

    onBeforeAddItem(item)
    {
        // return item or false;
    }

    onAddItem($item, item)
    {

    }

    onBeforeDeleteItem($item, item)
    {
        // return true or false;
    }

    onDeleteItem(item)
    {

    }

    // preProcessors methods

    renderItem($item, item, $original, $container, settings)
    {
        // $item.addClass('my-class-name');
        // return $item;
    }

    renderGroup($group, group, $items, $original, $container, settings)
    {
        $group.addClass('my-class-name');
        $group.find('.pf-group-item').html('&#9679; ' + group.label);
        return $group;
    }

    ajaxDataBuilder(currentData, $original, $container, settings)
    {
        let myData = $.extend(currentData, {myParam: 'my value'});
        return myData;
    }

    ajaxResponseFilter(json, settings)
    {
        // let response = [];
        // for (item of json)  response.push({title: item.header, value: item.id, dataset: {hey: 'you!'}});
        // return json;
    }
}


