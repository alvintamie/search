var idToIndex= new Object();
var readyRef=0;
var numberRef=0;
var currentReferenceSize=0;
function getRef(response){
  try{
  	console.log("ref is obtained");
	var temp = JSON.parse(response.data);
	console.log(temp);
	referenceSize=temp['abstracts-retrieval-response']['references']['reference'].length
	console.log("SizeOfRef : "+temp['abstracts-retrieval-response']['references']['reference'].length);
	numberRef=temp['abstracts-retrieval-response']['references']['reference'].length;
		readyRef=1; //
	createDivReference();
	var urlRelevantDocument="http://api.elsevier.com/content/search/index:SCOPUS?query=REFEID(";
	for(var i=0;i<temp['abstracts-retrieval-response']['references']['reference'].length;i++){
		scopusId=temp['abstracts-retrieval-response']['references']['reference'][i]['scopus-id'];
		if(i<numberRef){ urlRelevantDocument=urlRelevantDocument+"(2-s2.0-"+scopusId+")";}
		if(i<numberRef-1){ urlRelevantDocument=urlRelevantDocument+" OR ";}
		var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+scopusId+"?view=FULL");
		var Obj= new Object();
		Obj.citedbyCount=temp['abstracts-retrieval-response']['references']['reference'][i]['citedby-count'];
		Obj.identifier=scopusId;
		Obj.available=0;
		waiting(50);
		referenceObject.push(Obj);
		idToIndex[Obj.identifier]=i;
		gadgets.sciverse.makeContentApiRequest(urlRef, getRefAbstract, requestHeaders);
		}
	urlRelevantDocument=encodeURI(urlRelevantDocument+") AND NOT EID (2-s2.0-"+context.scDocId+")&sort=+relevance");
	gadgets.sciverse.makeContentApiRequest(urlRelevantDocument, getRelevantDocument, requestHeaders);
	}
  catch(e){
  	console.log("No reference Available");
  	readyRef=2;
  	createDivReference();
  }
}

function getRelevantDocument(response){
		console.log("related document");
		var temp = JSON.parse(parseValidator(response.data));
       		console.log(temp);
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
		console.log("NULL reference, JSON is returned but NO DATA");
		Obj.available=1;
		return;}
    	try{
    		var b=String(response.data);  	                       
    		var n;
    		
    		while(b.indexOf("\"$\" :\}")>0){
    			b=b.replace("\"$\" :\}","    }");	}
    		
       		var temp = JSON.parse(b);
       	//	console.log(temp);
       	
       		var tempId=temp['abstracts-retrieval-response']['coredata']['dc:identifier'].split(":");
       		var index = idToIndex[tempId[1]];
       	
       		referenceObject[index].available=2;
       		
       		referenceObject[index].Abstract = temp['abstracts-retrieval-response']['coredata']['dc:description'];
       		referenceObject[index].type = temp['abstracts-retrieval-response']['coredata']['prism:aggregation Type'];
       		referenceObject[index].title = temp['abstracts-retrieval-response']['coredata']['dc:title'];
       	//	Obj.citedbyCount = temp['abstracts-retrieval-response']['coredata']['citedby-count'];
       	//	Obj.identifier= tempId[1];
       		referenceObject[index].publicationName = temp['abstracts-retrieval-response']['coredata']['prism:publicationName'];
     	  	referenceObject[index].date = temp['abstracts-retrieval-response']['coredata']['prism:coverDate'];
     	  	tempId=temp['abstracts-retrieval-response']['affiliation']['@href'].split(":");
     	  	referenceObject[index].url = "http://www.scopus.com/record/display.url?eid=2-s2.0-"+tempId[1]+"&origin=resultslist&sort=plf-f&src=s";
       	
       		referenceObject[index].volume = temp['abstracts-retrieval-response']['coredata']['prim:volume'];
       		referenceObject[index].affiliation= temp['abstracts-retrieval-response']['affiliation']['affilname'];
       		referenceObject[index].author=temp['abstracts-retrieval-response']['authors'];     
       		referenceObject[index].affiliationId=temp['abstracts-retrieval-response']['affiliation']['@id'];
       		insertReference(index);
   	   }
   
   catch(e){
       		console.log("JSON error");
       		referenceObject[index].affiliationId="NO INFO";
       		referenceObject[index].available=3;
    	}
	
}

function parseValidator(b){
		while(b.indexOf("\"$\" :\}")>0){
    			b=b.replace("\"$\" :\}","    }");	}
    		return b;
}