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
                loadOnInit: false,
                url: '',
                type: 'get',
                dataType: 'json',
                valueKey: 'value',
                titleKey: 'title',
                dataKey: 'dataset'
                // ajaxDataBuilder in callbacks
                // ajaxResponseFilter in callbacks
            },
            plugins: [
                // new PluginClass()
            ],
            callbacks: {
                //events
                onRendered: null, // ($original, $container) => { },
                onClose: null, // ($original, $container) => { },
                onOpen: null, // ($original, $container) => { },
                onOverItem: null, // ($item, item) => { },
                onLeaveItem: null, // ($item, item) => { },
                onSelectItem: null, // (item) => { },
                onBeforeAddItem: null, // (item) => { return item or false; },
                onAddItem: null, // ($item, item) => { },
                onBeforeDeleteItem: null, //($item, item) => { return true of false; },
                onDeleteItem: null, // (item) => { },
                onInputKeyEvent: null, // (event, $input) => { }
                // processors
                renderItem: null, // (item, settings) => { return $('<tags>'); },
                renderGroup: null, // (group, $items, settings) => { return $('<tags>'); },
                ajaxDataBuilder: null, // (url, currentData, $original, $container) => { return {url: {string}, currentData: {Object}}; },
                ajaxResponseFilter: null //(json) => { process response and return json; },
            }
        }, options);

        // load current options of original selector
        this._loadOriginalOptions();
        // render widget
        this._renderWidget(this.items, this.groups);
        // trigger event
        this._triggerMyEvent('onRendered', this.$original, this.$container);
    }


    _loadOriginalOptions() {
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
        // todo what about multiple?
        let currentValue = this.$original.find('option:selected').attr('value');
        return this._getItemByValue(currentValue);
    }


    /**
     * Returns all Items data by its value
     * @param {string} value
     * @return {null|Object}
     * @private
     */
    _getItemByValue(value)
    {
        if (this.items.length > 0) {
            for (let item of this.items) {
                if (item.value == value) return item;
            }
        }
        return null;
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
     * @param {Object} items
     * @param {Object} groups
     * @private
     */
    _renderWidget(items, groups)
    {
        let $listItems;
        this._renderContainer();
        if (groups.length > 0) {
            // if there are groups
            $listItems = $([]);
            for (let group of groups) {
                let $items = this._renderItems(items, group.id),
                    $group = this._renderGroup(group, $items);
                if ($group instanceof $) {
                    $listItems = $listItems.add($group);
                }
            }
        } else {
            // if there are no groups
            $listItems = this._renderItems(items);
        }
        this.$container.find('.pf-dropdown-list').html($listItems);
        // set current item
        let item = this._getSelectedItem();
        if (item !== null) {
            let $item = this._renderItem(item);
            if ($item !== false)  this._selectItem($item, item);
        }
        // bind events
        this.$container.find('.pf-input-frame').on('click', (event) => {
            event.preventDefault();
            this._toggleDropdown();
            return false;
        });
        if (this.settings.autocomplete) {
            // proxy some events to original <select>
            this.$container.find('.pf-input').on('keypress keyup keydown', (event) => {
                this.$original.trigger(event);
                this._triggerMyEvent('onInputKeyEvent', event, $(event.currentTarget));
            });
        }
        $('body').on('click pf-dropdown-click', () => {
            this.$container.find('.pf-dropdown-frame').css('display', 'none');
            this._triggerMyEvent('onClose', this.$original, this.$container);
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
     * @param {number} groupId
     * @returns {*}
     * @private
     */
    _renderItems(items, groupId = -1)
    {
        if (items.length > 0) {
            let $items = $([]);
            for (let item of items) {
                if (groupId < 0 || (groupId >= 0 && item.group == groupId)) {
                    let $item = this._renderItem(item);
                    if ($item instanceof $) {
                        $items = $items.add($item);
                    }
                }
            }
            return $items;
        }
        return null;
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
        if ($.isFunction(this.settings.renderIitem)) {
            $inner = this.settings.renderItem(item, this.settings);
        }
        if (!($inner instanceof $)) {
            $inner = $('<span class="default-item-template"></span>');
            $inner.html(item.title);
        }
        $item.html($inner);
        // callbacks: this.settings.onOverItem, this.settings.onLeaveItem, this.settings.onSelectItem
        $item.hover(
            (event) => {
                let $item = $(event.currentTarget),
                    data = this._getItemByValue($item.data('item_value'));
                this._triggerMyEvent('onOverItem', $item, data);
            },
            (event) => {
                let $item = $(event.currentTarget),
                    data = this._getItemByValue($item.data('item_value'));
                this._triggerMyEvent('onLeaveItem', $item, data);
            }
        );
        $item.on('click', (event) => {
            let item = this._getItemByValue($(event.currentTarget).data('item_value'));
            this._selectItem($(event.currentTarget), item);
            this._triggerMyEvent('onSelectItem', item);
            this._toggleDropdown(); // todo for multiple we don't need to close it
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
        let $group;
        if ($.isFunction(this.settings.renderGroup)) {
            $group = this.settings.renderGroup(group, $items, this.settings);
        }
        if (!($group instanceof $)) {
            $group = $(
                `<li class="pf-dropdown-group" data-group_id="${group.id}">
                        <span class="pf-group-item">${group.label}</span>
                    <ul class="pf-dropdown-group-items"></ul>
                </li>`
            );
            if ($items instanceof $) {
                $group.find('.pf-dropdown-group-items').html($items);
            }
        }
        return $group;
    }


    _toggleDropdown()
    {
        $('body').trigger('pf-dropdown-click');
        let $dropdown = this.$container.find('.pf-dropdown-frame');
        if ($dropdown.css('display') !== 'none') {
            $dropdown.css('display', 'none');
            this._triggerMyEvent('onClose', this.$original, this.$container);
        } else {
            if (this.$container.find('.pf-dropdown-item').length > 0) {
                $dropdown.css('display', '');
                this._triggerMyEvent('onOpen', this.$original, this.$container);
            }
        }
    }


    _selectItem($item, data)
    {
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
        // update original <select>
        this.$original.val(data.value).trigger('change');
    }


    /**
     * This method runs events only, it doesn't return any results
     * @param {string} eventName
     * @param {Array} data Mixed arguments
     * @private
     */
    _triggerMyEvent(eventName, ...data)
    {
        // check callbacks from widget settings
        if ($.isFunction(this.settings.callbacks[eventName])) {
            this.settings.callbacks[eventName].apply(this, data);
        }
        // check plugins
        if (this.settings.plugins.length > 0) {
            for (let plugin of this.settings.plugins) {
                if (typeof plugin === 'object' && $.isFunction(plugin[eventName])) {
                    plugin[eventName].apply(this, data);
                }
            }
        }
    }


    _loadItemsFromResponse(json)
    {

        return items;
    }



    // Public methods

    /**
     * @return {Object} {value: "123", title: "Numbers", data: {Object} }
     */
    getValue()
    {
        return this._getSelectedItem();
    }


    /**
     * @param {string} value
     */
    setValue(value)
    {
        let item = this._getItemByValue(value);
        if (item !== null) {
            let $item = this._renderItem(item);
            if ($item instanceof $) {
                this._selectItem($item, item);
                this._triggerMyEvent('onSelectItem', item);
            }
        }
    }

}


plugin('pfDropdown', pfDropdown);