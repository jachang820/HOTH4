var email_valid = false;
var major_valid = false;
var username_valid = false;
var password_valid = false;

$(document).ready(function() {
	
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

		var step;

		// Prior steps
		for (i=1; i<stepnum; i++) {
			step = $("#step" + i);
			step.css('font-weight', 'normal');
			step.css('color', 'black');
			step.css('text-decoration', 'underline');
			step.css('font-style', 'normal');
			step.css('cursor', 'pointer');
			$("#signupsteps").on('click', "#step"+i, step_funcs[i]);
		}

		// Current step
		step = $("#step" + stepnum);
		step.css('font-weight', 'bold');
		step.css('color', 'black');
		step.css('text-decoration', 'none');
		step.css('font-style', 'normal');
		step.css('cursor', 'default');
		$("#signupsteps").off('click', '#step'+stepnum);

		// Next step
			if (stepnum < 3) {
			step = $("#step" + (stepnum+1));
			step.css('font-weight', 'normal');
			step.css('color', 'red');
			step.css('text-decoration', 'underline');
			step.css('font-style', 'normal');
			step.css('cursor', 'pointer');
			$("#signupsteps").on('click', '#step'+(stepnum+1), step_funcs[stepnum+1]);
		}

		// Last step
		if (stepnum < 2) {
			step = $("#step3")
			step.css('font-weight', 'lighter');
			step.css('color', 'gray');
			step.css('text-decoration', 'none');
			step.css('font-style', 'italic');
			step.css('cursor', 'default');
			$("#signupsteps").off('click', '#step3');
		}
	}

	function showStep1() { showStep(1); }
	function showStep2() { showStep(2); }
	function showStep3() { showStep(3); }

	showStep(1);

	// validation for email address
	$("#email").on('input', function() {

		$("#validate-email").text("");

		var valid_email = /[A-Za-z0-9!#$%^&*_+-=/?{}|~.]+@[A-Za-z0-9!@##$%^&*_+-=/?{}|~]+/;
		if (!valid_email.test($("#email").val())) {
		// test for @ symbol
			$("#validate-email").text("Email address is invalid.");

		} else if ($("#email").val().length == 0) {
			$("#validate-email").text("Email address is required.");

		} else {
		// server test
			var form = $(this).closest("form");
			$.ajax({
        url: form.attr("data-validate-email-url"),
        data: form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (data.is_taken) {
            $("#validate-email").innerText = "Email address has been taken.";
          } else if (!data.is_valid) {
          	$("#validate-email").innerText = data.errors.first();
          } else {
          	$("#validate-email").innerText = "";
          }
        }
      });
		}
		
	});


	// validation for photo
	$("#photo").on('change', function() {

		var valid_photo_ext = /{jpeg|jpg}$/;

		$("#validate-photo").text("");

		if (!valid_photo_ext.test($("#photo").val())) {
			$("#validate-photo").text("Only jpeg files supported.");
			$("#photo").val("");

		} else {
		// server test
			var form = $(this).closest("form");
			$.ajax({
        url: form.attr("data-validate-photo-url"),
        data: form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (!data.is_valid) {
            $("#validate-photo").innerText = data.errors.first();
            $("#photo").val("");
          } else {
          	$("#validate-photo").innerText = "";
          }
        }
      });
		}
	});


	// validation for username
	$("#name").on('input', function() {

		var valid_username = /[^A-Za-z0-9!^*_+-=.()]+/;

		$("#validate-username").text("");

		if ($("#name").val().length > 150) {
			$("#validate-username").text("Username must be 150 characters or less.");

		} else if ($("#name").val().length == 0) {
			$("#validate-username").text("Username is required.");

		} else if (valid_username.test($("#name").val())) {
			$("#validate-username").text("Username contains invalid characters. " + 
				"Must contain only A-Za-z0-9!^*_+-=.()");

		} else {
		// server test
			var form = $(this).closest("form");
			$.ajax({
        url: form.attr("data-validate-username-url"),
        data: form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (data.is_taken) {
            $("#validate-username").innerText = "Username has been taken.";
          } else {
          	$("#validate-username").innerText = "";
          }
        }
      });
		}
	});


	// validation for password
	$("#password").on('input', function() {

		$("#validate-password").text("");

		if ($("#password").val().length < 8) {
			$("#validate-password").text("Password is too short. Must be at least 8 characters.");

		} else if (!isNaN($("#password").val())) {
			$("#validate-password").text("Password cannot be entirely numeric.");

		} else if ($("#password").val() == $("#email").val()) {
			$("#validate-password").text("Password cannot be the same as your email.");

		} else if ($("#password").val() == $("#name").val()) {
			$("#validate-password").text("Password cannot be the same as your username.");

		} else {
		// server test
			var form = $(this).closest("form");
			$.ajax({
        url: form.attr("data-validate-password-url"),
        data: form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (!data.is_valid) {
          	$("#validate-password").innerText = data.errors.first();
          } else {
          	$("#validate-password").innerText = "";
          }
        }
      });
		}
		
	});

	// confirm password
	$("#pwConfirm").on('input', function() {

		$("#validate-confirm").text("");

		if ($("#pwConfirm").val() != $("#password").val()) {
			$("#validate-confirm").text("Password does not match.");
		}
	});

});




