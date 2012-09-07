 var requestHeaders = {};
 var scopusId;
 var it;
 var referenceObject = new Array();
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
 //var urlRef = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
 //?view=REF&startref=0&refcount="+RefCount);
 //var url = encodeURI("http://api.elsevier.com/content/article/pii:"+context.pii+"?view=REF&startref=0&refcount="+5);
 //view=authid&facets=au-id("+context.au1Id+")");
 	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);
//	document.getElementById("testing").innerHTML="lolol1"+url+" "+prefs.getString("contentApiKey");

}

function getRef(response){
	console.log("hello");
//	console.log("1: "+ response.data);	    
	var temp = JSON.parse(response.data);
	console.log(temp);
	console.log(temp['abstracts-retrieval-response']['references']['reference'].length);
	it=0;
	for(var i=0;i<temp['abstracts-retrieval-response']['references']['reference'].length;i++){
		scopusId=temp['abstracts-retrieval-response']['references']['reference'][i]['scopus-id'];
var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+scopusId+"?view=FULL");
gadgets.sciverse.makeContentApiRequest(urlRef, getRefAbstract, requestHeaders);
	}
}

function getRefAbstract(response){

console.log(it++);
	var Obj= new Object();
	if(!response.data) {
		console.log("NULL reference");
		Obj.available=false;
		referenceObject.push(Obj);
		return;}
    	try{
       		var temp = JSON.parse(response.text);
       		console.log(temp);
       		Obj.available=true;
       		Obj.abstract = temp['abstract-retrieval-response']['coredata']['dc:description'];
       		Obj.title = temp['abstract-retrieval-response']['coredata']['dc:title'];
       		Obj.type = temp['abstract-retrieval-response']['coredata']['prism:aggregation Type'];
       		Obj.citedbyCount = temp['abstract-retrieval-response']['coredata']['citedby-count'];
       		Obj.publicationName = temp['abstract-retrieval-response']['coredata']['dc:description'];
       		Obj.identifier = temp['abstract-retrieval-response']['coredata']['dc:identifier'];
     	  	Obj.date = temp['abstract-retrieval-response']['coredata']['prism:coverDate'];
       		Obj.volume = temp['abstract-retrieval-response']['coredata']['prim:volume'];
       		Obj.affiliation= temp['abstract-retrieval-response']['affilname'];
       		Obj.author=temp['abstract-retrieval-response']['authors'];
       		
       		
		referenceObject.push(Obj);
   	   }catch(e){
       		console.log("JSON error");
       		Obj.available=false;
		referenceObject.push(Obj);
    	}

}

function panggil(){
    console.log("v1");
}