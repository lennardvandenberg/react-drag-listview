webpackJsonp([0],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck2 = __webpack_require__(2);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(3);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(72);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(80);
	var ReactDOM = __webpack_require__(115);
	var ReactDragListView = __webpack_require__(261);
	var DragColumn = ReactDragListView.DragColumn;
	
	__webpack_require__(276);
	__webpack_require__(277);
	
	var Demo = function (_React$Component) {
	  (0, _inherits3.default)(Demo, _React$Component);
	
	  function Demo(props) {
	    (0, _classCallCheck3.default)(this, Demo);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));
	
	    var data = [];
	    for (var i = 1, len = 21; i < len; i++) {
	      data.push({
	        title: 'col' + i
	      });
	    }
	    _this.state = {
	      data: data
	    };
	    return _this;
	  }
	
	  Demo.prototype.render = function render() {
	    var that = this;
	    var dragProps = {
	      onDragEnd: function onDragEnd(fromIndex, toIndex) {
	        var data = that.state.data;
	        var item = data.splice(fromIndex, 1)[0];
	        data.splice(toIndex, 0, item);
	        that.setState({ data: data });
	      },
	
	      nodeSelector: 'li',
	      handleSelector: 'a'
	    };
	
	    return React.createElement(
	      'div',
	      { className: 'simple simple1 simple2' },
	      React.createElement(
	        'h2',
	        null,
	        'Dragging column'
	      ),
	      React.createElement(
	        'div',
	        { className: 'simple-inner' },
	        React.createElement(
	          DragColumn,
	          dragProps,
	          React.createElement(
	            'ol',
	            { style: { width: 70 * this.state.data.length } },
	            this.state.data.map(function (item, index) {
	              return React.createElement(
	                'li',
	                { key: index },
	                item.title,
	                React.createElement(
	                  'a',
	                  { href: '#' },
	                  'Drag'
	                )
	              );
	            })
	          )
	        )
	      )
	    );
	  };
	
	  return Demo;
	}(React.Component);
	
	ReactDOM.render(React.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 277:
276

});
//# sourceMappingURL=dragColumn.js.map