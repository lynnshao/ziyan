var model_msg = require('../model/msg');
var model_car = require('../model/cars');
var model_users = require('../model/users');

//reg set cookie
//nick
exports.set_cookie_users_nick = function(nick, res){
   
    model_users.user_select_by_nickname(nick, function(err, output){
        if(output.length === 1){
            set_cookie_users(output, res, function(){
                res.send({reg_ok: 1})
            })                    
        }else{
            console.log(">>>>>>>>set cookies fail")
            res.send({reg_ok: 0})
        }                
    })
}

//login set cookie
//args: nick and password
exports.set_cookie_users_n_p = function(args, res) {
    model_users.user_select_by_n_p(args, function(err, rows) {
        if(err) {
            console.log("login fail")
            res.render('errors/page-500')
        } else {
            if(rows.length === 0) {
                console.log("login fail 0")
                res.send({login_ok: 0})
            } else {
                if(rows[0].status === 0) {
                    console.log("login fail 2")
                    res.send({login_ok: 2})
                } else {
                    set_cookie_users(rows, res, function(){
                        res.send({login_ok: 1})
                    })    
                }                
            }
        }
    })    
}

//outers
//id
exports.set_cookie_users_id = function(id, cb) {
    model_users.user_select_by_id(id, function(err, rows) {
        if(err) {
            console.log("get user fail")
            var cookies = null
            cb(cookies)
        } else {
            if(rows.length === 0) {
                console.log("none user")
                var cookies = null
                cb(cookies)
            } else {
                get_users(rows, cb)
            }
        }
    })    
}

function get_users(output, cb){
    var cookies = {}
    cookies.id = output[0].user_id
    cookies.nick = output[0].nick_name
    var email = output[0].email
    emails = email.split("@")
    email = emails[0].substring(0,1)+"***"+"@"+emails[1]
    cookies.email = email
    cookies.points = output[0].points
    cookies.name = output[0].name
    cookies.sex = output[0].sex
    cookies.birthday = output[0].birthday
    cookies.tel = output[0].tel
    cookies.school = output[0].school

    model_msg.msg_total_by_to(cookies.id, function(err, out){
        if(err) {
            console.log("\nget msg fail\n")
            cookies = null
        } else {
            cookies.new_msg_total= out[0].total            
        }
        model_car.car_select_total_by_user(cookies.id, function(err, out){
            if(err) {
                console.log("\nget car fail\n")
                cookies = null
            } else {
                cookies.car_total= out[0].total           
            }
            cb(cookies)                       
        })        
    })
    console.log("get user sucess")
}

function set_cookie_users(output, res, cb) {
    var cookies = {}
    cookies.id = output[0].user_id
    cookies.nick = output[0].nick_name
    var email = output[0].email
    emails = email.split("@")
    email = emails[0].substring(0,1)+"***"+"@"+emails[1]
    cookies.email = email
    cookies.points = output[0].points
    cookies.name = output[0].name
    cookies.sex = output[0].sex
    cookies.birthday = output[0].birthday
    cookies.tel = output[0].tel
    cookies.school = output[0].school

    model_msg.msg_total_by_to(cookies.id, function(err, out){
        if(err) {
            console.log("\nget msg fail\n")
        } else {
            cookies.new_msg_total= out[0].total            
        }
        model_car.car_select_total_by_user(cookies.id, function(err, out){
            if(err) {
                console.log("\nget car fail\n")
            } else {
                cookies.car_total= out[0].total           
            } 
            set_cookie(cookies, res)
            cb()                       
        })        
    })

    console.log(">>>>>>>>>>>>>>set cookies success!")
}

function set_cookie(cookies, res) {
    res.cookie('users', cookies, { domain:"192.168.33.10", path: '/', maxAge : 1000 * 60 * 30 })
}