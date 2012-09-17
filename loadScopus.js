var requestHeaders = {};
 var scopusId;
 var it;
 // var citedbyUrl = new Array();

 var k=4937;
 //var k        =60055420;
 var limitk   =60070000;

function getContextCallback(response) {
	context = response;
	
	var prefs= new gadgets.Prefs();
   
        requestHeaders['Accept-Charset'] = "utf-8";
        requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
        requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
        requestHeaders['Accept'] = "application/json, text/xml";
  
  	var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=REF&startref=0");
	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE&facets=country(count=200,sort=fd);");
	var urlCoauthors=encodeURI( "http://api.elsevier.com/content/search/index:author?query=affil(university)&co-author="+context.au1Id+"&count=200&facets=country(count=200,sort=fd);");
//	var url=encodeURI( "http://api.elsevier.com/content/search/index:scopus?query=all(\"apple\")&sort=coverDate&facets=country(count=200,sort=fd);subjarea(count=100,sort=fd);pubyear(count=20);authname(count=20,sort=fd);");
//	var url=encodeURI( "http://api.elsevier.com/content/search/index:scopus?query=all((a) OR (b) OR (c) OR (d) OR (e) OR (f) OR (g) OR (h) OR (i) OR (j) OR (k) OR (l) OR (m) OR (n) OR (o) OR (p) OR (q) OR (r) OR (s) OR (t) OR (u) OR (v) OR (w) OR (x) OR (y) OR (z))&sort=coverDate&facets=country(count=250,sort=fd);");
//	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
 //	gadgets.sciverse.makeContentApiRequest(urlCoauthors, getCoauthors, requestHeaders);

 //	gadgets.sciverse.makeContentApiRequest(urlRelevantDocument, getR, requestHeaders);
 	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);
}


function waiting( ms )
{
	var date = new Date();
	var curDate = null;
	while (curDate - date < ms) curDate = new Date();

}

function parseValidator(b){
		while(b.indexOf("\"$\" :\}")>0){
    			b=b.replace("\"$\" :\}","    }");	}
    		return b;
}