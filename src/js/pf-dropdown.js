'use strict';
import $ from 'jquery';
import plugin from './plugin';

class pfDropdown {

    constructor(element, options = {}) {
        this.$original = $(element);
        this.$container = null;
        this.groups = [];
        this.items = [];

        // Default options
        this.settings = $.extend({
            containerClass: 'pf-dropdown',
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
                onLoad: (items) => {
                    return items;
                },
            },
            rendering: {
                item: null, // (item, settings) => { return $('<tags>'); },
                group: null // (group, $items, settings) => { return $('<tags>'); },
            },
            onOverItem: null, // ($item, item) => { },
            onLeaveItem: null, // ($item, item) => { },
            onSelectItem: null, // (item) => { },
            beforeAddItem: null, // (item) => { return true; },
            onAddItem: null, // (item) => { },
            beforeDeleteItem: null, //(item) => { return true; },
            onDeleteItem: null, // (item) => { },
            onRendered: null, // ($original, $container) => { },
            onDestroy: null, // ($original) => { }
        }, options);

        // load current options of original selector
        this._loadOriginalOptions();
        // render widget
        this._renderWidget();
        // trigger event
        if ($.isFunction(this.settings.onRendered)) this.settings.onRendered(this.$original, this.$container);
    }


    _loadOriginalOptions() {
        this.items = [];
        this.groups = [];
        let currentValue = this.$original.find('option:selected').attr('value'),
            $groups = this.$original.find('optgroup');
        currentValue = currentValue ? currentValue : '';
        let itemsLoopFn = ($options, groupId) => {
            $options.each((_, o) => {
                let $o = $(o),
                    dataset = $o.data('set'),
                    value = $o.attr('value') ? $o.attr('value') : '';
                this.items.push({
                    group: groupId,
                    value: value,
                    title: $o.text() ? $o.text() : '',
                    selected: (currentValue == value) ? true : false,
                    data: dataset ? dataset : {}
                });
            });
        };
        if ($groups.length > 0) {
            $groups.each((_, g) => {
                let groupId = this.groups.length;
                this.groups.push({id: groupId, label: $(g).attr('label')});
                itemsLoopFn($(g).find('option'), groupId);
            });
        } else {
            itemsLoopFn(this.$original.find('option'), '');
        }
    }


    _getSelectedItem()
    {
        // todo multiple?
        if (this.items.length > 0) {
            for (let item of this.items) {
                if (item.selected)  return item;
            }
        }
        return null;
    }


    _getItemByValue(value)
    {
        if (this.items.length > 0) {
            for (let item of this.items) {
                if (item.value == value) return item;
            }
        }
        return null;
    }


    _getTerm()
    {


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


    _renderWidget()
    {
        this._renderContainer();
        if (this.groups.length > 0) {
            // if there are groups
            let $groups = [];
            for (let group of this.groups) {
                let $items = [];
                for (let item of this.items) {
                    if (item.group == group.id) {
                        let $item = this._renderItem(item);
                        if ($item instanceof $) {
                            $items.push($item);
                        }
                    }
                }
                let $group = this._renderGroup(group, $items);
                if ($group instanceof $) {
                    $groups.push($group);
                }
                this.$container.find('.pf-dropdown-list').html($groups);
            }
        } else {
            // if there are no groups
            if (this.items.length > 0) {
                let $items = [];
                for (let item of this.items) {
                    let $item = this._renderItem(item);
                    if ($item instanceof $) {
                        $items.push($item);
                    }
                }
                this.$container.find('.pf-dropdown-list').html($items);
            }
        }
        // set current item
        let item = this._getSelectedItem();
        if (item !== null) {
            let $item = this._renderItem(item);
            if ($item !== false) {
                this._onSelectItem($item, item, false);
            }
        }
        // bind events
        this.$container.find('.pf-input-frame').on('click', (event) => {
            event.preventDefault();
            this._toggleDropdown();
            return false;
        });
        if (this.settings.autocomplete) {
            // proxy some events to original <select>
            this.$container.find('.pf-input').on('keypress keyup keydown', (event) => this.$original.trigger(event));
        }
        $('body').on('click', () => {
            console.log('body click');
            this.$container.find('.pf-dropdown-frame').css('display', 'none');
        });
        $('body').on('pf-dropdown-click', () => {
            console.log('event: pf-dropdown-click');
            this.$container.find('.pf-dropdown-frame').css('display', 'none');
        });
    }


    /**
     * @private
     */
    _renderContainer()
    {
        this.$original.css('display', 'none');
        this.$container = $('<div>').addClass(this.settings.containerClass).append($(
            `<div class="pf-input-frame">
                <ul class="pf-decorated" style="display:none"><li></li></ul>
                <input type="text" class="pf-input" value="" style="background-color: transparent"/>
                <a href="#" class="pf-arrow"><i></i></a>
            </div>
            <div class="pf-dropdown-frame" style="display:none">
                <ul class="pf-dropdown-list"></ul>
            </div>`
        ));
        // clone general styles from original <select>
        if (this.settings.useOriginalStyles === true)  this._implementOriginalStyles();
        // if no autocomplete, then disable the input
        if (!this.settings.autocomplete === true)  this.$container.find('.pf-input').prop('readonly', true);
        // selected item view type
        if (this.settings.displaySelectionAs === 'html')  this.$container.find('.pf-decorated').css('display', '');
        this.$container.insertBefore(this.$original);
        this.$container.append(this.$original);
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

        let $item = $('<li class="pf-dropdown-item" data-item_value="">{inner}</li>'),
            $inner = null;
        $item.attr('data-item_value', item.value);
        if ($.isFunction(this.settings.rendering.item)) {
            $inner = this.settings.rendering.item(item, this.settings);
        }
        if (!($inner instanceof $)) {
            $inner = $('<span class="default-item-template"></span>');
            $inner.html(item.title);
        }
        $item.html($inner);
        // callbacks: this.settings.onOverItem, this.settings.onLeaveItem, this.settings.onSelectItem
        $item.hover(
            (event) => {
                if ($.isFunction(this.settings.onOverItem)) {
                    let $item = $(event.target),
                        data = this._getItemByValue($item.data('item_value'));
                    this.settings.onOverItem($item, data);
                }
            },
            (event) => {
                if ($.isFunction(this.settings.onLeaveItem)) {
                    let $item = $(event.target),
                        data = this._getItemByValue($item.data('item_value'));
                    this.settings.onLeaveItem($item, data);
                }
            }
        );
        $item.on('click', (event) => {
            // todo delete console
            console.log('click item', event.target, data);
            let data = this._getItemByValue($(event.target).data('item_value'));
            this._onSelectItem($(event.target), data);
            if ($.isFunction(this.settings.onSelectItem)) {
                this.settings.onSelectItem(data);
            }
        });
        return $item;
    }


    /**
     * @param {Object} group Group data
     * @param {Array<Object>} $items
     * @private
     */
    _renderGroup(group, $items)
    {
        let $group = null;
        if ($.isFunction(this.settings.rendering.item)) {
            $group = this.settings.rendering.group(group, $items, this.settings);
        }
        if (!($group instanceof $)) {
            $group = $(
                `<li class="pf-dropdown-group" data-group_id="${group.id}">
                        <span class="pf-group-item">${group.label}</span>
                    <ul class="pf-dropdown-group-items"></ul>
                </li>`
            );
            $group.find('.pf-dropdown-group-items').html($items);
        }
        return $group;
    }


    _toggleDropdown()
    {
        // todo delete console
        console.log('_toggleDropdown');
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


    _onSelectItem($item, data, close = true)
    {
        close && this._toggleDropdown();
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

}


plugin('pfDropdown', pfDropdown);