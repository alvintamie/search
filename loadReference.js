var idToIndex= new Object();

function getRef(response){
  console.log("get all ref");	    
	var temp = JSON.parse(response.data);
	console.log(temp);
	referenceSize=temp['abstracts-retrieval-response']['references']['reference'].length
	console.log("SizeOfRef : "+temp['abstracts-retrieval-response']['references']['reference'].length);
	currentReferenceSize=0;
	for(var i=0;i<temp['abstracts-retrieval-response']['references']['reference'].length;i++){
		scopusId=temp['abstracts-retrieval-response']['references']['reference'][i]['scopus-id'];
		var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+scopusId+"?view=FULL");
		var Obj= new Object();
		Obj.title=temp['abstracts-retrieval-response']['references']['reference'][i]['sourcetitle'];
		Obj.citedbyCount=temp['abstracts-retrieval-response']['references']['reference'][i]['citedby-count'];
		Obj.identifier=scopusId;
		Obj.available=0;
		waiting(100);
		referenceObject.push(Obj);
		idToIndex[Obj.identifier]=i;
		gadgets.sciverse.makeContentApiRequest(urlRef, getRefAbstract, requestHeaders);
	//	var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+scopusId+"?view=REF&startref=0");
	//	getRefCitedby(scopusId,temp['abstracts-retrieval-response']['references']['reference'][i]['citedby-count'])
	}
}

function waiting( ms )
{
	var date = new Date();
	var curDate = null;
	while (curDate - date < ms) curDate = new Date();

}

function getRefAbstract(response){

console.log(currentReferenceSize++ + "ref abstract");
	var Obj= new Object();	
	if(!response.data) {
		console.log("NULL reference");
		Obj.available=1;
		return;}
    	try{
    	//	console.log(response);
    		var b=String(response.data);
    		//var n=b.indexOf("\"$\" :\}");
    	                       
    		var n;
    		while(b.indexOf("\"$\" :\}")>0){
 
    		b=b.replace("\"$\" :\}","    }");	}

       		var temp = JSON.parse(b);
       		console.log(temp);
       	
       		var tempId=temp['abstracts-retrieval-response']['coredata']['dc:identifier'].split(":");
       		var index = idToIndex[tempId[1]];
       	
       		referenceObject[index].available=2;
       		
       		referenceObject[index].abstract = temp['abstracts-retrieval-response']['coredata']['dc:description'];
      	
       		referenceObject[index].type = temp['abstracts-retrieval-response']['coredata']['prism:aggregation Type'];
       	//	Obj.title = temp['abstracts-retrieval-response']['coredata']['dc:title'];
       	//	Obj.citedbyCount = temp['abstracts-retrieval-response']['coredata']['citedby-count'];
       	//	Obj.identifier= tempId[1];
       		referenceObject[index].publicationName = temp['abstracts-retrieval-response']['coredata']['prism:publicationName'];
     	  	referenceObject[index].date = temp['abstracts-retrieval-response']['coredata']['prism:coverDate'];
     	  //	tempId=temp['abstracts-retrieval-response']['affiliation']['@href'].split(":");
     	  	
       		referenceObject[index].volume = temp['abstracts-retrieval-response']['coredata']['prim:volume'];
       		referenceObject[index].affiliation= temp['abstracts-retrieval-response']['affiliation']['affilname'];
       		referenceObject[index].author=temp['abstracts-retrieval-response']['authors'];     
       		referenceObject[index].affiliationId=temp['abstracts-retrieval-response']['affiliation']['@id'];
       		
   	   }
   
   catch(e){
       		console.log("JSON error");
       		referenceObject[index].affiliationId="NO INFO";
       		referenceObject[index].available=3;
    	}

}
