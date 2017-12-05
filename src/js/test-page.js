import './pf-dropdown';
import 'jquery';

$(function($) {

    console.log("HEY!");

    $('#select-1').pfDropdown({containerClass: 'pf-dropdown', useOriginalStyles: true});
    $('#select-2').pfDropdown({containerClass: 'pf-dropdown', useOriginalStyles: true});

    // call some method
    //$('#select-1').pfDropdown('setValue', 'value');

});