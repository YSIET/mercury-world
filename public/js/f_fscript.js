function f_emb(w,h,fs,m){
return ( "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" codebase=\"http//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0\" WIDTH="+w+" HEIGHT="+h+"><param name=\"movie\" value="+fs+"><param name=\"wmode\" value="+m+"><param name=\"quality\" value=\"high\"><embed src="+fs+" quality=\"high\" wmode="+m+" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" width="+w+" height="+h+"></embed></object>");
}

function documentwrite(src){
        document.write(src);
		}