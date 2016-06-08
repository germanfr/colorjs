/*
    colorjs - A simple JavaScript library to manage colors.
    Copyright (C) 2016 Germán Franco

    colorjs is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    colorjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
		if(b === undefined) {
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
		else
			this.red = this.red & 255;

		if(this.green<0 || isNaN(this.green))
			this.green = 0;
		else
			this.green = this.green & 255;

		if(this.blue<0 || isNaN(this.blue))
			this.blue = 0;
		else
			this.blue = this.blue & 255;
	}

	/**
	* Converts RGB to HSV color.
	* @return {HSV} HSV color.
	*/
	RGB.prototype.toHSV = function () {
		var R = this.red/255,
			G = this.green/255,
			B = this.blue/255;

		var max = Math.max(R,G,B);
		var diff = max - Math.min(R,G,B);
		var hue;

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
		return new HEX((this.red << 16) | (this.green << 8) | this.blue);
	}

	/**
	* Inverts the RGB color.
	* @return {RGB} this object modified.
	*/
	RGB.prototype.invert = function () {
		this.red = 255 - this.red;
		this.green = 255 - this.green;
		this.blue = 255 - this.blue;
		return this;
	}

	/**
	* Converts the RGB color to a web-safe one.
	* @return {RGB} this object modified.
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
		return this;
	}

	/**
	* Sets new values to an RGB color.
	* @param {number} r - Red value
	* @param {number} g - Green value
	* @param {number} b - Blue value
	* @return {RGB} this object modified.
	*/
	RGB.prototype.set = function (r,g,b) {
		this.red = r;
		this.green = g;
		this.blue = b;
		return this;
	}

	/**
	* Copies the rgb into a new one.
	* @return {RGB} rgb - A copy of the original RGB.
	*/
	RGB.prototype.clone = function () {
		return new RGB(this.red, this.green, this.blue);
	}

	/**
	* Converts RGB to RGB color.
	* @return {RGB} RGB color.
	*/
	RGB.prototype.toRGB = function () {
		return this.clone();
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
	* @return {RGB} Random RGB color
	*/
	RGB.random = function () {
		return new RGB(
			random(0,255),
			random(0,255),
			random(0,255)
		);
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
		if(v === undefined) {	//If last parameter missing n_parameters < 3
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
	* @return {HSV} this object modified.
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
		return this;
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
	* Converts HSV to HEXADECIMAL color.
	* @return {HEX} HEX color.
	*/
	HSV.prototype.toHEX = function () {
		var R, G, B;
		var C = this.val*this.sat;
		var X = C*(1- Math.abs((this.hue/60)%2-1));
		var m = this.val-C;

		if(this.hue < 60)       {R=C; G=X; B=0}	//hue<60 including all negative numbers (may not work)
		else if(this.hue < 120) {R=X; G=C; B=0}
		else if(this.hue < 180) {R=0; G=C; B=X}
		else if(this.hue < 240) {R=0; G=X; B=C}
		else if(this.hue < 300) {R=X; G=0; B=C}
		else                    {R=C; G=0; B=X} //hue>=300 including 360 higher numbers (may not work)

		R = Math.round( (R+m)*255 );
		G = Math.round( (G+m)*255 );
		B = Math.round( (B+m)*255 );
		return new HEX((R << 16) | (G << 8) | B);
	}

	/**
	* Sets new values to an HSV color.
	* @param {number} h - Hue value
	* @param {number} s - Saturation value
	* @param {number} v - Value value
	* @return {HSV} this object modified.
	*/
	HSV.prototype.set = function (h,s,v) {
		this.hue = h;
		this.sat = s;
		this.val = v;
		return this;
	}

	/**
	* Copies the HSV into a new one.
	* @return {HSV} hsv - A copy of the original HSV.
	*/
	HSV.prototype.clone = function () {
		return new HSV(this.hue, this.sat, this.val);
	}

	/**
	* Converts HSV to HSV color.
	* @return {HSV} HSV color.
	*/
	HSV.prototype.toHSV = function () {
		return this.clone();
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

		return [this.hue, this.sat*this.val/sat, val/2];
	}

	/**
	* Converts HSV into an array.
	* @return {array} [red,green,blue]
	*/
	HSV.prototype.toArray = function () {
		return [this.hue, this.sat, this.val];
	}

	/**
	* Generates a random HSV color.
	* @return {HSV} Random HSV color
	*/
	HSV.random = function () {
		return new HSV(
			random(0,360),
			random(0,100)/100,
			random(0,100)/100
		);
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
		if(h !== undefined) {
			if(typeof h === "number") {
				this.hex = h & 16777215;
			} else {
				this.hex = parseHEX(h);
			}
		} else {
			this.hex = 16777215;
		}
	}

	function parseHEX(hex) {
		if(hex[0] === '#') {
			hex = hex.substring(1,hex.length);
		}
		if(hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		} else if(hex.length < 6) {
			return 0;
		} else if (hex.length > 6) {
			return 16777215;
		}
		return parseInt(hex, 16);
	}

	/**
	* Sets new values to an HEXADECIMAL color.
	* @param {HEX} h - New HEX value
	* @return {HEX} this object modified.
	*/
	HEX.prototype.set = function(h) {
		this.hex = parseHEX(h);
		return this;
	}

	/**
	* Copies the HEX into a new one.
	* @return {HEX} hex - A copy of the original HEX.
	*/
	HEX.prototype.clone = function () {
		return new HEX(this.hex);
	}

	/**
	* Converts HEXADECIMAL into String value.
	* @return {string}
	*/
	HEX.prototype.getValue = function () {
		return pad("000000", this.hex.toString(16), true);
	}

	/**
	* Converts HEXADECMAL to RGB color.
	* @return {RGB} RGB color.
	*/
	HEX.prototype.toRGB = function () {
		return new RGB(
			(this.hex >> 16) & 255,	//Red
			(this.hex >> 8) & 255,	//Green
			(this.hex & 255)		//Blue
		);
	}

	/**
	* Converts HEX to HSV color.
	* @return {HSV} HSV color.
	*/
	HEX.prototype.toHSV = function () {
		var R = ((this.hex >> 16) & 255)/255,
			G = ((this.hex >> 8) & 255)/255,
			B = (this.hex & 255)/255;

		var max = Math.max(R,G,B);
		var diff = max - Math.min(R,G,B);
		var hue;

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
	* Converts HEXADECIMAL to HEXADECIMAL color.
	* @return {HEX} HEXADECIMAL color.
	*/
	HEX.prototype.toHEX = function () {
		return this.clone();
	}

	/**
	* Generates a random HEX color.
	* @return {HEX} Random HEX color
	*/
	HEX.random = function () {
		return new HEX(random(0,16777215));
	}

	/**
	* Converts HEXADECIMAL into String css-like.
	* @return {string}
	*/
	HEX.prototype.toString = function () {
		return "#" +this.getValue();
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
			pad('    ',rgb.blue,true) +
				" " + name;
	}

	function pad(pad, str, padLeft) {
		if (typeof str === 'undefined')
			return pad;
		else if(str.length === pad.length)
			return str;

		if (padLeft)
			return (pad + str).slice(-pad.length);
		else
			return (str + pad).substring(0, pad.length);
	}

	/**
	* Parses the array of colors to GPL swatch file format text.
	* @param {array} palette - Array of colors
	* @param {string} title - Title name for the palette.
	* @param {string} comment - Any comment to add (one line).
	* @return {string} Returns the file text.
	*/
	module.parseGPL = function(palette, title, comment) {
		var file = "GIMP Palette\n";
			file += "Name: " + title + "\n";
			file += "Columns: 8\n";
		if(comment !== undefined) {
			file += "#" + comment + "\n";
		}
			file += "\n";

		for(var i=0; i<palette.length; i++) {
			if(!(palette[i] instanceof RGB)) {
				palette[i] = palette[i].toRGB();
			}
			palette[i].fix();
			file += RGBtoGPL(palette[i]) + "\n";
		}

		return file;
	}

	/**
	* Saves an array of valid colorjs colors into a gpl palette file.
	* Given a title the file will be named joining title words with underscores.
	* @param {array} palette - Array of colors
	* @param {string} title - Title name for the palette.
	* @param {string} comment - Any comment to add (one line).
	* @throws {number} 0 - If HTML5 downloading files is not supported
	* @throws {number} 1 - If the number of colors is greater than 256. Every color will be saved anyway.
	*/
	module.saveToGPL = function(palette, title, comment) {
		try {
			var file = module.parseGPL(palette,title,comment);
		} catch (e) { throw e }

		title = title.split(" ").join("_");
		try {
			download(title + ".gpl", file);
		} catch (e) { throw 0 }

		if(palette.length>256) {
			throw 1;
		}
	}

	return module;
})(window);
