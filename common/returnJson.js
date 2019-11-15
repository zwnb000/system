function f(flag=true,msg='',data={},){
    return {
        flag,msg,data,
        timestamp:new Date().getTime()
    }
}
module.exports = f;