(function($){


	$.fn.extend({
		
		onsolChart : function(options){
			var defaultOptions = {
				color : "#ff0000",
				per : 0.5,
				topText : undefined,
				bottomText : '30,000P'
			}
			var onsolChart = new OnsolChart(this);
			onsolChart.options = $.extend(defaultOptions,options);
			onsolChart.draw();

		}

	});




function OnsolChart(canvas){
		this.canvas = canvas[0];
	}

	OnsolChart.prototype.draw = function(){
		if(this.canvas.getContext){
			var ctx = this.canvas.getContext('2d');
			this.animatePerLine(0.0);
		}
	}

	OnsolChart.prototype.drawDefault = function(){
		var ctx = this.canvas.getContext('2d');
		var size = this.canvas.width/2 - 10;
		ctx.arc(this.canvas.width/2.0,this.canvas.height/2,size,0,(Math.PI/180)*360,false);
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#e6e6e6';
		ctx.stroke();

		if(this.options.topText == undefined){
		    var perText = Math.ceil(this.options.per*100);
console.log(perText);            
			ctx.fillStyle = this.options.color;
			ctx.textAlign = "start";
			ctx.font = "32px Nanum Barun Gothic";
			var text_width = ctx.measureText((perText)+'').width;
			ctx.font = "15px Nanum Barun Gothic";
			var per_width = ctx.measureText('%').width;

			var start_pos = this.canvas.width/2 - ((text_width + per_width)/2);
            
			ctx.font = "32px Nanum Barun Gothic";
			ctx.fillText(perText+'' ,start_pos+0,this.canvas.height/2-3);
			ctx.font = "14px Nanum Barun Gothic";
			ctx.fillText("%",start_pos+text_width+3,this.canvas.height/2-3);

		}else{
			ctx.fillStyle = this.options.color;
			ctx.font = "20px Nanum Barun Gothic";
			ctx.textAlign = "center";
			ctx.fillText(this.options.topText,this.canvas.width/2,this.canvas.height/2-8);
		}

		ctx.font = "15px Nanum Barun Gothic";
		ctx.textAlign = "center";
		ctx.fillText(this.options.bottomText,this.canvas.width/2,this.canvas.height/2+30);


	}
	
	OnsolChart.prototype.animatePerLine = function(cur,expire){
		expire = expire == undefined ? false : expire;
		var buffer = document.createElement('canvas');
		var _this = this;
		buffer.width = this.canvas.width;
		buffer.height = this.canvas.height;
		var ctx = this.canvas.getContext('2d');
		var bufContext = buffer.getContext('2d');
		var size = buffer.width/2 - 10;
		var end = 270+(360*cur);
		bufContext.beginPath();
		bufContext.arc(buffer.width/2.0,buffer.height/2,size,(Math.PI/180)*270,(Math.PI/180)*end,false);
		bufContext.lineWidth = 5;
		bufContext.lineCap = "round";
		bufContext.strokeStyle = this.options.color;
		bufContext.stroke();
		bufContext.closePath();
		start = cur;
		cur= cur+ 0.01;
 		ctx.clearRect(0, 0, buffer.width, buffer.height);
 		this.drawDefault();
		this.canvas.getContext('2d').drawImage(buffer,0,0);
		if(expire) return;
		if(cur > this.options.per){
			this.animatePerLine(this.options.per,true);
			return;
		}
		setTimeout(function(){
			_this.animatePerLine(cur);
		},15);
	}


})(jQuery)


	