document.addEventListener("DOMContentLoaded", function(event) {
	post_dom = document.querySelectorAll("#content-feed-sort > p");
	input_dom = document.querySelectorAll("#content-account-feeds > div");

	for (let i = 0; i < post_dom.length; i++) {
		post_dom[i].addEventListener("click", function() {
			post_type = this.value;
			if (!this.classList.contains("active")) {
				post_dom.forEach(function(e) {
					e.classList.remove('active');
				});
				input_dom.forEach(function(e) {
					e.classList.remove('active');
				});
			}
			this.classList.add("active")
			input_dom[i].classList.add("active")
		})
	}
	
	loadPostsNewAccount()
});

function loadPostsNewAccount() {
	var query = "http://localhost:3000/api/posts/postaccount/";
	loadPosts(query);
}

