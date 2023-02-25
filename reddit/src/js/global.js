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
		if (!response.ok) {
			popup(2, "Post Error")	
		}
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

function loadPosts(query, dom) {
	
	var userstats = null;
	
	if (dom == undefined) {
		append_dom.innerHTML = "";
	} else {
		dom.innerHTML = "";
	}
	
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
		if (data.userstats) {
			userstats = data.userstats
		}
		
		if (data.length == 0) {
			temp = "";
			temp += `
				<div class="content-feed-post-each">
					<div class="post-each-main-details">
						<p>No Posts Found</p>
					</div>
				</div>
			`;
			if (dom !== null) {
				append_dom.insertAdjacentHTML("afterbegin", temp);
			} else {
				dom.insertAdjacentHTML("afterbegin", temp);
			}
		} else {
				data.posts.forEach(function(data) {

				var flagSaved = 0;
				var flagVoted = 0;

				data = replaceNull(data, 0)
				
				temp = "";
				temp += `
					<div class="content-feed-post-each" id=` + data._id + `>
						<div class="post-each-votes">`;

							if (userstats !== null) {
								for (let i = 0; i < userstats.upvoted.length; i++) {
									if (userstats.upvoted[i].postId == data._id) {
										flagSaved = 1;
									}
								}
								for (let i = 0; i < userstats.downvoted.length; i++) {
									if (userstats.downvoted[i].postId == data._id) {
										flagSaved = 2;
									}
								}
							}
														
							if (flagSaved == 1) {
								temp += `<img onclick="vote('upvote', 'post', '` + data._id + `')" class="upvote active" src="/icons/upvote.svg">`;
							} else {
								temp += `<img onclick="vote('upvote', 'post', '` + data._id + `')" class="upvote" src="/icons/upvote.svg">`;
							}
						
							temp += `<p class="votes">` + convertVotes(data.upvotes.length + 1 - data.downvotes.length) + `</p>`;
							
							if (flagSaved == 2) {
								temp += `<img onclick="vote('downvote', 'post', '` + data._id + `')" class="downvote active" src="/icons/downvote.svg">`;
							} else {
								temp += `<img onclick="vote('downvote', 'post', '` + data._id + `')" class="downvote " src="/icons/downvote.svg">`;
							}
							
							flagSaved = 0;
							
					temp += `
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
								`;

								if (userstats !== null) {
									for (let i = 0; i < userstats.saved.length; i++) {
										if (userstats.saved[i].postId == data._id) {
											flagSaved = 1;
										}
									}
								}
								
								temp += `
								<div onclick="savePost('` + data._id + `')">`;
								
								if (flagSaved == 0) {
									temp += `
										<img class="save" src="/icons/save.svg">
										<p>Save</p>
									</div>`;
								} else {
									temp += `
										<img class="save" src="/icons/saved.svg">
										<p>Saved</p>
									</div>`;
								}

								if (localStorage.getItem("username") == data.posterName) {
									temp += `
									<div onclick="deletePost('` + data._id + `')">
										<img class="delete" src="/icons/delete.svg">
										<p>Delete</p>
									</div>
									`;
								}
								
								temp +=`
							</div>
						</div>
					</div>
				`;

				if (dom == undefined) {
					append_dom.insertAdjacentHTML("afterbegin", temp);
				} else {
					dom.insertAdjacentHTML("afterbegin", temp);
				}
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

	if (token != null) {
		temp2 += `
		<div class="post-each-full-comments">
			<p>Comment as ` + localStorage.getItem("username") + `</p>
			<textarea maxlength="300" placeholder="Comment" rows="1" name="post_comment" id="post_comment"></textarea>
			<p onclick="postComment('global', '` + data._id + `')" class="generic-button" id="comment-submit-button">Comment</p>
		</div>
		`;
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
							</div>`;
							
							if (localStorage.getItem("username") == data.posterName) {
								temp += `
								<div onclick="deletePost('` + data._id + `')">
									<img class="delete" src="/icons/delete.svg">
									<p>Delete</p>
								</div>
								`;
							}
							
							temp += `
						</div>
					</div>
				</div>
				` + temp2 + `
				<div class="post-each-full-comments" id="post-each-full-comments">`;
	
	// Get Comment Thread
	data.comments.forEach(function(comment) {
		if ('posterId' in comment) {
			comment = replaceNull(comment, 0)
			
			temp += `
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
				<div class="comment-each-thread">
			`;
			
			temp += recurisveComments(comment);
			
			temp += `
				</div>
			</div>
			`;
		}
	})
				
	temp += `
		</div>
	</div>`;
	
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

function recurisveComments(obj) {
	var html = "";
	var currentChild = null;
	var result = null;

	if (obj.comments != null && obj.comments.length > 0) {
		for (let i = 0; i < obj.comments.length; i++) {
			currentChild = obj.comments[i];
			currentChild = replaceNull(currentChild, 0)

			result = recurisveComments(currentChild);
			
			if (result !== false && currentChild !== null && currentChild !== "") {
				html += `
				<div class="comment-each" comment="` + currentChild._id + `">
					<div class="comment-each-banner">
						<p>` + currentChild.posterName + ` • ` + (getTimePosted(currentChild.createdAt)) + `</p>
					</div>
					<div class="comment-each-content">
						<p>` + currentChild.comment + `</p>
					</div>
					<div class="comment-each-votes">
						<img onclick="vote('upvote', 'comment', '` + currentChild._id + `')" class="upvote" src="/icons/upvote.svg">
						<p class="votes">` + convertVotes(currentChild.upvotes.length + 1 - currentChild.downvotes.length) + `</p>
						<img onclick="vote('downvote', 'comment', '` + currentChild._id + `')" class="downvote" src="/icons/downvote.svg">
						<div onclick="postComment('thread', '` + currentChild._id + `')">
							<img class="comment" src="/icons/comment.svg">
							<p>Reply</p>
						</div>
					</div>
					<div class="comment-each-thread">
				`;
			}
		}
	}

	if (obj.comments.length > 0) {
		html += `
			</div>
		</div>
		`;		
	}

	return html;
}

// Delete Post 

function deletePost(id) {
	console.log("Deleting post with id: " + id)
	fetch("http://localhost:3000/api/posts/" + id, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"x-access-token": token
		}
	}).then(response => {
		if (response.ok) {
			console.log("Good")
		} else {
			throw err;
		}
		return response.json();
	}).then(data => {
		if (data.message == "Not Allowed") {
			popup(2, "Not Allowed")
		} else if (data.message == "Post Deleted") {
			popup(0, "Post Deleted")
			setTimeout(function(){
			window.location.href = "/";
			}, 2000);
		} else {
			popup(2, "Deleting Error")
		}
	}).catch((err) => {
		popup(2, "Deleting Error")
	});		
}

// Save Post

function savePost(id) {
	console.log("Saving post with id: " + id)
	
	fetch("http://localhost:3000/api/users/addSaved/" + id, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"x-access-token": token
		}
	}).then(response => {
		if (response.ok) {
			console.log("Good")
		} else {
			throw err;
		}
		return response.json();
	}).then(data => {
		if (data.message == "Post Saved") {
			popup(0, "Post Saved")
			document.getElementById(id).querySelector(".post-each-main-option > div:nth-child(4) > img").setAttribute("src", "/icons/saved.svg")
			document.getElementById(id).querySelector(".post-each-main-option > div:nth-child(4) > p").textContent = "Saved";
		} else if (data.message == "Post Unsaved") {
			popup(0, "Post Unsaved")
			document.getElementById(id).querySelector(".post-each-main-option > div:nth-child(4) > img").setAttribute("src", "/icons/save.svg")
			document.getElementById(id).querySelector(".post-each-main-option > div:nth-child(4) > p").textContent = "Save";
		} else {
			popup(2, "Saving Error")
		}
	}).catch((err) => {
		console.log(err)
		popup(2, "Saving Error")
	});	
}

// Vote

function vote(type, where, id) {
	console.log("Voting")
	var query = "";
	
	if (type == "downvote") {
		query = "http://localhost:3000/api/posts/postdownvote/" + id;
	} else if (type == "upvote") {
		query = "http://localhost:3000/api/posts/postupvote/" + id;
	}
	
	if (query != "" && token !== null) {
		fetch(query, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"x-access-token": token
			}
		}).then(response => {
			if (response.ok) {
				console.log("Good")
			} else {
				throw err;
			}
			return response.json();
		}).then(data => {
			
			var downvote = document.getElementById(id).querySelector(".post-each-votes .downvote")
			var upvote = document.getElementById(id).querySelector(".post-each-votes .upvote")
			var votes = document.getElementById(id).querySelector(".post-each-votes .votes")
			
			if (data.message == "Post Upvoted") {
				popup(0, "Post Upvoted")
				if (downvote.classList.contains("active")) {
					votes.textContent = parseInt(votes.textContent) + 2;
				} else {
					votes.textContent++;
				}
				upvote.classList.add("active")
				downvote.classList.remove("active")
			} else if (data.message == "Post Un Upvoted") {
				popup(0, "Post Un Upvoted")
				votes.textContent--;
				upvote.classList.remove("active")
			} else if (data.message == "Post Downvoted") {
				popup(0, "Post Downvoted")
				if (upvote.classList.contains("active")) {
					votes.textContent = parseInt(votes.textContent) - 2;
				} else {
					votes.textContent--;
				}
				upvote.classList.remove("active")
				downvote.classList.add("active")
			} else if (data.message == "Post Un Downvoted") {
				popup(0, "Post Un Downvoted")
				votes.textContent++;
				downvote.classList.remove("active")
			} else {
				popup(2, "Vote Error")
			}
		}).catch((err) => {
			console.log(err)
			popup(2, "Saving Error")
		});			
	}
}

// Comment in Thread

function postComment(type, id) {	
	console.log("Commenting to " + id)

	var commment = document.getElementById("post_comment").value
	var query = `
		{
			"comment": "${commment}"
		}
	`;
	
	fetch("http://localhost:3000/api/posts/postcomment/" + id, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"x-access-token": token
		},
		body: query
	}).then(response => {
		if (response.ok) {
			popup(0, "Comment Posted")
		} else {
			popup(2, "Comment Error")	
			throw err;
		}
		return response.json();
	}).then(data => {
		if (data.message == "Comment Posted") {
			temp = ""
			temp += `
			<div class="comment-each" comment="">
				<div class="comment-each-banner">
					<p>User</p>
				</div>
				<div class="comment-each-content">
					<p>` + commment + `</p>
				</div>
				<div class="comment-each-votes">
					<img onclick="vote('upvote', 'comment', '')" class="upvote" src="/icons/upvote.svg">
					<p class="votes">1</p>
					<img onclick="vote('downvote', 'comment', '')" class="downvote" src="/icons/downvote.svg">
					<div onclick="postComment('thread', '')">
						<img class="comment" src="/icons/comment.svg">
						<p>Reply</p>
					</div>
				</div>
				<div class="comment-each-thread">
				</div>
			</div>
			`;
			document.getElementById("post-each-full-comments").insertAdjacentHTML("afterbegin", temp);
		}
	}).catch((err) => {
		console.log(err)
		popup(2, "Comment Error")
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
		if (response.ok) {
			popup(0, "Post Submitted")
			setTimeout(function(){
			window.location.href = "/";
			}, 2000);
		} else {
			popup(2, "Post Error")
			throw err;
		}
		return response.json();
	}).catch((err) => {
		console.log(err)
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
	localStorage.removeItem('username');
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
		if (response.ok) {
			console.log("Good")
		} else {
			popup(2, "User Error")
			throw err;
		}
		return response.json();
	}).then(data => {
		if (data.message == "User not found") {
			popup(2, "User not found")
		} else if (data.message == "Invalid Password") {
			popup(2, "Invalid Password")
		} else {
			setCookie('token',JSON.stringify(data),7);
			localStorage.setItem("username", val1)
			localStorage.setItem("userId", data.userId)
			popup(0, "Logged In")
			setTimeout(function(){
				window.location.href = "./";
			}, 2000);	
		}
	}).catch((err) => {
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
		if (response.ok) {
			console.log("Good")
		} else {
			popup(2, "Signup Error")
			throw err;			
		}
		return response.json();
	}).then(data => {
		if (data.message == "User Created") {
			setCookie('token',JSON.stringify(data),7);
			localStorage.setItem("username", val1)	
			localStorage.setItem("userId", data.userId)
			popup(0, "Account Created")
			setTimeout(function(){
				window.location.href = "./";
			}, 2000);			
		} else if (data.message == "User Already Extists") {
			popup(2, "User already exists")
		} else if (data.message == "Email Already Extists") {
			popup(2, "Email already exists")
		}
	}).catch((err) => {
		popup(2, "Signup Error")
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