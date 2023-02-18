// Global Variables
var temp = null;
var body_dom = null;
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
	body_dom = document.getElementById("body")
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

async function loadPostById(id) {
	var query = "http://localhost:3000/api/posts/postid/" + id;

	const response = await fetch(query, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"		
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		if (data.length == 0) {
			popup(2, "Post Error")
		} else {
			return data;
		}
	});
	
	const awaiterjson = await response;
	return awaiterjson;
}

function loadPosts(query) {
	var headersdyn = null;
	
	if (token !== null) {
		headersdyn = {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"x-access-token": token
		}
	} else {
		headersdyn = {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}
	}
	
	fetch(query, {
		method: "GET",
		headers: headersdyn
	}).then(response => {
		return response.json();
	}).then(data => {
		if (data.length == 0) {
			temp = "";
			temp += `
				<div class="content-feed-post-each">
					<div class="post-each-main-details">
						<p>No Posts Found</p>
					</div>
				</div>
			`;
			append_dom.insertAdjacentHTML("afterbegin", temp);
		} else {
			data.forEach(function(data) {

				data = replaceNull(data, 0)
				
				temp = "";
				temp += `
					<div class="content-feed-post-each" id=` + data._id + `>
						<div class="post-each-votes">
							<img onclick="vote('upvote', 'post', '` + data._id + `')" class="upvote" src="/icons/upvote.svg">
							<p class="votes">` + convertVotes(data.upvotes.length + 1 - data.downvotes.length) + `</p>
							<img onclick="vote('downvote', 'post', '` + data._id + `')" class="downvote" src="/icons/downvote.svg">
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
								<div onclick="showPost('` + data._id + `')">
									<img class="comment" src="/icons/comment.svg">
									<p>` + data.comments.length + ` Comments</p>
								</div>
								<div>
									<img class="award" src="/icons/award.svg">
									<p>Award</p>
								</div>
								<div>
									<img class="share" src="/icons/share.svg">
									<p>Share</p>
								</div>
								<div onclick="savePost('` + data._id + `')">
									<img class="save" src="/icons/save.svg">
									<p>Save</p>
								</div>
							</div>
						</div>
					</div>
				`;
				append_dom.insertAdjacentHTML("afterbegin", temp);
			})
		}
	});
}

// Comment Post

async function showPost(id) {
	console.log("Showing post with id: " + id)
	var data = await loadPostById(id)
	
	data = replaceNull(data, 0)

	var temp2 = "";
	var temp3 = "";

	if (token != null) {
		temp2 += `
		<div class="post-each-full-comments">
			<p>Comment as ` + localStorage.getItem("username") + `</p>
			<textarea maxlength="300" placeholder="Comment" rows="1" name="post_comment" id="post_comment"></textarea>
			<p onclick="postComment(global, null)" class="generic-button" id="comment-submit-button">Comment</p>
		</div>
		`;
		temp3 += `<div class="post-each-full-comments">`; 
		data.comments.forEach(function(comment) {
			
			comment = replaceNull(comment, 0)
			
			temp3 += `
			<div class="comment-each" comment=` + comment._id + `>
				<div class="comment-each-banner">
					<p>` + comment.posterName + ` • ` + (getTimePosted(comment.createdAt)) + `</p>
				</div>
				<div class="comment-each-content">
					<p>` + comment.comment + `</p>
				</div>
				<div class="comment-each-votes">
					<img onclick="vote('upvote', 'comment', '` + comment._id + `')" class="upvote" src="/icons/upvote.svg">
					<p class="votes">` + convertVotes(comment.upvotes.length + 1 - comment.downvotes.length) + `</p>
					<img onclick="vote('downvote', 'comment', '` + comment._id + `')" class="downvote" src="/icons/downvote.svg">
					<div onclick="postComment('thread', '` + comment._id + `')">
						<img class="comment" src="/icons/comment.svg">
						<p>Reply</p>
					</div>
				</div>
			</div>
			`;
		})
		temp3 += `</div>`; 
	} else {
		temp2 += `
		<div class="post-each-full-comments">
			<p>Login to Comment</p>
		</div>
		`;
	}
	
	temp = "";
	temp += `
	<div class="post-each-full" id="post-each-full">
		<div class="content-wrap">
			<div class="content home">
				<div class="post-each-full-close" onclick="hidePost()">
					<img src="/files/icons/cross.png">
					<p>Close</p>
				</div>
				<div class="post-each-full-main">
					<div class="post-each-votes">
						<img onclick="vote('upvote', 'post', '` + data._id + `')"  class="upvote" src="/icons/upvote.svg">
						<p class="votes">` + convertVotes(data.upvotes.length + 1 - data.downvotes.length) + `</p>
						<img onclick="vote('downvote', 'post', '` + data._id + `')"  class="downvote" src="/icons/downvote.svg">
					</div>
					<div>
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
								<img class="award" src="/icons/award.svg">
								<p>Award</p>
							</div>
							<div>
								<img class="share" src="/icons/share.svg">
								<p>Share</p>
							</div>
							<div onclick="savePost('` + data._id + `')">
								<img class="save" src="/icons/save.svg">
								<p>Save</p>
							</div>
						</div>
					</div>
				</div>
				` + temp2 + `
				` + temp3 + `
			</div>
		</div>
	</div>
	`;
	
	body_dom.insertAdjacentHTML("afterbegin", temp);
	body_dom.classList.toggle("overflow-hidden")
	setTimeout(function(){
		document.getElementById("post-each-full").classList.add("opacity-1")
	}, 400);
}

function hidePost() {
	body_dom.classList.toggle("overflow-hidden")
	document.getElementById("post-each-full").classList.remove("opacity-1")
	setTimeout(function(){
		document.getElementById("post-each-full").remove()
	}, 400);
}

// Save Post

function savePost(id) {
	console.log("Saving post with id: " + id)
}

// Vote

function vote(type, where, id) {
	console.log("Voting")
}

// Comment in Thread

function postComment(type, id) {
	console.log("Commenting")	
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
		popup(2, "Post Error")
	});
}

// Replace Null for 0

function replaceNull(obj, replacer) {
	Object.keys(obj).forEach(function(key) {
		if(obj[key] === null) {
			obj[key] = [""];
		}
	})
	
	return obj;
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

// Log Out

function signout() {
	eraseCookie("token")
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
		if (data.message == "User not found") {
			popup(2, "User not found")
		} else if (data.message == "Invalid Password") {
			popup(2, "Invalid Password")
		} else {
			setCookie('token',JSON.stringify(data),7);
			localStorage.setItem("username", val1)
			popup(0, "Logged In")
			setTimeout(function(){
				window.location.href = "./";
			}, 2000);			
		}
	}).catch((error) => {
		console.log(error)
		popup(2, "Login Error")
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