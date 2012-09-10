 var requestHeaders = {};
 var scopusId;
 var it;
 var referenceObject = new Array();
 var referenceSize;
 var currentReferenceSize;
 var citedbyUrl = new Array();
 var citedbyObject = new Array();
 var coauthorObject= new Array();
 var totalCitation;
 var totalCoauthors;
 var statusCitedby=0;
 var statusCoauthors=0;
 var k=60000000;
 var testCount=0;
function getContextCallback(response) {
	context = response;
	document.getElementById("testing").innerHTML="lolol";
	var prefs= new gadgets.Prefs();
   
        requestHeaders['Accept-Charset'] = "utf-8";
        requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
        requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
        requestHeaders['Accept'] = "application/json, text/xml";
   
  	var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=REF&startref=0");
	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
	var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?query=affil(university)&co-author="+context.au1Id);

 //	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
 //	gadgets.sciverse.makeContentApiRequest(urlCoauthor, getCoauthor, requestHeaders);
 	setInterval(getTInit,200);

 
 //	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);
 
}
function getTInit(){

	if(k>60001000) return;
	var url=encodeURI("http://api.elsevier.com/content/affiliation/affiliation_id:"+k);
		try{
		gadgets.sciverse.makeContentApiRequest(url, getT, requestHeaders);}
		catch(e){};
	k++;}

function getT(response){
	
	console.log("test")
	var temp = JSON.parse(response.text);
//	console.log(temp);
	console.log(++testCount+"\n"+temp['affiliation-retrieval-response']['affiliation-name']+"\n"+temp['affiliation-retrieval-response']['city']+"\n"+temp['affiliation-retrieval-response']['country']);
}

function panggil(){
    console.log("v1");
}