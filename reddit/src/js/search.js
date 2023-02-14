var append_dom = null;
var pages = 0;

document.addEventListener("DOMContentLoaded", function(event) {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const product = urlParams.get('query');
	
	const page = urlParams.get('page')

	if (page !== null) {
		pages = parseInt(page);
	}
	
	append_dom = document.getElementById("content-feed-search-append");

	if (product !== null) {
	
	var query = "http://localhost:3000/api/posts/postitle/" + product + "/" + pages + "/0";
	
	if (page === null || page == 0) {
		pages += 10;
		document.getElementById("siguiente").setAttribute("href", "./?query=" + product + "&page=" + pages)
	} else {
		pages += 10;
		document.getElementById("siguiente").setAttribute("href", "./?query=" + product + "&page=" + pages)
		pages -= 20;
		document.getElementById("anterior").setAttribute("href", "./?query=" + product + "&page=" + pages)
	}
	
	fetch(query, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"x-access-token": token
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		console.log(data)
		data.forEach(function(data) {
			temp = "";
			temp += `
				<div class="content-feed-post-each" id=` + data._id + `>
					<div class="post-each-votes">
						<img class="upvote" src="/icons/upvote.svg">
						<p class="votes">` + (convertVotes(data.upvotes - data.downvotes)) + `</p>
						<img class="downvote" src="/icons/downvote.svg">
					</div>
					<div class="post-each-main">
						<div class="post-each-main-details">
							<img class="subreddit-icon" src="/icons/subreddit.svg">
							<p class="subreddit-name">r/Subreddit</p>
							<p>•</p>
							<p>Posted by <span><a style="display: inline;" href="./u/` + data.posterName + `">` + data.posterName + `</a></span></p>
							<p>•</p>
							<p>` + (getTimePosted(data.createdAt)) + `</p>
						</div>
						<div class="post-each-main-content">
							<p class="title">` + data.title + `</p>
							<p class="description">` + data.description + `</p>
						</div>
						<div class="post-each-main-option">
							<div>
								<img class="comment" src="/icons/comment.svg">
								<p>23 Comments</p>
							</div>
							<div>
								<img class="award" src="/icons/award.svg">
								<p>Award</p>
							</div>
							<div>
								<img class="share" src="/icons/share.svg">
								<p>Share</p>
							</div>
							<div>
								<img class="save" src="/icons/save.svg">
								<p>Save</p>
							</div>
						</div>
					</div>
				</div>
			`;
			append_dom.insertAdjacentHTML("afterbegin", temp);
		})
	});
	
	}

});

function searchSort() {   
	var query = "http://localhost:3000/api/posts/postitle/" + product + "/" + pages + "/" + document.getElementById("sort").value;
	
	fetch(query, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"x-access-token": token
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		console.log(data)
	});
}