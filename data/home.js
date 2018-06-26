window.addEventListener('load',function(){
	document.head.appendChild((function(){
		var css=document.createElement('link')
		css.rel='stylesheet'
		css.type='text/css'
		css.href='home.css'
		return css
	})())
	var button=document.getElementById('Button')
    button.onclick=()=>{
        var request=new XMLHttpRequest()
        request.open(
            'POST',
            '/'
        )
        let longURL=document.getElementById('longURL').value
        request.onreadystatechange=function(){
            if(request.readyState===4){
                result=document.getElementById('result')
                result.style.visibility='visible'
                let shortURLNode=document.getElementById('shortURL')
                let longURLNode=document.getElementById('longURL')
                longURLNode.value=request.responseText.split('\n')[0]
                shortURLNode.value=request.responseText.split('\n')[1]
                if(request.status===400){
                    let errorNode=document.getElementById('error')
                    errorNode.innerHTML=request.responseText.split('\n')[1]
                    errorNode.style.display='block'
                    bottomNode.style.top='50vh'
                }
                else{
                    shortURLNode.select()
                    let errorNode=document.getElementById('error')
                    errorNode.style.display='none'
                    bottomNode=document.getElementById('bottom')
                    bottomNode.style.top='70vh'
                }
            }
        }
        request.send(longURL)
    }
})
