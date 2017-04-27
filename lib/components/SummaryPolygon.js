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

var getRandomRating = function getRandomRating() {
    return [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1];
};

var getQuadrantAdjustmentStyle = function getQuadrantAdjustmentStyle(x, y, canvasSize, color) {
    if (x > 0 && y > 0) {
        return { left: x + canvasSize, top: canvasSize + y };
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

var SummaryPolygon = function (_Component) {
    _inherits(SummaryPolygon, _Component);

    function SummaryPolygon(props) {
        _classCallCheck(this, SummaryPolygon);

        var _this = _possibleConstructorReturn(this, (SummaryPolygon.__proto__ || Object.getPrototypeOf(SummaryPolygon)).call(this, props));

        _this.drawShape = _this.drawShape.bind(_this);
        _this.drawPolygon = _this.drawPolygon.bind(_this);
        _this.drawRatings = _this.drawRatings.bind(_this);
        _this.drawSpider = _this.drawSpider.bind(_this);
        _this.state = {
            cornerMap: [],
            drawingDefaults: {
                polygonSides: 5,
                width: 300,
                colorOverlay: "#2ECC71",
                colorStroke: "#E8E5DF",
                ratingLimit: 5
            },
            ratingDimensions: _this.props.ratingDimensions
        };
        return _this;
    }

    _createClass(SummaryPolygon, [{
        key: 'drawPolygon',
        value: function drawPolygon(context, polyAngle, radius, polygonSides, colorStroke, canvasSize) {
            var cornerMap = [];
            context.beginPath();
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
                var calculatedRad = ratingsArr[n] * radIncr;
                context.lineTo(calculatedRad * Math.cos(polyAngle * n), calculatedRad * Math.sin(polyAngle * n));
            }
            context.closePath();
            context.fillStyle = fillStyle;
            context.fill();
        }
    }, {
        key: 'drawSpider',
        value: function drawSpider(context, radius, polyAngle, polygonSides) {
            for (var n = 0; n < polygonSides; n++) {
                var xCoord = radius * Math.cos(polyAngle * n);
                var yCoord = radius * Math.sin(polyAngle * n);
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(xCoord, yCoord);
                context.stroke();
            }
        }
    }, {
        key: 'drawShape',
        value: function drawShape(canvas, tempCanvas) {
            var drawingDefaults = this.state.drawingDefaults;
            var _props = this.props,
                polygonStyles = _props.polygonStyles,
                ratingDimensions = _props.ratingDimensions;

            var drawingStyles = _extends({}, drawingDefaults, polygonStyles);
            this.setState({ drawingDefaults: drawingStyles });

            var context = canvas.getContext('2d');
            var polyAngle = Math.PI * 2 / drawingStyles.polygonSides;
            var radius = (drawingStyles.width - 100) / 2;
            context.translate(canvas.width / 2, canvas.height / 2);
            var tempContext = tempCanvas.getContext('2d');
            tempContext.translate(canvas.width / 2, canvas.height / 2);
            context.strokeStyle = drawingStyles.colorStroke;

            var cornerMap = this.drawPolygon(context, polyAngle, radius, drawingStyles.polygonSides, drawingStyles.strokeStyle, canvas.width);
            for (var i = 1; i < drawingStyles.polygonSides; i++) {
                this.drawPolygon(context, polyAngle, radius - radius / drawingStyles.ratingLimit * i, drawingStyles.polygonSides, drawingStyles.strokeStyle, canvas.width);
            }
            this.drawPolygon(context, polyAngle, 5, drawingStyles.polygonSides, drawingStyles.strokeStyle, canvas.width);

            this.drawSpider(context, radius, polyAngle, drawingStyles.polygonSides);

            var opacityTable = [1, 0.9558, 0.9079, 0.8569, 0.8036, 0.7487, 0.6928, 0.6367, 0.5810, 0.5266, 0.474, 0.4239, 0.3772, 0.3344, 0.2962, 0.2634, 0.2367, 0.2168, 0.2043, 0.2];
            var ratings = [];
            for (var n = 0; n < 16; n++) {
                var rating = getRandomRating();
                ratings.push(rating);
            }
            var opacityVal = void 0;
            if (ratings.length < 20) {
                opacityVal = opacityTable[ratings.length];
            } else {
                opacityVal = opacityTable[19];
            }
            for (var _n = 0; _n < ratings.length; _n++) {
                var ratingsArr = ratings[_n];
                this.drawRatings(tempContext, ratingsArr, radius / drawingStyles.ratingLimit, polyAngle, drawingStyles.colorOverlay, opacityVal);
                tempContext.blendOnto(context, 'multiply');
                tempContext.clearRect(-tempCanvas.width / 2, -tempCanvas.height / 2, tempCanvas.width, tempCanvas.height);
            }

            return cornerMap;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var canvasElm = document.getElementById('canvas');
            var tempCanvasElm = document.getElementById('temp-canvas');
            var _props2 = this.props,
                ratingDimensions = _props2.ratingDimensions,
                polygonStyles = _props2.polygonStyles;

            canvasElm.getContext("2d").clearRect(0, 0, polygonStyles.width, polygonStyles.width);
            var cornerMap = this.drawShape(canvasElm, tempCanvasElm);
            this.setState({ cornerMap: cornerMap });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            this.setState({ ratingArray: newProps.ratingArray });
            var canvasElm = document.getElementById('canvas');
            var tempCanvasElm = document.getElementById('temp-canvas');
            var ratingDimensions = newProps.ratingDimensions,
                polygonStyles = newProps.polygonStyles;

            canvasElm.getContext("2d").clearRect(0, 0, polygonStyles.width, polygonStyles.width);
            var cornerMap = this.drawShape(canvasElm, tempCanvasElm);
            this.setState({ cornerMap: cornerMap });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                ratingDimensions = _state.ratingDimensions,
                cornerMap = _state.cornerMap;
            var polygonStyles = this.props.polygonStyles;

            console.log(cornerMap);
            var cornerTitles = cornerMap.map(function (item, key) {
                var styles = _extends({}, item, { position: 'absolute', transform: 'rotate(90deg)' });
                return _react2.default.createElement(
                    'span',
                    { key: key, style: styles },
                    ratingDimensions[key]
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
                _react2.default.createElement('canvas', { id: 'canvas', height: polygonStyles.width, width: polygonStyles.width }),
                _react2.default.createElement('canvas', { id: 'temp-canvas', height: polygonStyles.width, width: polygonStyles.width, style: { display: 'block' } })
            );
        }
    }]);

    return SummaryPolygon;
}(_react.Component);

SummaryPolygon.propTypes = {
    polygonStyles: _propTypes2.default.shape({
        polygonSides: _propTypes2.default.number.isRequired,
        width: _propTypes2.default.number.isRequired,
        colorOverlay: _propTypes2.default.string,
        colorStroke: _propTypes2.default.string,
        ratingLimit: _propTypes2.default.number
    }).isRequired,
    ratingDimensions: _propTypes2.default.array.isRequired
};
exports.default = SummaryPolygon;