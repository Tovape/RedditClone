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
	append_dom = document.getElementById("content-feed-post-append");

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
			
			pages += 10;
			if (sort !== null || sort != undefined) {
				document.getElementById("siguiente").setAttribute("href", "./?query=" + search + "/" + pages + "/" + sort)
			} else {
				document.getElementById("siguiente").setAttribute("href", "./?query=" + search + "/" + pages + "/0")
			}
			pages -= 20;
			if (sort !== null || sort != undefined) {
				document.getElementById("anterior").setAttribute("href", "./?query=" + search + "/" + pages + "/" + sort)
			} else {
				document.getElementById("anterior").setAttribute("href", "./?query=" + search + "/" + pages + "/0")
			}
			
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
			pages += 10;
			if (sort !== null || sort != undefined) {
				document.getElementById("siguiente").setAttribute("href", "./?query=" + search + "/" + pages + "/" + sort)
			} else {
				document.getElementById("siguiente").setAttribute("href", "./?query=" + search + "/" + pages + "/0")
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
		loadPosts(query)
	}
});
