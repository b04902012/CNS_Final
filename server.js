var http=require('http')
var url=require('url')
var path=require('path')
var db=require('./database')
var qs=require('querystring')
var fs=require('fs')
var utils=require('./utils')
const L=require('./config').L

var srv=http.createServer(async function(req,res){
    if(req.method==='GET'){
        var pathname=url.parse(req.url).pathname
        if(pathname[0]==='/')pathname=pathname.substr(1)
        if(pathname===''){
            res.writeHead(200,{'Content-Type':'text/html'})
            fs.createReadStream('data/home.html').pipe(res)
            return
        }
        console.log(pathname)
        datapath='./data/'+pathname
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
            if(longURL){
                console.log(longURL)
                res.writeHead(303,{'Location':longURL})
                res.end()
            }
            else{
                res.writeHead(404,{'Content-Type':'text/html'})
                fs.createReadStream('data/404.html').pipe(res)
                return 
            }
        })
    }
    if(req.method==='POST'){
        console.log('POST')
        let body=[]
        req.on('data',data=>{
            body.push(data)
        }).on('end',async()=>{
            let longURL=Buffer.concat(body).toString()
            try{
                longURL=new URL(longURL).href
            }
            catch(err){
                res.writeHead(400,{'Content-Type':'text'})
                res.end(longURL+'\n'+'The URL you requested is invalid.')
                return
            }
            if(longURL.length<18+L){
                res.writeHead(400,{'Content-Type':'text'})
                res.end(longURL+'\n'+'The URL you requested is shorter than our shorten URL.')
                return
            }
            let shortURL=await utils.getValidShortURL()
            console.log(shortURL)
            await utils.insert(shortURL,longURL)
            res.writeHead(200,{'Content-Type':'text'})
            res.end(longURL+'\n'+'http://handso.me/'+shortURL)
        })
    }
        
})
srv.listen('80')
