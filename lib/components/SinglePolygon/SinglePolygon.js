'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getQuadrantAdjustmentStyle = function getQuadrantAdjustmentStyle(x, y, canvasSize, color) {
    if (x > 0 && y > 0) {
        return { left: x + canvasSize, top: canvasSize + y, color: color };
    } else if (x > 0 && y < 0) {
        return { left: x + canvasSize, bottom: -y + canvasSize, color: color };
    } else if (x < 0 && y > 0) {
        return { right: -x + canvasSize, top: canvasSize + y, color: color };
    } else if (x < 0 && y < 0) {
        return { right: -x + canvasSize, bottom: -y + canvasSize, color: color };
    } else if (x > 0 && y === 0) {
        return { left: canvasSize + x, top: canvasSize + y, color: color };
    } else {
        return { left: x, top: y, color: color };
    }
};

var SinglePolygon = function (_Component) {
    _inherits(SinglePolygon, _Component);

    function SinglePolygon(props) {
        _classCallCheck(this, SinglePolygon);

        var _this = _possibleConstructorReturn(this, (SinglePolygon.__proto__ || Object.getPrototypeOf(SinglePolygon)).call(this, props));

        _this.drawShape = _this.drawShape.bind(_this);
        _this.drawPolygon = _this.drawPolygon.bind(_this);
        _this.drawRatings = _this.drawRatings.bind(_this);
        _this.state = {
            cornerMap: [],
            ratingArray: _this.props.ratingArray,
            drawingDefaults: {
                polygonSides: 5,
                width: 300,
                colorOverlay: "#2ECC71",
                colorStroke: "#E8E5DF",
                ratingLimit: 5
            }
        };
        return _this;
    }

    _createClass(SinglePolygon, [{
        key: 'drawPolygon',
        value: function drawPolygon(context, polyAngle, radius, polygonSides, colorStroke, canvasSize) {
            var cornerMap = [];
            context.beginPath();
            // context.arc(0, 0, 1, 0, 2 * Math.PI);
            context.stroke();
            var previous = { x: radius, y: 0 };
            for (var n = 0; n < polygonSides; n++) {
                var xCoord = radius * Math.cos(polyAngle * n);
                var yCoord = radius * Math.sin(polyAngle * n);
                cornerMap.push(getQuadrantAdjustmentStyle(xCoord, yCoord, canvasSize / 2));
                context.beginPath();
                var _previous = previous,
                    x = _previous.x,
                    y = _previous.y;

                previous = { x: xCoord, y: yCoord };
                context.moveTo(x, y);
                context.lineTo(xCoord, yCoord);
                context.stroke();
            }
            context.beginPath();
            context.moveTo(previous.x, previous.y);
            context.lineTo(radius, 0);
            context.stroke();
            return cornerMap;
        }
    }, {
        key: 'drawRatings',
        value: function drawRatings(context, ratingsArr, radIncr, polyAngle, fillStyle, opacityVal) {
            context.globalAlpha = opacityVal;
            context.beginPath();
            for (var n = 0; n < ratingsArr.length; n++) {
                if (ratingsArr[n].rating > this.state.drawingDefaults.ratingLimit) {
                    console.error('Rating cannot be greater than ' + this.props.polygonStyles.ratingLimit);
                    return;
                }
                var calculatedRad = ratingsArr[n].rating * radIncr;
                context.lineTo(calculatedRad * Math.cos(polyAngle * n), calculatedRad * Math.sin(polyAngle * n));
            }
            context.closePath();
            context.fillStyle = fillStyle;
            context.fill();
        }
    }, {
        key: 'drawShape',
        value: function drawShape(canvas, ratingArray) {
            var drawingDefaults = this.state.drawingDefaults;
            var polygonStyles = this.props.polygonStyles;

            var drawingStyles = _extends({}, drawingDefaults, polygonStyles);
            this.setState({ drawingDefaults: drawingStyles });

            if (ratingArray.length !== drawingStyles.polygonSides) {
                console.error('Ratings array and number of polygon sides should be equal');
                return;
            }
            var context = canvas.getContext('2d');
            var polyAngle = Math.PI * 2 / drawingStyles.polygonSides;
            var radius = (drawingStyles.width - 100) / 2;
            context.translate(canvas.width / 2, canvas.height / 2);
            // context.rotate(-Math.PI / 2);
            this.drawRatings(context, ratingArray, radius / drawingStyles.ratingLimit, polyAngle, drawingStyles.colorOverlay);
            return this.drawPolygon(context, polyAngle, radius, drawingStyles.polygonSides, drawingStyles.strokeStyle, canvas.width);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var canvasElm = document.getElementById(this.props.canvasId);
            var _props = this.props,
                ratingArray = _props.ratingArray,
                polygonStyles = _props.polygonStyles;

            canvasElm.getContext("2d").clearRect(0, 0, polygonStyles.width, polygonStyles.width);
            var cornerMap = this.drawShape(canvasElm, ratingArray, polygonStyles);
            this.setState({ cornerMap: cornerMap });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            this.setState({ ratingArray: newProps.ratingArray });
            var canvasElm = document.getElementById(this.props.canvasId);
            var ratingArray = newProps.ratingArray,
                polygonStyles = newProps.polygonStyles;

            canvasElm.getContext("2d").clearRect(0, 0, polygonStyles.width, polygonStyles.width);
            var cornerMap = this.drawShape(canvasElm, ratingArray, polygonStyles);
            this.setState({ cornerMap: cornerMap });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                ratingArray = _state.ratingArray,
                cornerMap = _state.cornerMap;
            var _props2 = this.props,
                polygonStyles = _props2.polygonStyles,
                canvasId = _props2.canvasId;

            var cornerTitles = cornerMap.map(function (item, key) {
                var styles = _extends({}, item, { position: 'absolute', transform: 'rotate(90deg)' });
                return _react2.default.createElement(
                    'span',
                    { key: key, style: styles },
                    ratingArray[key].name
                );
            });
            return _react2.default.createElement(
                'div',
                { className: 'App', style: {
                        position: 'relative', width: polygonStyles.width,
                        height: polygonStyles.width,
                        transform: 'rotate(-90deg)'
                    } },
                cornerTitles,
                _react2.default.createElement('canvas', { id: canvasId, height: polygonStyles.width, width: polygonStyles.width })
            );
        }
    }]);

    return SinglePolygon;
}(_react.Component);

SinglePolygon.propTypes = {
    polygonStyles: _propTypes2.default.shape({
        polygonSides: _propTypes2.default.number.isRequired,
        width: _propTypes2.default.number.isRequired,
        colorOverlay: _propTypes2.default.string,
        colorStroke: _propTypes2.default.string,
        ratingLimit: _propTypes2.default.number
    }).isRequired,
    ratingArray: _propTypes2.default.array.isRequired,
    canvasId: _propTypes2.default.string.isRequired
};
exports.default = SinglePolygon;