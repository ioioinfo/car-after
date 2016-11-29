	$(function(){
		$('.sidemenu').mousedown(
		function () {
			$('.sidebox').show('fast');
		});
	
		$('.sidebox > span').mousedown(function () {
			$('.sidebox').css('display','none')
		})
		$('.sidebox li').click(function () {
			$('.sidebox').hide();
		})

		$('.m-left li').hover(function(){
			$(this).css("background","#eee");
		},function(){
			$(this).css("background","none");
		})

		//菜单折叠效果
		$('.m-left h2').toggle(
		  function () {
		    $(this).removeClass("close").addClass("open");
			$(this).next().hide('fast');
		  },
		  function () {
			$(this).removeClass("open").addClass('close');
			$(this).next().show('fast');
		  }
		);

		//计算购物车金额
		alltotal();

		//唤出弹窗并载入数据
		$('.m-left ul li').click(function () {
		$id = $(this).attr('id');
		$this = $(this);
			$.post(domain+"/orderonline/checkoptentime.php",//异步处理动态页面
		   {accountid: getCookie("accountid")},
		    
         	function(data){
		    //alert(data);
			if(data=="true")
			{
			$('.shadow').fadeTo(300,.5);
			
			//ajax获取商品数据
			$.ajax({
				type: "GET",
				url: "show.php",
				data: "id="+$id,
				global: false,
				beforeSend: function(){
					$this.prepend("<img class = 'wait' style = 'position:absolute;margin:-2px 0 0 290px;z-index:9999;' src = '../templates/default/images/wait.gif'/>");
				},
				success: function(html){
					//输出html
					//弹窗跟随移动
					var itemboxoffset = $('.item-box').offset(); 
					$itembox_margintop = $(window).scrollTop() + 100;
					$('.a-content').html("");
					$('.item-box').css("marginTop",$itembox_margintop).fadeTo(300,1);
					$(window).scroll(function() {
						if ($(window).scrollTop() > 100) { 
							$('.item-box').css({marginTop: $(window).scrollTop() + 100}); 
						}else{
							$('.item-box').css({marginTop: 100});
						}
					});
					if(html){
						$('.wait').remove();
						$('.a-content').html(html);
						$('.type').click(function(){
							if($(this).attr('value') == 1){
								$('.up_sel').show();
							}else{
								$('.up_sel').hide();
							}
						});
					}else{
						$('.a-content').html('sorry...');
					}
				}
			});
			}
			else if(data=="close")
			{
				alert("Sorry, the online store is closed today.");
			}
			else
			{
				alert("Sorry, we do not take order now. the online order hour is："+data);
			}
			});	
		});

		$('.add-item h2 span,.shadow').click(
			function () {
				$('.item-box').hide('');
				$('.shadow').hide();
		});
		
		//删除购物车条目
		$('.cart-holder table tr .del').live('click',function(){
			$id = $(this).parent('tr').attr('id');
			$.get(domain+"/orderonline/del.php", { id: $id},function(data){
				$('.cart-holder table #'+$id).remove();
				alltotal();
			});
		});

		//运送方式
		if(getCookie('dtype') != 'undefined' && getCookie('dtype') != false){
			$dtype = getCookie('dtype');
			$('.radio_dtype input[name=dtype]').attr('checked',false);
			$('#'+$dtype).attr('checked',true);
			alltotal();
		}else{
			$dtype = $('.radio_dtype input[name=dtype]:checked').attr('id');
			setCookie('dtype',$dtype);
		}
		$('.radio_dtype input[name=dtype]').click(function(){
			$dtype = $(this).attr('id');
			setCookie('dtype',$dtype);
		});
		
		//添加购物车
		$('.f-right button').live("click",function(){
			//alert("test");
			$id = $(this).attr('id');
			//$optionCount = parseInt($(this).attr('name'));
			$option=$(this).attr('name');
			//alert($option);
			$arrName=$(this).attr('name').split('%');
			$arrIsAdd=$arrName[1].split('|');
			$arroption = $arrName[0].split('|');
			$optionCount = parseInt($arroption[0]);
			$strOption="";
			$strisAdd="";
			if($optionCount>0)
			{
				for(var i=0;i<$arrIsAdd.length;i++)
				{
					if($strisAdd=="")
					{
						$strisAdd=$arrIsAdd[i];
					}
					else
					{
						$strisAdd="|"+$arrIsAdd[i];
					}
				}
			}
			for(var i=0;i<$arroption.length;i++)
			{
				if(i==0)
				 continue;
				 //alert($arroption[i]);
				 if($arroption[i]==1)
				 {
					    var str="";
						$("[name="+(i-1)+"][checked]").each(function(){
						if(str=="")
						{
							str=$(this).attr('id');
						}
						else
						{
							str+=":"+$(this).attr('id');
						 }
						 });
				    if(str=="")
						continue;
						//alert("1");
					if($strOption=="")
					{
						$strOption=str+"*1";
					}
					else
					{
						$strOption+="%"+str+"*1";
					}
				 }
				else
				{
					if($('input[name='+(i-1)+']:checked').attr('id')==null)
						continue;
						//alert("2");
					if($strOption=="")
					{
						$strOption=$('input[name='+(i-1)+']:checked').attr('id')+"*2";
					}
					else
					{
						$strOption+="%"+$('input[name='+(i-1)+']:checked').attr('id')+"*2";
					}
				}
			}
		    //alert($strOption);
			$type = $('input[name=type]:checked').val();
			$qty = $('#qty option:selected').val();
			$rice = "";
			$soup = "";
			$note = $('textarea[name=note]').val();
			switch ($type){
				case '0':
					$rice = "&rice="+$('input[name=rice_sel]:checked').val();
				break;

				case '1':
					$rice = "&rice="+$('input[name=rice_sel]:checked').val();
					$soup = "&soup="+$('input[name=up_sel]:checked').val();
				break;

				case '2':
					$rice = "&rice="+$('input[name=rice_sel]:checked').val();
				break;
			}
			
			//alert($strOption);
			var idNamecart="#"+$('#cart_title').attr("title");
			var idNamecartPost=$('#cart_title').attr("title");
			if(idNamecartPost==""||idNamecartPost==null)
			{
				idNamecartPost="";
			}
			var seatTitleName=$(idNamecart).text();
			if(seatTitleName==""||seatTitleName==null)
			{
				seatTitleName="";
			}
			//alert(seatTitleName);
			//ajax获取商品数据
			$.ajax({
				type: "POST",
				url: "cart.php",
				data: "id="+$id+"&type="+$type+"&qty="+$qty+"&note="+$note+$rice+$soup+"&Option="+$strOption+"&seatid="+idNamecartPost+"&seatTitleName="+seatTitleName+"&isadd="+$strisAdd,
				global: true,
				beforeSend: function(){
					$('.wait').show();
				},
				success: function(html){
					//输出html
					if(html)
					{
					 var str=html.substring(0,1);//判断是否有午餐
					 var d = new Date()
					 var times=d.getHours();
					if(str=="1" && (times>=16 || times<11))
						{
							if(window.confirm('Lunch Special is from 11:00 am to 4:00 pm, do you want book Lunch for tomorrow?'))
							{
								$('.wait,.shadow,.item-box').hide();
								$('#cart_title').next('.cart_notip').hide();
								//$('.cart-holder table').append(html.substring(1));
								if($('#cart_title').attr("title")==null)
								{
									$('.cart-holder table').append(html.substring(1));
								}
								else
								{
									var idName="#"+$('#cart_title').attr("title");
									$(idName).after(html.substring(1));
								}
								alltotal();
							  }
							  else
							  {
							     var countid=getCookie("buy_total");
							     delCookie("cart_goods["+countid+"][oid]");
								 delCookie("cart_goods["+countid+"][id]");
								 delCookie("cart_goods["+countid+"][type]");
								 delCookie("cart_goods["+countid+"][note]");
								 delCookie("cart_goods["+countid+"][qty]");
								 delCookie("cart_goods["+countid+"][rice]");
								 delCookie("cart_goods["+countid+"][soup]");
								 countid-=1;
								 setcookie("buy_total", countid,0,'/');
							     $('.wait,.shadow,.item-box').hide();
								 $('#cart_title').next('.cart_notip').hide();
							 }
						}
						else
						{
								$('.wait,.shadow,.item-box').hide();
								$('#cart_title').next('.cart_notip').hide();
								//alert($('#cart_title').attr("title"));
								if($('#cart_title').attr("title")==null || $('#cart_title').attr("title")=="")
								{
									$('.cart-holder table').append(html.substring(1));
								}
								else
								{
									var idName="#"+$('#cart_title').attr("title");
									$(idName).after(html.substring(1));
								}
								alltotal();
						}
					}
					else{
						$('.wait').hide();
						$('.a-content').html('sorry...');
					}
				}
			});
		});
		
		//提交订单，判断表单
		$('#SubmitOrder').submit(function(){
			alert("测试");
			return false;
		});

		//提交订单
		$('.cart-holder .checkout_btn').click(function(){
			if(getCookie('buy_total') > 0 ){
				if($('input[name=dtype]:checked').length > 0){
					$price = $('.cart-holder .total p').eq(0).find('span').html();
					$price = $price.replace("$","");
					$minmoney=parseFloat(getCookie("minmoney"));
					//alert($price);
					if($price >= $minmoney || $('input[name=dtype]:checked').attr('id') == 'pickup'){
						window.location.href = "../user/?web=3";
					}else{
						alert('Delivery Minimum: $'+$minmoney+' (Before tax)');
					}					
				}else{
					alert('Pickup or Delivery?');
				}
			}else{
				alert('Shopping Cart is empty!');
			}
		});
		
		//点击分单标题
		$('.cart-holder tr').click(function(){
			$tr=$(this);
			if($tr.attr("id").indexOf("seatName")>0)
			{
				if($("#cart_title").attr("title")==$tr.attr("id"))
					return;
				var $seatnameidtemp="#"+$("#cart_title").attr("title");
				//alert(seatnameidtemp);
				if($("#cart_title").attr("title")!=null)
				{
					$td=$($seatnameidtemp).find("td");
					
					for($i=0;$i<$td.size();$i++)
					{
						if($i==0)
						{
							$td.eq($i).removeClass();
							$td.eq($i).addClass("seatItemPrice");
						}
						else if($i==1)
						{
							$td.eq($i).removeClass();
							$td.eq($i).addClass("seatPrice");
						}
						else
						{
							$td.eq($i).removeClass();
							$td.eq($i).addClass("seatDel");
						}
					}
				}
				
				$td=$($tr).find("td");
				//alert($td.size());
				for($i=0;$i<$td.size();$i++)
				{
					if($i==0)
					{
						$td.eq($i).removeClass();
						$td.eq($i).addClass("seatItemSelected");
					}
					else if($i==1)
					{
						$td.eq($i).removeClass();
						$td.eq($i).addClass("seatPriceSelected");
					}
					else
					{
						$td.eq($i).removeClass();
						$td.eq($i).addClass("seatDelSelected");
					}
				}
				$("#cart_title").removeAttr("title");
				$("#cart_title").attr("title",$tr.attr("id"));
			}
		});
		
			//新增seat
		$('.cart-holder .addseat_btn').click(function(){
			   var name=prompt("name for seats","seat 1");//将输入的内容赋给变量 name ，
				if(name)//如果返回的有内容
				{
						$('#cart_title').next('.cart_notip').hide();
						var id= $('.seat').last().attr("id");
						var idtemp= $('.seatSelected').last().attr("id");
						//alert(id);
						if(id==null && idtemp==null)
						{
							id=1;
						}
						else
						{
							if(id==null && idtemp!=null)
							{
								//alert('1');
								id=parseInt(idtemp.substring(0,1))+1;
							}
							else if(idtemp==null && id!=null)
							{
								//alert('2');
								id=parseInt(id.substring(0,1))+1;
							}
							else if(idtemp!=null && id!=null)
							{
								//alert('3');
								id=parseInt(id.substring(0,1))+1;
								idtemp=parseInt(idtemp.substring(0,1))+1;
								if(idtemp>id)
								{
									id=idtemp;
								}
							}
						}
						//alert(id);
					var timestamp = (new Date()).valueOf();
					var nameid=id.toString()+"seatName"+timestamp;
					var moneyid=id.toString()+"seatName"+timestamp+"id";
					var seatnameidtemp="#"+$("#cart_title").attr("title");
					if(seatnameidtemp!=null)
					{
						//$(seatnameidtemp).removeClass();
						$td=$(seatnameidtemp).find("td");
						for($i=0;$i<$td.size();$i++)
						{
							if($i==0)
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatItemPrice");
							}
							else if($i==1)
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatPrice");
							}
							else
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatDel");
							}
						}
						//$(seatnameidtemp).addClass("seat");
					}
					var delNameID=nameid+"del";
					$('.cart-holder table').append("<tr id='"+nameid+"'><td class='seatItemSelected'>"+name+"</td><td class='seatPriceSelected' colspan=2 id='price'></td><td id='delseatItem' class='seatDelSelected'><img src = '../templates/default/images/delete_icon.png' /></td></tr>");
					var seatnameid="#"+nameid;
					$(seatnameid).click(function(){
						var tr = $(this);
						
						var seatnameidtemp="#"+$("#cart_title").attr("title");
						$td=$(seatnameidtemp).find("td");
						for($i=0;$i<$td.size();$i++)
						{
							if($i==0)
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatItemPrice");
							}
							else if($i==1)
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatPrice");
							}
							else
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatDel");
							}
						}
						$("#cart_title").removeAttr("title");
						$("#cart_title").attr("title",tr.attr("id"));
						//$(tr).removeClass();
						//$(tr).addClass("seatSelected");
						
						$td=$(tr).find("td");
						for($i=0;$i<$td.size();$i++)
						{
							if($i==0)
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatItemSelected");
							}
							else if($i==1)
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatPriceSelected");
							}
							else
							{
								$td.eq($i).removeClass();
								$td.eq($i).addClass("seatDelSelected");
							}
						}
						//alert($("#cart_title").attr("title"));
					});
					
					$("#delseatItem").click(function(){
						$id = $(this).parent('tr').attr('id');
						$.get(domain+"/orderonline/delSeatItem.php", { seartid: $id},function(data){
						$('#'+$id).remove();
						if(data!=null||data!="")
						{
							//alert(data);
							var strs= new Array(); //定义一数组
							strs=data.split(","); //字符分割      
							for (i=0;i<strs.length;i++ )    
							{    
								$('.cart-holder table #'+strs[i]).remove();
							} 
						}
						alltotal();
						});
					});
					 
					$("#cart_title").removeAttr("title");
					$("#cart_title").attr("title",nameid);
					//setcookie(nameid, name);
				}
		});
		
		//删除分单
		$("#delseatItem").live("click",function(){
		        //alert('aa');
				$id = $(this).parent('tr').attr('id');
				//alert($id);
				$.get(domain+"/orderonline/delSeatItem.php", { seartid: $id},function(data){
				$('#'+$id).remove();
				
				if(data==""||data==null)
				{
					//alert(data);
				}
				else
				{
					//alert(data);
					var strs= new Array(); //定义一数组
					strs=data.split(","); //字符分割      
					for (i=0;i<strs.length;i++ )    
					{    
						$('.cart-holder table #'+strs[i]).remove();
					} 
				}
				//alert(data);
				$("#cart_title").removeAttr("title");
				//alert($("#delseatItem").size());
				if($("#delseatItem").size()>0)
				{
					$("#cart_title").attr("title",$("#delseatItem:first").parent('tr').attr('id'));
				}
				alltotal();
			});
		});

		//支付方式
		$('input[name=pay1]').click(function(){
			if($(this).val() == 1){
				$('.card').show();
			}else{
				$('.card').hide();
			}
		});

		/** side_top随浏览器滚动 **/
		var $sidebar = $(".side_top"); 
		$window = $(window); 
		var offset = $sidebar.offset(); 
		var topPadding = 10;
		$sidebar.css('marginTop',0);
		
		$window.scroll(function() { 
			
			if($('.cart-holder').height() < $window.height()){
				setTimeout(scroll,500);
			}else{
				$sidebar.stop().animate({
					marginTop: 0
				},500);
			}

			function scroll(){
				//$('.spice').html($window.scrollTop())
				//if ($window.scrollTop() > offset.top) { 
					//$sidebar.stop().animate({
						//marginTop: $window.scrollTop() - offset.top +topPadding
					//},500); 
				//}else{
					//$sidebar.stop().animate({
						//marginTop: 0
					//},500);
				//}
			}
		});

	// 购物车全屏遮罩
	$('.shadow').height($(document).height());

	//计算总价及税费
	function alltotal(){
		$alltotal = new Array();
		$alltotal['price'] = 0.00;
		$allSeatTotal = new Array();
		$allSeatTotal['price']=0.00;
		for($i=0;$i<=$('.cart-holder table tr[id!=cart_title]').size();$i++){
			$allSeatTotal['price']=0.00;
			$tr=$('.cart-holder table tr[id!=cart_title]').eq($i).find('.qty').html();
			if($tr==null)
			{
				$trid=$('.cart-holder table tr[id!=cart_title]').eq($i).attr("id");
				//alert($trid);
				if(!$trid && typeof($trid)!="undefined" && $trid!=0)
				{
					;
				}
				else
				{
					//alert("test");
					$tdclass="."+$trid;
					//alert($($tdclass).size());
					for($t=0;$t<$($tdclass).size();$t++)
					{
						//$allSeatTotal['price']=0.00;
						$allSeatTotal['price']=$allSeatTotal['price']+($($tdclass).eq($t).find('.qty').html() * $($tdclass).eq($t).find('.price').find('b').html());
					}
					$allSeatTotal['tax'] = $allSeatTotal['price'] * 0.082;
					$allSeatTotal['tax'] = $allSeatTotal['tax'].toFixed(2);
					$allSeatTotal['all'] = Number($allSeatTotal['tax']) + Number($allSeatTotal['price']);
					$allSeatTotal['all'] = $allSeatTotal['all'].toFixed(2);
					//alert($allSeatTotal['all']);
					$('.cart-holder table tr[id!=cart_title]').eq($i).children("#price").text("$"+$allSeatTotal['all']);
				}
				continue;
			}
			//alert($a);
			$alltotal['price'] = $alltotal['price'] + ($('.cart-holder table tr[id!=cart_title]').eq($i).find('.qty').html() * $('.cart-holder table tr[id!=cart_title]').eq($i).find('.price').find('b').html());
		}
		
		$sendmoney=getCookie("sendmoney");
		if(getCookie("issendmeals")=="1")
		{
			$sendtax=$sendmoney * 0.082;
			//$alltotal['sendmoney']=Number($sendmoney);
		}
		//alert($sendmoney);
		$alltotal['price']=$alltotal['price'].toFixed(2)
		$alltotal['sendmoney']=$sendmoney;
		$alltotal['tax'] = $alltotal['price'] * 0.082;
		$alltotal['tax'] = $alltotal['tax'].toFixed(2);
		$alltotal['all'] = Number($alltotal['tax']) + Number($alltotal['price']);
		
		
		
		$('.cart-holder .total p').eq(0).find('span').html("$"+$alltotal['price']);
		$('.cart-holder .total p').eq(1).find('span').html("$"+$alltotal['tax']);
		//alert($('input[name=dtype]:checked').attr('id'));
		//alert("test");
		if(Number($sendmoney)>0 && Number($alltotal['all'])>Number($sendmoney) && $('input[name=dtype]:checked').attr('id') != 'pickup')
		{
			$('.cart-holder .total p').eq(2).find('span').html("$"+$alltotal['sendmoney']);
			if(getCookie("issendmeals")=="1")
			{
				$alltotal['all'] = Number($alltotal['all']) + Number($alltotal['sendmoney'])+Number($sendtax);
			}
			else
			{
				$alltotal['all'] = Number($alltotal['all']) + Number($alltotal['sendmoney']);
			}
		}
		else
		{
			$('.cart-holder .total p').eq(2).find('span').html("Free");
			//$alltotal['all']="0.00";
		}
		$alltotal['all'] = $alltotal['all'].toFixed(2);
		$('#totalPrice').attr('value',$alltotal['all']);
		//alert($('#totalPrice').attr('value'));
		$('.cart-holder .total p').eq(3).find('strong').html("$"+$alltotal['all']);
	}
	
		//自取与送切换
	 $('input[type=radio][name=dtype]').change(function() {
       alltotal();
    });


	//cookie存储
	function setCookie(name,value){//两个参数，一个是cookie的名子，一个是值
		var Days = 30; //此 cookie 将被保存 1 天
		var exp  = new Date();    //new Date("December 31, 9998");
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/;";
	}

	//cookie读取
	function getCookie(name){
		var strCookie=document.cookie;
		var arrCookie=strCookie.split("; ");
		for(var i=0;i<arrCookie.length;i++){
			var arr=arrCookie[i].split("=");
			if(arr[0]==name){
				return unescape(arr[1]);
			}
		}	
		return false;
	}

	//删除cookie
	function delCookie(name){
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval=getCookie(name);
	    document.cookie= name + "="+name+";expires="+exp.toGMTString()+";path=/;";;
	}
	
	$("#couponid").blur(function () { 
				$coupontextid=$("#couponid").val();
				if($coupontextid=="")
				{
					$("#trcouponName").attr("style","display:none");
				}
				else
				{
				//alert($coupontextid);
					$.ajax({
					type: "POST",
					url: "CheckCoupon.php",
					data: "id="+$coupontextid,
					global: true,
					success: function(back){
						$("#trcouponName").attr("style","display:'',color:red");
						if(back=="no")
						{
							$("#couponName").text("Coupon code is invalid. Please try another");
						}
						else
						{
							$("#couponName").text("you got "+back);
						}
					}
					});
			}
	} );
	
		$("#customName").blur(function () { 
			$cusName=$('#customName').val();
			if($cusName=="")
			{
				$("#trcustomeName").attr("style","display:'',color:red");
				$("#tipcustomeName").text("Name can not be empty");
			}
			else
			{
				$("#trcustomeName").attr("style","display:none");
			}
	} );
	
	$("#customAddress").blur(function () { 
			$cusAddress=$('#customAddress').val();
			if($cusAddress=="")
			{
				$("#trcustomAddress").attr("style","display:'',color:red");
				$("#tipcustomAddress").text("Address can not be empty");
			}
			else
			{
				$("#trcustomAddress").attr("style","display:none");
			}
	});
	/*
	      $("#customZip").blur(function () { 
			$cusZip=$('#customZip').val();
			if($cusZip=="")
			{
				$("#trcustomZip").attr("style","display:'',color:red");
				$("#tipcustomZip").text("Zip can not be empty");
			}
			else
			{
				$("#trcustomZip").attr("style","display:none");
			}
	});*/
	
		$("#customPhone").blur(function () { 
			$cusPhone=$('#customPhone').val();
			if($cusPhone=="")
			{
				$("#trcustomPhone").attr("style","display:'',color:red");
				$("#tipcustomPhone").text("Phone can not be empty");
			}
			else
			{
				var p1 = /^(\d{10})$/;
				if (p1.test($cusPhone))
				{
					//alert("test");
					$("#trcustomPhone").attr("style","display:none");
				}
				else
				{
					$("#trcustomPhone").attr("style","display:'',color:red");
					$("#tipcustomPhone").text("Incorrect telephone,e.g:8328888888");
				}
			}
	});
	
	$('#lbdate').change(function(){ 
	
     var checkedValue=$("#lbdate ").val();
     $("#lbtime").empty();
	 if(checkedValue=="Today")
	 {
		var d = new Date();
		d.setMinutes(d.getMinutes()+40);
		var hour=d.getHours();
		var minute=d.getMinutes();
		var minuteTemp=0;
		
		if(minute>0 && minute<=15)
		{
			minuteTemp=15;
			//d=new Date(d.getFullYear(),d.getDate(),d.getDay(),hour,15);
		}
		else if(minute>15 && minute<=30)
		{
			minuteTemp=30;
			//d=new Date(d.getFullYear(),d.getDate(),d.getDay(),hour,15);
		}
		
		else if(minute>30 && minute<=45)
		{
			minuteTemp=45;
			//d=new Date(d.getFullYear(),d.getDate(),d.getDay(),hour,15);
		}
		else if(minute>45)
		{
			minuteTemp=0;
			hour=hour+1;
			//d=new Date(d.getFullYear(),d.getDate(),d.getDay(),hour,15);
		}
		d=new Date(d.getFullYear(),d.getDate(),d.getDay(),hour,15);
		var strTime;
		if(d.getHours()>0 && d.getHours()<12)
		{
			if(d.getMinutes()>0)
			{
				strTime=d.getHours()+":"+d.getMinutes()+" AM";
			}
			else
			{
				strTime=d.getHours()+":0"+d.getMinutes()+" AM";
			}
		}
		else
		{
			var temphour=d.getHours()-12;
			if(d.getMinutes()>0)
			{
				strTime=temphour+":"+d.getMinutes()+" PM";
			}
			else
			{
				strTime=temphour+":0"+d.getMinutes()+" PM";
			}
		}
		
		
		$("#lbtime").append("<option value ="+strTime+">"+strTime+"</option>");  
		for(var i=0;i<60;i++)
		{
			d.setMinutes(d.getMinutes()+15);
			if(d.getHours()>0 && d.getHours()<12)
			{
				if(d.getMinutes()>0)
				{
					strTime=d.getHours()+":"+d.getMinutes()+" AM";
				}
				else
				{
					strTime=d.getHours()+":0"+d.getMinutes()+" AM";
				}
			}
			else
			{
					var temphour=d.getHours()-12;
					if(d.getMinutes()>0)
					{
						strTime=temphour+":"+d.getMinutes()+" PM";
					}
					else
					{
						strTime=temphour+":0"+d.getMinutes()+" PM";
					}
			}
			$("#lbtime").append("<option value ="+strTime+">"+strTime+"</option>");
			if(d.getHours()==23)
			{
				break;
			}
		}
	 }
	 else
	 {
		/*$("#lbtime").append("<option value =\"9:00 AM\">9:00 AM</option>");  
		$("#lbtime").append("<option value =\"9:15 AM\">9:15 AM</option>");  
		$("#lbtime").append("<option value =\"9:30 AM\">9:30 AM</option>");  
		$("#lbtime").append("<option value =\"9:45 AM\">9:45 AM</option>");  
		$("#lbtime").append("<option value =\"10:00 AM\">10:00 AM</option>");  
		$("#lbtime").append("<option value =\"10:15 AM\">10:15 AM</option>");  
		$("#lbtime").append("<option value =\"10:30 AM\">10:30 AM</option>");  
		$("#lbtime").append("<option value =\"10:45 AM\">10:45 AM</option>");  
		$("#lbtime").append("<option value =\"11:00 AM\">11:00 AM</option>");  
		$("#lbtime").append("<option value =\"11:15 AM\">11:15 AM</option>");  */
		$("#lbtime").append("<option value =\"11:30 AM\">11:30 AM</option>");  
		$("#lbtime").append("<option value =\"11:45 AM\">11:45 AM</option>");  
		$("#lbtime").append("<option value =\"12:00 PM\">12:00 PM</option>");  
		$("#lbtime").append("<option value =\"12:15 PM\">12:15 PM</option>");  
		$("#lbtime").append("<option value =\"12:30 PM\">12:30 PM</option>");  
		$("#lbtime").append("<option value =\"12:45 PM\">12:45 PM</option>");  
		
		$("#lbtime").append("<option value =\"01:00 PM\">01:00 PM</option>");  
		$("#lbtime").append("<option value =\"01:15 PM\">01:15 PM</option>");  
		$("#lbtime").append("<option value =\"01:30 PM\">01:30 PM</option>");  
		$("#lbtime").append("<option value =\"01:45 PM\">01:45 PM</option>");  
		$("#lbtime").append("<option value =\"02:00 PM\">02:00 PM</option>");  
		$("#lbtime").append("<option value =\"02:15 PM\">02:15 PM</option>");  
		$("#lbtime").append("<option value =\"02:30 PM\">02:30 PM</option>");  
		$("#lbtime").append("<option value =\"02:45 PM\">02:45 PM</option>");  
		$("#lbtime").append("<option value =\"03:00 PM\">03:00 PM</option>");  
		$("#lbtime").append("<option value =\"03:15 PM\">03:15 PM</option>");  
		$("#lbtime").append("<option value =\"03:30 PM\">03:30 PM</option>");  
		$("#lbtime").append("<option value =\"03:45 PM\">03:45 PM</option>");  
		$("#lbtime").append("<option value =\"04:00 PM\">04:00 PM</option>");  
		$("#lbtime").append("<option value =\"04:15 PM\">04:15 PM</option>");  
		$("#lbtime").append("<option value =\"04:30 PM\">04:30 PM</option>");  
		$("#lbtime").append("<option value =\"04:45 PM\">04:45 PM</option>"); 
		
		$("#lbtime").append("<option value =\"05:00 PM\">05:00 PM</option>");  
		$("#lbtime").append("<option value =\"05:15 PM\">05:15 PM</option>");  
		$("#lbtime").append("<option value =\"05:30 PM\">05:30 PM</option>");  
		$("#lbtime").append("<option value =\"05:45 PM\">05:45 PM</option>");  
		$("#lbtime").append("<option value =\"06:00 PM\">06:00 PM</option>");  
		$("#lbtime").append("<option value =\"06:15 PM\">06:15 PM</option>");  
		$("#lbtime").append("<option value =\"06:30 PM\">06:30 PM</option>");  
		$("#lbtime").append("<option value =\"06:45 PM\">06:45 PM</option>");  
		$("#lbtime").append("<option value =\"07:00 PM\">07:00 PM</option>");  
		$("#lbtime").append("<option value =\"07:15 PM\">07:15 PM</option>");  
		$("#lbtime").append("<option value =\"07:30 PM\">07:30 PM</option>");  
		$("#lbtime").append("<option value =\"07:45 PM\">07:45 PM</option>");  
		$("#lbtime").append("<option value =\"08:00 PM\">08:00 PM</option>");  
		$("#lbtime").append("<option value =\"08:15 PM\">08:15 PM</option>");  
		$("#lbtime").append("<option value =\"08:30 PM\">08:30 PM</option>");  
		$("#lbtime").append("<option value =\"08:45 PM\">08:45 PM</option>"); 
		
		$("#lbtime").append("<option value =\"09:00 PM\">09:00 PM</option>");  
		$("#lbtime").append("<option value =\"09:15 PM\">09:15 PM</option>");  
		$("#lbtime").append("<option value =\"09:30 PM\">09:30 PM</option>");  
		$("#lbtime").append("<option value =\"09:45 PM\">09:45 PM</option>");  
		$("#lbtime").append("<option value =\"10:00 PM\">10:00 PM</option>");  
		/*
		$("#lbtime").append("<option value =\"10:15 PM\">10:15 PM</option>");  
		$("#lbtime").append("<option value =\"10:30 PM\">10:30 PM</option>");  
		$("#lbtime").append("<option value =\"10:45 PM\">10:45 PM</option>");  
		$("#lbtime").append("<option value =\"11:00 PM\">11:00 PM</option>");  */
	 }
}) 
});

	window.onload = function(){	
		//内页图片宽度调整
		for($i=0;$i<=$('#content img').size();$i++){
			if( $('#content img').eq($i).width() > 615){
				$('#content img').eq($i).width(615);
			}
		}
	}