document.addEventListener("DOMContentLoaded", function(event) {
	post_dom = document.querySelectorAll("#content-feed-sort > p");
	input_dom = document.querySelectorAll("#content-account-feeds > div");

	for (let i = 0; i < post_dom.length; i++) {
		post_dom[i].addEventListener("click", function() {
			post_type = this.value;
			if (this.getAttribute("value") == "saved") {
				loadPostsSavedAccount()
			} else if (this.getAttribute("value") == "posts") {
				loadPostsPostsAccount()
			} else if (this.getAttribute("value") == "upvoted") {
				loadPostsUpvotedAccount()
			} else if (this.getAttribute("value") == "downvoted") {
				loadPostsDownvotedAccount()
			}
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
	
	loadPostsPostsAccount()
});

function loadPostsPostsAccount() {
	var query = "http://localhost:3000/api/posts/postaccount/";
	loadPosts(query);
}

function loadPostsSavedAccount() {
	var query = "http://localhost:3000/api/posts/savedpostaccount/";
	loadPosts(query, document.getElementById("content-feed-saved-append"));
}

function loadPostsUpvotedAccount() {
	var query = "http://localhost:3000/api/posts/upvotedpostaccount/";
	loadPosts(query, document.getElementById("content-feed-upvoted-append"));
}
function loadPostsDownvotedAccount() {
	var query = "http://localhost:3000/api/posts/downvotedpostaccount/";
	loadPosts(query, document.getElementById("content-feed-downvoted-append"));
}