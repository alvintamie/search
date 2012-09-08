 var requestHeaders = {};
 var scopusId;
 var it;
 var referenceObject = new Array();
 var referenceSize;
 var currentReferenceSize;
 var citedbyUrl = new Array();
 var citedbyObject = new Array();
 var totalCitation;
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
 	var urlSelf = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=FULL&startref=0");
 	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
	var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?query=affil(university)&co-author="+context.au1Id);
//var urlCoauthor=encodeURI("http://api.elsevier.com/content/author/author_id:"+context.au1Id);
//?view=REF&startref=0&refcount="+RefCount);
 //var url = encodeURI("http://api.elsevier.com/content/article/pii:"+context.pii+"?view=REF&startref=0&refcount="+5);
 //view=authid&facets=au-id("+context.au1Id+")");
 	gadgets.sciverse.makeContentApiRequest(
 				urlSelf, 
 				function (response){
					console.log("self");	
					var temp = JSON.parse(response.text);
					console.log(temp);
					totalCitation = temp['abstracts-retrieval-response']['coredata']['citedby-count'];
					gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
 				}, 
 					requestHeaders);	
 	
 	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);
 	gadgets.sciverse.makeContentApiRequest(urlCoauthor, getCoauthor, requestHeaders);
//	document.getElementById("testing").innerHTML="lolol1"+url+" "+prefs.getString("contentApiKey");

}
function getCoauthor(response){
    	console.log("coauthor");
	var temp = JSON.parse(response.text);
	console.log(temp);
	
		for(var i=0;i<temp['search-results']['entry'].length;i++){
       		var urlCoauthor=temp['search-results']['entry'][i]['prism:url']; 	
	                          
		console.log(urlCoauthor);
			gadgets.sciverse.makeContentApiRequest(urlCoauthor, getCoauthorCallback, requestHeaders);
		}
}

function getCoauthorCallback(response){
	console.log("coauthor details");
	var temp = JSON.parse(response.text);
	console.log(temp);
	var Obj= new Object();
}
function getCitedby(response){
    	console.log("citedby initial")
	var temp = JSON.parse(response.text);
	console.log(temp);
	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No citedby");
		return;}}
	catch(e){	
	for(var i=0;i<temp['search-results']['entry'].length;i++){
		var Obj= new Object();
		Obj.abstract = temp['search-results']['entry'][i]['dc:description'];
		Obj.title =    temp['search-results']['entry'][i]['dc:title'];
       		Obj.type =     temp['search-results']['entry'][i]['subtypeDescription'];
       		Obj.citedbyCount = temp['search-results']['entry'][i]['citedby-count'];
       		Obj.creator= temp['search-results']['entry'][i]['creator'];
       		Obj.publicationName = temp['search-results']['entry'][i]['prism:publicationName'];
       		var tempId=temp['search-results']['entry'][i]['dc:identifier'].split(":");
       		Obj.identifier= tempId[1];
     	  	Obj.date = temp['search-results']['entry'][i]['prism:coverDate'];
       		Obj.volume = temp['search-results']['entry'][i]['prim:volume'];
       		Obj.author=temp['search-results']['entry'][i]['author'];     	
       		Obj.affiliation= temp['search-results']['entry'][i]['affiliation'];
		citedbyObject.push(Obj);
		}
	}
}
function getRef(response){
	console.log("get all ref");
//	console.log("1: "+ response.data);	    
	var temp = JSON.parse(response.data);
	console.log(temp);
	referenceSize=temp['abstracts-retrieval-response']['references']['reference'].length
	console.log("SizeOfRef : "+temp['abstracts-retrieval-response']['references']['reference'].length);
	currentReferenceSize=0;
	for(var i=0;i<temp['abstracts-retrieval-response']['references']['reference'].length;i++){
		scopusId=temp['abstracts-retrieval-response']['references']['reference'][i]['scopus-id'];
	//	var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+scopusId+"?view=FULL");
		var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+scopusId+"?view=REF&startref=0");
	//	gadgets.sciverse.makeContentApiRequest(urlRef, getRefAbstract, requestHeaders);
	//	getRefCitedby(scopusId,temp['abstracts-retrieval-response']['references']['reference'][i]['citedby-count'])
	}
}

function getRefAbstract(response){

console.log(currentReferenceSize++ + "ref abstract");
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
       		
       		Obj.abstract = temp['abstracts-retrieval-response']['coredata']['dc:description'];
      		Obj.title = temp['abstracts-retrieval-response']['coredata']['dc:title'];
       		Obj.type = temp['abstracts-retrieval-response']['coredata']['prism:aggregation Type'];
       		Obj.citedbyCount = temp['abstracts-retrieval-response']['coredata']['citedby-count'];
       		Obj.publicationName = temp['abstracts-retrieval-response']['coredata']['prism:publicationName'];
       		var tempId=temp['abstracts-retrieval-response']['coredata']['dc:identifier'].split(":");
       		Obj.identifier= tempId[1];
     	  	Obj.date = temp['abstracts-retrieval-response']['coredata']['prism:coverDate'];
       		Obj.volume = temp['abstracts-retrieval-response']['coredata']['prim:volume'];
       		Obj.affiliation= temp['abstracts-retrieval-response']['affilname'];
       		Obj.author=temp['abstracts-retrieval-response']['authors'];     		
		referenceObject.push(Obj);
   	   }
   	catch(e){
       		console.log("JSON error");
       		Obj.available=false;
		referenceObject.push(Obj);
    	}

}

function panggil(){
    console.log("v1");
}