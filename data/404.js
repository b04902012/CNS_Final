window.addEventListener('load',function(){
	document.head.appendChild((function(){
		var css=document.createElement('link')
		css.rel='stylesheet'
		css.type='text/css'
		css.href='404.css'
		return css
	})())
    document.getElementById('shortURL').innerHTML='"'+window.location.href+'"'
})
