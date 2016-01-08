var colorjs = (function(window) {
	/**
	* @exports colorjs
	*/
	var module = {};

	/******************
	*       RGB       *
	******************/

	/**
	* Represents an RGB color.
	* @constructor
	* @exports RGB
	* @class
	* @param {number} r - Red value
	* @param {number} g - Green value
	* @param {number} b - Blue value
	*/
	function RGB(r,g,b) {
		if(b===undefined || g===undefined || r===undefined) {
			this.red = 255;
			this.green = 255;
			this.blue = 255;
		} else {
			this.red = r;
			this.green = g;
			this.blue = b;
		}
	}

	/**
	* Checks the RGB color and fixes it if needed
	*/
	RGB.prototype.fix = function () {
		if(this.red<0 || isNaN(this.red))
			this.red = 0;
		else if (this.red>255)
			this.red = 255;

		if(this.green<0 || isNaN(this.green))
			this.green = 0;
		else if (this.green>255)
			this.green = 255;

		if(this.blue<0 || isNaN(this.blue))
			this.blue = 0;
		else if (this.blue>255)
			this.blue = 255;
	}

	/**
	* Converts RGB to HSV color.
	* @return {HSV} HSV color.
	*/
	RGB.prototype.toHSV = function () {
		var R = this.red/255, G = this.green/255, B = this.blue/255, hue;

		var max = Math.max(R,G,B);
		var diff = max - Math.min(R,G,B);

		if (diff > 0) {
			if (max === R) {
				hue = ((G - B) / diff) % 6; 
				if (hue < 0) {
					hue = 6 + hue;
				}
			} else if (max === G) {
				hue = (B - R) / diff + 2; 
			} else {
				hue = (R - G) / diff + 4; 
			}
			return new HSV(hue*60, diff/max, max);
		} else {
			return new HSV(360, 0, max);
		}
	}

	/**
	* Converts RGB to HEXADECIMAL color.
	* @return {HEX} HEXADECIMAL color.
	*/
	RGB.prototype.toHEX = function () {
		var R = this.red.toString(16);
		if(R.length === 1) {
			R = '0' + R;
		}
		var G = this.green.toString(16);
		if(G.length === 1) {
			G = '0' + G;
		}
		var B = this.blue.toString(16);
		if(B.length === 1) {
			B ='0'+ B;
		}
		return new HEX(R + G + B);
	}

	/**
	* Inverts the RGB color.
	*/
	RGB.prototype.invert = function () {
		this.red = 255 - this.red;
		this.green = 255 - this.green;
		this.blue = 255 - this.blue;
	}

	/**
	* Converts the RGB color to a web-safe one.
	*/
	RGB.prototype.toWebSafe = function () {
		var redondear = function(n, modulo) {
			var op = n%modulo;
			if(op >= modulo/2)
				op = op - modulo;
			return n - op;
		}
		//51 = 255/5, 5 = n of safe colors between 0 and 255
		this.red = redondear(this.red, 51);
		this.green = redondear(this.green, 51);
		this.blue = redondear(this.blue, 51);
	}

	/**
	* Sets new values to an RGB color.
	* @param {number} r - Red value
	* @param {number} g - Green value
	* @param {number} b - Blue value
	*/
	RGB.prototype.set = function (r,g,b) {
		this.red = r;
		this.green = g;
		this.blue = b;
	}

	/**
	* Sets new values to an RGB color.
	* @param {RGB} rgb - New RGB color.
	*/
	RGB.prototype.copy = function (rgb) {
		this.red = rgb.red;
		this.green = rgb.green;
		this.blue = rgb.blue;
	}

	/**
	* Converts RGB into String css-like.
	* @return {string} 
	*/
	RGB.prototype.toString = function () {
		return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
	}

	/**
	* Converts RGB into an array.
	* @return {array} [red,green,blue] 
	*/
	RGB.prototype.toArray = function () {
		return [this.red, this.green, this.blue];
	}

	/**
	* Generates a random RGB color.
	*/
	RGB.prototype.random = function () {
		this.red = random(0,255);
		this.green = random(0,255);
		this.blue = random(0,255);
	}



	/******************
	*       HSV       *
	******************/

	/**
	* Represents an HSV color.
	* @constructor
	* @exports HSV
	* @class
	* @param {number} h - Hue value
	* @param {number} s - Saturation value
	* @param {number} v - Value value
	*/
	function HSV(h,s,v) {
		if(v===undefined || s===undefined || h===undefined) {	//This order improves performance (vsh)
			this.hue = 0;
			this.sat = 0;
			this.val = 1;
		} else {
			this.hue = h;
			this.sat = s;
			this.val = v;
		}
	}

	/**
	* Checks the HSV color and fixes it if needed
	*/
	HSV.prototype.fix = function () {
		if(this.hue < 0 || isNaN(this.hue)) {
			this.hue = 0;
		} else if(this.hue > 360) {
			this.hue = 360;
		}
		if(this.sat < 0 || isNaN(this.sat)) {
			this.sat = 0;
		} else if(this.sat > 1) {
			this.sat = 1;
		}
		if(this.val < 0 || isNaN(this.val)) {
			this.val = 0;
		} else if(this.val > 1) {
			this.val = 1;
		}
	}

	/**
	* Converts HSV to RGB color.
	* @return {RGB} RGB color.
	*/
	HSV.prototype.toRGB = function () {
		var R, G, B;
		var C = this.val*this.sat;
		var X = C*(1- Math.abs((this.hue/60)%2-1));
		var m = this.val-C;

		if(this.hue < 60)		{R=C; G=X; B=0}	//hue<60 including all negative numbers (may not work)
		else if(this.hue < 120)	{R=X; G=C; B=0}
		else if(this.hue < 180)	{R=0; G=C; B=X}
		else if(this.hue < 240)	{R=0; G=X; B=C}
		else if(this.hue < 300)	{R=X; G=0; B=C}
		else 					{R=C; G=0; B=X} //hue>=300 including 360 higher numbers (may not work)

		R = Math.round( (R+m)*255 );
		G = Math.round( (G+m)*255 );
		B = Math.round( (B+m)*255 );

		return new RGB(R,G,B);
	}


	/**
	* Sets new values to an HSV color.
	* @param {number} h - Hue value
	* @param {number} s - Saturation value
	* @param {number} v - Value value
	*/
	HSV.prototype.set = function (h,s,v) {
		this.hue = h;
		this.sat = s;
		this.val = v;
	}

	/**
	* Converts HSV to HSL (CSS) color in array. 
	* (Not tested, work in progress)
	* @return {array} HSL color.
	*/
	HSV.prototype.toHSL = function (){
		var val = (2 - this.sat) * this.val;
		var sat;
		if(val >= 1 && val !== 2) {
			sat = 2 - val;
		} else if (val > 0) { //Cannot divide 0/0 but 0/1 = 0
			sat = val;
		} else {
			sat = 1;
		}

		return[this.hue, this.sat*this.val/sat, val/2];
	}

	/**
	* Converts HSV into an array.
	* @return {array} [red,green,blue] 
	*/
	HSV.prototype.toArray = function () {
		return [this.hue, this.sat, this.val];
	}



	/******************
	*       HEX       *
	******************/

	/**
	* Represents an HEXADECIMAL color.
	* @constructor
	* @exports HEX
	* @class
	* @param {string} h - Hexadecimal string value
	*/
	function HEX(h) {
		if(h!==undefined) {
			this.hex = h.toUpperCase();
		} else {
			this.hex = "FFFFFF";
		}
	}

	/**
	* Checks the HEXADECIMAL color and fixes it if needed. 
	*/
	HEX.prototype.fix = function () {
		if(this.hex[0] === "#") {
			this.hex = this.hex.substring(1,this.hex.length);
		}
		if(this.hex.length === 3) {
			this.hex = this.hex[0] + this.hex[0] + this.hex[1]
					 + this.hex[1] + this.hex[2] + this.hex[2];
		} else if(this.hex.length<6) {
			this.hex = "000000";
		} else if(this.hex.length>6) {
			this.hex = this.hex.substr(0,6);
		}
		
		var rgbProv = this.toRGB();
		rgbProv.fix();
		this.set(rgbProv.toHEX());
		
	}

	/**
	* Sets new values to an HEXADECIMAL color.
	* @param {HEX} h - New HEX value
	*/
	HEX.prototype.set = function(h) {
		this.hex = h.hex;
	}

	/**
	* Converts HEXADECMAL to RGB color.
	* @return {RGB} RGB color.
	*/
	HEX.prototype.toRGB = function () {
		return new RGB(
			parseInt("0x" + this.hex.substring(0,2),16),
			parseInt("0x" + this.hex.substring(2,4), 16),
			parseInt("0x" + this.hex.substring(4,6), 16)
		)
	}

	/**
	* Converts HEXADECIMAL into String css-like.
	* @return {string} 
	*/
	HEX.prototype.toString = function () {
		return "#" + this.hex;
	}

	window.RGB = RGB;
	window.HEX = HEX;
	window.HSV = HSV;

	/********************
	*       OTHER       *
	********************/

	/**
	* Returns a random number between A and B.
	* @param {number} A - Minimum value.
	* @param {number} B - Maximum value.
	*/
	function random(A, B) {
		return Math.floor(Math.random()*(B-A+1)+A);
	}

	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	function RGBtoGPL(rgb, name) {
		name = name || rgb.toHEX().toString()
		return pad('   ',rgb.red,true) + 
			pad('    ',rgb.green,true) + 
			pad('    ',rgb.blue,true) + " " + name;
	}

	function pad(pad, str, padLeft) {
		if (typeof str === 'undefined') 
			return pad;
		if (padLeft) {
			return (pad + str).slice(-pad.length);
		} else {
			return (str + pad).substring(0, pad.length);
		}
	}

	/**
	* Saves an array of colors into a gpl palette file.
	* @param {array} palette - Array of colors
	* @param {string} name - Name for the palette.
	* @param {string} comment - Any comment to add (one line).
	* @throws {number} 0 - If HTML5 downloading files is not supported
	* @throws {number} 1 - If the number of colors is greater than 256. Every color will be saved anyway.
	*/
	module.saveToGPL = function(palette, name, comment) {
		var file = "GIMP Palette\n";
			file += "Name: " + name + "\n";
			file += "Columns: 8\n";
		if(comment !== undefined) {
			file += "#" + comment + "\n";
		}
			file += "\n";

		for(var i=0; i<palette.length; i++) {
			if(!(palette[i] instanceof RGB)) {
				palette[i] = palette[i].toRGB();
			}
			file += RGBtoGPL(palette[i]) + "\n";
		}

		try {
			download(name + ".gpl", file);
		} catch (e) { throw 0 }

		if(palette.length>256) {
			throw 1;
		}
	}
	
	/**
	* Deprecated method. Call saveToGPL instead. 
	* It does the same job. 
	* This method could be removed at any time.
	* @deprecated
	*/
	module.savePalette = function(palette, name, comment) {
		module.saveToGPL(palette,name,comment);
	}
	return module;
})(window);
