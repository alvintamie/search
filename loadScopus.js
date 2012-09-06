 var requestHeaders = {};
 var scopusId;
function getContextCallback(response) {
	context = response;
	var RefCount=40;
	document.getElementById("testing").innerHTML="lolol";
	var prefs= new gadgets.Prefs();
   
        requestHeaders['Accept-Charset'] = "utf-8";
        requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
        requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
        requestHeaders['Accept'] = "application/json, text/xml";
   
 //var url = encodeURI("http://api.elsevier.com/content/search/index:author?query=affil(university)&co-author="+context.au1Id);
 //var url = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=au-id("+context.au1Id+")&view=COMPLETE&facets=prefnameauid(count=30);country(count=30)");
   var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=REF&startref=0");
   //  var url = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-73949098611)&view=COMPLETE");
   //?view=REF&startref=0&refcount="+RefCount);
// var url = encodeURI("http://api.elsevier.com/content/article/pii:"+context.pii+"?view=REF&startref=0&refcount="+5);
   // view=authid&facets=au-id("+context.au1Id+")");
 	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);
//	document.getElementById("testing").innerHTML="lolol1"+url+" "+prefs.getString("contentApiKey");

}

function getRef(response){
	console.log("hello");
//	console.log("1: "+ response.data);	    
	var temp = JSON.parse(response.data);
	console.log(temp);
	console.log(temp['abstracts-retrieval-response']['references']['reference'].length);
	for(var i=0;i<temp['abstracts-retrieval-response']['references']['reference'].length;i++){
		scopusId=temp['abstracts-retrieval-response']['references']['reference'][i]['scopus-id'];
var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+scopusId+"?view=FULL");
	console.log(i+" : ");
gadgets.sciverse.makeContentApiRequest(urlRef, getRefAbstract, requestHeaders);
	}
}

function getRefAbstract(response){
	console.log("refAbstract v");
	console.log("oi = "+response.data);
	if(!response.data) console.log("horee");
	var temp = JSON.parse(response.data);
	console.log(temp);
}

function panggil(){
    console.log("v1");
}