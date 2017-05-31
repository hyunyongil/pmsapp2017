$(document).ready(function(){

	$('input[data-enter-reject]').keypress(function(event){
		if(event.keyCode == 13) {
			event.preventDefault();
			$(this).blur();
		}
	});

});