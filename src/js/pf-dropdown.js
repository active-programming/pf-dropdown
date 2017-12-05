'use strict';
import $ from 'jquery';
import plugin from './plugin';

class pfDropdown {

    constructor(element, options = {})
    {
        this.$original = $(element);
        this.$container = null;
        this.items = [];
        this.groups = [];
        this.templates = this._createDefaultTemplates();

        // Default options
        this.settings = $.extend({
            containerClass: 'pf-dropdown',
            useOriginalStyles: true,
            displaySelectionAs: 'text', // 'text', 'html'
            autocomplete: false,
            minLength: 2, // minimal term size
            //closeOnSelect: true, // next release, setting of tags
            ajax: {
                url: '',
                type: 'get',
                dataType: 'json',
                data: this._getTerm,
                onLoad: (items) => { return items; },
            },
            arrowImage: '',
            rendering: {
                item: this._renderItem,
                group: this._renderGroup
            },
            onOverItem: ($item, value, data) => { },
            onLeaveItem: ($item, value, data) => { },
            onSelectItem: (value, data) => { },
            beforeAddItem: (value, title, data) => { return true; },
            onAddItem: (value, title, data) => { },
            beforeDeleteItem: (value, title, data) => { return true; },
            onDeleteItem: (value, title, data) => { },
            onInit: ($original, $container) => { },
            onDestroy: ($original) => { }
        }, options);

        // load current options of original selector
        this._loadOriginalOptions();

        // render widget
        this._renderWidget();

        // TODO bind events

        this.settings.onInit(this.$original, this.$container);
    }


    _createDefaultTemplates()
    {
        let $itemTemplate = $('<span class="pf-dropdown-item" data-item_id="{id}">{title}</span>');
        let $groupTemplate = $('<span class="pf-dropdown-group" data-group_id="{id}">{label}</span>')
    }


    _loadOriginalOptions()
    {
        this.groups = [];
        this.items = [];
        let $groups = this.$original.find('optgroup');
        if ($groups.length > 0) {
            $groups.each((i, g) => {
                let $g = $(g),
                    groupLabel = $g.attr('label'),
                    groupId = groupLabel.toLowerCase().split(' ').join('-'),
                    json = $g.data('json'),
                    data = json ? json : {};
                data.id = groupId;
                data.label = groupLabel;
                this.groups.push(data);
                $g.find('option').each((i, o) => {
                    let $o = $(o),
                        json = $o.data('json'),
                        itemData = json ? json : {};
                    itemData.group = groupId;
                    itemData.value = $o.attr('value');
                    itemData.title = $o.text();
                    this.items.push(itemData);
                });
            });
        } else {
            this.$original.find('option').each((i, o) => {
                let $o = $(o),
                    json = $o.data('json'),
                    data = json ? json : {};
                data.group = '';
                data.value = $o.attr('value');
                data.title = $o.text();
                this.items.push(data);
            });
        }
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


    /**
     * @param {Object<jQueryElement>} $defaultTemplate
     * @param {Object} item Item data
     * @param {Object} options Plugin settings
     * @private
     * @return {Object<jQueryElement>}
     */
    _renderItem($defaultTemplate, item, options)
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
        let $arrow = $('<a href="#" class="pf-arrow"></a>');
        if (this.settings.arrowImage) {
            $arrow.css({display: 'inline-block',
                backgroundImage: 'url(' + this.settings.arrow.image + ') center center no-repeat'});
        } else {
            $arrow.attr('style', 'display:inline-block;width:0;height:0;border-left:'
                + '5px solid transparent;border-right:5px solid transparent;border-top:5px solid #333;');
        }
    }


    _renderWidget()
    {
        //this.$original, this.items, this.$container

        if (this.settings.autocomplete) {
            // если автокомплит, то нужно чтобы поле ввода было активно


        } else {

            // поле ввода тольк для чтения


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