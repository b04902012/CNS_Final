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
            if(request.readyState==4){
                console.log(request.responseText)
            }
        }
        request.send(longURL)
    }
})
