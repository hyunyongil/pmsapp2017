
var DOM =
{
    getHidden : function (Name, Value)
	{
			var F = $("<input type='hidden' name='"+Name+"' id='"+Name+"' />");
			$(F).val(Value);
			return F;
	},
	
	getTitle : function (Title)
	{
		return $(document.createElement('div')).addClass('Title').html(Title);		
	},
	
	getDiv : function (formClass, formId)
	{
		return $(document.createElement('div')).attr('id', formId).addClass(formClass);		
	},
	
	getSpan : function (formClass, formId)
	{
		return $(document.createElement('span')).attr('id', formId).addClass(formClass);		
	},
		
	getTable : function (formClass, formId)
	{
			this.Table		= $(document.createElement('table')).attr({width:'100%', border:"0", cellSpacing:"0", cellPadding:"0"}).addClass(formClass);
			return this.Table;
	},
	
	getImage : function (src, formId )
	{
			this.Table		= $(document.createElement('img')).attr({src: survey.imgUrl+src, border:'0', id:formId});
			return this.Table;
	},
	
	appendRow : function (Th, Td)
	{
		this.Table = this.Table || this.getTable();
		
		var Th = Th || '';
		var Td = Td || '';
		
		this.Tr			= $(document.createElement('tr')).appendTo($(this.Table));
		//this.Tr.Th		= $(document.createElement('th')).attr( { width:"100", align:"right", scope:"row" }).html(Th).appendTo(this.Tr);
		this.Tr.Td		= $(document.createElement('td')).attr( { width:"", align:"left" }).append(Td).appendTo(this.Tr);
		return this.Tr;
		
	},
	
	getTr : function (formClass, formId)
	{
		this.Tr	= $(document.createElement('tr')).attr({id:formId}).addClass(formClass);
		return this.Tr;
	},
	
	getTd : function (formClass, formId, html)
	{
		this.Td	= $(document.createElement('td')).attr({id:formId}).addClass(formClass).append(html);
		return this.Td;
	},
	
	getUl : function (formClass, formId, html)
	{
		this.Td	= $(document.createElement('ul')).attr({id:formId}).addClass(formClass).append(html);
		return this.Td;
	},
	
	getLi : function (formClass, formId, html)
	{
		this.Td	= $(document.createElement('li')).attr({id:formId}).addClass(formClass).append(html);
		return this.Td;
	},
	
	appendLine : function (Th)
	{
		this.Table = this.Table || this.getTable();
		
		var Th = Th || '';
		
		this.Tr			= $(document.createElement('tr')).appendTo($(this.Table));
		this.Tr.Th		= $(document.createElement('td')).attr( { colspan: '2', align:"center"}).append(Th).appendTo(this.Tr);
		return this.Tr;
		
	},
	
    checkAll : function(checkBox, checkName)
    {

    	
    	if(isObject(checkName))
    	{
    		$(checkName).attr('checked', $(checkBox).attr('checked'));
    	}
    	else
    	{
	    	var CheckName = checkName || $(checkBox).attr('value');
	    	
	    	$("[name='"+CheckName+"']").attr('checked', $(checkBox).attr('checked') || false);
	    	
    	}
    },
    checkAll2 : function(checkBox, checkName)
    {
    	
	    	var CheckName = checkName;
	    	
	    	$("[name='"+CheckName+"']").attr('checked', $(checkBox).attr('checked') || false);

    },    
    
    buttonHanglePatch : function()
    {	
    	if(!IE7_) return;
    	$(':button,:submit').each(function()
    	{
   	 		if((/^[가-힣\s]+$/).test($(this).attr('value')))
    		$(this).css({ 'padding-top': '2px'} );
    		
    	});
    },
    
    
    checkAndNext : function(F, Len, Next)
    {
    	$(F).focus(function() { this.select();});
    	$(F).keyup(function() 
    	{
    		$(F).attr('value', $(F).attr('value').num());
    		if($(F).attr('value').length == Len)
    		{
    			if(isFunction(Next))	Next();
				else Next.focus();
			}
    	
    	});
    },
    
	getTextBox : function (name, value, len, msg)
	{
		var value 	= value || '';
		var len 	= len || '';
		var msg 	= msg || '';
		
		var Obj = { type : 'text' , name : name};
		
		if(len) Obj.len = len;
		if(msg) Obj.msg = msg;
		var Box = $(document.createElement('input')).attr(Obj).val(value);
		if(len) Box.addClass('NotNull');
		
		return Box;
	},
	
	getCheckBox : function (name, value, label, defaultValue)
	{
		var value 	= value || '';
		var label 	= label || '';
		
		var Obj = { type : 'checkbox' , name : name};
		if(value == defaultValue)
		Obj.checked = 'checked';
				
		var Box = $(document.createElement('input')).attr(Obj).val(value).addClass('radio_01');
		
		if(label) return $(document.createElement('label')).append(Box).append(label);
		return Box;
	},
	
	
	getRadioButton : function (name, value, label, defaultValue)
	{
		var value 	= value || '';
		var label 	= label || '';
		
		var Obj = { type : 'radio' , name : name};
		if(value == defaultValue)
		Obj.checked = 'checked';
				
		var Box = $(document.createElement('input')).attr(Obj).val(value).addClass('radio_01');
		
		if(label) return $(document.createElement('label')).append(Box).append(label);
		return Box;
	},
	
	getPasswdBox : function (name, value, len, msg)
	{
		var value 	= value || '';
		var len 	= len || '';
		var msg 	= msg || '';
		
		var Obj = { type : 'password' , name : name};
		
		if(len) Obj.len = len;
		if(msg) Obj.msg = msg;
		var Box = $(document.createElement('input')).attr(Obj).val(value);
		if(len) Box.addClass('NotNull');
		
		return Box;
	},
	
	getTextArea : function (name, value, formClass)
	{
		var value 	= value || '';
		
		var Obj = { name : name};
		
		var Box = $(document.createElement('textarea')).attr(Obj).val(value);
		if(formClass)
			Box.addClass(formClass);
		return Box;
	},
	
	
	getSelectBox : function (Name, Arr, Val)
	{
		 var Box = $(document.createElement('select')).attr({ name : Name });
		
		
		if(this.isNumber(Arr))
		{
			var Num = Arr;
			var Arr = {};
			for (var i=0; i<=Num; i++) Arr[i] = i;
		}
		
		for(var k in Arr)
		{
			var optVal = Arr[k];
			
			if($.isFunction(optVal)) continue;
			
			var Opt = $(document.createElement('option')).val(k).text(optVal).appendTo(Box);
			if(k == Val) Opt.attr('selected', 'selected');
		}
		
		return Box;
	},
	
	
	getHiddenBox : function (name, value)
	{
		var value 	= value || '';
		var Obj = { type : 'hidden' , name : name};
		var Box = $(document.createElement('input')).attr(Obj).val(value);
		return Box;
	},
	
	getSubmitBt : function (value)
	{
		var value = value || '';
		var Box = $(document.createElement('input')).attr({ type : 'submit' , name : 'submit'}).val(value)
		return Box;
	},
	
	getButton : function (value)
	{
		var value = value || '';
		var Box = $(document.createElement('input')).attr({ type : 'button'}).val(value)
		return Box;
	},
	
	getEtcObject : function (jData)
	{
		return $(document.createElement(jData.obj)).attr(jData.param);
	},
	
	isNumber : function (val) 
	{	
		var num = parseInt(val);
        if (isNaN(num)) 
        { 
        	return false;
        }
	    
        return true;
	}
	
};
