'use strict';
import $ from 'jquery';
import plugin from './plugin';

class pfDropdown {

    constructor(element, options = {})
    {
        this.$original = $(element);
        this.$container = null;
        this.groups = [];
        this.items = [];

        // Default options
        this.settings = $.extend({
            containerClass: 'pf-dropdown',
            insertDefaultStyles: true,
            implementOriginalStyles: true,
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
            rendering: {
                item: null, // (item, options) => { return $('<tags>'); },
                group: null // (group, options) => { return $('<tags>'); },
            },
            onOverItem: null, // ($item, data) => { },
            onLeaveItem: null, // ($item, data) => { },
            onSelectItem: null, // (data) => { },
            beforeAddItem: null, // (data) => { return true; },
            onAddItem: null, // (data) => { },
            beforeDeleteItem: null, //(data) => { return true; },
            onDeleteItem: null, // (data) => { },
            onRendered: null, // ($original, $container) => { },
            onDestroy: null, // ($original) => { }
        }, options);

        // load current options of original selector
        this._loadOriginalOptions();

        // render widget
        if (this._renderWidget()) {
            // trigger event
            if ($.isFunction(this.settings.onRendered))  this.settings.onRendered(this.$original, this.$container);
        }
    }


    _loadOriginalOptions()
    {
        this.items = [];
        this.groups = [];
        let $groups = this.$original.find('optgroup'),
            itemsLoopFn = ($options, groupId) => {
                $options.each((_, o) => {
                    let $o = $(o),
                        json = $o.data('json'),
                        itemData = json ? json : {};
                    itemData.id = this.items.length;
                    itemData.group = groupId;
                    itemData.value = $o.attr('value');
                    itemData.title = $o.text();
                    this.items.push(itemData);
                });
            };
        if ($groups.length > 0) {
            $groups.each((_, g) => {
                this.groups.push({
                    id: this.groups.length,
                    label: $(g).attr('label')
                });
                itemsLoopFn($g.find('option'), groupId);
            });
        } else {
            itemsLoopFn(this.$original.find('option'), '');
        }
    }


    _getItemById(id)
    {
        if (this.items.length > 0) {
            for (let item of this.items) {
                if (item.id == id) return item;
            }
        }
        return null;
    }


    _getTerm()
    {


    }


    /**
     * @param {Object<jQueryElement>} $defaultTemplate
     * @param {Object} item Item {title: title, value: value, data: {}}
     * @param {Object} options Plugin settings
     * @private
     * @return {Object<jQueryElement>}
     */
    _renderItem(item)
    {
        item = item || false;
        if (!$.isPlainObject(item))  return false;
        if ([typeof(item.id), typeof(item.value), typeof(item.title)].includes('undfined'))  return false;

        let $item = $('<li class="pf-dropdown-item" data-item_id="' + item.id + '">{inner}</li>'),
            $inner = null;
        if ($.isFunction(this.settings.rendering.item)) {
            $inner = this.settings.rendering.item(item, this.settings);
        }
        if ($inner === null || typeof $inner !== 'object' || typeof($inner[0]) !== 'undefined') {
            $inner = $('<span class="default-item-template">' + item.title + '</span>');
        }
        $item.html($inner);
        // callbacks: this.settings.onOverItem, this.settings.onLeaveItem, this.settings.onSelectItem
        $item.hover(
            (event) => {
                if ($.isFunction(this.settings.onOverItem)) {
                    let $item = $(event.target),
                        data = this._getItemById($item.data('item_id'));
                    this.settings.onOverItem($item, data);
                }
            },
            (event) => {
                if ($.isFunction(this.settings.onLeaveItem)) {
                    let $item = $(event.target),
                        data = this._getItemById($item.data('item_id'));
                    this.settings.onLeaveItem($item, data);
                }
            }
        );
        $item.on('click', (event) => {
            let data = this._getItemById($(event.target).data('item_id'));
            this._onSelectItem($(event.target), data);
            if ($.isFunction(this.settings.onSelectItem)) {
                this.settings.onSelectItem(data);
            }
        });
        return $item;
    }


    /**
     * @param {Object} group Group data
     * @param {string|Object} itemsHtml
     * @param {Object} options Plugin settings
     * @private
     */
    _renderGroup(group, itemsHtml, options)
    {
        let $groupTemplate = $('<li class="pf-dropdown-group" data-group_id="' + group.id + '">' +
            '<span class="pf-group-item">' + group.label + '</span>' +
            '<ul class="pf-dropdown-group-items">{items}</ul>' +
        '</li>');

        this._renderItem();
    }


    _implementOriginalStyles()
    {
        const needed = ['background', 'backgroundColor', 'border', 'position', 'top', 'left', 'right', 'bottom', 'color',
            'cursor', 'font', 'height', 'lineHeight', 'margin', 'maxHeight', 'maxWidth', 'outline', /* 'padding', */
            'width', 'wordSpacing', 'wordWrap', 'zoom'];
        let originalStyles = typeof(document.defaultView) !== 'undefined' ? document.defaultView.getComputedStyle(this.$original[0], null) : {};
        for (let key in originalStyles) {
            if (needed.includes(key)) {
                let value = originalStyles[key];
                if (['height', 'width'].includes(key) && value === 'auto') {
                    value = this.$original.css(key);
                }
                if (key === 'position' && value === 'static')  value = 'relative';
                if (key === 'border') {
                    if (value !== 'none') {
                        this.$container.find('.pf-input-frame').css(key, value)
                            .css('box-sizing', 'border-box');
                        this.$container.find('.pf-dropdown-frame').css(key, value)
                            .css('border-top', 'none').css('box-sizing', 'border-box');
                    }
                } else {
                    this.$container.css(key, value);
                    if (['width', 'height'].includes(key)) {
                        this.$container.find('.pf-input-frame').css(key, value);
                    }
                }
            }
        }
    }


    /**
     * @private
     */
    _renderContainer()
    {
        this.setDefaultStyles();
        this.$original.css('display', 'none');
        this.$container = $('<div>').addClass(this.settings.containerClass).append(
            $('<div class="pf-input-frame">\n' +
                '<ul class="pf-decorated" style="display:none"><li></li></ul>\n' +
                '<input type="text" class="pf-input" value=""/>\n' +
                '<a href="#" class="pf-arrow"><i></i></a>\n' +
                '</div>\n' +
                '<div class="pf-dropdown-frame"><ul class="pf-dropdown-list"></ul></div>')
        );
        if (this.settings.useOriginalStyles) {
            // clone general styles from original <select>
            this._implementOriginalStyles();
        }
        if (!this.settings.autocomplete) {
            this.$container.find('.pf-input').prop('readonly', true);
        }
        if (this.settings.displaySelectionAs === 'html') {
            this.$container.find('.pf-decorated').css('display', '');
        }
        this.$container.find('.pf-input').css('background-color', 'transparent');
        this.$container.find('.pf-dropdown-frame').css('display', 'none');
        this.$container.insertBefore(this.$original);
        this.$container.append(this.$original);
        // bind events
        this.$container.find('.pf-input-frame').on('click', (event) => {
            event.preventDefault();
            this._toggleDropdown();
            return false;
        });
        $('body').on('click pf-dropdown-click', () => {
            this.$container.find('.pf-dropdown-frame').css('display', 'none');
        });
    }


    _renderWidget()
    {
        this._renderContainer();

        console.log('point 1');

        if (this.groups.length > 0) {

            console.log('point 2', this.groups);

        } else {

            console.log('point 3');

            if (this.items.length > 0) {

                console.log('point 4');

                let $items = [];
                for (let item of this.items) {
                    let $item = this._renderItem(item);
                    if ($item !== false && typeof($item) === 'object' && typeof($item[0]) !== 'undefined') {
                        $items.push($item);
                    }
                }

                console.log('point 5', $items);

                this.$container.find('.pf-dropdown-list').html($items);
            }
        }
        return true;
    }


    // TODO
    reloadOriginalItems()
    {
        let items = this._loadOriginalOptions();

        if (items.length > 0) {

        } else {

        }
    }


    _toggleDropdown()
    {
        $('body').trigger('pf-dropdown-click');
        let $dropdown = this.$container.find('.pf-dropdown-frame');
        if ($dropdown.css('display') !== 'none') {
            $dropdown.css('display', 'none');
        } else {
            if (this.$container.find('.pf-dropdown-item').length > 0) {
                $dropdown.css('display', '');
            }
        }
    }


    _onSelectItem($item, data)
    {
        this._toggleDropdown();
        let $input = this.$container.find('.pf-input'),
            $frame = this.$container.find('.pf-decorated li');
        if (this.settings.displaySelectionAs === 'html') {
            $input.val('');
            $frame.html($item.clone());
        } else {
            // text
            $input.val(data.title); // TODO error
            $frame.html('');
        }

        // TODO изменить текущее значение в оригинальном select и вызвать событие change

    }


    onLoadItems(items)
    {

        return items;
    }



    /**
     * @return {Object} {value: "123", title: "Numbers", data: {Object} }
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

    // helpers
    setDefaultStyles()
    {
        if (this.settings.insertDefaultStyles) {
            if ($('#pf-default-styles').length > 0)  return;

            // TODO reqire default styles

        }
    }

}


plugin('pfDropdown', pfDropdown);