'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _FixedDataTableCellDefault = require('./FixedDataTableCellDefault');

var _FixedDataTableCellDefault2 = _interopRequireDefault(_FixedDataTableCellDefault);

var _FixedDataTableColumnReorderHandle = require('././FixedDataTableColumnReorderHandle');

var _FixedDataTableColumnReorderHandle2 = _interopRequireDefault(_FixedDataTableColumnReorderHandle);

var _FixedDataTableHelper = require('./FixedDataTableHelper');

var _FixedDataTableHelper2 = _interopRequireDefault(_FixedDataTableHelper);

var _React = require('./React');

var _React2 = _interopRequireDefault(_React);

var _cx = require('./cx');

var _cx2 = _interopRequireDefault(_cx);

var _joinClasses = require('./joinClasses');

var _joinClasses2 = _interopRequireDefault(_joinClasses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                              * Copyright Schrodinger, LLC
                                                                                                                                                                                                                              * All rights reserved.
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                              * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                              * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              * @providesModule FixedDataTableCell
                                                                                                                                                                                                                              * @typechecks
                                                                                                                                                                                                                              */

var DIR_SIGN = _FixedDataTableHelper2.default.DIR_SIGN;

var PropTypes = _React2.default.PropTypes;


var DEFAULT_PROPS = {
  align: 'left',
  highlighted: false
};

var FixedDataTableCell = _React2.default.createClass({
  displayName: 'FixedDataTableCell',


  /**
   * PropTypes are disabled in this component, because having them on slows
   * down the FixedDataTable hugely in DEV mode. You can enable them back for
   * development, but please don't commit this component with enabled propTypes.
   */
  propTypes_DISABLED_FOR_PERFORMANCE: {
    isScrolling: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    className: PropTypes.string,
    highlighted: PropTypes.bool,
    width: PropTypes.number.isRequired,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    height: PropTypes.number.isRequired,

    cell: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),

    columnKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * The row index that will be passed to `cellRenderer` to render.
     */
    rowIndex: PropTypes.number.isRequired,

    /**
     * Callback for when resizer knob (in FixedDataTableCell) is clicked
     * to initialize resizing. Please note this is only on the cells
     * in the header.
     * @param number combinedWidth
     * @param number left
     * @param number width
     * @param number minWidth
     * @param number maxWidth
     * @param number|string columnKey
     * @param object event
     */
    onColumnResize: PropTypes.func,
    onColumnReorder: PropTypes.func,

    /**
     * The left offset in pixels of the cell.
     */
    left: PropTypes.number,

    /**
     * Controls whether or not to render left border
     */
    borderLeft: PropTypes.bool
  },

  getInitialState: function getInitialState() {
    return {
      isReorderingThisColumn: false,
      displacement: 0,
      reorderingDisplacement: 0
    };
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return !nextProps.isScrolling || this.props.rowIndex !== nextProps.rowIndex;
  },
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    var left = props.left + this.state.displacement;

    var newState = {
      isReorderingThisColumn: false
    };

    if (props.isColumnReordering) {
      var originalLeft = props.columnReorderingData.originalLeft;
      var reorderCellLeft = originalLeft + props.columnReorderingData.dragDistance;
      var farthestPossiblePoint = props.columnGroupWidth - props.columnReorderingData.columnWidth;

      // ensure the cell isn't being dragged out of the column group
      reorderCellLeft = Math.max(reorderCellLeft, 0);
      reorderCellLeft = Math.min(reorderCellLeft, farthestPossiblePoint);

      if (props.columnKey === props.columnReorderingData.columnKey) {
        newState.displacement = reorderCellLeft - props.left;
        newState.isReorderingThisColumn = true;
      } else {
        var reorderCellRight = reorderCellLeft + props.columnReorderingData.columnWidth;
        var reorderCellCenter = reorderCellLeft + props.columnReorderingData.columnWidth / 2;
        var centerOfThisColumn = left + props.width / 2;

        var cellIsBeforeOneBeingDragged = reorderCellCenter > centerOfThisColumn;
        var cellWasOriginallyBeforeOneBeingDragged = originalLeft > props.left;
        var changedPosition = false;

        var dragPoint, thisCellPoint;
        if (cellIsBeforeOneBeingDragged) {
          if (reorderCellLeft < centerOfThisColumn) {
            changedPosition = true;
            if (cellWasOriginallyBeforeOneBeingDragged) {
              newState.displacement = props.columnReorderingData.columnWidth;
            } else {
              newState.displacement = 0;
            }
          }
        } else {
          if (reorderCellRight > centerOfThisColumn) {
            changedPosition = true;
            if (cellWasOriginallyBeforeOneBeingDragged) {
              newState.displacement = 0;
            } else {
              newState.displacement = props.columnReorderingData.columnWidth * -1;
            }
          }
        }

        if (changedPosition) {
          if (cellIsBeforeOneBeingDragged) {
            if (!props.columnReorderingData.columnAfter) {
              props.columnReorderingData.columnAfter = props.columnKey;
            }
          } else {
            props.columnReorderingData.columnBefore = props.columnKey;
          }
        } else if (cellIsBeforeOneBeingDragged) {
          props.columnReorderingData.columnBefore = props.columnKey;
        } else if (!props.columnReorderingData.columnAfter) {
          props.columnReorderingData.columnAfter = props.columnKey;
        }
      }
    } else {
      newState.displacement = 0;
    }

    this.setState(newState);
  },
  getDefaultProps: function getDefaultProps() /*object*/{
    return DEFAULT_PROPS;
  },
  render: function render() /*object*/{
    var _props = this.props,
        height = _props.height,
        width = _props.width,
        columnKey = _props.columnKey,
        props = _objectWithoutProperties(_props, ['height', 'width', 'columnKey']);

    var style = {
      height: height,
      width: width
    };

    if (DIR_SIGN === 1) {
      style.left = props.left;
    } else {
      style.right = props.left;
    }

    if (this.state.isReorderingThisColumn) {
      style.transform = 'translateX(' + this.state.displacement + 'px) translateZ(0)';
      style.zIndex = 1;
    }

    var className = (0, _joinClasses2.default)((0, _cx2.default)({
      'fixedDataTableCellLayout/main': true,
      'fixedDataTableCellLayout/lastChild': props.lastChild,
      'fixedDataTableCellLayout/borderLeft': props.borderLeft,
      'fixedDataTableCellLayout/alignRight': props.align === 'right',
      'fixedDataTableCellLayout/alignCenter': props.align === 'center',
      'public/fixedDataTableCell/alignRight': props.align === 'right',
      'public/fixedDataTableCell/highlighted': props.highlighted,
      'public/fixedDataTableCell/main': true,
      'public/fixedDataTableCell/hasReorderHandle': !!props.onColumnReorder,
      'public/fixedDataTableCell/reordering': this.state.isReorderingThisColumn
    }), props.className);

    var columnResizerComponent;
    if (props.onColumnResize) {
      var columnResizerStyle = {
        height: height
      };
      columnResizerComponent = _React2.default.createElement(
        'div',
        {
          className: (0, _cx2.default)('fixedDataTableCellLayout/columnResizerContainer'),
          style: columnResizerStyle,
          onMouseDown: this._onColumnResizerMouseDown },
        _React2.default.createElement('div', {
          className: (0, _joinClasses2.default)((0, _cx2.default)('fixedDataTableCellLayout/columnResizerKnob'), (0, _cx2.default)('public/fixedDataTableCell/columnResizerKnob')),
          style: columnResizerStyle
        })
      );
    }

    var columnReorderComponent;
    if (props.onColumnReorder) {
      //header row
      columnReorderComponent = _React2.default.createElement(_FixedDataTableColumnReorderHandle2.default, _extends({
        columnKey: this.columnKey,
        onMouseDown: this._onColumnReorderMouseDown,
        height: height
      }, this.props));
    }

    var cellProps = {
      columnKey: columnKey,
      height: height,
      width: width
    };

    if (props.rowIndex >= 0) {
      cellProps.rowIndex = props.rowIndex;
    }
    cellProps.parentStyle = style;

    var content;
    if (_React2.default.isValidElement(props.cell)) {
      content = _React2.default.cloneElement(props.cell, cellProps);
    } else if (typeof props.cell === 'function') {
      content = props.cell(cellProps);
    } else {
      content = _React2.default.createElement(
        _FixedDataTableCellDefault2.default,
        cellProps,
        props.cell
      );
    }

    return _React2.default.createElement(
      'div',
      { className: className, style: style },
      columnResizerComponent,
      columnReorderComponent,
      content
    );
  },
  _onColumnResizerMouseDown: function _onColumnResizerMouseDown( /*object*/event) {
    this.props.onColumnResize(this.props.left, this.props.width, this.props.minWidth, this.props.maxWidth, this.props.columnKey, event);
  },
  _onColumnReorderMouseDown: function _onColumnReorderMouseDown( /*object*/event) {
    this.props.onColumnReorder(this.props.columnKey, this.props.width, this.props.left, event);
  }
});

module.exports = FixedDataTableCell;