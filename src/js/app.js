$(document).ready(function() {

	function ViewModel(arr) {
		var self = this;

		self.maxCharacters = 52;

		self.memory = ko.observable('')
		.extend({ maxCharacters: self.maxCharacters });

		self.display = ko.observable('');

		self.getLast = function(str) {
			return self.memory().split('')[self.memory().length - 1];
		};
		self.getFirst = function(str) {
			return self.memory().split('')[0];
		};

		self.evaluate = function() {
			// If there's a result already evaluated on display then append to memory to keep
			// going with calculations
			var displayLength = self.display().toString().length;
			if (displayLength > 0 && (self.isOperator(self.getFirst()))) {
				// Convert memory to array
				var memArray = self.memory().toString().split('');
				// Add display value to beginning
				memArray.unshift(self.display());
				self.memory(memArray.join(''));
			}
			/* jslint evil: true */
			var calculation = parseFloat(eval(self.memory()));
			if (self.isDecimal(calculation.toString())) {
				// Deals with 0.1 + 0.2 error and 99999999999999/10 is not 10000000000000000
				calculation = Math.floor(calculation * 100) / 100;
			}
			// Convert to Number to remove trailing zeros
			self.display(Number(calculation).toString());
			// Clear memory
			self.memory('');
			self.allowFirstOperator = true;
		};

		self.allowFirstOperator = false;

		self.isDecimal = function(str) {
			var i;
			for (i = 0; i < str.length; i++) {
				if(str[i] === '.') return true;
			}
			return false;
		};

		self.allClear = function() {
			self.memory('');
			self.display('');
			self.allowFirstOperator = false;
		};

		self.singleClear = function() {
			self.memory(self.memory().slice(0, self.memory().length - 1));
		};

		self.verify = function(val) {
			switch (val) {
				case '=':
					self.evaluate();
					break;
				case 'AC':
					self.allClear();
					break;
				case 'C':
					self.singleClear();
					break;
				case 'x':
					if (self.memory().length > 0 || self.allowFirstOperator) {
						val = '*';
						self.update(val);
					}
					break;
				case '/':
					if (self.memory().length > 0 || self.allowFirstOperator) {
						self.update(val);
					}
					break;
				case '%':
					// if there's something on the display use for calculations
					if (self.display().length > 0) {
						self.update(self.display().toString() + '*1/100');
						self.evaluate();
					}
					else if (self.memory().length > 0 || self.allowFirstOperator) {
						self.evaluate();
						self.update('*1/100');
						self.evaluate();
					}
					
					break;
				case ',':
					val = '.';
					if (this.commaValid()) {
						self.update(val);
					}
					break;
				default:
					self.update(val);
			}
		};

		self.commaValid = function() {
			var mem = this.memory().split('');
			var i;
			for (i = mem.length - 1; i >= 0; i--) {
				if (mem[i] === '.') {
					return false;
				}
				if (this.isOperator(mem[i])) {
					return true;
				}
			}
			return true;
		};

		self.update = function(val) {
			var last = self.getLast();
			if(self.isOperator(last) && self.isOperator(val)) {
				self.memory(self.memory().slice(0, self.memory().length - 1) + val);
			}
			else {
				self.memory(self.memory() + val);
			}
		};

		self.isOperator = function(x) {
			var i;
			for (i = 0; i < model.operators.length; i++) {
				if (x === model.operators[i]) return true;
			}
			return false;
		};
	}

	var model =  {
		operators: ['+', '-', '/', '*'],
		signs: ['+', '-']
	};

	var view = {
		init: function() {
			this.$keys = $('.keys');
			this.$keys.each(function() {
				$(this).click(function() {
					vm.verify($(this).text());
				});
			});
		}
	};

	view.init();

	var vm = new ViewModel();
	ko.applyBindings(vm);

});