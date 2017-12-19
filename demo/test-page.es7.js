import 'jquery';
import './../distr/js/pf-dropdown';
import PluginSelect1 from './plugin-select-1';
import PluginSelect3 from './plugin-select-3';
require('!style-loader!css-loader!./../distr/css/default.css');

jQuery(function($) {

    let $select1 = $('#select-1');
    $select1.pfDropdown({
        containerClass: 'pf-dropdown',
        useOriginalStyles: true,
        callbacks: {
            renderChoice: ($input, items, $original, $container, settings) => {
                $input.val( $input.val() + ' (HAHA, find me!)' );
                return $input;
            },
            onRendered: function ($original, $container) {
                console.log('#select-1 RENDERED!' /*, $container[0], $original[0]*/);
            },
            onOverItem: function ($item, data) {
                $item.css('background-color', 'magenta');
            },
            onLeaveItem: function ($item, data) {
                $item.css('background-color', '');
            },
            onSelectItem: function(item) {
                console.log('select-1: item selected:', item);
            }
        },
        plugins: [
            new PluginSelect1()
        ]
    });
    // set value by plugin
    $select1.pfDropdown('setValue', '2');
    console.log('pfDropdown.setValue()',  $select1.pfDropdown('getValue'));
    // set empty value
    $select1.pfDropdown('setValue', '');
    console.log('#select-1.val()', $select1.pfDropdown('getValue'));
    // set wrong value
    $select1.pfDropdown('setValue', 'abc');
    console.log('#select-1.val()', $select1.pfDropdown('getValue'));


    $('#select-2').pfDropdown({
        containerClass: 'pf-dropdown',
        useOriginalStyles: false,
        displaySelectionAs: 'html',
        callbacks: {
            renderGroup: function($group, group, $items, $original, $container, settings) {
                $group.addClass('rendergroup-callback').find('.pf-group-item').html('&gt; ' + group.label);
                return $group;
            }
        }
    });


    $('#select-3').pfDropdown({
        useOriginalStyles: true,
        ajax: {
            url: './select-3.json',
            loadOnInit: true,
            valueKey: 'value',
            titleKey: 'title',
            dataKey: 'dataset'
        },
        plugins: [
            new PluginSelect3()
        ]
    });


    // autocomplete
    $('#select-4').pfDropdown({
        autocomplete: true,
        useOriginalStyles: false,
        ajax: {
            url: 'http://localhost:3210/get-items'
        },
        callbacks: {
            ajaxDataBuilder: (currentData, $original, $container, settings) => {
                return $.extend(currentData, {myParam: 'my value'});
            },
            ajaxResponseFilter: (json, settings) => {
                let response = [];
                for (let item of json)  response.push({
                    title: item.country_name,
                    value: item.country_code,
                    dataset: item.data
                });
                return response;
            },
            onSelectItem: (item) => {
                console.log('onSelectItem', item);
                console.log('real selected', $('#select-4').pfDropdown('getValue'));
            },
            onUnselectItem: (item) => {
                console.log('onUnselectItem', item);
            }
        }
    }).on('keypress keyup keydown', function(event) {
        //console.log('select-1: key event', event);
    });

    $('#select-5').pfDropdown({
        useOriginalStyles: false,
        displaySelectionAs: 'html',
        closeOnSelect: false,
        callbacks: {
            renderChoice: ($view, items, $original, $container, settings) => {
                $view.addClass('hey-you');
                return $view;
            },
            onSelectItem: (item) => {
                console.log('onSelectItem', item);
                console.log('real selected', $('#select-5').pfDropdown('getValue'));
            },
            onUnselectItem: (item) => {
                console.log('onUnselectItem', item);
            }
        }
    });


    $('#select-5').pfDropdown('setNewItems', [
        {"title": "Min", "value": "", "selected": false},
        {"title": "Value 24", "value": 24},
        {"title": "Value 54", "value": 54, "selected": true, "dataset": {}},
        {"title": "Value 55", "value": 55},
        {"title": "Value 163", "value": 163, "selected": true, "dataset": {}}
    ]);

    $('#select-5').pfDropdown('setValue', [24,54,163]);

});