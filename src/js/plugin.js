import $ from 'jquery';

/**
 * Generate a jQuery plugin
 * @param pluginName [string] Plugin name
 * @param className [object] Class of the plugin
 * @param shortHand [bool] Generate a shorthand as $.pluginName
 *
 * @example
 * import plugin from 'plugin';
 *
 * class MyPlugin {
 *     constructor(element, options) {
 *         // ...
 *     }
 * }
 *
 * MyPlugin.DEFAULTS = {};
 *
 * plugin('myPlugin', MyPlugin');
 *
 * Note: I don't remember where I found this function...
 */
export default function plugin(pluginName, className, shortHand = false) {
    let dataName = `__${pluginName}`;
    let old = $.fn[pluginName];

    $.fn[pluginName] = function (option, param) {
        param = param || null;
        return this.each(function () {
            let $this = $(this);
            let data = $this.data(dataName);
            let options = $.extend({}, className.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data(dataName, (data = new className(this, options)));
            }

            // calls a method
            if (typeof option === 'string') {
                if ($.isFunction(data[option])) {
                    data[option](param);
                } else {
                    console.log(pluginName + " has no method or option like '" + option + "'");
                }
            }
        });
    };

    if (shortHand) {
        $[pluginName] = (options) => $({})[pluginName](options);
    }

    $.fn[pluginName].noConflict = () => $.fn[pluginName] = old;
}