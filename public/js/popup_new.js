// 팝업창 관련###

	//레이어 팝업창 띄우기
	function openPopup(idx, sizeW, sizeH, posTop, posLeft, is_layer){
		try{
			if( is_layer == 1){
				var popElem = document.createElement("div");
				popElem.setAttribute("id", "pop_" + idx);
				popElem.className = "popup";
				popElem.style.width = sizeW + "px";
				popElem.style.height = (sizeH+30) + "px";
				popElem.style.top = posTop + "px";
				popElem.style.left = posLeft + "px";

				//팝업내용 삽입
				popElem.appendChild (document.getElementById("content_" + idx));
				
				var btElem = document.createElement("div");
				btElem.className = "popup_bt";
				btElem.innerHTML = ""
					+ " <input name='pop_close' onclick='closePopup(this, " + idx + ")' type='checkbox' value='1' id='pop_bt" + idx +"'> <label for='pop_bt" + idx +"'>오늘은 팝업창 안 보기</label>"
					+ " <strong onclick='removePop(" + idx + ")'>×</strong>";

				popElem.appendChild(btElem);
				$("#pop_wrapper").append(popElem);
				$("#pop_wrapper .popup").draggable();
				
			}
		}catch(ex){
			alert(ex.message);
		}
	}

	//오늘하루 팝업창 닫기
	function closePopup (checkElem, idx){
		try{
			var pNode = checkElem.parentNode.parentNode.parentNode;
			if( checkElem.checked){
				setCookie("pop_" + idx, "ok1", 1);
			}
			//팝업창 닫기
			removePop(idx);

		}catch(ex){
			alert(ex.message);
		}
	}
	//팝업창 그냥 닫기
	function removePop (idx){
		try{
			var popElem = document.getElementById("pop_" + idx);
			closeLayer(popElem);
			popElem.parentNode.removeChild(popElem);
		}catch(ex){
			alert(ex.message);
		}
	}
	//쿠키 얻기
	function getCookie( cName )
	{
		var nameOfCookie = cName + "=";
		var x = 0;
		while ( x <= document.cookie.length )
		{
			var y = (x+nameOfCookie.length);
			if ( document.cookie.substring( x, y ) == nameOfCookie ) {
				if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
					endOfCookie = document.cookie.length;
				return unescape( document.cookie.substring( y, endOfCookie ) );
			}
			x = document.cookie.indexOf( " ", x ) + 1;
			if ( x == 0 )
				break;
		}
		return "";
	}
	//팝업창 쿠키 설정
	function setCookie( cName, cValue, expiredays ) 
	{ 
		var todayDate = new Date(); 
		todayDate.setHours(23,59,59);	//오늘밤 자정
		//todayDate.setDate( todayDate.getDate() + parseInt(expiredays) ); 
		document.cookie = cName + "=" + escape( cValue ) + "; path=/; expires=" + todayDate.toUTCString() + ";" 
	} 

	//레이어 닫기
	function closeLayer(elem){
		try{
			if( typeof(elem) == "string" ){
				document.getElementById(elem).style.display = "none";
			}else{
				elem.style.display = "none";
			}
		}catch(ex){;}
	}
