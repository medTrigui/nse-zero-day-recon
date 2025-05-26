/*
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

// a global month names array
var gsMonthNames = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
// a global day names array
var gsDayNames = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');

// trimming with array ops
String.prototype.trim = function() { return this.split(/\s/).join(' '); }

// redundant prototype function definition
String.prototype.trim =function trim() {return this.split(/\s/).join(' ');};
// confusing prototype function definition
String.prototype.trim =function trimblanks() { return this.split(/\s/).join(' '); };

String.prototype.trim2 =function() { return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1'); }

// VB-like string replicator
String.prototype.times = function(n)
{
 var s = '';
 for (var i = 0; i < n; i++)
  	s += this;
 return s;
}

// Zero-Padding
String.prototype.zf =function(n) { return '0'.times(n - this.length) + this;}

// string functions that we want to apply directly to numbers...
Number.prototype.zf = function(n) { return this.toString().zf(n);}

// the date format prototype // For convenience...
Date.prototype.format = function(mask, utc)
{
    if (!this.valueOf())
        return '&nbsp;';
    var d = this;
    mask=mask.replace(/MM/g,'nn');
    return mask.replace(/(yyyy|yy|mmmm|mmm|mm|dddd|ddd|dd|hh|nn|ss|tt|aa|a\/p)/gi,
        function($1)
        {
            switch ($1.toLowerCase())
            {
                case 'yyyy': return d.getFullYear();
                case 'yy': return d.getFullYear().toString().substr(2, 4);
                case 'mmmm': return gsMonthNames[d.getMonth()];
                case 'mmm':  return gsMonthNames[d.getMonth()].substr(0, 3);
                case 'mm':   return (d.getMonth() + 1).zf(2);
                case 'dddd': return gsDayNames[d.getDay()];
                case 'ddd':  return gsDayNames[d.getDay()].substr(0, 3);
                case 'dd':   return d.getDate().zf(2);
                case 'nn':   return d.getMinutes().zf(2);
                case 'ss':   return d.getSeconds().zf(2);
            }
            switch ($1)
            {
                case 'hh':   return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case 'HH':   return d.getHours().zf(2);
                case 'a/p':  return d.getHours() < 12 ? 'am' : 'pm';
                case 'a' :  return d.getHours() < 12 ? 'am' : 'pm';
                case 'aa':  return d.getHours() < 12 ? 'AM' : 'PM';
                case 'p':  return d.getHours() < 12 ? 'am' : 'pm';
                case 'tt':  return d.getHours() < 12 ? 'am' : 'pm';
                case 'A/P':  return d.getHours() < 12 ? 'AM' : 'PM';
                case 'A':  return d.getHours() < 12 ? 'AM' : 'PM';
                case 'P':  return d.getHours() < 12 ? 'AM' : 'PM';
                case 'TT':  return d.getHours() < 12 ? 'AM' : 'PM';
            }
            return $1;
        }
    );
}