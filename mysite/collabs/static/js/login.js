var username_is_valid;
var password_is_valid;

/* To Do:
	 Test AJAX requests and make sure they work
*/

$(document).ready(function() {

	username_is_valid = false;
	password_is_valid = false;

	function showButton() {

		if (username_is_valid && password_is_valid) {
			$(".button-bg").removeClass("greyed-out").addClass("gradient");
			$(".fancy-button").prop("disabled", false);
			$(".fancy-button").css("cursor", "pointer");
		} else {
			$(".button-bg").removeClass("gradient").addClass("greyed-out");
			$(".fancy-button").prop("disabled", true);
			$(".fancy-button").css("cursor", "context-menu");
		}

	}

	function validate_username() {

		var valid_username = /[^A-Za-z0-9@_+-.]+/;

		if ($("#name").val().length > 150) {
			username_is_valid = false;

		} else if ($("#name").val().length == 0) {
			username_is_valid = false;

		} else if (valid_username.test($("#name").val())) {
			username_is_valid = false;

		} else {
			username_is_valid = true;
		}
		showButton();
	}

	function validate_password() {

		if ($("#password").val().length < 8) {
			password_is_valid = false;

		} else if (!isNaN($("#password").val())) {
			password_is_valid = false;

		} else if ($("#password").val() == $("#email").val()) {
			password_is_valid = false;

		} else if ($("#password").val() == $("#name").val()) {
			password_is_valid = false;

		} else {
      password_is_valid = true;
    }
    showButton();
	}

	validate_username();
	validate_password();

	$("#name").on('input', function() { validate_username(); });
	$("#password").on('input', function() { validate_password(); });

});




