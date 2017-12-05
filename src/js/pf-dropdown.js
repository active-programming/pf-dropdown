'use strict';
import $ from 'jquery';
import plugin from './plugin';

class pfDropdown {

    constructor(element, options = {}) {

        console.log(options); return;

        this.$original = $(element);
        this.$container = null;

        // Default options
        this.settings = $.extend({
            containerClass: 'pf-dropdown',
            useOriginalStyles: true,
            displaySelectionAs: 'text', // 'text', 'html'
            autocomplete: false,
            ajax: {
                url: '',
                type: 'get',
                dataType: 'json',
                data: this._getTerm,
                onLoad: this.onLoadItems,
            },
            arrow: {
                'src': '',
                'size': [0, 0],
            },
            onItemOver: function($item, value, data) { },
            onItemSelect: function(value, data) { },
            beforeAddItem: function(value, title, data) { return [value, title, data] },
            onAddItem: function(value, title, data) { },
            beforeDeleteItem: function(value, title, data) { return [value, title, data] },
            onDeleteItem: function(value, title, data) { },
            onDestroy: function($original) { },
            onInit: function($original, $container) { },
            rendering: {
                item: this.renderItem,
                group: this.renderGroup,
                container: this.renderContainer
            }
        }, options);

        // TODO gets current options of original selector


        // TODO render plugin html

        // TODO bind events

        // TODO clone all styles from original <select>
        if (this.settings.useOriginalStyles) {
            let styles = this._getOriginalStyles();
            console.log(styles);
        }

    }


    _getTerm() {


    }


    onLoadItems(items) {

        return items;
    }


    renderItem(item, options) {


    }


    renderGroup(group, itemsHtml, options) {


    }


    renderContainer(itemsHtml, options) {


    }


    _getOriginalStyles() {
        const needed = [
            'background', 'border', 'position', 'top', 'left', 'right', 'bottom', 'color', 'cursor', 'font', 'height',
            'lineHeight', 'margin', 'maxHeight', 'maxWidth', 'outline', 'padding', 'width', 'wordSpacing', 'wordWrap',
            'zoom'
        ];
        let copiedStyles = {},
            originalStyles = typeof(document.defaultView) !== 'undefined' ? document.defaultView.getComputedStyle(this.$original[0], null) : {};
        for (let key of originalStyles) {
            if (needed.includes(key))  copiedStyles[key] = originalStyles[key];
        }
        return copiedStyles;
    }


    /**
     * @return {Object} {value: "123", caption: "Numbers", data: {Object} }
     */
    getValue() {


    }


    /**
     * @param {string} value
     */
    setValue(value) {

        console.log("set: " + value);

    }

}


plugin('pfDropdown', pfDropdown);