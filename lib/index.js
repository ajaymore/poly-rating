'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SinglePolygon = require('./components/SinglePolygon');

Object.defineProperty(exports, 'SinglePolygon', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SinglePolygon).default;
  }
});

var _SummaryPolygon = require('./components/SummaryPolygon');

Object.defineProperty(exports, 'SummaryPolygon', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SummaryPolygon).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }