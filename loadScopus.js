var requestHeaders = {};
 var scopusId;
 var it;
 var referenceObject = new Array();
 var referenceSize;
 var currentReferenceSize;
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
	var url=encodeURI( "http://api.elsevier.com/content/search/index:scopus?query=all((a) OR (i) OR (i) OR (u) OR (e) OR (o))&sort=coverDate&facets=country(count=250,sort=fd);");
//	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
 //	gadgets.sciverse.makeContentApiRequest(urlCoauthors, getCoauthors, requestHeaders);

 //	setInterval(getTInit,150);
 //	setInterval(getNotRet,150);
 //	gadgets.sciverse.makeContentApiRequest(urlRelevantDocument, getR, requestHeaders);
	gadgets.sciverse.makeContentApiRequest(url, getR, requestHeaders);
 //	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);
 
}

function getR(response){
	console.log("search-test");
	var temp = JSON.parse(response.text);
	console.log(temp);	
}
function getTInit(){
	if(k>limitk) return;
	var url=encodeURI("http://api.elsevier.com/content/affiliation/affiliation_id:"+k);
		try{
		gadgets.sciverse.makeContentApiRequest(url, getT, requestHeaders);}
		catch(e){};
	k++;}

function getNotRet(){

	if(k==notR.length) return;
	var l=notR[k];
	var url=encodeURI("http://api.elsevier.com/content/affiliation/affiliation_id:"+l);
		try{
		gadgets.sciverse.makeContentApiRequest(url, getT, requestHeaders);}
		catch(e){};
	k++;}

function getT(response){
	var temp = JSON.parse(response.text);
//	console.log(temp);
	console.log(temp['affiliation-retrieval-response']['affiliation-name']+"\n"+temp['affiliation-retrieval-response']['city']+"\n"+temp['affiliation-retrieval-response']['country']+"\n"+temp['affiliation-retrieval-response']['coredata']['dc:identifier']);


}

function panggil(){
    console.log("v1");
}