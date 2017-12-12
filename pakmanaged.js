var global = Function("return this;")();
/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);
// pakmanager:jquery
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  /*!
     * jQuery JavaScript Library v2.2.4
     * http://jquery.com/
     *
     * Includes Sizzle.js
     * http://sizzlejs.com/
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2016-05-20T17:23Z
     */
    
    (function( global, factory ) {
    
    	if ( typeof module === "object" && typeof module.exports === "object" ) {
    		// For CommonJS and CommonJS-like environments where a proper `window`
    		// is present, execute the factory and get jQuery.
    		// For environments that do not have a `window` with a `document`
    		// (such as Node.js), expose a factory as module.exports.
    		// This accentuates the need for the creation of a real `window`.
    		// e.g. var jQuery =  require('jquery')(window);
    		// See ticket #14549 for more info.
    		module.exports = global.document ?
    			factory( global, true ) :
    			function( w ) {
    				if ( !w.document ) {
    					throw new Error( "jQuery requires a window with a document" );
    				}
    				return factory( w );
    			};
    	} else {
    		factory( global );
    	}
    
    // Pass this if window is not defined yet
    }(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
    
    // Support: Firefox 18+
    // Can't be in strict mode, several libs including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains. (#13335)
    //"use strict";
    var arr = [];
    
    var document = window.document;
    
    var slice = arr.slice;
    
    var concat = arr.concat;
    
    var push = arr.push;
    
    var indexOf = arr.indexOf;
    
    var class2type = {};
    
    var toString = class2type.toString;
    
    var hasOwn = class2type.hasOwnProperty;
    
    var support = {};
    
    
    
    var
    	version = "2.2.4",
    
    	// Define a local copy of jQuery
    	jQuery = function( selector, context ) {
    
    		// The jQuery object is actually just the init constructor 'enhanced'
    		// Need init if jQuery is called (just allow error to be thrown if not included)
    		return new jQuery.fn.init( selector, context );
    	},
    
    	// Support: Android<4.1
    	// Make sure we trim BOM and NBSP
    	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    
    	// Matches dashed string for camelizing
    	rmsPrefix = /^-ms-/,
    	rdashAlpha = /-([\da-z])/gi,
    
    	// Used by jQuery.camelCase as callback to replace()
    	fcamelCase = function( all, letter ) {
    		return letter.toUpperCase();
    	};
    
    jQuery.fn = jQuery.prototype = {
    
    	// The current version of jQuery being used
    	jquery: version,
    
    	constructor: jQuery,
    
    	// Start with an empty selector
    	selector: "",
    
    	// The default length of a jQuery object is 0
    	length: 0,
    
    	toArray: function() {
    		return slice.call( this );
    	},
    
    	// Get the Nth element in the matched element set OR
    	// Get the whole matched element set as a clean array
    	get: function( num ) {
    		return num != null ?
    
    			// Return just the one element from the set
    			( num < 0 ? this[ num + this.length ] : this[ num ] ) :
    
    			// Return all the elements in a clean array
    			slice.call( this );
    	},
    
    	// Take an array of elements and push it onto the stack
    	// (returning the new matched element set)
    	pushStack: function( elems ) {
    
    		// Build a new jQuery matched element set
    		var ret = jQuery.merge( this.constructor(), elems );
    
    		// Add the old object onto the stack (as a reference)
    		ret.prevObject = this;
    		ret.context = this.context;
    
    		// Return the newly-formed element set
    		return ret;
    	},
    
    	// Execute a callback for every element in the matched set.
    	each: function( callback ) {
    		return jQuery.each( this, callback );
    	},
    
    	map: function( callback ) {
    		return this.pushStack( jQuery.map( this, function( elem, i ) {
    			return callback.call( elem, i, elem );
    		} ) );
    	},
    
    	slice: function() {
    		return this.pushStack( slice.apply( this, arguments ) );
    	},
    
    	first: function() {
    		return this.eq( 0 );
    	},
    
    	last: function() {
    		return this.eq( -1 );
    	},
    
    	eq: function( i ) {
    		var len = this.length,
    			j = +i + ( i < 0 ? len : 0 );
    		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
    	},
    
    	end: function() {
    		return this.prevObject || this.constructor();
    	},
    
    	// For internal use only.
    	// Behaves like an Array's method, not like a jQuery method.
    	push: push,
    	sort: arr.sort,
    	splice: arr.splice
    };
    
    jQuery.extend = jQuery.fn.extend = function() {
    	var options, name, src, copy, copyIsArray, clone,
    		target = arguments[ 0 ] || {},
    		i = 1,
    		length = arguments.length,
    		deep = false;
    
    	// Handle a deep copy situation
    	if ( typeof target === "boolean" ) {
    		deep = target;
    
    		// Skip the boolean and the target
    		target = arguments[ i ] || {};
    		i++;
    	}
    
    	// Handle case when target is a string or something (possible in deep copy)
    	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
    		target = {};
    	}
    
    	// Extend jQuery itself if only one argument is passed
    	if ( i === length ) {
    		target = this;
    		i--;
    	}
    
    	for ( ; i < length; i++ ) {
    
    		// Only deal with non-null/undefined values
    		if ( ( options = arguments[ i ] ) != null ) {
    
    			// Extend the base object
    			for ( name in options ) {
    				src = target[ name ];
    				copy = options[ name ];
    
    				// Prevent never-ending loop
    				if ( target === copy ) {
    					continue;
    				}
    
    				// Recurse if we're merging plain objects or arrays
    				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
    					( copyIsArray = jQuery.isArray( copy ) ) ) ) {
    
    					if ( copyIsArray ) {
    						copyIsArray = false;
    						clone = src && jQuery.isArray( src ) ? src : [];
    
    					} else {
    						clone = src && jQuery.isPlainObject( src ) ? src : {};
    					}
    
    					// Never move original objects, clone them
    					target[ name ] = jQuery.extend( deep, clone, copy );
    
    				// Don't bring in undefined values
    				} else if ( copy !== undefined ) {
    					target[ name ] = copy;
    				}
    			}
    		}
    	}
    
    	// Return the modified object
    	return target;
    };
    
    jQuery.extend( {
    
    	// Unique for each copy of jQuery on the page
    	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
    
    	// Assume jQuery is ready without the ready module
    	isReady: true,
    
    	error: function( msg ) {
    		throw new Error( msg );
    	},
    
    	noop: function() {},
    
    	isFunction: function( obj ) {
    		return jQuery.type( obj ) === "function";
    	},
    
    	isArray: Array.isArray,
    
    	isWindow: function( obj ) {
    		return obj != null && obj === obj.window;
    	},
    
    	isNumeric: function( obj ) {
    
    		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
    		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    		// subtraction forces infinities to NaN
    		// adding 1 corrects loss of precision from parseFloat (#15100)
    		var realStringObj = obj && obj.toString();
    		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
    	},
    
    	isPlainObject: function( obj ) {
    		var key;
    
    		// Not plain objects:
    		// - Any object or value whose internal [[Class]] property is not "[object Object]"
    		// - DOM nodes
    		// - window
    		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
    			return false;
    		}
    
    		// Not own constructor property must be Object
    		if ( obj.constructor &&
    				!hasOwn.call( obj, "constructor" ) &&
    				!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
    			return false;
    		}
    
    		// Own properties are enumerated firstly, so to speed up,
    		// if last one is own, then all properties are own
    		for ( key in obj ) {}
    
    		return key === undefined || hasOwn.call( obj, key );
    	},
    
    	isEmptyObject: function( obj ) {
    		var name;
    		for ( name in obj ) {
    			return false;
    		}
    		return true;
    	},
    
    	type: function( obj ) {
    		if ( obj == null ) {
    			return obj + "";
    		}
    
    		// Support: Android<4.0, iOS<6 (functionish RegExp)
    		return typeof obj === "object" || typeof obj === "function" ?
    			class2type[ toString.call( obj ) ] || "object" :
    			typeof obj;
    	},
    
    	// Evaluates a script in a global context
    	globalEval: function( code ) {
    		var script,
    			indirect = eval;
    
    		code = jQuery.trim( code );
    
    		if ( code ) {
    
    			// If the code includes a valid, prologue position
    			// strict mode pragma, execute code by injecting a
    			// script tag into the document.
    			if ( code.indexOf( "use strict" ) === 1 ) {
    				script = document.createElement( "script" );
    				script.text = code;
    				document.head.appendChild( script ).parentNode.removeChild( script );
    			} else {
    
    				// Otherwise, avoid the DOM node creation, insertion
    				// and removal by using an indirect global eval
    
    				indirect( code );
    			}
    		}
    	},
    
    	// Convert dashed to camelCase; used by the css and data modules
    	// Support: IE9-11+
    	// Microsoft forgot to hump their vendor prefix (#9572)
    	camelCase: function( string ) {
    		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    	},
    
    	nodeName: function( elem, name ) {
    		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    	},
    
    	each: function( obj, callback ) {
    		var length, i = 0;
    
    		if ( isArrayLike( obj ) ) {
    			length = obj.length;
    			for ( ; i < length; i++ ) {
    				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    					break;
    				}
    			}
    		} else {
    			for ( i in obj ) {
    				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    					break;
    				}
    			}
    		}
    
    		return obj;
    	},
    
    	// Support: Android<4.1
    	trim: function( text ) {
    		return text == null ?
    			"" :
    			( text + "" ).replace( rtrim, "" );
    	},
    
    	// results is for internal usage only
    	makeArray: function( arr, results ) {
    		var ret = results || [];
    
    		if ( arr != null ) {
    			if ( isArrayLike( Object( arr ) ) ) {
    				jQuery.merge( ret,
    					typeof arr === "string" ?
    					[ arr ] : arr
    				);
    			} else {
    				push.call( ret, arr );
    			}
    		}
    
    		return ret;
    	},
    
    	inArray: function( elem, arr, i ) {
    		return arr == null ? -1 : indexOf.call( arr, elem, i );
    	},
    
    	merge: function( first, second ) {
    		var len = +second.length,
    			j = 0,
    			i = first.length;
    
    		for ( ; j < len; j++ ) {
    			first[ i++ ] = second[ j ];
    		}
    
    		first.length = i;
    
    		return first;
    	},
    
    	grep: function( elems, callback, invert ) {
    		var callbackInverse,
    			matches = [],
    			i = 0,
    			length = elems.length,
    			callbackExpect = !invert;
    
    		// Go through the array, only saving the items
    		// that pass the validator function
    		for ( ; i < length; i++ ) {
    			callbackInverse = !callback( elems[ i ], i );
    			if ( callbackInverse !== callbackExpect ) {
    				matches.push( elems[ i ] );
    			}
    		}
    
    		return matches;
    	},
    
    	// arg is for internal usage only
    	map: function( elems, callback, arg ) {
    		var length, value,
    			i = 0,
    			ret = [];
    
    		// Go through the array, translating each of the items to their new values
    		if ( isArrayLike( elems ) ) {
    			length = elems.length;
    			for ( ; i < length; i++ ) {
    				value = callback( elems[ i ], i, arg );
    
    				if ( value != null ) {
    					ret.push( value );
    				}
    			}
    
    		// Go through every key on the object,
    		} else {
    			for ( i in elems ) {
    				value = callback( elems[ i ], i, arg );
    
    				if ( value != null ) {
    					ret.push( value );
    				}
    			}
    		}
    
    		// Flatten any nested arrays
    		return concat.apply( [], ret );
    	},
    
    	// A global GUID counter for objects
    	guid: 1,
    
    	// Bind a function to a context, optionally partially applying any
    	// arguments.
    	proxy: function( fn, context ) {
    		var tmp, args, proxy;
    
    		if ( typeof context === "string" ) {
    			tmp = fn[ context ];
    			context = fn;
    			fn = tmp;
    		}
    
    		// Quick check to determine if target is callable, in the spec
    		// this throws a TypeError, but we will just return undefined.
    		if ( !jQuery.isFunction( fn ) ) {
    			return undefined;
    		}
    
    		// Simulated bind
    		args = slice.call( arguments, 2 );
    		proxy = function() {
    			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
    		};
    
    		// Set the guid of unique handler to the same of original handler, so it can be removed
    		proxy.guid = fn.guid = fn.guid || jQuery.guid++;
    
    		return proxy;
    	},
    
    	now: Date.now,
    
    	// jQuery.support is not used in Core but other projects attach their
    	// properties to it so it needs to exist.
    	support: support
    } );
    
    // JSHint would error on this code due to the Symbol not being defined in ES5.
    // Defining this global in .jshintrc would create a danger of using the global
    // unguarded in another place, it seems safer to just disable JSHint for these
    // three lines.
    /* jshint ignore: start */
    if ( typeof Symbol === "function" ) {
    	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
    }
    /* jshint ignore: end */
    
    // Populate the class2type map
    jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
    function( i, name ) {
    	class2type[ "[object " + name + "]" ] = name.toLowerCase();
    } );
    
    function isArrayLike( obj ) {
    
    	// Support: iOS 8.2 (not reproducible in simulator)
    	// `in` check used to prevent JIT error (gh-2145)
    	// hasOwn isn't used here due to false negatives
    	// regarding Nodelist length in IE
    	var length = !!obj && "length" in obj && obj.length,
    		type = jQuery.type( obj );
    
    	if ( type === "function" || jQuery.isWindow( obj ) ) {
    		return false;
    	}
    
    	return type === "array" || length === 0 ||
    		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    }
    var Sizzle =
    /*!
     * Sizzle CSS Selector Engine v2.2.1
     * http://sizzlejs.com/
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2015-10-17
     */
    (function( window ) {
    
    var i,
    	support,
    	Expr,
    	getText,
    	isXML,
    	tokenize,
    	compile,
    	select,
    	outermostContext,
    	sortInput,
    	hasDuplicate,
    
    	// Local document vars
    	setDocument,
    	document,
    	docElem,
    	documentIsHTML,
    	rbuggyQSA,
    	rbuggyMatches,
    	matches,
    	contains,
    
    	// Instance-specific data
    	expando = "sizzle" + 1 * new Date(),
    	preferredDoc = window.document,
    	dirruns = 0,
    	done = 0,
    	classCache = createCache(),
    	tokenCache = createCache(),
    	compilerCache = createCache(),
    	sortOrder = function( a, b ) {
    		if ( a === b ) {
    			hasDuplicate = true;
    		}
    		return 0;
    	},
    
    	// General-purpose constants
    	MAX_NEGATIVE = 1 << 31,
    
    	// Instance methods
    	hasOwn = ({}).hasOwnProperty,
    	arr = [],
    	pop = arr.pop,
    	push_native = arr.push,
    	push = arr.push,
    	slice = arr.slice,
    	// Use a stripped-down indexOf as it's faster than native
    	// http://jsperf.com/thor-indexof-vs-for/5
    	indexOf = function( list, elem ) {
    		var i = 0,
    			len = list.length;
    		for ( ; i < len; i++ ) {
    			if ( list[i] === elem ) {
    				return i;
    			}
    		}
    		return -1;
    	},
    
    	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
    
    	// Regular expressions
    
    	// http://www.w3.org/TR/css3-selectors/#whitespace
    	whitespace = "[\\x20\\t\\r\\n\\f]",
    
    	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
    	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
    
    	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
    		// Operator (capture 2)
    		"*([*^$|!~]?=)" + whitespace +
    		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
    		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
    		"*\\]",
    
    	pseudos = ":(" + identifier + ")(?:\\((" +
    		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
    		// 1. quoted (capture 3; capture 4 or capture 5)
    		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
    		// 2. simple (capture 6)
    		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
    		// 3. anything else (capture 2)
    		".*" +
    		")\\)|)",
    
    	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    	rwhitespace = new RegExp( whitespace + "+", "g" ),
    	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
    
    	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
    
    	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
    
    	rpseudo = new RegExp( pseudos ),
    	ridentifier = new RegExp( "^" + identifier + "$" ),
    
    	matchExpr = {
    		"ID": new RegExp( "^#(" + identifier + ")" ),
    		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
    		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
    		"ATTR": new RegExp( "^" + attributes ),
    		"PSEUDO": new RegExp( "^" + pseudos ),
    		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
    			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
    			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
    		// For use in libraries implementing .is()
    		// We use this for POS matching in `select`
    		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
    			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    	},
    
    	rinputs = /^(?:input|select|textarea|button)$/i,
    	rheader = /^h\d$/i,
    
    	rnative = /^[^{]+\{\s*\[native \w/,
    
    	// Easily-parseable/retrievable ID or TAG or CLASS selectors
    	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    
    	rsibling = /[+~]/,
    	rescape = /'|\\/g,
    
    	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
    	funescape = function( _, escaped, escapedWhitespace ) {
    		var high = "0x" + escaped - 0x10000;
    		// NaN means non-codepoint
    		// Support: Firefox<24
    		// Workaround erroneous numeric interpretation of +"0x"
    		return high !== high || escapedWhitespace ?
    			escaped :
    			high < 0 ?
    				// BMP codepoint
    				String.fromCharCode( high + 0x10000 ) :
    				// Supplemental Plane codepoint (surrogate pair)
    				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    	},
    
    	// Used for iframes
    	// See setDocument()
    	// Removing the function wrapper causes a "Permission Denied"
    	// error in IE
    	unloadHandler = function() {
    		setDocument();
    	};
    
    // Optimize for push.apply( _, NodeList )
    try {
    	push.apply(
    		(arr = slice.call( preferredDoc.childNodes )),
    		preferredDoc.childNodes
    	);
    	// Support: Android<4.0
    	// Detect silently failing push.apply
    	arr[ preferredDoc.childNodes.length ].nodeType;
    } catch ( e ) {
    	push = { apply: arr.length ?
    
    		// Leverage slice if possible
    		function( target, els ) {
    			push_native.apply( target, slice.call(els) );
    		} :
    
    		// Support: IE<9
    		// Otherwise append directly
    		function( target, els ) {
    			var j = target.length,
    				i = 0;
    			// Can't trust NodeList.length
    			while ( (target[j++] = els[i++]) ) {}
    			target.length = j - 1;
    		}
    	};
    }
    
    function Sizzle( selector, context, results, seed ) {
    	var m, i, elem, nid, nidselect, match, groups, newSelector,
    		newContext = context && context.ownerDocument,
    
    		// nodeType defaults to 9, since context defaults to document
    		nodeType = context ? context.nodeType : 9;
    
    	results = results || [];
    
    	// Return early from calls with invalid selector or context
    	if ( typeof selector !== "string" || !selector ||
    		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
    
    		return results;
    	}
    
    	// Try to shortcut find operations (as opposed to filters) in HTML documents
    	if ( !seed ) {
    
    		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
    			setDocument( context );
    		}
    		context = context || document;
    
    		if ( documentIsHTML ) {
    
    			// If the selector is sufficiently simple, try using a "get*By*" DOM method
    			// (excepting DocumentFragment context, where the methods don't exist)
    			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
    
    				// ID selector
    				if ( (m = match[1]) ) {
    
    					// Document context
    					if ( nodeType === 9 ) {
    						if ( (elem = context.getElementById( m )) ) {
    
    							// Support: IE, Opera, Webkit
    							// TODO: identify versions
    							// getElementById can match elements by name instead of ID
    							if ( elem.id === m ) {
    								results.push( elem );
    								return results;
    							}
    						} else {
    							return results;
    						}
    
    					// Element context
    					} else {
    
    						// Support: IE, Opera, Webkit
    						// TODO: identify versions
    						// getElementById can match elements by name instead of ID
    						if ( newContext && (elem = newContext.getElementById( m )) &&
    							contains( context, elem ) &&
    							elem.id === m ) {
    
    							results.push( elem );
    							return results;
    						}
    					}
    
    				// Type selector
    				} else if ( match[2] ) {
    					push.apply( results, context.getElementsByTagName( selector ) );
    					return results;
    
    				// Class selector
    				} else if ( (m = match[3]) && support.getElementsByClassName &&
    					context.getElementsByClassName ) {
    
    					push.apply( results, context.getElementsByClassName( m ) );
    					return results;
    				}
    			}
    
    			// Take advantage of querySelectorAll
    			if ( support.qsa &&
    				!compilerCache[ selector + " " ] &&
    				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
    
    				if ( nodeType !== 1 ) {
    					newContext = context;
    					newSelector = selector;
    
    				// qSA looks outside Element context, which is not what we want
    				// Thanks to Andrew Dupont for this workaround technique
    				// Support: IE <=8
    				// Exclude object elements
    				} else if ( context.nodeName.toLowerCase() !== "object" ) {
    
    					// Capture the context ID, setting it first if necessary
    					if ( (nid = context.getAttribute( "id" )) ) {
    						nid = nid.replace( rescape, "\\$&" );
    					} else {
    						context.setAttribute( "id", (nid = expando) );
    					}
    
    					// Prefix every selector in the list
    					groups = tokenize( selector );
    					i = groups.length;
    					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
    					while ( i-- ) {
    						groups[i] = nidselect + " " + toSelector( groups[i] );
    					}
    					newSelector = groups.join( "," );
    
    					// Expand context for sibling selectors
    					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
    						context;
    				}
    
    				if ( newSelector ) {
    					try {
    						push.apply( results,
    							newContext.querySelectorAll( newSelector )
    						);
    						return results;
    					} catch ( qsaError ) {
    					} finally {
    						if ( nid === expando ) {
    							context.removeAttribute( "id" );
    						}
    					}
    				}
    			}
    		}
    	}
    
    	// All others
    	return select( selector.replace( rtrim, "$1" ), context, results, seed );
    }
    
    /**
     * Create key-value caches of limited size
     * @returns {function(string, object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
    	var keys = [];
    
    	function cache( key, value ) {
    		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    		if ( keys.push( key + " " ) > Expr.cacheLength ) {
    			// Only keep the most recent entries
    			delete cache[ keys.shift() ];
    		}
    		return (cache[ key + " " ] = value);
    	}
    	return cache;
    }
    
    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction( fn ) {
    	fn[ expando ] = true;
    	return fn;
    }
    
    /**
     * Support testing using an element
     * @param {Function} fn Passed the created div and expects a boolean result
     */
    function assert( fn ) {
    	var div = document.createElement("div");
    
    	try {
    		return !!fn( div );
    	} catch (e) {
    		return false;
    	} finally {
    		// Remove from its parent by default
    		if ( div.parentNode ) {
    			div.parentNode.removeChild( div );
    		}
    		// release memory in IE
    		div = null;
    	}
    }
    
    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle( attrs, handler ) {
    	var arr = attrs.split("|"),
    		i = arr.length;
    
    	while ( i-- ) {
    		Expr.attrHandle[ arr[i] ] = handler;
    	}
    }
    
    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck( a, b ) {
    	var cur = b && a,
    		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
    			( ~b.sourceIndex || MAX_NEGATIVE ) -
    			( ~a.sourceIndex || MAX_NEGATIVE );
    
    	// Use IE sourceIndex if available on both nodes
    	if ( diff ) {
    		return diff;
    	}
    
    	// Check if b follows a
    	if ( cur ) {
    		while ( (cur = cur.nextSibling) ) {
    			if ( cur === b ) {
    				return -1;
    			}
    		}
    	}
    
    	return a ? 1 : -1;
    }
    
    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo( type ) {
    	return function( elem ) {
    		var name = elem.nodeName.toLowerCase();
    		return name === "input" && elem.type === type;
    	};
    }
    
    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo( type ) {
    	return function( elem ) {
    		var name = elem.nodeName.toLowerCase();
    		return (name === "input" || name === "button") && elem.type === type;
    	};
    }
    
    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo( fn ) {
    	return markFunction(function( argument ) {
    		argument = +argument;
    		return markFunction(function( seed, matches ) {
    			var j,
    				matchIndexes = fn( [], seed.length, argument ),
    				i = matchIndexes.length;
    
    			// Match elements found at the specified indexes
    			while ( i-- ) {
    				if ( seed[ (j = matchIndexes[i]) ] ) {
    					seed[j] = !(matches[j] = seed[j]);
    				}
    			}
    		});
    	});
    }
    
    /**
     * Checks a node for validity as a Sizzle context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */
    function testContext( context ) {
    	return context && typeof context.getElementsByTagName !== "undefined" && context;
    }
    
    // Expose support vars for convenience
    support = Sizzle.support = {};
    
    /**
     * Detects XML nodes
     * @param {Element|Object} elem An element or a document
     * @returns {Boolean} True iff elem is a non-HTML XML node
     */
    isXML = Sizzle.isXML = function( elem ) {
    	// documentElement is verified for cases where it doesn't yet exist
    	// (such as loading iframes in IE - #4833)
    	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    	return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    
    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function( node ) {
    	var hasCompare, parent,
    		doc = node ? node.ownerDocument || node : preferredDoc;
    
    	// Return early if doc is invalid or already selected
    	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
    		return document;
    	}
    
    	// Update global variables
    	document = doc;
    	docElem = document.documentElement;
    	documentIsHTML = !isXML( document );
    
    	// Support: IE 9-11, Edge
    	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
    	if ( (parent = document.defaultView) && parent.top !== parent ) {
    		// Support: IE 11
    		if ( parent.addEventListener ) {
    			parent.addEventListener( "unload", unloadHandler, false );
    
    		// Support: IE 9 - 10 only
    		} else if ( parent.attachEvent ) {
    			parent.attachEvent( "onunload", unloadHandler );
    		}
    	}
    
    	/* Attributes
    	---------------------------------------------------------------------- */
    
    	// Support: IE<8
    	// Verify that getAttribute really returns attributes and not properties
    	// (excepting IE8 booleans)
    	support.attributes = assert(function( div ) {
    		div.className = "i";
    		return !div.getAttribute("className");
    	});
    
    	/* getElement(s)By*
    	---------------------------------------------------------------------- */
    
    	// Check if getElementsByTagName("*") returns only elements
    	support.getElementsByTagName = assert(function( div ) {
    		div.appendChild( document.createComment("") );
    		return !div.getElementsByTagName("*").length;
    	});
    
    	// Support: IE<9
    	support.getElementsByClassName = rnative.test( document.getElementsByClassName );
    
    	// Support: IE<10
    	// Check if getElementById returns elements by name
    	// The broken getElementById methods don't pick up programatically-set names,
    	// so use a roundabout getElementsByName test
    	support.getById = assert(function( div ) {
    		docElem.appendChild( div ).id = expando;
    		return !document.getElementsByName || !document.getElementsByName( expando ).length;
    	});
    
    	// ID find and filter
    	if ( support.getById ) {
    		Expr.find["ID"] = function( id, context ) {
    			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    				var m = context.getElementById( id );
    				return m ? [ m ] : [];
    			}
    		};
    		Expr.filter["ID"] = function( id ) {
    			var attrId = id.replace( runescape, funescape );
    			return function( elem ) {
    				return elem.getAttribute("id") === attrId;
    			};
    		};
    	} else {
    		// Support: IE6/7
    		// getElementById is not reliable as a find shortcut
    		delete Expr.find["ID"];
    
    		Expr.filter["ID"] =  function( id ) {
    			var attrId = id.replace( runescape, funescape );
    			return function( elem ) {
    				var node = typeof elem.getAttributeNode !== "undefined" &&
    					elem.getAttributeNode("id");
    				return node && node.value === attrId;
    			};
    		};
    	}
    
    	// Tag
    	Expr.find["TAG"] = support.getElementsByTagName ?
    		function( tag, context ) {
    			if ( typeof context.getElementsByTagName !== "undefined" ) {
    				return context.getElementsByTagName( tag );
    
    			// DocumentFragment nodes don't have gEBTN
    			} else if ( support.qsa ) {
    				return context.querySelectorAll( tag );
    			}
    		} :
    
    		function( tag, context ) {
    			var elem,
    				tmp = [],
    				i = 0,
    				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
    				results = context.getElementsByTagName( tag );
    
    			// Filter out possible comments
    			if ( tag === "*" ) {
    				while ( (elem = results[i++]) ) {
    					if ( elem.nodeType === 1 ) {
    						tmp.push( elem );
    					}
    				}
    
    				return tmp;
    			}
    			return results;
    		};
    
    	// Class
    	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
    		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
    			return context.getElementsByClassName( className );
    		}
    	};
    
    	/* QSA/matchesSelector
    	---------------------------------------------------------------------- */
    
    	// QSA and matchesSelector support
    
    	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
    	rbuggyMatches = [];
    
    	// qSa(:focus) reports false when true (Chrome 21)
    	// We allow this because of a bug in IE8/9 that throws an error
    	// whenever `document.activeElement` is accessed on an iframe
    	// So, we allow :focus to pass through QSA all the time to avoid the IE error
    	// See http://bugs.jquery.com/ticket/13378
    	rbuggyQSA = [];
    
    	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
    		// Build QSA regex
    		// Regex strategy adopted from Diego Perini
    		assert(function( div ) {
    			// Select is set to empty string on purpose
    			// This is to test IE's treatment of not explicitly
    			// setting a boolean content attribute,
    			// since its presence should be enough
    			// http://bugs.jquery.com/ticket/12359
    			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
    				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
    				"<option selected=''></option></select>";
    
    			// Support: IE8, Opera 11-12.16
    			// Nothing should be selected when empty strings follow ^= or $= or *=
    			// The test attribute must be unknown in Opera but "safe" for WinRT
    			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
    			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
    				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
    			}
    
    			// Support: IE8
    			// Boolean attributes and "value" are not treated correctly
    			if ( !div.querySelectorAll("[selected]").length ) {
    				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
    			}
    
    			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
    			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
    				rbuggyQSA.push("~=");
    			}
    
    			// Webkit/Opera - :checked should return selected option elements
    			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    			// IE8 throws error here and will not see later tests
    			if ( !div.querySelectorAll(":checked").length ) {
    				rbuggyQSA.push(":checked");
    			}
    
    			// Support: Safari 8+, iOS 8+
    			// https://bugs.webkit.org/show_bug.cgi?id=136851
    			// In-page `selector#id sibing-combinator selector` fails
    			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
    				rbuggyQSA.push(".#.+[+~]");
    			}
    		});
    
    		assert(function( div ) {
    			// Support: Windows 8 Native Apps
    			// The type and name attributes are restricted during .innerHTML assignment
    			var input = document.createElement("input");
    			input.setAttribute( "type", "hidden" );
    			div.appendChild( input ).setAttribute( "name", "D" );
    
    			// Support: IE8
    			// Enforce case-sensitivity of name attribute
    			if ( div.querySelectorAll("[name=d]").length ) {
    				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
    			}
    
    			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
    			// IE8 throws error here and will not see later tests
    			if ( !div.querySelectorAll(":enabled").length ) {
    				rbuggyQSA.push( ":enabled", ":disabled" );
    			}
    
    			// Opera 10-11 does not throw on post-comma invalid pseudos
    			div.querySelectorAll("*,:x");
    			rbuggyQSA.push(",.*:");
    		});
    	}
    
    	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
    		docElem.webkitMatchesSelector ||
    		docElem.mozMatchesSelector ||
    		docElem.oMatchesSelector ||
    		docElem.msMatchesSelector) )) ) {
    
    		assert(function( div ) {
    			// Check to see if it's possible to do matchesSelector
    			// on a disconnected node (IE 9)
    			support.disconnectedMatch = matches.call( div, "div" );
    
    			// This should fail with an exception
    			// Gecko does not error, returns false instead
    			matches.call( div, "[s!='']:x" );
    			rbuggyMatches.push( "!=", pseudos );
    		});
    	}
    
    	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
    	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
    
    	/* Contains
    	---------------------------------------------------------------------- */
    	hasCompare = rnative.test( docElem.compareDocumentPosition );
    
    	// Element contains another
    	// Purposefully self-exclusive
    	// As in, an element does not contain itself
    	contains = hasCompare || rnative.test( docElem.contains ) ?
    		function( a, b ) {
    			var adown = a.nodeType === 9 ? a.documentElement : a,
    				bup = b && b.parentNode;
    			return a === bup || !!( bup && bup.nodeType === 1 && (
    				adown.contains ?
    					adown.contains( bup ) :
    					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
    			));
    		} :
    		function( a, b ) {
    			if ( b ) {
    				while ( (b = b.parentNode) ) {
    					if ( b === a ) {
    						return true;
    					}
    				}
    			}
    			return false;
    		};
    
    	/* Sorting
    	---------------------------------------------------------------------- */
    
    	// Document order sorting
    	sortOrder = hasCompare ?
    	function( a, b ) {
    
    		// Flag for duplicate removal
    		if ( a === b ) {
    			hasDuplicate = true;
    			return 0;
    		}
    
    		// Sort on method existence if only one input has compareDocumentPosition
    		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
    		if ( compare ) {
    			return compare;
    		}
    
    		// Calculate position if both inputs belong to the same document
    		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
    			a.compareDocumentPosition( b ) :
    
    			// Otherwise we know they are disconnected
    			1;
    
    		// Disconnected nodes
    		if ( compare & 1 ||
    			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
    
    			// Choose the first element that is related to our preferred document
    			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
    				return -1;
    			}
    			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
    				return 1;
    			}
    
    			// Maintain original order
    			return sortInput ?
    				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    				0;
    		}
    
    		return compare & 4 ? -1 : 1;
    	} :
    	function( a, b ) {
    		// Exit early if the nodes are identical
    		if ( a === b ) {
    			hasDuplicate = true;
    			return 0;
    		}
    
    		var cur,
    			i = 0,
    			aup = a.parentNode,
    			bup = b.parentNode,
    			ap = [ a ],
    			bp = [ b ];
    
    		// Parentless nodes are either documents or disconnected
    		if ( !aup || !bup ) {
    			return a === document ? -1 :
    				b === document ? 1 :
    				aup ? -1 :
    				bup ? 1 :
    				sortInput ?
    				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    				0;
    
    		// If the nodes are siblings, we can do a quick check
    		} else if ( aup === bup ) {
    			return siblingCheck( a, b );
    		}
    
    		// Otherwise we need full lists of their ancestors for comparison
    		cur = a;
    		while ( (cur = cur.parentNode) ) {
    			ap.unshift( cur );
    		}
    		cur = b;
    		while ( (cur = cur.parentNode) ) {
    			bp.unshift( cur );
    		}
    
    		// Walk down the tree looking for a discrepancy
    		while ( ap[i] === bp[i] ) {
    			i++;
    		}
    
    		return i ?
    			// Do a sibling check if the nodes have a common ancestor
    			siblingCheck( ap[i], bp[i] ) :
    
    			// Otherwise nodes in our document sort first
    			ap[i] === preferredDoc ? -1 :
    			bp[i] === preferredDoc ? 1 :
    			0;
    	};
    
    	return document;
    };
    
    Sizzle.matches = function( expr, elements ) {
    	return Sizzle( expr, null, null, elements );
    };
    
    Sizzle.matchesSelector = function( elem, expr ) {
    	// Set document vars if needed
    	if ( ( elem.ownerDocument || elem ) !== document ) {
    		setDocument( elem );
    	}
    
    	// Make sure that attribute selectors are quoted
    	expr = expr.replace( rattributeQuotes, "='$1']" );
    
    	if ( support.matchesSelector && documentIsHTML &&
    		!compilerCache[ expr + " " ] &&
    		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
    		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
    
    		try {
    			var ret = matches.call( elem, expr );
    
    			// IE 9's matchesSelector returns false on disconnected nodes
    			if ( ret || support.disconnectedMatch ||
    					// As well, disconnected nodes are said to be in a document
    					// fragment in IE 9
    					elem.document && elem.document.nodeType !== 11 ) {
    				return ret;
    			}
    		} catch (e) {}
    	}
    
    	return Sizzle( expr, document, null, [ elem ] ).length > 0;
    };
    
    Sizzle.contains = function( context, elem ) {
    	// Set document vars if needed
    	if ( ( context.ownerDocument || context ) !== document ) {
    		setDocument( context );
    	}
    	return contains( context, elem );
    };
    
    Sizzle.attr = function( elem, name ) {
    	// Set document vars if needed
    	if ( ( elem.ownerDocument || elem ) !== document ) {
    		setDocument( elem );
    	}
    
    	var fn = Expr.attrHandle[ name.toLowerCase() ],
    		// Don't get fooled by Object.prototype properties (jQuery #13807)
    		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
    			fn( elem, name, !documentIsHTML ) :
    			undefined;
    
    	return val !== undefined ?
    		val :
    		support.attributes || !documentIsHTML ?
    			elem.getAttribute( name ) :
    			(val = elem.getAttributeNode(name)) && val.specified ?
    				val.value :
    				null;
    };
    
    Sizzle.error = function( msg ) {
    	throw new Error( "Syntax error, unrecognized expression: " + msg );
    };
    
    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function( results ) {
    	var elem,
    		duplicates = [],
    		j = 0,
    		i = 0;
    
    	// Unless we *know* we can detect duplicates, assume their presence
    	hasDuplicate = !support.detectDuplicates;
    	sortInput = !support.sortStable && results.slice( 0 );
    	results.sort( sortOrder );
    
    	if ( hasDuplicate ) {
    		while ( (elem = results[i++]) ) {
    			if ( elem === results[ i ] ) {
    				j = duplicates.push( i );
    			}
    		}
    		while ( j-- ) {
    			results.splice( duplicates[ j ], 1 );
    		}
    	}
    
    	// Clear input after sorting to release objects
    	// See https://github.com/jquery/sizzle/pull/225
    	sortInput = null;
    
    	return results;
    };
    
    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function( elem ) {
    	var node,
    		ret = "",
    		i = 0,
    		nodeType = elem.nodeType;
    
    	if ( !nodeType ) {
    		// If no nodeType, this is expected to be an array
    		while ( (node = elem[i++]) ) {
    			// Do not traverse comment nodes
    			ret += getText( node );
    		}
    	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
    		// Use textContent for elements
    		// innerText usage removed for consistency of new lines (jQuery #11153)
    		if ( typeof elem.textContent === "string" ) {
    			return elem.textContent;
    		} else {
    			// Traverse its children
    			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    				ret += getText( elem );
    			}
    		}
    	} else if ( nodeType === 3 || nodeType === 4 ) {
    		return elem.nodeValue;
    	}
    	// Do not include comment or processing instruction nodes
    
    	return ret;
    };
    
    Expr = Sizzle.selectors = {
    
    	// Can be adjusted by the user
    	cacheLength: 50,
    
    	createPseudo: markFunction,
    
    	match: matchExpr,
    
    	attrHandle: {},
    
    	find: {},
    
    	relative: {
    		">": { dir: "parentNode", first: true },
    		" ": { dir: "parentNode" },
    		"+": { dir: "previousSibling", first: true },
    		"~": { dir: "previousSibling" }
    	},
    
    	preFilter: {
    		"ATTR": function( match ) {
    			match[1] = match[1].replace( runescape, funescape );
    
    			// Move the given value to match[3] whether quoted or unquoted
    			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
    
    			if ( match[2] === "~=" ) {
    				match[3] = " " + match[3] + " ";
    			}
    
    			return match.slice( 0, 4 );
    		},
    
    		"CHILD": function( match ) {
    			/* matches from matchExpr["CHILD"]
    				1 type (only|nth|...)
    				2 what (child|of-type)
    				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
    				4 xn-component of xn+y argument ([+-]?\d*n|)
    				5 sign of xn-component
    				6 x of xn-component
    				7 sign of y-component
    				8 y of y-component
    			*/
    			match[1] = match[1].toLowerCase();
    
    			if ( match[1].slice( 0, 3 ) === "nth" ) {
    				// nth-* requires argument
    				if ( !match[3] ) {
    					Sizzle.error( match[0] );
    				}
    
    				// numeric x and y parameters for Expr.filter.CHILD
    				// remember that false/true cast respectively to 0/1
    				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
    				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
    
    			// other types prohibit arguments
    			} else if ( match[3] ) {
    				Sizzle.error( match[0] );
    			}
    
    			return match;
    		},
    
    		"PSEUDO": function( match ) {
    			var excess,
    				unquoted = !match[6] && match[2];
    
    			if ( matchExpr["CHILD"].test( match[0] ) ) {
    				return null;
    			}
    
    			// Accept quoted arguments as-is
    			if ( match[3] ) {
    				match[2] = match[4] || match[5] || "";
    
    			// Strip excess characters from unquoted arguments
    			} else if ( unquoted && rpseudo.test( unquoted ) &&
    				// Get excess from tokenize (recursively)
    				(excess = tokenize( unquoted, true )) &&
    				// advance to the next closing parenthesis
    				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
    
    				// excess is a negative index
    				match[0] = match[0].slice( 0, excess );
    				match[2] = unquoted.slice( 0, excess );
    			}
    
    			// Return only captures needed by the pseudo filter method (type and argument)
    			return match.slice( 0, 3 );
    		}
    	},
    
    	filter: {
    
    		"TAG": function( nodeNameSelector ) {
    			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
    			return nodeNameSelector === "*" ?
    				function() { return true; } :
    				function( elem ) {
    					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
    				};
    		},
    
    		"CLASS": function( className ) {
    			var pattern = classCache[ className + " " ];
    
    			return pattern ||
    				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
    				classCache( className, function( elem ) {
    					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
    				});
    		},
    
    		"ATTR": function( name, operator, check ) {
    			return function( elem ) {
    				var result = Sizzle.attr( elem, name );
    
    				if ( result == null ) {
    					return operator === "!=";
    				}
    				if ( !operator ) {
    					return true;
    				}
    
    				result += "";
    
    				return operator === "=" ? result === check :
    					operator === "!=" ? result !== check :
    					operator === "^=" ? check && result.indexOf( check ) === 0 :
    					operator === "*=" ? check && result.indexOf( check ) > -1 :
    					operator === "$=" ? check && result.slice( -check.length ) === check :
    					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
    					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
    					false;
    			};
    		},
    
    		"CHILD": function( type, what, argument, first, last ) {
    			var simple = type.slice( 0, 3 ) !== "nth",
    				forward = type.slice( -4 ) !== "last",
    				ofType = what === "of-type";
    
    			return first === 1 && last === 0 ?
    
    				// Shortcut for :nth-*(n)
    				function( elem ) {
    					return !!elem.parentNode;
    				} :
    
    				function( elem, context, xml ) {
    					var cache, uniqueCache, outerCache, node, nodeIndex, start,
    						dir = simple !== forward ? "nextSibling" : "previousSibling",
    						parent = elem.parentNode,
    						name = ofType && elem.nodeName.toLowerCase(),
    						useCache = !xml && !ofType,
    						diff = false;
    
    					if ( parent ) {
    
    						// :(first|last|only)-(child|of-type)
    						if ( simple ) {
    							while ( dir ) {
    								node = elem;
    								while ( (node = node[ dir ]) ) {
    									if ( ofType ?
    										node.nodeName.toLowerCase() === name :
    										node.nodeType === 1 ) {
    
    										return false;
    									}
    								}
    								// Reverse direction for :only-* (if we haven't yet done so)
    								start = dir = type === "only" && !start && "nextSibling";
    							}
    							return true;
    						}
    
    						start = [ forward ? parent.firstChild : parent.lastChild ];
    
    						// non-xml :nth-child(...) stores cache data on `parent`
    						if ( forward && useCache ) {
    
    							// Seek `elem` from a previously-cached index
    
    							// ...in a gzip-friendly way
    							node = parent;
    							outerCache = node[ expando ] || (node[ expando ] = {});
    
    							// Support: IE <9 only
    							// Defend against cloned attroperties (jQuery gh-1709)
    							uniqueCache = outerCache[ node.uniqueID ] ||
    								(outerCache[ node.uniqueID ] = {});
    
    							cache = uniqueCache[ type ] || [];
    							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    							diff = nodeIndex && cache[ 2 ];
    							node = nodeIndex && parent.childNodes[ nodeIndex ];
    
    							while ( (node = ++nodeIndex && node && node[ dir ] ||
    
    								// Fallback to seeking `elem` from the start
    								(diff = nodeIndex = 0) || start.pop()) ) {
    
    								// When found, cache indexes on `parent` and break
    								if ( node.nodeType === 1 && ++diff && node === elem ) {
    									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
    									break;
    								}
    							}
    
    						} else {
    							// Use previously-cached element index if available
    							if ( useCache ) {
    								// ...in a gzip-friendly way
    								node = elem;
    								outerCache = node[ expando ] || (node[ expando ] = {});
    
    								// Support: IE <9 only
    								// Defend against cloned attroperties (jQuery gh-1709)
    								uniqueCache = outerCache[ node.uniqueID ] ||
    									(outerCache[ node.uniqueID ] = {});
    
    								cache = uniqueCache[ type ] || [];
    								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    								diff = nodeIndex;
    							}
    
    							// xml :nth-child(...)
    							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
    							if ( diff === false ) {
    								// Use the same loop as above to seek `elem` from the start
    								while ( (node = ++nodeIndex && node && node[ dir ] ||
    									(diff = nodeIndex = 0) || start.pop()) ) {
    
    									if ( ( ofType ?
    										node.nodeName.toLowerCase() === name :
    										node.nodeType === 1 ) &&
    										++diff ) {
    
    										// Cache the index of each encountered element
    										if ( useCache ) {
    											outerCache = node[ expando ] || (node[ expando ] = {});
    
    											// Support: IE <9 only
    											// Defend against cloned attroperties (jQuery gh-1709)
    											uniqueCache = outerCache[ node.uniqueID ] ||
    												(outerCache[ node.uniqueID ] = {});
    
    											uniqueCache[ type ] = [ dirruns, diff ];
    										}
    
    										if ( node === elem ) {
    											break;
    										}
    									}
    								}
    							}
    						}
    
    						// Incorporate the offset, then check against cycle size
    						diff -= last;
    						return diff === first || ( diff % first === 0 && diff / first >= 0 );
    					}
    				};
    		},
    
    		"PSEUDO": function( pseudo, argument ) {
    			// pseudo-class names are case-insensitive
    			// http://www.w3.org/TR/selectors/#pseudo-classes
    			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
    			// Remember that setFilters inherits from pseudos
    			var args,
    				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
    					Sizzle.error( "unsupported pseudo: " + pseudo );
    
    			// The user may use createPseudo to indicate that
    			// arguments are needed to create the filter function
    			// just as Sizzle does
    			if ( fn[ expando ] ) {
    				return fn( argument );
    			}
    
    			// But maintain support for old signatures
    			if ( fn.length > 1 ) {
    				args = [ pseudo, pseudo, "", argument ];
    				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
    					markFunction(function( seed, matches ) {
    						var idx,
    							matched = fn( seed, argument ),
    							i = matched.length;
    						while ( i-- ) {
    							idx = indexOf( seed, matched[i] );
    							seed[ idx ] = !( matches[ idx ] = matched[i] );
    						}
    					}) :
    					function( elem ) {
    						return fn( elem, 0, args );
    					};
    			}
    
    			return fn;
    		}
    	},
    
    	pseudos: {
    		// Potentially complex pseudos
    		"not": markFunction(function( selector ) {
    			// Trim the selector passed to compile
    			// to avoid treating leading and trailing
    			// spaces as combinators
    			var input = [],
    				results = [],
    				matcher = compile( selector.replace( rtrim, "$1" ) );
    
    			return matcher[ expando ] ?
    				markFunction(function( seed, matches, context, xml ) {
    					var elem,
    						unmatched = matcher( seed, null, xml, [] ),
    						i = seed.length;
    
    					// Match elements unmatched by `matcher`
    					while ( i-- ) {
    						if ( (elem = unmatched[i]) ) {
    							seed[i] = !(matches[i] = elem);
    						}
    					}
    				}) :
    				function( elem, context, xml ) {
    					input[0] = elem;
    					matcher( input, null, xml, results );
    					// Don't keep the element (issue #299)
    					input[0] = null;
    					return !results.pop();
    				};
    		}),
    
    		"has": markFunction(function( selector ) {
    			return function( elem ) {
    				return Sizzle( selector, elem ).length > 0;
    			};
    		}),
    
    		"contains": markFunction(function( text ) {
    			text = text.replace( runescape, funescape );
    			return function( elem ) {
    				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
    			};
    		}),
    
    		// "Whether an element is represented by a :lang() selector
    		// is based solely on the element's language value
    		// being equal to the identifier C,
    		// or beginning with the identifier C immediately followed by "-".
    		// The matching of C against the element's language value is performed case-insensitively.
    		// The identifier C does not have to be a valid language name."
    		// http://www.w3.org/TR/selectors/#lang-pseudo
    		"lang": markFunction( function( lang ) {
    			// lang value must be a valid identifier
    			if ( !ridentifier.test(lang || "") ) {
    				Sizzle.error( "unsupported lang: " + lang );
    			}
    			lang = lang.replace( runescape, funescape ).toLowerCase();
    			return function( elem ) {
    				var elemLang;
    				do {
    					if ( (elemLang = documentIsHTML ?
    						elem.lang :
    						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
    
    						elemLang = elemLang.toLowerCase();
    						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
    					}
    				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
    				return false;
    			};
    		}),
    
    		// Miscellaneous
    		"target": function( elem ) {
    			var hash = window.location && window.location.hash;
    			return hash && hash.slice( 1 ) === elem.id;
    		},
    
    		"root": function( elem ) {
    			return elem === docElem;
    		},
    
    		"focus": function( elem ) {
    			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
    		},
    
    		// Boolean properties
    		"enabled": function( elem ) {
    			return elem.disabled === false;
    		},
    
    		"disabled": function( elem ) {
    			return elem.disabled === true;
    		},
    
    		"checked": function( elem ) {
    			// In CSS3, :checked should return both checked and selected elements
    			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    			var nodeName = elem.nodeName.toLowerCase();
    			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
    		},
    
    		"selected": function( elem ) {
    			// Accessing this property makes selected-by-default
    			// options in Safari work properly
    			if ( elem.parentNode ) {
    				elem.parentNode.selectedIndex;
    			}
    
    			return elem.selected === true;
    		},
    
    		// Contents
    		"empty": function( elem ) {
    			// http://www.w3.org/TR/selectors/#empty-pseudo
    			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
    			//   but not by others (comment: 8; processing instruction: 7; etc.)
    			// nodeType < 6 works because attributes (2) do not appear as children
    			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    				if ( elem.nodeType < 6 ) {
    					return false;
    				}
    			}
    			return true;
    		},
    
    		"parent": function( elem ) {
    			return !Expr.pseudos["empty"]( elem );
    		},
    
    		// Element/input types
    		"header": function( elem ) {
    			return rheader.test( elem.nodeName );
    		},
    
    		"input": function( elem ) {
    			return rinputs.test( elem.nodeName );
    		},
    
    		"button": function( elem ) {
    			var name = elem.nodeName.toLowerCase();
    			return name === "input" && elem.type === "button" || name === "button";
    		},
    
    		"text": function( elem ) {
    			var attr;
    			return elem.nodeName.toLowerCase() === "input" &&
    				elem.type === "text" &&
    
    				// Support: IE<8
    				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
    				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
    		},
    
    		// Position-in-collection
    		"first": createPositionalPseudo(function() {
    			return [ 0 ];
    		}),
    
    		"last": createPositionalPseudo(function( matchIndexes, length ) {
    			return [ length - 1 ];
    		}),
    
    		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
    			return [ argument < 0 ? argument + length : argument ];
    		}),
    
    		"even": createPositionalPseudo(function( matchIndexes, length ) {
    			var i = 0;
    			for ( ; i < length; i += 2 ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		}),
    
    		"odd": createPositionalPseudo(function( matchIndexes, length ) {
    			var i = 1;
    			for ( ; i < length; i += 2 ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		}),
    
    		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
    			var i = argument < 0 ? argument + length : argument;
    			for ( ; --i >= 0; ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		}),
    
    		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
    			var i = argument < 0 ? argument + length : argument;
    			for ( ; ++i < length; ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		})
    	}
    };
    
    Expr.pseudos["nth"] = Expr.pseudos["eq"];
    
    // Add button/input type pseudos
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    	Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
    	Expr.pseudos[ i ] = createButtonPseudo( i );
    }
    
    // Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();
    
    tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
    	var matched, match, tokens, type,
    		soFar, groups, preFilters,
    		cached = tokenCache[ selector + " " ];
    
    	if ( cached ) {
    		return parseOnly ? 0 : cached.slice( 0 );
    	}
    
    	soFar = selector;
    	groups = [];
    	preFilters = Expr.preFilter;
    
    	while ( soFar ) {
    
    		// Comma and first run
    		if ( !matched || (match = rcomma.exec( soFar )) ) {
    			if ( match ) {
    				// Don't consume trailing commas as valid
    				soFar = soFar.slice( match[0].length ) || soFar;
    			}
    			groups.push( (tokens = []) );
    		}
    
    		matched = false;
    
    		// Combinators
    		if ( (match = rcombinators.exec( soFar )) ) {
    			matched = match.shift();
    			tokens.push({
    				value: matched,
    				// Cast descendant combinators to space
    				type: match[0].replace( rtrim, " " )
    			});
    			soFar = soFar.slice( matched.length );
    		}
    
    		// Filters
    		for ( type in Expr.filter ) {
    			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
    				(match = preFilters[ type ]( match ))) ) {
    				matched = match.shift();
    				tokens.push({
    					value: matched,
    					type: type,
    					matches: match
    				});
    				soFar = soFar.slice( matched.length );
    			}
    		}
    
    		if ( !matched ) {
    			break;
    		}
    	}
    
    	// Return the length of the invalid excess
    	// if we're just parsing
    	// Otherwise, throw an error or return tokens
    	return parseOnly ?
    		soFar.length :
    		soFar ?
    			Sizzle.error( selector ) :
    			// Cache the tokens
    			tokenCache( selector, groups ).slice( 0 );
    };
    
    function toSelector( tokens ) {
    	var i = 0,
    		len = tokens.length,
    		selector = "";
    	for ( ; i < len; i++ ) {
    		selector += tokens[i].value;
    	}
    	return selector;
    }
    
    function addCombinator( matcher, combinator, base ) {
    	var dir = combinator.dir,
    		checkNonElements = base && dir === "parentNode",
    		doneName = done++;
    
    	return combinator.first ?
    		// Check against closest ancestor/preceding element
    		function( elem, context, xml ) {
    			while ( (elem = elem[ dir ]) ) {
    				if ( elem.nodeType === 1 || checkNonElements ) {
    					return matcher( elem, context, xml );
    				}
    			}
    		} :
    
    		// Check against all ancestor/preceding elements
    		function( elem, context, xml ) {
    			var oldCache, uniqueCache, outerCache,
    				newCache = [ dirruns, doneName ];
    
    			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
    			if ( xml ) {
    				while ( (elem = elem[ dir ]) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						if ( matcher( elem, context, xml ) ) {
    							return true;
    						}
    					}
    				}
    			} else {
    				while ( (elem = elem[ dir ]) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						outerCache = elem[ expando ] || (elem[ expando ] = {});
    
    						// Support: IE <9 only
    						// Defend against cloned attroperties (jQuery gh-1709)
    						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});
    
    						if ( (oldCache = uniqueCache[ dir ]) &&
    							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
    
    							// Assign to newCache so results back-propagate to previous elements
    							return (newCache[ 2 ] = oldCache[ 2 ]);
    						} else {
    							// Reuse newcache so results back-propagate to previous elements
    							uniqueCache[ dir ] = newCache;
    
    							// A match means we're done; a fail means we have to keep checking
    							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
    								return true;
    							}
    						}
    					}
    				}
    			}
    		};
    }
    
    function elementMatcher( matchers ) {
    	return matchers.length > 1 ?
    		function( elem, context, xml ) {
    			var i = matchers.length;
    			while ( i-- ) {
    				if ( !matchers[i]( elem, context, xml ) ) {
    					return false;
    				}
    			}
    			return true;
    		} :
    		matchers[0];
    }
    
    function multipleContexts( selector, contexts, results ) {
    	var i = 0,
    		len = contexts.length;
    	for ( ; i < len; i++ ) {
    		Sizzle( selector, contexts[i], results );
    	}
    	return results;
    }
    
    function condense( unmatched, map, filter, context, xml ) {
    	var elem,
    		newUnmatched = [],
    		i = 0,
    		len = unmatched.length,
    		mapped = map != null;
    
    	for ( ; i < len; i++ ) {
    		if ( (elem = unmatched[i]) ) {
    			if ( !filter || filter( elem, context, xml ) ) {
    				newUnmatched.push( elem );
    				if ( mapped ) {
    					map.push( i );
    				}
    			}
    		}
    	}
    
    	return newUnmatched;
    }
    
    function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    	if ( postFilter && !postFilter[ expando ] ) {
    		postFilter = setMatcher( postFilter );
    	}
    	if ( postFinder && !postFinder[ expando ] ) {
    		postFinder = setMatcher( postFinder, postSelector );
    	}
    	return markFunction(function( seed, results, context, xml ) {
    		var temp, i, elem,
    			preMap = [],
    			postMap = [],
    			preexisting = results.length,
    
    			// Get initial elements from seed or context
    			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
    
    			// Prefilter to get matcher input, preserving a map for seed-results synchronization
    			matcherIn = preFilter && ( seed || !selector ) ?
    				condense( elems, preMap, preFilter, context, xml ) :
    				elems,
    
    			matcherOut = matcher ?
    				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
    				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
    
    					// ...intermediate processing is necessary
    					[] :
    
    					// ...otherwise use results directly
    					results :
    				matcherIn;
    
    		// Find primary matches
    		if ( matcher ) {
    			matcher( matcherIn, matcherOut, context, xml );
    		}
    
    		// Apply postFilter
    		if ( postFilter ) {
    			temp = condense( matcherOut, postMap );
    			postFilter( temp, [], context, xml );
    
    			// Un-match failing elements by moving them back to matcherIn
    			i = temp.length;
    			while ( i-- ) {
    				if ( (elem = temp[i]) ) {
    					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
    				}
    			}
    		}
    
    		if ( seed ) {
    			if ( postFinder || preFilter ) {
    				if ( postFinder ) {
    					// Get the final matcherOut by condensing this intermediate into postFinder contexts
    					temp = [];
    					i = matcherOut.length;
    					while ( i-- ) {
    						if ( (elem = matcherOut[i]) ) {
    							// Restore matcherIn since elem is not yet a final match
    							temp.push( (matcherIn[i] = elem) );
    						}
    					}
    					postFinder( null, (matcherOut = []), temp, xml );
    				}
    
    				// Move matched elements from seed to results to keep them synchronized
    				i = matcherOut.length;
    				while ( i-- ) {
    					if ( (elem = matcherOut[i]) &&
    						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
    
    						seed[temp] = !(results[temp] = elem);
    					}
    				}
    			}
    
    		// Add elements to results, through postFinder if defined
    		} else {
    			matcherOut = condense(
    				matcherOut === results ?
    					matcherOut.splice( preexisting, matcherOut.length ) :
    					matcherOut
    			);
    			if ( postFinder ) {
    				postFinder( null, results, matcherOut, xml );
    			} else {
    				push.apply( results, matcherOut );
    			}
    		}
    	});
    }
    
    function matcherFromTokens( tokens ) {
    	var checkContext, matcher, j,
    		len = tokens.length,
    		leadingRelative = Expr.relative[ tokens[0].type ],
    		implicitRelative = leadingRelative || Expr.relative[" "],
    		i = leadingRelative ? 1 : 0,
    
    		// The foundational matcher ensures that elements are reachable from top-level context(s)
    		matchContext = addCombinator( function( elem ) {
    			return elem === checkContext;
    		}, implicitRelative, true ),
    		matchAnyContext = addCombinator( function( elem ) {
    			return indexOf( checkContext, elem ) > -1;
    		}, implicitRelative, true ),
    		matchers = [ function( elem, context, xml ) {
    			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
    				(checkContext = context).nodeType ?
    					matchContext( elem, context, xml ) :
    					matchAnyContext( elem, context, xml ) );
    			// Avoid hanging onto element (issue #299)
    			checkContext = null;
    			return ret;
    		} ];
    
    	for ( ; i < len; i++ ) {
    		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
    			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
    		} else {
    			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
    
    			// Return special upon seeing a positional matcher
    			if ( matcher[ expando ] ) {
    				// Find the next relative operator (if any) for proper handling
    				j = ++i;
    				for ( ; j < len; j++ ) {
    					if ( Expr.relative[ tokens[j].type ] ) {
    						break;
    					}
    				}
    				return setMatcher(
    					i > 1 && elementMatcher( matchers ),
    					i > 1 && toSelector(
    						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
    						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
    					).replace( rtrim, "$1" ),
    					matcher,
    					i < j && matcherFromTokens( tokens.slice( i, j ) ),
    					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
    					j < len && toSelector( tokens )
    				);
    			}
    			matchers.push( matcher );
    		}
    	}
    
    	return elementMatcher( matchers );
    }
    
    function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    	var bySet = setMatchers.length > 0,
    		byElement = elementMatchers.length > 0,
    		superMatcher = function( seed, context, xml, results, outermost ) {
    			var elem, j, matcher,
    				matchedCount = 0,
    				i = "0",
    				unmatched = seed && [],
    				setMatched = [],
    				contextBackup = outermostContext,
    				// We must always have either seed elements or outermost context
    				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
    				// Use integer dirruns iff this is the outermost matcher
    				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
    				len = elems.length;
    
    			if ( outermost ) {
    				outermostContext = context === document || context || outermost;
    			}
    
    			// Add elements passing elementMatchers directly to results
    			// Support: IE<9, Safari
    			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
    			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
    				if ( byElement && elem ) {
    					j = 0;
    					if ( !context && elem.ownerDocument !== document ) {
    						setDocument( elem );
    						xml = !documentIsHTML;
    					}
    					while ( (matcher = elementMatchers[j++]) ) {
    						if ( matcher( elem, context || document, xml) ) {
    							results.push( elem );
    							break;
    						}
    					}
    					if ( outermost ) {
    						dirruns = dirrunsUnique;
    					}
    				}
    
    				// Track unmatched elements for set filters
    				if ( bySet ) {
    					// They will have gone through all possible matchers
    					if ( (elem = !matcher && elem) ) {
    						matchedCount--;
    					}
    
    					// Lengthen the array for every element, matched or not
    					if ( seed ) {
    						unmatched.push( elem );
    					}
    				}
    			}
    
    			// `i` is now the count of elements visited above, and adding it to `matchedCount`
    			// makes the latter nonnegative.
    			matchedCount += i;
    
    			// Apply set filters to unmatched elements
    			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
    			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
    			// no element matchers and no seed.
    			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
    			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
    			// numerically zero.
    			if ( bySet && i !== matchedCount ) {
    				j = 0;
    				while ( (matcher = setMatchers[j++]) ) {
    					matcher( unmatched, setMatched, context, xml );
    				}
    
    				if ( seed ) {
    					// Reintegrate element matches to eliminate the need for sorting
    					if ( matchedCount > 0 ) {
    						while ( i-- ) {
    							if ( !(unmatched[i] || setMatched[i]) ) {
    								setMatched[i] = pop.call( results );
    							}
    						}
    					}
    
    					// Discard index placeholder values to get only actual matches
    					setMatched = condense( setMatched );
    				}
    
    				// Add matches to results
    				push.apply( results, setMatched );
    
    				// Seedless set matches succeeding multiple successful matchers stipulate sorting
    				if ( outermost && !seed && setMatched.length > 0 &&
    					( matchedCount + setMatchers.length ) > 1 ) {
    
    					Sizzle.uniqueSort( results );
    				}
    			}
    
    			// Override manipulation of globals by nested matchers
    			if ( outermost ) {
    				dirruns = dirrunsUnique;
    				outermostContext = contextBackup;
    			}
    
    			return unmatched;
    		};
    
    	return bySet ?
    		markFunction( superMatcher ) :
    		superMatcher;
    }
    
    compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
    	var i,
    		setMatchers = [],
    		elementMatchers = [],
    		cached = compilerCache[ selector + " " ];
    
    	if ( !cached ) {
    		// Generate a function of recursive functions that can be used to check each element
    		if ( !match ) {
    			match = tokenize( selector );
    		}
    		i = match.length;
    		while ( i-- ) {
    			cached = matcherFromTokens( match[i] );
    			if ( cached[ expando ] ) {
    				setMatchers.push( cached );
    			} else {
    				elementMatchers.push( cached );
    			}
    		}
    
    		// Cache the compiled function
    		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
    
    		// Save selector and tokenization
    		cached.selector = selector;
    	}
    	return cached;
    };
    
    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */
    select = Sizzle.select = function( selector, context, results, seed ) {
    	var i, tokens, token, type, find,
    		compiled = typeof selector === "function" && selector,
    		match = !seed && tokenize( (selector = compiled.selector || selector) );
    
    	results = results || [];
    
    	// Try to minimize operations if there is only one selector in the list and no seed
    	// (the latter of which guarantees us context)
    	if ( match.length === 1 ) {
    
    		// Reduce context if the leading compound selector is an ID
    		tokens = match[0] = match[0].slice( 0 );
    		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
    				support.getById && context.nodeType === 9 && documentIsHTML &&
    				Expr.relative[ tokens[1].type ] ) {
    
    			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
    			if ( !context ) {
    				return results;
    
    			// Precompiled matchers will still verify ancestry, so step up a level
    			} else if ( compiled ) {
    				context = context.parentNode;
    			}
    
    			selector = selector.slice( tokens.shift().value.length );
    		}
    
    		// Fetch a seed set for right-to-left matching
    		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
    		while ( i-- ) {
    			token = tokens[i];
    
    			// Abort if we hit a combinator
    			if ( Expr.relative[ (type = token.type) ] ) {
    				break;
    			}
    			if ( (find = Expr.find[ type ]) ) {
    				// Search, expanding context for leading sibling combinators
    				if ( (seed = find(
    					token.matches[0].replace( runescape, funescape ),
    					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
    				)) ) {
    
    					// If seed is empty or no tokens remain, we can return early
    					tokens.splice( i, 1 );
    					selector = seed.length && toSelector( tokens );
    					if ( !selector ) {
    						push.apply( results, seed );
    						return results;
    					}
    
    					break;
    				}
    			}
    		}
    	}
    
    	// Compile and execute a filtering function if one is not provided
    	// Provide `match` to avoid retokenization if we modified the selector above
    	( compiled || compile( selector, match ) )(
    		seed,
    		context,
    		!documentIsHTML,
    		results,
    		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
    	);
    	return results;
    };
    
    // One-time assignments
    
    // Sort stability
    support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
    
    // Support: Chrome 14-35+
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = !!hasDuplicate;
    
    // Initialize against the default document
    setDocument();
    
    // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*
    support.sortDetached = assert(function( div1 ) {
    	// Should return 1, but returns 4 (following)
    	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
    });
    
    // Support: IE<8
    // Prevent attribute/property "interpolation"
    // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !assert(function( div ) {
    	div.innerHTML = "<a href='#'></a>";
    	return div.firstChild.getAttribute("href") === "#" ;
    }) ) {
    	addHandle( "type|href|height|width", function( elem, name, isXML ) {
    		if ( !isXML ) {
    			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
    		}
    	});
    }
    
    // Support: IE<9
    // Use defaultValue in place of getAttribute("value")
    if ( !support.attributes || !assert(function( div ) {
    	div.innerHTML = "<input/>";
    	div.firstChild.setAttribute( "value", "" );
    	return div.firstChild.getAttribute( "value" ) === "";
    }) ) {
    	addHandle( "value", function( elem, name, isXML ) {
    		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
    			return elem.defaultValue;
    		}
    	});
    }
    
    // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies
    if ( !assert(function( div ) {
    	return div.getAttribute("disabled") == null;
    }) ) {
    	addHandle( booleans, function( elem, name, isXML ) {
    		var val;
    		if ( !isXML ) {
    			return elem[ name ] === true ? name.toLowerCase() :
    					(val = elem.getAttributeNode( name )) && val.specified ?
    					val.value :
    				null;
    		}
    	});
    }
    
    return Sizzle;
    
    })( window );
    
    
    
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[ ":" ] = jQuery.expr.pseudos;
    jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    
    
    
    var dir = function( elem, dir, until ) {
    	var matched = [],
    		truncate = until !== undefined;
    
    	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
    		if ( elem.nodeType === 1 ) {
    			if ( truncate && jQuery( elem ).is( until ) ) {
    				break;
    			}
    			matched.push( elem );
    		}
    	}
    	return matched;
    };
    
    
    var siblings = function( n, elem ) {
    	var matched = [];
    
    	for ( ; n; n = n.nextSibling ) {
    		if ( n.nodeType === 1 && n !== elem ) {
    			matched.push( n );
    		}
    	}
    
    	return matched;
    };
    
    
    var rneedsContext = jQuery.expr.match.needsContext;
    
    var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );
    
    
    
    var risSimple = /^.[^:#\[\.,]*$/;
    
    // Implement the identical functionality for filter and not
    function winnow( elements, qualifier, not ) {
    	if ( jQuery.isFunction( qualifier ) ) {
    		return jQuery.grep( elements, function( elem, i ) {
    			/* jshint -W018 */
    			return !!qualifier.call( elem, i, elem ) !== not;
    		} );
    
    	}
    
    	if ( qualifier.nodeType ) {
    		return jQuery.grep( elements, function( elem ) {
    			return ( elem === qualifier ) !== not;
    		} );
    
    	}
    
    	if ( typeof qualifier === "string" ) {
    		if ( risSimple.test( qualifier ) ) {
    			return jQuery.filter( qualifier, elements, not );
    		}
    
    		qualifier = jQuery.filter( qualifier, elements );
    	}
    
    	return jQuery.grep( elements, function( elem ) {
    		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
    	} );
    }
    
    jQuery.filter = function( expr, elems, not ) {
    	var elem = elems[ 0 ];
    
    	if ( not ) {
    		expr = ":not(" + expr + ")";
    	}
    
    	return elems.length === 1 && elem.nodeType === 1 ?
    		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
    		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
    			return elem.nodeType === 1;
    		} ) );
    };
    
    jQuery.fn.extend( {
    	find: function( selector ) {
    		var i,
    			len = this.length,
    			ret = [],
    			self = this;
    
    		if ( typeof selector !== "string" ) {
    			return this.pushStack( jQuery( selector ).filter( function() {
    				for ( i = 0; i < len; i++ ) {
    					if ( jQuery.contains( self[ i ], this ) ) {
    						return true;
    					}
    				}
    			} ) );
    		}
    
    		for ( i = 0; i < len; i++ ) {
    			jQuery.find( selector, self[ i ], ret );
    		}
    
    		// Needed because $( selector, context ) becomes $( context ).find( selector )
    		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
    		ret.selector = this.selector ? this.selector + " " + selector : selector;
    		return ret;
    	},
    	filter: function( selector ) {
    		return this.pushStack( winnow( this, selector || [], false ) );
    	},
    	not: function( selector ) {
    		return this.pushStack( winnow( this, selector || [], true ) );
    	},
    	is: function( selector ) {
    		return !!winnow(
    			this,
    
    			// If this is a positional/relative selector, check membership in the returned set
    			// so $("p:first").is("p:last") won't return true for a doc with two "p".
    			typeof selector === "string" && rneedsContext.test( selector ) ?
    				jQuery( selector ) :
    				selector || [],
    			false
    		).length;
    	}
    } );
    
    
    // Initialize a jQuery object
    
    
    // A central reference to the root jQuery(document)
    var rootjQuery,
    
    	// A simple way to check for HTML strings
    	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    	// Strict HTML recognition (#11290: must start with <)
    	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    
    	init = jQuery.fn.init = function( selector, context, root ) {
    		var match, elem;
    
    		// HANDLE: $(""), $(null), $(undefined), $(false)
    		if ( !selector ) {
    			return this;
    		}
    
    		// Method init() accepts an alternate rootjQuery
    		// so migrate can support jQuery.sub (gh-2101)
    		root = root || rootjQuery;
    
    		// Handle HTML strings
    		if ( typeof selector === "string" ) {
    			if ( selector[ 0 ] === "<" &&
    				selector[ selector.length - 1 ] === ">" &&
    				selector.length >= 3 ) {
    
    				// Assume that strings that start and end with <> are HTML and skip the regex check
    				match = [ null, selector, null ];
    
    			} else {
    				match = rquickExpr.exec( selector );
    			}
    
    			// Match html or make sure no context is specified for #id
    			if ( match && ( match[ 1 ] || !context ) ) {
    
    				// HANDLE: $(html) -> $(array)
    				if ( match[ 1 ] ) {
    					context = context instanceof jQuery ? context[ 0 ] : context;
    
    					// Option to run scripts is true for back-compat
    					// Intentionally let the error be thrown if parseHTML is not present
    					jQuery.merge( this, jQuery.parseHTML(
    						match[ 1 ],
    						context && context.nodeType ? context.ownerDocument || context : document,
    						true
    					) );
    
    					// HANDLE: $(html, props)
    					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
    						for ( match in context ) {
    
    							// Properties of context are called as methods if possible
    							if ( jQuery.isFunction( this[ match ] ) ) {
    								this[ match ]( context[ match ] );
    
    							// ...and otherwise set as attributes
    							} else {
    								this.attr( match, context[ match ] );
    							}
    						}
    					}
    
    					return this;
    
    				// HANDLE: $(#id)
    				} else {
    					elem = document.getElementById( match[ 2 ] );
    
    					// Support: Blackberry 4.6
    					// gEBID returns nodes no longer in the document (#6963)
    					if ( elem && elem.parentNode ) {
    
    						// Inject the element directly into the jQuery object
    						this.length = 1;
    						this[ 0 ] = elem;
    					}
    
    					this.context = document;
    					this.selector = selector;
    					return this;
    				}
    
    			// HANDLE: $(expr, $(...))
    			} else if ( !context || context.jquery ) {
    				return ( context || root ).find( selector );
    
    			// HANDLE: $(expr, context)
    			// (which is just equivalent to: $(context).find(expr)
    			} else {
    				return this.constructor( context ).find( selector );
    			}
    
    		// HANDLE: $(DOMElement)
    		} else if ( selector.nodeType ) {
    			this.context = this[ 0 ] = selector;
    			this.length = 1;
    			return this;
    
    		// HANDLE: $(function)
    		// Shortcut for document ready
    		} else if ( jQuery.isFunction( selector ) ) {
    			return root.ready !== undefined ?
    				root.ready( selector ) :
    
    				// Execute immediately if ready is not present
    				selector( jQuery );
    		}
    
    		if ( selector.selector !== undefined ) {
    			this.selector = selector.selector;
    			this.context = selector.context;
    		}
    
    		return jQuery.makeArray( selector, this );
    	};
    
    // Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn;
    
    // Initialize central reference
    rootjQuery = jQuery( document );
    
    
    var rparentsprev = /^(?:parents|prev(?:Until|All))/,
    
    	// Methods guaranteed to produce a unique set when starting from a unique set
    	guaranteedUnique = {
    		children: true,
    		contents: true,
    		next: true,
    		prev: true
    	};
    
    jQuery.fn.extend( {
    	has: function( target ) {
    		var targets = jQuery( target, this ),
    			l = targets.length;
    
    		return this.filter( function() {
    			var i = 0;
    			for ( ; i < l; i++ ) {
    				if ( jQuery.contains( this, targets[ i ] ) ) {
    					return true;
    				}
    			}
    		} );
    	},
    
    	closest: function( selectors, context ) {
    		var cur,
    			i = 0,
    			l = this.length,
    			matched = [],
    			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
    				jQuery( selectors, context || this.context ) :
    				0;
    
    		for ( ; i < l; i++ ) {
    			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
    
    				// Always skip document fragments
    				if ( cur.nodeType < 11 && ( pos ?
    					pos.index( cur ) > -1 :
    
    					// Don't pass non-elements to Sizzle
    					cur.nodeType === 1 &&
    						jQuery.find.matchesSelector( cur, selectors ) ) ) {
    
    					matched.push( cur );
    					break;
    				}
    			}
    		}
    
    		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
    	},
    
    	// Determine the position of an element within the set
    	index: function( elem ) {
    
    		// No argument, return index in parent
    		if ( !elem ) {
    			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
    		}
    
    		// Index in selector
    		if ( typeof elem === "string" ) {
    			return indexOf.call( jQuery( elem ), this[ 0 ] );
    		}
    
    		// Locate the position of the desired element
    		return indexOf.call( this,
    
    			// If it receives a jQuery object, the first element is used
    			elem.jquery ? elem[ 0 ] : elem
    		);
    	},
    
    	add: function( selector, context ) {
    		return this.pushStack(
    			jQuery.uniqueSort(
    				jQuery.merge( this.get(), jQuery( selector, context ) )
    			)
    		);
    	},
    
    	addBack: function( selector ) {
    		return this.add( selector == null ?
    			this.prevObject : this.prevObject.filter( selector )
    		);
    	}
    } );
    
    function sibling( cur, dir ) {
    	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
    	return cur;
    }
    
    jQuery.each( {
    	parent: function( elem ) {
    		var parent = elem.parentNode;
    		return parent && parent.nodeType !== 11 ? parent : null;
    	},
    	parents: function( elem ) {
    		return dir( elem, "parentNode" );
    	},
    	parentsUntil: function( elem, i, until ) {
    		return dir( elem, "parentNode", until );
    	},
    	next: function( elem ) {
    		return sibling( elem, "nextSibling" );
    	},
    	prev: function( elem ) {
    		return sibling( elem, "previousSibling" );
    	},
    	nextAll: function( elem ) {
    		return dir( elem, "nextSibling" );
    	},
    	prevAll: function( elem ) {
    		return dir( elem, "previousSibling" );
    	},
    	nextUntil: function( elem, i, until ) {
    		return dir( elem, "nextSibling", until );
    	},
    	prevUntil: function( elem, i, until ) {
    		return dir( elem, "previousSibling", until );
    	},
    	siblings: function( elem ) {
    		return siblings( ( elem.parentNode || {} ).firstChild, elem );
    	},
    	children: function( elem ) {
    		return siblings( elem.firstChild );
    	},
    	contents: function( elem ) {
    		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
    	}
    }, function( name, fn ) {
    	jQuery.fn[ name ] = function( until, selector ) {
    		var matched = jQuery.map( this, fn, until );
    
    		if ( name.slice( -5 ) !== "Until" ) {
    			selector = until;
    		}
    
    		if ( selector && typeof selector === "string" ) {
    			matched = jQuery.filter( selector, matched );
    		}
    
    		if ( this.length > 1 ) {
    
    			// Remove duplicates
    			if ( !guaranteedUnique[ name ] ) {
    				jQuery.uniqueSort( matched );
    			}
    
    			// Reverse order for parents* and prev-derivatives
    			if ( rparentsprev.test( name ) ) {
    				matched.reverse();
    			}
    		}
    
    		return this.pushStack( matched );
    	};
    } );
    var rnotwhite = ( /\S+/g );
    
    
    
    // Convert String-formatted options into Object-formatted ones
    function createOptions( options ) {
    	var object = {};
    	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
    		object[ flag ] = true;
    	} );
    	return object;
    }
    
    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function( options ) {
    
    	// Convert options from String-formatted to Object-formatted if needed
    	// (we check in cache first)
    	options = typeof options === "string" ?
    		createOptions( options ) :
    		jQuery.extend( {}, options );
    
    	var // Flag to know if list is currently firing
    		firing,
    
    		// Last fire value for non-forgettable lists
    		memory,
    
    		// Flag to know if list was already fired
    		fired,
    
    		// Flag to prevent firing
    		locked,
    
    		// Actual callback list
    		list = [],
    
    		// Queue of execution data for repeatable lists
    		queue = [],
    
    		// Index of currently firing callback (modified by add/remove as needed)
    		firingIndex = -1,
    
    		// Fire callbacks
    		fire = function() {
    
    			// Enforce single-firing
    			locked = options.once;
    
    			// Execute callbacks for all pending executions,
    			// respecting firingIndex overrides and runtime changes
    			fired = firing = true;
    			for ( ; queue.length; firingIndex = -1 ) {
    				memory = queue.shift();
    				while ( ++firingIndex < list.length ) {
    
    					// Run callback and check for early termination
    					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
    						options.stopOnFalse ) {
    
    						// Jump to end and forget the data so .add doesn't re-fire
    						firingIndex = list.length;
    						memory = false;
    					}
    				}
    			}
    
    			// Forget the data if we're done with it
    			if ( !options.memory ) {
    				memory = false;
    			}
    
    			firing = false;
    
    			// Clean up if we're done firing for good
    			if ( locked ) {
    
    				// Keep an empty list if we have data for future add calls
    				if ( memory ) {
    					list = [];
    
    				// Otherwise, this object is spent
    				} else {
    					list = "";
    				}
    			}
    		},
    
    		// Actual Callbacks object
    		self = {
    
    			// Add a callback or a collection of callbacks to the list
    			add: function() {
    				if ( list ) {
    
    					// If we have memory from a past run, we should fire after adding
    					if ( memory && !firing ) {
    						firingIndex = list.length - 1;
    						queue.push( memory );
    					}
    
    					( function add( args ) {
    						jQuery.each( args, function( _, arg ) {
    							if ( jQuery.isFunction( arg ) ) {
    								if ( !options.unique || !self.has( arg ) ) {
    									list.push( arg );
    								}
    							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {
    
    								// Inspect recursively
    								add( arg );
    							}
    						} );
    					} )( arguments );
    
    					if ( memory && !firing ) {
    						fire();
    					}
    				}
    				return this;
    			},
    
    			// Remove a callback from the list
    			remove: function() {
    				jQuery.each( arguments, function( _, arg ) {
    					var index;
    					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
    						list.splice( index, 1 );
    
    						// Handle firing indexes
    						if ( index <= firingIndex ) {
    							firingIndex--;
    						}
    					}
    				} );
    				return this;
    			},
    
    			// Check if a given callback is in the list.
    			// If no argument is given, return whether or not list has callbacks attached.
    			has: function( fn ) {
    				return fn ?
    					jQuery.inArray( fn, list ) > -1 :
    					list.length > 0;
    			},
    
    			// Remove all callbacks from the list
    			empty: function() {
    				if ( list ) {
    					list = [];
    				}
    				return this;
    			},
    
    			// Disable .fire and .add
    			// Abort any current/pending executions
    			// Clear all callbacks and values
    			disable: function() {
    				locked = queue = [];
    				list = memory = "";
    				return this;
    			},
    			disabled: function() {
    				return !list;
    			},
    
    			// Disable .fire
    			// Also disable .add unless we have memory (since it would have no effect)
    			// Abort any pending executions
    			lock: function() {
    				locked = queue = [];
    				if ( !memory ) {
    					list = memory = "";
    				}
    				return this;
    			},
    			locked: function() {
    				return !!locked;
    			},
    
    			// Call all callbacks with the given context and arguments
    			fireWith: function( context, args ) {
    				if ( !locked ) {
    					args = args || [];
    					args = [ context, args.slice ? args.slice() : args ];
    					queue.push( args );
    					if ( !firing ) {
    						fire();
    					}
    				}
    				return this;
    			},
    
    			// Call all the callbacks with the given arguments
    			fire: function() {
    				self.fireWith( this, arguments );
    				return this;
    			},
    
    			// To know if the callbacks have already been called at least once
    			fired: function() {
    				return !!fired;
    			}
    		};
    
    	return self;
    };
    
    
    jQuery.extend( {
    
    	Deferred: function( func ) {
    		var tuples = [
    
    				// action, add listener, listener list, final state
    				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
    				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
    				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
    			],
    			state = "pending",
    			promise = {
    				state: function() {
    					return state;
    				},
    				always: function() {
    					deferred.done( arguments ).fail( arguments );
    					return this;
    				},
    				then: function( /* fnDone, fnFail, fnProgress */ ) {
    					var fns = arguments;
    					return jQuery.Deferred( function( newDefer ) {
    						jQuery.each( tuples, function( i, tuple ) {
    							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
    
    							// deferred[ done | fail | progress ] for forwarding actions to newDefer
    							deferred[ tuple[ 1 ] ]( function() {
    								var returned = fn && fn.apply( this, arguments );
    								if ( returned && jQuery.isFunction( returned.promise ) ) {
    									returned.promise()
    										.progress( newDefer.notify )
    										.done( newDefer.resolve )
    										.fail( newDefer.reject );
    								} else {
    									newDefer[ tuple[ 0 ] + "With" ](
    										this === promise ? newDefer.promise() : this,
    										fn ? [ returned ] : arguments
    									);
    								}
    							} );
    						} );
    						fns = null;
    					} ).promise();
    				},
    
    				// Get a promise for this deferred
    				// If obj is provided, the promise aspect is added to the object
    				promise: function( obj ) {
    					return obj != null ? jQuery.extend( obj, promise ) : promise;
    				}
    			},
    			deferred = {};
    
    		// Keep pipe for back-compat
    		promise.pipe = promise.then;
    
    		// Add list-specific methods
    		jQuery.each( tuples, function( i, tuple ) {
    			var list = tuple[ 2 ],
    				stateString = tuple[ 3 ];
    
    			// promise[ done | fail | progress ] = list.add
    			promise[ tuple[ 1 ] ] = list.add;
    
    			// Handle state
    			if ( stateString ) {
    				list.add( function() {
    
    					// state = [ resolved | rejected ]
    					state = stateString;
    
    				// [ reject_list | resolve_list ].disable; progress_list.lock
    				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
    			}
    
    			// deferred[ resolve | reject | notify ]
    			deferred[ tuple[ 0 ] ] = function() {
    				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
    				return this;
    			};
    			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
    		} );
    
    		// Make the deferred a promise
    		promise.promise( deferred );
    
    		// Call given func if any
    		if ( func ) {
    			func.call( deferred, deferred );
    		}
    
    		// All done!
    		return deferred;
    	},
    
    	// Deferred helper
    	when: function( subordinate /* , ..., subordinateN */ ) {
    		var i = 0,
    			resolveValues = slice.call( arguments ),
    			length = resolveValues.length,
    
    			// the count of uncompleted subordinates
    			remaining = length !== 1 ||
    				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
    
    			// the master Deferred.
    			// If resolveValues consist of only a single Deferred, just use that.
    			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
    
    			// Update function for both resolve and progress values
    			updateFunc = function( i, contexts, values ) {
    				return function( value ) {
    					contexts[ i ] = this;
    					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
    					if ( values === progressValues ) {
    						deferred.notifyWith( contexts, values );
    					} else if ( !( --remaining ) ) {
    						deferred.resolveWith( contexts, values );
    					}
    				};
    			},
    
    			progressValues, progressContexts, resolveContexts;
    
    		// Add listeners to Deferred subordinates; treat others as resolved
    		if ( length > 1 ) {
    			progressValues = new Array( length );
    			progressContexts = new Array( length );
    			resolveContexts = new Array( length );
    			for ( ; i < length; i++ ) {
    				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
    					resolveValues[ i ].promise()
    						.progress( updateFunc( i, progressContexts, progressValues ) )
    						.done( updateFunc( i, resolveContexts, resolveValues ) )
    						.fail( deferred.reject );
    				} else {
    					--remaining;
    				}
    			}
    		}
    
    		// If we're not waiting on anything, resolve the master
    		if ( !remaining ) {
    			deferred.resolveWith( resolveContexts, resolveValues );
    		}
    
    		return deferred.promise();
    	}
    } );
    
    
    // The deferred used on DOM ready
    var readyList;
    
    jQuery.fn.ready = function( fn ) {
    
    	// Add the callback
    	jQuery.ready.promise().done( fn );
    
    	return this;
    };
    
    jQuery.extend( {
    
    	// Is the DOM ready to be used? Set to true once it occurs.
    	isReady: false,
    
    	// A counter to track how many items to wait for before
    	// the ready event fires. See #6781
    	readyWait: 1,
    
    	// Hold (or release) the ready event
    	holdReady: function( hold ) {
    		if ( hold ) {
    			jQuery.readyWait++;
    		} else {
    			jQuery.ready( true );
    		}
    	},
    
    	// Handle when the DOM is ready
    	ready: function( wait ) {
    
    		// Abort if there are pending holds or we're already ready
    		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
    			return;
    		}
    
    		// Remember that the DOM is ready
    		jQuery.isReady = true;
    
    		// If a normal DOM Ready event fired, decrement, and wait if need be
    		if ( wait !== true && --jQuery.readyWait > 0 ) {
    			return;
    		}
    
    		// If there are functions bound, to execute
    		readyList.resolveWith( document, [ jQuery ] );
    
    		// Trigger any bound ready events
    		if ( jQuery.fn.triggerHandler ) {
    			jQuery( document ).triggerHandler( "ready" );
    			jQuery( document ).off( "ready" );
    		}
    	}
    } );
    
    /**
     * The ready event handler and self cleanup method
     */
    function completed() {
    	document.removeEventListener( "DOMContentLoaded", completed );
    	window.removeEventListener( "load", completed );
    	jQuery.ready();
    }
    
    jQuery.ready.promise = function( obj ) {
    	if ( !readyList ) {
    
    		readyList = jQuery.Deferred();
    
    		// Catch cases where $(document).ready() is called
    		// after the browser event has already occurred.
    		// Support: IE9-10 only
    		// Older IE sometimes signals "interactive" too soon
    		if ( document.readyState === "complete" ||
    			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
    
    			// Handle it asynchronously to allow scripts the opportunity to delay ready
    			window.setTimeout( jQuery.ready );
    
    		} else {
    
    			// Use the handy event callback
    			document.addEventListener( "DOMContentLoaded", completed );
    
    			// A fallback to window.onload, that will always work
    			window.addEventListener( "load", completed );
    		}
    	}
    	return readyList.promise( obj );
    };
    
    // Kick off the DOM ready check even if the user does not
    jQuery.ready.promise();
    
    
    
    
    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
    	var i = 0,
    		len = elems.length,
    		bulk = key == null;
    
    	// Sets many values
    	if ( jQuery.type( key ) === "object" ) {
    		chainable = true;
    		for ( i in key ) {
    			access( elems, fn, i, key[ i ], true, emptyGet, raw );
    		}
    
    	// Sets one value
    	} else if ( value !== undefined ) {
    		chainable = true;
    
    		if ( !jQuery.isFunction( value ) ) {
    			raw = true;
    		}
    
    		if ( bulk ) {
    
    			// Bulk operations run against the entire set
    			if ( raw ) {
    				fn.call( elems, value );
    				fn = null;
    
    			// ...except when executing function values
    			} else {
    				bulk = fn;
    				fn = function( elem, key, value ) {
    					return bulk.call( jQuery( elem ), value );
    				};
    			}
    		}
    
    		if ( fn ) {
    			for ( ; i < len; i++ ) {
    				fn(
    					elems[ i ], key, raw ?
    					value :
    					value.call( elems[ i ], i, fn( elems[ i ], key ) )
    				);
    			}
    		}
    	}
    
    	return chainable ?
    		elems :
    
    		// Gets
    		bulk ?
    			fn.call( elems ) :
    			len ? fn( elems[ 0 ], key ) : emptyGet;
    };
    var acceptData = function( owner ) {
    
    	// Accepts only:
    	//  - Node
    	//    - Node.ELEMENT_NODE
    	//    - Node.DOCUMENT_NODE
    	//  - Object
    	//    - Any
    	/* jshint -W018 */
    	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
    };
    
    
    
    
    function Data() {
    	this.expando = jQuery.expando + Data.uid++;
    }
    
    Data.uid = 1;
    
    Data.prototype = {
    
    	register: function( owner, initial ) {
    		var value = initial || {};
    
    		// If it is a node unlikely to be stringify-ed or looped over
    		// use plain assignment
    		if ( owner.nodeType ) {
    			owner[ this.expando ] = value;
    
    		// Otherwise secure it in a non-enumerable, non-writable property
    		// configurability must be true to allow the property to be
    		// deleted with the delete operator
    		} else {
    			Object.defineProperty( owner, this.expando, {
    				value: value,
    				writable: true,
    				configurable: true
    			} );
    		}
    		return owner[ this.expando ];
    	},
    	cache: function( owner ) {
    
    		// We can accept data for non-element nodes in modern browsers,
    		// but we should not, see #8335.
    		// Always return an empty object.
    		if ( !acceptData( owner ) ) {
    			return {};
    		}
    
    		// Check if the owner object already has a cache
    		var value = owner[ this.expando ];
    
    		// If not, create one
    		if ( !value ) {
    			value = {};
    
    			// We can accept data for non-element nodes in modern browsers,
    			// but we should not, see #8335.
    			// Always return an empty object.
    			if ( acceptData( owner ) ) {
    
    				// If it is a node unlikely to be stringify-ed or looped over
    				// use plain assignment
    				if ( owner.nodeType ) {
    					owner[ this.expando ] = value;
    
    				// Otherwise secure it in a non-enumerable property
    				// configurable must be true to allow the property to be
    				// deleted when data is removed
    				} else {
    					Object.defineProperty( owner, this.expando, {
    						value: value,
    						configurable: true
    					} );
    				}
    			}
    		}
    
    		return value;
    	},
    	set: function( owner, data, value ) {
    		var prop,
    			cache = this.cache( owner );
    
    		// Handle: [ owner, key, value ] args
    		if ( typeof data === "string" ) {
    			cache[ data ] = value;
    
    		// Handle: [ owner, { properties } ] args
    		} else {
    
    			// Copy the properties one-by-one to the cache object
    			for ( prop in data ) {
    				cache[ prop ] = data[ prop ];
    			}
    		}
    		return cache;
    	},
    	get: function( owner, key ) {
    		return key === undefined ?
    			this.cache( owner ) :
    			owner[ this.expando ] && owner[ this.expando ][ key ];
    	},
    	access: function( owner, key, value ) {
    		var stored;
    
    		// In cases where either:
    		//
    		//   1. No key was specified
    		//   2. A string key was specified, but no value provided
    		//
    		// Take the "read" path and allow the get method to determine
    		// which value to return, respectively either:
    		//
    		//   1. The entire cache object
    		//   2. The data stored at the key
    		//
    		if ( key === undefined ||
    				( ( key && typeof key === "string" ) && value === undefined ) ) {
    
    			stored = this.get( owner, key );
    
    			return stored !== undefined ?
    				stored : this.get( owner, jQuery.camelCase( key ) );
    		}
    
    		// When the key is not a string, or both a key and value
    		// are specified, set or extend (existing objects) with either:
    		//
    		//   1. An object of properties
    		//   2. A key and value
    		//
    		this.set( owner, key, value );
    
    		// Since the "set" path can have two possible entry points
    		// return the expected data based on which path was taken[*]
    		return value !== undefined ? value : key;
    	},
    	remove: function( owner, key ) {
    		var i, name, camel,
    			cache = owner[ this.expando ];
    
    		if ( cache === undefined ) {
    			return;
    		}
    
    		if ( key === undefined ) {
    			this.register( owner );
    
    		} else {
    
    			// Support array or space separated string of keys
    			if ( jQuery.isArray( key ) ) {
    
    				// If "name" is an array of keys...
    				// When data is initially created, via ("key", "val") signature,
    				// keys will be converted to camelCase.
    				// Since there is no way to tell _how_ a key was added, remove
    				// both plain key and camelCase key. #12786
    				// This will only penalize the array argument path.
    				name = key.concat( key.map( jQuery.camelCase ) );
    			} else {
    				camel = jQuery.camelCase( key );
    
    				// Try the string as a key before any manipulation
    				if ( key in cache ) {
    					name = [ key, camel ];
    				} else {
    
    					// If a key with the spaces exists, use it.
    					// Otherwise, create an array by matching non-whitespace
    					name = camel;
    					name = name in cache ?
    						[ name ] : ( name.match( rnotwhite ) || [] );
    				}
    			}
    
    			i = name.length;
    
    			while ( i-- ) {
    				delete cache[ name[ i ] ];
    			}
    		}
    
    		// Remove the expando if there's no more data
    		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
    
    			// Support: Chrome <= 35-45+
    			// Webkit & Blink performance suffers when deleting properties
    			// from DOM nodes, so set to undefined instead
    			// https://code.google.com/p/chromium/issues/detail?id=378607
    			if ( owner.nodeType ) {
    				owner[ this.expando ] = undefined;
    			} else {
    				delete owner[ this.expando ];
    			}
    		}
    	},
    	hasData: function( owner ) {
    		var cache = owner[ this.expando ];
    		return cache !== undefined && !jQuery.isEmptyObject( cache );
    	}
    };
    var dataPriv = new Data();
    
    var dataUser = new Data();
    
    
    
    //	Implementation Summary
    //
    //	1. Enforce API surface and semantic compatibility with 1.9.x branch
    //	2. Improve the module's maintainability by reducing the storage
    //		paths to a single mechanism.
    //	3. Use the same single mechanism to support "private" and "user" data.
    //	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
    //	5. Avoid exposing implementation details on user objects (eg. expando properties)
    //	6. Provide a clear path for implementation upgrade to WeakMap in 2014
    
    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    	rmultiDash = /[A-Z]/g;
    
    function dataAttr( elem, key, data ) {
    	var name;
    
    	// If nothing was found internally, try to fetch any
    	// data from the HTML5 data-* attribute
    	if ( data === undefined && elem.nodeType === 1 ) {
    		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
    		data = elem.getAttribute( name );
    
    		if ( typeof data === "string" ) {
    			try {
    				data = data === "true" ? true :
    					data === "false" ? false :
    					data === "null" ? null :
    
    					// Only convert to a number if it doesn't change the string
    					+data + "" === data ? +data :
    					rbrace.test( data ) ? jQuery.parseJSON( data ) :
    					data;
    			} catch ( e ) {}
    
    			// Make sure we set the data so it isn't changed later
    			dataUser.set( elem, key, data );
    		} else {
    			data = undefined;
    		}
    	}
    	return data;
    }
    
    jQuery.extend( {
    	hasData: function( elem ) {
    		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
    	},
    
    	data: function( elem, name, data ) {
    		return dataUser.access( elem, name, data );
    	},
    
    	removeData: function( elem, name ) {
    		dataUser.remove( elem, name );
    	},
    
    	// TODO: Now that all calls to _data and _removeData have been replaced
    	// with direct calls to dataPriv methods, these can be deprecated.
    	_data: function( elem, name, data ) {
    		return dataPriv.access( elem, name, data );
    	},
    
    	_removeData: function( elem, name ) {
    		dataPriv.remove( elem, name );
    	}
    } );
    
    jQuery.fn.extend( {
    	data: function( key, value ) {
    		var i, name, data,
    			elem = this[ 0 ],
    			attrs = elem && elem.attributes;
    
    		// Gets all values
    		if ( key === undefined ) {
    			if ( this.length ) {
    				data = dataUser.get( elem );
    
    				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
    					i = attrs.length;
    					while ( i-- ) {
    
    						// Support: IE11+
    						// The attrs elements can be null (#14894)
    						if ( attrs[ i ] ) {
    							name = attrs[ i ].name;
    							if ( name.indexOf( "data-" ) === 0 ) {
    								name = jQuery.camelCase( name.slice( 5 ) );
    								dataAttr( elem, name, data[ name ] );
    							}
    						}
    					}
    					dataPriv.set( elem, "hasDataAttrs", true );
    				}
    			}
    
    			return data;
    		}
    
    		// Sets multiple values
    		if ( typeof key === "object" ) {
    			return this.each( function() {
    				dataUser.set( this, key );
    			} );
    		}
    
    		return access( this, function( value ) {
    			var data, camelKey;
    
    			// The calling jQuery object (element matches) is not empty
    			// (and therefore has an element appears at this[ 0 ]) and the
    			// `value` parameter was not undefined. An empty jQuery object
    			// will result in `undefined` for elem = this[ 0 ] which will
    			// throw an exception if an attempt to read a data cache is made.
    			if ( elem && value === undefined ) {
    
    				// Attempt to get data from the cache
    				// with the key as-is
    				data = dataUser.get( elem, key ) ||
    
    					// Try to find dashed key if it exists (gh-2779)
    					// This is for 2.2.x only
    					dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );
    
    				if ( data !== undefined ) {
    					return data;
    				}
    
    				camelKey = jQuery.camelCase( key );
    
    				// Attempt to get data from the cache
    				// with the key camelized
    				data = dataUser.get( elem, camelKey );
    				if ( data !== undefined ) {
    					return data;
    				}
    
    				// Attempt to "discover" the data in
    				// HTML5 custom data-* attrs
    				data = dataAttr( elem, camelKey, undefined );
    				if ( data !== undefined ) {
    					return data;
    				}
    
    				// We tried really hard, but the data doesn't exist.
    				return;
    			}
    
    			// Set the data...
    			camelKey = jQuery.camelCase( key );
    			this.each( function() {
    
    				// First, attempt to store a copy or reference of any
    				// data that might've been store with a camelCased key.
    				var data = dataUser.get( this, camelKey );
    
    				// For HTML5 data-* attribute interop, we have to
    				// store property names with dashes in a camelCase form.
    				// This might not apply to all properties...*
    				dataUser.set( this, camelKey, value );
    
    				// *... In the case of properties that might _actually_
    				// have dashes, we need to also store a copy of that
    				// unchanged property.
    				if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
    					dataUser.set( this, key, value );
    				}
    			} );
    		}, null, value, arguments.length > 1, null, true );
    	},
    
    	removeData: function( key ) {
    		return this.each( function() {
    			dataUser.remove( this, key );
    		} );
    	}
    } );
    
    
    jQuery.extend( {
    	queue: function( elem, type, data ) {
    		var queue;
    
    		if ( elem ) {
    			type = ( type || "fx" ) + "queue";
    			queue = dataPriv.get( elem, type );
    
    			// Speed up dequeue by getting out quickly if this is just a lookup
    			if ( data ) {
    				if ( !queue || jQuery.isArray( data ) ) {
    					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
    				} else {
    					queue.push( data );
    				}
    			}
    			return queue || [];
    		}
    	},
    
    	dequeue: function( elem, type ) {
    		type = type || "fx";
    
    		var queue = jQuery.queue( elem, type ),
    			startLength = queue.length,
    			fn = queue.shift(),
    			hooks = jQuery._queueHooks( elem, type ),
    			next = function() {
    				jQuery.dequeue( elem, type );
    			};
    
    		// If the fx queue is dequeued, always remove the progress sentinel
    		if ( fn === "inprogress" ) {
    			fn = queue.shift();
    			startLength--;
    		}
    
    		if ( fn ) {
    
    			// Add a progress sentinel to prevent the fx queue from being
    			// automatically dequeued
    			if ( type === "fx" ) {
    				queue.unshift( "inprogress" );
    			}
    
    			// Clear up the last queue stop function
    			delete hooks.stop;
    			fn.call( elem, next, hooks );
    		}
    
    		if ( !startLength && hooks ) {
    			hooks.empty.fire();
    		}
    	},
    
    	// Not public - generate a queueHooks object, or return the current one
    	_queueHooks: function( elem, type ) {
    		var key = type + "queueHooks";
    		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
    			empty: jQuery.Callbacks( "once memory" ).add( function() {
    				dataPriv.remove( elem, [ type + "queue", key ] );
    			} )
    		} );
    	}
    } );
    
    jQuery.fn.extend( {
    	queue: function( type, data ) {
    		var setter = 2;
    
    		if ( typeof type !== "string" ) {
    			data = type;
    			type = "fx";
    			setter--;
    		}
    
    		if ( arguments.length < setter ) {
    			return jQuery.queue( this[ 0 ], type );
    		}
    
    		return data === undefined ?
    			this :
    			this.each( function() {
    				var queue = jQuery.queue( this, type, data );
    
    				// Ensure a hooks for this queue
    				jQuery._queueHooks( this, type );
    
    				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
    					jQuery.dequeue( this, type );
    				}
    			} );
    	},
    	dequeue: function( type ) {
    		return this.each( function() {
    			jQuery.dequeue( this, type );
    		} );
    	},
    	clearQueue: function( type ) {
    		return this.queue( type || "fx", [] );
    	},
    
    	// Get a promise resolved when queues of a certain type
    	// are emptied (fx is the type by default)
    	promise: function( type, obj ) {
    		var tmp,
    			count = 1,
    			defer = jQuery.Deferred(),
    			elements = this,
    			i = this.length,
    			resolve = function() {
    				if ( !( --count ) ) {
    					defer.resolveWith( elements, [ elements ] );
    				}
    			};
    
    		if ( typeof type !== "string" ) {
    			obj = type;
    			type = undefined;
    		}
    		type = type || "fx";
    
    		while ( i-- ) {
    			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
    			if ( tmp && tmp.empty ) {
    				count++;
    				tmp.empty.add( resolve );
    			}
    		}
    		resolve();
    		return defer.promise( obj );
    	}
    } );
    var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
    
    var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
    
    
    var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
    
    var isHidden = function( elem, el ) {
    
    		// isHidden might be called from jQuery#filter function;
    		// in that case, element will be second argument
    		elem = el || elem;
    		return jQuery.css( elem, "display" ) === "none" ||
    			!jQuery.contains( elem.ownerDocument, elem );
    	};
    
    
    
    function adjustCSS( elem, prop, valueParts, tween ) {
    	var adjusted,
    		scale = 1,
    		maxIterations = 20,
    		currentValue = tween ?
    			function() { return tween.cur(); } :
    			function() { return jQuery.css( elem, prop, "" ); },
    		initial = currentValue(),
    		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
    
    		// Starting value computation is required for potential unit mismatches
    		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
    			rcssNum.exec( jQuery.css( elem, prop ) );
    
    	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
    
    		// Trust units reported by jQuery.css
    		unit = unit || initialInUnit[ 3 ];
    
    		// Make sure we update the tween properties later on
    		valueParts = valueParts || [];
    
    		// Iteratively approximate from a nonzero starting point
    		initialInUnit = +initial || 1;
    
    		do {
    
    			// If previous iteration zeroed out, double until we get *something*.
    			// Use string for doubling so we don't accidentally see scale as unchanged below
    			scale = scale || ".5";
    
    			// Adjust and apply
    			initialInUnit = initialInUnit / scale;
    			jQuery.style( elem, prop, initialInUnit + unit );
    
    		// Update scale, tolerating zero or NaN from tween.cur()
    		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
    		} while (
    			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
    		);
    	}
    
    	if ( valueParts ) {
    		initialInUnit = +initialInUnit || +initial || 0;
    
    		// Apply relative offset (+=/-=) if specified
    		adjusted = valueParts[ 1 ] ?
    			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
    			+valueParts[ 2 ];
    		if ( tween ) {
    			tween.unit = unit;
    			tween.start = initialInUnit;
    			tween.end = adjusted;
    		}
    	}
    	return adjusted;
    }
    var rcheckableType = ( /^(?:checkbox|radio)$/i );
    
    var rtagName = ( /<([\w:-]+)/ );
    
    var rscriptType = ( /^$|\/(?:java|ecma)script/i );
    
    
    
    // We have to close these tags to support XHTML (#13200)
    var wrapMap = {
    
    	// Support: IE9
    	option: [ 1, "<select multiple='multiple'>", "</select>" ],
    
    	// XHTML parsers do not magically insert elements in the
    	// same way that tag soup parsers do. So we cannot shorten
    	// this by omitting <tbody> or other required elements.
    	thead: [ 1, "<table>", "</table>" ],
    	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
    	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    
    	_default: [ 0, "", "" ]
    };
    
    // Support: IE9
    wrapMap.optgroup = wrapMap.option;
    
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    
    
    function getAll( context, tag ) {
    
    	// Support: IE9-11+
    	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
    	var ret = typeof context.getElementsByTagName !== "undefined" ?
    			context.getElementsByTagName( tag || "*" ) :
    			typeof context.querySelectorAll !== "undefined" ?
    				context.querySelectorAll( tag || "*" ) :
    			[];
    
    	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
    		jQuery.merge( [ context ], ret ) :
    		ret;
    }
    
    
    // Mark scripts as having already been evaluated
    function setGlobalEval( elems, refElements ) {
    	var i = 0,
    		l = elems.length;
    
    	for ( ; i < l; i++ ) {
    		dataPriv.set(
    			elems[ i ],
    			"globalEval",
    			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
    		);
    	}
    }
    
    
    var rhtml = /<|&#?\w+;/;
    
    function buildFragment( elems, context, scripts, selection, ignored ) {
    	var elem, tmp, tag, wrap, contains, j,
    		fragment = context.createDocumentFragment(),
    		nodes = [],
    		i = 0,
    		l = elems.length;
    
    	for ( ; i < l; i++ ) {
    		elem = elems[ i ];
    
    		if ( elem || elem === 0 ) {
    
    			// Add nodes directly
    			if ( jQuery.type( elem ) === "object" ) {
    
    				// Support: Android<4.1, PhantomJS<2
    				// push.apply(_, arraylike) throws on ancient WebKit
    				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
    
    			// Convert non-html into a text node
    			} else if ( !rhtml.test( elem ) ) {
    				nodes.push( context.createTextNode( elem ) );
    
    			// Convert html into DOM nodes
    			} else {
    				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );
    
    				// Deserialize a standard representation
    				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
    				wrap = wrapMap[ tag ] || wrapMap._default;
    				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
    
    				// Descend through wrappers to the right content
    				j = wrap[ 0 ];
    				while ( j-- ) {
    					tmp = tmp.lastChild;
    				}
    
    				// Support: Android<4.1, PhantomJS<2
    				// push.apply(_, arraylike) throws on ancient WebKit
    				jQuery.merge( nodes, tmp.childNodes );
    
    				// Remember the top-level container
    				tmp = fragment.firstChild;
    
    				// Ensure the created nodes are orphaned (#12392)
    				tmp.textContent = "";
    			}
    		}
    	}
    
    	// Remove wrapper from fragment
    	fragment.textContent = "";
    
    	i = 0;
    	while ( ( elem = nodes[ i++ ] ) ) {
    
    		// Skip elements already in the context collection (trac-4087)
    		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
    			if ( ignored ) {
    				ignored.push( elem );
    			}
    			continue;
    		}
    
    		contains = jQuery.contains( elem.ownerDocument, elem );
    
    		// Append to fragment
    		tmp = getAll( fragment.appendChild( elem ), "script" );
    
    		// Preserve script evaluation history
    		if ( contains ) {
    			setGlobalEval( tmp );
    		}
    
    		// Capture executables
    		if ( scripts ) {
    			j = 0;
    			while ( ( elem = tmp[ j++ ] ) ) {
    				if ( rscriptType.test( elem.type || "" ) ) {
    					scripts.push( elem );
    				}
    			}
    		}
    	}
    
    	return fragment;
    }
    
    
    ( function() {
    	var fragment = document.createDocumentFragment(),
    		div = fragment.appendChild( document.createElement( "div" ) ),
    		input = document.createElement( "input" );
    
    	// Support: Android 4.0-4.3, Safari<=5.1
    	// Check state lost if the name is set (#11217)
    	// Support: Windows Web Apps (WWA)
    	// `name` and `type` must use .setAttribute for WWA (#14901)
    	input.setAttribute( "type", "radio" );
    	input.setAttribute( "checked", "checked" );
    	input.setAttribute( "name", "t" );
    
    	div.appendChild( input );
    
    	// Support: Safari<=5.1, Android<4.2
    	// Older WebKit doesn't clone checked state correctly in fragments
    	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
    
    	// Support: IE<=11+
    	// Make sure textarea (and checkbox) defaultValue is properly cloned
    	div.innerHTML = "<textarea>x</textarea>";
    	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
    } )();
    
    
    var
    	rkeyEvent = /^key/,
    	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
    
    function returnTrue() {
    	return true;
    }
    
    function returnFalse() {
    	return false;
    }
    
    // Support: IE9
    // See #13393 for more info
    function safeActiveElement() {
    	try {
    		return document.activeElement;
    	} catch ( err ) { }
    }
    
    function on( elem, types, selector, data, fn, one ) {
    	var origFn, type;
    
    	// Types can be a map of types/handlers
    	if ( typeof types === "object" ) {
    
    		// ( types-Object, selector, data )
    		if ( typeof selector !== "string" ) {
    
    			// ( types-Object, data )
    			data = data || selector;
    			selector = undefined;
    		}
    		for ( type in types ) {
    			on( elem, type, selector, data, types[ type ], one );
    		}
    		return elem;
    	}
    
    	if ( data == null && fn == null ) {
    
    		// ( types, fn )
    		fn = selector;
    		data = selector = undefined;
    	} else if ( fn == null ) {
    		if ( typeof selector === "string" ) {
    
    			// ( types, selector, fn )
    			fn = data;
    			data = undefined;
    		} else {
    
    			// ( types, data, fn )
    			fn = data;
    			data = selector;
    			selector = undefined;
    		}
    	}
    	if ( fn === false ) {
    		fn = returnFalse;
    	} else if ( !fn ) {
    		return elem;
    	}
    
    	if ( one === 1 ) {
    		origFn = fn;
    		fn = function( event ) {
    
    			// Can use an empty set, since event contains the info
    			jQuery().off( event );
    			return origFn.apply( this, arguments );
    		};
    
    		// Use same guid so caller can remove using origFn
    		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    	}
    	return elem.each( function() {
    		jQuery.event.add( this, types, fn, data, selector );
    	} );
    }
    
    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {
    
    	global: {},
    
    	add: function( elem, types, handler, data, selector ) {
    
    		var handleObjIn, eventHandle, tmp,
    			events, t, handleObj,
    			special, handlers, type, namespaces, origType,
    			elemData = dataPriv.get( elem );
    
    		// Don't attach events to noData or text/comment nodes (but allow plain objects)
    		if ( !elemData ) {
    			return;
    		}
    
    		// Caller can pass in an object of custom data in lieu of the handler
    		if ( handler.handler ) {
    			handleObjIn = handler;
    			handler = handleObjIn.handler;
    			selector = handleObjIn.selector;
    		}
    
    		// Make sure that the handler has a unique ID, used to find/remove it later
    		if ( !handler.guid ) {
    			handler.guid = jQuery.guid++;
    		}
    
    		// Init the element's event structure and main handler, if this is the first
    		if ( !( events = elemData.events ) ) {
    			events = elemData.events = {};
    		}
    		if ( !( eventHandle = elemData.handle ) ) {
    			eventHandle = elemData.handle = function( e ) {
    
    				// Discard the second event of a jQuery.event.trigger() and
    				// when an event is called after a page has unloaded
    				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
    					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
    			};
    		}
    
    		// Handle multiple events separated by a space
    		types = ( types || "" ).match( rnotwhite ) || [ "" ];
    		t = types.length;
    		while ( t-- ) {
    			tmp = rtypenamespace.exec( types[ t ] ) || [];
    			type = origType = tmp[ 1 ];
    			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
    
    			// There *must* be a type, no attaching namespace-only handlers
    			if ( !type ) {
    				continue;
    			}
    
    			// If event changes its type, use the special event handlers for the changed type
    			special = jQuery.event.special[ type ] || {};
    
    			// If selector defined, determine special event api type, otherwise given type
    			type = ( selector ? special.delegateType : special.bindType ) || type;
    
    			// Update special based on newly reset type
    			special = jQuery.event.special[ type ] || {};
    
    			// handleObj is passed to all event handlers
    			handleObj = jQuery.extend( {
    				type: type,
    				origType: origType,
    				data: data,
    				handler: handler,
    				guid: handler.guid,
    				selector: selector,
    				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
    				namespace: namespaces.join( "." )
    			}, handleObjIn );
    
    			// Init the event handler queue if we're the first
    			if ( !( handlers = events[ type ] ) ) {
    				handlers = events[ type ] = [];
    				handlers.delegateCount = 0;
    
    				// Only use addEventListener if the special events handler returns false
    				if ( !special.setup ||
    					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
    
    					if ( elem.addEventListener ) {
    						elem.addEventListener( type, eventHandle );
    					}
    				}
    			}
    
    			if ( special.add ) {
    				special.add.call( elem, handleObj );
    
    				if ( !handleObj.handler.guid ) {
    					handleObj.handler.guid = handler.guid;
    				}
    			}
    
    			// Add to the element's handler list, delegates in front
    			if ( selector ) {
    				handlers.splice( handlers.delegateCount++, 0, handleObj );
    			} else {
    				handlers.push( handleObj );
    			}
    
    			// Keep track of which events have ever been used, for event optimization
    			jQuery.event.global[ type ] = true;
    		}
    
    	},
    
    	// Detach an event or set of events from an element
    	remove: function( elem, types, handler, selector, mappedTypes ) {
    
    		var j, origCount, tmp,
    			events, t, handleObj,
    			special, handlers, type, namespaces, origType,
    			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );
    
    		if ( !elemData || !( events = elemData.events ) ) {
    			return;
    		}
    
    		// Once for each type.namespace in types; type may be omitted
    		types = ( types || "" ).match( rnotwhite ) || [ "" ];
    		t = types.length;
    		while ( t-- ) {
    			tmp = rtypenamespace.exec( types[ t ] ) || [];
    			type = origType = tmp[ 1 ];
    			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
    
    			// Unbind all events (on this namespace, if provided) for the element
    			if ( !type ) {
    				for ( type in events ) {
    					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
    				}
    				continue;
    			}
    
    			special = jQuery.event.special[ type ] || {};
    			type = ( selector ? special.delegateType : special.bindType ) || type;
    			handlers = events[ type ] || [];
    			tmp = tmp[ 2 ] &&
    				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
    
    			// Remove matching events
    			origCount = j = handlers.length;
    			while ( j-- ) {
    				handleObj = handlers[ j ];
    
    				if ( ( mappedTypes || origType === handleObj.origType ) &&
    					( !handler || handler.guid === handleObj.guid ) &&
    					( !tmp || tmp.test( handleObj.namespace ) ) &&
    					( !selector || selector === handleObj.selector ||
    						selector === "**" && handleObj.selector ) ) {
    					handlers.splice( j, 1 );
    
    					if ( handleObj.selector ) {
    						handlers.delegateCount--;
    					}
    					if ( special.remove ) {
    						special.remove.call( elem, handleObj );
    					}
    				}
    			}
    
    			// Remove generic event handler if we removed something and no more handlers exist
    			// (avoids potential for endless recursion during removal of special event handlers)
    			if ( origCount && !handlers.length ) {
    				if ( !special.teardown ||
    					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
    
    					jQuery.removeEvent( elem, type, elemData.handle );
    				}
    
    				delete events[ type ];
    			}
    		}
    
    		// Remove data and the expando if it's no longer used
    		if ( jQuery.isEmptyObject( events ) ) {
    			dataPriv.remove( elem, "handle events" );
    		}
    	},
    
    	dispatch: function( event ) {
    
    		// Make a writable jQuery.Event from the native event object
    		event = jQuery.event.fix( event );
    
    		var i, j, ret, matched, handleObj,
    			handlerQueue = [],
    			args = slice.call( arguments ),
    			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
    			special = jQuery.event.special[ event.type ] || {};
    
    		// Use the fix-ed jQuery.Event rather than the (read-only) native event
    		args[ 0 ] = event;
    		event.delegateTarget = this;
    
    		// Call the preDispatch hook for the mapped type, and let it bail if desired
    		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
    			return;
    		}
    
    		// Determine handlers
    		handlerQueue = jQuery.event.handlers.call( this, event, handlers );
    
    		// Run delegates first; they may want to stop propagation beneath us
    		i = 0;
    		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
    			event.currentTarget = matched.elem;
    
    			j = 0;
    			while ( ( handleObj = matched.handlers[ j++ ] ) &&
    				!event.isImmediatePropagationStopped() ) {
    
    				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
    				// a subset or equal to those in the bound event (both can have no namespace).
    				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {
    
    					event.handleObj = handleObj;
    					event.data = handleObj.data;
    
    					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
    						handleObj.handler ).apply( matched.elem, args );
    
    					if ( ret !== undefined ) {
    						if ( ( event.result = ret ) === false ) {
    							event.preventDefault();
    							event.stopPropagation();
    						}
    					}
    				}
    			}
    		}
    
    		// Call the postDispatch hook for the mapped type
    		if ( special.postDispatch ) {
    			special.postDispatch.call( this, event );
    		}
    
    		return event.result;
    	},
    
    	handlers: function( event, handlers ) {
    		var i, matches, sel, handleObj,
    			handlerQueue = [],
    			delegateCount = handlers.delegateCount,
    			cur = event.target;
    
    		// Support (at least): Chrome, IE9
    		// Find delegate handlers
    		// Black-hole SVG <use> instance trees (#13180)
    		//
    		// Support: Firefox<=42+
    		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
    		if ( delegateCount && cur.nodeType &&
    			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {
    
    			for ( ; cur !== this; cur = cur.parentNode || this ) {
    
    				// Don't check non-elements (#13208)
    				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
    				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
    					matches = [];
    					for ( i = 0; i < delegateCount; i++ ) {
    						handleObj = handlers[ i ];
    
    						// Don't conflict with Object.prototype properties (#13203)
    						sel = handleObj.selector + " ";
    
    						if ( matches[ sel ] === undefined ) {
    							matches[ sel ] = handleObj.needsContext ?
    								jQuery( sel, this ).index( cur ) > -1 :
    								jQuery.find( sel, this, null, [ cur ] ).length;
    						}
    						if ( matches[ sel ] ) {
    							matches.push( handleObj );
    						}
    					}
    					if ( matches.length ) {
    						handlerQueue.push( { elem: cur, handlers: matches } );
    					}
    				}
    			}
    		}
    
    		// Add the remaining (directly-bound) handlers
    		if ( delegateCount < handlers.length ) {
    			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
    		}
    
    		return handlerQueue;
    	},
    
    	// Includes some event props shared by KeyEvent and MouseEvent
    	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
    		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),
    
    	fixHooks: {},
    
    	keyHooks: {
    		props: "char charCode key keyCode".split( " " ),
    		filter: function( event, original ) {
    
    			// Add which for key events
    			if ( event.which == null ) {
    				event.which = original.charCode != null ? original.charCode : original.keyCode;
    			}
    
    			return event;
    		}
    	},
    
    	mouseHooks: {
    		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
    			"screenX screenY toElement" ).split( " " ),
    		filter: function( event, original ) {
    			var eventDoc, doc, body,
    				button = original.button;
    
    			// Calculate pageX/Y if missing and clientX/Y available
    			if ( event.pageX == null && original.clientX != null ) {
    				eventDoc = event.target.ownerDocument || document;
    				doc = eventDoc.documentElement;
    				body = eventDoc.body;
    
    				event.pageX = original.clientX +
    					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
    					( doc && doc.clientLeft || body && body.clientLeft || 0 );
    				event.pageY = original.clientY +
    					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
    					( doc && doc.clientTop  || body && body.clientTop  || 0 );
    			}
    
    			// Add which for click: 1 === left; 2 === middle; 3 === right
    			// Note: button is not normalized, so don't use it
    			if ( !event.which && button !== undefined ) {
    				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
    			}
    
    			return event;
    		}
    	},
    
    	fix: function( event ) {
    		if ( event[ jQuery.expando ] ) {
    			return event;
    		}
    
    		// Create a writable copy of the event object and normalize some properties
    		var i, prop, copy,
    			type = event.type,
    			originalEvent = event,
    			fixHook = this.fixHooks[ type ];
    
    		if ( !fixHook ) {
    			this.fixHooks[ type ] = fixHook =
    				rmouseEvent.test( type ) ? this.mouseHooks :
    				rkeyEvent.test( type ) ? this.keyHooks :
    				{};
    		}
    		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
    
    		event = new jQuery.Event( originalEvent );
    
    		i = copy.length;
    		while ( i-- ) {
    			prop = copy[ i ];
    			event[ prop ] = originalEvent[ prop ];
    		}
    
    		// Support: Cordova 2.5 (WebKit) (#13255)
    		// All events should have a target; Cordova deviceready doesn't
    		if ( !event.target ) {
    			event.target = document;
    		}
    
    		// Support: Safari 6.0+, Chrome<28
    		// Target should not be a text node (#504, #13143)
    		if ( event.target.nodeType === 3 ) {
    			event.target = event.target.parentNode;
    		}
    
    		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
    	},
    
    	special: {
    		load: {
    
    			// Prevent triggered image.load events from bubbling to window.load
    			noBubble: true
    		},
    		focus: {
    
    			// Fire native event if possible so blur/focus sequence is correct
    			trigger: function() {
    				if ( this !== safeActiveElement() && this.focus ) {
    					this.focus();
    					return false;
    				}
    			},
    			delegateType: "focusin"
    		},
    		blur: {
    			trigger: function() {
    				if ( this === safeActiveElement() && this.blur ) {
    					this.blur();
    					return false;
    				}
    			},
    			delegateType: "focusout"
    		},
    		click: {
    
    			// For checkbox, fire native event so checked state will be right
    			trigger: function() {
    				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
    					this.click();
    					return false;
    				}
    			},
    
    			// For cross-browser consistency, don't fire native .click() on links
    			_default: function( event ) {
    				return jQuery.nodeName( event.target, "a" );
    			}
    		},
    
    		beforeunload: {
    			postDispatch: function( event ) {
    
    				// Support: Firefox 20+
    				// Firefox doesn't alert if the returnValue field is not set.
    				if ( event.result !== undefined && event.originalEvent ) {
    					event.originalEvent.returnValue = event.result;
    				}
    			}
    		}
    	}
    };
    
    jQuery.removeEvent = function( elem, type, handle ) {
    
    	// This "if" is needed for plain objects
    	if ( elem.removeEventListener ) {
    		elem.removeEventListener( type, handle );
    	}
    };
    
    jQuery.Event = function( src, props ) {
    
    	// Allow instantiation without the 'new' keyword
    	if ( !( this instanceof jQuery.Event ) ) {
    		return new jQuery.Event( src, props );
    	}
    
    	// Event object
    	if ( src && src.type ) {
    		this.originalEvent = src;
    		this.type = src.type;
    
    		// Events bubbling up the document may have been marked as prevented
    		// by a handler lower down the tree; reflect the correct value.
    		this.isDefaultPrevented = src.defaultPrevented ||
    				src.defaultPrevented === undefined &&
    
    				// Support: Android<4.0
    				src.returnValue === false ?
    			returnTrue :
    			returnFalse;
    
    	// Event type
    	} else {
    		this.type = src;
    	}
    
    	// Put explicitly provided properties onto the event object
    	if ( props ) {
    		jQuery.extend( this, props );
    	}
    
    	// Create a timestamp if incoming event doesn't have one
    	this.timeStamp = src && src.timeStamp || jQuery.now();
    
    	// Mark it as fixed
    	this[ jQuery.expando ] = true;
    };
    
    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
    	constructor: jQuery.Event,
    	isDefaultPrevented: returnFalse,
    	isPropagationStopped: returnFalse,
    	isImmediatePropagationStopped: returnFalse,
    	isSimulated: false,
    
    	preventDefault: function() {
    		var e = this.originalEvent;
    
    		this.isDefaultPrevented = returnTrue;
    
    		if ( e && !this.isSimulated ) {
    			e.preventDefault();
    		}
    	},
    	stopPropagation: function() {
    		var e = this.originalEvent;
    
    		this.isPropagationStopped = returnTrue;
    
    		if ( e && !this.isSimulated ) {
    			e.stopPropagation();
    		}
    	},
    	stopImmediatePropagation: function() {
    		var e = this.originalEvent;
    
    		this.isImmediatePropagationStopped = returnTrue;
    
    		if ( e && !this.isSimulated ) {
    			e.stopImmediatePropagation();
    		}
    
    		this.stopPropagation();
    	}
    };
    
    // Create mouseenter/leave events using mouseover/out and event-time checks
    // so that event delegation works in jQuery.
    // Do the same for pointerenter/pointerleave and pointerover/pointerout
    //
    // Support: Safari 7 only
    // Safari sends mouseenter too often; see:
    // https://code.google.com/p/chromium/issues/detail?id=470258
    // for the description of the bug (it existed in older Chrome versions as well).
    jQuery.each( {
    	mouseenter: "mouseover",
    	mouseleave: "mouseout",
    	pointerenter: "pointerover",
    	pointerleave: "pointerout"
    }, function( orig, fix ) {
    	jQuery.event.special[ orig ] = {
    		delegateType: fix,
    		bindType: fix,
    
    		handle: function( event ) {
    			var ret,
    				target = this,
    				related = event.relatedTarget,
    				handleObj = event.handleObj;
    
    			// For mouseenter/leave call the handler if related is outside the target.
    			// NB: No relatedTarget if the mouse left/entered the browser window
    			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
    				event.type = handleObj.origType;
    				ret = handleObj.handler.apply( this, arguments );
    				event.type = fix;
    			}
    			return ret;
    		}
    	};
    } );
    
    jQuery.fn.extend( {
    	on: function( types, selector, data, fn ) {
    		return on( this, types, selector, data, fn );
    	},
    	one: function( types, selector, data, fn ) {
    		return on( this, types, selector, data, fn, 1 );
    	},
    	off: function( types, selector, fn ) {
    		var handleObj, type;
    		if ( types && types.preventDefault && types.handleObj ) {
    
    			// ( event )  dispatched jQuery.Event
    			handleObj = types.handleObj;
    			jQuery( types.delegateTarget ).off(
    				handleObj.namespace ?
    					handleObj.origType + "." + handleObj.namespace :
    					handleObj.origType,
    				handleObj.selector,
    				handleObj.handler
    			);
    			return this;
    		}
    		if ( typeof types === "object" ) {
    
    			// ( types-object [, selector] )
    			for ( type in types ) {
    				this.off( type, selector, types[ type ] );
    			}
    			return this;
    		}
    		if ( selector === false || typeof selector === "function" ) {
    
    			// ( types [, fn] )
    			fn = selector;
    			selector = undefined;
    		}
    		if ( fn === false ) {
    			fn = returnFalse;
    		}
    		return this.each( function() {
    			jQuery.event.remove( this, types, fn, selector );
    		} );
    	}
    } );
    
    
    var
    	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
    
    	// Support: IE 10-11, Edge 10240+
    	// In IE/Edge using regex groups here causes severe slowdowns.
    	// See https://connect.microsoft.com/IE/feedback/details/1736512/
    	rnoInnerhtml = /<script|<style|<link/i,
    
    	// checked="checked" or checked
    	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    	rscriptTypeMasked = /^true\/(.*)/,
    	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    
    // Manipulating tables requires a tbody
    function manipulationTarget( elem, content ) {
    	return jQuery.nodeName( elem, "table" ) &&
    		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?
    
    		elem.getElementsByTagName( "tbody" )[ 0 ] ||
    			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
    		elem;
    }
    
    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript( elem ) {
    	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
    	return elem;
    }
    function restoreScript( elem ) {
    	var match = rscriptTypeMasked.exec( elem.type );
    
    	if ( match ) {
    		elem.type = match[ 1 ];
    	} else {
    		elem.removeAttribute( "type" );
    	}
    
    	return elem;
    }
    
    function cloneCopyEvent( src, dest ) {
    	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
    
    	if ( dest.nodeType !== 1 ) {
    		return;
    	}
    
    	// 1. Copy private data: events, handlers, etc.
    	if ( dataPriv.hasData( src ) ) {
    		pdataOld = dataPriv.access( src );
    		pdataCur = dataPriv.set( dest, pdataOld );
    		events = pdataOld.events;
    
    		if ( events ) {
    			delete pdataCur.handle;
    			pdataCur.events = {};
    
    			for ( type in events ) {
    				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
    					jQuery.event.add( dest, type, events[ type ][ i ] );
    				}
    			}
    		}
    	}
    
    	// 2. Copy user data
    	if ( dataUser.hasData( src ) ) {
    		udataOld = dataUser.access( src );
    		udataCur = jQuery.extend( {}, udataOld );
    
    		dataUser.set( dest, udataCur );
    	}
    }
    
    // Fix IE bugs, see support tests
    function fixInput( src, dest ) {
    	var nodeName = dest.nodeName.toLowerCase();
    
    	// Fails to persist the checked state of a cloned checkbox or radio button.
    	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
    		dest.checked = src.checked;
    
    	// Fails to return the selected option to the default selected state when cloning options
    	} else if ( nodeName === "input" || nodeName === "textarea" ) {
    		dest.defaultValue = src.defaultValue;
    	}
    }
    
    function domManip( collection, args, callback, ignored ) {
    
    	// Flatten any nested arrays
    	args = concat.apply( [], args );
    
    	var fragment, first, scripts, hasScripts, node, doc,
    		i = 0,
    		l = collection.length,
    		iNoClone = l - 1,
    		value = args[ 0 ],
    		isFunction = jQuery.isFunction( value );
    
    	// We can't cloneNode fragments that contain checked, in WebKit
    	if ( isFunction ||
    			( l > 1 && typeof value === "string" &&
    				!support.checkClone && rchecked.test( value ) ) ) {
    		return collection.each( function( index ) {
    			var self = collection.eq( index );
    			if ( isFunction ) {
    				args[ 0 ] = value.call( this, index, self.html() );
    			}
    			domManip( self, args, callback, ignored );
    		} );
    	}
    
    	if ( l ) {
    		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
    		first = fragment.firstChild;
    
    		if ( fragment.childNodes.length === 1 ) {
    			fragment = first;
    		}
    
    		// Require either new content or an interest in ignored elements to invoke the callback
    		if ( first || ignored ) {
    			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
    			hasScripts = scripts.length;
    
    			// Use the original fragment for the last item
    			// instead of the first because it can end up
    			// being emptied incorrectly in certain situations (#8070).
    			for ( ; i < l; i++ ) {
    				node = fragment;
    
    				if ( i !== iNoClone ) {
    					node = jQuery.clone( node, true, true );
    
    					// Keep references to cloned scripts for later restoration
    					if ( hasScripts ) {
    
    						// Support: Android<4.1, PhantomJS<2
    						// push.apply(_, arraylike) throws on ancient WebKit
    						jQuery.merge( scripts, getAll( node, "script" ) );
    					}
    				}
    
    				callback.call( collection[ i ], node, i );
    			}
    
    			if ( hasScripts ) {
    				doc = scripts[ scripts.length - 1 ].ownerDocument;
    
    				// Reenable scripts
    				jQuery.map( scripts, restoreScript );
    
    				// Evaluate executable scripts on first document insertion
    				for ( i = 0; i < hasScripts; i++ ) {
    					node = scripts[ i ];
    					if ( rscriptType.test( node.type || "" ) &&
    						!dataPriv.access( node, "globalEval" ) &&
    						jQuery.contains( doc, node ) ) {
    
    						if ( node.src ) {
    
    							// Optional AJAX dependency, but won't run scripts if not present
    							if ( jQuery._evalUrl ) {
    								jQuery._evalUrl( node.src );
    							}
    						} else {
    							jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
    						}
    					}
    				}
    			}
    		}
    	}
    
    	return collection;
    }
    
    function remove( elem, selector, keepData ) {
    	var node,
    		nodes = selector ? jQuery.filter( selector, elem ) : elem,
    		i = 0;
    
    	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
    		if ( !keepData && node.nodeType === 1 ) {
    			jQuery.cleanData( getAll( node ) );
    		}
    
    		if ( node.parentNode ) {
    			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
    				setGlobalEval( getAll( node, "script" ) );
    			}
    			node.parentNode.removeChild( node );
    		}
    	}
    
    	return elem;
    }
    
    jQuery.extend( {
    	htmlPrefilter: function( html ) {
    		return html.replace( rxhtmlTag, "<$1></$2>" );
    	},
    
    	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    		var i, l, srcElements, destElements,
    			clone = elem.cloneNode( true ),
    			inPage = jQuery.contains( elem.ownerDocument, elem );
    
    		// Fix IE cloning issues
    		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
    				!jQuery.isXMLDoc( elem ) ) {
    
    			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
    			destElements = getAll( clone );
    			srcElements = getAll( elem );
    
    			for ( i = 0, l = srcElements.length; i < l; i++ ) {
    				fixInput( srcElements[ i ], destElements[ i ] );
    			}
    		}
    
    		// Copy the events from the original to the clone
    		if ( dataAndEvents ) {
    			if ( deepDataAndEvents ) {
    				srcElements = srcElements || getAll( elem );
    				destElements = destElements || getAll( clone );
    
    				for ( i = 0, l = srcElements.length; i < l; i++ ) {
    					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
    				}
    			} else {
    				cloneCopyEvent( elem, clone );
    			}
    		}
    
    		// Preserve script evaluation history
    		destElements = getAll( clone, "script" );
    		if ( destElements.length > 0 ) {
    			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
    		}
    
    		// Return the cloned set
    		return clone;
    	},
    
    	cleanData: function( elems ) {
    		var data, elem, type,
    			special = jQuery.event.special,
    			i = 0;
    
    		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
    			if ( acceptData( elem ) ) {
    				if ( ( data = elem[ dataPriv.expando ] ) ) {
    					if ( data.events ) {
    						for ( type in data.events ) {
    							if ( special[ type ] ) {
    								jQuery.event.remove( elem, type );
    
    							// This is a shortcut to avoid jQuery.event.remove's overhead
    							} else {
    								jQuery.removeEvent( elem, type, data.handle );
    							}
    						}
    					}
    
    					// Support: Chrome <= 35-45+
    					// Assign undefined instead of using delete, see Data#remove
    					elem[ dataPriv.expando ] = undefined;
    				}
    				if ( elem[ dataUser.expando ] ) {
    
    					// Support: Chrome <= 35-45+
    					// Assign undefined instead of using delete, see Data#remove
    					elem[ dataUser.expando ] = undefined;
    				}
    			}
    		}
    	}
    } );
    
    jQuery.fn.extend( {
    
    	// Keep domManip exposed until 3.0 (gh-2225)
    	domManip: domManip,
    
    	detach: function( selector ) {
    		return remove( this, selector, true );
    	},
    
    	remove: function( selector ) {
    		return remove( this, selector );
    	},
    
    	text: function( value ) {
    		return access( this, function( value ) {
    			return value === undefined ?
    				jQuery.text( this ) :
    				this.empty().each( function() {
    					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    						this.textContent = value;
    					}
    				} );
    		}, null, value, arguments.length );
    	},
    
    	append: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    				var target = manipulationTarget( this, elem );
    				target.appendChild( elem );
    			}
    		} );
    	},
    
    	prepend: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    				var target = manipulationTarget( this, elem );
    				target.insertBefore( elem, target.firstChild );
    			}
    		} );
    	},
    
    	before: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.parentNode ) {
    				this.parentNode.insertBefore( elem, this );
    			}
    		} );
    	},
    
    	after: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.parentNode ) {
    				this.parentNode.insertBefore( elem, this.nextSibling );
    			}
    		} );
    	},
    
    	empty: function() {
    		var elem,
    			i = 0;
    
    		for ( ; ( elem = this[ i ] ) != null; i++ ) {
    			if ( elem.nodeType === 1 ) {
    
    				// Prevent memory leaks
    				jQuery.cleanData( getAll( elem, false ) );
    
    				// Remove any remaining nodes
    				elem.textContent = "";
    			}
    		}
    
    		return this;
    	},
    
    	clone: function( dataAndEvents, deepDataAndEvents ) {
    		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
    
    		return this.map( function() {
    			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    		} );
    	},
    
    	html: function( value ) {
    		return access( this, function( value ) {
    			var elem = this[ 0 ] || {},
    				i = 0,
    				l = this.length;
    
    			if ( value === undefined && elem.nodeType === 1 ) {
    				return elem.innerHTML;
    			}
    
    			// See if we can take a shortcut and just use innerHTML
    			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
    				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
    
    				value = jQuery.htmlPrefilter( value );
    
    				try {
    					for ( ; i < l; i++ ) {
    						elem = this[ i ] || {};
    
    						// Remove element nodes and prevent memory leaks
    						if ( elem.nodeType === 1 ) {
    							jQuery.cleanData( getAll( elem, false ) );
    							elem.innerHTML = value;
    						}
    					}
    
    					elem = 0;
    
    				// If using innerHTML throws an exception, use the fallback method
    				} catch ( e ) {}
    			}
    
    			if ( elem ) {
    				this.empty().append( value );
    			}
    		}, null, value, arguments.length );
    	},
    
    	replaceWith: function() {
    		var ignored = [];
    
    		// Make the changes, replacing each non-ignored context element with the new content
    		return domManip( this, arguments, function( elem ) {
    			var parent = this.parentNode;
    
    			if ( jQuery.inArray( this, ignored ) < 0 ) {
    				jQuery.cleanData( getAll( this ) );
    				if ( parent ) {
    					parent.replaceChild( elem, this );
    				}
    			}
    
    		// Force callback invocation
    		}, ignored );
    	}
    } );
    
    jQuery.each( {
    	appendTo: "append",
    	prependTo: "prepend",
    	insertBefore: "before",
    	insertAfter: "after",
    	replaceAll: "replaceWith"
    }, function( name, original ) {
    	jQuery.fn[ name ] = function( selector ) {
    		var elems,
    			ret = [],
    			insert = jQuery( selector ),
    			last = insert.length - 1,
    			i = 0;
    
    		for ( ; i <= last; i++ ) {
    			elems = i === last ? this : this.clone( true );
    			jQuery( insert[ i ] )[ original ]( elems );
    
    			// Support: QtWebKit
    			// .get() because push.apply(_, arraylike) throws
    			push.apply( ret, elems.get() );
    		}
    
    		return this.pushStack( ret );
    	};
    } );
    
    
    var iframe,
    	elemdisplay = {
    
    		// Support: Firefox
    		// We have to pre-define these values for FF (#10227)
    		HTML: "block",
    		BODY: "block"
    	};
    
    /**
     * Retrieve the actual display of a element
     * @param {String} name nodeName of the element
     * @param {Object} doc Document object
     */
    
    // Called only from within defaultDisplay
    function actualDisplay( name, doc ) {
    	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
    
    		display = jQuery.css( elem[ 0 ], "display" );
    
    	// We don't have any data stored on the element,
    	// so use "detach" method as fast way to get rid of the element
    	elem.detach();
    
    	return display;
    }
    
    /**
     * Try to determine the default display value of an element
     * @param {String} nodeName
     */
    function defaultDisplay( nodeName ) {
    	var doc = document,
    		display = elemdisplay[ nodeName ];
    
    	if ( !display ) {
    		display = actualDisplay( nodeName, doc );
    
    		// If the simple way fails, read from inside an iframe
    		if ( display === "none" || !display ) {
    
    			// Use the already-created iframe if possible
    			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
    				.appendTo( doc.documentElement );
    
    			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
    			doc = iframe[ 0 ].contentDocument;
    
    			// Support: IE
    			doc.write();
    			doc.close();
    
    			display = actualDisplay( nodeName, doc );
    			iframe.detach();
    		}
    
    		// Store the correct default display
    		elemdisplay[ nodeName ] = display;
    	}
    
    	return display;
    }
    var rmargin = ( /^margin/ );
    
    var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
    
    var getStyles = function( elem ) {
    
    		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
    		// IE throws on elements created in popups
    		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    		var view = elem.ownerDocument.defaultView;
    
    		if ( !view || !view.opener ) {
    			view = window;
    		}
    
    		return view.getComputedStyle( elem );
    	};
    
    var swap = function( elem, options, callback, args ) {
    	var ret, name,
    		old = {};
    
    	// Remember the old values, and insert the new ones
    	for ( name in options ) {
    		old[ name ] = elem.style[ name ];
    		elem.style[ name ] = options[ name ];
    	}
    
    	ret = callback.apply( elem, args || [] );
    
    	// Revert the old values
    	for ( name in options ) {
    		elem.style[ name ] = old[ name ];
    	}
    
    	return ret;
    };
    
    
    var documentElement = document.documentElement;
    
    
    
    ( function() {
    	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
    		container = document.createElement( "div" ),
    		div = document.createElement( "div" );
    
    	// Finish early in limited (non-browser) environments
    	if ( !div.style ) {
    		return;
    	}
    
    	// Support: IE9-11+
    	// Style of cloned element affects source element cloned (#8908)
    	div.style.backgroundClip = "content-box";
    	div.cloneNode( true ).style.backgroundClip = "";
    	support.clearCloneStyle = div.style.backgroundClip === "content-box";
    
    	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
    		"padding:0;margin-top:1px;position:absolute";
    	container.appendChild( div );
    
    	// Executing both pixelPosition & boxSizingReliable tests require only one layout
    	// so they're executed at the same time to save the second computation.
    	function computeStyleTests() {
    		div.style.cssText =
    
    			// Support: Firefox<29, Android 2.3
    			// Vendor-prefix box-sizing
    			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
    			"position:relative;display:block;" +
    			"margin:auto;border:1px;padding:1px;" +
    			"top:1%;width:50%";
    		div.innerHTML = "";
    		documentElement.appendChild( container );
    
    		var divStyle = window.getComputedStyle( div );
    		pixelPositionVal = divStyle.top !== "1%";
    		reliableMarginLeftVal = divStyle.marginLeft === "2px";
    		boxSizingReliableVal = divStyle.width === "4px";
    
    		// Support: Android 4.0 - 4.3 only
    		// Some styles come back with percentage values, even though they shouldn't
    		div.style.marginRight = "50%";
    		pixelMarginRightVal = divStyle.marginRight === "4px";
    
    		documentElement.removeChild( container );
    	}
    
    	jQuery.extend( support, {
    		pixelPosition: function() {
    
    			// This test is executed only once but we still do memoizing
    			// since we can use the boxSizingReliable pre-computing.
    			// No need to check if the test was already performed, though.
    			computeStyleTests();
    			return pixelPositionVal;
    		},
    		boxSizingReliable: function() {
    			if ( boxSizingReliableVal == null ) {
    				computeStyleTests();
    			}
    			return boxSizingReliableVal;
    		},
    		pixelMarginRight: function() {
    
    			// Support: Android 4.0-4.3
    			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
    			// since that compresses better and they're computed together anyway.
    			if ( boxSizingReliableVal == null ) {
    				computeStyleTests();
    			}
    			return pixelMarginRightVal;
    		},
    		reliableMarginLeft: function() {
    
    			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
    			if ( boxSizingReliableVal == null ) {
    				computeStyleTests();
    			}
    			return reliableMarginLeftVal;
    		},
    		reliableMarginRight: function() {
    
    			// Support: Android 2.3
    			// Check if div with explicit width and no margin-right incorrectly
    			// gets computed margin-right based on width of container. (#3333)
    			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
    			// This support function is only executed once so no memoizing is needed.
    			var ret,
    				marginDiv = div.appendChild( document.createElement( "div" ) );
    
    			// Reset CSS: box-sizing; display; margin; border; padding
    			marginDiv.style.cssText = div.style.cssText =
    
    				// Support: Android 2.3
    				// Vendor-prefix box-sizing
    				"-webkit-box-sizing:content-box;box-sizing:content-box;" +
    				"display:block;margin:0;border:0;padding:0";
    			marginDiv.style.marginRight = marginDiv.style.width = "0";
    			div.style.width = "1px";
    			documentElement.appendChild( container );
    
    			ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );
    
    			documentElement.removeChild( container );
    			div.removeChild( marginDiv );
    
    			return ret;
    		}
    	} );
    } )();
    
    
    function curCSS( elem, name, computed ) {
    	var width, minWidth, maxWidth, ret,
    		style = elem.style;
    
    	computed = computed || getStyles( elem );
    	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;
    
    	// Support: Opera 12.1x only
    	// Fall back to style even without computed
    	// computed is undefined for elems on document fragments
    	if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
    		ret = jQuery.style( elem, name );
    	}
    
    	// Support: IE9
    	// getPropertyValue is only needed for .css('filter') (#12537)
    	if ( computed ) {
    
    		// A tribute to the "awesome hack by Dean Edwards"
    		// Android Browser returns percentage for some values,
    		// but width seems to be reliably pixels.
    		// This is against the CSSOM draft spec:
    		// http://dev.w3.org/csswg/cssom/#resolved-values
    		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {
    
    			// Remember the original values
    			width = style.width;
    			minWidth = style.minWidth;
    			maxWidth = style.maxWidth;
    
    			// Put in the new values to get a computed value out
    			style.minWidth = style.maxWidth = style.width = ret;
    			ret = computed.width;
    
    			// Revert the changed values
    			style.width = width;
    			style.minWidth = minWidth;
    			style.maxWidth = maxWidth;
    		}
    	}
    
    	return ret !== undefined ?
    
    		// Support: IE9-11+
    		// IE returns zIndex value as an integer.
    		ret + "" :
    		ret;
    }
    
    
    function addGetHookIf( conditionFn, hookFn ) {
    
    	// Define the hook, we'll check on the first run if it's really needed.
    	return {
    		get: function() {
    			if ( conditionFn() ) {
    
    				// Hook not needed (or it's not possible to use it due
    				// to missing dependency), remove it.
    				delete this.get;
    				return;
    			}
    
    			// Hook needed; redefine it so that the support test is not executed again.
    			return ( this.get = hookFn ).apply( this, arguments );
    		}
    	};
    }
    
    
    var
    
    	// Swappable if display is none or starts with table
    	// except "table", "table-cell", or "table-caption"
    	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    
    	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    	cssNormalTransform = {
    		letterSpacing: "0",
    		fontWeight: "400"
    	},
    
    	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
    	emptyStyle = document.createElement( "div" ).style;
    
    // Return a css property mapped to a potentially vendor prefixed property
    function vendorPropName( name ) {
    
    	// Shortcut for names that are not vendor prefixed
    	if ( name in emptyStyle ) {
    		return name;
    	}
    
    	// Check for vendor prefixed names
    	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
    		i = cssPrefixes.length;
    
    	while ( i-- ) {
    		name = cssPrefixes[ i ] + capName;
    		if ( name in emptyStyle ) {
    			return name;
    		}
    	}
    }
    
    function setPositiveNumber( elem, value, subtract ) {
    
    	// Any relative (+/-) values have already been
    	// normalized at this point
    	var matches = rcssNum.exec( value );
    	return matches ?
    
    		// Guard against undefined "subtract", e.g., when used as in cssHooks
    		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
    		value;
    }
    
    function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
    	var i = extra === ( isBorderBox ? "border" : "content" ) ?
    
    		// If we already have the right measurement, avoid augmentation
    		4 :
    
    		// Otherwise initialize for horizontal or vertical properties
    		name === "width" ? 1 : 0,
    
    		val = 0;
    
    	for ( ; i < 4; i += 2 ) {
    
    		// Both box models exclude margin, so add it if we want it
    		if ( extra === "margin" ) {
    			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
    		}
    
    		if ( isBorderBox ) {
    
    			// border-box includes padding, so remove it if we want content
    			if ( extra === "content" ) {
    				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
    			}
    
    			// At this point, extra isn't border nor margin, so remove border
    			if ( extra !== "margin" ) {
    				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    			}
    		} else {
    
    			// At this point, extra isn't content, so add padding
    			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
    
    			// At this point, extra isn't content nor padding, so add border
    			if ( extra !== "padding" ) {
    				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    			}
    		}
    	}
    
    	return val;
    }
    
    function getWidthOrHeight( elem, name, extra ) {
    
    	// Start with offset property, which is equivalent to the border-box value
    	var valueIsBorderBox = true,
    		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
    		styles = getStyles( elem ),
    		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
    
    	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
    	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
    	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
    	if ( val <= 0 || val == null ) {
    
    		// Fall back to computed then uncomputed css if necessary
    		val = curCSS( elem, name, styles );
    		if ( val < 0 || val == null ) {
    			val = elem.style[ name ];
    		}
    
    		// Computed unit is not pixels. Stop here and return.
    		if ( rnumnonpx.test( val ) ) {
    			return val;
    		}
    
    		// Check for style in case a browser which returns unreliable values
    		// for getComputedStyle silently falls back to the reliable elem.style
    		valueIsBorderBox = isBorderBox &&
    			( support.boxSizingReliable() || val === elem.style[ name ] );
    
    		// Normalize "", auto, and prepare for extra
    		val = parseFloat( val ) || 0;
    	}
    
    	// Use the active box-sizing model to add/subtract irrelevant styles
    	return ( val +
    		augmentWidthOrHeight(
    			elem,
    			name,
    			extra || ( isBorderBox ? "border" : "content" ),
    			valueIsBorderBox,
    			styles
    		)
    	) + "px";
    }
    
    function showHide( elements, show ) {
    	var display, elem, hidden,
    		values = [],
    		index = 0,
    		length = elements.length;
    
    	for ( ; index < length; index++ ) {
    		elem = elements[ index ];
    		if ( !elem.style ) {
    			continue;
    		}
    
    		values[ index ] = dataPriv.get( elem, "olddisplay" );
    		display = elem.style.display;
    		if ( show ) {
    
    			// Reset the inline display of this element to learn if it is
    			// being hidden by cascaded rules or not
    			if ( !values[ index ] && display === "none" ) {
    				elem.style.display = "";
    			}
    
    			// Set elements which have been overridden with display: none
    			// in a stylesheet to whatever the default browser style is
    			// for such an element
    			if ( elem.style.display === "" && isHidden( elem ) ) {
    				values[ index ] = dataPriv.access(
    					elem,
    					"olddisplay",
    					defaultDisplay( elem.nodeName )
    				);
    			}
    		} else {
    			hidden = isHidden( elem );
    
    			if ( display !== "none" || !hidden ) {
    				dataPriv.set(
    					elem,
    					"olddisplay",
    					hidden ? display : jQuery.css( elem, "display" )
    				);
    			}
    		}
    	}
    
    	// Set the display of most of the elements in a second loop
    	// to avoid the constant reflow
    	for ( index = 0; index < length; index++ ) {
    		elem = elements[ index ];
    		if ( !elem.style ) {
    			continue;
    		}
    		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
    			elem.style.display = show ? values[ index ] || "" : "none";
    		}
    	}
    
    	return elements;
    }
    
    jQuery.extend( {
    
    	// Add in style property hooks for overriding the default
    	// behavior of getting and setting a style property
    	cssHooks: {
    		opacity: {
    			get: function( elem, computed ) {
    				if ( computed ) {
    
    					// We should always get a number back from opacity
    					var ret = curCSS( elem, "opacity" );
    					return ret === "" ? "1" : ret;
    				}
    			}
    		}
    	},
    
    	// Don't automatically add "px" to these possibly-unitless properties
    	cssNumber: {
    		"animationIterationCount": true,
    		"columnCount": true,
    		"fillOpacity": true,
    		"flexGrow": true,
    		"flexShrink": true,
    		"fontWeight": true,
    		"lineHeight": true,
    		"opacity": true,
    		"order": true,
    		"orphans": true,
    		"widows": true,
    		"zIndex": true,
    		"zoom": true
    	},
    
    	// Add in properties whose names you wish to fix before
    	// setting or getting the value
    	cssProps: {
    		"float": "cssFloat"
    	},
    
    	// Get and set the style property on a DOM Node
    	style: function( elem, name, value, extra ) {
    
    		// Don't set styles on text and comment nodes
    		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
    			return;
    		}
    
    		// Make sure that we're working with the right name
    		var ret, type, hooks,
    			origName = jQuery.camelCase( name ),
    			style = elem.style;
    
    		name = jQuery.cssProps[ origName ] ||
    			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
    
    		// Gets hook for the prefixed version, then unprefixed version
    		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
    
    		// Check if we're setting a value
    		if ( value !== undefined ) {
    			type = typeof value;
    
    			// Convert "+=" or "-=" to relative numbers (#7345)
    			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
    				value = adjustCSS( elem, name, ret );
    
    				// Fixes bug #9237
    				type = "number";
    			}
    
    			// Make sure that null and NaN values aren't set (#7116)
    			if ( value == null || value !== value ) {
    				return;
    			}
    
    			// If a number was passed in, add the unit (except for certain CSS properties)
    			if ( type === "number" ) {
    				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
    			}
    
    			// Support: IE9-11+
    			// background-* props affect original clone's values
    			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
    				style[ name ] = "inherit";
    			}
    
    			// If a hook was provided, use that value, otherwise just set the specified value
    			if ( !hooks || !( "set" in hooks ) ||
    				( value = hooks.set( elem, value, extra ) ) !== undefined ) {
    
    				style[ name ] = value;
    			}
    
    		} else {
    
    			// If a hook was provided get the non-computed value from there
    			if ( hooks && "get" in hooks &&
    				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
    
    				return ret;
    			}
    
    			// Otherwise just get the value from the style object
    			return style[ name ];
    		}
    	},
    
    	css: function( elem, name, extra, styles ) {
    		var val, num, hooks,
    			origName = jQuery.camelCase( name );
    
    		// Make sure that we're working with the right name
    		name = jQuery.cssProps[ origName ] ||
    			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
    
    		// Try prefixed name followed by the unprefixed name
    		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
    
    		// If a hook was provided get the computed value from there
    		if ( hooks && "get" in hooks ) {
    			val = hooks.get( elem, true, extra );
    		}
    
    		// Otherwise, if a way to get the computed value exists, use that
    		if ( val === undefined ) {
    			val = curCSS( elem, name, styles );
    		}
    
    		// Convert "normal" to computed value
    		if ( val === "normal" && name in cssNormalTransform ) {
    			val = cssNormalTransform[ name ];
    		}
    
    		// Make numeric if forced or a qualifier was provided and val looks numeric
    		if ( extra === "" || extra ) {
    			num = parseFloat( val );
    			return extra === true || isFinite( num ) ? num || 0 : val;
    		}
    		return val;
    	}
    } );
    
    jQuery.each( [ "height", "width" ], function( i, name ) {
    	jQuery.cssHooks[ name ] = {
    		get: function( elem, computed, extra ) {
    			if ( computed ) {
    
    				// Certain elements can have dimension info if we invisibly show them
    				// but it must have a current display style that would benefit
    				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
    					elem.offsetWidth === 0 ?
    						swap( elem, cssShow, function() {
    							return getWidthOrHeight( elem, name, extra );
    						} ) :
    						getWidthOrHeight( elem, name, extra );
    			}
    		},
    
    		set: function( elem, value, extra ) {
    			var matches,
    				styles = extra && getStyles( elem ),
    				subtract = extra && augmentWidthOrHeight(
    					elem,
    					name,
    					extra,
    					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    					styles
    				);
    
    			// Convert to pixels if value adjustment is needed
    			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
    				( matches[ 3 ] || "px" ) !== "px" ) {
    
    				elem.style[ name ] = value;
    				value = jQuery.css( elem, name );
    			}
    
    			return setPositiveNumber( elem, value, subtract );
    		}
    	};
    } );
    
    jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
    	function( elem, computed ) {
    		if ( computed ) {
    			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
    				elem.getBoundingClientRect().left -
    					swap( elem, { marginLeft: 0 }, function() {
    						return elem.getBoundingClientRect().left;
    					} )
    				) + "px";
    		}
    	}
    );
    
    // Support: Android 2.3
    jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
    	function( elem, computed ) {
    		if ( computed ) {
    			return swap( elem, { "display": "inline-block" },
    				curCSS, [ elem, "marginRight" ] );
    		}
    	}
    );
    
    // These hooks are used by animate to expand properties
    jQuery.each( {
    	margin: "",
    	padding: "",
    	border: "Width"
    }, function( prefix, suffix ) {
    	jQuery.cssHooks[ prefix + suffix ] = {
    		expand: function( value ) {
    			var i = 0,
    				expanded = {},
    
    				// Assumes a single number if not a string
    				parts = typeof value === "string" ? value.split( " " ) : [ value ];
    
    			for ( ; i < 4; i++ ) {
    				expanded[ prefix + cssExpand[ i ] + suffix ] =
    					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
    			}
    
    			return expanded;
    		}
    	};
    
    	if ( !rmargin.test( prefix ) ) {
    		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
    	}
    } );
    
    jQuery.fn.extend( {
    	css: function( name, value ) {
    		return access( this, function( elem, name, value ) {
    			var styles, len,
    				map = {},
    				i = 0;
    
    			if ( jQuery.isArray( name ) ) {
    				styles = getStyles( elem );
    				len = name.length;
    
    				for ( ; i < len; i++ ) {
    					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
    				}
    
    				return map;
    			}
    
    			return value !== undefined ?
    				jQuery.style( elem, name, value ) :
    				jQuery.css( elem, name );
    		}, name, value, arguments.length > 1 );
    	},
    	show: function() {
    		return showHide( this, true );
    	},
    	hide: function() {
    		return showHide( this );
    	},
    	toggle: function( state ) {
    		if ( typeof state === "boolean" ) {
    			return state ? this.show() : this.hide();
    		}
    
    		return this.each( function() {
    			if ( isHidden( this ) ) {
    				jQuery( this ).show();
    			} else {
    				jQuery( this ).hide();
    			}
    		} );
    	}
    } );
    
    
    function Tween( elem, options, prop, end, easing ) {
    	return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;
    
    Tween.prototype = {
    	constructor: Tween,
    	init: function( elem, options, prop, end, easing, unit ) {
    		this.elem = elem;
    		this.prop = prop;
    		this.easing = easing || jQuery.easing._default;
    		this.options = options;
    		this.start = this.now = this.cur();
    		this.end = end;
    		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
    	},
    	cur: function() {
    		var hooks = Tween.propHooks[ this.prop ];
    
    		return hooks && hooks.get ?
    			hooks.get( this ) :
    			Tween.propHooks._default.get( this );
    	},
    	run: function( percent ) {
    		var eased,
    			hooks = Tween.propHooks[ this.prop ];
    
    		if ( this.options.duration ) {
    			this.pos = eased = jQuery.easing[ this.easing ](
    				percent, this.options.duration * percent, 0, 1, this.options.duration
    			);
    		} else {
    			this.pos = eased = percent;
    		}
    		this.now = ( this.end - this.start ) * eased + this.start;
    
    		if ( this.options.step ) {
    			this.options.step.call( this.elem, this.now, this );
    		}
    
    		if ( hooks && hooks.set ) {
    			hooks.set( this );
    		} else {
    			Tween.propHooks._default.set( this );
    		}
    		return this;
    	}
    };
    
    Tween.prototype.init.prototype = Tween.prototype;
    
    Tween.propHooks = {
    	_default: {
    		get: function( tween ) {
    			var result;
    
    			// Use a property on the element directly when it is not a DOM element,
    			// or when there is no matching style property that exists.
    			if ( tween.elem.nodeType !== 1 ||
    				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
    				return tween.elem[ tween.prop ];
    			}
    
    			// Passing an empty string as a 3rd parameter to .css will automatically
    			// attempt a parseFloat and fallback to a string if the parse fails.
    			// Simple values such as "10px" are parsed to Float;
    			// complex values such as "rotate(1rad)" are returned as-is.
    			result = jQuery.css( tween.elem, tween.prop, "" );
    
    			// Empty strings, null, undefined and "auto" are converted to 0.
    			return !result || result === "auto" ? 0 : result;
    		},
    		set: function( tween ) {
    
    			// Use step hook for back compat.
    			// Use cssHook if its there.
    			// Use .style if available and use plain properties where available.
    			if ( jQuery.fx.step[ tween.prop ] ) {
    				jQuery.fx.step[ tween.prop ]( tween );
    			} else if ( tween.elem.nodeType === 1 &&
    				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
    					jQuery.cssHooks[ tween.prop ] ) ) {
    				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
    			} else {
    				tween.elem[ tween.prop ] = tween.now;
    			}
    		}
    	}
    };
    
    // Support: IE9
    // Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    	set: function( tween ) {
    		if ( tween.elem.nodeType && tween.elem.parentNode ) {
    			tween.elem[ tween.prop ] = tween.now;
    		}
    	}
    };
    
    jQuery.easing = {
    	linear: function( p ) {
    		return p;
    	},
    	swing: function( p ) {
    		return 0.5 - Math.cos( p * Math.PI ) / 2;
    	},
    	_default: "swing"
    };
    
    jQuery.fx = Tween.prototype.init;
    
    // Back Compat <1.8 extension point
    jQuery.fx.step = {};
    
    
    
    
    var
    	fxNow, timerId,
    	rfxtypes = /^(?:toggle|show|hide)$/,
    	rrun = /queueHooks$/;
    
    // Animations created synchronously will run synchronously
    function createFxNow() {
    	window.setTimeout( function() {
    		fxNow = undefined;
    	} );
    	return ( fxNow = jQuery.now() );
    }
    
    // Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
    	var which,
    		i = 0,
    		attrs = { height: type };
    
    	// If we include width, step value is 1 to do all cssExpand values,
    	// otherwise step value is 2 to skip over Left and Right
    	includeWidth = includeWidth ? 1 : 0;
    	for ( ; i < 4 ; i += 2 - includeWidth ) {
    		which = cssExpand[ i ];
    		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
    	}
    
    	if ( includeWidth ) {
    		attrs.opacity = attrs.width = type;
    	}
    
    	return attrs;
    }
    
    function createTween( value, prop, animation ) {
    	var tween,
    		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
    		index = 0,
    		length = collection.length;
    	for ( ; index < length; index++ ) {
    		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
    
    			// We're done with this property
    			return tween;
    		}
    	}
    }
    
    function defaultPrefilter( elem, props, opts ) {
    	/* jshint validthis: true */
    	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
    		anim = this,
    		orig = {},
    		style = elem.style,
    		hidden = elem.nodeType && isHidden( elem ),
    		dataShow = dataPriv.get( elem, "fxshow" );
    
    	// Handle queue: false promises
    	if ( !opts.queue ) {
    		hooks = jQuery._queueHooks( elem, "fx" );
    		if ( hooks.unqueued == null ) {
    			hooks.unqueued = 0;
    			oldfire = hooks.empty.fire;
    			hooks.empty.fire = function() {
    				if ( !hooks.unqueued ) {
    					oldfire();
    				}
    			};
    		}
    		hooks.unqueued++;
    
    		anim.always( function() {
    
    			// Ensure the complete handler is called before this completes
    			anim.always( function() {
    				hooks.unqueued--;
    				if ( !jQuery.queue( elem, "fx" ).length ) {
    					hooks.empty.fire();
    				}
    			} );
    		} );
    	}
    
    	// Height/width overflow pass
    	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
    
    		// Make sure that nothing sneaks out
    		// Record all 3 overflow attributes because IE9-10 do not
    		// change the overflow attribute when overflowX and
    		// overflowY are set to the same value
    		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
    
    		// Set display property to inline-block for height/width
    		// animations on inline elements that are having width/height animated
    		display = jQuery.css( elem, "display" );
    
    		// Test default display if display is currently "none"
    		checkDisplay = display === "none" ?
    			dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;
    
    		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
    			style.display = "inline-block";
    		}
    	}
    
    	if ( opts.overflow ) {
    		style.overflow = "hidden";
    		anim.always( function() {
    			style.overflow = opts.overflow[ 0 ];
    			style.overflowX = opts.overflow[ 1 ];
    			style.overflowY = opts.overflow[ 2 ];
    		} );
    	}
    
    	// show/hide pass
    	for ( prop in props ) {
    		value = props[ prop ];
    		if ( rfxtypes.exec( value ) ) {
    			delete props[ prop ];
    			toggle = toggle || value === "toggle";
    			if ( value === ( hidden ? "hide" : "show" ) ) {
    
    				// If there is dataShow left over from a stopped hide or show
    				// and we are going to proceed with show, we should pretend to be hidden
    				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
    					hidden = true;
    				} else {
    					continue;
    				}
    			}
    			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
    
    		// Any non-fx value stops us from restoring the original display value
    		} else {
    			display = undefined;
    		}
    	}
    
    	if ( !jQuery.isEmptyObject( orig ) ) {
    		if ( dataShow ) {
    			if ( "hidden" in dataShow ) {
    				hidden = dataShow.hidden;
    			}
    		} else {
    			dataShow = dataPriv.access( elem, "fxshow", {} );
    		}
    
    		// Store state if its toggle - enables .stop().toggle() to "reverse"
    		if ( toggle ) {
    			dataShow.hidden = !hidden;
    		}
    		if ( hidden ) {
    			jQuery( elem ).show();
    		} else {
    			anim.done( function() {
    				jQuery( elem ).hide();
    			} );
    		}
    		anim.done( function() {
    			var prop;
    
    			dataPriv.remove( elem, "fxshow" );
    			for ( prop in orig ) {
    				jQuery.style( elem, prop, orig[ prop ] );
    			}
    		} );
    		for ( prop in orig ) {
    			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
    
    			if ( !( prop in dataShow ) ) {
    				dataShow[ prop ] = tween.start;
    				if ( hidden ) {
    					tween.end = tween.start;
    					tween.start = prop === "width" || prop === "height" ? 1 : 0;
    				}
    			}
    		}
    
    	// If this is a noop like .hide().hide(), restore an overwritten display value
    	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
    		style.display = display;
    	}
    }
    
    function propFilter( props, specialEasing ) {
    	var index, name, easing, value, hooks;
    
    	// camelCase, specialEasing and expand cssHook pass
    	for ( index in props ) {
    		name = jQuery.camelCase( index );
    		easing = specialEasing[ name ];
    		value = props[ index ];
    		if ( jQuery.isArray( value ) ) {
    			easing = value[ 1 ];
    			value = props[ index ] = value[ 0 ];
    		}
    
    		if ( index !== name ) {
    			props[ name ] = value;
    			delete props[ index ];
    		}
    
    		hooks = jQuery.cssHooks[ name ];
    		if ( hooks && "expand" in hooks ) {
    			value = hooks.expand( value );
    			delete props[ name ];
    
    			// Not quite $.extend, this won't overwrite existing keys.
    			// Reusing 'index' because we have the correct "name"
    			for ( index in value ) {
    				if ( !( index in props ) ) {
    					props[ index ] = value[ index ];
    					specialEasing[ index ] = easing;
    				}
    			}
    		} else {
    			specialEasing[ name ] = easing;
    		}
    	}
    }
    
    function Animation( elem, properties, options ) {
    	var result,
    		stopped,
    		index = 0,
    		length = Animation.prefilters.length,
    		deferred = jQuery.Deferred().always( function() {
    
    			// Don't match elem in the :animated selector
    			delete tick.elem;
    		} ),
    		tick = function() {
    			if ( stopped ) {
    				return false;
    			}
    			var currentTime = fxNow || createFxNow(),
    				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
    
    				// Support: Android 2.3
    				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
    				temp = remaining / animation.duration || 0,
    				percent = 1 - temp,
    				index = 0,
    				length = animation.tweens.length;
    
    			for ( ; index < length ; index++ ) {
    				animation.tweens[ index ].run( percent );
    			}
    
    			deferred.notifyWith( elem, [ animation, percent, remaining ] );
    
    			if ( percent < 1 && length ) {
    				return remaining;
    			} else {
    				deferred.resolveWith( elem, [ animation ] );
    				return false;
    			}
    		},
    		animation = deferred.promise( {
    			elem: elem,
    			props: jQuery.extend( {}, properties ),
    			opts: jQuery.extend( true, {
    				specialEasing: {},
    				easing: jQuery.easing._default
    			}, options ),
    			originalProperties: properties,
    			originalOptions: options,
    			startTime: fxNow || createFxNow(),
    			duration: options.duration,
    			tweens: [],
    			createTween: function( prop, end ) {
    				var tween = jQuery.Tween( elem, animation.opts, prop, end,
    						animation.opts.specialEasing[ prop ] || animation.opts.easing );
    				animation.tweens.push( tween );
    				return tween;
    			},
    			stop: function( gotoEnd ) {
    				var index = 0,
    
    					// If we are going to the end, we want to run all the tweens
    					// otherwise we skip this part
    					length = gotoEnd ? animation.tweens.length : 0;
    				if ( stopped ) {
    					return this;
    				}
    				stopped = true;
    				for ( ; index < length ; index++ ) {
    					animation.tweens[ index ].run( 1 );
    				}
    
    				// Resolve when we played the last frame; otherwise, reject
    				if ( gotoEnd ) {
    					deferred.notifyWith( elem, [ animation, 1, 0 ] );
    					deferred.resolveWith( elem, [ animation, gotoEnd ] );
    				} else {
    					deferred.rejectWith( elem, [ animation, gotoEnd ] );
    				}
    				return this;
    			}
    		} ),
    		props = animation.props;
    
    	propFilter( props, animation.opts.specialEasing );
    
    	for ( ; index < length ; index++ ) {
    		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
    		if ( result ) {
    			if ( jQuery.isFunction( result.stop ) ) {
    				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
    					jQuery.proxy( result.stop, result );
    			}
    			return result;
    		}
    	}
    
    	jQuery.map( props, createTween, animation );
    
    	if ( jQuery.isFunction( animation.opts.start ) ) {
    		animation.opts.start.call( elem, animation );
    	}
    
    	jQuery.fx.timer(
    		jQuery.extend( tick, {
    			elem: elem,
    			anim: animation,
    			queue: animation.opts.queue
    		} )
    	);
    
    	// attach callbacks from options
    	return animation.progress( animation.opts.progress )
    		.done( animation.opts.done, animation.opts.complete )
    		.fail( animation.opts.fail )
    		.always( animation.opts.always );
    }
    
    jQuery.Animation = jQuery.extend( Animation, {
    	tweeners: {
    		"*": [ function( prop, value ) {
    			var tween = this.createTween( prop, value );
    			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
    			return tween;
    		} ]
    	},
    
    	tweener: function( props, callback ) {
    		if ( jQuery.isFunction( props ) ) {
    			callback = props;
    			props = [ "*" ];
    		} else {
    			props = props.match( rnotwhite );
    		}
    
    		var prop,
    			index = 0,
    			length = props.length;
    
    		for ( ; index < length ; index++ ) {
    			prop = props[ index ];
    			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
    			Animation.tweeners[ prop ].unshift( callback );
    		}
    	},
    
    	prefilters: [ defaultPrefilter ],
    
    	prefilter: function( callback, prepend ) {
    		if ( prepend ) {
    			Animation.prefilters.unshift( callback );
    		} else {
    			Animation.prefilters.push( callback );
    		}
    	}
    } );
    
    jQuery.speed = function( speed, easing, fn ) {
    	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    		complete: fn || !fn && easing ||
    			jQuery.isFunction( speed ) && speed,
    		duration: speed,
    		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
    	};
    
    	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
    		opt.duration : opt.duration in jQuery.fx.speeds ?
    			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
    
    	// Normalize opt.queue - true/undefined/null -> "fx"
    	if ( opt.queue == null || opt.queue === true ) {
    		opt.queue = "fx";
    	}
    
    	// Queueing
    	opt.old = opt.complete;
    
    	opt.complete = function() {
    		if ( jQuery.isFunction( opt.old ) ) {
    			opt.old.call( this );
    		}
    
    		if ( opt.queue ) {
    			jQuery.dequeue( this, opt.queue );
    		}
    	};
    
    	return opt;
    };
    
    jQuery.fn.extend( {
    	fadeTo: function( speed, to, easing, callback ) {
    
    		// Show any hidden elements after setting opacity to 0
    		return this.filter( isHidden ).css( "opacity", 0 ).show()
    
    			// Animate to the value specified
    			.end().animate( { opacity: to }, speed, easing, callback );
    	},
    	animate: function( prop, speed, easing, callback ) {
    		var empty = jQuery.isEmptyObject( prop ),
    			optall = jQuery.speed( speed, easing, callback ),
    			doAnimation = function() {
    
    				// Operate on a copy of prop so per-property easing won't be lost
    				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
    
    				// Empty animations, or finishing resolves immediately
    				if ( empty || dataPriv.get( this, "finish" ) ) {
    					anim.stop( true );
    				}
    			};
    			doAnimation.finish = doAnimation;
    
    		return empty || optall.queue === false ?
    			this.each( doAnimation ) :
    			this.queue( optall.queue, doAnimation );
    	},
    	stop: function( type, clearQueue, gotoEnd ) {
    		var stopQueue = function( hooks ) {
    			var stop = hooks.stop;
    			delete hooks.stop;
    			stop( gotoEnd );
    		};
    
    		if ( typeof type !== "string" ) {
    			gotoEnd = clearQueue;
    			clearQueue = type;
    			type = undefined;
    		}
    		if ( clearQueue && type !== false ) {
    			this.queue( type || "fx", [] );
    		}
    
    		return this.each( function() {
    			var dequeue = true,
    				index = type != null && type + "queueHooks",
    				timers = jQuery.timers,
    				data = dataPriv.get( this );
    
    			if ( index ) {
    				if ( data[ index ] && data[ index ].stop ) {
    					stopQueue( data[ index ] );
    				}
    			} else {
    				for ( index in data ) {
    					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
    						stopQueue( data[ index ] );
    					}
    				}
    			}
    
    			for ( index = timers.length; index--; ) {
    				if ( timers[ index ].elem === this &&
    					( type == null || timers[ index ].queue === type ) ) {
    
    					timers[ index ].anim.stop( gotoEnd );
    					dequeue = false;
    					timers.splice( index, 1 );
    				}
    			}
    
    			// Start the next in the queue if the last step wasn't forced.
    			// Timers currently will call their complete callbacks, which
    			// will dequeue but only if they were gotoEnd.
    			if ( dequeue || !gotoEnd ) {
    				jQuery.dequeue( this, type );
    			}
    		} );
    	},
    	finish: function( type ) {
    		if ( type !== false ) {
    			type = type || "fx";
    		}
    		return this.each( function() {
    			var index,
    				data = dataPriv.get( this ),
    				queue = data[ type + "queue" ],
    				hooks = data[ type + "queueHooks" ],
    				timers = jQuery.timers,
    				length = queue ? queue.length : 0;
    
    			// Enable finishing flag on private data
    			data.finish = true;
    
    			// Empty the queue first
    			jQuery.queue( this, type, [] );
    
    			if ( hooks && hooks.stop ) {
    				hooks.stop.call( this, true );
    			}
    
    			// Look for any active animations, and finish them
    			for ( index = timers.length; index--; ) {
    				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
    					timers[ index ].anim.stop( true );
    					timers.splice( index, 1 );
    				}
    			}
    
    			// Look for any animations in the old queue and finish them
    			for ( index = 0; index < length; index++ ) {
    				if ( queue[ index ] && queue[ index ].finish ) {
    					queue[ index ].finish.call( this );
    				}
    			}
    
    			// Turn off finishing flag
    			delete data.finish;
    		} );
    	}
    } );
    
    jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
    	var cssFn = jQuery.fn[ name ];
    	jQuery.fn[ name ] = function( speed, easing, callback ) {
    		return speed == null || typeof speed === "boolean" ?
    			cssFn.apply( this, arguments ) :
    			this.animate( genFx( name, true ), speed, easing, callback );
    	};
    } );
    
    // Generate shortcuts for custom animations
    jQuery.each( {
    	slideDown: genFx( "show" ),
    	slideUp: genFx( "hide" ),
    	slideToggle: genFx( "toggle" ),
    	fadeIn: { opacity: "show" },
    	fadeOut: { opacity: "hide" },
    	fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
    	jQuery.fn[ name ] = function( speed, easing, callback ) {
    		return this.animate( props, speed, easing, callback );
    	};
    } );
    
    jQuery.timers = [];
    jQuery.fx.tick = function() {
    	var timer,
    		i = 0,
    		timers = jQuery.timers;
    
    	fxNow = jQuery.now();
    
    	for ( ; i < timers.length; i++ ) {
    		timer = timers[ i ];
    
    		// Checks the timer has not already been removed
    		if ( !timer() && timers[ i ] === timer ) {
    			timers.splice( i--, 1 );
    		}
    	}
    
    	if ( !timers.length ) {
    		jQuery.fx.stop();
    	}
    	fxNow = undefined;
    };
    
    jQuery.fx.timer = function( timer ) {
    	jQuery.timers.push( timer );
    	if ( timer() ) {
    		jQuery.fx.start();
    	} else {
    		jQuery.timers.pop();
    	}
    };
    
    jQuery.fx.interval = 13;
    jQuery.fx.start = function() {
    	if ( !timerId ) {
    		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
    	}
    };
    
    jQuery.fx.stop = function() {
    	window.clearInterval( timerId );
    
    	timerId = null;
    };
    
    jQuery.fx.speeds = {
    	slow: 600,
    	fast: 200,
    
    	// Default speed
    	_default: 400
    };
    
    
    // Based off of the plugin by Clint Helfers, with permission.
    // http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function( time, type ) {
    	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    	type = type || "fx";
    
    	return this.queue( type, function( next, hooks ) {
    		var timeout = window.setTimeout( next, time );
    		hooks.stop = function() {
    			window.clearTimeout( timeout );
    		};
    	} );
    };
    
    
    ( function() {
    	var input = document.createElement( "input" ),
    		select = document.createElement( "select" ),
    		opt = select.appendChild( document.createElement( "option" ) );
    
    	input.type = "checkbox";
    
    	// Support: iOS<=5.1, Android<=4.2+
    	// Default value for a checkbox should be "on"
    	support.checkOn = input.value !== "";
    
    	// Support: IE<=11+
    	// Must access selectedIndex to make default options select
    	support.optSelected = opt.selected;
    
    	// Support: Android<=2.3
    	// Options inside disabled selects are incorrectly marked as disabled
    	select.disabled = true;
    	support.optDisabled = !opt.disabled;
    
    	// Support: IE<=11+
    	// An input loses its value after becoming a radio
    	input = document.createElement( "input" );
    	input.value = "t";
    	input.type = "radio";
    	support.radioValue = input.value === "t";
    } )();
    
    
    var boolHook,
    	attrHandle = jQuery.expr.attrHandle;
    
    jQuery.fn.extend( {
    	attr: function( name, value ) {
    		return access( this, jQuery.attr, name, value, arguments.length > 1 );
    	},
    
    	removeAttr: function( name ) {
    		return this.each( function() {
    			jQuery.removeAttr( this, name );
    		} );
    	}
    } );
    
    jQuery.extend( {
    	attr: function( elem, name, value ) {
    		var ret, hooks,
    			nType = elem.nodeType;
    
    		// Don't get/set attributes on text, comment and attribute nodes
    		if ( nType === 3 || nType === 8 || nType === 2 ) {
    			return;
    		}
    
    		// Fallback to prop when attributes are not supported
    		if ( typeof elem.getAttribute === "undefined" ) {
    			return jQuery.prop( elem, name, value );
    		}
    
    		// All attributes are lowercase
    		// Grab necessary hook if one is defined
    		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
    			name = name.toLowerCase();
    			hooks = jQuery.attrHooks[ name ] ||
    				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
    		}
    
    		if ( value !== undefined ) {
    			if ( value === null ) {
    				jQuery.removeAttr( elem, name );
    				return;
    			}
    
    			if ( hooks && "set" in hooks &&
    				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    				return ret;
    			}
    
    			elem.setAttribute( name, value + "" );
    			return value;
    		}
    
    		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    			return ret;
    		}
    
    		ret = jQuery.find.attr( elem, name );
    
    		// Non-existent attributes return null, we normalize to undefined
    		return ret == null ? undefined : ret;
    	},
    
    	attrHooks: {
    		type: {
    			set: function( elem, value ) {
    				if ( !support.radioValue && value === "radio" &&
    					jQuery.nodeName( elem, "input" ) ) {
    					var val = elem.value;
    					elem.setAttribute( "type", value );
    					if ( val ) {
    						elem.value = val;
    					}
    					return value;
    				}
    			}
    		}
    	},
    
    	removeAttr: function( elem, value ) {
    		var name, propName,
    			i = 0,
    			attrNames = value && value.match( rnotwhite );
    
    		if ( attrNames && elem.nodeType === 1 ) {
    			while ( ( name = attrNames[ i++ ] ) ) {
    				propName = jQuery.propFix[ name ] || name;
    
    				// Boolean attributes get special treatment (#10870)
    				if ( jQuery.expr.match.bool.test( name ) ) {
    
    					// Set corresponding property to false
    					elem[ propName ] = false;
    				}
    
    				elem.removeAttribute( name );
    			}
    		}
    	}
    } );
    
    // Hooks for boolean attributes
    boolHook = {
    	set: function( elem, value, name ) {
    		if ( value === false ) {
    
    			// Remove boolean attributes when set to false
    			jQuery.removeAttr( elem, name );
    		} else {
    			elem.setAttribute( name, name );
    		}
    		return name;
    	}
    };
    jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
    	var getter = attrHandle[ name ] || jQuery.find.attr;
    
    	attrHandle[ name ] = function( elem, name, isXML ) {
    		var ret, handle;
    		if ( !isXML ) {
    
    			// Avoid an infinite loop by temporarily removing this function from the getter
    			handle = attrHandle[ name ];
    			attrHandle[ name ] = ret;
    			ret = getter( elem, name, isXML ) != null ?
    				name.toLowerCase() :
    				null;
    			attrHandle[ name ] = handle;
    		}
    		return ret;
    	};
    } );
    
    
    
    
    var rfocusable = /^(?:input|select|textarea|button)$/i,
    	rclickable = /^(?:a|area)$/i;
    
    jQuery.fn.extend( {
    	prop: function( name, value ) {
    		return access( this, jQuery.prop, name, value, arguments.length > 1 );
    	},
    
    	removeProp: function( name ) {
    		return this.each( function() {
    			delete this[ jQuery.propFix[ name ] || name ];
    		} );
    	}
    } );
    
    jQuery.extend( {
    	prop: function( elem, name, value ) {
    		var ret, hooks,
    			nType = elem.nodeType;
    
    		// Don't get/set properties on text, comment and attribute nodes
    		if ( nType === 3 || nType === 8 || nType === 2 ) {
    			return;
    		}
    
    		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
    
    			// Fix name and attach hooks
    			name = jQuery.propFix[ name ] || name;
    			hooks = jQuery.propHooks[ name ];
    		}
    
    		if ( value !== undefined ) {
    			if ( hooks && "set" in hooks &&
    				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    				return ret;
    			}
    
    			return ( elem[ name ] = value );
    		}
    
    		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    			return ret;
    		}
    
    		return elem[ name ];
    	},
    
    	propHooks: {
    		tabIndex: {
    			get: function( elem ) {
    
    				// elem.tabIndex doesn't always return the
    				// correct value when it hasn't been explicitly set
    				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
    				// Use proper attribute retrieval(#12072)
    				var tabindex = jQuery.find.attr( elem, "tabindex" );
    
    				return tabindex ?
    					parseInt( tabindex, 10 ) :
    					rfocusable.test( elem.nodeName ) ||
    						rclickable.test( elem.nodeName ) && elem.href ?
    							0 :
    							-1;
    			}
    		}
    	},
    
    	propFix: {
    		"for": "htmlFor",
    		"class": "className"
    	}
    } );
    
    // Support: IE <=11 only
    // Accessing the selectedIndex property
    // forces the browser to respect setting selected
    // on the option
    // The getter ensures a default option is selected
    // when in an optgroup
    if ( !support.optSelected ) {
    	jQuery.propHooks.selected = {
    		get: function( elem ) {
    			var parent = elem.parentNode;
    			if ( parent && parent.parentNode ) {
    				parent.parentNode.selectedIndex;
    			}
    			return null;
    		},
    		set: function( elem ) {
    			var parent = elem.parentNode;
    			if ( parent ) {
    				parent.selectedIndex;
    
    				if ( parent.parentNode ) {
    					parent.parentNode.selectedIndex;
    				}
    			}
    		}
    	};
    }
    
    jQuery.each( [
    	"tabIndex",
    	"readOnly",
    	"maxLength",
    	"cellSpacing",
    	"cellPadding",
    	"rowSpan",
    	"colSpan",
    	"useMap",
    	"frameBorder",
    	"contentEditable"
    ], function() {
    	jQuery.propFix[ this.toLowerCase() ] = this;
    } );
    
    
    
    
    var rclass = /[\t\r\n\f]/g;
    
    function getClass( elem ) {
    	return elem.getAttribute && elem.getAttribute( "class" ) || "";
    }
    
    jQuery.fn.extend( {
    	addClass: function( value ) {
    		var classes, elem, cur, curValue, clazz, j, finalValue,
    			i = 0;
    
    		if ( jQuery.isFunction( value ) ) {
    			return this.each( function( j ) {
    				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
    			} );
    		}
    
    		if ( typeof value === "string" && value ) {
    			classes = value.match( rnotwhite ) || [];
    
    			while ( ( elem = this[ i++ ] ) ) {
    				curValue = getClass( elem );
    				cur = elem.nodeType === 1 &&
    					( " " + curValue + " " ).replace( rclass, " " );
    
    				if ( cur ) {
    					j = 0;
    					while ( ( clazz = classes[ j++ ] ) ) {
    						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
    							cur += clazz + " ";
    						}
    					}
    
    					// Only assign if different to avoid unneeded rendering.
    					finalValue = jQuery.trim( cur );
    					if ( curValue !== finalValue ) {
    						elem.setAttribute( "class", finalValue );
    					}
    				}
    			}
    		}
    
    		return this;
    	},
    
    	removeClass: function( value ) {
    		var classes, elem, cur, curValue, clazz, j, finalValue,
    			i = 0;
    
    		if ( jQuery.isFunction( value ) ) {
    			return this.each( function( j ) {
    				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
    			} );
    		}
    
    		if ( !arguments.length ) {
    			return this.attr( "class", "" );
    		}
    
    		if ( typeof value === "string" && value ) {
    			classes = value.match( rnotwhite ) || [];
    
    			while ( ( elem = this[ i++ ] ) ) {
    				curValue = getClass( elem );
    
    				// This expression is here for better compressibility (see addClass)
    				cur = elem.nodeType === 1 &&
    					( " " + curValue + " " ).replace( rclass, " " );
    
    				if ( cur ) {
    					j = 0;
    					while ( ( clazz = classes[ j++ ] ) ) {
    
    						// Remove *all* instances
    						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
    							cur = cur.replace( " " + clazz + " ", " " );
    						}
    					}
    
    					// Only assign if different to avoid unneeded rendering.
    					finalValue = jQuery.trim( cur );
    					if ( curValue !== finalValue ) {
    						elem.setAttribute( "class", finalValue );
    					}
    				}
    			}
    		}
    
    		return this;
    	},
    
    	toggleClass: function( value, stateVal ) {
    		var type = typeof value;
    
    		if ( typeof stateVal === "boolean" && type === "string" ) {
    			return stateVal ? this.addClass( value ) : this.removeClass( value );
    		}
    
    		if ( jQuery.isFunction( value ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).toggleClass(
    					value.call( this, i, getClass( this ), stateVal ),
    					stateVal
    				);
    			} );
    		}
    
    		return this.each( function() {
    			var className, i, self, classNames;
    
    			if ( type === "string" ) {
    
    				// Toggle individual class names
    				i = 0;
    				self = jQuery( this );
    				classNames = value.match( rnotwhite ) || [];
    
    				while ( ( className = classNames[ i++ ] ) ) {
    
    					// Check each className given, space separated list
    					if ( self.hasClass( className ) ) {
    						self.removeClass( className );
    					} else {
    						self.addClass( className );
    					}
    				}
    
    			// Toggle whole class name
    			} else if ( value === undefined || type === "boolean" ) {
    				className = getClass( this );
    				if ( className ) {
    
    					// Store className if set
    					dataPriv.set( this, "__className__", className );
    				}
    
    				// If the element has a class name or if we're passed `false`,
    				// then remove the whole classname (if there was one, the above saved it).
    				// Otherwise bring back whatever was previously saved (if anything),
    				// falling back to the empty string if nothing was stored.
    				if ( this.setAttribute ) {
    					this.setAttribute( "class",
    						className || value === false ?
    						"" :
    						dataPriv.get( this, "__className__" ) || ""
    					);
    				}
    			}
    		} );
    	},
    
    	hasClass: function( selector ) {
    		var className, elem,
    			i = 0;
    
    		className = " " + selector + " ";
    		while ( ( elem = this[ i++ ] ) ) {
    			if ( elem.nodeType === 1 &&
    				( " " + getClass( elem ) + " " ).replace( rclass, " " )
    					.indexOf( className ) > -1
    			) {
    				return true;
    			}
    		}
    
    		return false;
    	}
    } );
    
    
    
    
    var rreturn = /\r/g,
    	rspaces = /[\x20\t\r\n\f]+/g;
    
    jQuery.fn.extend( {
    	val: function( value ) {
    		var hooks, ret, isFunction,
    			elem = this[ 0 ];
    
    		if ( !arguments.length ) {
    			if ( elem ) {
    				hooks = jQuery.valHooks[ elem.type ] ||
    					jQuery.valHooks[ elem.nodeName.toLowerCase() ];
    
    				if ( hooks &&
    					"get" in hooks &&
    					( ret = hooks.get( elem, "value" ) ) !== undefined
    				) {
    					return ret;
    				}
    
    				ret = elem.value;
    
    				return typeof ret === "string" ?
    
    					// Handle most common string cases
    					ret.replace( rreturn, "" ) :
    
    					// Handle cases where value is null/undef or number
    					ret == null ? "" : ret;
    			}
    
    			return;
    		}
    
    		isFunction = jQuery.isFunction( value );
    
    		return this.each( function( i ) {
    			var val;
    
    			if ( this.nodeType !== 1 ) {
    				return;
    			}
    
    			if ( isFunction ) {
    				val = value.call( this, i, jQuery( this ).val() );
    			} else {
    				val = value;
    			}
    
    			// Treat null/undefined as ""; convert numbers to string
    			if ( val == null ) {
    				val = "";
    
    			} else if ( typeof val === "number" ) {
    				val += "";
    
    			} else if ( jQuery.isArray( val ) ) {
    				val = jQuery.map( val, function( value ) {
    					return value == null ? "" : value + "";
    				} );
    			}
    
    			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
    
    			// If set returns undefined, fall back to normal setting
    			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
    				this.value = val;
    			}
    		} );
    	}
    } );
    
    jQuery.extend( {
    	valHooks: {
    		option: {
    			get: function( elem ) {
    
    				var val = jQuery.find.attr( elem, "value" );
    				return val != null ?
    					val :
    
    					// Support: IE10-11+
    					// option.text throws exceptions (#14686, #14858)
    					// Strip and collapse whitespace
    					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
    					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
    			}
    		},
    		select: {
    			get: function( elem ) {
    				var value, option,
    					options = elem.options,
    					index = elem.selectedIndex,
    					one = elem.type === "select-one" || index < 0,
    					values = one ? null : [],
    					max = one ? index + 1 : options.length,
    					i = index < 0 ?
    						max :
    						one ? index : 0;
    
    				// Loop through all the selected options
    				for ( ; i < max; i++ ) {
    					option = options[ i ];
    
    					// IE8-9 doesn't update selected after form reset (#2551)
    					if ( ( option.selected || i === index ) &&
    
    							// Don't return options that are disabled or in a disabled optgroup
    							( support.optDisabled ?
    								!option.disabled : option.getAttribute( "disabled" ) === null ) &&
    							( !option.parentNode.disabled ||
    								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
    
    						// Get the specific value for the option
    						value = jQuery( option ).val();
    
    						// We don't need an array for one selects
    						if ( one ) {
    							return value;
    						}
    
    						// Multi-Selects return an array
    						values.push( value );
    					}
    				}
    
    				return values;
    			},
    
    			set: function( elem, value ) {
    				var optionSet, option,
    					options = elem.options,
    					values = jQuery.makeArray( value ),
    					i = options.length;
    
    				while ( i-- ) {
    					option = options[ i ];
    					if ( option.selected =
    						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
    					) {
    						optionSet = true;
    					}
    				}
    
    				// Force browsers to behave consistently when non-matching value is set
    				if ( !optionSet ) {
    					elem.selectedIndex = -1;
    				}
    				return values;
    			}
    		}
    	}
    } );
    
    // Radios and checkboxes getter/setter
    jQuery.each( [ "radio", "checkbox" ], function() {
    	jQuery.valHooks[ this ] = {
    		set: function( elem, value ) {
    			if ( jQuery.isArray( value ) ) {
    				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
    			}
    		}
    	};
    	if ( !support.checkOn ) {
    		jQuery.valHooks[ this ].get = function( elem ) {
    			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
    		};
    	}
    } );
    
    
    
    
    // Return jQuery for attributes-only inclusion
    
    
    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
    
    jQuery.extend( jQuery.event, {
    
    	trigger: function( event, data, elem, onlyHandlers ) {
    
    		var i, cur, tmp, bubbleType, ontype, handle, special,
    			eventPath = [ elem || document ],
    			type = hasOwn.call( event, "type" ) ? event.type : event,
    			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];
    
    		cur = tmp = elem = elem || document;
    
    		// Don't do events on text and comment nodes
    		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
    			return;
    		}
    
    		// focus/blur morphs to focusin/out; ensure we're not firing them right now
    		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
    			return;
    		}
    
    		if ( type.indexOf( "." ) > -1 ) {
    
    			// Namespaced trigger; create a regexp to match event type in handle()
    			namespaces = type.split( "." );
    			type = namespaces.shift();
    			namespaces.sort();
    		}
    		ontype = type.indexOf( ":" ) < 0 && "on" + type;
    
    		// Caller can pass in a jQuery.Event object, Object, or just an event type string
    		event = event[ jQuery.expando ] ?
    			event :
    			new jQuery.Event( type, typeof event === "object" && event );
    
    		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
    		event.isTrigger = onlyHandlers ? 2 : 3;
    		event.namespace = namespaces.join( "." );
    		event.rnamespace = event.namespace ?
    			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
    			null;
    
    		// Clean up the event in case it is being reused
    		event.result = undefined;
    		if ( !event.target ) {
    			event.target = elem;
    		}
    
    		// Clone any incoming data and prepend the event, creating the handler arg list
    		data = data == null ?
    			[ event ] :
    			jQuery.makeArray( data, [ event ] );
    
    		// Allow special events to draw outside the lines
    		special = jQuery.event.special[ type ] || {};
    		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
    			return;
    		}
    
    		// Determine event propagation path in advance, per W3C events spec (#9951)
    		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
    
    			bubbleType = special.delegateType || type;
    			if ( !rfocusMorph.test( bubbleType + type ) ) {
    				cur = cur.parentNode;
    			}
    			for ( ; cur; cur = cur.parentNode ) {
    				eventPath.push( cur );
    				tmp = cur;
    			}
    
    			// Only add window if we got to document (e.g., not plain obj or detached DOM)
    			if ( tmp === ( elem.ownerDocument || document ) ) {
    				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
    			}
    		}
    
    		// Fire handlers on the event path
    		i = 0;
    		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
    
    			event.type = i > 1 ?
    				bubbleType :
    				special.bindType || type;
    
    			// jQuery handler
    			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
    				dataPriv.get( cur, "handle" );
    			if ( handle ) {
    				handle.apply( cur, data );
    			}
    
    			// Native handler
    			handle = ontype && cur[ ontype ];
    			if ( handle && handle.apply && acceptData( cur ) ) {
    				event.result = handle.apply( cur, data );
    				if ( event.result === false ) {
    					event.preventDefault();
    				}
    			}
    		}
    		event.type = type;
    
    		// If nobody prevented the default action, do it now
    		if ( !onlyHandlers && !event.isDefaultPrevented() ) {
    
    			if ( ( !special._default ||
    				special._default.apply( eventPath.pop(), data ) === false ) &&
    				acceptData( elem ) ) {
    
    				// Call a native DOM method on the target with the same name name as the event.
    				// Don't do default actions on window, that's where global variables be (#6170)
    				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {
    
    					// Don't re-trigger an onFOO event when we call its FOO() method
    					tmp = elem[ ontype ];
    
    					if ( tmp ) {
    						elem[ ontype ] = null;
    					}
    
    					// Prevent re-triggering of the same event, since we already bubbled it above
    					jQuery.event.triggered = type;
    					elem[ type ]();
    					jQuery.event.triggered = undefined;
    
    					if ( tmp ) {
    						elem[ ontype ] = tmp;
    					}
    				}
    			}
    		}
    
    		return event.result;
    	},
    
    	// Piggyback on a donor event to simulate a different one
    	// Used only for `focus(in | out)` events
    	simulate: function( type, elem, event ) {
    		var e = jQuery.extend(
    			new jQuery.Event(),
    			event,
    			{
    				type: type,
    				isSimulated: true
    			}
    		);
    
    		jQuery.event.trigger( e, null, elem );
    	}
    
    } );
    
    jQuery.fn.extend( {
    
    	trigger: function( type, data ) {
    		return this.each( function() {
    			jQuery.event.trigger( type, data, this );
    		} );
    	},
    	triggerHandler: function( type, data ) {
    		var elem = this[ 0 ];
    		if ( elem ) {
    			return jQuery.event.trigger( type, data, elem, true );
    		}
    	}
    } );
    
    
    jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
    	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
    	function( i, name ) {
    
    	// Handle event binding
    	jQuery.fn[ name ] = function( data, fn ) {
    		return arguments.length > 0 ?
    			this.on( name, null, data, fn ) :
    			this.trigger( name );
    	};
    } );
    
    jQuery.fn.extend( {
    	hover: function( fnOver, fnOut ) {
    		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    	}
    } );
    
    
    
    
    support.focusin = "onfocusin" in window;
    
    
    // Support: Firefox
    // Firefox doesn't have focus(in | out) events
    // Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
    //
    // Support: Chrome, Safari
    // focus(in | out) events fire after focus & blur events,
    // which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
    // Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
    if ( !support.focusin ) {
    	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {
    
    		// Attach a single capturing handler on the document while someone wants focusin/focusout
    		var handler = function( event ) {
    			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
    		};
    
    		jQuery.event.special[ fix ] = {
    			setup: function() {
    				var doc = this.ownerDocument || this,
    					attaches = dataPriv.access( doc, fix );
    
    				if ( !attaches ) {
    					doc.addEventListener( orig, handler, true );
    				}
    				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
    			},
    			teardown: function() {
    				var doc = this.ownerDocument || this,
    					attaches = dataPriv.access( doc, fix ) - 1;
    
    				if ( !attaches ) {
    					doc.removeEventListener( orig, handler, true );
    					dataPriv.remove( doc, fix );
    
    				} else {
    					dataPriv.access( doc, fix, attaches );
    				}
    			}
    		};
    	} );
    }
    var location = window.location;
    
    var nonce = jQuery.now();
    
    var rquery = ( /\?/ );
    
    
    
    // Support: Android 2.3
    // Workaround failure to string-cast null input
    jQuery.parseJSON = function( data ) {
    	return JSON.parse( data + "" );
    };
    
    
    // Cross-browser xml parsing
    jQuery.parseXML = function( data ) {
    	var xml;
    	if ( !data || typeof data !== "string" ) {
    		return null;
    	}
    
    	// Support: IE9
    	try {
    		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
    	} catch ( e ) {
    		xml = undefined;
    	}
    
    	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
    		jQuery.error( "Invalid XML: " + data );
    	}
    	return xml;
    };
    
    
    var
    	rhash = /#.*$/,
    	rts = /([?&])_=[^&]*/,
    	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
    
    	// #7653, #8125, #8152: local protocol detection
    	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    	rnoContent = /^(?:GET|HEAD)$/,
    	rprotocol = /^\/\//,
    
    	/* Prefilters
    	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    	 * 2) These are called:
    	 *    - BEFORE asking for a transport
    	 *    - AFTER param serialization (s.data is a string if s.processData is true)
    	 * 3) key is the dataType
    	 * 4) the catchall symbol "*" can be used
    	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    	 */
    	prefilters = {},
    
    	/* Transports bindings
    	 * 1) key is the dataType
    	 * 2) the catchall symbol "*" can be used
    	 * 3) selection will start with transport dataType and THEN go to "*" if needed
    	 */
    	transports = {},
    
    	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    	allTypes = "*/".concat( "*" ),
    
    	// Anchor tag for parsing the document origin
    	originAnchor = document.createElement( "a" );
    	originAnchor.href = location.href;
    
    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {
    
    	// dataTypeExpression is optional and defaults to "*"
    	return function( dataTypeExpression, func ) {
    
    		if ( typeof dataTypeExpression !== "string" ) {
    			func = dataTypeExpression;
    			dataTypeExpression = "*";
    		}
    
    		var dataType,
    			i = 0,
    			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];
    
    		if ( jQuery.isFunction( func ) ) {
    
    			// For each dataType in the dataTypeExpression
    			while ( ( dataType = dataTypes[ i++ ] ) ) {
    
    				// Prepend if requested
    				if ( dataType[ 0 ] === "+" ) {
    					dataType = dataType.slice( 1 ) || "*";
    					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );
    
    				// Otherwise append
    				} else {
    					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
    				}
    			}
    		}
    	};
    }
    
    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
    
    	var inspected = {},
    		seekingTransport = ( structure === transports );
    
    	function inspect( dataType ) {
    		var selected;
    		inspected[ dataType ] = true;
    		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
    			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
    			if ( typeof dataTypeOrTransport === "string" &&
    				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {
    
    				options.dataTypes.unshift( dataTypeOrTransport );
    				inspect( dataTypeOrTransport );
    				return false;
    			} else if ( seekingTransport ) {
    				return !( selected = dataTypeOrTransport );
    			}
    		} );
    		return selected;
    	}
    
    	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    }
    
    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend( target, src ) {
    	var key, deep,
    		flatOptions = jQuery.ajaxSettings.flatOptions || {};
    
    	for ( key in src ) {
    		if ( src[ key ] !== undefined ) {
    			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    		}
    	}
    	if ( deep ) {
    		jQuery.extend( true, target, deep );
    	}
    
    	return target;
    }
    
    /* Handles responses to an ajax request:
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {
    
    	var ct, type, finalDataType, firstDataType,
    		contents = s.contents,
    		dataTypes = s.dataTypes;
    
    	// Remove auto dataType and get content-type in the process
    	while ( dataTypes[ 0 ] === "*" ) {
    		dataTypes.shift();
    		if ( ct === undefined ) {
    			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
    		}
    	}
    
    	// Check if we're dealing with a known content-type
    	if ( ct ) {
    		for ( type in contents ) {
    			if ( contents[ type ] && contents[ type ].test( ct ) ) {
    				dataTypes.unshift( type );
    				break;
    			}
    		}
    	}
    
    	// Check to see if we have a response for the expected dataType
    	if ( dataTypes[ 0 ] in responses ) {
    		finalDataType = dataTypes[ 0 ];
    	} else {
    
    		// Try convertible dataTypes
    		for ( type in responses ) {
    			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
    				finalDataType = type;
    				break;
    			}
    			if ( !firstDataType ) {
    				firstDataType = type;
    			}
    		}
    
    		// Or just use first one
    		finalDataType = finalDataType || firstDataType;
    	}
    
    	// If we found a dataType
    	// We add the dataType to the list if needed
    	// and return the corresponding response
    	if ( finalDataType ) {
    		if ( finalDataType !== dataTypes[ 0 ] ) {
    			dataTypes.unshift( finalDataType );
    		}
    		return responses[ finalDataType ];
    	}
    }
    
    /* Chain conversions given the request and the original response
     * Also sets the responseXXX fields on the jqXHR instance
     */
    function ajaxConvert( s, response, jqXHR, isSuccess ) {
    	var conv2, current, conv, tmp, prev,
    		converters = {},
    
    		// Work with a copy of dataTypes in case we need to modify it for conversion
    		dataTypes = s.dataTypes.slice();
    
    	// Create converters map with lowercased keys
    	if ( dataTypes[ 1 ] ) {
    		for ( conv in s.converters ) {
    			converters[ conv.toLowerCase() ] = s.converters[ conv ];
    		}
    	}
    
    	current = dataTypes.shift();
    
    	// Convert to each sequential dataType
    	while ( current ) {
    
    		if ( s.responseFields[ current ] ) {
    			jqXHR[ s.responseFields[ current ] ] = response;
    		}
    
    		// Apply the dataFilter if provided
    		if ( !prev && isSuccess && s.dataFilter ) {
    			response = s.dataFilter( response, s.dataType );
    		}
    
    		prev = current;
    		current = dataTypes.shift();
    
    		if ( current ) {
    
    		// There's only work to do if current dataType is non-auto
    			if ( current === "*" ) {
    
    				current = prev;
    
    			// Convert response if prev dataType is non-auto and differs from current
    			} else if ( prev !== "*" && prev !== current ) {
    
    				// Seek a direct converter
    				conv = converters[ prev + " " + current ] || converters[ "* " + current ];
    
    				// If none found, seek a pair
    				if ( !conv ) {
    					for ( conv2 in converters ) {
    
    						// If conv2 outputs current
    						tmp = conv2.split( " " );
    						if ( tmp[ 1 ] === current ) {
    
    							// If prev can be converted to accepted input
    							conv = converters[ prev + " " + tmp[ 0 ] ] ||
    								converters[ "* " + tmp[ 0 ] ];
    							if ( conv ) {
    
    								// Condense equivalence converters
    								if ( conv === true ) {
    									conv = converters[ conv2 ];
    
    								// Otherwise, insert the intermediate dataType
    								} else if ( converters[ conv2 ] !== true ) {
    									current = tmp[ 0 ];
    									dataTypes.unshift( tmp[ 1 ] );
    								}
    								break;
    							}
    						}
    					}
    				}
    
    				// Apply converter (if not an equivalence)
    				if ( conv !== true ) {
    
    					// Unless errors are allowed to bubble, catch and return them
    					if ( conv && s.throws ) {
    						response = conv( response );
    					} else {
    						try {
    							response = conv( response );
    						} catch ( e ) {
    							return {
    								state: "parsererror",
    								error: conv ? e : "No conversion from " + prev + " to " + current
    							};
    						}
    					}
    				}
    			}
    		}
    	}
    
    	return { state: "success", data: response };
    }
    
    jQuery.extend( {
    
    	// Counter for holding the number of active queries
    	active: 0,
    
    	// Last-Modified header cache for next request
    	lastModified: {},
    	etag: {},
    
    	ajaxSettings: {
    		url: location.href,
    		type: "GET",
    		isLocal: rlocalProtocol.test( location.protocol ),
    		global: true,
    		processData: true,
    		async: true,
    		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    		/*
    		timeout: 0,
    		data: null,
    		dataType: null,
    		username: null,
    		password: null,
    		cache: null,
    		throws: false,
    		traditional: false,
    		headers: {},
    		*/
    
    		accepts: {
    			"*": allTypes,
    			text: "text/plain",
    			html: "text/html",
    			xml: "application/xml, text/xml",
    			json: "application/json, text/javascript"
    		},
    
    		contents: {
    			xml: /\bxml\b/,
    			html: /\bhtml/,
    			json: /\bjson\b/
    		},
    
    		responseFields: {
    			xml: "responseXML",
    			text: "responseText",
    			json: "responseJSON"
    		},
    
    		// Data converters
    		// Keys separate source (or catchall "*") and destination types with a single space
    		converters: {
    
    			// Convert anything to text
    			"* text": String,
    
    			// Text to html (true = no transformation)
    			"text html": true,
    
    			// Evaluate text as a json expression
    			"text json": jQuery.parseJSON,
    
    			// Parse text as xml
    			"text xml": jQuery.parseXML
    		},
    
    		// For options that shouldn't be deep extended:
    		// you can add your own custom options here if
    		// and when you create one that shouldn't be
    		// deep extended (see ajaxExtend)
    		flatOptions: {
    			url: true,
    			context: true
    		}
    	},
    
    	// Creates a full fledged settings object into target
    	// with both ajaxSettings and settings fields.
    	// If target is omitted, writes into ajaxSettings.
    	ajaxSetup: function( target, settings ) {
    		return settings ?
    
    			// Building a settings object
    			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
    
    			// Extending ajaxSettings
    			ajaxExtend( jQuery.ajaxSettings, target );
    	},
    
    	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    	ajaxTransport: addToPrefiltersOrTransports( transports ),
    
    	// Main method
    	ajax: function( url, options ) {
    
    		// If url is an object, simulate pre-1.5 signature
    		if ( typeof url === "object" ) {
    			options = url;
    			url = undefined;
    		}
    
    		// Force options to be an object
    		options = options || {};
    
    		var transport,
    
    			// URL without anti-cache param
    			cacheURL,
    
    			// Response headers
    			responseHeadersString,
    			responseHeaders,
    
    			// timeout handle
    			timeoutTimer,
    
    			// Url cleanup var
    			urlAnchor,
    
    			// To know if global events are to be dispatched
    			fireGlobals,
    
    			// Loop variable
    			i,
    
    			// Create the final options object
    			s = jQuery.ajaxSetup( {}, options ),
    
    			// Callbacks context
    			callbackContext = s.context || s,
    
    			// Context for global events is callbackContext if it is a DOM node or jQuery collection
    			globalEventContext = s.context &&
    				( callbackContext.nodeType || callbackContext.jquery ) ?
    					jQuery( callbackContext ) :
    					jQuery.event,
    
    			// Deferreds
    			deferred = jQuery.Deferred(),
    			completeDeferred = jQuery.Callbacks( "once memory" ),
    
    			// Status-dependent callbacks
    			statusCode = s.statusCode || {},
    
    			// Headers (they are sent all at once)
    			requestHeaders = {},
    			requestHeadersNames = {},
    
    			// The jqXHR state
    			state = 0,
    
    			// Default abort message
    			strAbort = "canceled",
    
    			// Fake xhr
    			jqXHR = {
    				readyState: 0,
    
    				// Builds headers hashtable if needed
    				getResponseHeader: function( key ) {
    					var match;
    					if ( state === 2 ) {
    						if ( !responseHeaders ) {
    							responseHeaders = {};
    							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
    								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
    							}
    						}
    						match = responseHeaders[ key.toLowerCase() ];
    					}
    					return match == null ? null : match;
    				},
    
    				// Raw string
    				getAllResponseHeaders: function() {
    					return state === 2 ? responseHeadersString : null;
    				},
    
    				// Caches the header
    				setRequestHeader: function( name, value ) {
    					var lname = name.toLowerCase();
    					if ( !state ) {
    						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
    						requestHeaders[ name ] = value;
    					}
    					return this;
    				},
    
    				// Overrides response content-type header
    				overrideMimeType: function( type ) {
    					if ( !state ) {
    						s.mimeType = type;
    					}
    					return this;
    				},
    
    				// Status-dependent callbacks
    				statusCode: function( map ) {
    					var code;
    					if ( map ) {
    						if ( state < 2 ) {
    							for ( code in map ) {
    
    								// Lazy-add the new callback in a way that preserves old ones
    								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
    							}
    						} else {
    
    							// Execute the appropriate callbacks
    							jqXHR.always( map[ jqXHR.status ] );
    						}
    					}
    					return this;
    				},
    
    				// Cancel the request
    				abort: function( statusText ) {
    					var finalText = statusText || strAbort;
    					if ( transport ) {
    						transport.abort( finalText );
    					}
    					done( 0, finalText );
    					return this;
    				}
    			};
    
    		// Attach deferreds
    		deferred.promise( jqXHR ).complete = completeDeferred.add;
    		jqXHR.success = jqXHR.done;
    		jqXHR.error = jqXHR.fail;
    
    		// Remove hash character (#7531: and string promotion)
    		// Add protocol if not provided (prefilters might expect it)
    		// Handle falsy url in the settings object (#10093: consistency with old signature)
    		// We also use the url parameter if available
    		s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
    			.replace( rprotocol, location.protocol + "//" );
    
    		// Alias method option to type as per ticket #12004
    		s.type = options.method || options.type || s.method || s.type;
    
    		// Extract dataTypes list
    		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];
    
    		// A cross-domain request is in order when the origin doesn't match the current origin.
    		if ( s.crossDomain == null ) {
    			urlAnchor = document.createElement( "a" );
    
    			// Support: IE8-11+
    			// IE throws exception if url is malformed, e.g. http://example.com:80x/
    			try {
    				urlAnchor.href = s.url;
    
    				// Support: IE8-11+
    				// Anchor's host property isn't correctly set when s.url is relative
    				urlAnchor.href = urlAnchor.href;
    				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
    					urlAnchor.protocol + "//" + urlAnchor.host;
    			} catch ( e ) {
    
    				// If there is an error parsing the URL, assume it is crossDomain,
    				// it can be rejected by the transport if it is invalid
    				s.crossDomain = true;
    			}
    		}
    
    		// Convert data if not already a string
    		if ( s.data && s.processData && typeof s.data !== "string" ) {
    			s.data = jQuery.param( s.data, s.traditional );
    		}
    
    		// Apply prefilters
    		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
    
    		// If request was aborted inside a prefilter, stop there
    		if ( state === 2 ) {
    			return jqXHR;
    		}
    
    		// We can fire global events as of now if asked to
    		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
    		fireGlobals = jQuery.event && s.global;
    
    		// Watch for a new set of requests
    		if ( fireGlobals && jQuery.active++ === 0 ) {
    			jQuery.event.trigger( "ajaxStart" );
    		}
    
    		// Uppercase the type
    		s.type = s.type.toUpperCase();
    
    		// Determine if request has content
    		s.hasContent = !rnoContent.test( s.type );
    
    		// Save the URL in case we're toying with the If-Modified-Since
    		// and/or If-None-Match header later on
    		cacheURL = s.url;
    
    		// More options handling for requests with no content
    		if ( !s.hasContent ) {
    
    			// If data is available, append data to url
    			if ( s.data ) {
    				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
    
    				// #9682: remove data so that it's not used in an eventual retry
    				delete s.data;
    			}
    
    			// Add anti-cache in url if needed
    			if ( s.cache === false ) {
    				s.url = rts.test( cacheURL ) ?
    
    					// If there is already a '_' parameter, set its value
    					cacheURL.replace( rts, "$1_=" + nonce++ ) :
    
    					// Otherwise add one to the end
    					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
    			}
    		}
    
    		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    		if ( s.ifModified ) {
    			if ( jQuery.lastModified[ cacheURL ] ) {
    				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
    			}
    			if ( jQuery.etag[ cacheURL ] ) {
    				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
    			}
    		}
    
    		// Set the correct header, if data is being sent
    		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
    			jqXHR.setRequestHeader( "Content-Type", s.contentType );
    		}
    
    		// Set the Accepts header for the server, depending on the dataType
    		jqXHR.setRequestHeader(
    			"Accept",
    			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
    				s.accepts[ s.dataTypes[ 0 ] ] +
    					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
    				s.accepts[ "*" ]
    		);
    
    		// Check for headers option
    		for ( i in s.headers ) {
    			jqXHR.setRequestHeader( i, s.headers[ i ] );
    		}
    
    		// Allow custom headers/mimetypes and early abort
    		if ( s.beforeSend &&
    			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
    
    			// Abort if not done already and return
    			return jqXHR.abort();
    		}
    
    		// Aborting is no longer a cancellation
    		strAbort = "abort";
    
    		// Install callbacks on deferreds
    		for ( i in { success: 1, error: 1, complete: 1 } ) {
    			jqXHR[ i ]( s[ i ] );
    		}
    
    		// Get transport
    		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
    
    		// If no transport, we auto-abort
    		if ( !transport ) {
    			done( -1, "No Transport" );
    		} else {
    			jqXHR.readyState = 1;
    
    			// Send global event
    			if ( fireGlobals ) {
    				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
    			}
    
    			// If request was aborted inside ajaxSend, stop there
    			if ( state === 2 ) {
    				return jqXHR;
    			}
    
    			// Timeout
    			if ( s.async && s.timeout > 0 ) {
    				timeoutTimer = window.setTimeout( function() {
    					jqXHR.abort( "timeout" );
    				}, s.timeout );
    			}
    
    			try {
    				state = 1;
    				transport.send( requestHeaders, done );
    			} catch ( e ) {
    
    				// Propagate exception as error if not done
    				if ( state < 2 ) {
    					done( -1, e );
    
    				// Simply rethrow otherwise
    				} else {
    					throw e;
    				}
    			}
    		}
    
    		// Callback for when everything is done
    		function done( status, nativeStatusText, responses, headers ) {
    			var isSuccess, success, error, response, modified,
    				statusText = nativeStatusText;
    
    			// Called once
    			if ( state === 2 ) {
    				return;
    			}
    
    			// State is "done" now
    			state = 2;
    
    			// Clear timeout if it exists
    			if ( timeoutTimer ) {
    				window.clearTimeout( timeoutTimer );
    			}
    
    			// Dereference transport for early garbage collection
    			// (no matter how long the jqXHR object will be used)
    			transport = undefined;
    
    			// Cache response headers
    			responseHeadersString = headers || "";
    
    			// Set readyState
    			jqXHR.readyState = status > 0 ? 4 : 0;
    
    			// Determine if successful
    			isSuccess = status >= 200 && status < 300 || status === 304;
    
    			// Get response data
    			if ( responses ) {
    				response = ajaxHandleResponses( s, jqXHR, responses );
    			}
    
    			// Convert no matter what (that way responseXXX fields are always set)
    			response = ajaxConvert( s, response, jqXHR, isSuccess );
    
    			// If successful, handle type chaining
    			if ( isSuccess ) {
    
    				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    				if ( s.ifModified ) {
    					modified = jqXHR.getResponseHeader( "Last-Modified" );
    					if ( modified ) {
    						jQuery.lastModified[ cacheURL ] = modified;
    					}
    					modified = jqXHR.getResponseHeader( "etag" );
    					if ( modified ) {
    						jQuery.etag[ cacheURL ] = modified;
    					}
    				}
    
    				// if no content
    				if ( status === 204 || s.type === "HEAD" ) {
    					statusText = "nocontent";
    
    				// if not modified
    				} else if ( status === 304 ) {
    					statusText = "notmodified";
    
    				// If we have data, let's convert it
    				} else {
    					statusText = response.state;
    					success = response.data;
    					error = response.error;
    					isSuccess = !error;
    				}
    			} else {
    
    				// Extract error from statusText and normalize for non-aborts
    				error = statusText;
    				if ( status || !statusText ) {
    					statusText = "error";
    					if ( status < 0 ) {
    						status = 0;
    					}
    				}
    			}
    
    			// Set data for the fake xhr object
    			jqXHR.status = status;
    			jqXHR.statusText = ( nativeStatusText || statusText ) + "";
    
    			// Success/Error
    			if ( isSuccess ) {
    				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
    			} else {
    				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
    			}
    
    			// Status-dependent callbacks
    			jqXHR.statusCode( statusCode );
    			statusCode = undefined;
    
    			if ( fireGlobals ) {
    				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
    					[ jqXHR, s, isSuccess ? success : error ] );
    			}
    
    			// Complete
    			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
    
    			if ( fireGlobals ) {
    				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
    
    				// Handle the global AJAX counter
    				if ( !( --jQuery.active ) ) {
    					jQuery.event.trigger( "ajaxStop" );
    				}
    			}
    		}
    
    		return jqXHR;
    	},
    
    	getJSON: function( url, data, callback ) {
    		return jQuery.get( url, data, callback, "json" );
    	},
    
    	getScript: function( url, callback ) {
    		return jQuery.get( url, undefined, callback, "script" );
    	}
    } );
    
    jQuery.each( [ "get", "post" ], function( i, method ) {
    	jQuery[ method ] = function( url, data, callback, type ) {
    
    		// Shift arguments if data argument was omitted
    		if ( jQuery.isFunction( data ) ) {
    			type = type || callback;
    			callback = data;
    			data = undefined;
    		}
    
    		// The url can be an options object (which then must have .url)
    		return jQuery.ajax( jQuery.extend( {
    			url: url,
    			type: method,
    			dataType: type,
    			data: data,
    			success: callback
    		}, jQuery.isPlainObject( url ) && url ) );
    	};
    } );
    
    
    jQuery._evalUrl = function( url ) {
    	return jQuery.ajax( {
    		url: url,
    
    		// Make this explicit, since user can override this through ajaxSetup (#11264)
    		type: "GET",
    		dataType: "script",
    		async: false,
    		global: false,
    		"throws": true
    	} );
    };
    
    
    jQuery.fn.extend( {
    	wrapAll: function( html ) {
    		var wrap;
    
    		if ( jQuery.isFunction( html ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).wrapAll( html.call( this, i ) );
    			} );
    		}
    
    		if ( this[ 0 ] ) {
    
    			// The elements to wrap the target around
    			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
    
    			if ( this[ 0 ].parentNode ) {
    				wrap.insertBefore( this[ 0 ] );
    			}
    
    			wrap.map( function() {
    				var elem = this;
    
    				while ( elem.firstElementChild ) {
    					elem = elem.firstElementChild;
    				}
    
    				return elem;
    			} ).append( this );
    		}
    
    		return this;
    	},
    
    	wrapInner: function( html ) {
    		if ( jQuery.isFunction( html ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).wrapInner( html.call( this, i ) );
    			} );
    		}
    
    		return this.each( function() {
    			var self = jQuery( this ),
    				contents = self.contents();
    
    			if ( contents.length ) {
    				contents.wrapAll( html );
    
    			} else {
    				self.append( html );
    			}
    		} );
    	},
    
    	wrap: function( html ) {
    		var isFunction = jQuery.isFunction( html );
    
    		return this.each( function( i ) {
    			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
    		} );
    	},
    
    	unwrap: function() {
    		return this.parent().each( function() {
    			if ( !jQuery.nodeName( this, "body" ) ) {
    				jQuery( this ).replaceWith( this.childNodes );
    			}
    		} ).end();
    	}
    } );
    
    
    jQuery.expr.filters.hidden = function( elem ) {
    	return !jQuery.expr.filters.visible( elem );
    };
    jQuery.expr.filters.visible = function( elem ) {
    
    	// Support: Opera <= 12.12
    	// Opera reports offsetWidths and offsetHeights less than zero on some elements
    	// Use OR instead of AND as the element is not visible if either is true
    	// See tickets #10406 and #13132
    	return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
    };
    
    
    
    
    var r20 = /%20/g,
    	rbracket = /\[\]$/,
    	rCRLF = /\r?\n/g,
    	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    	rsubmittable = /^(?:input|select|textarea|keygen)/i;
    
    function buildParams( prefix, obj, traditional, add ) {
    	var name;
    
    	if ( jQuery.isArray( obj ) ) {
    
    		// Serialize array item.
    		jQuery.each( obj, function( i, v ) {
    			if ( traditional || rbracket.test( prefix ) ) {
    
    				// Treat each array item as a scalar.
    				add( prefix, v );
    
    			} else {
    
    				// Item is non-scalar (array or object), encode its numeric index.
    				buildParams(
    					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
    					v,
    					traditional,
    					add
    				);
    			}
    		} );
    
    	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
    
    		// Serialize object item.
    		for ( name in obj ) {
    			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    		}
    
    	} else {
    
    		// Serialize scalar item.
    		add( prefix, obj );
    	}
    }
    
    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function( a, traditional ) {
    	var prefix,
    		s = [],
    		add = function( key, value ) {
    
    			// If value is a function, invoke it and return its value
    			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
    			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    		};
    
    	// Set traditional to true for jQuery <= 1.3.2 behavior.
    	if ( traditional === undefined ) {
    		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    	}
    
    	// If an array was passed in, assume that it is an array of form elements.
    	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
    
    		// Serialize the form elements
    		jQuery.each( a, function() {
    			add( this.name, this.value );
    		} );
    
    	} else {
    
    		// If traditional, encode the "old" way (the way 1.3.2 or older
    		// did it), otherwise encode params recursively.
    		for ( prefix in a ) {
    			buildParams( prefix, a[ prefix ], traditional, add );
    		}
    	}
    
    	// Return the resulting serialization
    	return s.join( "&" ).replace( r20, "+" );
    };
    
    jQuery.fn.extend( {
    	serialize: function() {
    		return jQuery.param( this.serializeArray() );
    	},
    	serializeArray: function() {
    		return this.map( function() {
    
    			// Can add propHook for "elements" to filter or add form elements
    			var elements = jQuery.prop( this, "elements" );
    			return elements ? jQuery.makeArray( elements ) : this;
    		} )
    		.filter( function() {
    			var type = this.type;
    
    			// Use .is( ":disabled" ) so that fieldset[disabled] works
    			return this.name && !jQuery( this ).is( ":disabled" ) &&
    				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
    				( this.checked || !rcheckableType.test( type ) );
    		} )
    		.map( function( i, elem ) {
    			var val = jQuery( this ).val();
    
    			return val == null ?
    				null :
    				jQuery.isArray( val ) ?
    					jQuery.map( val, function( val ) {
    						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    					} ) :
    					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    		} ).get();
    	}
    } );
    
    
    jQuery.ajaxSettings.xhr = function() {
    	try {
    		return new window.XMLHttpRequest();
    	} catch ( e ) {}
    };
    
    var xhrSuccessStatus = {
    
    		// File protocol always yields status code 0, assume 200
    		0: 200,
    
    		// Support: IE9
    		// #1450: sometimes IE returns 1223 when it should be 204
    		1223: 204
    	},
    	xhrSupported = jQuery.ajaxSettings.xhr();
    
    support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    support.ajax = xhrSupported = !!xhrSupported;
    
    jQuery.ajaxTransport( function( options ) {
    	var callback, errorCallback;
    
    	// Cross domain only allowed if supported through XMLHttpRequest
    	if ( support.cors || xhrSupported && !options.crossDomain ) {
    		return {
    			send: function( headers, complete ) {
    				var i,
    					xhr = options.xhr();
    
    				xhr.open(
    					options.type,
    					options.url,
    					options.async,
    					options.username,
    					options.password
    				);
    
    				// Apply custom fields if provided
    				if ( options.xhrFields ) {
    					for ( i in options.xhrFields ) {
    						xhr[ i ] = options.xhrFields[ i ];
    					}
    				}
    
    				// Override mime type if needed
    				if ( options.mimeType && xhr.overrideMimeType ) {
    					xhr.overrideMimeType( options.mimeType );
    				}
    
    				// X-Requested-With header
    				// For cross-domain requests, seeing as conditions for a preflight are
    				// akin to a jigsaw puzzle, we simply never set it to be sure.
    				// (it can always be set on a per-request basis or even using ajaxSetup)
    				// For same-domain requests, won't change header if already provided.
    				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
    					headers[ "X-Requested-With" ] = "XMLHttpRequest";
    				}
    
    				// Set headers
    				for ( i in headers ) {
    					xhr.setRequestHeader( i, headers[ i ] );
    				}
    
    				// Callback
    				callback = function( type ) {
    					return function() {
    						if ( callback ) {
    							callback = errorCallback = xhr.onload =
    								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
    
    							if ( type === "abort" ) {
    								xhr.abort();
    							} else if ( type === "error" ) {
    
    								// Support: IE9
    								// On a manual native abort, IE9 throws
    								// errors on any property access that is not readyState
    								if ( typeof xhr.status !== "number" ) {
    									complete( 0, "error" );
    								} else {
    									complete(
    
    										// File: protocol always yields status 0; see #8605, #14207
    										xhr.status,
    										xhr.statusText
    									);
    								}
    							} else {
    								complete(
    									xhrSuccessStatus[ xhr.status ] || xhr.status,
    									xhr.statusText,
    
    									// Support: IE9 only
    									// IE9 has no XHR2 but throws on binary (trac-11426)
    									// For XHR2 non-text, let the caller handle it (gh-2498)
    									( xhr.responseType || "text" ) !== "text"  ||
    									typeof xhr.responseText !== "string" ?
    										{ binary: xhr.response } :
    										{ text: xhr.responseText },
    									xhr.getAllResponseHeaders()
    								);
    							}
    						}
    					};
    				};
    
    				// Listen to events
    				xhr.onload = callback();
    				errorCallback = xhr.onerror = callback( "error" );
    
    				// Support: IE9
    				// Use onreadystatechange to replace onabort
    				// to handle uncaught aborts
    				if ( xhr.onabort !== undefined ) {
    					xhr.onabort = errorCallback;
    				} else {
    					xhr.onreadystatechange = function() {
    
    						// Check readyState before timeout as it changes
    						if ( xhr.readyState === 4 ) {
    
    							// Allow onerror to be called first,
    							// but that will not handle a native abort
    							// Also, save errorCallback to a variable
    							// as xhr.onerror cannot be accessed
    							window.setTimeout( function() {
    								if ( callback ) {
    									errorCallback();
    								}
    							} );
    						}
    					};
    				}
    
    				// Create the abort callback
    				callback = callback( "abort" );
    
    				try {
    
    					// Do send the request (this may raise an exception)
    					xhr.send( options.hasContent && options.data || null );
    				} catch ( e ) {
    
    					// #14683: Only rethrow if this hasn't been notified as an error yet
    					if ( callback ) {
    						throw e;
    					}
    				}
    			},
    
    			abort: function() {
    				if ( callback ) {
    					callback();
    				}
    			}
    		};
    	}
    } );
    
    
    
    
    // Install script dataType
    jQuery.ajaxSetup( {
    	accepts: {
    		script: "text/javascript, application/javascript, " +
    			"application/ecmascript, application/x-ecmascript"
    	},
    	contents: {
    		script: /\b(?:java|ecma)script\b/
    	},
    	converters: {
    		"text script": function( text ) {
    			jQuery.globalEval( text );
    			return text;
    		}
    	}
    } );
    
    // Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter( "script", function( s ) {
    	if ( s.cache === undefined ) {
    		s.cache = false;
    	}
    	if ( s.crossDomain ) {
    		s.type = "GET";
    	}
    } );
    
    // Bind script tag hack transport
    jQuery.ajaxTransport( "script", function( s ) {
    
    	// This transport only deals with cross domain requests
    	if ( s.crossDomain ) {
    		var script, callback;
    		return {
    			send: function( _, complete ) {
    				script = jQuery( "<script>" ).prop( {
    					charset: s.scriptCharset,
    					src: s.url
    				} ).on(
    					"load error",
    					callback = function( evt ) {
    						script.remove();
    						callback = null;
    						if ( evt ) {
    							complete( evt.type === "error" ? 404 : 200, evt.type );
    						}
    					}
    				);
    
    				// Use native DOM manipulation to avoid our domManip AJAX trickery
    				document.head.appendChild( script[ 0 ] );
    			},
    			abort: function() {
    				if ( callback ) {
    					callback();
    				}
    			}
    		};
    	}
    } );
    
    
    
    
    var oldCallbacks = [],
    	rjsonp = /(=)\?(?=&|$)|\?\?/;
    
    // Default jsonp settings
    jQuery.ajaxSetup( {
    	jsonp: "callback",
    	jsonpCallback: function() {
    		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
    		this[ callback ] = true;
    		return callback;
    	}
    } );
    
    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
    
    	var callbackName, overwritten, responseContainer,
    		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
    			"url" :
    			typeof s.data === "string" &&
    				( s.contentType || "" )
    					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
    				rjsonp.test( s.data ) && "data"
    		);
    
    	// Handle iff the expected data type is "jsonp" or we have a parameter to set
    	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
    
    		// Get callback name, remembering preexisting value associated with it
    		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
    			s.jsonpCallback() :
    			s.jsonpCallback;
    
    		// Insert callback into url or form data
    		if ( jsonProp ) {
    			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
    		} else if ( s.jsonp !== false ) {
    			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    		}
    
    		// Use data converter to retrieve json after script execution
    		s.converters[ "script json" ] = function() {
    			if ( !responseContainer ) {
    				jQuery.error( callbackName + " was not called" );
    			}
    			return responseContainer[ 0 ];
    		};
    
    		// Force json dataType
    		s.dataTypes[ 0 ] = "json";
    
    		// Install callback
    		overwritten = window[ callbackName ];
    		window[ callbackName ] = function() {
    			responseContainer = arguments;
    		};
    
    		// Clean-up function (fires after converters)
    		jqXHR.always( function() {
    
    			// If previous value didn't exist - remove it
    			if ( overwritten === undefined ) {
    				jQuery( window ).removeProp( callbackName );
    
    			// Otherwise restore preexisting value
    			} else {
    				window[ callbackName ] = overwritten;
    			}
    
    			// Save back as free
    			if ( s[ callbackName ] ) {
    
    				// Make sure that re-using the options doesn't screw things around
    				s.jsonpCallback = originalSettings.jsonpCallback;
    
    				// Save the callback name for future use
    				oldCallbacks.push( callbackName );
    			}
    
    			// Call if it was a function and we have a response
    			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
    				overwritten( responseContainer[ 0 ] );
    			}
    
    			responseContainer = overwritten = undefined;
    		} );
    
    		// Delegate to script
    		return "script";
    	}
    } );
    
    
    
    
    // Argument "data" should be string of html
    // context (optional): If specified, the fragment will be created in this context,
    // defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function( data, context, keepScripts ) {
    	if ( !data || typeof data !== "string" ) {
    		return null;
    	}
    	if ( typeof context === "boolean" ) {
    		keepScripts = context;
    		context = false;
    	}
    	context = context || document;
    
    	var parsed = rsingleTag.exec( data ),
    		scripts = !keepScripts && [];
    
    	// Single tag
    	if ( parsed ) {
    		return [ context.createElement( parsed[ 1 ] ) ];
    	}
    
    	parsed = buildFragment( [ data ], context, scripts );
    
    	if ( scripts && scripts.length ) {
    		jQuery( scripts ).remove();
    	}
    
    	return jQuery.merge( [], parsed.childNodes );
    };
    
    
    // Keep a copy of the old load method
    var _load = jQuery.fn.load;
    
    /**
     * Load a url into a page
     */
    jQuery.fn.load = function( url, params, callback ) {
    	if ( typeof url !== "string" && _load ) {
    		return _load.apply( this, arguments );
    	}
    
    	var selector, type, response,
    		self = this,
    		off = url.indexOf( " " );
    
    	if ( off > -1 ) {
    		selector = jQuery.trim( url.slice( off ) );
    		url = url.slice( 0, off );
    	}
    
    	// If it's a function
    	if ( jQuery.isFunction( params ) ) {
    
    		// We assume that it's the callback
    		callback = params;
    		params = undefined;
    
    	// Otherwise, build a param string
    	} else if ( params && typeof params === "object" ) {
    		type = "POST";
    	}
    
    	// If we have elements to modify, make the request
    	if ( self.length > 0 ) {
    		jQuery.ajax( {
    			url: url,
    
    			// If "type" variable is undefined, then "GET" method will be used.
    			// Make value of this field explicit since
    			// user can override it through ajaxSetup method
    			type: type || "GET",
    			dataType: "html",
    			data: params
    		} ).done( function( responseText ) {
    
    			// Save response for use in complete callback
    			response = arguments;
    
    			self.html( selector ?
    
    				// If a selector was specified, locate the right elements in a dummy div
    				// Exclude scripts to avoid IE 'Permission Denied' errors
    				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :
    
    				// Otherwise use the full result
    				responseText );
    
    		// If the request succeeds, this function gets "data", "status", "jqXHR"
    		// but they are ignored because response was set above.
    		// If it fails, this function gets "jqXHR", "status", "error"
    		} ).always( callback && function( jqXHR, status ) {
    			self.each( function() {
    				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
    			} );
    		} );
    	}
    
    	return this;
    };
    
    
    
    
    // Attach a bunch of functions for handling common AJAX events
    jQuery.each( [
    	"ajaxStart",
    	"ajaxStop",
    	"ajaxComplete",
    	"ajaxError",
    	"ajaxSuccess",
    	"ajaxSend"
    ], function( i, type ) {
    	jQuery.fn[ type ] = function( fn ) {
    		return this.on( type, fn );
    	};
    } );
    
    
    
    
    jQuery.expr.filters.animated = function( elem ) {
    	return jQuery.grep( jQuery.timers, function( fn ) {
    		return elem === fn.elem;
    	} ).length;
    };
    
    
    
    
    /**
     * Gets a window from an element
     */
    function getWindow( elem ) {
    	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    
    jQuery.offset = {
    	setOffset: function( elem, options, i ) {
    		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
    			position = jQuery.css( elem, "position" ),
    			curElem = jQuery( elem ),
    			props = {};
    
    		// Set position first, in-case top/left are set even on static elem
    		if ( position === "static" ) {
    			elem.style.position = "relative";
    		}
    
    		curOffset = curElem.offset();
    		curCSSTop = jQuery.css( elem, "top" );
    		curCSSLeft = jQuery.css( elem, "left" );
    		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
    			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;
    
    		// Need to be able to calculate position if either
    		// top or left is auto and position is either absolute or fixed
    		if ( calculatePosition ) {
    			curPosition = curElem.position();
    			curTop = curPosition.top;
    			curLeft = curPosition.left;
    
    		} else {
    			curTop = parseFloat( curCSSTop ) || 0;
    			curLeft = parseFloat( curCSSLeft ) || 0;
    		}
    
    		if ( jQuery.isFunction( options ) ) {
    
    			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
    			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
    		}
    
    		if ( options.top != null ) {
    			props.top = ( options.top - curOffset.top ) + curTop;
    		}
    		if ( options.left != null ) {
    			props.left = ( options.left - curOffset.left ) + curLeft;
    		}
    
    		if ( "using" in options ) {
    			options.using.call( elem, props );
    
    		} else {
    			curElem.css( props );
    		}
    	}
    };
    
    jQuery.fn.extend( {
    	offset: function( options ) {
    		if ( arguments.length ) {
    			return options === undefined ?
    				this :
    				this.each( function( i ) {
    					jQuery.offset.setOffset( this, options, i );
    				} );
    		}
    
    		var docElem, win,
    			elem = this[ 0 ],
    			box = { top: 0, left: 0 },
    			doc = elem && elem.ownerDocument;
    
    		if ( !doc ) {
    			return;
    		}
    
    		docElem = doc.documentElement;
    
    		// Make sure it's not a disconnected DOM node
    		if ( !jQuery.contains( docElem, elem ) ) {
    			return box;
    		}
    
    		box = elem.getBoundingClientRect();
    		win = getWindow( doc );
    		return {
    			top: box.top + win.pageYOffset - docElem.clientTop,
    			left: box.left + win.pageXOffset - docElem.clientLeft
    		};
    	},
    
    	position: function() {
    		if ( !this[ 0 ] ) {
    			return;
    		}
    
    		var offsetParent, offset,
    			elem = this[ 0 ],
    			parentOffset = { top: 0, left: 0 };
    
    		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
    		// because it is its only offset parent
    		if ( jQuery.css( elem, "position" ) === "fixed" ) {
    
    			// Assume getBoundingClientRect is there when computed position is fixed
    			offset = elem.getBoundingClientRect();
    
    		} else {
    
    			// Get *real* offsetParent
    			offsetParent = this.offsetParent();
    
    			// Get correct offsets
    			offset = this.offset();
    			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
    				parentOffset = offsetParent.offset();
    			}
    
    			// Add offsetParent borders
    			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
    			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
    		}
    
    		// Subtract parent offsets and element margins
    		return {
    			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
    			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
    		};
    	},
    
    	// This method will return documentElement in the following cases:
    	// 1) For the element inside the iframe without offsetParent, this method will return
    	//    documentElement of the parent window
    	// 2) For the hidden or detached element
    	// 3) For body or html element, i.e. in case of the html node - it will return itself
    	//
    	// but those exceptions were never presented as a real life use-cases
    	// and might be considered as more preferable results.
    	//
    	// This logic, however, is not guaranteed and can change at any point in the future
    	offsetParent: function() {
    		return this.map( function() {
    			var offsetParent = this.offsetParent;
    
    			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
    				offsetParent = offsetParent.offsetParent;
    			}
    
    			return offsetParent || documentElement;
    		} );
    	}
    } );
    
    // Create scrollLeft and scrollTop methods
    jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
    	var top = "pageYOffset" === prop;
    
    	jQuery.fn[ method ] = function( val ) {
    		return access( this, function( elem, method, val ) {
    			var win = getWindow( elem );
    
    			if ( val === undefined ) {
    				return win ? win[ prop ] : elem[ method ];
    			}
    
    			if ( win ) {
    				win.scrollTo(
    					!top ? val : win.pageXOffset,
    					top ? val : win.pageYOffset
    				);
    
    			} else {
    				elem[ method ] = val;
    			}
    		}, method, val, arguments.length );
    	};
    } );
    
    // Support: Safari<7-8+, Chrome<37-44+
    // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
    // getComputedStyle returns percent when specified for top/left/bottom/right;
    // rather than make the css module depend on the offset module, just check for it here
    jQuery.each( [ "top", "left" ], function( i, prop ) {
    	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
    		function( elem, computed ) {
    			if ( computed ) {
    				computed = curCSS( elem, prop );
    
    				// If curCSS returns percentage, fallback to offset
    				return rnumnonpx.test( computed ) ?
    					jQuery( elem ).position()[ prop ] + "px" :
    					computed;
    			}
    		}
    	);
    } );
    
    
    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
    	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
    		function( defaultExtra, funcName ) {
    
    		// Margin is only for outerHeight, outerWidth
    		jQuery.fn[ funcName ] = function( margin, value ) {
    			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
    				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
    
    			return access( this, function( elem, type, value ) {
    				var doc;
    
    				if ( jQuery.isWindow( elem ) ) {
    
    					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
    					// isn't a whole lot we can do. See pull request at this URL for discussion:
    					// https://github.com/jquery/jquery/pull/764
    					return elem.document.documentElement[ "client" + name ];
    				}
    
    				// Get document width or height
    				if ( elem.nodeType === 9 ) {
    					doc = elem.documentElement;
    
    					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
    					// whichever is greatest
    					return Math.max(
    						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
    						elem.body[ "offset" + name ], doc[ "offset" + name ],
    						doc[ "client" + name ]
    					);
    				}
    
    				return value === undefined ?
    
    					// Get width or height on the element, requesting but not forcing parseFloat
    					jQuery.css( elem, type, extra ) :
    
    					// Set width or height on the element
    					jQuery.style( elem, type, value, extra );
    			}, type, chainable ? margin : undefined, chainable, null );
    		};
    	} );
    } );
    
    
    jQuery.fn.extend( {
    
    	bind: function( types, data, fn ) {
    		return this.on( types, null, data, fn );
    	},
    	unbind: function( types, fn ) {
    		return this.off( types, null, fn );
    	},
    
    	delegate: function( selector, types, data, fn ) {
    		return this.on( types, selector, data, fn );
    	},
    	undelegate: function( selector, types, fn ) {
    
    		// ( namespace ) or ( selector, types [, fn] )
    		return arguments.length === 1 ?
    			this.off( selector, "**" ) :
    			this.off( types, selector || "**", fn );
    	},
    	size: function() {
    		return this.length;
    	}
    } );
    
    jQuery.fn.andSelf = jQuery.fn.addBack;
    
    
    
    
    // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jquery is used because AMD module names are
    // derived from file names, and jQuery is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jQuery, it will work.
    
    // Note that for maximum portability, libraries that are not jQuery should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. jQuery is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
    
    if ( typeof define === "function" && define.amd ) {
    	define( "jquery", [], function() {
    		return jQuery;
    	} );
    }
    
    
    
    var
    
    	// Map over jQuery in case of overwrite
    	_jQuery = window.jQuery,
    
    	// Map over the $ in case of overwrite
    	_$ = window.$;
    
    jQuery.noConflict = function( deep ) {
    	if ( window.$ === jQuery ) {
    		window.$ = _$;
    	}
    
    	if ( deep && window.jQuery === jQuery ) {
    		window.jQuery = _jQuery;
    	}
    
    	return jQuery;
    };
    
    // Expose jQuery and $ identifiers, even in AMD
    // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
    // and CommonJS for browser emulators (#13566)
    if ( !noGlobal ) {
    	window.jQuery = window.$ = jQuery;
    }
    
    return jQuery;
    }));
    
  provide("jquery", module.exports);
}(global));

// pakmanager:pf-dropdown
(function (context) {
  
  var module = { exports: {} }, exports = module.exports
    , $ = require("ender")
    ;
  
  !function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t,n){var r,i;/*!
     * jQuery JavaScript Library v2.2.4
     * http://jquery.com/
     *
     * Includes Sizzle.js
     * http://sizzlejs.com/
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2016-05-20T17:23Z
     */
    !function(t,n){"object"==typeof e&&"object"==typeof e.exports?e.exports=t.document?n(t,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return n(e)}:n(t)}("undefined"!=typeof window?window:this,function(n,o){function a(e){var t=!!e&&"length"in e&&e.length,n=le.type(e);return"function"!==n&&!le.isWindow(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}function s(e,t,n){if(le.isFunction(t))return le.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return le.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(ye.test(t))return le.filter(t,e,n);t=le.filter(t,e)}return le.grep(e,function(e){return re.call(t,e)>-1!==n})}function l(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}function u(e){var t={};return le.each(e.match(Ce)||[],function(e,n){t[n]=!0}),t}function c(){Z.removeEventListener("DOMContentLoaded",c),n.removeEventListener("load",c),le.ready()}function f(){this.expando=le.expando+f.uid++}function p(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(De,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===n||"false"!==n&&("null"===n?null:+n+""===n?+n:Ae.test(n)?le.parseJSON(n):n)}catch(e){}Ne.set(e,t,n)}else n=void 0;return n}function d(e,t,n,r){var i,o=1,a=20,s=r?function(){return r.cur()}:function(){return le.css(e,t,"")},l=s(),u=n&&n[3]||(le.cssNumber[t]?"":"px"),c=(le.cssNumber[t]||"px"!==u&&+l)&&_e.exec(le.css(e,t));if(c&&c[3]!==u){u=u||c[3],n=n||[],c=+l||1;do{o=o||".5",c/=o,le.style(e,t,c+u)}while(o!==(o=s()/l)&&1!==o&&--a)}return n&&(c=+c||+l||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=u,r.start=c,r.end=i)),i}function h(e,t){var n=void 0!==e.getElementsByTagName?e.getElementsByTagName(t||"*"):void 0!==e.querySelectorAll?e.querySelectorAll(t||"*"):[];return void 0===t||t&&le.nodeName(e,t)?le.merge([e],n):n}function g(e,t){for(var n=0,r=e.length;n<r;n++)Ee.set(e[n],"globalEval",!t||Ee.get(t[n],"globalEval"))}function v(e,t,n,r,i){for(var o,a,s,l,u,c,f=t.createDocumentFragment(),p=[],d=0,v=e.length;d<v;d++)if((o=e[d])||0===o)if("object"===le.type(o))le.merge(p,o.nodeType?[o]:o);else if(Re.test(o)){for(a=a||f.appendChild(t.createElement("div")),s=(Ie.exec(o)||["",""])[1].toLowerCase(),l=Fe[s]||Fe._default,a.innerHTML=l[1]+le.htmlPrefilter(o)+l[2],c=l[0];c--;)a=a.lastChild;le.merge(p,a.childNodes),a=f.firstChild,a.textContent=""}else p.push(t.createTextNode(o));for(f.textContent="",d=0;o=p[d++];)if(r&&le.inArray(o,r)>-1)i&&i.push(o);else if(u=le.contains(o.ownerDocument,o),a=h(f.appendChild(o),"script"),u&&g(a),n)for(c=0;o=a[c++];)He.test(o.type||"")&&n.push(o);return f}function m(){return!0}function y(){return!1}function x(){try{return Z.activeElement}catch(e){}}function b(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)b(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=y;else if(!i)return e;return 1===o&&(a=i,i=function(e){return le().off(e),a.apply(this,arguments)},i.guid=a.guid||(a.guid=le.guid++)),e.each(function(){le.event.add(this,t,i,r,n)})}function w(e,t){return le.nodeName(e,"table")&&le.nodeName(11!==t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function T(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function C(e){var t=Ve.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function k(e,t){var n,r,i,o,a,s,l,u;if(1===t.nodeType){if(Ee.hasData(e)&&(o=Ee.access(e),a=Ee.set(t,o),u=o.events)){delete a.handle,a.events={};for(i in u)for(n=0,r=u[i].length;n<r;n++)le.event.add(t,i,u[i][n])}Ne.hasData(e)&&(s=Ne.access(e),l=le.extend({},s),Ne.set(t,l))}}function S(e,t){var n=t.nodeName.toLowerCase();"input"===n&&$e.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function j(e,t,n,r){t=te.apply([],t);var i,o,a,s,l,u,c=0,f=e.length,p=f-1,d=t[0],g=le.isFunction(d);if(g||f>1&&"string"==typeof d&&!se.checkClone&&Xe.test(d))return e.each(function(i){var o=e.eq(i);g&&(t[0]=d.call(this,i,o.html())),j(o,t,n,r)});if(f&&(i=v(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(a=le.map(h(i,"script"),T),s=a.length;c<f;c++)l=i,c!==p&&(l=le.clone(l,!0,!0),s&&le.merge(a,h(l,"script"))),n.call(e[c],l,c);if(s)for(u=a[a.length-1].ownerDocument,le.map(a,C),c=0;c<s;c++)l=a[c],He.test(l.type||"")&&!Ee.access(l,"globalEval")&&le.contains(u,l)&&(l.src?le._evalUrl&&le._evalUrl(l.src):le.globalEval(l.textContent.replace(Ue,"")))}return e}function E(e,t,n){for(var r,i=t?le.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||le.cleanData(h(r)),r.parentNode&&(n&&le.contains(r.ownerDocument,r)&&g(h(r,"script")),r.parentNode.removeChild(r));return e}function N(e,t){var n=le(t.createElement(e)).appendTo(t.body),r=le.css(n[0],"display");return n.detach(),r}function A(e){var t=Z,n=Ge[e];return n||(n=N(e,t),"none"!==n&&n||(Ke=(Ke||le("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),t=Ke[0].contentDocument,t.write(),t.close(),n=N(e,t),Ke.detach()),Ge[e]=n),n}function D(e,t,n){var r,i,o,a,s=e.style;return n=n||Je(e),a=n?n.getPropertyValue(t)||n[t]:void 0,""!==a&&void 0!==a||le.contains(e.ownerDocument,e)||(a=le.style(e,t)),n&&!se.pixelMarginRight()&&Qe.test(a)&&Ye.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o),void 0!==a?a+"":a}function L(e,t){return{get:function(){return e()?void delete this.get:(this.get=t).apply(this,arguments)}}}function _(e){if(e in ot)return e;for(var t=e[0].toUpperCase()+e.slice(1),n=it.length;n--;)if((e=it[n]+t)in ot)return e}function q(e,t,n){var r=_e.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function O(e,t,n,r,i){for(var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;o<4;o+=2)"margin"===n&&(a+=le.css(e,n+qe[o],!0,i)),r?("content"===n&&(a-=le.css(e,"padding"+qe[o],!0,i)),"margin"!==n&&(a-=le.css(e,"border"+qe[o]+"Width",!0,i))):(a+=le.css(e,"padding"+qe[o],!0,i),"padding"!==n&&(a+=le.css(e,"border"+qe[o]+"Width",!0,i)));return a}function $(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Je(e),a="border-box"===le.css(e,"boxSizing",!1,o);if(i<=0||null==i){if(i=D(e,t,o),(i<0||null==i)&&(i=e.style[t]),Qe.test(i))return i;r=a&&(se.boxSizingReliable()||i===e.style[t]),i=parseFloat(i)||0}return i+O(e,t,n||(a?"border":"content"),r,o)+"px"}function I(e,t){for(var n,r,i,o=[],a=0,s=e.length;a<s;a++)r=e[a],r.style&&(o[a]=Ee.get(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&Oe(r)&&(o[a]=Ee.access(r,"olddisplay",A(r.nodeName)))):(i=Oe(r),"none"===n&&i||Ee.set(r,"olddisplay",i?n:le.css(r,"display"))));for(a=0;a<s;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}function H(e,t,n,r,i){return new H.prototype.init(e,t,n,r,i)}function F(){return n.setTimeout(function(){at=void 0}),at=le.now()}function R(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)n=qe[r],i["margin"+n]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function P(e,t,n){for(var r,i=(B.tweeners[t]||[]).concat(B.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function M(e,t,n){var r,i,o,a,s,l,u,c=this,f={},p=e.style,d=e.nodeType&&Oe(e),h=Ee.get(e,"fxshow");n.queue||(s=le._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,c.always(function(){c.always(function(){s.unqueued--,le.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],u=le.css(e,"display"),"inline"===("none"===u?Ee.get(e,"olddisplay")||A(e.nodeName):u)&&"none"===le.css(e,"float")&&(p.display="inline-block")),n.overflow&&(p.overflow="hidden",c.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],lt.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(d?"hide":"show")){if("show"!==i||!h||void 0===h[r])continue;d=!0}f[r]=h&&h[r]||le.style(e,r)}else u=void 0;if(le.isEmptyObject(f))"inline"===("none"===u?A(e.nodeName):u)&&(p.display=u);else{h?"hidden"in h&&(d=h.hidden):h=Ee.access(e,"fxshow",{}),o&&(h.hidden=!d),d?le(e).show():c.done(function(){le(e).hide()}),c.done(function(){var t;Ee.remove(e,"fxshow");for(t in f)le.style(e,t,f[t])});for(r in f)a=P(d?h[r]:0,r,c),r in h||(h[r]=a.start,d&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function W(e,t){var n,r,i,o,a;for(n in e)if(r=le.camelCase(n),i=t[r],o=e[n],le.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=le.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function B(e,t,n){var r,i,o=0,a=B.prefilters.length,s=le.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;for(var t=at||F(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;a<l;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),o<1&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:le.extend({},t),opts:le.extend(!0,{specialEasing:{},easing:le.easing._default},n),originalProperties:t,originalOptions:n,startTime:at||F(),duration:n.duration,tweens:[],createTween:function(t,n){var r=le.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)u.tweens[n].run(1);return t?(s.notifyWith(e,[u,1,0]),s.resolveWith(e,[u,t])):s.rejectWith(e,[u,t]),this}}),c=u.props;for(W(c,u.opts.specialEasing);o<a;o++)if(r=B.prefilters[o].call(u,e,c,u.opts))return le.isFunction(r.stop)&&(le._queueHooks(u.elem,u.opts.queue).stop=le.proxy(r.stop,r)),r;return le.map(c,P,u),le.isFunction(u.opts.start)&&u.opts.start.call(e,u),le.fx.timer(le.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function z(e){return e.getAttribute&&e.getAttribute("class")||""}function X(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(Ce)||[];if(le.isFunction(n))for(;r=o[i++];)"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function V(e,t,n,r){function i(s){var l;return o[s]=!0,le.each(e[s]||[],function(e,s){var u=s(t,n,r);return"string"!=typeof u||a||o[u]?a?!(l=u):void 0:(t.dataTypes.unshift(u),i(u),!1)}),l}var o={},a=e===Nt;return i(t.dataTypes[0])||!o["*"]&&i("*")}function U(e,t){var n,r,i=le.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&le.extend(!0,e,r),e}function K(e,t,n){for(var r,i,o,a,s=e.contents,l=e.dataTypes;"*"===l[0];)l.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){l.unshift(i);break}if(l[0]in n)o=l[0];else{for(i in n){if(!l[0]||e.converters[i+" "+l[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==l[0]&&l.unshift(o),n[o]}function G(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];for(o=c.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(!(a=u[l+" "+o]||u["* "+o]))for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){!0===a?a=u[i]:!0!==u[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e.throws)t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}function Y(e,t,n,r){var i;if(le.isArray(t))le.each(t,function(t,i){n||_t.test(e)?r(e,i):Y(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==le.type(t))r(e,t);else for(i in t)Y(e+"["+i+"]",t[i],n,r)}function Q(e){return le.isWindow(e)?e:9===e.nodeType&&e.defaultView}var J=[],Z=n.document,ee=J.slice,te=J.concat,ne=J.push,re=J.indexOf,ie={},oe=ie.toString,ae=ie.hasOwnProperty,se={},le=function(e,t){return new le.fn.init(e,t)},ue=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,ce=/^-ms-/,fe=/-([\da-z])/gi,pe=function(e,t){return t.toUpperCase()};le.fn=le.prototype={jquery:"2.2.4",constructor:le,selector:"",length:0,toArray:function(){return ee.call(this)},get:function(e){return null!=e?e<0?this[e+this.length]:this[e]:ee.call(this)},pushStack:function(e){var t=le.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e){return le.each(this,e)},map:function(e){return this.pushStack(le.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(ee.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:ne,sort:J.sort,splice:J.splice},le.extend=le.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,l=arguments.length,u=!1;for("boolean"==typeof a&&(u=a,a=arguments[s]||{},s++),"object"==typeof a||le.isFunction(a)||(a={}),s===l&&(a=this,s--);s<l;s++)if(null!=(e=arguments[s]))for(t in e)n=a[t],r=e[t],a!==r&&(u&&r&&(le.isPlainObject(r)||(i=le.isArray(r)))?(i?(i=!1,o=n&&le.isArray(n)?n:[]):o=n&&le.isPlainObject(n)?n:{},a[t]=le.extend(u,o,r)):void 0!==r&&(a[t]=r));return a},le.extend({expando:"jQuery"+("2.2.4"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isFunction:function(e){return"function"===le.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){var t=e&&e.toString();return!le.isArray(e)&&t-parseFloat(t)+1>=0},isPlainObject:function(e){var t;if("object"!==le.type(e)||e.nodeType||le.isWindow(e))return!1;if(e.constructor&&!ae.call(e,"constructor")&&!ae.call(e.constructor.prototype||{},"isPrototypeOf"))return!1;for(t in e);return void 0===t||ae.call(e,t)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?ie[oe.call(e)]||"object":typeof e},globalEval:function(e){var t,n=eval;(e=le.trim(e))&&(1===e.indexOf("use strict")?(t=Z.createElement("script"),t.text=e,Z.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(ce,"ms-").replace(fe,pe)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t){var n,r=0;if(a(e))for(n=e.length;r<n&&!1!==t.call(e[r],r,e[r]);r++);else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(ue,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(a(Object(e))?le.merge(n,"string"==typeof e?[e]:e):ne.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:re.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,s=[];if(a(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return te.apply([],s)},guid:1,proxy:function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),le.isFunction(e))return r=ee.call(arguments,2),i=function(){return e.apply(t||this,r.concat(ee.call(arguments)))},i.guid=e.guid=e.guid||le.guid++,i},now:Date.now,support:se}),"function"==typeof Symbol&&(le.fn[Symbol.iterator]=J[Symbol.iterator]),le.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){ie["[object "+t+"]"]=t.toLowerCase()});var de=/*!
     * Sizzle CSS Selector Engine v2.2.1
     * http://sizzlejs.com/
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2015-10-17
     */
    function(e){function t(e,t,n,r){var i,o,a,s,u,f,p,d,h=t&&t.ownerDocument,g=t?t.nodeType:9;if(n=n||[],"string"!=typeof e||!e||1!==g&&9!==g&&11!==g)return n;if(!r&&((t?t.ownerDocument||t:F)!==D&&A(t),t=t||D,_)){if(11!==g&&(f=ge.exec(e)))if(i=f[1]){if(9===g){if(!(a=t.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(h&&(a=h.getElementById(i))&&I(t,a)&&a.id===i)return n.push(a),n}else{if(f[2])return Y.apply(n,t.getElementsByTagName(e)),n;if((i=f[3])&&x.getElementsByClassName&&t.getElementsByClassName)return Y.apply(n,t.getElementsByClassName(i)),n}if(x.qsa&&!B[e+" "]&&(!q||!q.test(e))){if(1!==g)h=t,d=e;else if("object"!==t.nodeName.toLowerCase()){for((s=t.getAttribute("id"))?s=s.replace(me,"\\$&"):t.setAttribute("id",s=H),p=C(e),o=p.length,u=ce.test(s)?"#"+s:"[id='"+s+"']";o--;)p[o]=u+" "+c(p[o]);d=p.join(","),h=ve.test(e)&&l(t.parentNode)||t}if(d)try{return Y.apply(n,h.querySelectorAll(d)),n}catch(e){}finally{s===H&&t.removeAttribute("id")}}}return S(e.replace(oe,"$1"),t,n,r)}function n(){function e(n,r){return t.push(n+" ")>b.cacheLength&&delete e[t.shift()],e[n+" "]=r}var t=[];return e}function r(e){return e[H]=!0,e}function i(e){var t=D.createElement("div");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function o(e,t){for(var n=e.split("|"),r=n.length;r--;)b.attrHandle[n[r]]=t}function a(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||X)-(~e.sourceIndex||X);if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function s(e){return r(function(t){return t=+t,r(function(n,r){for(var i,o=e([],n.length,t),a=o.length;a--;)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function l(e){return e&&void 0!==e.getElementsByTagName&&e}function u(){}function c(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function f(e,t,n){var r=t.dir,i=n&&"parentNode"===r,o=P++;return t.first?function(t,n,o){for(;t=t[r];)if(1===t.nodeType||i)return e(t,n,o)}:function(t,n,a){var s,l,u,c=[R,o];if(a){for(;t=t[r];)if((1===t.nodeType||i)&&e(t,n,a))return!0}else for(;t=t[r];)if(1===t.nodeType||i){if(u=t[H]||(t[H]={}),l=u[t.uniqueID]||(u[t.uniqueID]={}),(s=l[r])&&s[0]===R&&s[1]===o)return c[2]=s[2];if(l[r]=c,c[2]=e(t,n,a))return!0}}}function p(e){return e.length>1?function(t,n,r){for(var i=e.length;i--;)if(!e[i](t,n,r))return!1;return!0}:e[0]}function d(e,n,r){for(var i=0,o=n.length;i<o;i++)t(e,n[i],r);return r}function h(e,t,n,r,i){for(var o,a=[],s=0,l=e.length,u=null!=t;s<l;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),u&&t.push(s)));return a}function g(e,t,n,i,o,a){return i&&!i[H]&&(i=g(i)),o&&!o[H]&&(o=g(o,a)),r(function(r,a,s,l){var u,c,f,p=[],g=[],v=a.length,m=r||d(t||"*",s.nodeType?[s]:s,[]),y=!e||!r&&t?m:h(m,p,e,s,l),x=n?o||(r?e:v||i)?[]:a:y;if(n&&n(y,x,s,l),i)for(u=h(x,g),i(u,[],s,l),c=u.length;c--;)(f=u[c])&&(x[g[c]]=!(y[g[c]]=f));if(r){if(o||e){if(o){for(u=[],c=x.length;c--;)(f=x[c])&&u.push(y[c]=f);o(null,x=[],u,l)}for(c=x.length;c--;)(f=x[c])&&(u=o?J(r,f):p[c])>-1&&(r[u]=!(a[u]=f))}}else x=h(x===a?x.splice(v,x.length):x),o?o(null,a,x,l):Y.apply(a,x)})}function v(e){for(var t,n,r,i=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,l=f(function(e){return e===t},a,!0),u=f(function(e){return J(t,e)>-1},a,!0),d=[function(e,n,r){var i=!o&&(r||n!==j)||((t=n).nodeType?l(e,n,r):u(e,n,r));return t=null,i}];s<i;s++)if(n=b.relative[e[s].type])d=[f(p(d),n)];else{if(n=b.filter[e[s].type].apply(null,e[s].matches),n[H]){for(r=++s;r<i&&!b.relative[e[r].type];r++);return g(s>1&&p(d),s>1&&c(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace(oe,"$1"),n,s<r&&v(e.slice(s,r)),r<i&&v(e=e.slice(r)),r<i&&c(e))}d.push(n)}return p(d)}function m(e,n){var i=n.length>0,o=e.length>0,a=function(r,a,s,l,u){var c,f,p,d=0,g="0",v=r&&[],m=[],y=j,x=r||o&&b.find.TAG("*",u),w=R+=null==y?1:Math.random()||.1,T=x.length;for(u&&(j=a===D||a||u);g!==T&&null!=(c=x[g]);g++){if(o&&c){for(f=0,a||c.ownerDocument===D||(A(c),s=!_);p=e[f++];)if(p(c,a||D,s)){l.push(c);break}u&&(R=w)}i&&((c=!p&&c)&&d--,r&&v.push(c))}if(d+=g,i&&g!==d){for(f=0;p=n[f++];)p(v,m,a,s);if(r){if(d>0)for(;g--;)v[g]||m[g]||(m[g]=K.call(l));m=h(m)}Y.apply(l,m),u&&!r&&m.length>0&&d+n.length>1&&t.uniqueSort(l)}return u&&(R=w,j=y),v};return i?r(a):a}var y,x,b,w,T,C,k,S,j,E,N,A,D,L,_,q,O,$,I,H="sizzle"+1*new Date,F=e.document,R=0,P=0,M=n(),W=n(),B=n(),z=function(e,t){return e===t&&(N=!0),0},X=1<<31,V={}.hasOwnProperty,U=[],K=U.pop,G=U.push,Y=U.push,Q=U.slice,J=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},Z="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",ee="[\\x20\\t\\r\\n\\f]",te="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",ne="\\["+ee+"*("+te+")(?:"+ee+"*([*^$|!~]?=)"+ee+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+te+"))|)"+ee+"*\\]",re=":("+te+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+ne+")*)|.*)\\)|)",ie=new RegExp(ee+"+","g"),oe=new RegExp("^"+ee+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ee+"+$","g"),ae=new RegExp("^"+ee+"*,"+ee+"*"),se=new RegExp("^"+ee+"*([>+~]|"+ee+")"+ee+"*"),le=new RegExp("="+ee+"*([^\\]'\"]*?)"+ee+"*\\]","g"),ue=new RegExp(re),ce=new RegExp("^"+te+"$"),fe={ID:new RegExp("^#("+te+")"),CLASS:new RegExp("^\\.("+te+")"),TAG:new RegExp("^("+te+"|[*])"),ATTR:new RegExp("^"+ne),PSEUDO:new RegExp("^"+re),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ee+"*(even|odd|(([+-]|)(\\d*)n|)"+ee+"*(?:([+-]|)"+ee+"*(\\d+)|))"+ee+"*\\)|)","i"),bool:new RegExp("^(?:"+Z+")$","i"),needsContext:new RegExp("^"+ee+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ee+"*((?:-\\d)?\\d*)"+ee+"*\\)|)(?=[^-]|$)","i")},pe=/^(?:input|select|textarea|button)$/i,de=/^h\d$/i,he=/^[^{]+\{\s*\[native \w/,ge=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ve=/[+~]/,me=/'|\\/g,ye=new RegExp("\\\\([\\da-f]{1,6}"+ee+"?|("+ee+")|.)","ig"),xe=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},be=function(){A()};try{Y.apply(U=Q.call(F.childNodes),F.childNodes),U[F.childNodes.length].nodeType}catch(e){Y={apply:U.length?function(e,t){G.apply(e,Q.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}x=t.support={},T=t.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},A=t.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:F;return r!==D&&9===r.nodeType&&r.documentElement?(D=r,L=D.documentElement,_=!T(D),(n=D.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",be,!1):n.attachEvent&&n.attachEvent("onunload",be)),x.attributes=i(function(e){return e.className="i",!e.getAttribute("className")}),x.getElementsByTagName=i(function(e){return e.appendChild(D.createComment("")),!e.getElementsByTagName("*").length}),x.getElementsByClassName=he.test(D.getElementsByClassName),x.getById=i(function(e){return L.appendChild(e).id=H,!D.getElementsByName||!D.getElementsByName(H).length}),x.getById?(b.find.ID=function(e,t){if(void 0!==t.getElementById&&_){var n=t.getElementById(e);return n?[n]:[]}},b.filter.ID=function(e){var t=e.replace(ye,xe);return function(e){return e.getAttribute("id")===t}}):(delete b.find.ID,b.filter.ID=function(e){var t=e.replace(ye,xe);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}}),b.find.TAG=x.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):x.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){for(;n=o[i++];)1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=x.getElementsByClassName&&function(e,t){if(void 0!==t.getElementsByClassName&&_)return t.getElementsByClassName(e)},O=[],q=[],(x.qsa=he.test(D.querySelectorAll))&&(i(function(e){L.appendChild(e).innerHTML="<a id='"+H+"'></a><select id='"+H+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+ee+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||q.push("\\["+ee+"*(?:value|"+Z+")"),e.querySelectorAll("[id~="+H+"-]").length||q.push("~="),e.querySelectorAll(":checked").length||q.push(":checked"),e.querySelectorAll("a#"+H+"+*").length||q.push(".#.+[+~]")}),i(function(e){var t=D.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&q.push("name"+ee+"*[*^$|!~]?="),e.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),q.push(",.*:")})),(x.matchesSelector=he.test($=L.matches||L.webkitMatchesSelector||L.mozMatchesSelector||L.oMatchesSelector||L.msMatchesSelector))&&i(function(e){x.disconnectedMatch=$.call(e,"div"),$.call(e,"[s!='']:x"),O.push("!=",re)}),q=q.length&&new RegExp(q.join("|")),O=O.length&&new RegExp(O.join("|")),t=he.test(L.compareDocumentPosition),I=t||he.test(L.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},z=t?function(e,t){if(e===t)return N=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(n=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1,1&n||!x.sortDetached&&t.compareDocumentPosition(e)===n?e===D||e.ownerDocument===F&&I(F,e)?-1:t===D||t.ownerDocument===F&&I(F,t)?1:E?J(E,e)-J(E,t):0:4&n?-1:1)}:function(e,t){if(e===t)return N=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,s=[e],l=[t];if(!i||!o)return e===D?-1:t===D?1:i?-1:o?1:E?J(E,e)-J(E,t):0;if(i===o)return a(e,t);for(n=e;n=n.parentNode;)s.unshift(n);for(n=t;n=n.parentNode;)l.unshift(n);for(;s[r]===l[r];)r++;return r?a(s[r],l[r]):s[r]===F?-1:l[r]===F?1:0},D):D},t.matches=function(e,n){return t(e,null,null,n)},t.matchesSelector=function(e,n){if((e.ownerDocument||e)!==D&&A(e),n=n.replace(le,"='$1']"),x.matchesSelector&&_&&!B[n+" "]&&(!O||!O.test(n))&&(!q||!q.test(n)))try{var r=$.call(e,n);if(r||x.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return t(n,D,null,[e]).length>0},t.contains=function(e,t){return(e.ownerDocument||e)!==D&&A(e),I(e,t)},t.attr=function(e,t){(e.ownerDocument||e)!==D&&A(e);var n=b.attrHandle[t.toLowerCase()],r=n&&V.call(b.attrHandle,t.toLowerCase())?n(e,t,!_):void 0;return void 0!==r?r:x.attributes||!_?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},t.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},t.uniqueSort=function(e){var t,n=[],r=0,i=0;if(N=!x.detectDuplicates,E=!x.sortStable&&e.slice(0),e.sort(z),N){for(;t=e[i++];)t===e[i]&&(r=n.push(i));for(;r--;)e.splice(n[r],1)}return E=null,e},w=t.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=w(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r++];)n+=w(t);return n},b=t.selectors={cacheLength:50,createPseudo:r,match:fe,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(ye,xe),e[3]=(e[3]||e[4]||e[5]||"").replace(ye,xe),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||t.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&t.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return fe.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&ue.test(n)&&(t=C(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(ye,xe).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=M[e+" "];return t||(t=new RegExp("(^|"+ee+")"+e+"("+ee+"|$)"))&&M(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,n,r){return function(i){var o=t.attr(i,e);return null==o?"!="===n:!n||(o+="","="===n?o===r:"!="===n?o!==r:"^="===n?r&&0===o.indexOf(r):"*="===n?r&&o.indexOf(r)>-1:"$="===n?r&&o.slice(-r.length)===r:"~="===n?(" "+o.replace(ie," ")+" ").indexOf(r)>-1:"|="===n&&(o===r||o.slice(0,r.length+1)===r+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",v=t.parentNode,m=s&&t.nodeName.toLowerCase(),y=!l&&!s,x=!1;if(v){if(o){for(;g;){for(p=t;p=p[g];)if(s?p.nodeName.toLowerCase()===m:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?v.firstChild:v.lastChild],a&&y){for(p=v,f=p[H]||(p[H]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),u=c[e]||[],d=u[0]===R&&u[1],x=d&&u[2],p=d&&v.childNodes[d];p=++d&&p&&p[g]||(x=d=0)||h.pop();)if(1===p.nodeType&&++x&&p===t){c[e]=[R,d,x];break}}else if(y&&(p=t,f=p[H]||(p[H]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),u=c[e]||[],d=u[0]===R&&u[1],x=d),!1===x)for(;(p=++d&&p&&p[g]||(x=d=0)||h.pop())&&((s?p.nodeName.toLowerCase()!==m:1!==p.nodeType)||!++x||(y&&(f=p[H]||(p[H]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),c[e]=[R,x]),p!==t)););return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,n){var i,o=b.pseudos[e]||b.setFilters[e.toLowerCase()]||t.error("unsupported pseudo: "+e);return o[H]?o(n):o.length>1?(i=[e,e,"",n],b.setFilters.hasOwnProperty(e.toLowerCase())?r(function(e,t){for(var r,i=o(e,n),a=i.length;a--;)r=J(e,i[a]),e[r]=!(t[r]=i[a])}):function(e){return o(e,0,i)}):o}},pseudos:{not:r(function(e){var t=[],n=[],i=k(e.replace(oe,"$1"));return i[H]?r(function(e,t,n,r){for(var o,a=i(e,null,r,[]),s=e.length;s--;)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,r,o){return t[0]=e,i(t,null,o,n),t[0]=null,!n.pop()}}),has:r(function(e){return function(n){return t(e,n).length>0}}),contains:r(function(e){return e=e.replace(ye,xe),function(t){return(t.textContent||t.innerText||w(t)).indexOf(e)>-1}}),lang:r(function(e){return ce.test(e||"")||t.error("unsupported lang: "+e),e=e.replace(ye,xe).toLowerCase(),function(t){var n;do{if(n=_?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===L},focus:function(e){return e===D.activeElement&&(!D.hasFocus||D.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return!1===e.disabled},disabled:function(e){return!0===e.disabled},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return de.test(e.nodeName)},input:function(e){return pe.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:s(function(){return[0]}),last:s(function(e,t){return[t-1]}),eq:s(function(e,t,n){return[n<0?n+t:n]}),even:s(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:s(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:s(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:s(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},b.pseudos.nth=b.pseudos.eq;for(y in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[y]=function(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}(y);for(y in{submit:!0,reset:!0})b.pseudos[y]=function(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}(y);return u.prototype=b.filters=b.pseudos,b.setFilters=new u,C=t.tokenize=function(e,n){var r,i,o,a,s,l,u,c=W[e+" "];if(c)return n?0:c.slice(0);for(s=e,l=[],u=b.preFilter;s;){r&&!(i=ae.exec(s))||(i&&(s=s.slice(i[0].length)||s),l.push(o=[])),r=!1,(i=se.exec(s))&&(r=i.shift(),o.push({value:r,type:i[0].replace(oe," ")}),s=s.slice(r.length));for(a in b.filter)!(i=fe[a].exec(s))||u[a]&&!(i=u[a](i))||(r=i.shift(),o.push({value:r,type:a,matches:i}),s=s.slice(r.length));if(!r)break}return n?s.length:s?t.error(e):W(e,l).slice(0)},k=t.compile=function(e,t){var n,r=[],i=[],o=B[e+" "];if(!o){for(t||(t=C(e)),n=t.length;n--;)o=v(t[n]),o[H]?r.push(o):i.push(o);o=B(e,m(i,r)),o.selector=e}return o},S=t.select=function(e,t,n,r){var i,o,a,s,u,f="function"==typeof e&&e,p=!r&&C(e=f.selector||e);if(n=n||[],1===p.length){if(o=p[0]=p[0].slice(0),o.length>2&&"ID"===(a=o[0]).type&&x.getById&&9===t.nodeType&&_&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(ye,xe),t)||[])[0]))return n;f&&(t=t.parentNode),e=e.slice(o.shift().value.length)}for(i=fe.needsContext.test(e)?0:o.length;i--&&(a=o[i],!b.relative[s=a.type]);)if((u=b.find[s])&&(r=u(a.matches[0].replace(ye,xe),ve.test(o[0].type)&&l(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&c(o)))return Y.apply(n,r),n;break}}return(f||k(e,p))(r,t,!_,n,!t||ve.test(e)&&l(t.parentNode)||t),n},x.sortStable=H.split("").sort(z).join("")===H,x.detectDuplicates=!!N,A(),x.sortDetached=i(function(e){return 1&e.compareDocumentPosition(D.createElement("div"))}),i(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||o("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),x.attributes&&i(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||o("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),i(function(e){return null==e.getAttribute("disabled")})||o(Z,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),t}(n);le.find=de,le.expr=de.selectors,le.expr[":"]=le.expr.pseudos,le.uniqueSort=le.unique=de.uniqueSort,le.text=de.getText,le.isXMLDoc=de.isXML,le.contains=de.contains;var he=function(e,t,n){for(var r=[],i=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(i&&le(e).is(n))break;r.push(e)}return r},ge=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},ve=le.expr.match.needsContext,me=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,ye=/^.[^:#\[\.,]*$/;le.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?le.find.matchesSelector(r,e)?[r]:[]:le.find.matches(e,le.grep(t,function(e){return 1===e.nodeType}))},le.fn.extend({find:function(e){var t,n=this.length,r=[],i=this;if("string"!=typeof e)return this.pushStack(le(e).filter(function(){for(t=0;t<n;t++)if(le.contains(i[t],this))return!0}));for(t=0;t<n;t++)le.find(e,i[t],r);return r=this.pushStack(n>1?le.unique(r):r),r.selector=this.selector?this.selector+" "+e:e,r},filter:function(e){return this.pushStack(s(this,e||[],!1))},not:function(e){return this.pushStack(s(this,e||[],!0))},is:function(e){return!!s(this,"string"==typeof e&&ve.test(e)?le(e):e||[],!1).length}});var xe,be=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;(le.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||xe,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:be.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof le?t[0]:t,le.merge(this,le.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:Z,!0)),me.test(r[1])&&le.isPlainObject(t))for(r in t)le.isFunction(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return i=Z.getElementById(r[2]),i&&i.parentNode&&(this.length=1,this[0]=i),this.context=Z,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):le.isFunction(e)?void 0!==n.ready?n.ready(e):e(le):(void 0!==e.selector&&(this.selector=e.selector,this.context=e.context),le.makeArray(e,this))}).prototype=le.fn,xe=le(Z);var we=/^(?:parents|prev(?:Until|All))/,Te={children:!0,contents:!0,next:!0,prev:!0};le.fn.extend({has:function(e){var t=le(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(le.contains(this,t[e]))return!0})},closest:function(e,t){for(var n,r=0,i=this.length,o=[],a=ve.test(e)||"string"!=typeof e?le(e,t||this.context):0;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&le.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?le.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?re.call(le(e),this[0]):re.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(le.uniqueSort(le.merge(this.get(),le(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),le.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return he(e,"parentNode")},parentsUntil:function(e,t,n){return he(e,"parentNode",n)},next:function(e){return l(e,"nextSibling")},prev:function(e){return l(e,"previousSibling")},nextAll:function(e){return he(e,"nextSibling")},prevAll:function(e){return he(e,"previousSibling")},nextUntil:function(e,t,n){return he(e,"nextSibling",n)},prevUntil:function(e,t,n){return he(e,"previousSibling",n)},siblings:function(e){return ge((e.parentNode||{}).firstChild,e)},children:function(e){return ge(e.firstChild)},contents:function(e){return e.contentDocument||le.merge([],e.childNodes)}},function(e,t){le.fn[e]=function(n,r){var i=le.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=le.filter(r,i)),this.length>1&&(Te[e]||le.uniqueSort(i),we.test(e)&&i.reverse()),this.pushStack(i)}});var Ce=/\S+/g;le.Callbacks=function(e){e="string"==typeof e?u(e):le.extend({},e);var t,n,r,i,o=[],a=[],s=-1,l=function(){for(i=e.once,r=t=!0;a.length;s=-1)for(n=a.shift();++s<o.length;)!1===o[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=o.length,n=!1);e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},c={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function t(n){le.each(n,function(n,r){le.isFunction(r)?e.unique&&c.has(r)||o.push(r):r&&r.length&&"string"!==le.type(r)&&t(r)})}(arguments),n&&!t&&l()),this},remove:function(){return le.each(arguments,function(e,t){for(var n;(n=le.inArray(t,o,n))>-1;)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?le.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=n||[],n=[e,n.slice?n.slice():n],a.push(n),t||l()),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},le.extend({Deferred:function(e){var t=[["resolve","done",le.Callbacks("once memory"),"resolved"],["reject","fail",le.Callbacks("once memory"),"rejected"],["notify","progress",le.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return le.Deferred(function(n){le.each(t,function(t,o){var a=le.isFunction(e[t])&&e[t];i[o[1]](function(){var e=a&&a.apply(this,arguments);e&&le.isFunction(e.promise)?e.promise().progress(n.notify).done(n.resolve).fail(n.reject):n[o[0]+"With"](this===r?n.promise():this,a?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?le.extend(e,r):r}},i={};return r.pipe=r.then,le.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t,n,r,i=0,o=ee.call(arguments),a=o.length,s=1!==a||e&&le.isFunction(e.promise)?a:0,l=1===s?e:le.Deferred(),u=function(e,n,r){return function(i){n[e]=this,r[e]=arguments.length>1?ee.call(arguments):i,r===t?l.notifyWith(n,r):--s||l.resolveWith(n,r)}};if(a>1)for(t=new Array(a),n=new Array(a),r=new Array(a);i<a;i++)o[i]&&le.isFunction(o[i].promise)?o[i].promise().progress(u(i,n,t)).done(u(i,r,o)).fail(l.reject):--s;return s||l.resolveWith(r,o),l.promise()}});var ke;le.fn.ready=function(e){return le.ready.promise().done(e),this},le.extend({isReady:!1,readyWait:1,holdReady:function(e){e?le.readyWait++:le.ready(!0)},ready:function(e){(!0===e?--le.readyWait:le.isReady)||(le.isReady=!0,!0!==e&&--le.readyWait>0||(ke.resolveWith(Z,[le]),le.fn.triggerHandler&&(le(Z).triggerHandler("ready"),le(Z).off("ready"))))}}),le.ready.promise=function(e){return ke||(ke=le.Deferred(),"complete"===Z.readyState||"loading"!==Z.readyState&&!Z.documentElement.doScroll?n.setTimeout(le.ready):(Z.addEventListener("DOMContentLoaded",c),n.addEventListener("load",c))),ke.promise(e)},le.ready.promise();var Se=function(e,t,n,r,i,o,a){var s=0,l=e.length,u=null==n;if("object"===le.type(n)){i=!0;for(s in n)Se(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,le.isFunction(r)||(a=!0),u&&(a?(t.call(e,r),t=null):(u=t,t=function(e,t,n){return u.call(le(e),n)})),t))for(;s<l;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:u?t.call(e):l?t(e[0],n):o},je=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};f.uid=1,f.prototype={register:function(e,t){var n=t||{};return e.nodeType?e[this.expando]=n:Object.defineProperty(e,this.expando,{value:n,writable:!0,configurable:!0}),e[this.expando]},cache:function(e){if(!je(e))return{};var t=e[this.expando];return t||(t={},je(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[t]=n;else for(r in t)i[r]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][t]},access:function(e,t,n){var r;return void 0===t||t&&"string"==typeof t&&void 0===n?(r=this.get(e,t),void 0!==r?r:this.get(e,le.camelCase(t))):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r,i,o=e[this.expando];if(void 0!==o){if(void 0===t)this.register(e);else{le.isArray(t)?r=t.concat(t.map(le.camelCase)):(i=le.camelCase(t),t in o?r=[t,i]:(r=i,r=r in o?[r]:r.match(Ce)||[])),n=r.length;for(;n--;)delete o[r[n]]}(void 0===t||le.isEmptyObject(o))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!le.isEmptyObject(t)}};var Ee=new f,Ne=new f,Ae=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,De=/[A-Z]/g;le.extend({hasData:function(e){return Ne.hasData(e)||Ee.hasData(e)},data:function(e,t,n){return Ne.access(e,t,n)},removeData:function(e,t){Ne.remove(e,t)},_data:function(e,t,n){return Ee.access(e,t,n)},_removeData:function(e,t){Ee.remove(e,t)}}),le.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=Ne.get(o),1===o.nodeType&&!Ee.get(o,"hasDataAttrs"))){for(n=a.length;n--;)a[n]&&(r=a[n].name,0===r.indexOf("data-")&&(r=le.camelCase(r.slice(5)),p(o,r,i[r])));Ee.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){Ne.set(this,e)}):Se(this,function(t){var n,r;if(o&&void 0===t){if(void 0!==(n=Ne.get(o,e)||Ne.get(o,e.replace(De,"-$&").toLowerCase())))return n;if(r=le.camelCase(e),void 0!==(n=Ne.get(o,r)))return n;if(void 0!==(n=p(o,r,void 0)))return n}else r=le.camelCase(e),this.each(function(){var n=Ne.get(this,r);Ne.set(this,r,t),e.indexOf("-")>-1&&void 0!==n&&Ne.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){Ne.remove(this,e)})}}),le.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Ee.get(e,t),n&&(!r||le.isArray(n)?r=Ee.access(e,t,le.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=le.queue(e,t),r=n.length,i=n.shift(),o=le._queueHooks(e,t),a=function(){le.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Ee.get(e,n)||Ee.access(e,n,{empty:le.Callbacks("once memory").add(function(){Ee.remove(e,[t+"queue",n])})})}}),le.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?le.queue(this[0],e):void 0===t?this:this.each(function(){var n=le.queue(this,e,t);le._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&le.dequeue(this,e)})},dequeue:function(e){return this.each(function(){le.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=le.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";a--;)(n=Ee.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var Le=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,_e=new RegExp("^(?:([+-])=|)("+Le+")([a-z%]*)$","i"),qe=["Top","Right","Bottom","Left"],Oe=function(e,t){return e=t||e,"none"===le.css(e,"display")||!le.contains(e.ownerDocument,e)},$e=/^(?:checkbox|radio)$/i,Ie=/<([\w:-]+)/,He=/^$|\/(?:java|ecma)script/i,Fe={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};Fe.optgroup=Fe.option,Fe.tbody=Fe.tfoot=Fe.colgroup=Fe.caption=Fe.thead,Fe.th=Fe.td;var Re=/<|&#?\w+;/;!function(){var e=Z.createDocumentFragment(),t=e.appendChild(Z.createElement("div")),n=Z.createElement("input");n.setAttribute("type","radio"),n.setAttribute("checked","checked"),n.setAttribute("name","t"),t.appendChild(n),se.checkClone=t.cloneNode(!0).cloneNode(!0).lastChild.checked,t.innerHTML="<textarea>x</textarea>",se.noCloneChecked=!!t.cloneNode(!0).lastChild.defaultValue}();var Pe=/^key/,Me=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,We=/^([^.]*)(?:\.(.+)|)/;le.event={global:{},add:function(e,t,n,r,i){var o,a,s,l,u,c,f,p,d,h,g,v=Ee.get(e);if(v)for(n.handler&&(o=n,n=o.handler,i=o.selector),n.guid||(n.guid=le.guid++),(l=v.events)||(l=v.events={}),(a=v.handle)||(a=v.handle=function(t){return void 0!==le&&le.event.triggered!==t.type?le.event.dispatch.apply(e,arguments):void 0}),t=(t||"").match(Ce)||[""],u=t.length;u--;)s=We.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d&&(f=le.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=le.event.special[d]||{},c=le.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&le.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=l[d])||(p=l[d]=[],p.delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),le.event.global[d]=!0)},remove:function(e,t,n,r,i){var o,a,s,l,u,c,f,p,d,h,g,v=Ee.hasData(e)&&Ee.get(e);if(v&&(l=v.events)){for(t=(t||"").match(Ce)||[""],u=t.length;u--;)if(s=We.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){for(f=le.event.special[d]||{},d=(r?f.delegateType:f.bindType)||d,p=l[d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;o--;)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||le.removeEvent(e,d,v.handle),delete l[d])}else for(d in l)le.event.remove(e,d+t[u],n,r,!0);le.isEmptyObject(l)&&Ee.remove(e,"handle events")}},dispatch:function(e){e=le.event.fix(e);var t,n,r,i,o,a=[],s=ee.call(arguments),l=(Ee.get(this,"events")||{})[e.type]||[],u=le.event.special[e.type]||{};if(s[0]=e,e.delegateTarget=this,!u.preDispatch||!1!==u.preDispatch.call(this,e)){for(a=le.event.handlers.call(this,e,l),t=0;(i=a[t++])&&!e.isPropagationStopped();)for(e.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!e.isImmediatePropagationStopped();)e.rnamespace&&!e.rnamespace.test(o.namespace)||(e.handleObj=o,e.data=o.data,void 0!==(r=((le.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(e.result=r)&&(e.preventDefault(),e.stopPropagation()));return u.postDispatch&&u.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,a=[],s=t.delegateCount,l=e.target;if(s&&l.nodeType&&("click"!==e.type||isNaN(e.button)||e.button<1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&(!0!==l.disabled||"click"!==e.type)){for(r=[],n=0;n<s;n++)o=t[n],i=o.selector+" ",void 0===r[i]&&(r[i]=o.needsContext?le(i,this).index(l)>-1:le.find(i,this,null,[l]).length),r[i]&&r.push(o);r.length&&a.push({elem:l,handlers:r})}return s<t.length&&a.push({elem:this,handlers:t.slice(s)}),a},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,o=t.button;return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||Z,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||void 0===o||(e.which=1&o?1:2&o?3:4&o?2:0),e}},fix:function(e){if(e[le.expando])return e;var t,n,r,i=e.type,o=e,a=this.fixHooks[i];for(a||(this.fixHooks[i]=a=Me.test(i)?this.mouseHooks:Pe.test(i)?this.keyHooks:{}),r=a.props?this.props.concat(a.props):this.props,e=new le.Event(o),t=r.length;t--;)n=r[t],e[n]=o[n];return e.target||(e.target=Z),3===e.target.nodeType&&(e.target=e.target.parentNode),a.filter?a.filter(e,o):e},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==x()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===x()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&le.nodeName(this,"input"))return this.click(),!1},_default:function(e){return le.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},le.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},le.Event=function(e,t){if(!(this instanceof le.Event))return new le.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?m:y):this.type=e,t&&le.extend(this,t),this.timeStamp=e&&e.timeStamp||le.now(),this[le.expando]=!0},le.Event.prototype={constructor:le.Event,isDefaultPrevented:y,isPropagationStopped:y,isImmediatePropagationStopped:y,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=m,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=m,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=m,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},le.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){le.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||le.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),le.fn.extend({on:function(e,t,n,r){return b(this,e,t,n,r)},one:function(e,t,n,r){return b(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,le(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=y),this.each(function(){le.event.remove(this,e,n,t)})}});var Be=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,ze=/<script|<style|<link/i,Xe=/checked\s*(?:[^=]|=\s*.checked.)/i,Ve=/^true\/(.*)/,Ue=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;le.extend({htmlPrefilter:function(e){return e.replace(Be,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),l=le.contains(e.ownerDocument,e);if(!(se.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||le.isXMLDoc(e)))for(a=h(s),o=h(e),r=0,i=o.length;r<i;r++)S(o[r],a[r]);if(t)if(n)for(o=o||h(e),a=a||h(s),r=0,i=o.length;r<i;r++)k(o[r],a[r]);else k(e,s);return a=h(s,"script"),a.length>0&&g(a,!l&&h(e,"script")),s},cleanData:function(e){for(var t,n,r,i=le.event.special,o=0;void 0!==(n=e[o]);o++)if(je(n)){if(t=n[Ee.expando]){if(t.events)for(r in t.events)i[r]?le.event.remove(n,r):le.removeEvent(n,r,t.handle);n[Ee.expando]=void 0}n[Ne.expando]&&(n[Ne.expando]=void 0)}}}),le.fn.extend({domManip:j,detach:function(e){return E(this,e,!0)},remove:function(e){return E(this,e)},text:function(e){return Se(this,function(e){return void 0===e?le.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return j(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){w(this,e).appendChild(e)}})},prepend:function(){return j(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=w(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return j(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return j(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(le.cleanData(h(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return le.clone(this,e,t)})},html:function(e){return Se(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!ze.test(e)&&!Fe[(Ie.exec(e)||["",""])[1].toLowerCase()]){e=le.htmlPrefilter(e);try{for(;n<r;n++)t=this[n]||{},1===t.nodeType&&(le.cleanData(h(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return j(this,arguments,function(t){var n=this.parentNode;le.inArray(this,e)<0&&(le.cleanData(h(this)),n&&n.replaceChild(t,this))},e)}}),le.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){le.fn[e]=function(e){for(var n,r=[],i=le(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),le(i[a])[t](n),ne.apply(r,n.get());return this.pushStack(r)}});var Ke,Ge={HTML:"block",BODY:"block"},Ye=/^margin/,Qe=new RegExp("^("+Le+")(?!px)[a-z%]+$","i"),Je=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=n),t.getComputedStyle(e)},Ze=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i},et=Z.documentElement;!function(){function e(){s.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",s.innerHTML="",et.appendChild(a);var e=n.getComputedStyle(s);t="1%"!==e.top,o="2px"===e.marginLeft,r="4px"===e.width,s.style.marginRight="50%",i="4px"===e.marginRight,et.removeChild(a)}var t,r,i,o,a=Z.createElement("div"),s=Z.createElement("div");s.style&&(s.style.backgroundClip="content-box",s.cloneNode(!0).style.backgroundClip="",se.clearCloneStyle="content-box"===s.style.backgroundClip,a.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",a.appendChild(s),le.extend(se,{pixelPosition:function(){return e(),t},boxSizingReliable:function(){return null==r&&e(),r},pixelMarginRight:function(){return null==r&&e(),i},reliableMarginLeft:function(){return null==r&&e(),o},reliableMarginRight:function(){var e,t=s.appendChild(Z.createElement("div"));return t.style.cssText=s.style.cssText="-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",t.style.marginRight=t.style.width="0",s.style.width="1px",et.appendChild(a),e=!parseFloat(n.getComputedStyle(t).marginRight),et.removeChild(a),s.removeChild(t),e}}))}();var tt=/^(none|table(?!-c[ea]).+)/,nt={position:"absolute",visibility:"hidden",display:"block"},rt={letterSpacing:"0",fontWeight:"400"},it=["Webkit","O","Moz","ms"],ot=Z.createElement("div").style;le.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=D(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{float:"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=le.camelCase(t),l=e.style;if(t=le.cssProps[s]||(le.cssProps[s]=_(s)||s),a=le.cssHooks[t]||le.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];o=typeof n,"string"===o&&(i=_e.exec(n))&&i[1]&&(n=d(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(le.cssNumber[s]?"":"px")),se.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=le.camelCase(t);return t=le.cssProps[s]||(le.cssProps[s]=_(s)||s),a=le.cssHooks[t]||le.cssHooks[s],a&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=D(e,t,r)),"normal"===i&&t in rt&&(i=rt[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),le.each(["height","width"],function(e,t){le.cssHooks[t]={get:function(e,n,r){if(n)return tt.test(le.css(e,"display"))&&0===e.offsetWidth?Ze(e,nt,function(){return $(e,t,r)}):$(e,t,r)},set:function(e,n,r){var i,o=r&&Je(e),a=r&&O(e,t,r,"border-box"===le.css(e,"boxSizing",!1,o),o);return a&&(i=_e.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=le.css(e,t)),q(e,n,a)}}}),le.cssHooks.marginLeft=L(se.reliableMarginLeft,function(e,t){if(t)return(parseFloat(D(e,"marginLeft"))||e.getBoundingClientRect().left-Ze(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),le.cssHooks.marginRight=L(se.reliableMarginRight,function(e,t){if(t)return Ze(e,{display:"inline-block"},D,[e,"marginRight"])}),le.each({margin:"",padding:"",border:"Width"},function(e,t){le.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+qe[r]+t]=o[r]||o[r-2]||o[0];return i}},Ye.test(e)||(le.cssHooks[e+t].set=q)}),le.fn.extend({css:function(e,t){return Se(this,function(e,t,n){var r,i,o={},a=0;if(le.isArray(t)){for(r=Je(e),i=t.length;a<i;a++)o[t[a]]=le.css(e,t[a],!1,r);return o}return void 0!==n?le.style(e,t,n):le.css(e,t)},e,t,arguments.length>1)},show:function(){return I(this,!0)},hide:function(){return I(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){Oe(this)?le(this).show():le(this).hide()})}}),le.Tween=H,H.prototype={constructor:H,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||le.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(le.cssNumber[n]?"":"px")},cur:function(){var e=H.propHooks[this.prop];return e&&e.get?e.get(this):H.propHooks._default.get(this)},run:function(e){var t,n=H.propHooks[this.prop];return this.options.duration?this.pos=t=le.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):H.propHooks._default.set(this),this}},H.prototype.init.prototype=H.prototype,H.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=le.css(e.elem,e.prop,""),t&&"auto"!==t?t:0)},set:function(e){le.fx.step[e.prop]?le.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[le.cssProps[e.prop]]&&!le.cssHooks[e.prop]?e.elem[e.prop]=e.now:le.style(e.elem,e.prop,e.now+e.unit)}}},H.propHooks.scrollTop=H.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},le.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},le.fx=H.prototype.init,le.fx.step={};var at,st,lt=/^(?:toggle|show|hide)$/,ut=/queueHooks$/;le.Animation=le.extend(B,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return d(n.elem,e,_e.exec(t),n),n}]},tweener:function(e,t){le.isFunction(e)?(t=e,e=["*"]):e=e.match(Ce);for(var n,r=0,i=e.length;r<i;r++)n=e[r],B.tweeners[n]=B.tweeners[n]||[],B.tweeners[n].unshift(t)},prefilters:[M],prefilter:function(e,t){t?B.prefilters.unshift(e):B.prefilters.push(e)}}),le.speed=function(e,t,n){var r=e&&"object"==typeof e?le.extend({},e):{complete:n||!n&&t||le.isFunction(e)&&e,duration:e,easing:n&&t||t&&!le.isFunction(t)&&t};return r.duration=le.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in le.fx.speeds?le.fx.speeds[r.duration]:le.fx.speeds._default,null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){le.isFunction(r.old)&&r.old.call(this),r.queue&&le.dequeue(this,r.queue)},r},le.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Oe).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=le.isEmptyObject(e),o=le.speed(t,n,r),a=function(){var t=B(this,le.extend({},e),o);(i||Ee.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=le.timers,a=Ee.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ut.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||le.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=Ee.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=le.timers,a=r?r.length:0;for(n.finish=!0,le.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),le.each(["toggle","show","hide"],function(e,t){var n=le.fn[t];le.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(R(t,!0),e,r,i)}}),le.each({slideDown:R("show"),slideUp:R("hide"),slideToggle:R("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){le.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),le.timers=[],le.fx.tick=function(){var e,t=0,n=le.timers;for(at=le.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||le.fx.stop(),at=void 0},le.fx.timer=function(e){le.timers.push(e),e()?le.fx.start():le.timers.pop()},le.fx.interval=13,le.fx.start=function(){st||(st=n.setInterval(le.fx.tick,le.fx.interval))},le.fx.stop=function(){n.clearInterval(st),st=null},le.fx.speeds={slow:600,fast:200,_default:400},le.fn.delay=function(e,t){return e=le.fx?le.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,r){var i=n.setTimeout(t,e);r.stop=function(){n.clearTimeout(i)}})},function(){var e=Z.createElement("input"),t=Z.createElement("select"),n=t.appendChild(Z.createElement("option"));e.type="checkbox",se.checkOn=""!==e.value,se.optSelected=n.selected,t.disabled=!0,se.optDisabled=!n.disabled,e=Z.createElement("input"),e.value="t",e.type="radio",se.radioValue="t"===e.value}();var ct,ft=le.expr.attrHandle;le.fn.extend({attr:function(e,t){return Se(this,le.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){le.removeAttr(this,e)})}}),le.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return void 0===e.getAttribute?le.prop(e,t,n):(1===o&&le.isXMLDoc(e)||(t=t.toLowerCase(),i=le.attrHooks[t]||(le.expr.match.bool.test(t)?ct:void 0)),void 0!==n?null===n?void le.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:(r=le.find.attr(e,t),null==r?void 0:r))},attrHooks:{type:{set:function(e,t){if(!se.radioValue&&"radio"===t&&le.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(Ce);if(o&&1===e.nodeType)for(;n=o[i++];)r=le.propFix[n]||n,le.expr.match.bool.test(n)&&(e[r]=!1),e.removeAttribute(n)}}),ct={set:function(e,t,n){return!1===t?le.removeAttr(e,n):e.setAttribute(n,n),n}},le.each(le.expr.match.bool.source.match(/\w+/g),function(e,t){var n=ft[t]||le.find.attr;ft[t]=function(e,t,r){var i,o;return r||(o=ft[t],ft[t]=i,i=null!=n(e,t,r)?t.toLowerCase():null,ft[t]=o),i}});var pt=/^(?:input|select|textarea|button)$/i,dt=/^(?:a|area)$/i;le.fn.extend({prop:function(e,t){return Se(this,le.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[le.propFix[e]||e]})}}),le.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&le.isXMLDoc(e)||(t=le.propFix[t]||t,i=le.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=le.find.attr(e,"tabindex");return t?parseInt(t,10):pt.test(e.nodeName)||dt.test(e.nodeName)&&e.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),se.optSelected||(le.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),le.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){le.propFix[this.toLowerCase()]=this});var ht=/[\t\r\n\f]/g;le.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,l=0;if(le.isFunction(e))return this.each(function(t){le(this).addClass(e.call(this,t,z(this)))});if("string"==typeof e&&e)for(t=e.match(Ce)||[];n=this[l++];)if(i=z(n),r=1===n.nodeType&&(" "+i+" ").replace(ht," ")){for(a=0;o=t[a++];)r.indexOf(" "+o+" ")<0&&(r+=o+" ");s=le.trim(r),i!==s&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,l=0;if(le.isFunction(e))return this.each(function(t){le(this).removeClass(e.call(this,t,z(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof e&&e)for(t=e.match(Ce)||[];n=this[l++];)if(i=z(n),r=1===n.nodeType&&(" "+i+" ").replace(ht," ")){for(a=0;o=t[a++];)for(;r.indexOf(" "+o+" ")>-1;)r=r.replace(" "+o+" "," ");s=le.trim(r),i!==s&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):le.isFunction(e)?this.each(function(n){le(this).toggleClass(e.call(this,n,z(this),t),t)}):this.each(function(){var t,r,i,o;if("string"===n)for(r=0,i=le(this),o=e.match(Ce)||[];t=o[r++];)i.hasClass(t)?i.removeClass(t):i.addClass(t);else void 0!==e&&"boolean"!==n||(t=z(this),t&&Ee.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":Ee.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;for(t=" "+e+" ";n=this[r++];)if(1===n.nodeType&&(" "+z(n)+" ").replace(ht," ").indexOf(t)>-1)return!0;return!1}});var gt=/\r/g,vt=/[\x20\t\r\n\f]+/g;le.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=le.isFunction(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,le(this).val()):e,null==i?i="":"number"==typeof i?i+="":le.isArray(i)&&(i=le.map(i,function(e){return null==e?"":e+""})),(t=le.valHooks[this.type]||le.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=le.valHooks[i.type]||le.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:(n=i.value,"string"==typeof n?n.replace(gt,""):null==n?"":n)}}}),le.extend({valHooks:{option:{get:function(e){var t=le.find.attr(e,"value");return null!=t?t:le.trim(le.text(e)).replace(vt," ")}},select:{get:function(e){for(var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||i<0,a=o?null:[],s=o?i+1:r.length,l=i<0?s:o?i:0;l<s;l++)if(n=r[l],(n.selected||l===i)&&(se.optDisabled?!n.disabled:null===n.getAttribute("disabled"))&&(!n.parentNode.disabled||!le.nodeName(n.parentNode,"optgroup"))){if(t=le(n).val(),o)return t;a.push(t)}return a},set:function(e,t){for(var n,r,i=e.options,o=le.makeArray(t),a=i.length;a--;)r=i[a],(r.selected=le.inArray(le.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),le.each(["radio","checkbox"],function(){le.valHooks[this]={set:function(e,t){if(le.isArray(t))return e.checked=le.inArray(le(e).val(),t)>-1}},se.checkOn||(le.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var mt=/^(?:focusinfocus|focusoutblur)$/;le.extend(le.event,{trigger:function(e,t,r,i){var o,a,s,l,u,c,f,p=[r||Z],d=ae.call(e,"type")?e.type:e,h=ae.call(e,"namespace")?e.namespace.split("."):[];if(a=s=r=r||Z,3!==r.nodeType&&8!==r.nodeType&&!mt.test(d+le.event.triggered)&&(d.indexOf(".")>-1&&(h=d.split("."),d=h.shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,e=e[le.expando]?e:new le.Event(d,"object"==typeof e&&e),e.isTrigger=i?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=r),t=null==t?[e]:le.makeArray(t,[e]),f=le.event.special[d]||{},i||!f.trigger||!1!==f.trigger.apply(r,t))){if(!i&&!f.noBubble&&!le.isWindow(r)){for(l=f.delegateType||d,mt.test(l+d)||(a=a.parentNode);a;a=a.parentNode)p.push(a),s=a;s===(r.ownerDocument||Z)&&p.push(s.defaultView||s.parentWindow||n)}for(o=0;(a=p[o++])&&!e.isPropagationStopped();)e.type=o>1?l:f.bindType||d,c=(Ee.get(a,"events")||{})[e.type]&&Ee.get(a,"handle"),c&&c.apply(a,t),(c=u&&a[u])&&c.apply&&je(a)&&(e.result=c.apply(a,t),!1===e.result&&e.preventDefault());return e.type=d,i||e.isDefaultPrevented()||f._default&&!1!==f._default.apply(p.pop(),t)||!je(r)||u&&le.isFunction(r[d])&&!le.isWindow(r)&&(s=r[u],s&&(r[u]=null),le.event.triggered=d,r[d](),le.event.triggered=void 0,s&&(r[u]=s)),e.result}},simulate:function(e,t,n){var r=le.extend(new le.Event,n,{type:e,isSimulated:!0});le.event.trigger(r,null,t)}}),le.fn.extend({trigger:function(e,t){return this.each(function(){le.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return le.event.trigger(e,t,n,!0)}}),le.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){le.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),le.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),se.focusin="onfocusin"in n,se.focusin||le.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){le.event.simulate(t,e.target,le.event.fix(e))};le.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=Ee.access(r,t);i||r.addEventListener(e,n,!0),Ee.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=Ee.access(r,t)-1;i?Ee.access(r,t,i):(r.removeEventListener(e,n,!0),Ee.remove(r,t))}}});var yt=n.location,xt=le.now(),bt=/\?/;le.parseJSON=function(e){return JSON.parse(e+"")},le.parseXML=function(e){var t;if(!e||"string"!=typeof e)return null;try{t=(new n.DOMParser).parseFromString(e,"text/xml")}catch(e){t=void 0}return t&&!t.getElementsByTagName("parsererror").length||le.error("Invalid XML: "+e),t};var wt=/#.*$/,Tt=/([?&])_=[^&]*/,Ct=/^(.*?):[ \t]*([^\r\n]*)$/gm,kt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,St=/^(?:GET|HEAD)$/,jt=/^\/\//,Et={},Nt={},At="*/".concat("*"),Dt=Z.createElement("a");Dt.href=yt.href,le.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yt.href,type:"GET",isLocal:kt.test(yt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":At,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":le.parseJSON,"text xml":le.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?U(U(e,le.ajaxSettings),t):U(le.ajaxSettings,e)},ajaxPrefilter:X(Et),ajaxTransport:X(Nt),ajax:function(e,t){function r(e,t,r,s){var u,f,y,x,w,C=t;2!==b&&(b=2,l&&n.clearTimeout(l),i=void 0,a=s||"",T.readyState=e>0?4:0,u=e>=200&&e<300||304===e,r&&(x=K(p,T,r)),x=G(p,x,T,u),u?(p.ifModified&&(w=T.getResponseHeader("Last-Modified"),w&&(le.lastModified[o]=w),(w=T.getResponseHeader("etag"))&&(le.etag[o]=w)),204===e||"HEAD"===p.type?C="nocontent":304===e?C="notmodified":(C=x.state,f=x.data,y=x.error,u=!y)):(y=C,!e&&C||(C="error",e<0&&(e=0))),T.status=e,T.statusText=(t||C)+"",u?g.resolveWith(d,[f,C,T]):g.rejectWith(d,[T,C,y]),T.statusCode(m),m=void 0,c&&h.trigger(u?"ajaxSuccess":"ajaxError",[T,p,u?f:y]),v.fireWith(d,[T,C]),c&&(h.trigger("ajaxComplete",[T,p]),--le.active||le.event.trigger("ajaxStop")))}"object"==typeof e&&(t=e,e=void 0),t=t||{};var i,o,a,s,l,u,c,f,p=le.ajaxSetup({},t),d=p.context||p,h=p.context&&(d.nodeType||d.jquery)?le(d):le.event,g=le.Deferred(),v=le.Callbacks("once memory"),m=p.statusCode||{},y={},x={},b=0,w="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!s)for(s={};t=Ct.exec(a);)s[t[1].toLowerCase()]=t[2];t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=x[n]=x[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(b<2)for(t in e)m[t]=[m[t],e[t]];else T.always(e[T.status]);return this},abort:function(e){var t=e||w;return i&&i.abort(t),r(0,t),this}};if(g.promise(T).complete=v.add,T.success=T.done,T.error=T.fail,p.url=((e||p.url||yt.href)+"").replace(wt,"").replace(jt,yt.protocol+"//"),p.type=t.method||t.type||p.method||p.type,p.dataTypes=le.trim(p.dataType||"*").toLowerCase().match(Ce)||[""],null==p.crossDomain){u=Z.createElement("a");try{u.href=p.url,u.href=u.href,p.crossDomain=Dt.protocol+"//"+Dt.host!=u.protocol+"//"+u.host}catch(e){p.crossDomain=!0}}if(p.data&&p.processData&&"string"!=typeof p.data&&(p.data=le.param(p.data,p.traditional)),V(Et,p,t,T),2===b)return T;c=le.event&&p.global,c&&0==le.active++&&le.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!St.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bt.test(o)?"&":"?")+p.data,delete p.data),!1===p.cache&&(p.url=Tt.test(o)?o.replace(Tt,"$1_="+xt++):o+(bt.test(o)?"&":"?")+"_="+xt++)),p.ifModified&&(le.lastModified[o]&&T.setRequestHeader("If-Modified-Since",le.lastModified[o]),le.etag[o]&&T.setRequestHeader("If-None-Match",le.etag[o])),(p.data&&p.hasContent&&!1!==p.contentType||t.contentType)&&T.setRequestHeader("Content-Type",p.contentType),T.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+At+"; q=0.01":""):p.accepts["*"]);for(f in p.headers)T.setRequestHeader(f,p.headers[f]);if(p.beforeSend&&(!1===p.beforeSend.call(d,T,p)||2===b))return T.abort();w="abort";for(f in{success:1,error:1,complete:1})T[f](p[f]);if(i=V(Nt,p,t,T)){if(T.readyState=1,c&&h.trigger("ajaxSend",[T,p]),2===b)return T;p.async&&p.timeout>0&&(l=n.setTimeout(function(){T.abort("timeout")},p.timeout));try{b=1,i.send(y,r)}catch(e){if(!(b<2))throw e;r(-1,e)}}else r(-1,"No Transport");return T},getJSON:function(e,t,n){return le.get(e,t,n,"json")},getScript:function(e,t){return le.get(e,void 0,t,"script")}}),le.each(["get","post"],function(e,t){le[t]=function(e,n,r,i){return le.isFunction(n)&&(i=i||r,r=n,n=void 0),le.ajax(le.extend({url:e,type:t,dataType:i,data:n,success:r},le.isPlainObject(e)&&e))}}),le._evalUrl=function(e){return le.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,throws:!0})},le.fn.extend({wrapAll:function(e){var t;return le.isFunction(e)?this.each(function(t){le(this).wrapAll(e.call(this,t))}):(this[0]&&(t=le(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e}).append(this)),this)},wrapInner:function(e){return le.isFunction(e)?this.each(function(t){le(this).wrapInner(e.call(this,t))}):this.each(function(){var t=le(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=le.isFunction(e);return this.each(function(n){le(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){le.nodeName(this,"body")||le(this).replaceWith(this.childNodes)}).end()}}),le.expr.filters.hidden=function(e){return!le.expr.filters.visible(e)},le.expr.filters.visible=function(e){return e.offsetWidth>0||e.offsetHeight>0||e.getClientRects().length>0};var Lt=/%20/g,_t=/\[\]$/,qt=/\r?\n/g,Ot=/^(?:submit|button|image|reset|file)$/i,$t=/^(?:input|select|textarea|keygen)/i;le.param=function(e,t){var n,r=[],i=function(e,t){t=le.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(void 0===t&&(t=le.ajaxSettings&&le.ajaxSettings.traditional),le.isArray(e)||e.jquery&&!le.isPlainObject(e))le.each(e,function(){i(this.name,this.value)});else for(n in e)Y(n,e[n],t,i);return r.join("&").replace(Lt,"+")},le.fn.extend({serialize:function(){return le.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=le.prop(this,"elements");return e?le.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!le(this).is(":disabled")&&$t.test(this.nodeName)&&!Ot.test(e)&&(this.checked||!$e.test(e))}).map(function(e,t){var n=le(this).val();return null==n?null:le.isArray(n)?le.map(n,function(e){return{name:t.name,value:e.replace(qt,"\r\n")}}):{name:t.name,value:n.replace(qt,"\r\n")}}).get()}}),le.ajaxSettings.xhr=function(){try{return new n.XMLHttpRequest}catch(e){}};var It={0:200,1223:204},Ht=le.ajaxSettings.xhr();se.cors=!!Ht&&"withCredentials"in Ht,se.ajax=Ht=!!Ht,le.ajaxTransport(function(e){var t,r;if(se.cors||Ht&&!e.crossDomain)return{send:function(i,o){var a,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(a in e.xhrFields)s[a]=e.xhrFields[a];e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);t=function(e){return function(){t&&(t=r=s.onload=s.onerror=s.onabort=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(It[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=t(),r=s.onerror=t("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&n.setTimeout(function(){t&&r()})},t=t("abort");try{s.send(e.hasContent&&e.data||null)}catch(e){if(t)throw e}},abort:function(){t&&t()}}}),le.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return le.globalEval(e),e}}}),le.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),le.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(r,i){t=le("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),Z.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Ft=[],Rt=/(=)\?(?=&|$)|\?\?/;le.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Ft.pop()||le.expando+"_"+xt++;return this[e]=!0,e}}),le.ajaxPrefilter("json jsonp",function(e,t,r){var i,o,a,s=!1!==e.jsonp&&(Rt.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rt.test(e.data)&&"data");if(s||"jsonp"===e.dataTypes[0])return i=e.jsonpCallback=le.isFunction(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,s?e[s]=e[s].replace(Rt,"$1"+i):!1!==e.jsonp&&(e.url+=(bt.test(e.url)?"&":"?")+e.jsonp+"="+i),e.converters["script json"]=function(){return a||le.error(i+" was not called"),a[0]},e.dataTypes[0]="json",o=n[i],n[i]=function(){a=arguments},r.always(function(){void 0===o?le(n).removeProp(i):n[i]=o,e[i]&&(e.jsonpCallback=t.jsonpCallback,Ft.push(i)),a&&le.isFunction(o)&&o(a[0]),a=o=void 0}),"script"}),le.parseHTML=function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||Z;var r=me.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=v([e],t,i),i&&i.length&&le(i).remove(),le.merge([],r.childNodes))};var Pt=le.fn.load;le.fn.load=function(e,t,n){if("string"!=typeof e&&Pt)return Pt.apply(this,arguments);var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=le.trim(e.slice(s)),e=e.slice(0,s)),le.isFunction(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&le.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?le("<div>").append(le.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},le.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){le.fn[t]=function(e){return this.on(t,e)}}),le.expr.filters.animated=function(e){return le.grep(le.timers,function(t){return e===t.elem}).length},le.offset={setOffset:function(e,t,n){var r,i,o,a,s,l,u,c=le.css(e,"position"),f=le(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=le.css(e,"top"),l=le.css(e,"left"),u=("absolute"===c||"fixed"===c)&&(o+l).indexOf("auto")>-1,u?(r=f.position(),a=r.top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(l)||0),le.isFunction(t)&&(t=t.call(e,n,le.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},le.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){le.offset.setOffset(this,e,t)});var t,n,r=this[0],i={top:0,left:0},o=r&&r.ownerDocument;if(o)return t=o.documentElement,le.contains(t,r)?(i=r.getBoundingClientRect(),n=Q(o),{top:i.top+n.pageYOffset-t.clientTop,left:i.left+n.pageXOffset-t.clientLeft}):i},position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0};return"fixed"===le.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),le.nodeName(e[0],"html")||(r=e.offset()),r.top+=le.css(e[0],"borderTopWidth",!0),r.left+=le.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-le.css(n,"marginTop",!0),left:t.left-r.left-le.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent;e&&"static"===le.css(e,"position");)e=e.offsetParent;return e||et})}}),le.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;le.fn[e]=function(r){return Se(this,function(e,r,i){var o=Q(e);if(void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),le.each(["top","left"],function(e,t){le.cssHooks[t]=L(se.pixelPosition,function(e,n){if(n)return n=D(e,t),Qe.test(n)?le(e).position()[t]+"px":n})}),le.each({Height:"height",Width:"width"},function(e,t){le.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){le.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),a=n||(!0===r||!0===i?"margin":"border");return Se(this,function(t,n,r){var i;return le.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):void 0===r?le.css(t,n,a):le.style(t,n,r,a)},t,o?r:void 0,o,null)}})}),le.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},size:function(){return this.length}}),le.fn.andSelf=le.fn.addBack,r=[],void 0!==(i=function(){return le}.apply(t,r))&&(e.exports=i);var Mt=n.jQuery,Wt=n.$;return le.noConflict=function(e){return n.$===le&&(n.$=Wt),e&&n.jQuery===le&&(n.jQuery=Mt),le},o||(n.jQuery=n.$=le),le})},function(e,t,n){n(2),e.exports=n(4)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),l=r(s),u=n(3),c=r(u),f=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};i(this,e),this.containerTmpl='<div class="pf-input-frame">\n            <ul class="pf-decorated" style="display:none"><li></li></ul>\n            <input type="text" class="pf-input" value="" style="background-color: transparent"/>\n            <a href="#" class="pf-arrow"><i></i></a>\n        </div>\n        <div class="pf-dropdown-frame" style="display:none">\n            <ul class="pf-dropdown-list"></ul>\n        </div>',this.groupTmpl='<li class="pf-dropdown-group" data-group_id="">\n                <span class="pf-group-item"></span>\n            <ul class="pf-dropdown-group-items"></ul>\n        </li>',this.itemTmpl='<li class="pf-dropdown-item" data-item_value=""></li>',this.$original=(0,l.default)([]),this.$container=(0,l.default)([]),this.$input=(0,l.default)([]),this.$ajax=null,this.groups=[],this.items=[],this.settings={containerClass:"pf-dropdown",implementOriginalStyles:!0,displaySelectionAs:"text",autocomplete:!1,minLength:2,ajax:{loadOnInit:!1,url:"",type:"get",dataType:"json",valueKey:"value",titleKey:"title",dataKey:"dataset"},plugins:[],callbacks:{onRendered:null,onClose:null,onOpen:null,onOverItem:null,onLeaveItem:null,onSelectItem:null,onInputKeyEvent:null,renderItem:null,renderGroup:null,ajaxDataBuilder:null,ajaxResponseFilter:null}},this.$original=(0,l.default)(t);var r=l.default.extend({},this.settings,n);r.ajax=l.default.extend({},this.settings.ajax,n.ajax),r.callbacks=l.default.extend({},this.settings.callbacks,n.callbacks),this.settings=r,this._loadOriginalOptions(),this._renderWidget(this.items,this.groups),this._executeCallback("onRendered",this.$original,this.$container),""!==l.default.trim(this.settings.ajax.url)&&!0===this.settings.ajax.loadOnInit&&this._loadRemoteItems()}return a(e,[{key:"_loadOriginalOptions",value:function(){var e=this,t=this.$original.find("optgroup"),n=function(t,n){t.each(function(t,r){var i=(0,l.default)(r),o=i.data("set"),a=i.attr("value")?i.attr("value"):"";e.items.push({group:n,value:a,title:i.text()?i.text():"",data:o||{}})})};t.length>0?t.each(function(t,r){var i=e.groups.length+1;e.groups.push({id:i,label:(0,l.default)(r).attr("label")}),n((0,l.default)(r).find("option"),i)}):n(this.$original.find("option"),"")}},{key:"_loadRemoteItems",value:function(){var e=this,t=this.settings.ajax,n={};!0===this.settings.autocomplete&&(n.term=this.$input.val()),null!==this.$ajax&&4!==this.$ajax.readyState&&this.$ajax.abort(),n=this._executeCallback("ajaxDataBuilder",n,this.$original,this.$container,this.settings),this.$ajax=l.default.ajax({url:t.url,type:t.type,dataType:"json",data:n}).done(function(t){var n=e._executeCallback("ajaxResponseFilter",t,e.settings);Array.isArray(n)||l.default.isPlainObject(n)||(n=t),e._loadItemsFromResponse(n)})}},{key:"_loadItemsFromResponse",value:function(e){var t=this;this.items=[],this.groups=[];var n=this.settings.ajax,r=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";l.default.isPlainObject(e)?e[n.dataKey]&&e[n.valueKey]&&e[n.titleKey]?t.items.push({group:r,value:e[n.valueKey],title:e[n.titleKey],data:e[n.dataKey]}):console.warn("Item doesn't contain needed keys: "+n.titleKey+", "+n.valueKey+", "+n.dataKey,e):console.warn("Wrong item type",e)};if(Array.isArray(e)){var i=!0,o=!1,a=void 0;try{for(var s,u=e[Symbol.iterator]();!(i=(s=u.next()).done);i=!0){var c=s.value;r(c)}}catch(e){o=!0,a=e}finally{try{!i&&u.return&&u.return()}finally{if(o)throw a}}}else l.default.isPlainObject(e)&&l.default.each(e,function(e,n){if(Array.isArray(n)){var i=t.groups.length+1;t.groups.push({id:i,label:e});var o=!0,a=!1,s=void 0;try{for(var l,u=n[Symbol.iterator]();!(o=(l=u.next()).done);o=!0){var c=l.value;r(c,i)}}catch(e){a=!0,s=e}finally{try{!o&&u.return&&u.return()}finally{if(a)throw s}}}});return this._replaceOriginalOptions(this.$original,this.items,this.groups),this._renderList(this.$container,this.items,this.groups),!0===this.settings.autocomplete&&this.$container.find(".pf-dropdown-item").length>0&&(this.$container.find(".pf-dropdown-frame").css("display",""),this._executeCallback("onOpen",this.$original,this.$container)),[this.items,this.groups]}},{key:"_deleteAllItems",value:function(){this.items=[],this.groups=[],this.$original.html(""),this.$container.find(".pf-dropdown-item").length>0&&this.$container.find(".pf-dropdown-frame").css("display","")}},{key:"_getSelectedItem",value:function(){var e=this.$original.find("option:selected").attr("value");return e=e||"",this._getItemByValue(e)}},{key:"_getItemByValue",value:function(e){if(this.items.length>0){var t=!0,n=!1,r=void 0;try{for(var i,o=this.items[Symbol.iterator]();!(t=(i=o.next()).done);t=!0){var a=i.value;if(a.value==e)return a}}catch(e){n=!0,r=e}finally{try{!t&&o.return&&o.return()}finally{if(n)throw r}}}return null}},{key:"_implementOriginalStyles",value:function(e,t){var n=["background","backgroundColor","border","position","top","left","right","bottom","color","cursor","font","height","lineHeight","margin","maxHeight","maxWidth","outline","width","wordSpacing","wordWrap","zoom"],r=void 0!==document.defaultView?document.defaultView.getComputedStyle(e[0],null):{};for(var i in r)if(n.includes(i)){var o=r[i];["height","width"].includes(i)&&"auto"===o&&(o=e.css(i)),"position"===i&&"static"===o&&(o="relative"),"border"===i?"none"!==o&&(t.find(".pf-input-frame").css(i,o).css("box-sizing","border-box"),t.find(".pf-dropdown-frame").css(i,o).css("border-top","none").css("box-sizing","border-box")):(t.css(i,o),["width","height"].includes(i)&&t.find(".pf-input-frame").css(i,o),"color"===i&&t.find(".pf-input").css(i,o))}return t}},{key:"_replaceOriginalOptions",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(e.html(""),t.length>0)if(n.length>0){var r=!0,i=!1,o=void 0;try{for(var a,s=n[Symbol.iterator]();!(r=(a=s.next()).done);r=!0){var u=a.value,c=(0,l.default)("<optgroup></optgroup>").attr("label",u.label),f=!0,p=!1,d=void 0;try{for(var h,g=t[Symbol.iterator]();!(f=(h=g.next()).done);f=!0){var v=h.value;c.append((0,l.default)("<option></option>").attr("value",v.value).html(v.title))}}catch(e){p=!0,d=e}finally{try{!f&&g.return&&g.return()}finally{if(p)throw d}}e.append(c)}}catch(e){i=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw o}}}else{var m=!0,y=!1,x=void 0;try{for(var b,w=t[Symbol.iterator]();!(m=(b=w.next()).done);m=!0){var T=b.value;e.append((0,l.default)("<option></option>").attr("value",T.value).html(T.title))}}catch(e){y=!0,x=e}finally{try{!m&&w.return&&w.return()}finally{if(y)throw x}}}}},{key:"_renderWidget",value:function(e,t){var n=this;return this.$container=this._renderContainer(this.$original,this.settings),this.$input=this.$container.find(".pf-input"),this._renderList(this.$container,e,t),this.$container.find(".pf-input-frame").on("click",function(e){if(e.preventDefault(),!0===n.settings.autocomplete){n.$input.val().length>=n.settings.minLength?n._loadRemoteItems():n._deleteAllItems()}return n._toggleDropdown(),!1}),this.$original.on("change",function(e,t){if("by-widget-changed"===(t=t||""))return!1;n.setValue((0,l.default)(e.currentTarget).val())}),this.settings.autocomplete&&this.$input.on("keypress keyup keydown",function(e){var t=(0,l.default)(e.currentTarget).val();n.$original.trigger(e),n._executeCallback("onInputKeyEvent",e,(0,l.default)(e.currentTarget)),"keyup"===e.type&&(t.length>=n.settings.minLength?n._loadRemoteItems():n._deleteAllItems())}),(0,l.default)("body").on("click pf-dropdown-click",function(e){"none"!==n.$container.find(".pf-dropdown-frame").css("display")&&(n.$container.find(".pf-dropdown-frame").css("display","none"),n._executeCallback("onClose",n.$original,n.$container))}),this.$container}},{key:"_renderList",value:function(e,t,n){var r=void 0;if(n.length>0){r=(0,l.default)([]);var i=!0,o=!1,a=void 0;try{for(var s,u=n[Symbol.iterator]();!(i=(s=u.next()).done);i=!0){var c=s.value,f=this._renderItems(t,c.id),p=this._renderGroup(c,f);p instanceof l.default&&(r=r.add(p))}}catch(e){o=!0,a=e}finally{try{!i&&u.return&&u.return()}finally{if(o)throw a}}}else r=this._renderItems(t);if(e.find(".pf-dropdown-list").html(r),!0!==this.settings.autocomplete){var d=this._getSelectedItem();if(null!==d){var h=this._renderItem(d);!1!==h&&this._selectItem(h,d)}}}},{key:"_renderContainer",value:function(e,t){e.css("display","none");var n=(0,l.default)("<div>").addClass(t.containerClass).append((0,l.default)(this.containerTmpl));return!0===t.useOriginalStyles&&(n=this._implementOriginalStyles(e,n)),!0==!t.autocomplete&&n.find(".pf-input").prop("readonly",!0),"html"===t.displaySelectionAs&&n.find(".pf-decorated").css("display",""),n.insertBefore(this.$original),n.append(this.$original),n}},{key:"_renderItems",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;if(e.length>0){var n=(0,l.default)([]),r=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done);r=!0){var u=a.value;if(t<0||t>=0&&u.group==t){var c=this._renderItem(u);c instanceof l.default&&(n=n.add(c))}}}catch(e){i=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw o}}return n}return null}},{key:"_renderItem",value:function(e){var t=this;if(e=e||!1,!l.default.isPlainObject(e))return!1;if([o(e.id),o(e.value),o(e.title)].includes("undfined"))return!1;var n=(0,l.default)(this.itemTmpl).attr("data-item_value",e.value).html(e.title),r=this._executeCallback("renderItem",n.clone(),e,this.$original,this.$container,this.settings);return r instanceof l.default&&r.hasClass("pf-dropdown-item")&&r.data("item_value")||(r=n),r.hover(function(e){var n=(0,l.default)(e.currentTarget),r=t._getItemByValue(n.data("item_value"));t._executeCallback("onOverItem",n,r)},function(e){var n=(0,l.default)(e.currentTarget),r=t._getItemByValue(n.data("item_value"));t._executeCallback("onLeaveItem",n,r)}),r.on("click",function(e){var n=t._getItemByValue((0,l.default)(e.currentTarget).data("item_value"));t._selectItem((0,l.default)(e.currentTarget),n),t._executeCallback("onSelectItem",n),t._toggleDropdown()}),r}},{key:"_renderGroup",value:function(e,t){var n=(0,l.default)(this.groupTmpl).attr("data-group_id",e.id);n.find(".pf-group-item").html(e.label),t instanceof l.default&&n.find(".pf-dropdown-group-items").html(t);var r=this._executeCallback("renderGroup",n.clone(!0),e,t,this.$original,this.$container,this.settings);return r instanceof l.default||(r=n),r}},{key:"_toggleDropdown",value:function(){(0,l.default)("body").trigger("pf-dropdown-click");var e=this.$container.find(".pf-dropdown-frame");"none"!==e.css("display")?(e.css("display","none"),this._executeCallback("onClose",this.$original,this.$container)):this.$container.find(".pf-dropdown-item").length>0&&(e.css("display",""),this._executeCallback("onOpen",this.$original,this.$container))}},{key:"_selectItem",value:function(e,t){var n=this.$container.find(".pf-input"),r=this.$container.find(".pf-decorated li");"html"===this.settings.displaySelectionAs?(n.val(""),r.html(e.clone())):(n.val(t.title),r.html("")),this.$original.val(t.value).trigger("change",["by-widget-changed"])}},{key:"_executeCallback",value:function(e){for(var t="on"===e.substring(0,2),n=arguments.length,r=Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];if(l.default.isFunction(this.settings.callbacks[e])&&(t?this.settings.callbacks[e].apply(this,r):r[0]=this.settings.callbacks[e].apply(this,r)),this.settings.plugins.length>0){var a=!0,s=!1,u=void 0;try{for(var c,f=this.settings.plugins[Symbol.iterator]();!(a=(c=f.next()).done);a=!0){var p=c.value;"object"===(void 0===p?"undefined":o(p))&&l.default.isFunction(p[e])&&(t?p[e].apply(p,r):r[0]=p[e].apply(p,r))}}catch(e){s=!0,u=e}finally{try{!a&&f.return&&f.return()}finally{if(s)throw u}}}return r[0]}},{key:"getValue",value:function(){return this._getSelectedItem()}},{key:"setValue",value:function(e){var t=this._getItemByValue(e);if(null!==t){var n=this._renderItem(t);n instanceof l.default&&(this._selectItem(n,t),this._executeCallback("onSelectItem",t))}}}]),e}();(0,c.default)("pfDropdown",f)},function(e,t,n){"use strict";function r(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r="__"+e,o=a.default.fn[e];a.default.fn[e]=function(n,o){o=o||null;var s=null,l=!1;return this.each(function(){var u=(0,a.default)(this),c=u.data(r),f=a.default.extend({},t.DEFAULTS,u.data(),"object"===(void 0===n?"undefined":i(n))&&n);c||u.data(r,c=new t(this,f)),"string"==typeof n&&(a.default.isFunction(c[n])?(s=c[n](o),l=!0):console.log(e+" has no method or option like '"+n+"'"))}),l?s:this},n&&(a.default[e]=function(t){return(0,a.default)({})[e](t)}),a.default.fn[e].noConflict=function(){return a.default.fn[e]=o}}Object.defineProperty(t,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=r;var o=n(0),a=function(e){return e&&e.__esModule?e:{default:e}}(o)},function(e,t){}]);
  provide("pf-dropdown", module.exports);
}(global));