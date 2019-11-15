var express = require('express');
var router = express.Router();
var md5 = require('../common/md5');
var mysql = require('../common/mysql');
var svgCaptcha = require('svg-captcha');
var jsona = require('../common/returnJson');

router.get('/captcha',function (req, res) {
    var captcha = svgCaptcha.create({
        inverse: false, // 翻转颜色
        fontSize: 48, // 字体大小
        noise: 2, // 噪声线条数
        width: 100, // 宽度
        height: 40, // 高度
        size: 4,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    });
    // 保存到session,忽略大小写
    req.session.captcha = captcha.text.toLowerCase();
    //保存到cookie 方便前端调用验证
    // res.cookie('captcha', req.session);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.write(String(captcha.data));
    res.end();
});
/* GET users listing.  */
router.post('/login', function(req, res, next) {
    const uid = req.body.username;
    // const pwd = md5(req.body.password);
    const pwd = req.body.password;
    console.log(uid)
    console.log(pwd)
    // const captcha = req.body.captcha;
    // String(captcha).toLowerCase() == req.session.captcha.toLowerCase()
    if(1){
        mysql.query(mysql.mysql.format('select * from user where user=? and pwd=?',[uid,pwd]),function (err, result) {
            if(err){
                res.send({
                    flag:false,
                    msg:'数据库忙',
                    data:{},
                    // timestamp:new Date().getTime()
                })
            }else{
                if(result.length>0){
                    req.session.logname = uid;
                    res.send({
                        flag:true,
                        msg:'登陆成功',
                        data:{},
                        // timestamp:new Date().getTime()
                    });
                }else{
                    res.send({
                        flag:false,
                        msg:'用户名或密码错误',
                        data:{},
                        // timestamp:new Date().getTime()
                    })
                }
            }
        })
    }else{
        res.send(jsona(false,'验证码错误'));
    }

});

router.get('/adminList',function (req, res) {
   if(true){
       const page = req.query.page;
       mysql.query(`select id,uid,tm,(select count(*) from shuju) as total from shuju limit 5 offset ${(page-1)*5}`,function (err, result) {
           if(err){
               res.send({
                   flag:false,
                   msg:'数据库忙',
                   data:{},
                   timestamp:new Date().getTime()
               })
           }else{
               res.send({
                   flag:true,
                   msg:'',
                   data:result,
                   timestamp:new Date().getTime()
               })
           }
       })
   } else {
       res.send(jsona(false,'登陆超时'));
   }
});

router.post('/pwdUpdate',function (req, res) {
   const id = req.body.id;
   const pwd = req.body.password;
   const repwd = req.body.repassword;
   if(pwd!=repwd || pwd=='' || id==''){
       console.log(id,pwd,repwd)
       res.send({
           flag:false,
           msg:'数据不正确，请重新操作',
       })
   }else{
       mysql.query(mysql.mysql.format('update shuju set pwd=?',[md5(pwd)]),function (err,result) {
           if(err){
               res.send({
                   flag:false,
                   msg:'数据库出错',
               })
           }else{
               res.send({
                   flag:true,
               })
           }
       })
   }
});

router.post('/pwdadd',function (req, res) {
    const id = req.body.id;
    const uid = req.body.uid;

    const pwd = req.body.password;
    // const repwd = req.body.repassword;
    if(uid=='' || pwd=='' || id==''){
        console.log(id,pwd,uid)
        res.send({
            flag:false,
            msg:'数据不正确，请重新操作',
        })
    }else{
        mysql.query(mysql.mysql.format('insert into shuju (uid,pwd) values (?,?)',[uid,md5(pwd)]),function (err,result) {
            if(err){
                res.send({
                    flag:false,
                    msg:'数据库出错',
                })
            }else{
                res.send({
                    flag:true,
                })
            }
        })
    }
});
router.post('/search',function (req, res) {
    const uid = req.body.uid;
    const id = req.body.id;
    const page = req.body.page;
    // const uid = req.body.uid;

    // const pwd = req.body.password;
    // const repwd = req.body.repassword;
    mysql.query(mysql.mysql.format(`select * from shuju where uid=?`,[uid]),function (err,result) {
        if(err){
            res.send({
                flag:false,
                msg:'数据库出错',
            })
        }else{
            console.log(uid)
            res.send({
                flag:true,
                msg:'',
                data:result,
            })
        }
    })
});

router.post('/deladmin',function (req, res) {
    const id = req.body.id;
    const page = req.body.page;
    if(id==''){
        res.send({
            flag:false,
            msg:'数据不正确，请重新操作',
        })
    }else{
        mysql.query(mysql.mysql.format('delete from shuju where id=?',[id]),function (err,result) {
            if(err){
                res.send({
                    flag:false,
                    msg:'数据库出错',
                })
            }else{
                mysql.query(`select id,uid,tm,(select count(*) from shuju) as total from shuju limit 5 offset ${(page-1)*5}`,function (err, result) {
                    if(err){
                        res.send({
                            flag:false,
                            msg:'数据库忙',
                            data:{},
                            timestamp:new Date().getTime()
                        })
                    }else{
                        res.send({
                            flag:true,
                            msg:'',
                            data:result,
                            timestamp:new Date().getTime()
                        })
                    }
                })
            }
        })
    }
});
router.post('/dele',function (req,res) {
    const ids=req.body.delList.join(',');
    const page = req.body.page;
    // console.log(body)
    mysql.query(`delete from shuju where id in (${ids})`,function (err ,result) {
        if(err){
            res.send({
                flag: false,
                msg:'错误'
            })
        }else{
            mysql.query(`select id,uid,tm,(select count(*) from shuju) as total from shuju limit 5 offset ${(page-1)*5}`,function (err, result) {
                if(err){
                    res.send({
                        flag:false,
                        msg:'数据库忙',
                        data:{},
                        timestamp:new Date().getTime()
                    })
                }else{
                    res.send({
                        flag:true,
                        msg:'',
                        data:result,
                        timestamp:new Date().getTime()
                    })
                }
            })

        }


    })
})

router.post('/addAdmin',function (req, res) {
    console.log(req)
    const uid = req.body.uid;
    const pwd = req.body.pwd;
    console.log(uid)
    mysql.query(mysql.mysql.format(`select * from shuju where uid=?`,[uid]),function (err, result) {
       if(err){
           res.send({flag:false,msg:'err1'})
       } else{
           if(result.length>0){
               res.send({flag:false,msg:'用户名已存在'});
           }else{
               mysql.query(mysql.mysql.format('insert into shuju (uid,pwd) values (?,?)',[uid,md5(pwd)]),function (err, result) {
                   if(err){
                       console.log(err)
                       res.send({flag:false,msg:'err2'})
                   }else{
                       res.send({flag:true,msg:'成功'});
                   }
               })
           }
       }
    });
});

router.get('userlist',function (req, res) {
    if(!req.session.logname){
        res.send({
            flag:false,
            msg:'登陆超时',
            islogin:false,
        })
    }else{

    }
});
router.get('/news',function (req,res) {
    const title = req.query.title1;
    const content = req.query.content;
    const classid=req.query.classid;
    console.log(title);
    mysql.query(mysql.mysql.format(`select * from news where title=?`,[title]),function (err, result) {
        // console.log(err)
        if(err){
            res.send({flag:false,msg:'数据库错误'})
        } else{
            if(result.length>0){
                res.send({flag:false,msg:'标题重复'})
            }else{
                mysql.query(mysql.mysql.format('insert into news (title,content,classid) values (?,?,?)',[title,content,classid]),function (err, result) {
                    if(err){
                        console.log(err)
                        res.send({flag:false,msg:'没有选择分类'})
                    }else{
                        mysql.query(mysql.mysql.format(`select * from news`),function (err,result) {
                            if (err) {
                                res.send({
                                    flag: false,
                                    msg: '错误'
                                })
                            } else {
                                res.send({flag: true, msg: '成功'});
                            }
                        })

                    }
                })
            }
        }
    });
});
router.post('/newslist',function (req, res) {
    const ids = req.body.arrId;
    console.log(ids)
    const idss='%'+ids+',%';
    const page = req.body.page;
    // const  classid=req.body.arrid
    mysql.query(`select id,title,content,tm,(select count(*) from news where classId in (SELECT id FROM class WHERE CONCAT(parentPath,',',id,',') LIKE "${idss}")) as total from news where classId in (SELECT id FROM class WHERE CONCAT(parentPath,',',id,',') LIKE "${idss}") limit 10 offset ${(page-1)*10}` ,function (err,result) {
        if (err){
            res.send({flag:false,msg:'err'})
        } else{
            res.send({flag:true,msg:'成功',data:result})
        }
    })

});
router.post('/lists',function (req, res) {
    // const ids = req.body.arrId
    // const idss='%'+ids+',%';
    // const page = req.body.page;
    // const  classid=req.body.arrid
    const id=req.body.ids;
    console.log(id)
    // mysql.query(mysql.mysql.format(`select title,content from news where id=?`,[id]))
    mysql.query(mysql.mysql.format(`select id,title,content from news where id=?`,[id]),function (err,result) {
        if (err){
            res.send({flag:false,msg:'err'})
        } else{
            res.send({flag:true,msg:'成功1',data:result})
        }
    })

});
router.post('/list',function (req, res) {
    // const ids = req.body.arrId
    // const idss='%'+ids+',%';
    // const page = req.body.page;
    // const  classid=req.body.arrid
    // const id=req.body.id;
    // select id,uid,tm,(select count(*) from shuju) as total from shuju limit 5 offset ${(page-1)*5}
    mysql.query(`select * from news`,function (err,result) {
        if (err){
            res.send({flag:false,msg:'err'})
        } else{
            res.send({flag:true,msg:'成功',data:result})
        }
    })

});
router.get('/newsup',function (req,res){
    const title = req.query.tit;
    const id = req.query.id;
    const cont = req.query.cont;
    if (title==''){
        res.send({flag:false,msg:'标题不能为空'})
    } else {
        mysql.query(mysql.mysql.format(`select title,content from news where id=?`,[title,cont,id]),function (err,result) {
            if (err){
                res.send({flag:false,msg:'错误'})
            } else {
                mysql.query(mysql.mysql.format(`update news set title=?,content=? where id=?`,[title,cont,id]),function (err,result) {
                    if (err){
                        res.send({flag:false,msg:'错误1'})
                    } else {
                        res.send({flag:true,msg:'修改成功'})
                    }
                })
            }
        })

    }

})
//删除全部
router.post('/deleall',function (req,res) {
    const ids=req.body.delList.join(',');
    const page = req.body.page;
    console.log(ids)
    // console.log(body)
    mysql.query(`delete from news where id in (${ids})`,function (err ,result) {
        if(err){
            res.send({
                flag: false,
                msg:'错误'
            })
        }else{
            mysql.query(`select id title,content,tm,(select count(*) from news) as total from news limit 5 offset ${(page-1)*5}`,function (err, result) {
                if(err){
                    res.send({
                        flag:false,
                        msg:'数据库忙',
                        data:{},
                        timestamp:new Date().getTime()
                    })
                }else{
                    res.send({
                        flag:true,
                        msg:'',
                        data:result,
                        timestamp:new Date().getTime()
                    })
                }
            })

        }
    })
})
//查找
router.post('/chazhao',function (req, res) {
    const title = req.body.title;
    mysql.query(mysql.mysql.format(`select * from news where title like "%${title}%"`),function (err,result) {
        if(err){
            res.send({
                flag:false,
                msg:'数据库出错',
            })
        }else{
            console.log(title)
            res.send({
                flag:true,
                msg:'',
                data:result,
            })
        }
    })
});

router.post('/yh',function (req, res) {
    const name = req.body.username;
    const tm = req.body.value1;
    const phone = req.body.input;
    const money = req.body.jine.toFixed(2);
    const xingbie = req.body.radio;
    const aihao = req.body.checkList.join(',');
    mysql.query(mysql.mysql.format('insert into center (name,tm,phone,money,xingbie,aihao) values (?,?,?,?,?,?)',[name,tm,phone,money,xingbie,aihao]),function (err,result) {
        if(err){
         res.send({
         flag:false,
          msg:'数据库出错',
         })
            console.log(err)
        }else{
            res.send({
                flag:true,
                msg:'成功',
                data:result,
            })
        }
    })
});

router.post('/yhlist',function (req, res) {
    // const ids = req.body.arrId
    // const idss='%'+ids+',%';
    // const page = req.body.page;
    // const  classid=req.body.arrid
    // const id=req.body.id;
    // select id,uid,tm,(select count(*) from shuju) as total from shuju limit 5 offset ${(page-1)*5}
    mysql.query(`select * from center`,function (err,result) {
        if (err){
            res.send({flag:false,msg:'err'})
        } else{
            res.send({flag:true,msg:'成功',data:result})
        }
    })

});




module.exports = router;