// Global Variables
var temp = null;
var profile_toggle = null;
var search_input = null;

// DOM
document.addEventListener("DOMContentLoaded", function(event) { 
	profile_toggle = document.getElementById("menu-profile")
	search_input = document.getElementById("search")
	
	profile_toggle.addEventListener("click", function() {
		profile_toggle.classList.toggle("show");
	});
	
	search_input.addEventListener('keypress', function(event) {
		if (event.which === 13) {
			searchForm()
		}
	});
});

// Functions
function searchForm() {
	temp = document.getElementById("search").value
	if(temp !== null && temp !== "") {
		window.location.href = "./search/?query=" + temp;
	}
}