const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var append_dom = null;
var pages = 0;
var query = null;
var page = null;
var sort = null;
var search = urlParams.get('query');

if (search !== null) {
	search = search.split("/")
	if (search[1]) {page = search[1]}
	if (search[2]) {sort = search[2]}
	search = search[0]
}

document.addEventListener("DOMContentLoaded", function(event) {
	append_dom = document.getElementById("content-feed-search-append");

	// Set Pages
	if (page !== null) {
		pages = parseInt(page);
	}
	
	if (sort == null) {
		document.getElementById("content-feed-sort").querySelector("a:nth-child(1)").classList.add("active")
	} else if (sort == 1) {
		document.getElementById("content-feed-sort").querySelector("a:nth-child(2)").classList.add("active")
	} else if (sort == 2) {
		document.getElementById("content-feed-sort").querySelector("a:nth-child(3)").classList.add("active")
	} else if (sort == 3) {
		document.getElementById("content-feed-sort").querySelector("a:nth-child(4)").classList.add("active")
	} else {
		document.getElementById("content-feed-sort").querySelector("a:nth-child(1)").classList.add("active")
	}

	// Url Linkers
	if (search !== null || search != undefined) {
		query = "http://localhost:3000/api/posts/postitle/" + search + "/0/0";

		document.getElementById("search-best").setAttribute("href", "./?query=" + search + "/0/0")
		document.getElementById("search-cntr").setAttribute("href", "./?query=" + search + "/0/1")
		document.getElementById("search-new").setAttribute("href", "./?query=" + search + "/0/2")
		document.getElementById("search-old").setAttribute("href", "./?query=" + search + "/0/3")
		if (page !== null || page != undefined) {
			if (sort !== null || sort != undefined) {
				query = "http://localhost:3000/api/posts/postitle/" + search + "/" + page + "/" + sort;
			} else {
				query = "http://localhost:3000/api/posts/postitle/" + search + "/" + page + "/0";
			}
			document.getElementById("search-best").setAttribute("href", "./?query=" + search + "/" + page + "/0")
			document.getElementById("search-cntr").setAttribute("href", "./?query=" + search + "/" + page + "/1")
			document.getElementById("search-new").setAttribute("href", "./?query=" + search + "/" + page + "/2")
			document.getElementById("search-old").setAttribute("href", "./?query=" + search + "/" + page + "/3")
		} else {
			if (page == 0) {
				pages += 10;
				document.getElementById("siguiente").setAttribute("href", "a")
			} else {
				pages += 10;
				document.getElementById("siguiente").setAttribute("href", "a")
				pages -= 20;
				document.getElementById("anterior").setAttribute("href", "a")
			}

			query = "http://localhost:3000/api/posts/postitle/" + search + "/0/0";
			
			document.getElementById("search-best").setAttribute("href", "./?query=" + search + "/0/0")
			document.getElementById("search-cntr").setAttribute("href", "./?query=" + search + "/0/1")
			document.getElementById("search-new").setAttribute("href", "./?query=" + search + "/0/2")
			document.getElementById("search-old").setAttribute("href", "./?query=" + search + "/0/3")
		}
	}

	// Fetch
	if (search !== null) {
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
