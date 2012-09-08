 var requestHeaders = {};
 var scopusId;
 var it;
 var referenceObject = new Array();
 var referenceSize;
 var currentReferenceSize;
 var citedbyUrl = new Array();
 var citedbyObject = new Array();
 var totalCitation;
 var totalCoauthors;8
 var statusCitedby=0;
 var statusCoauthors=0;
function getContextCallback(response) {
	context = response;
	var RefCount=40;
	document.getElementById("testing").innerHTML="lolol";
	var prefs= new gadgets.Prefs();
   
        requestHeaders['Accept-Charset'] = "utf-8";
        requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
        requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
        requestHeaders['Accept'] = "application/json, text/xml";
   
  	var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=REF&startref=0");
	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
	var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?query=affil(university)&co-author="+context.au1Id);

 	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
 	gadgets.sciverse.makeContentApiRequest(urlCoauthor, getCoauthor, requestHeaders);
		
 	
 //	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);
 
}
function getCoauthor(response){
    	console.log("coauthor");
	var temp = JSON.parse(response.text);
	console.log(temp);
	if(!statusCoauthors){
	totalCoauthors=temp['search-results']['opensearch:totalResults'];statusCoauthors=true;}
	console.log("totalCoauthors : "+totalCoauthors);
	for(var i=0;i<temp['search-results']['entry'].length;i++){
       		var urlCoauthor=temp['search-results']['entry'][i]['prism:url']; 		                       
		gadgets.sciverse.makeContentApiRequest(urlCoauthor, getCoauthorCallback, requestHeaders);
		}
}

function loadCoauthor(index){  
  if((index+1)*25<totalCoauthor){
  var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+index*25+"&count="+25+"&query=affil(university)&co-author="+context.au1Id); 
  }
  else 
  {
  var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+index*25+"&count="+(totalCoauthor-index*25)+"&query=affil(university)&co-author="+context.au1Id); 
  }
  gadgets.sciverse.makeContentApiRequest(urlCoauthor, getCoauthor, requestHeaders);
}
function getCoauthorCallback(response){
	console.log("coauthor details");
	var temp = JSON.parse(response.text);
	console.log(temp);
	var Obj= new Object();
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