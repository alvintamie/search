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

/*
var countingRef=0;
function getRefCitedby(scId,citedbyCount){
 
var url = encodeURI("http://api.elsevier.com/content/search/index:scopus?"+"query=refeid(2-s2.0-"+scId+")&field=scopus-id");
//var url=encodeURI("http://api.elsevier.com/content/search/mlt.url?eid=2-s2.0-84862690373&src=s&all=true&origin=recordpage&method=ref&zone=relatedDocuments");
//  console.log("url : "+url);
 gadgets.sciverse.makeContentApiRequest(url, loadRefCitedbyCallback, requestHeaders);
}

function loadRefCitedbyCallback(response){
  ++countingRef;
    console.log("citedby ref " + countingRef );
  //  console.log(response);
  var temp = JSON.parse(response.text);
//	console.log(temp);
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

*/