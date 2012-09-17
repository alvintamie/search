var idToIndex= new Object();
var readyRef=0;
var numberRef=0;
var currentReferenceSize=0;
var urlRelevantDocument;
var affiliationReference= new Array();
var referenceObject = new Array();
var referenceSize;
var currentReferenceSize;
var searchElement= new Array("All","Affiliation","City","Country","Organization","Abstract","Author Name","Author First Name","Author Last Name","First Author","Keywords","Reference","Source Title","Article Title","Subject Area");
function getRef(response){
//  try{
  	console.log("ref is obtained");
	var temp = JSON.parse(response.data);
	console.log(temp);
	var buffer=temp['abstracts-retrieval-response']['references']['reference'];
	referenceSize=buffer.length;
	console.log("SizeOfRef : "+buffer.length);
	numberRef=buffer.length;
	readyRef=1;
	referenceObject=[];
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
		Obj.author=returnArray(buffer[i]['author-list']['author']);
		Obj.citedby=buffer[i]['citedby-count'];
		Obj.sourcetitle=buffer[i]['sourcetitle'];
		Obj.scopusId=buffer[i]['scopus-id'];
		idToIndex[Obj.scopusId]=i;
		referenceObject.push(Obj);
	}
	relatedDocumentQuery(buffer);
	referenceQuery(buffer);
}

function getReference(response){
	console.log("ref details is obtained");
//	console.log(response);
	console.log(response);
	var temp = JSON.parse(response.data);
	console.log(temp);
	buffer=returnArray(temp['search-results']['entry']);
	for(var i=0;i<buffer.length;i++){
		try{
			var index=idToIndex[buffer[i]['dc:identifier'].split(':')[1]];
			var tempAffil= returnArray(buffer[i]['affiliation']);
			referenceObject[index].afid=tempAffil[0]['afid'];
			referenceObject[index].affilname=tempAffil[0]['affilname'];
			referenceObject[index].authkeywords=buffer[i]['authkeywords'];
			referenceObject[index].creator=buffer[i]['dc:creator'];
			referenceObject[index].abstract=buffer[i]['dc:description'];
			referenceObject[index].title=buffer[i]['dc:title'];
			referenceObject[index].publicationName=buffer[i]['publicationName'];
			referenceObject[index].volume=buffer[i]['volume'];
			referenceObject[index].type=buffer[i]['subtypeDescription'];
			
		}
		catch(e){
			console.log("Reference details at index "+i+" is error");}
	}
	
     // updateReference();
      getReferenceCity();
}
function getReferenceCity(){
	console.log("get Reference city");
//	urlCity="http://api.elsevier.com/content/search/index:SCOPUS?in60029157 60016912
//	for(var i=0;i<referenceObject.length){
		
//	}	
	urlCity="http://api.elsevier.com/content/search/index:affiliation?query=AFID(60016912)+AFID(60016912)";
	gadgets.sciverse.makeContentApiRequest(urlCity, getCity, requestHeaders);	
}
function getCity(response){
	console.log("get City now");
	console.log(response);
	var temp = JSON.parse(response.data);
	console.log(temp);
}
function referenceQuery(buffer){
	urlReference="http://api.elsevier.com/content/search/index:SCOPUS?query=EID(";
	for(var i=0;i<buffer.length;i++){
		scopusId=buffer[i]['scopus-id'];
		if(i<numberRef){ urlReference=urlReference+"(2-s2.0-"+scopusId+")";}
		if(i<numberRef-1){ urlReference=urlReference+" OR ";}
	}
	urlReference=encodeURI(urlReference+")&view=COMPLETE&facets=country(count=200,sort=fd);");
	gadgets.sciverse.makeContentApiRequest(urlReference, getReference, requestHeaders);
}

function relatedDocumentQuery(buffer){
	urlRelevantDocument="http://api.elsevier.com/content/search/index:SCOPUS?query=REFEID(";
	for(var i=0;i<buffer.length;i++){
		scopusId=buffer[i]['scopus-id'];
		if(i<numberRef){ urlRelevantDocument=urlRelevantDocument+"(2-s2.0-"+scopusId+")";}
		if(i<numberRef-1){ urlRelevantDocument=urlRelevantDocument+" OR ";}
	}
	urlRelevantDocument=encodeURI(urlRelevantDocument+") AND NOT EID (2-s2.0-"+context.scDocId+")&view=COMPLETE&sort=+relevance&&facets=country(count=200,sort=fd);");
	gadgets.sciverse.makeContentApiRequest(urlRelevantDocument, getRelevantDocument, requestHeaders);
}


