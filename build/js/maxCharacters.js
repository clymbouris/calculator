ko.extenders.maxCharacters = function(target, max) {
	var result = ko.pureComputed({
		read: target,
		write: function(newValue) {
			var current = target();
			if (newValue.length <= max) {
				target(newValue);
			}
			else {
				target(current);
				target.notifySubscribers(current);
			}
		}
	}).extend({ notify: 'always' });

	return result;
};