$(document).ready(function() {
	
	function showStep(stepnum) {
		// Show the right page
		$("#signuppage1").hide();
		$("#signuppage2").hide();
		$("#signuppage3").hide();
		$("#signuppage" + stepnum).show();

		step_funcs = { 
			1: showStep1,
			2: showStep2,
			3: showStep3
		}

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
		step.off('click');

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
			step.off('click');
		}
	}

	function showStep1() { showStep(1); }
	function showStep2() { showStep(2); }
	function showStep3() { showStep(3); }

	showStep(1);
});




