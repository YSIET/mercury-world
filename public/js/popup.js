function notice_getCookie(name){
	var nameOfCookie = name + "=";
	var x = 0;
	while(x<=document.cookie.length)
	{
		var y = (x+nameOfCookie.length);
		if (document.cookie.substring(x,y)==nameOfCookie)
		{
			if ((endOfCookie=document.cookie.indexOf( ";", y )) == -1)
			endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie));
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if (x == 0) break;
	}
	return "";
}


//if (notice_getCookie( "popup" ) != "done"){
//	window.open('/popup/popup.asp','tem1','width=400,height=330, top=0,left=0,location=no, directories=no,resizable=no,status=no,toolbar=no,menubar=no,scrollbars=no');
//}

//if (notice_getCookie( "popup1" ) != "done"){
//	window.open('/popup/popup2.asp','tem2','width=400,height=330, top=0,left=410,location=no, directories=no,resizable=no,status=no,toolbar=no,menubar=no,scrollbars=no');
//}