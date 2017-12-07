import './pf-dropdown';
import 'jquery';
require('!style-loader!css-loader!../../distr/css/default.css');

$(function($) {

    $('#select-1').pfDropdown({
        containerClass: 'pf-dropdown',
        useOriginalStyles: true,
        autocomplete: true,
        onRendered: function ($original, $container) {
            //console.log('RENDERED!', $original[0]);
        },
        onOverItem: function ($item, data) {
            //console.log('over', $item, data);
        },
        onLeaveItem: function ($item, data) {
            //console.log('leave', $item, data);
        },
        onSelectItem: function (data) {
            //console.log('selected', data);
        }
    });

    // test of proxy events
    $('#select-1').on('keypress keyup keydown', function(event) {
        console.log('select-1', event);
    });

    $('#select-2').pfDropdown({
        containerClass: 'pf-dropdown',
        useOriginalStyles: false,
        displaySelectionAs: 'html'
    });

    // call some method
    //$('#select-1').pfDropdown('setValue', 'value');

});