$('.btn-show-pass').on('click', function(){
		
  if ($(this).next('input').attr('type') == "text") {
      $(this).next('input').attr('type', "password");
  } else {
      $(this).next('input').attr('type', "text");
  }
	    
});