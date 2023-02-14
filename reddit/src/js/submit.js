// Global Variables
var temp = null;
var submit_dom = null;
var post_dom = null;
var input_dom = null;
var post_type = 0;

// Listener
document.addEventListener("DOMContentLoaded", function(event) {
	submit_dom = document.getElementById("content-submit-button");
	post_dom = document.querySelectorAll("#content-submit-options > div");
	input_dom = document.querySelectorAll("#content-submit-fields > div");
	
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
	
	submit_dom.addEventListener("click", function() {
		temp = submitPost(document.getElementById("post_text_title").value,document.getElementById("post_text_description").value,post_type);
	});
});