'use strict';
import $ from 'jquery';
import plugin from './plugin';

class pfDropdown {

    containerTmpl = `<div class="pf-input-frame">
            <ul class="pf-decorated" style="display:none"><li></li></ul>
            <input type="text" class="pf-input" value="" style="background-color: transparent"/>
            <a href="#" class="pf-arrow"><i></i></a>
        </div>
        <div class="pf-dropdown-frame" style="display:none">
            <ul class="pf-dropdown-list"></ul>
        </div>`;

    groupTmpl = `<li class="pf-dropdown-group" data-group_id="">
                <span class="pf-group-item"></span>
            <ul class="pf-dropdown-group-items"></ul>
        </li>`;

    itemTmpl = `<li class="pf-dropdown-item" data-item_value=""></li>`;

    $original = $([]);
    $container = $([]);
    $input = $([]);
    $ajax = null;
    groups = [];
    items = [];

    settings = {
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
        plugins: [  /* new PluginClass() */ ],
        callbacks: {
            //events
            onRendered: null, // ($original, $container) => { },
            onClose: null, // ($original, $container) => { },
            onOpen: null, // ($original, $container) => { },
            onOverItem: null, // ($item, item) => { },
            onLeaveItem: null, // ($item, item) => { },
            onSelectItem: null, // (item) => { },
            // onBeforeAddItem: null, // (item) => { return item or false; },
            // onAddItem: null, // ($item, item) => { },
            // onBeforeDeleteItem: null, //($item, item) => { return true of false; },
            // onDeleteItem: null, // (item) => { },
            onInputKeyEvent: null, // (event, $input) => { }
            // data preprocessors
            renderItem: null, // ($item, item, $original, $container, settings) => { return $item; },
            renderGroup: null, // ($group, group, $items, $original, $container, settings) => { return $group; },
            ajaxDataBuilder: null, // (currentData, $original, $container, settings) => { return currentData; },
            ajaxResponseFilter: null //(json, settings) => { return json; },
        }
    };


    constructor(element, options = {})
    {
        this.$original = $(element);
        // Default options
        let settings = $.extend({}, this.settings, options);
        settings.ajax = $.extend({}, this.settings.ajax, options.ajax);
        settings.callbacks = $.extend({}, this.settings.callbacks, options.callbacks);
        this.settings = settings;
        // load current options of original selector
        this._loadOriginalOptions();
        // render widget
        this._renderWidget(this.items, this.groups);
        // trigger event
        this._executeCallback('onRendered', this.$original, this.$container);
        // load remote data
        if ($.trim(this.settings.ajax.url) !== '' && this.settings.ajax.loadOnInit === true) {
            this._loadRemoteItems();
        }
    }


    _loadOriginalOptions()
    {
        let $groups = this.$original.find('optgroup');
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
                let groupId = this.groups.length + 1;
                this.groups.push({id: groupId, label: $(g).attr('label')});
                itemsLoopFn($(g).find('option'), groupId);
            });
        } else {
            itemsLoopFn(this.$original.find('option'), '');
        }
    }


    _loadRemoteItems()
    {
        let ajaxParam = this.settings.ajax,
            data = {};
        if (this.settings.autocomplete === true) {
            // get term
            data['term'] = this.$input.val();
        }
        if (this.$ajax !== null && this.$ajax.readyState !== 4) {
            this.$ajax.abort();
        }
        data = this._executeCallback('ajaxDataBuilder', data, this.$original, this.$container, this.settings);
        this.$ajax = $.ajax({
            url: ajaxParam.url,
            type: ajaxParam.type,
            dataType: 'json',
            data: data
        }).done((json) => {
            let data = this._executeCallback('ajaxResponseFilter', json, this.settings);
            if (!Array.isArray(data) && !$.isPlainObject(data)) {
                data = json;
            }
            this._loadItemsFromResponse(data);
        });
    }


    /**
     * @param {Array|Object} data
     * @return {Array}
     * @private
     */
    _loadItemsFromResponse(data)
    {
        this.items = [];
        this.groups = [];
        let keys = this.settings.ajax,
            addItemFn = (item, groupId = '') => {
                if ($.isPlainObject(item)) {
                    if (item[keys.dataKey] && item[keys.valueKey] && item[keys.titleKey]) {
                        this.items.push({group: groupId, value: item[keys.valueKey], title: item[keys.titleKey], data: item[keys.dataKey]});
                    } else {
                        console.warn('Item doesn\'t contain needed keys: ' + keys.titleKey + ', ' + keys.valueKey + ', ' + keys.dataKey, item);
                    }
                } else {
                    console.warn('Wrong item type', item);
                }
            };
        if (Array.isArray(data)) {
            // items only
            for (let item of data) {
                addItemFn(item);
            }
        } else if ($.isPlainObject(data)) {
            // items with groups
            $.each(data, (groupLabel, itemsList) => {
                if (Array.isArray(itemsList)) {
                    let groupId = this.groups.length + 1;
                    this.groups.push({id: groupId, label: groupLabel});
                    for (let item of itemsList) {
                        addItemFn(item, groupId);
                    }
                }
            });
        }
        // replace original options and rendering new items
        this._replaceOriginalOptions(this.$original, this.items, this.groups);
        // render new items list
        this._renderList(this.$container, this.items, this.groups);
        if (this.settings.autocomplete === true) {
            if (this.$container.find('.pf-dropdown-item').length > 0) {
                this.$container.find('.pf-dropdown-frame').css('display', '');
                this._executeCallback('onOpen', this.$original, this.$container);
            }
        }

        // todo events

        return [this.items, this.groups]; // for testing only
    }


    _deleteAllItems()
    {
        this.items = [];
        this.groups = [];
        this.$original.html('');
        if (this.$container.find('.pf-dropdown-item').length > 0) {
            this.$container.find('.pf-dropdown-frame').css('display', '');
        }
    }


    _getSelectedItem()
    {
        // todo what about multiple?
        let currentValue = this.$original.find('option:selected').attr('value');
        currentValue = currentValue || '';
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


    _implementOriginalStyles($original, $container)
    {
        const needed = ['background', 'backgroundColor', 'border', 'position', 'top', 'left', 'right', 'bottom', 'color',
            'cursor', 'font', 'height', 'lineHeight', 'margin', 'maxHeight', 'maxWidth', 'outline', /* 'padding', */
            'width', 'wordSpacing', 'wordWrap', 'zoom'];
        let originalStyles = typeof(document.defaultView) !== 'undefined' ? document.defaultView.getComputedStyle($original[0], null) : {};
        for (let key in originalStyles) {
            if (needed.includes(key)) {
                let value = originalStyles[key];
                if (['height', 'width'].includes(key) && value === 'auto') {
                    value = $original.css(key);
                }
                if (key === 'position' && value === 'static')  value = 'relative';
                if (key === 'border') {
                    if (value !== 'none') {
                        $container.find('.pf-input-frame').css(key, value)
                            .css('box-sizing', 'border-box');
                        $container.find('.pf-dropdown-frame').css(key, value)
                            .css('border-top', 'none').css('box-sizing', 'border-box');
                    }
                } else {
                    $container.css(key, value);
                    if (['width', 'height'].includes(key)) {
                        $container.find('.pf-input-frame').css(key, value);
                    }
                    if (key === 'color') {
                        $container.find('.pf-input').css(key, value);
                    }
                }
            }
        }
        return $container;
    }


    /**
     * @param {Object<jQuery>} $original <select>
     * @param {Array} items
     * @param {Array} groups
     * @return {Object<jQuery>}
     * @private
     */
    _replaceOriginalOptions($original, items = [], groups = [])
    {
        $original.html('');
        if (items.length > 0) {
            if (groups.length > 0) {
                // if there are groups
                for (let group of groups) {
                    let $optgroup = $('<optgroup></optgroup>').attr('label', group.label);
                    for (let item of items) {
                        $optgroup.append( $('<option></option>').attr('value', item.value).html(item.title) );
                    }
                    $original.append($optgroup);
                }
            } else {
                // if there are no groups
                for (let item of items) {
                    $original.append( $('<option></option>').attr('value', item.value).html(item.title) );
                }
            }
        }
    }


    /**
     * @param {Array} items
     * @param {Array} groups
     * @return {Object<jQuery>}
     * @private
     */
    _renderWidget(items, groups)
    {
        this.$container = this._renderContainer(this.$original, this.settings);
        this.$input = this.$container.find('.pf-input');
        this._renderList(this.$container, items, groups);
        // bind events
        this.$container.find('.pf-input-frame').on('click', (event) => {
            event.preventDefault();
            if (this.settings.autocomplete === true) {
                let term = this.$input.val();
                if (term.length >= this.settings.minLength) {
                    this._loadRemoteItems();
                } else {
                    this._deleteAllItems();
                }
            }
            this._toggleDropdown();
            return false;
        });
        this.$original.on('change', (event, byWho) => {
            byWho = byWho || '';
            if (byWho === 'by-widget-changed') return false;
            this.setValue($(event.currentTarget).val());
        });
        if (this.settings.autocomplete) {
            // proxy some events to original <select>
            this.$input.on('keypress keyup keydown', (event) => {
                let term = $(event.currentTarget).val();
                this.$original.trigger(event);
                this._executeCallback('onInputKeyEvent', event, $(event.currentTarget));
                if (event.type === 'keyup') {
                    if (term.length >= this.settings.minLength) {
                        this._loadRemoteItems();
                    } else {
                        this._deleteAllItems();
                    }
                }
            });
        }
        $('body').on('click pf-dropdown-click', (event) => {
            if (this.$container.find('.pf-dropdown-frame').css('display') !== 'none') {
                this.$container.find('.pf-dropdown-frame').css('display', 'none');
                this._executeCallback('onClose', this.$original, this.$container);
            }
        });
        return this.$container;
    }


    /**
     * @param {Object<jQuery>} $container
     * @param {Array} items
     * @param {Array} groups
     * @private
     */
    _renderList($container, items, groups)
    {
        let $listItems;
        if (groups.length > 0) {
            // if there are groups
            $listItems = $([]);
            for (let group of groups) {
                let $items = this._renderItems(items, group.id),
                    $group = this._renderGroup(group, $items);
                if ($group instanceof $)  $listItems = $listItems.add($group);
            }
        } else {
            // if there are no groups
            $listItems = this._renderItems(items);
        }
        $container.find('.pf-dropdown-list').html($listItems);
        // set current item
        if (this.settings.autocomplete !== true) {
            let item = this._getSelectedItem();
            if (item !== null) {
                let $item = this._renderItem(item);
                if ($item !== false) this._selectItem($item, item);
            }
        }
    }


    /**
     * @private
     */
    _renderContainer($original, settings)
    {
        $original.css('display', 'none');
        let $container = $('<div>')
            .addClass(settings.containerClass).append($(this.containerTmpl));
        // clone general styles from original <select>
        if (settings.useOriginalStyles === true) {
            $container = this._implementOriginalStyles($original, $container);
        }
        // if no autocomplete, then disable the input
        if (!settings.autocomplete === true)  $container.find('.pf-input').prop('readonly', true);
        // selected item view type
        if (settings.displaySelectionAs === 'html')  $container.find('.pf-decorated').css('display', '');
        $container.insertBefore(this.$original);
        $container.append(this.$original);
        return $container;
    }


    /**
     * @param {array} items
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
        let $itemOrig = $(this.itemTmpl).attr('data-item_value', item.value).html(item.title),
            $item = this._executeCallback('renderItem', $itemOrig.clone(), item, this.$original, this.$container, this.settings);
        if (!($item instanceof $) || !$item.hasClass('pf-dropdown-item') || !$item.data('item_value')) {
            $item = $itemOrig;
        }
        $item.hover(
            (event) => {
                let $item = $(event.currentTarget),
                    data = this._getItemByValue($item.data('item_value'));
                this._executeCallback('onOverItem', $item, data);
            },
            (event) => {
                let $item = $(event.currentTarget),
                    data = this._getItemByValue($item.data('item_value'));
                this._executeCallback('onLeaveItem', $item, data);
            }
        );
        $item.on('click', (event) => {
            let item = this._getItemByValue($(event.currentTarget).data('item_value'));
            this._selectItem($(event.currentTarget), item);
            this._executeCallback('onSelectItem', item);
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
        let $groupOrig = $(this.groupTmpl).attr('data-group_id', group.id);
        $groupOrig.find('.pf-group-item').html(group.label);
        if ($items instanceof $) {
            $groupOrig.find('.pf-dropdown-group-items').html($items);
        }
        let $group = this._executeCallback('renderGroup', $groupOrig.clone(true), group, $items,
            this.$original, this.$container, this.settings);
        if (!($group instanceof $)) {
            $group = $groupOrig;
        }
        return $group;
    }


    _toggleDropdown()
    {
        $('body').trigger('pf-dropdown-click');
        let $dropdown = this.$container.find('.pf-dropdown-frame');
        if ($dropdown.css('display') !== 'none') {
            $dropdown.css('display', 'none');
            this._executeCallback('onClose', this.$original, this.$container);
        } else {
            if (this.$container.find('.pf-dropdown-item').length > 0) {
                $dropdown.css('display', '');
                this._executeCallback('onOpen', this.$original, this.$container);
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
        this.$original.val(data.value).trigger('change', ['by-widget-changed']);
    }


    /**
     * Executes events  data/object preprocessors
     * @param {string} cbName Callback name
     * @param {*} args First element is data for preprocessor
     * @returns {*}
     * @private
     */
    _executeCallback(cbName, ...args)
    {
        let isEvent = (cbName.substring(0, 2) === 'on') ? true : false;
        // check callbacks from widget settings
        if ($.isFunction(this.settings.callbacks[cbName])) {
            if (isEvent) {
                this.settings.callbacks[cbName].apply(this, args);
            } else {
                args[0] = this.settings.callbacks[cbName].apply(this, args);
            }
        }
        // check plugins
        if (this.settings.plugins.length > 0) {
            for (let plugin of this.settings.plugins) {
                if (typeof plugin === 'object' && $.isFunction(plugin[cbName])) {
                    if (isEvent) {
                        plugin[cbName].apply(plugin, args);
                    } else {
                        args[0] = plugin[cbName].apply(plugin, args);
                    }
                }
            }
        }
        return args[0];
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
                this._executeCallback('onSelectItem', item);
            }
        }
    }

}


plugin('pfDropdown', pfDropdown);