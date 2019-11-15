var express = require('express');
var router = express.Router();
var mysql = require('../common/mysql');
var json1 = require('../common/returnJson')
var table2json = require('../common/table2json');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/addClass',function (req, res) {

  const title = req.query.title1;
  const parentId = req.query.parentId1?req.query.parentId1:0;

  mysql.query(`select * from class where title="${title}"`,function (err,result) {
    if (result.length>0){
      res.send({flag:false,msg:'标题不能重复'})
    } else{
      if (title==''){
        res.send({flag:false,msg:'标题不能为空'})
      } else {
        if(parentId){
          mysql.query(`select * from class where id=${parentId}`,function (err, result) {
            console.log(result)
            const parentPath = parentId!=0?result[0].parentPath+','+parentId:'0';
            const lv = parentId!=0?result[0].level++:1;
            // parentPath = result[0].parentPath?result[0].parentPath+result[0].id+',':result[0].id;
            // level = result[0].level+1;
              mysql.query(`insert into class (title,parentId,parentPath,level) values ('${title}',${parentId},'${parentPath}',${lv})`,function (err, resilt) {
                if(err){
                  console.log(err)
                  res.send({flag:false,msg:''});
                }else{
                  mysql.query(`select * from class`,function (err,result) {
                    if (err){
                      res.send({flag:false,msg:'错误2'})
                    } else {
                      res.send({flag:true,msg:'成功',data:result});
                    }
                  })
                }
              })
          })
        }else{
          const parentPath = parentId!=0?result[0].parentPath+','+parentId:'0';
          const lv = parentId!=0?result[0].level++:1;
          mysql.query(`insert into class (title,parentId,parentPath,level) values ('${title}',${parentId},'${parentPath}',${lv})`,function (err, result) {
            if(err){
              console.log(err)
              res.send({flag:false,msg:''});
            }else{
              res.send({flag:false,msg:'成功',result});
            }
          })
        }
      }
    }
  })


});
// const parentid = req.params.parentid;
// const title = req.params.title;
// mysql.query(mysql.mysql.format('select parentPath,level from class where id=?',[parentid]),function (err, result) {
//   if(err || (result.length==0 && parentid != 0)){
//     res.send({flag:false,msg:'数据库错误1'});
//   }else{
//     const parentPath = parentid!=0?result[0].parentPath+','+parentid:'0';
//     const lv = parentid!=0?result[0].level++:1;
//     mysql.query(mysql.mysql.format('insert into class (title,parentId,parentPath,level) values (?,?,?,?)',[title,parentid,parentPath,lv]),function (err, result) {
//       if(err){
//         console.log(err)
//         res.send({flag:false,msg:'数据库错误2'});
//       }else{
//         res.send({flag:true})
//       }
//     })
//   }
// })
router.get('/getClass',function (req,res) {
  mysql.query('select * from class order by CONCAT(parentPath,\',\',id) asc',function (err, result) {
    if(err){
      res.send(json1(false,'失败'))
    }else{
      res.send({flag:true,msg:'成功',data:table2json(result)});
      // res.send(result);

    }
  })
});

router.post('/delClass',function (req, res) {
  const id=req.body.id;
  const uid = '"%'+id+','+'%"';
  const classid=id;
  // console.log(id)
  // 'delete from class where parentPath like (\"select CONCAT(parentPath,\'%\') from class where id=?\")'
  mysql.query(mysql.mysql.format('delete from class where id=?',[id]),function (err,result) {
    if (err){
      res.send(json1(false ,'失败',{data:[]}))
    } else{
      mysql.query(`delete from class where parentPath like (${uid})`,function (err,result) {
        if (err){
          res.send(json1(false,'删除失败',{data:[]}))
        } else {
          mysql.query(mysql.mysql.format('delete from news where classid=?',[id]),function (err,result) {
            if (err){
              res.send(json1(false,'错误语句'))
            } else {
              mysql.query(mysql.mysql.format('select * from class'),function (err,result) {
                if (err){
                  res.send(json1(false,'失败',{data:[]}))
                } else {
                  res.send(json1(true,'成功',{data:result}))
                }
              })
            }
          })

        }
      })
    }
  })

});
router.get('/delenews',function (req,res) {
  // const title=req.body.title;
  const idsss=req.query.id;
  mysql.query(mysql.mysql.format('delete from news where id=?',[idsss]),function (err, result) {
    if(err){
      res.send({flag:false,msg:'err'})
    }else{
      res.send({flag:true,msg:'成功'})
    }

  })
});
router.get('/upnews',function (req,res) {
  // const title=req.body.title;
  const ids=req.query.id;
  mysql.query(mysql.mysql.format('updata from news where id=?',[ids]),function (err, result) {
    if(err){
      res.send({flag:false,msg:'err'})
    }else{
      res.send({flag:true,msg:'成功'})
    }

  })
});
module.exports = router;
