/**
 * Created by yong1 on 2017. 04. 28
 */
function readyDonation() {
    $(document).ready(function () {
    $('#save').bind('click', function () {
        var donation_amount1 = $("#donation_amount1").val();
        var donation_amount2 = $("#donation_amount2").val();
        var donation_amount3 = $("#donation_amount3").val();
        if(donation_amount1 > 0 || donation_amount2 > 0 || donation_amount3 > 0 ){
            ONPANEL.Ajax.Request.invokePostByJSON(
                CONSTANTS.POINTMALL.DONATION_PROC
                , {
                    donation_amount1: donation_amount1
                    ,donation_amount2: donation_amount2
                    ,donation_amount3: donation_amount3
                }
                , function (data) {
                    if (ONPANEL.Ajax.Result.isSucess(data)) {
                        if (data.resultType == 'SUCCESS') {
                            $(location).attr('href', 'endDonation.html');
                        } else {
							alertLayer(data.resultMsg);
                           console.log(data.resultType+": "+data.resultMsg);
                        }
                    }
                    else {
						alertLayer(data.resultMsg);
                        console.log('WORRING: Request Fail');
                    }
                }
                , function (e,e2) {
                    console.log(e);
                    console.log(e2);
                }
                , true
            );
        }else{
            alertLayer('입력한 금액이 없습니다.');
            return false;
        }

    });

    $('.bt_btn').bind('click', function () {
       $('.'+$(this).attr('id')).toggle();
    });
        dataSetting();
        getUser(loadPointCallback);
    });
}
var loadPointCallback = function(data) {
    $('#member_point').text(COMMON.formatter.addComma(data.point));
};
function dataSetting(){
	 ONPANEL.Ajax.Request.invokePostByJSON(
                CONSTANTS.POINTMALL.DONATION
                , {
                }
                , function (data) {
                    if (ONPANEL.Ajax.Result.isSucess(data)) {
                        if (data.resultType == 'SUCCESS') {
                             console.log('data is : '+data.result);
							 $("#give_list").html(data.result.give_list);
							 $("#dct1").html(data.result.dct1);
							 $("#dct2").html(data.result.dct2);
							 $("#dct3").html(data.result.dct3);
							 $("#dpri1").html(data.result.dpri1);
							 $("#dpri2").html(data.result.dpri2);
							 $("#dpri3").html(data.result.dpri3);
                        } else {
                           console.log(data.resultType+": "+data.resultMsg);
                        }
                    }
                    else {
                        console.log('WORRING: Request Fail');
                    }
                }
                , function (e,e2) {
                    console.log(e);
                    console.log(e2);
                }
                , true
            );
}
