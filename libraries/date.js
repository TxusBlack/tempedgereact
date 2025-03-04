'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validators = require('./validators');

var _validators2 = _interopRequireDefault(_validators);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DATE_METHODS = {
  y: function y(d) {
    return d.getFullYear();
  },
  m: function m(d) {
    return d.getMonth() + 1;
  },
  d: function d(_d) {
    return _d.getDate();
  }
};

var PARSE_REG = /(y+|m+|d+)/g;

var TO_STRING = {}.toString;

var date = (0, _helpers.memoize)(function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      format = _ref.format,
      ymd = _ref.ymd,
      eq = _ref['='],
      diff = _ref['!='],
      gt = _ref['>'],
      gte = _ref['>='],
      lt = _ref['<'],
      lte = _ref['<='],
      message = _ref.message,
      msg = _ref.msg,
      ifCond = _ref.if,
      unless = _ref.unless,
      allowBlank = _ref.allowBlank;

  msg = msg || message;

  return (0, _helpers.prepare)(ifCond, unless, allowBlank, function (value) {
    var normFormat = normalizeFormat(format, ymd);
	//Added check for value to exist and converted value to JS String object so .match() gets inherited and the routine will work
	if( value ){
		console.log("value: ", value);
		var date = normParseDate(new String(value), normFormat, false);
	}
	/******/
    if (date === 'wrongFormat') {
      return _validators2.default.formatMessage((0, _helpers.prepareMsg)(msg, 'dateFormat', { format: format }));
    }
    if (date === 'invalid') {
      return _validators2.default.formatMessage((0, _helpers.prepareMsg)(msg, 'dateInvalid'));
    }
    if (date) {
      var date2 = void 0;
      if (eq && +date !== +(date2 = getDate(eq))) {
        return _validators2.default.formatMessage((0, _helpers.prepareMsg)(msg, 'dateRange', values('=', date2, normFormat)));
      }
      if (diff && +date === +(date2 = getDate(diff))) {
        return _validators2.default.formatMessage((0, _helpers.prepareMsg)(msg, 'dateRange', values('!=', date2, normFormat)));
      }
      if (gt && date <= (date2 = getDate(gt))) {
        return _validators2.default.formatMessage((0, _helpers.prepareMsg)(msg, 'dateRange', values('>', date2, normFormat)));
      }
      if (gte && date < (date2 = getDate(gte))) {
        return _validators2.default.formatMessage((0, _helpers.prepareMsg)(msg, 'dateRange', values('>=', date2, normFormat)));
      }
      if (lt && date >= (date2 = getDate(lt))) {
        return _validators2.default.formatMessage((0, _helpers.prepareMsg)(msg, 'dateRange', values('<', date2, normFormat)));
      }
      if (lte && date > (date2 = getDate(lte))) {
        return _validators2.default.formatMessage((0, _helpers.prepareMsg)(msg, 'dateRange', values('<=', date2, normFormat)));
      }
    }
  });
});

date.parseDate = parseDate;
date.formatDate = formatDate;

exports.default = date;


function parseDate(strDate, format, ymd) {
  return normParseDate(strDate, normalizeFormat(format, ymd), true);
}

function formatDate(date, format, ymd) {
  if (!(date instanceof Date) && TO_STRING.call(date) !== '[object Date]') {
    return null;
  }
  var t = new Date(date).getTime();
  // eslint-disable-next-line no-self-compare
  return t !== t ? null : normFormatDate(date, normalizeFormat(format, ymd));
}

function values(op, date, format) {
  return { op: op, date: normFormatDate(date, format), dateObject: date };
}

function getDate(d) {
  if (typeof d === 'function') {
    return new Date(+d());
  }
  if (isNaN(d) && ('' + d).toLowerCase() === 'today') {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  return new Date(+d);
}

// FORMAT
function normFormatDate(date, format) {
  return format.replace(PARSE_REG, function (m) {
    var sym = m.charAt(0);
    var len = m.length;
    var padded = padding(DATE_METHODS[sym](date), len);
    return sym === 'y' ? padded.slice(padded.length - len, padded.length) : padded;
  });
}
function normalizeFormat(format, ymd) {
  var _reverseMapping;

  if (format == null) {
    format = _validators2.default.defaultOptions.dateFormat;
  }
  if (!ymd) {
    ymd = _validators2.default.defaultOptions.dateYmd;
  }
  if (!ymd || ymd === 'ymd') {
    return format;
  }
  var reverseMapping = (_reverseMapping = {}, _defineProperty(_reverseMapping, ymd.charAt(0), 'y'), _defineProperty(_reverseMapping, ymd.charAt(1), 'm'), _defineProperty(_reverseMapping, ymd.charAt(2), 'd'), _reverseMapping);
  return format.replace(new RegExp('[' + ymd + ']', 'g'), function (sym) {
    return reverseMapping[sym];
  });
}
function padding(num, pad) {
  return '0'.repeat(Math.max(0, pad - ('' + num).length)) + num;
}

// PARSE
function normParseDate(value, format, parse) {
  var order = [];
  var reg = new RegExp('^' + format.replace(PARSE_REG, function (m) {
    order.push(m.charAt(0));
    return '([0-9]{' + m.length + '})';
  }) + '$');
  
  var match = value.match(reg);
  if (match) {
    var flags = {};
    order.forEach(function (token, index) {
      flags[token] = +match[index + 1];
    });
    var comparable = flags.y != null ? flags.m != null ? true : flags.d == null : false;
    flags = Object.assign({ y: 1970, m: 1, d: 1 }, flags);
    if (flags.y < 100) {
      flags.y = currentCentury(flags.y >= 69 ? -1 : 0) * 100 + flags.y;
    }
    var _date = new Date(flags.y, flags.m - 1, flags.d);
    return checkFlags(_date, flags) ? comparable || parse ? _date : null : parse ? new Date(NaN) : 'invalid';
  }
  return parse ? new Date(NaN) : 'wrongFormat';
}

function checkFlags(date, flags) {
  var _ref2 = [date.getFullYear(), date.getMonth() + 1, date.getDate()],
      year = _ref2[0],
      month = _ref2[1],
      day = _ref2[2];

  return year === flags.y && month === flags.m && day === flags.d;
}

function currentCentury(add) {
  var century = (0, _helpers.trunc)(new Date().getFullYear() / 100);
  return century < 0 ? century - add : century + add;
}