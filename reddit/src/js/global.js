// Global Variables
var temp = null;
var profile_toggle = null;
var search_input = null;
var append_dom = null;
var token = null;
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// DOM
document.addEventListener("DOMContentLoaded", function(event) {
	// Menu
	profile_toggle = document.getElementById("menu-profile")
	search_input = document.getElementById("search")
	
	profile_toggle.addEventListener("click", function() {
		profile_toggle.classList.toggle("show");
	});
	
	// Search
	search_input.addEventListener('keypress', function(event) {
		if (event.which === 13) {
			searchForm()
		}
	});
	
	// DOM
	append_dom = document.getElementById("content-feed-post-append");
	
	// Token
	token = getCookie("token")
	if (token !== null) {
		token = (JSON.parse(token))["token"]
	}
});

// Functions
function searchForm() {
	temp = document.getElementById("search").value
	if(temp !== null && temp !== "") {
		window.location.href = "./search/?query=" + temp;
	}
}

function loadPosts() {
	var query = "http://localhost:3000/api/posts/postsort/1";
	
	fetch(query, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		data.forEach(function(data) {
			temp = "";
			temp += `
				<div class="content-feed-post-each" id=` + data._id + `>
					<div class="post-each-votes">
						<img class="upvote" src="/icons/upvote.svg">
						<p class="votes">` + (data.upvotes - data.downvotes) + `</p>
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
	
	if (timeDifference.charAt(0) != 1) {
		timeDifference += "s";
	}
	timeDifference += " ago";
	
	return timeDifference;
}

function scrollerTop() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
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
}