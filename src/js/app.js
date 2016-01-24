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

		self.evaluate = function() {
			/* jslint evil: true */
			var calculation = parseFloat(eval(self.memory())).toPrecision(6);
			// Convert to Number to remove trailing zeros
			self.display(Number(calculation));
			self.memory('');
			self.allowFirstOperator = true;
		};

		self.allowFirstOperator = false;

		self.wrapInBrackets = function(str) {
			return '(' + str + ')';
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
					if (self.memory().length > 0) {
						// FIX need to wrap ALL memory contents to brackets and then evaluate!!!
						self.update('*1/100');
						self.memory(self.wrapInBrackets(self.memory()));
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
		operators: ['+', '-', '/', '*', '%'],
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