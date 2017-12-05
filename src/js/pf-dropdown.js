'use strict';
import $ from 'jquery';
import plugin from './plugin';

class pfDropdown {

    constructor(element, options = {})
    {
        this.$original = $(element);
        this.$container = null;

        // Default options
        this.settings = $.extend({
            containerClass: 'pf-dropdown',
            useOriginalStyles: true,
            displaySelectionAs: 'text', // 'text', 'html'
            autocomplete: false,
            closeOnSelect: true,
            ajax: {
                url: '',
                type: 'get',
                dataType: 'json',
                data: this._getTerm,
                onLoad: function(items) { return items; },
            },
            arrow: {
                image: '',
                size: [0, 0],
            },
            rendering: {
                item: this._renderItem,
                group: this._renderGroup,
                container: this._renderContainer
            },
            onItemOver: function($item, value, data) { },
            onItemOut: function($item, value, data) { },
            onItemSelect: function(value, data) { },
            beforeAddItem: function(value, title, data) { return [value, title, data] },
            onAddItem: function(value, title, data) { },
            beforeDeleteItem: function(value, title, data) { return [value, title, data] },
            onDeleteItem: function(value, title, data) { },
            onDestroy: function($original) { },
            onInit: function($original, $container) { }
        }, options);

        // load current options of original selector
        this.items = this._loadOriginalOptions();

        // render widget
        this._renderWidget();

        // TODO bind events


    }


    _loadOriginalOptions()
    {
        let items = [];
        this.$original.find('option').each((i, o) => {
            let $o = $(o),
                json = $o.data('json'),
                data = json ? json : {};
            data.value = $o.attr('value');
            data.title = $o.text();
            items.push(data);
        });
        return items;
    }


    _getOriginalStyles()
    {
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


    _getTerm()
    {


    }


    _renderArrow()
    {
        let $arrow = $('<i class="pf-arrow"></i>');
        if (this.settings.arrow.image && this.settings.arrow.size[0] > 0 && this.settings.arrow.size[1] > 0) {
            return $arrow.css('background-image', 'url(' + this.settings.arrow.image + ') center center no-repeat')
                .css('display', 'inline-block').css('height', this.settings.arrow.size[0]).css('width', this.settings.arrow.size[1]);
        }
        return $arrow.attr('style', 'width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #333;');
    }


    /**
     * @param {Object} item Item data
     * @param {Object} options Plugin settings
     * @private
     * @return {Object<jQueryElement>}
     */
    _renderItem(item, options)
    {
        // callbacks: this.settings.onItemOver, this.settings.onItemOut, this.settings.onItemSelect



    }


    /**
     * @param {Object} group Group data
     * @param {string} itemsHtml
     * @param {Object} options Plugin settings
     * @private
     */
    _renderGroup(group, itemsHtml, options)
    {


    }


    _renderContainer(itemsHtml, options)
    {
        let arrow = this._renderArrow();

    }


    _renderWidget()
    {
        //this.$original, this.items, this.$container

        if (this.settings.autocomplete) {


        } else {


        }

        // this.settings.rendering.item();
        // this.settings.rendering.group();
        // this.settings.rendering.container();


        // TODO clone all styles from original <select>
        if (this.settings.useOriginalStyles) {
            let styles = this._getOriginalStyles();

        }
    }


    reloadOriginalItems()
    {
        let items = this._loadOriginalOptions();

        if (items.length > 0) {

        } else {

        }
    }


    onLoadItems(items)
    {

        return items;
    }



    /**
     * @return {Object} {value: "123", caption: "Numbers", data: {Object} }
     */
    getValue()
    {


    }


    /**
     * @param {string} value
     */
    setValue(value)
    {

        console.log("set: " + value);

    }

}


plugin('pfDropdown', pfDropdown);