var firstname_is_valid;
var lastname_is_valid;
var email_is_valid;
var major_is_valid;
var username_is_valid;
var password_is_valid;
var confirm_is_valid;

/* To Do:
	 Test AJAX requests and make sure they work
*/

$(document).ready(function() {

	firstname_is_valid = false;
	lastname_is_valid = false;
	email_is_valid = false;
	major_is_valid = false;
	username_is_valid = false;
	password_is_valid = false;
	confirm_is_valid = false;
	
	// disable enter key on form
	$(document).keypress(
	  function(event){
	    if (event.which == '13') {
	      event.preventDefault();
	    }
	});

	function showStep(stepnum) {
		// Show the right page
		$("#signuppage1").hide();
		$("#signuppage2").hide();
		$("#signuppage3").hide();
		$("#signuppage" + stepnum).show();

		var step_funcs = { 
			1: showStep1,
			2: showStep2,
			3: showStep3
		}

		for(i=1; i<=3; i++) {

			var step_i = "#step" + i;
			var step = $(step_i);

			if (i < stepnum) {
				step.removeClass().addClass('prior-step');
				$("#signupsteps").on('click', step_i, step_funcs[i]);

			} else if (i == stepnum) {
				step.removeClass().addClass('current-step');
				$("#signupsteps").off('click', step_i);

			} else {
				var firstpage_is_valid = 
					firstname_is_valid && lastname_is_valid && email_is_valid;
				if ((i == 2 && firstpage_is_valid) || 
						(i == 3 && major_is_valid)) {
							step.removeClass().addClass('valid-step');
							$("#signupsteps").on('click', step_i, step_funcs[i]);
				
				} else {
					step.removeClass().addClass('invalid-step');
					$("#signupsteps").off('click', step_i);

				}

			} 

		}

		var lastpage_is_valid =
			username_is_valid && password_is_valid && confirm_is_valid;

		if (lastpage_is_valid) {
			$(".button-bg").removeClass("greyed-out").addClass("gradient");
			$(".fancy-button").prop("disabled", false);
			$(".fancy-button").css("cursor", "pointer");
		} else {
			$(".button-bg").removeClass("gradient").addClass("greyed-out");
			$(".fancy-button").prop("disabled", true);
			$(".fancy-button").css("cursor", "context-menu");
		}

	}

	function showStep1() { 
		validate_firstname();
		validate_lastname();
		validate_email();
	}

	function showStep2() { 
		validate_photo();
		validate_major();
	}
	
	function showStep3() { 
		validate_username();
		validate_password();
		validate_pwconfirm();
	}


	function validate_firstname() {

		if ($("#firstname").val().length == 0) {
			$("#validate-firstname").text("First name is required.");
			firstname_is_valid = false;
			showStep(1);

		} else {
			$("#validate-firstname").text("");
			firstname_is_valid = true;
			showStep(1);

		}
	}

	function validate_lastname() {

		if ($("#lastname").val().length == 0) {
			$("#validate-lastname").text("Last name is required.");
			lastname_is_valid = false;
			showStep(1);

		} else {
			$("#validate-lastname").text("");
			lastname_is_valid = true;
			showStep(1);

		}
	}

	function validate_email() {

		var valid_email = 
		/[A-Za-z0-9!#$%^&*_+-=/?{}|~.]+@[A-Za-z0-9!@##$%^&*_+-=/?{}|~]+.[A-Za-z0-9]{2,}/;
		if (!valid_email.test($("#email").val())) {
			$("#validate-email").text("Enter a valid email address.");
			email_is_valid = false;
			showStep(1);

		} else if ($("#email").val().length == 0) {
			$("#validate-email").text("Email address is required.");
			email_is_valid = false;
			showStep(1);

		} else {
		// server test
			var form = $("#email").closest("form");
			$.ajax({
				type: 'POST',
        url: form.attr("data-validate-email-url"),
        data: form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (data.is_taken) {
            $("#validate-email").text("Email address has been taken.");
          } else if (!data.is_valid) {
          	$("#validate-email").text(data.errors);
          	email_is_valid = false;

          } else {
          	$("#validate-email").text("");
          	email_is_valid = true;

          }
          showStep(1);
        }
      });
		}
	}

	function validate_photo() {

		var file = $("#photo").get(0).files[0];
		
		if (!file) {
			$("#validate-photo").text("Cancelled.");
			$("#photo").val("");

		} else if (file['type'] != "image/jpeg") {
			$("#validate-photo").text("Only jpeg files supported.");
			$("#photo").val("");

		} else if (file['size'] > 250000) {
			$("#validate-photo").text("Maximum size 250KB exceeded.");
			$("#photo").val("");

		} else {
		// server test
			var form = $("#photo").closest("form");
			var newform = new FormData(form.get(0));
			newform.append("photo", file);
			$.ajax({
				type: 'POST',
        url: form.attr("data-validate-photo-url"),
        data: newform,
        mimeType: "multipart/form-data",
        contentType: false,
        processData: false,
        cache: false,
        dataType: 'json',
        success: function (data) {
          if (!data.is_valid) {
            $("#validate-photo").text(data.errors);
            console.log("Invalid photo.");
            $("#photo").val("");

          } else {
          	console.log("Valid photo.");
          	$("#validate-photo").text("");

          }
        }
      });
		}
	}

	function validate_major() {

		if ($("#major").val() == "none") {
			$("#validate-major").text("Major is required.");
			major_is_valid = false;
			showStep(2);

		} else {
		// server test
			var form = $("#major").closest("form");
			$.ajax({
        url: form.attr("data-validate-major-url"),
        data: form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (!data.is_valid) {
            $("#validate-major").text("Please select a major from the list.");
            major_is_valid = false;

          } else {
          	$("#validate-major").text("");
          	major_is_valid = true;
          }
          showStep(2);
        }
      });
		}
	}

	function validate_username() {

		var valid_username = /[^A-Za-z0-9@_+-.]+/;

		if ($("#name").val().length > 150) {
			$("#validate-username").text("Username must be 150 characters or less.");
			username_is_valid = false;
			showStep(3);

		} else if ($("#name").val().length == 0) {
			$("#validate-username").text("Username is required.");
			username_is_valid = false;
			showStep(3);

		} else if (valid_username.test($("#name").val())) {
			$("#validate-username").text("Username contains invalid characters. " + 
				"Must contain only A-Za-z0-9@_+-.");
			username_is_valid = false;
			showStep(3);

		} else {
		// server test
			var form = $("#name").closest("form");
			$.ajax({
				type: 'POST',
        url: form.attr("data-validate-username-url"),
        data: form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (data.is_taken) {
            $("#validate-username").text("Username has been taken.");
            username_is_valid = false;

          } else {
          	$("#validate-username").text("");
          	username_is_valid = true;

          }
          showStep(3);
        }
      });
		}
	}

	function validate_password() {

		validate_pwconfirm();

		if ($("#password").val().length < 8) {
			$("#validate-password").text("Password is too short. Must be at least 8 characters.");
			password_is_valid = false;
			showStep(3);

		} else if (!isNaN($("#password").val())) {
			$("#validate-password").text("Password cannot be entirely numeric.");
			password_is_valid = false;
			showStep(3);

		} else if ($("#password").val() == $("#email").val()) {
			$("#validate-password").text("Password cannot be the same as your email.");
			password_is_valid = false;
			showStep(3);

		} else if ($("#password").val() == $("#name").val()) {
			$("#validate-password").text("Password cannot be the same as your username.");
			password_is_valid = false;
			showStep(3);

		} else {
		// server test
			var form = $("#password").closest("form");
			$.ajax({
				type: 'POST',
        url: form.attr("data-validate-password-url"),
        data: form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (!data.is_valid) {
          	$("#validate-password").text(data.errors);
          	password_is_valid = false;

          } else {
          	$("#validate-password").text("");
          	password_is_valid = true;

          }
          showStep(3);
        }
      });
		}
	}

	function validate_pwconfirm() {

		if ($("#pwConfirm").val() != $("#password").val()) {
			$("#validate-confirm").text("Password does not match.");
			confirm_is_valid = false;
			showStep(3);

		} else {
			$("#validate-confirm").text("");
			confirm_is_valid = true;
			showStep(3);

		}
	}

	// check all fields on load in case anything is cached
	validate_firstname();
	validate_lastname();
	validate_email();
	
	$("#firstname").on('input', function() { validate_firstname(); });
	$("#lastname").on('input', function() { validate_lastname(); });
	$("#email").on('input', function() { validate_email(); });
	$("#photo").on('change', function() { validate_photo();	});
	$("#major").on('change', function() { validate_major();	});
	$("#name").on('input', function() { validate_username(); });
	$("#password").on('input', function() { validate_password(); });
	$("#pwConfirm").on('input', function() { validate_pwconfirm(); });

});




