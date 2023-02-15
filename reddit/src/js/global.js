// Global Variables
var temp = null;
var username_dom = null;
var profile_toggle = null;
var search_input = null;
var logout_button = null;
var append_dom = null;
var popup_dom = null;
var token = null;
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// DOM
document.addEventListener("DOMContentLoaded", function(event) {
	// Menu
	profile_toggle = document.getElementById("menu-profile")
	search_input = document.getElementById("search")
	logout_button = document.getElementById("menu-logout-button")
	popup_dom = document.getElementById("popup")
	popup_color_dom = document.getElementById("popup-color")
	popup_message_dom = document.getElementById("popup-message")
	
	if (profile_toggle !== null) {
		profile_toggle.addEventListener("click", function() {
			profile_toggle.classList.toggle("show");
		});
	}
	
	// Search
	if (search_input !== null) {
		search_input.addEventListener('keypress', function(event) {
			if (event.which === 13) {
				searchForm()
			}
		});
	}
	
	if (logout_button !== null) {
		logout_button.addEventListener('click', function(event) {
			signout();
		});
	}
	
	// DOM
	append_dom = document.getElementById("content-feed-post-append");
	username_dom = document.getElementById("username");
	
	// Token
	token = getCookie("token")
	if (token !== null) {
		token = (JSON.parse(token))["token"]
	}
	
	// Show Login Button if neccessary
	if (token == null) {
		if (document.getElementById("menu-login")) {
			document.getElementById("menu-login").classList.add("display-flex")
			document.getElementById("menu-profile").classList.add("display-none")
		}
	}
});

// Functions

function searchForm() {
	temp = document.getElementById("search").value
	if(temp !== null && temp !== "") {
		window.location.href = "/search/?query=" + temp;
	}
}

function popup(status, message) {
	popup_dom.classList.toggle("popup-animation")
	popup_message_dom.textContent = message
	
	switch (status) {
		case 0:
			popup_color_dom.style.backgroundColor = "green"
			break;
		case 1:
			popup_color_dom.style.backgroundColor = "yellow"
			break;
		case 2:
			popup_color_dom.style.backgroundColor = "red"
			break;
		case 3:
			popup_color_dom.style.backgroundColor = "var(--blue1)"
			break;
		default:
			popup_color_dom.style.backgroundColor = "var(--blue1)"
	}
	
	setTimeout(function(){
		popup_dom.classList.toggle("popup-animation")
	}, 3000);
}

// Log Out

function signout() {
	eraseCookie("token")
}

// Get Posts

function loadPostsBest() {
	var query = "http://localhost:3000/api/posts/postsort/0";
	loadPosts(query);
}

function loadPostsControversial() {
	var query = "http://localhost:3000/api/posts/postsort/1";
	loadPosts(query);
}

function loadPostsNew() {
	var query = "http://localhost:3000/api/posts/postsort/2";
	loadPosts(query);
}

function loadPostsOld() {
	var query = "http://localhost:3000/api/posts/postsort/3";
	loadPosts(query);
}

function loadPosts(query) {
	fetch(query, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
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

function loadPostsLogged(query) {
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

// Submit Post

function submitPost(title, other, type) {
	
	var query = null;

	if (type == 0) {
		query = `
			{
				"title": "${title}",
				"description": "${other}"
			}
		`;
	} else if (type == 1) {
		query = `
			{
				"title": "${title}",
				"image": "${other}"
			}
		`;
	}
	
	fetch("http://localhost:3000/api/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"x-access-token": token
		},
		body: query
	}).then(response => {
		return response.json();
	}).then(data => {
		popup(0, "Post Submitted")
		setTimeout(function(){
			window.location.href = "/";
		}, 2000);
	}).catch((error) => {
		console.log(error)
		popup(3, "Post Error")
	});
}

// Time Posted

function getTimePosted(time) {
	const timeNow = new Date()
	const timePosted = new Date(time)

	var diff = timeNow.getTime() - timePosted.getTime();
	var timeDifference = "";

	var yy = Math.round(diff / 1000 / 60 / 60 / 24 / 30 / 12);
	diff -= yy * 1000 * 60 * 60 * 24 * 30 * 12;
	if(yy > 0) {
		timeDifference += yy + " year";
	} else {
		var mo = Math.round(diff / 1000 / 60 / 60 / 24 / 30);
		diff -= mo * 1000 * 60 * 60 * 24 * 30;
		if (mo > 0) {
			timeDifference += mo + " month";
		} else {
			var dd = Math.round(diff / 1000 / 60 / 60 / 24);
			diff -= dd * 1000 * 60 * 60 * 24;
			if (dd > 0) {
				timeDifference += dd + " day";
			} else {
				var hh = Math.round(diff / 1000 / 60 / 60);
				diff -= hh * 1000 * 60 * 60;
				if (hh > 0) {
					timeDifference += hh + " hour";
				} else {
					var mm = Math.round(diff / 1000 / 60);
					diff -= mm * 1000 * 60;
					timeDifference += mm + " minute";
				}
			}
		}
	}
	if (timeDifference.slice(0, 2) != 1) {
		timeDifference += "s";
	}
	timeDifference += " ago";
	
	return timeDifference;
}

function convertVotes(total) {
	if (total > 999) {
		total = total.toString()
		total = total.slice(0, 2)
		return total.charAt(0) + "." + total.charAt(1) + "k";
	} else {
		return total;
	}
}

// Login Signup

function login() {
	var val1 = document.getElementById("username").value;
	var val3 = document.getElementById("password").value;

	const query = `
		{
			"username": "${val1}",
			"password": "${val3}"
		}
	`;
		
	fetch("http://localhost:3000/api/auth/signin", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		return response.json();
	}).then(data => {
		setCookie('token',JSON.stringify(data),7);
		popup(0, "Logged In")
		setTimeout(function(){
			window.location.href = "./";
		}, 2000);
	}).catch((error) => {
		console.log(error)
		popup(3, "Login Error")
	});
}

function signup() {
	var val1 = document.getElementById("username").value;
	var val2 = document.getElementById("email").value;
	var val3 = document.getElementById("password").value;

	const query = `
		{
			"username": "${val1}",
			"email": "${val2}",
			"password": "${val3}"
		}
	`;
		
	fetch("http://localhost:3000/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: query
	}).then(response => {
		return response.json();
	}).then(data => {
		setCookie('token',JSON.stringify(data),7);
		popup(0, "Account Created")
		setTimeout(function(){
			window.location.href = "./";
		}, 2000);
	}).catch((error) => {
		console.log(error)
		popup(3, "Signup Error")
	});
}

// Cookies

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	popup(0, "Logged Out")
	
	setTimeout(function(){
		location.reload();
	}, 2000);
}

// Generic

function scrollerTop() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}