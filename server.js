var http=require('http')
var url=require('url')
var path=require('path')
var db=require('./database')
var qs=require('querystring')
var fs=require('fs')
var utils=require('./utils')

var srv=http.createServer(async function(req,res){
    if(req.method==='GET'){
        var pathname=url.parse(req.url).pathname
        console.log(pathname)
        if(pathname[0]==='/')pathname=pathname.substr(1)
        if(pathname===''){
            res.writeHead(200,{'Content-Type':'text/html'})
            fs.createReadStream('data/home.html').pipe(res)
            return
        }
        datapath='./data/'+pathname
        console.log(datapath)
        fs.stat(datapath,async function(err,stats){
            if(stats&&stats.isFile()){
                if(path.extname(datapath)==='.css'){
                    res.writeHead(200,{'Content-Type':'text/css'})
                }
                if(path.extname(datapath)==='.js'){
                    res.writeHead(200,{'Content-Type':'text/javascript'})
                }
                if(path.extname(datapath)==='.html'){
                    res.writeHead(200,{'Content-Type':'text/html'})
                }
                fs.createReadStream(datapath).pipe(res)
                return
            }
            longURL=await utils.find(pathname)
            console.log(longURL)
        })
    }
    if(req.method==='POST'){
        console.log('POST')
        let body=[]
        req.on('data',data=>{
            body.push(data)
        }).on('end',async()=>{
            let longURL=Buffer.concat(body).toString()
            console.log(longURL)
            let shortURL=await utils.getValidShortURL()
            utils.insert(shortURL,longURL)
        })
    }
        
})
srv.listen('8000')
