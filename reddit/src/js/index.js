document.addEventListener("DOMContentLoaded", function(event) {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const s = urlParams.get('s')	

	if (s == null) {
		loadPostsBest()
		document.getElementById("content-feed-sort").querySelector("a:nth-child(1)").classList.add("active")
	} else if (s == "cntr") {
		loadPostsControversial()
		document.getElementById("content-feed-sort").querySelector("a:nth-child(2)").classList.add("active")
	} else if (s == "new") {
		loadPostsNew()
		document.getElementById("content-feed-sort").querySelector("a:nth-child(3)").classList.add("active")
	} else if (s == "old") {
		loadPostsOld()
		document.getElementById("content-feed-sort").querySelector("a:nth-child(4)").classList.add("active")
	} else {
		loadPostsBest()
		document.getElementById("content-feed-sort").querySelector("a:nth-child(1)").classList.add("active")
	}
});
