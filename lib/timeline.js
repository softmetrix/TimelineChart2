/*!
 * TimelineChart v0.1.4 (http://softmetrixgroup.com/timeline)
 * Licensed under the MIT license
 */
var TimelineChart = (function () {
    var _data = [];
    var _classes = null;
    var _containerSelector = null;
    var _minDate = null;
    var _maxDate = null;
    var _config = {
        showToday: false,
        showTooltips: true,
        showLabels: false,
        legendSelector: false
    };

    function _setData (data) {
        _data = data;
        _getDateBoundaries();
    }

    function _setConfig (config) {
        Object.keys(config).forEach(function (key, index) {
            _config[key] = config[key];
        });
    }

    function _getDateBoundaries () {
        _maxDate = new Date('1970-01-01');
        _minDate = new Date('2038-01-19');
        for (i = 0; i < _data.length; i++) {
            for (j = 0; j < _data[i].single.length; j++) {
                var curDate = new Date(_data[i].single[j].date);
                if (curDate < _minDate) {
                    _minDate = curDate;
                }
                if (curDate > _maxDate) {
                    _maxDate = curDate;
                }
            }
            for (j = 0; j < _data[i].range.length; j++) {
                var curDate = new Date(_data[i].range[j].start);
                if (curDate < _minDate) {
                    _minDate = curDate;
                }
                if (curDate > _maxDate) {
                    _maxDate = curDate;
                }
                curDate = new Date(_data[i].range[j].end);
                if (curDate < _minDate) {
                    _minDate = curDate;
                }
                if (curDate > _maxDate) {
                    _maxDate = curDate;
                }
            }
        }
        _maxDate = new Date(_maxDate.getUTCFullYear() + '-12-31');
        _minDate = new Date(_minDate.getUTCFullYear() + '-01-01');
    }

    function _createLayout () {
        var html = '<div class="row no-gutter">';
        html += '<div class="col-xs-2"></div>';
        html += '<div class="col-xs-10 timeline-container-header"></div>';
        html += '</div>';
        $(_containerSelector).append(html);
    }

    function _createHeader () {
        var startYear = _minDate.getUTCFullYear();
        var endYear = _maxDate.getUTCFullYear();
        var containeWidth = $(_containerSelector + ' .timeline-container-header').width();
        var yearWidth = containeWidth / (endYear - startYear + 1);
        var quarterWidth = yearWidth / 4;
        var monthWidth = yearWidth / 12;
        var html = '<table class="timeline-header">';
        html += '<tr>';
        for (i = startYear; i <= endYear; i++) {
            html += '<td width="' + yearWidth + '" colspan="12">' + i + '</td>';
        }
        html += '</tr>';
        html += '<tr>';
        if (quarterWidth >= 50) {
            for (i = startYear; i <= endYear; i++) {
                var startQuarter = 1;
                var endQuarter = 4;
                for (j = startQuarter; j <= endQuarter; j++) {
                    html += '<td width="' + quarterWidth + '" colspan="3">Q' + j + '</td>';
                }
            }
            html += '</tr>';
        }
        if (quarterWidth >= 50 && monthWidth >= 30) {
            html += '<tr>';
            for (i = startYear; i <= endYear; i++) {
                var startMonth = 1;
                var endMonth = 12;
                for (j = startMonth; j <= endMonth; j++) {
                    html += '<td width="' + monthWidth + '">' + j + '</td>';
                }
            }
            html += '</tr>';
            html += '</table>';
        }
        $(_containerSelector + ' .timeline-container-header').append(html);
    }

    function _createSwimlanes () {
        for (i = 0; i < _data.length; i++) {
            var html = '<div class="row no-gutter swimlane-row" id="swimlane_' + i + '">';
            html += '<div class="col-xs-2 swimlane-title" style="background-color: ' + _data[i].color + ';height:' +
                _data[i].height + 'px">';
            html += _data[i].title;
            html += '</div>';
            html += '<div class="col-xs-10 swimlane-content" style="height:' + _data[i].height + 'px">';
            html += '</div>';
            html += '</div>';
            $(_containerSelector).append(html);
        }
    }

    function _populateSwimlanes () {
        var minDateTs = _getTimestamp(_minDate);
        var maxDateTs = _getTimestamp(_maxDate);
        for (i = 0; i < _data.length; i++) {
            var swimlane = $('#swimlane_' + i + ' .swimlane-content');
            var swimlaneWidth = swimlane.width();
            var swimlaneHeight = swimlane.height();
            var top = Math.round(_data[i].height / 2);
            for (j = 0; j < _data[i].single.length; j++) {
                var cls = _classes[_data[i].single[j].class];
                top += 30;
                if (top > _data[i].height - cls.height) {
                    top = Math.round(_data[i].height / 2);
                }
                var curDate = new Date(_data[i].single[j].date);
                var curDateTs = _getTimestamp(curDate);
                var positionPercent = (curDateTs - minDateTs) / (maxDateTs - minDateTs);
                var positionPixel = Math.round(swimlaneWidth * positionPercent);
                if (cls.class) {
                    var html = '<div class="swimlane-item swimlane-item-single swimlane-item-class-' +
                        _data[i].single[j].class + ' ' + cls.class + '" \
                           style="left:' + positionPixel + 'px; \
                                  top:' + top + 'px;">';
                    html += '</div>';
                    html = $(html);
                    html.css('font-size', cls.width + 'px');
                } else {
                    var html = '<div class="swimlane-item swimlane-item-single swimlane-item-class-' +
                        _data[i].single[j].class + '" \
                           style="left:' + positionPixel + 'px; \
                                  top:' + top + 'px;">';
                    html += '</div>';
                    html = $(html);
                    html.css('width', cls.width + 'px');
                    html.css('height', cls.height + 'px');
                    html.css('background-image', 'url(\'' + cls.image + '\')');
                    html.css('background-size', 'contain');
                }

                html.attr('data-toggle', 'tooltip');
                html.attr('data-placement', 'top');
                var title = _data[i].single[j].title + ' (' + _data[i].single[j].date + ')';
                if (_data[i].single[j].tooltip) {
                    title = _data[i].single[j].tooltip;
                }
                html.attr('title', title);
                html.attr('label', _data[i].single[j].title);
                html.attr('data-date', _data[i].single[j].date);
                if (_data[i].single[j].id) {
                    var id = _data[i].single[j].id;
                } else {
                    var id = i + '_' + j;
                }
                html.attr('id', 'tlc_item_sng_' + id);
                swimlane.append(html);
            }
            top = 0;
            for (j = 0; j < _data[i].range.length; j++) {
                top += 30;
                if (top > _data[i].height / 2) {
                    top = 0;
                }
                var curStartDate = new Date(_data[i].range[j].start);
                var curEndDate = new Date(_data[i].range[j].end);
                var curStartDateTs = _getTimestamp(curStartDate);
                var curEndDateTs = _getTimestamp(curEndDate);
                var positionPercentStart = (curStartDateTs - minDateTs) / (maxDateTs - minDateTs);
                var positionPercentEnd = (curEndDateTs - minDateTs) / (maxDateTs - minDateTs);
                var positionPixelStart = Math.round(swimlaneWidth * positionPercentStart);
                var positionPixelEnd = Math.round(swimlaneWidth * positionPercentEnd);
                var width = positionPixelEnd - positionPixelStart;
                var cls = _classes[_data[i].range[j].class];
                var title = _data[i].range[j].task + ' (' + _data[i].range[j].start + ' - ' + _data[i].range[j].end;
                if (_data[i].range[j].tooltip) {
                    title = _data[i].range[j].tooltip;
                }
                if (_data[i].range[j].id) {
                    var id = _data[i].range[j].id;
                } else {
                    var id = i + '_' + j;
                }
                var html = '<div class="swimlane-item swimlane-item-range swimlane-item-class-' +
                    _data[i].range[j].class + '" \
                           id="tlc_item_rng_' + id + '" \
                           style="left:' + positionPixelStart + 'px; \
                                  width:' + width + 'px; \
                                  top:' + top + 'px; \
                                  height:' + cls.patternHeight + 'px;"\
                           data-toggle="tooltip" \
                           data-placement="top" \
                           data-start-date=' + _data[i].range[j].start + ' \
                           data-end-date=' + _data[i].range[j].end + ' \
                           data-class=' + _data[i].range[j].class + ' \
                           title="' + title + '" \
                           label="' + _data[i].range[j].task + '">';
                html += '</div>';
                swimlane.append(html);
                var hideTail = cls.hideTail ? true : false;
                var hideHead = cls.hideHead ? true : false;
                SFMX.arrow('#tlc_item_rng_' + id, cls.color, width, cls.height, hideTail, hideHead);
            }
        }
        $(function () {
            var startPosition = null;
            $('.swimlane-item').draggable({
                start: function (e, ui) {
                    startPosition = $(e.target).position();
                },
                stop: function (e, ui) {
                    var stopPosition = $(e.target).position();
                    $(e.target).css('left', startPosition.left);
                    var swimlaneHeight = $(e.target).closest('.swimlane-content').height();
                    var itemHeight = $(e.target).height();
                    if (stopPosition.top < 0) {
                        $(e.target).css('top', 0);
                    }
                    if (stopPosition.top > swimlaneHeight - itemHeight) {
                        $(e.target).css('top', swimlaneHeight - itemHeight);
                    }
                }
            });
        });
    }

    function _updateSwimlaneItems () {
        var minDateTs = _getTimestamp(_minDate);
        var maxDateTs = _getTimestamp(_maxDate);
        $('.swimlane-item').each(function () {
            var swimlane = $(this).closest('.swimlane-content');
            var swimlaneWidth = swimlane.width();
            if ($(this).hasClass('swimlane-item-single')) {
                var curDate = new Date($(this).data('date'));
                var curDateTs = _getTimestamp(curDate);
                var positionPercent = (curDateTs - minDateTs) / (maxDateTs - minDateTs);
                var positionPixel = Math.round(swimlaneWidth * positionPercent);
                $(this).css('left', positionPixel);
            } else {
                var curStartDate = new Date($(this).data('start-date'));
                var curEndDate = new Date($(this).data('end-date'));
                var curStartDateTs = _getTimestamp(curStartDate);
                var curEndDateTs = _getTimestamp(curEndDate);
                var positionPercentStart = (curStartDateTs - minDateTs) / (maxDateTs - minDateTs);
                var positionPercentEnd = (curEndDateTs - minDateTs) / (maxDateTs - minDateTs);
                var positionPixelStart = Math.round(swimlaneWidth * positionPercentStart);
                var positionPixelEnd = Math.round(swimlaneWidth * positionPercentEnd);
                var width = positionPixelEnd - positionPixelStart;
                $(this).css('left', positionPixelStart);
                $(this).css('width', width);
                var cls = _classes[$(this).data('class')];
                var hideTail = cls.hideTail ? true : false;
                var hideHead = cls.hideHead ? true : false;
                var label = $(this).find('.swimlane-item-label');
                SFMX.arrow('#' + $(this).attr('id'), cls.color, width, cls.height, hideTail, hideHead);
                if (label) {
                    $(this).append(label);
                }
            }
        });
    }

    function _createRenameModal () {
        var html = '<div class="modal fade rename-label" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
                  <div class="modal-dialog" role="document"> \
                    <div class="modal-content"> \
                      <div class="modal-header"> \
                        <h5 class="modal-title">Rename label</h5> \
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"> \
                          <span aria-hidden="true">&times;</span> \
                        </button> \
                      </div> \
                      <div class="modal-body"> \
                      <input type="text" class="form-control label-text" /> \
                      </div> \
                      <div class="modal-footer"> \
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> \
                        <button type="button" class="btn btn-primary save-changes">Save changes</button> \
                      </div> \
                    </div> \
                  </div> \
                </div>';
        $(_containerSelector).append(html);
    }

    function _showToday () {
        var today = '<div class="today"></div>';
        today = $(today);
        var todayHeight = 0;
        document.querySelectorAll('.swimlane-content').forEach(function (item) {
            todayHeight += item.offsetHeight;
        });
        today.css('height', todayHeight + 'px');
        today.css('top', $('.timeline-container-header').height() + 'px');
        var minDateTs = _getTimestamp(_minDate);
        var maxDateTs = _getTimestamp(_maxDate);
        var todayTs = _getTimestamp(new Date());
        var swimlaneWidth = $('.swimlane-content').width();
        var swimlaneTitleWidth = $('.swimlane-title').outerWidth();
        var positionPercent = (todayTs - minDateTs) / (maxDateTs - minDateTs);
        var positionPixel = Math.round(swimlaneWidth * positionPercent) + swimlaneTitleWidth;
        today.css('left', positionPixel + 'px');
        $(_containerSelector).css('position', 'relative');
        $(_containerSelector).append(today);
    }

    function _initSwimlanes () {
        $('.swimlane-row').resizable({
            handles: 's',
            resize: function (event, ui) {
                $(event.target).find('.swimlane-title').height($(event.target).height());
                $(event.target).find('.swimlane-content').height($(event.target).height());
                $('.swimlane-item').each(function () {
                    var position = $(this).position();
                    var swimlaneHeight = $(this).closest('.swimlane-content').height();
                    var itemHeight = $(this).height();
                    if (position.top < 0) {
                        $(this).css('top', 0);
                    }
                    if (position.top > swimlaneHeight - itemHeight) {
                        $(this).css('top', swimlaneHeight - itemHeight);
                    }
                    var todayHeight = 0;
                    var today = $('.today');
                    $('.swimlane-content').each(function () {
                        todayHeight += $(this).outerHeight();
                    });
                    today.css('height', todayHeight + 'px');
                });
            }
        });
    }

    function _initTooltips () {
        $('[data-toggle="tooltip"]').tooltip();
    }

    function _initLabels () {
        $('.swimlane-item').each(function () {
            var html = '<div class="swimlane-item-label">';
            html += $(this).attr('label');
            html += '</div>';
            $(this).append(html);
        });
        $('.swimlane-item-single .swimlane-item-label').each(function () {
            var labelWidth = $(this).width();
            var itemWidth = $(this).closest('.swimlane-item').width();
            var labelHeight = $(this).height();
            var itemHeight = $(this).closest('.swimlane-item').height();
            $(this).css('left', (itemWidth + 5) + 'px');
            $(this).css('top', parseInt((itemHeight - labelHeight) / 2, 10) + 'px');
        });
        $('.swimlane-item-range .swimlane-item-label').each(function () {
            var labelWidth = $(this).width();
            var itemWidth = $(this).closest('.swimlane-item').width();
            var labelHeight = $(this).height();
            var itemHeight = $(this).closest('.swimlane-item').height();
            if (labelWidth > (itemWidth - 20)) {
                $(this).css('left', (itemWidth + 5) + 'px');
            } else {
                $(this).css('left', '10px');
                $(this).css('right', '10px');
            }
            $(this).css('top', parseInt((itemHeight - labelHeight) / 2, 10) + 'px');
        });
    }

    function _createLegend () {
        var classesCount = 0;
        Object.keys(_classes).forEach(function (key, index) {
            if (!_classes[key].parentClass) {
                classesCount++;
            }
        });
        var columnWidth = Math.ceil(12 / (Math.ceil(classesCount / 5)));
        var html = '<div class=\'timeline-legend\'>';
        html += '<div class=\'row\'>';
        html += '<div class=\'col-xs-' + columnWidth + '\'>';
        Object.keys(_classes).forEach(function (key, index) {
            if (index != 0 && index % 5 == 0) {
                html += '</div>';
                html += '<div class=\'col-xs-' + columnWidth + '\'>';
            }
            html += '<div class=\'timeline-legend-item\' data-class=\'' + key + '\'>';
            if (!_classes[key].parentClass) {
                if (_classes[key].class) {
                    html += '<div class=\'timeline-legend-image\'> \
            <i class=\'' + _classes[key].class + '\' style=\'font-size: 15px\'></i> \
            </div>';
                } else {
                    if (_classes[key].image) {
                        html += '<div class=\'timeline-legend-image\'> \
                <img src=\'' + _classes[key].image + '\' style=\'width: 15px; margin: 0 auto; display: inline-block;\' /> \
                </div>';
                    } else {
                        html += '<div class=\'timeline-legend-image\'> \
                <i class=\'sfmx-triangle-right\' style=\'font-size: 15px; color: ' + _classes[key].color + '\'></i> \
                </div>';
                    }
                }
                html += '<div class=\'timeline-legend-title\'>' + (_classes[key].title ? _classes[key].title : key) +
                    '</div>';
                html += '</div>';
            }
        });
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $(_config.legendSelector).html(html);
        $('.timeline-legend-item').click(function () {
            var cls = $(this).data('class');
            $('.swimlane-item-class-' + cls).toggle();
            Object.keys(_classes).forEach(function (key, index) {
                if (_classes[key].parentClass && _classes[key].parentClass == cls) {
                    $('.swimlane-item-class-' + key).toggle();
                }
            });
            $(this).toggleClass('timeline-disabled');
        });
    }

    function _initContextMenu () {
        $.contextMenu({
            selector: '.swimlane-item',
            callback: function (key, options) {
                switch (key) {
                    case 'delete':
                        options.$trigger.fadeOut('slow');
                        break;
                    case 'detach':
                        options.$trigger.closest('.swimlane-item').find('.swimlane-item-label').draggable();
                        options.$trigger.closest('.swimlane-item').addClass('label-detached');
                        break;
                    case 'attach':
                        options.$trigger.closest('.swimlane-item').find('.swimlane-item-label').draggable('destroy');
                        options.$trigger.closest('.swimlane-item').removeClass('label-detached');
                        break;
                    case 'rename':
                        var item = options.$trigger.closest('.swimlane-item');
                        item.addClass('label-changed');
                        var label = item.find('.swimlane-item-label');
                        $(_containerSelector + ' .rename-label').modal('show');
                        $(_containerSelector + ' .label-text').val(label.html());
                        $(_containerSelector + ' .save-changes').one('click', function () {
                            label.html($(_containerSelector + ' .label-text').val());
                            $(_containerSelector + ' .rename-label').modal('hide');
                        });
                        break;
                }
            },
            items: {
                'delete': {
                    name: 'Delete',
                    icon: 'fas fa-trash'
                }
                , 'detach': {
                    name: 'Detach label',
                    icon: 'fas fa-tag',
                    visible: function (key, opt) {
                        if (opt.$trigger.hasClass('label-detached')) {
                            return false;
                        }
                        return true;
                    }
                }
                , 'attach': {
                    name: 'Attach label',
                    icon: 'fas fa-tag',
                    visible: function (key, opt) {
                        if (!opt.$trigger.hasClass('label-detached')) {
                            return false;
                        }
                        return true;
                    }
                }
                , 'rename': {
                    name: 'Rename label',
                    icon: 'fas fa-edit'
                }
            }
        });
    }

    function _initContainerResize () {
        $(window).resize(function () {
            var fontSize = $('.timeline-header td').css('font-size');
            $(_containerSelector + ' .timeline-container-header').html('');
            _createHeader();
            $(_containerSelector + ' .today').remove();
            $('.timeline-header td').css('font-size', fontSize);
            _showToday();
            _updateSwimlaneItems();
        });
    }

    function _getTimestamp (date) {
        return Math.round(date.getTime() / 1000);
    }

    function _render () {
        _createLayout();
        _createHeader();
        _createSwimlanes();
        _populateSwimlanes();
        _initSwimlanes();
        _showToday();
        if (_config.showTooltips) {
            _initTooltips();
        }
        _initLabels();
        if (!_config.showLabels) {
            hideLabels();
        }
        if (_config.legendSelector) {
            _createLegend();
        }
        _createRenameModal();
        _initContextMenu();
        _initContainerResize();
    }

    function regenerateToday () {
        $(_containerSelector + ' .today').remove();
        _showToday();
    }

    function showLabels () {
        $('.swimlane-item-label').show();
    }

    function hideLabels () {
        $('.swimlane-item-label').hide();
    }

    function createChart (data, containerSelector, classes, config = {}) {
        _containerSelector = containerSelector;
        _classes = classes;
        _setConfig(config);
        _setData(data);
        _render();
        return this;
    }

    function exportState () {
        var state = {};
        state.swimlanes = [];
        state.items = [];
        $(_containerSelector + ' .swimlane-row').each(function () {
            state.swimlanes.push({
                id: $(this).attr('id'),
                height: $(this).height()
            });
        });
        $(_containerSelector + ' .swimlane-item').each(function () {
            state.items.push({
                id: $(this).attr('id'),
                top: $(this).css('top'),
                labelTop: $(this).find('.swimlane-item-label').css('top'),
                labelLeft: $(this).find('.swimlane-item-label').css('left'),
                labelText: $(this).hasClass('label-changed') ? $(this).find('.swimlane-item-label').html() : null
            });
        });
        return state;
    }

    function importState (state) {
        state.swimlanes.forEach(function (element) {
            var item = $('#' + element.id);
            if (item.length) {
                item.height(element.height);
                item.find('.swimlane-title').height(element.height);
                item.find('.swimlane-content').height(element.height);
            }
        });
        state.items.forEach(function (element) {
            var item = $('#' + element.id);
            if (item.length) {
                var label = item.find('.swimlane-item-label');
                item.css('top', element.top);
                label.css('top', element.labelTop);
                label.css('left', element.labelLeft);
                if (element.labelText) {
                    label.html(element.labelText);
                }
            }
        });
        var todayHeight = 0;
        var today = $('.today');
        $('.swimlane-content').each(function () {
            todayHeight += $(this).outerHeight();
        });
        today.css('height', todayHeight + 'px');
    }

    return {
        createChart: createChart,
        showLabels: showLabels,
        hideLabels: hideLabels,
        exportState: exportState,
        importState: importState,
        regenerateToday: regenerateToday
    };
}());