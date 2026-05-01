(function() {
	console.log('comments.js loaded');

	var form = document.getElementById('comment-form');
	var feedback = document.querySelector('.form-feedback');
	var submitBtn = form.querySelector('button[type="submit"]');

	form.addEventListener('submit', function(e) {
		e.preventDefault();
		console.log('form submitted');

		var name = form.name.value.trim();
		var comment = form.comment.value.trim();

		if (!name || !comment) {
			showFeedback('Name and comment are required.', 'error');
			return;
		}

		submitBtn.disabled = true;
		submitBtn.textContent = 'Posting...';
		clearFeedback();

		console.log('sending:', { name: name, comment: comment });

		var controller = new AbortController();
		var timeout = setTimeout(function() {
			controller.abort();
		}, 8000);

		fetch('/api/comments', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: name, comment: comment }),
			signal: controller.signal
		})
			.then(function(response) {
				clearTimeout(timeout);
				if (!response.ok) {
					return response.json().then(function(data) {
						throw new Error(data.error || 'Something went wrong.');
					});
				}
				return response.json();
			})
			.then(function() {
				showFeedback('Thanks for your comment!', 'success');
				form.reset();
			})
			.catch(function(err) {
				clearTimeout(timeout);
				if (err.name === 'AbortError') {
					showFeedback('Request timed out. Please try again.', 'error');
				} else {
					showFeedback(err.message, 'error');
				}
			})
			.finally(function() {
				submitBtn.disabled = false;
				submitBtn.textContent = 'Submit';
			});
	});

	function showFeedback(message, type) {
		feedback.textContent = message;
		feedback.className = 'form-feedback ' + type;
	}

	function clearFeedback() {
		feedback.textContent = '';
		feedback.className = 'form-feedback';
	}
})();