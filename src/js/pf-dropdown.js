'use strict';
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
    isMultiple = false;

    settings = {
        containerClass: 'pf-dropdown',
        implementOriginalStyles: true,
        displaySelectionAs: 'text', // 'text', 'html'
        autocomplete: false,
        minLength: 2, // minimal term size
        closeOnSelect: true,
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
            onSelectItem: null, // (item, $original, $container) => { },
            onUnselectItem: null, // (item, $original, $container) => { },
            // onBeforeAddItem: null, // (item) => { return item or false; },
            // onAddItem: null, // ($item, item) => { },
            // onBeforeDeleteItem: null, //($item, item) => { return true of false; },
            // onDeleteItem: null, // (item) => { },
            onInputKeyEvent: null, // (event, $input) => { }
            // data preprocessors
            renderItem: null, // ($item, item, $original, $container, settings) => { return $item; },
            renderGroup: null, // ($group, group, $items, $original, $container, settings) => { return $group; },
            renderChoice: null, // ($view, items, $original, $container, settings) => { return $view; },
            ajaxDataBuilder: null, // (currentData, $original, $container, settings) => { return currentData; },
            ajaxResponseFilter: null, //(json, settings) => { return json; },
            newItemsFilter: null //(json, settings) => { return json; },
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
        this.isMultiple = this.$original.prop('multiple') ? true : false;
        // it cannot be multiple and autocomplete at same time, this is not dropdown behavior (tags)
        if (this.isMultiple)  this.settings.autocomplete = false;
        // load current options of original selector
        this._loadOriginalOptions();
        // render widget
        this._renderWidget(this.items, this.groups);
        this._renderChoice();
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
                    data = {},
                    dataset = $o.data('set'),
                    value = $o.attr('value') ? $o.attr('value') : '',
                    selected = $o.prop('selected') ? true : false;
                try {
                    data = (typeof(dataset) === 'string') ? $.parseJSON(dataset) : dataset;
                } catch (ex) {
                    console.warn('data-set contains wrong value:', dataset);
                }
                this.items.push({
                    index: this.items.length,
                    group: groupId,
                    value: value,
                    title: $o.text() ? $o.text() : '',
                    data: data ? data : {},
                    selected: selected
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
            // render new items list
            this._renderList(this.$container, this.items, this.groups);
            // open loaded items for autocomplete or display current choise
            if (this.settings.autocomplete === true) {
                if (this.$container.find('.pf-dropdown-item').length > 0) {
                    this.$container.find('.pf-dropdown-frame').css('display', '');
                    this._executeCallback('onOpen', this.$original, this.$container);
                }
            } else {
                this._renderChoice();
            }
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
                        this.items.push({
                            index: this.items.length,
                            group: groupId,
                            value: item[keys.valueKey],
                            title: item[keys.titleKey],
                            data: item[keys.dataKey],
                            selected: (typeof(item['selected']) !== undefined) ? item['selected'] : false
                        });
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

        // todo events

        return [this.items, this.groups]; // for testing only
    }


    _deleteAllItems()
    {
        this.items = [];
        this.groups = [];
        this.$original.html('');
        this.$container.find('.pf-dropdown-list').html('');
        this.$container.find('.pf-dropdown-frame').css('display', 'none');
    }


    /**
     * @returns {Array}
     * @private
     */
    _getSelectedItems()
    {
        let selectedValues = this.$original.val();
        selectedValues = (selectedValues === null) ? '' : selectedValues;
        if (!$.isArray(selectedValues)) {
            selectedValues = [selectedValues];
        }
        return this._getItemsByValues(selectedValues);
    }


    /**
     * Returns all Items data by its value
     * @param {string|array} values
     * @return {array}  [ item_object, ... ]
     * @private
     */
    _getItemsByValues(values)
    {
        let foundItems = [];
        if (!$.isArray(values))  values = [values];
        if (this.items.length > 0) {
            for (let value of values) {
                for (let item of this.items) {
                    if (item.value == value) {
                        foundItems.push(item);
                    }
                }
            }
        }
        return foundItems;
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
            if (this.settings.autocomplete === true) {
                // we need to have empty option on beginning to have empty value by default until user select some value from list
                $original.append(
                    $(groups.length > 0 ? '<optgroup label="---"><option value="">---</option></optgroup>' : '<option value="">---</option>')
                );
            }
            if (groups.length > 0) {
                // if there are groups
                for (let group of groups) {
                    let $optgroup = $('<optgroup></optgroup>').attr('label', group.label);
                    for (let item of items) {
                        $optgroup.append( $('<option></option>').attr('value', item.value)
                            .prop('selected', item.selected).html(item.title) );
                    }
                    $original.append($optgroup);
                }
            } else {
                // if there are no groups
                for (let item of items) {
                    $original.append( $('<option></option>')
                        .attr('value', item.value).prop('selected', item.selected).html(item.title) );
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
        this.$container.find('.pf-input-frame, .pf-input, .pf-arrow').on('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.settings.autocomplete === true) {
                let term = this.$input.val();
                this._deleteAllItems();
                if (term.length >= this.settings.minLength) {
                    this._loadRemoteItems();
                }
            }
            this._toggleDropdown();
            return false;
        });
        if (this.settings.autocomplete) {
            // I don't think that we really need array for this case
            this.$container.find('.pf-arrow').css('display', 'none');
            // proxy some events to original <select>
            this.$input.on('keypress keyup keydown', (event) => {
                let term = $(event.currentTarget).val();
                this.$original.trigger(event);
                this._executeCallback('onInputKeyEvent', event, $(event.currentTarget));
                if (event.type === 'keyup') {
                    this._deleteAllItems();
                    if (term.length >= this.settings.minLength) {
                        this._loadRemoteItems();
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
     * @param {Object} item Item {title: title, value: value, data: {}}
     * @param {bool} bindEvents
     * @private
     * @return {Object<jQueryElement>}
     */
    _renderItem(item, bindEvents = true)
    {
        item = item || false;
        if (!$.isPlainObject(item))  return false;
        if ([typeof(item.index), typeof(item.value), typeof(item.title)].includes('undfined'))  return false;
        let $itemOrig = $(this.itemTmpl).attr('data-item_value', item.value)
                .attr('data-index', item.index).html(item.title),
            $item = this._executeCallback('renderItem', $itemOrig.clone(), item, this.$original, this.$container, this.settings);
        if (!($item instanceof $) || !$item.hasClass('pf-dropdown-item') || !$item.data('item_value')) {
            $item = $itemOrig;
        }
        if (bindEvents) {
            if (item.selected) $item.addClass('selected');
            $item.hover(
                (event) => {
                    let $item = $(event.currentTarget),
                        items = this._getItemsByValues($item.data('item_value'));
                    if (items.length > 0) {
                        this._executeCallback('onOverItem', $item, items[0]);
                    }
                },
                (event) => {
                    let $item = $(event.currentTarget),
                        items = this._getItemsByValues($item.data('item_value'));
                    if (items.length > 0) {
                        this._executeCallback('onLeaveItem', $item, items[0]);
                    }
                }
            );
            $item.on('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                let $item = $(event.currentTarget),
                    items = this._getItemsByValues($item.data('item_value'));
                if (items.length > 0) {
                    if (this.isMultiple && items[0].selected) {
                        this._unselectItem(items[0]);
                    } else {
                        this._selectItem(items[0]);
                    }
                }
                if (this.settings.closeOnSelect === true) {
                    this._toggleDropdown();
                }
            });
        }
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


    _renderChoice()
    {
        let selected = this._getSelectedItems(),
            $frame = this.$container.find('.pf-decorated'),
            $view;
        if (this.settings.displaySelectionAs === 'html') {
            this.$input.val('');
            if (selected.length > 0) {
                if (selected.length > 1) {
                    $view = this._renderItem({index:'', value: '', title: selected.length + ' selected'}, false);
                } else {
                    $view = this._renderItem(selected[0], false);
                }
            } else {
                $view = this._renderItem({index:'', value: '', title: ''}, false);
            }
            $view = this._executeCallback('renderChoice', $view, selected, this.$original, this.$container, this.settings);
            $frame.html($view);
        } else {
            // text
            $frame.html('');
            this.$input.val('');
            if (selected.length > 0) {
                if (selected.length > 1) {
                    this.$input.val(selected.length + ' selected');
                } else {
                    this.$input.val(selected[0].title);
                }
            }
        }

    }


    _toggleDropdown()
    {
        let $dropdown = this.$container.find('.pf-dropdown-frame');
        if ($dropdown.css('display') !== 'none') {
            $dropdown.css('display', 'none');
            this._executeCallback('onClose', this.$original, this.$container);
        } else {
            $('body').trigger('pf-dropdown-click');
            if (this.$container.find('.pf-dropdown-item').length > 0) {
                $dropdown.css('display', '');
                this._executeCallback('onOpen', this.$original, this.$container);
            }
        }
    }


    _selectItem(item = null)
    {
        let selectedValues = [],
            value = "" + item.value;
        // update original <select>
        if (this.isMultiple) {
            selectedValues = this.$original.val() || [];
            selectedValues.push(value);
            this.$original.val(selectedValues);
        } else {
            selectedValues.push(value);
            this.$original.val(value);
        }
        this._refreshSelecteditems(selectedValues);
        this._executeCallback('onSelectItem', item, this.$original, this.$container);
    }


    _unselectItem(item = null)
    {
        let selectedValues = [],
            value = "" + item.value;
        // update original <select>
        if (this.isMultiple) {
            selectedValues = this.$original.val();
            selectedValues = selectedValues.filter(v => v !== value);
            this.$original.val(selectedValues);
        } else {
            this.$original.find('option:selected').prop('selected', false);
        }
        this._refreshSelecteditems(selectedValues);
        this._executeCallback('onUnselectItem', item, this.$original, this.$container);
    }


    _refreshSelecteditems(selectedValues)
    {
        // update items data
        $('.pf-dropdown-item', this.$container).removeClass('selected');
        for (let k in this.items) {
            this.items[k].selected = false;
            if (selectedValues.length > 0) {
                for (let v of selectedValues) {
                    if (this.items[k].value == v) {
                        this.items[k].selected = true;
                        $('.pf-dropdown-item[data-index="' + this.items[k].index + '"]', this.$container)
                            .addClass('selected');
                    }
                }
            }
        }
        this._renderChoice();
        this.$original.trigger('change');
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
     * @return {Object|array} {value: "123", title: "Numbers", group: "", data: {Object} } or array of objects like previous
     */
    getValue()
    {
        let values = [],
            selectedItems = this._getSelectedItems();
        for (let item of selectedItems) {
            values.push(item); // without keys, items only
        }
        return this.isMultiple ? values : values[0];
    }


    /**
     * @param {string|array} value
     */
    setValue(value)
    {
        let items = this._getItemsByValues(value);
        // update original <select>
        this.$original.val(value);
        for (let k in this.items) {
            this.items[k].selected = false;
            for (let item2 of items) {
                if (item2.index == this.items[k].index)  this.items[k].selected = true;
            }
        }
        this._renderChoice();
    }


    /**
     * @param {Object} json
     */
    setNewItems(json)
    {
        let data = this._executeCallback('newItemsFilter', json, this.settings);
        if (!Array.isArray(data) && !$.isPlainObject(data)) {
            data = json;
        }
        this._loadItemsFromResponse(data);
        // render new items list
        this._renderList(this.$container, this.items, this.groups);
        // open loaded items for autocomplete or display current choise
        if (this.settings.autocomplete === true) {
            if (this.$container.find('.pf-dropdown-item').length > 0) {
                this.$container.find('.pf-dropdown-frame').css('display', '');
                this._executeCallback('onOpen', this.$original, this.$container);
            }
        } else {
            this._refreshSelecteditems( this.$original.val() );
        }
    }
}


plugin('pfDropdown', pfDropdown);