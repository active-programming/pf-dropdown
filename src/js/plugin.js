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
 */
export default function plugin(pluginName, className, shortHand = false) {
    let dataName = `__${pluginName}`,
        originalPlugin = $.fn[pluginName];

    $.fn[pluginName] = function (option, param) {
        param = param || null;
        let methodResult = null,
            methodCalled = false;
        this.each(function () {
            let $this = $(this),
                data = $this.data(dataName),
                options = $.extend({}, className.DEFAULTS, $this.data(), typeof option === 'object' && option);
            if (!data) {
                $this.data(dataName, (data = new className(this, options)));
            }
            // calls a method
            if (typeof option === 'string') {
                if ($.isFunction(data[option])) {
                    methodResult = data[option](param);
                    methodCalled = true;
                } else {
                    console.log(pluginName + " has no method or option like '" + option + "'");
                }
            }
        });
        return methodCalled ? methodResult : this;
    };

    if (shortHand) {
        $[pluginName] = (options) => $({})[pluginName](options);
    }

    $.fn[pluginName].noConflict = () => $.fn[pluginName] = originalPlugin;
}