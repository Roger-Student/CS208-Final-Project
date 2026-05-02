(function() {
	var form = document.getElementById('comment-form');
	var feedback = document.querySelector('.form-feedback');
	var submitBtn = form.querySelector('button[type="submit"]');
	var container = document.querySelector('.comments-container');
	var pagination = document.querySelector('.pagination');
	var currentPage = 1;

	function loadComments(page) {
		currentPage = page;
		container.innerHTML = '<div class="spinner"></div>';
		pagination.innerHTML = '';
		container.setAttribute('aria-busy', 'true');

		fetch('/api/comments?page=' + page + '&limit=10')
			.then(function(response) {
				if (!response.ok) {
					throw new Error('Unable to load comments.');
				}
				return response.json();
			})
			.then(function(data) {
				renderComments(data.comments);
				renderPagination(data.page, data.totalPages);
			})
			.catch(function() {
				container.innerHTML = '<p class="comments-empty">Unable to load comments. Please try again later.</p>';
				var retry = document.createElement('button');
				retry.textContent = 'Retry';
				retry.className = 'btn btn-outline';
				retry.addEventListener('click', function() {
					loadComments(currentPage);
				});
				container.appendChild(retry);
			})
			.finally(function() {
				container.removeAttribute('aria-busy');
			});
	}

	function renderComments(comments) {
		if (!comments.length) {
			container.innerHTML = '<p class="comments-empty">Be the first to leave a comment.</p>';
			return;
		}

		container.innerHTML = '';
		comments.forEach(function(c) {
			var card = document.createElement('div');
			card.className = 'comment-card';

			var meta = document.createElement('div');
			meta.className = 'comment-meta';

			var name = document.createElement('span');
			name.className = 'comment-name';
			name.textContent = c.name;

			var time = document.createElement('span');
			time.className = 'comment-time';
			time.textContent = formatTime(c.timestamp);

			meta.appendChild(name);
			meta.appendChild(time);

			var body = document.createElement('p');
			body.className = 'comment-body';
			body.textContent = c.comment;

			card.appendChild(meta);
			card.appendChild(body);
			container.appendChild(card);
		});
	}

	function renderPagination(page, totalPages) {
		if (totalPages <= 1) return;

		var prev = document.createElement('button');
		prev.textContent = 'Previous';
		prev.disabled = page === 1;
		prev.addEventListener('click', function() {
			loadComments(page - 1);
		});

		var info = document.createElement('span');
		info.textContent = 'Page ' + page + ' of ' + totalPages;

		var next = document.createElement('button');
		next.textContent = 'Next';
		next.disabled = page === totalPages;
		next.addEventListener('click', function() {
			loadComments(page + 1);
		});

		pagination.appendChild(prev);
		pagination.appendChild(info);
		pagination.appendChild(next);
	}

	function formatTime(timestamp) {
		var now = new Date();
		var then = new Date(timestamp);
		var diff = Math.floor((now - then) / 1000);

		if (diff < 60) return 'Just now';
		if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
		if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
		if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
		return then.toLocaleDateString();
	}
	
	// validate, disable button, send fetch, handle response
	form.addEventListener('submit', function(e) {
		e.preventDefault();

		var name = form.name.value.trim();
		var comment = form.comment.value.trim();

		if (!name || !comment) {
			showFeedback('Name and comment are required.', 'error');
			return;
		}

		submitBtn.disabled = true;
		submitBtn.textContent = 'Posting...';
		clearFeedback();

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
				loadComments(1);
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

	loadComments(1);
})();