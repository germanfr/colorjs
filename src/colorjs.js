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

	function Color(type) {
		switch(type) {
			case 'rgb':
				this.setRGB(arguments[1], arguments[2], arguments[3]);
				break;
			case 'hsv':
				this.setHSV(arguments[1], arguments[2], arguments[3]);
				break;
			case 'hex':
			default:
				this.setHEX(arguments[1]);
		}
	}

	Color.prototype = {
		setRGB: function(r, g, b) {
			this._red = r & 0xFF;
			this._green = g & 0xFF;
			this._blue = b & 0xFF;

			this.onRGBChange();
		},

		setHSV: function(h, s, v) {
			if(h < 0 || isNaN(h)) {
				h = 0;
			} else if(h > 360) {
				h = 360;
			}
			if(s < 0.0 || isNaN(s)) {
				s = 0.0;
			} else if(s > 1.0) {
				s = 1.0;
			}
			if(v < 0.0 || isNaN(v)) {
				v = 0.0;
			} else if(v > 1.0) {
				v = 1.0;
			}
			this._hue = h;
			this._sat = s;
			this._val = v;
			this.onHSVChange();
		},

		setHEX: function(h) {
			if(typeof h === 'number') {
				this._hex = h & 0xFFFFFF;
			} else if(typeof h === 'string') {
				this._hex = parseHEX(h);
			} else {
				this._hex = 0;
			}
			this.onHEXChange();
		},

		get red() { return this._red; },
		set red(r) {
			this._red = r & 0xFF;
			this.onRGBChange();
		},

		get green() { return this._green; },
		set green(g) {
			this._green = g & 0xFF;
			this.onRGBChange();
		},

		get blue() { return this._blue; },
		set blue(b) {
			this._blue = b & 0xFF;
			this.onRGBChange();
		},

		get hue() { return this._hue; },
		set hue(h) {
			if(h < 0 || isNaN(h)) {
				h = 0;
			} else if(h > 360) {
				h = 360;
			}
			this._hue = h;
			this.onHSVChange();
		},

		get sat() { return this._sat; },
		set sat(s) {
			if(s < 0.0 || isNaN(s)) {
				s = 0.0;
			} else if(s > 1.0) {
				s = 1.0;
			}
			this._sat = s;
			this.onHSVChange();
		},

		get val() { return this._val; },
		set val(v) {
			if(v < 0.0 || isNaN(v)) {
				v = 0.0;
			} else if(v > 1.0) {
				v = 1.0;
			}
			this._val = v;
			this.onHSVChange();
		},

		get hex() { return this._hex; },
		set hex(h) {
			this.setHEX(h);
		},

		equals: function(o) {
			return o && o._hex === this._hex;
		},

		clone: function() {
			return new Color('hex', this._hex);
		},

		invert: function() {
			this._hex = ~this._hex & 0xFFFFFF;
			this.onHEXChange();
		},

		toWebSafe: function () {
			this._red = Math.round(this._red / 51) * 51;
			this._green = Math.round(this._green / 51) * 51;
			this._blue = Math.round(this._blue / 51) * 51;
			this.onRGBChange();
		},

		onRGBChange: function() {
			this._RGBtoHSV();
			this._RGBtoHEX();
		},

		onHSVChange: function() {
			this._HSVtoRGB();
			this._RGBtoHEX();
		},

		onHEXChange: function() {
			this._HEXtoRGB();
			this._RGBtoHSV();
		},

		_RGBtoHSV: function() {
			const max = Math.max(this._red, this._green, this._blue);
			const diff = max - Math.min(this._red, this._green, this._blue);
			if (diff > 0) {
				let hue = 0;
				if (max === this._red) {
					hue = ((this._green - this._blue) / diff) % 6;
					if (hue < 0)
						hue += 6;
				} else if (max === this._green) {
					hue = (this._blue - this._red) / diff + 2;
				} else {
					hue = (this._red - this._green) / diff + 4;
				}
				this._hue = hue * 60;
				this._sat = diff / max;
				this._val = max /255;
			} else {
				this._hue = 0;
				this._sat = 0;
				this._val = max /255;
			}
		},

		_RGBtoHEX: function() {
			this._hex = (this._red << 16) | (this._green << 8) | this._blue;
		},

		_HSVtoRGB: function() {
			let R, G, B;
			const C = this._val * this._sat;
			const X = C * (1 - Math.abs((this._hue / 60) % 2 - 1));
			const m = this._val - C;

			if(this._hue < 60)       {R=C; G=X; B=0} // hue<60 including all negative numbers (may not work)
			else if(this._hue < 120) {R=X; G=C; B=0}
			else if(this._hue < 180) {R=0; G=C; B=X}
			else if(this._hue < 240) {R=0; G=X; B=C}
			else if(this._hue < 300) {R=X; G=0; B=C}
			else                     {R=C; G=0; B=X} // hue>=300 including 360 higher numbers (may not work)

			this._red   = Math.round((R+m) * 255);
			this._green = Math.round((G+m) * 255);
			this._blue  = Math.round((B+m) * 255);
		},

		_HEXtoRGB: function() {
			this._red = (this._hex >> 16) & 0xFF;
			this._green = (this._hex >> 8) & 0xFF;
			this._blue = this._hex & 0xFF;
		},

		toStringRGB: function() {
			return `rgb(${this._red},${this._green},${this._blue})`;
		},
		toStringHSV: function() {
			return `hsv(${this._hue},${this._sat},${this._val})`;
		},
		toStringHEX: function(withHash) {
			if(withHash === false)
				return padl('000000', this._hex.toString(16));
			else
				return padl('#000000', this._hex.toString(16));
		},
		toString: function() {
			return this.toStringHEX(true);
		}
	};

	Color.random = function() {
		const rand = random(0,0xFFFFFF);
		return new Color('hex', rand);
	};

	module.Color = Color;
	window.Color = Color;

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

	function parseHEX(hex) {
		if(hex[0] === '#') {
			hex = hex.substring(1,hex.length);
		}
		if(hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		} else if(hex.length < 6) {
			return 0x000000;
		} else if (hex.length > 6) {
			return 0xFFFFFF;
		}
		return parseInt(hex, 16) || 0x000000;
	}

	function padl(padstr, str) {
		if(str.length >= padstr.length)
			return str;
		return padstr.substr(0, padstr.length - str.length) + str;
	}

	function padr(padstr, str) {
		return str + padstr.substr(str.length);
	}

	function downloadString(filename, text) {
		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	function GPLPalette(palette, title, comment) {
		if(palette.length > 256)
			throw 'Palette list too long: max is 256';
		this.palette = palette;

		this.title = title;
		this.comment = comment;
	}

	GPLPalette.prototype = {
		save: function() {
			const content = this.toString();

			const filename = this.title.replace(' ', '_').toLowerCase() + '.gpl';
			try {
				downloadString(filename, content);
			} catch (e) {
				throw 'Failed downloading the file: witchery didn\'t work';
			}
		},

		toString: function() {
			let str = 'GIMP Palette\n';
				str += 'Name: ' + this.title + '\n';
				str += 'Columns: 8\n';

			if(this.comment) {
				str += '#' + this.comment + '\n';
			}
				str += '\n';

			for(var i = 0; i < this.palette.length; i++) {
				str += this.colorToGPL(this.palette[i]) + '\n';
			}
			return str;
		},

		colorToGPL: function(color, name) {
			name = name || color.toStringHEX();
			return padl('    ', color.red   + ' ') +
			       padl('    ', color.green + ' ') +
			       padl('    ', color.blue  + ' ') + name;
		}
	};

	module.GPLPalette = GPLPalette;
	window.GPLPalette = GPLPalette;


	return module;
})(window);
