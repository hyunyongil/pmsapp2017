$(document).ready(function(){

    if(COMMON.token.get() == null){
		$("[href='#rightpanel1'].top_menu_btn").hide();
	}else{
        $("[href='#rightpanel1'].top_menu_btn").show();
    }

});