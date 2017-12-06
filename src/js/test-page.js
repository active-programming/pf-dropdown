import './pf-dropdown';
import 'jquery';

$(function($) {

    console.log("HEY!");

    $('#select-1').pfDropdown({
        containerClass: 'pf-dropdown',
        useOriginalStyles: true,
        autocomplete: true,
        onRendered: function ($original, $container) {
            console.log('RENDERED!', $original[0]);
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

    $('#select-2').pfDropdown({
        containerClass: 'pf-dropdown',
        useOriginalStyles: false,
        displaySelectionAs: 'html'
    });

    // call some method
    //$('#select-1').pfDropdown('setValue', 'value');

});