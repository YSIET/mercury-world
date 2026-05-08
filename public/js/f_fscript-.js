function f_emb(w,h,fs,m){
return ( "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\" width="+w+" height="+h+"><param name=\"movie\" value="+fs+"><param name=\"wmode\" value="+m+"><param name=\"quality\" value=\"high\"><embed src="+fs+" quality=\"high\" wmode="+m+" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" width="+w+" height="+h+"></embed></object>");
}

function documentwrite(src){
        document.write(src);
		}