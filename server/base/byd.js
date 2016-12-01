// Base routes for item..
exports.register = function(server, options, next){
const uu_request = require('../utils/uu_request');
var eventproxy = require('eventproxy');
//得到当前cookie的使用人
var get_cookie_userid = function(request, cb){
	var user_id;
	if (request.state && request.state.cookie) {
		state = request.state.cookie;
		if (state.user_id) {
			user_id = state.user_id;
		}
	}
	cb(user_id);
};
//所有get调用接口方法
var do_get_method = function(url,cb){
	uu_request.get(url, function(err, response, body) {
		console.log(body);
		if (!err && response.statusCode === 200) {
			var content = JSON.parse(body);
			cb(false,content);
		} else {
			cb(true,null);
		}
	});
};
//所有post调用接口方法
var do_post_method = function(url,data,cb){
	uu_request.request(url, data, function(err, response, body) {
		console.log(body);
		if (!err && response.statusCode === 200) {
			cb(false,body);
		} else {
			cb(true,null);
		}
	});
};
//根据手机号，姓名，车牌，车架号查询客户
var search_customer = function(user_id, q,cb) {
	var url = "http://211.149.245.32:8787/after/search_customer?q=";
	url = url + q + "&user_id=" + user_id;
	do_get_method(url,cb);
};
//根据手机号获得会员信息
var get_repair_member_by_mobile = function(user_id, mobile,cb) {
	var url = "http://211.149.245.32:8787/after/get_repair_member_by_mobile?mobile=";
	url = url + mobile + "&user_id=" + user_id;
	do_get_method(url,cb);
};
//根据客户id得到客户维修信息
var list_repair_order = function(user_id, client_id,cb) {
	var url = "http://211.149.245.32:8787/after/list_repair_order?client_id=";
	url = url + client_id + "&user_id=" + user_id;
	do_get_method(url,cb);
};
//客户采购信息
var purchase_infos = function(user_id, client_id,cb) {
	var url = "http://211.149.245.32:8787/after/list_mendian_apply_order_by_client?user_id=";
	url = url + user_id + "&client_id=" + client_id;
	do_get_method(url,cb);
};
//查询客户根据客户id
var search_customerByid = function(user_id, id,cb) {
	var url = "http://211.149.245.32:8787/after/search_customer?id=";
	url = url + id +"&user_id=" + user_id;
	do_get_method(url,cb);
};
//查询今日客户
var search_list_today = function(id,cb) {
	var url = "http://211.149.245.32:8787/after/list_today_search?user_id=";
	url = url + id;
	do_get_method(url,cb);
};
//登入获取员工信息，门店id等
var find_employee_info = function(user_id,cb){
	var url = "http://211.149.245.32:8787/person/";
	url = url + user_id;
	do_get_method(url,cb);
}
var repair_car_base = function(user_id, cb){
	var url = "http://211.149.245.32:8787/after/repair_car_base?userid=" + user_id;
	do_get_method(url,cb);
};
//查询客户关怀
var search_customers_feedback = function(user_id,cb){
	var url = "http://211.149.245.32:8787/after/list_repair_guanhuai?user_id=" + user_id;
	do_get_method(url,cb);
};
//查询配件
var search_peijian_infos = function(user_id,code,type,cb){
	url = "http://211.149.245.32:8787/after/search_peijian_by_car_and_code?car_type=" + type + "&code=" + code + "&user_id=" + user_id;
	do_get_method(url,cb);
};
//首页绩效
var employee_kpi = function(user_id,cb){
	url = "http://211.149.248.241:11002/api/kpi_after?user_id=" + user_id;
	do_get_method(url,cb);
}

//滞留车辆
var stay_vehicles = function(user_id,cb){
	var url = "http://211.149.245.32:8787/after/list_overdate_repair?user_id=" + user_id;
	do_get_method(url,cb);
};
//客户采购信息
var purchase_list = function(user_id,cb){
	var url = "http://211.149.245.32:8787/after/list_mendian_apply_order_by_user?user_id=" + user_id;
	do_get_method(url,cb);
};
//查询维修项目
var search_repair_items = function(user_id,store_id,pailiang_type,q,cb){
	var url = "http://211.149.245.32:8787/after/search_repair_project?user_id=1" + user_id;
	url = url + "&store_id=" + store_id + "&pailiang_type=" + pailiang_type + "&q=" + q;
	console.log(url);
	do_get_method(url,cb);
};
//查询会员信息
var check_member = function(user_id, num, cb){
	var url = "http://211.149.245.32:8787/after/get_repair_member_by_ka_uid?ka_uid=" + num + "&user_id=" + user_id;
	do_get_method(url,cb);
};
//用户登入检查
var user_login_check = function(data, cb){
	var url = "http://211.149.245.32:8787/person/login_check";
	do_post_method(url,data,cb);
};
//创建客户档案
var create_customer_vehicle = function(data, cb){
	var url = "http://211.149.245.32:8787/after/save_client_car";
	do_post_method(url,data,cb);
};
//创建采购单
var create_purchase_info = function(data, cb){
	var url = "http://211.149.245.32:8787/after/save_mendian_apply_order";
	do_post_method(url,data,cb);
};
//修改手机号码
var update_phone_number = function(data, cb){
	var url = "http://211.149.245.32:8787/after/update_repair_client_mobile";
	do_post_method(url,data,cb);
};
//创建维修单
var create_repair_paper = function(data, cb){
	var url = "http://211.149.245.32:8787/after/save_repair_order";
	do_post_method(url,data,cb);
};
	server.route([
		//用户登入
		{
			method: 'GET',
			path: '/login',
			handler: function(request, reply){
				return reply.view('login');
			}
		},
		//首页获取，客户反馈，滞留车辆，未采购信息等
        {
            method: 'GET',
            path: '/',
            handler: function(request, reply){
				 get_cookie_userid(request, function (user_id) {
 					if (!user_id) {
 						return reply.redirect("/login");
 					}
					var ep = eventproxy.create("rows", "feedbacks", "vehicles", "purchases", "jixiaos", "employe", function (rows, feedbacks, vehicles, purchases, jixiaos, employee) {
						return reply.view('after_sales', {"rows":rows,"feedbacks":feedbacks,"vehicles":vehicles,"purchases":purchases,"jixiaos":jixiaos,"employe":employee,"employee":JSON.stringify(employee)});
					});
					search_list_today(user_id,function(err, content) {
						var rows = JSON.stringify(content.rows);
						ep.emit("rows", rows);
					});
					search_customers_feedback(user_id,function(err, content) {
						var feedbacks = JSON.stringify(content.rows);
						ep.emit("feedbacks", feedbacks);
					});
					stay_vehicles(user_id,function(err, content){
						var vehicles = JSON.stringify(content.rows);
						ep.emit("vehicles", vehicles);
					});
					purchase_list(user_id,function(err, content){
						var purchases = JSON.stringify(content.rows);
						ep.emit("purchases", purchases);
					});
					employee_kpi(user_id,function(err, content){
						var jixiaos = JSON.stringify(content);
						ep.emit("jixiaos", jixiaos);
					});
					find_employee_info(user_id,function(err, content){
						var employee = content.row;
						ep.emit("employe", employee);
					});
				});
			}
        },
		//搜索页查询
		{
            method: 'GET',
            path: '/search_info',
            handler: function(request, reply){
				var q = request.query.info;
				get_cookie_userid(request, function (user_id) {
					if (!user_id) {
 						return reply.redirect("/login");
 					}
					search_customer(user_id, q,function(err, content) {
						if (!err) {
							var rows = content.rows;
							var num;
							if (rows.length == 1) {
								num = 2;
								var mobile = rows[0].mobile;
								var client_id = rows[0].id;
								var ep = eventproxy.create("vips", "repair_orders", "purchase_infos", function (vips, repair_orders, purchase_infos) {
									return reply({"success":true,message:"ok","num":num,"rows":rows,"today_info":content.today_info,"vips":vips,"repair_orders":repair_orders, "purchase_infos":purchase_infos});
								});
								get_repair_member_by_mobile(user_id, mobile,function(err, vip) {
									ep.emit("vips", vip.rows);
								});
								list_repair_order(user_id, client_id,function(err, repair_order) {
									ep.emit("repair_orders", repair_order.rows);
								});
								purchase_infos(user_id, client_id,function(err, purchase_info) {
									ep.emit("purchase_infos", purchase_info.rows);
								});
							} else {
								if (rows.length == 0) {
									num = 0;
								}else if (rows.length > 10) {
									num = 1;
								}else {
									num = 3;
								}
								return reply({"success":true,message:"ok","num":num,"rows":rows});
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
        },
		//客户信息显示
		{
			method: 'GET',
			path: '/customer_info',
			handler: function(request, reply){
				var client_id = request.query.client_id;
				get_cookie_userid(request, function (user_id) {
					if (!user_id) {
						return reply.redirect("/login");
					}
					search_customerByid(user_id, client_id, function(err, content){
						if (!err) {
							console.log(client_id);
							console.log(content);
							var rows = content.rows;
							var mobile = rows[0].mobile;
							var client_id = rows[0].id;
							var ep = eventproxy.create("vips", "repair_orders", "purchase_infos", function (vips, repair_orders, purchase_infos) {
								return reply({"success":true,message:"ok","rows":rows,"today_info":content.today_info,"vips":vips,"repair_orders":repair_orders, "purchase_infos":purchase_infos});
							});

							get_repair_member_by_mobile(user_id, mobile,function(err, vip) {
								ep.emit("vips", vip.rows);
							});
							list_repair_order(user_id, client_id,function(err, repair_order) {
								ep.emit("repair_orders", repair_order.rows);
							});
							purchase_infos(user_id, client_id,function(err, purchase_info) {
								ep.emit("purchase_infos", purchase_info.rows);
							});
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
		//登入验证并存入cookie值
		{
			method: 'GET',
			path: '/login_check',
			handler: function(request, reply){
				var username = request.query.username;
				var password = request.query.password;
				var info ={
					"username": username,
					"password": password
				};
				user_login_check(info, function(err, content){
					if (!err) {
						console.log(content);
						var row = content.row;
						var state = {user_id:row.id};
						var user_id = row.id;
						return reply({"success":true,message:"ok","row":row}).state('cookie', state, {ttl:10*365*24*60*60*1000});
					} else {
						return reply({"success":false,message:err});
					}
				});
			}
		},
		//创建客户档案中，获取所有车辆信息（颜色，车型，品牌）
		{
			method: 'GET',
			path: '/vehicle_info',
			handler: function(request, reply){
				get_cookie_userid(request, function (user_id){
					if (!user_id) {
						return reply.redirect("/login");
					}
					repair_car_base(user_id, function(err, content){
						if (!err) {
							if (content.success) {
								console.log(content.rows);
								return reply({"success":true,message:"ok","vehicle_infos":content.rows});
							} else {
								return reply(content);
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
		//查询会员
		{
			method: 'GET',
			path: '/check_member',
			handler: function(request, reply){
				var num = request.query.num;
				console.log(num);
				get_cookie_userid(request, function (user_id){
					if (!user_id) {
						return reply.redirect("/login");
					}
					check_member(user_id, num, function(err, content){
						if (!err) {
							if (content.success) {
								console.log(content.rows);
								return reply({"success":true,message:"ok","member_info":content.rows});
							} else {
								return reply(content);
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
		//创建客户档案
		{
			method: 'POST',
			path: '/create_customer_info',
			handler: function(request, reply){
				var info = {
					"plate_numbers" : request.payload.vehic_plate_number,
					"car_brand" : request.payload.vehic_brand,
					"car_type" : request.payload.vehic_type,
					"pailiang_type" : request.payload.vehic_pailiang_type,
					"car_color" : request.payload.vehic_color,
					"vin_no" : request.payload.vehic_vin,
					"engine" : request.payload.vehic_engine,
					"buy_car_date" : request.payload.vehic_buy_date,
					"lingzheng_date" : request.payload.vehic_certi_date,
					"nianjian_date" : request.payload.vehic_check_date,
					"id" : request.payload.custo_id,
					"code" : request.payload.custo_code,
					"name" : request.payload.custo_name,
					"sex" : request.payload.custo_sex,
					"mobile" : request.payload.custo_phone,
					"shenfenzheng" : request.payload.custo_identi,
					"birthday" : request.payload.custo_birth,
					"phone" : request.payload.custo_mobie,
					"address" : request.payload.custo_adress,
					"email" : request.payload.custo_email,
				}

				get_cookie_userid(request, function (user_id){
					if (!user_id) {
						return reply.redirect("/login");
					}
					info.user_id = user_id;
					create_customer_vehicle(info, function(err, content){
						if (!err) {
							var num;
							console.log(content);
							if (content.success) {
								return reply({"success":true,message:"ok",client_id:content.client_id});
							} else {
								return reply(content);
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
		//创建采购单
		{
			method: 'POST',
			path: '/create_purchase_info',
			handler: function(request, reply){
				console.log(request.payload);
				var info = {
					"peijian_id" : request.payload.peijian_id,
					"peijian_name" : request.payload.peijian_name,
					"quantity" : request.payload.peijian_num,
					"promise_date" : request.payload.peijian_date,
					"remark" : request.payload.pur_remark,
					"client_name" : request.payload.name,
					"mobile" : request.payload.mobile,
					"plate_numbers" : request.payload.plate_numbers,
					"car_type" : request.payload.car_type,
					"client_id" : request.payload.client_id,
				}
				get_cookie_userid(request, function (user_id){
					if (!user_id) {
						return reply.redirect("/login");
					}
					info.user_id = user_id;
					create_purchase_info(info, function(err, content){
						if (!err) {
							console.log(content);
							if (content.success) {
								return reply({"success":true,message:"ok"});
							} else {
								return reply(content);
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
		//修改手机号码
		{
			method: 'POST',
			path: '/save_phone_number',
			handler: function(request, reply){
				console.log(request.payload);
				var info = {
					"client_id" : request.payload.client_id,
					"mobile" : request.payload.phone_number,
				}
				get_cookie_userid(request, function (user_id){
					if (!user_id) {
						return reply.redirect("/login");
					}
					info.user_id = user_id;
					update_phone_number(info, function(err, content){
						if (!err) {
							console.log(content);
							if (content.success) {
								return reply({"success":true,message:"ok"});
							} else {
								return reply(content);
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
		//c查询配件
		{
			method: 'POST',
			path: '/search_peijian',
			handler: function(request, reply){
				console.log(request.payload);
				var car_type = request.payload.car_type;
				var code = request.payload.code;
				get_cookie_userid(request, function (user_id){
					if (!user_id) {
						return reply.redirect("/login");
					}
					search_peijian_infos(user_id,code,car_type, function(err, content){
						if (!err) {
							console.log("content:"+content);
							if (content.success) {
								return reply({"success":true,message:"ok"});
							} else {
								return reply(content);
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
		//查询维修项目
		//查询配件
		{
			method: 'POST',
			path: '/find_repair_items',
			handler: function(request, reply){
				console.log(request.payload);
				var pailiang_type = request.payload.pailiang_type;
				var store_id = request.payload.store_id;
				var q = request.payload.info;
				get_cookie_userid(request, function (user_id){
					if (!user_id) {
						return reply.redirect("/login");
					}
					search_repair_items(user_id,store_id,pailiang_type,q, function(err, content){
						if (!err) {
							console.log("content:"+content);
							if (content.success) {
								return reply({"success":true,message:"ok",rows:content.rows});
							} else {
								return reply(content);
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
		//维修委托单保存
		{
			method: 'POST',
			path: '/save_repair_paper',
			handler: function(request, reply){
				var repair_order = JSON.parse(request.payload.repair_tot_items);

				get_cookie_userid(request, function (user_id){
					if (!user_id) {
						return reply.redirect("/login");
					}
					repair_order.user_id = user_id;
					create_repair_paper({"repair_order":JSON.stringify(repair_order)}, function(err, content){
						if (!err) {
							console.log("content:"+content);
							if (content.success) {
								return reply({"success":true,message:"ok"});
							} else {
								return reply(content);
							}
						} else {
							return reply({"success":false,message:err});
						}
					});
				});
			}
		},
    ]);

    next();
};

exports.register.attributes = {
    name: 'byd'
};
