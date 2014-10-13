/**
 * Author: k.barbounakis
 * Array extensions module
 */
!(function() {
  "use strict";

function isArray( obj ) {
    return typeof obj === "object" && obj instanceof Array;
};

function isNumber( obj ) {
    return typeof obj === "number";
};

function isString( obj ) {
    return typeof obj === "string";
};

function isBoolean( obj ) {
    return typeof obj === "boolean";
};

function isFunction( fn ) {
    return typeof fn === 'function';
};

function clone(obj) {
	
    if (null == obj || "object" != typeof obj) return obj;
    
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    
    throw "Cloning object failed due to unsupported type";
}

/*
 * ArrayExtensions class extends array object and adds LINQ functionality.
 * */
function ArrayExtensions(a) {
	try {
		if (!isArray(a))
			throw "Invalid argument. The specified argument must be an Array object.";
		this.a = a;
	} catch (e) {
		throw e;
	}
}

ArrayExtensions.prototype.clone = function() {

    var arr = [];
    for(var i=0; i<this.a.length; i++) {
        arr.push( clone(this.a[i]) );
    }

    return new ArrayExtensions(arr);
};
    /**
     * @returns {Array}
     */
ArrayExtensions.prototype.toArray = function() {
	return this.a;
};

ArrayExtensions.prototype.any = function( predicate ) {

    if( predicate && isFunction(predicate)) {
        for(var i in this.a)
        {
            if(predicate(i)) return true;
        }

        return false;
    }
    else {
        if( this.length > 0 ) return true;
    }
};

ArrayExtensions.prototype.firstOrDefault = function(predicate) {
	if ( predicate && isFunction(predicate)) {

        for(var i=0;i<this.a.length;i++) {
            if(predicate(this.a[i])) return this.a[i];
        }
        return null;
    }
    else {
        return this.a.length > 0 ? this.a[0] : null;
    }
};

ArrayExtensions.prototype.first = function( predicate )
{
    var first = this.first(predicate);
    if (first==null) throw "Item cannot be found.";
    return first;
};

ArrayExtensions.prototype.lastOrDefault = function( predicate ) {
    if ( predicate && isFunction(predicate)) {

        for(var i=this.a.length-1;i>=0;i--) {
            if(predicate(this.a[i])) return this.a[i];
        }

        return null;
    }
    else {
        var ret = this.a.length > 0 ? this[this.a.length-1] : null;
        if( ret === null ) return null;

        return ret;
   }
};

ArrayExtensions.prototype.last = function( predicate ) 
{
    var last = this.lastOrDefault(predicate);
    if (last==null) throw "Item cannot be found.";
    return last;
};


ArrayExtensions.prototype.select = function( selector ) {
    if( selector &&  isFunction(selector)) {
        var arr = [];
        for(var i=0; i<this.a.length; i++) {
            arr.push( selector(this.a[i]) );
        }

        return new ArrayExtensions(arr);
    }
    else {
    }
};

ArrayExtensions.prototype.where = function( selector ) {
    if( selector && isFunction(selector)) {
        var arr = [];
        for(var i=0; i<this.a.length; i++) {
            if( selector(this.a[i])) {
                arr.push(this.a[i]);
            }
        }
        return new ArrayExtensions(arr);
    } else {
        var arr = [];
        for(var i=0; i<this.a.length; i++ ) {
            if( this.a[i] == selector ) {
                arr.push(this.a[i]);
            }
        }
        return new ArrayExtensions(arr);
    }
};


ArrayExtensions.prototype.take = function( number ) {

    if( arguments.length === 0 ) throw "Take() method needs an argument of number";

    if( number && isNumber(number)) {
        number = number > this.a.length ? this.a.length : number;

        var arr = [];
        for(var i=0; i<number; i++) {
            arr.push( this.a[i] );
        }

        return new ArrayExtensions(arr);
    }
};

ArrayExtensions.prototype.skip = function( number ) {

    if( arguments.length === 0 ) throw "Skip() method needs an argument of number";

    if( number && isNumber(number)) {
        number = number > this.a.length ? this.a.length : number;

        var arr = [];
        for(var i=number; i<this.a.length; i++) {
            arr.push( this.a[i] );
        }

        return new ArrayExtensions(arr);
    }

};

ArrayExtensions.prototype.orderBy = function( _comparer ) {

    _comparer = _comparer || comparer.ascending;

    return new ArrayExtensions(this.a.sort(_comparer));
};

ArrayExtensions.prototype.sum = function( selector ) {

    var sum = 0;
    if( selector && isFunction(selector)) {

        for(var i=0; i<this.a.length; i++) {
            sum += selector( this.a[i] );
        }

    } else {

        for(var i=0; i<this.a.length; i++) {
            var current = this.a[i];
            if( isNumber(current)) {
                sum += current;
            } else if( isString(current)) {

                if( current.indexOf(".") > 0) {
                    sum += parseFloat(current);
                }
                else {
                    sum += parseInt(current);
                }
            }
        }
    }

    return sum;
};

ArrayExtensions.prototype.average = function( selector ) {

    if( this.a.length === 0 ) return 0;

    var sum = this.sum(selector);

    return sum / this.a.length;
};

ArrayExtensions.prototype.each = function( selector ) {

	if( selector && isFunction(selector)) {
		for ( var i = 0; i < this.a.length; i++) {
			var res = selector(this.a[i]);
			if (res!=null)
				if (!res)
					break;
		}
	}
};


ArrayExtensions.prototype.max = function( predicate ) {

    var max = 0;

    if( this.a.length === 0 ) throw "no array data";

    if( this.a.length > 0 ) max = this.a[0];

    if( predicate && isFunction(predicate) ) {

        for(var i=0; i<this.a.length; i++ ) {
            var pred = predicate(this.a[i]);
            if( pred && max < this.a[i] ) {
                max = this.a[i];
            }
        }

    } else {

        for(var i=0; i<this.a.length; i++) {
            var dest = this.a[i];
            if( max < dest ) {
                max = dest;
            }
        }
    }

    return max;
};

ArrayExtensions.prototype.min = function( predicate ) {
    var min = 0;

    if( this.a.length === 0 ) throw "no array data";

    if( this.a.length > 0 ) min = this.a[0];

    if( predicate && isFunction(predicate) ) {

        for(var i=0; i<this.a.length; i++ ) {
            var pred = predicate(this.a[i]);
            if( pred && min > this.a[i] ) {
                min = this.a[i];
            }
        }

    } else {

        for(var i=0; i<this.a.length; i++) {
            var dest = this.a[i];
            if( min > dest ) {
                min = dest;
            }
        }
    }

    return min;
};

function _union(first,second) {

    first  = (first  && isArray(first))    ? first : [ first ];
    second = (second && isArray(second))   ? second : [ second ];

    var arr = (new ArrayExtensions(first)).clone().toArray();

    for(var i=0; i<second.length; i++) {
        arr.push( clone(second[i]) );
    }

    return arr;
}


ArrayExtensions.prototype.union = Array.prototype.union || function( second ) {

    if( arguments.length === 0 )        throw "second argument needs an array";
    if( second && !isArray(second))    throw "Invalid arguments";

    return _union( this, second );
};

    /**
     * @param {Array} arr
     * @returns {ArrayExtensions}
     */
function Export(arr) {
  return new ArrayExtensions(arr);
};

if (typeof module !== 'undefined'  && typeof module.exports !== 'undefined')
{
    /**
     * @param {Array} arr
     * @returns {ArrayExtensions}
     */
    module.exports = function(arr) { return new ArrayExtensions(arr); };

  } else {

    if(typeof define === "function" && define.amd)
    {
      define([], function() {
        return Export;
      });
    } else {
      window.array = Export;
    }
  }

}).call(this);

