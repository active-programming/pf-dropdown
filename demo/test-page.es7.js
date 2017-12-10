import 'jquery';
import './../src/js/pf-dropdown';
import PluginExample from './plugin-example';
require('!style-loader!css-loader!./../distr/css/default.css');

$(function($) {

    $('#select-1').pfDropdown({
        containerClass: 'pf-dropdown',
        useOriginalStyles: true,
        //autocomplete: true,
        callbacks: {
            onRendered: function ($original, $container) {
                //console.log('RENDERED!', $container[0], $original[0]);
            },
            onClose: function ($original, $container) {
                //console.log('onClose', $container[0], $original[0]);
            },
            onOpen: function ($original, $container) {
                //console.log('onOpen', $container[0], $original[0]);
            },
            onOverItem: function ($item, data) {
                //console.log('over', $item, data);
                $item.css('background-color', 'magenta');
            },
            onLeaveItem: function ($item, data) {
                //console.log('leave', $item, data);
                $item.css('background-color', '');
            },
            onSelectItem: function (data) {
                //console.log('selected', data);
            }
        },
        ajax: {
            loadOnInit: true,
            url: './select-3.json',
            valueKey: 'value',
            titleKey: 'title',
            dataKey: 'dataset'
        },
        plugins: [
            new PluginExample()
        ]
    }).on('keypress keyup keydown', function(event) {
        //console.log('select-1', event);
    });

    $('#select-2').pfDropdown({
        containerClass: 'pf-dropdown',
        useOriginalStyles: false,
        displaySelectionAs: 'html',
        callbacks: {
            renderGroup: function($group, group, $items, $original, $container, settings)
            {
                console.log('callback: renderGroup');
                $group.addClass('my-callback');
                return $group;
            }
        },
        plugins: [
            new PluginExample()
        ]
    });

    // call some method
    //$('#select-1').pfDropdown('setValue', 'value');

});