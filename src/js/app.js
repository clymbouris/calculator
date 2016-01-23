$(document).ready(function() {

	function ViewModel(arr) {
		var self = this;

		self.memory = ko.observable('');
		self.display = ko.observable('');
		self.getLast = function() {
			return self.memory().split('')[self.memory().length - 1];
		};
		self.memoryMax = 26; // FIX THIS!!

		self.evaluate = function() {
			/* jslint evil: true */
			self.display(eval(self.memory()));
			self.memory(self.display().toString());
		};

		self.allClear = function() {
			self.memory('');
			self.display('');
		};

		self.verify = function(val) {
			switch (val) {
				case '=':
					self.evaluate();
					break;
				case 'AC':
					self.allClear();
					break;
				case 'x':
					if (self.memory().length > 0) {
						val = '*';
						self.update(val);
					}
					break;
				case '/':
					if (self.memory().length > 0) {
						self.update(val);
					}
					break;
				case '%':
					if (self.memory().length > 0) {
						self.update('*');
						self.update('1/100');
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