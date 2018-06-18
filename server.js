var http=require('http')
var url=require('url')
var path=require('path')
var db=require('./database')
var qs=require('querystring')

var srv=http.createServer(function(req,res){
    if(req.method==='GET'){
        var path=url.parse(req.url).pathname
        db.find(path).then(
    }
    if(req.method==='POST'){
        
        req.on('data',data=>{
            body+=data
        }
        
})
srv.listen('8000')
