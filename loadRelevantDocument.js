var relevantDocumentObject = new Array();
var statusRelevantDocument=0;
var totalRelevantDocument=-1;
var totalLevelRelevantDocument=0;
var currentLevelRelevantDocument=-1;
var lastLevelRelevantDocument=0;
var affiliationRelevantDocument= new Array();
var readyMoreRelevantDocument=1;
var urlRelevantDocument; // initally to get normal url relevant document without any parameter so can be extend
var relevantDocumentAffiliation; // city of specified query
function upRelevantDocument(){ 
  if(readyMoreRelevantDocument==0) return;
  if(currentLevelRelevantDocument==-1 || currentLevelRelevantDocument==totalLevelRelevantDocument) return false;
  currentLevelRelevantDocument++;
  if(currentLevelRelevantDocument==totalLevelRelevantDocument){
     if(relevantDocumentAffiliation)
     var urlTemp = encodeURI(urlRelevantDocument+" AND affil("+relevantDocumentAffiliation+")&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);&start="+((currentLevelRelevantDocument-1)*25)+"&count="+lastLevelRelevantDocument);
     else
     var urlTemp = encodeURI(urlRelevantDocument+"&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);&start="+((currentLevelRelevantDocument-1)*25)+"&count="+lastLevelRelevantDocument);}
  else 
  {  
     if(relevantDocumentAffiliation)
     var urlTemp =encodeURI(urlRelevantDocument+" AND affil("+relevantDocumentAffiliation+")&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);&start="+((currentLevelRelevantDocument-1)*25)+"&count=25");
     else
     var urlTemp=encodeURI(urlRelevantDocument+"&start="+((currentLevelRelevantDocument-1)*25)+"&count=25");}
  relevantDocumentObject=[];
  readyMoreRelevantDocument=0;
  gadgets.sciverse.makeContentApiRequest(urlTemp, getMoreRelevantDocument, requestHeaders);
  return true;
}

function downRelevantDocument(){
  if(readyMoreRelevantDocument==0) return;
  if(currentLevelRelevantDocument==-1 || currentLevelRelevantDocument==1) return false;
  currentLevelRelevantDocument--;
  if(relevantDocumentAffiliation)
  var urlTemp=encodeURI(urlRelevantDocument+" AND affil("+relevantDocumentAffiliation+")&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);&start="+((currentLevelRelevantDocument-1)*25)+"&count=25");
  else
  var urlTemp=encodeURI(urlRelevantDocument+"&start="+((currentLevelRelevantDocument-1)*25)+"&count=25");
  relevantDocumentObject=[];
  readyMoreRelevantDocument=0;
  gadgets.sciverse.makeContentApiRequest(urlTemp, getMoreRelevantDocument, requestHeaders);
}

function getRelevantDocument(response){
      	console.log("relevantDocument initial");
      	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	putRelevantDocumentData(temp);
	//affiliationRelevantDocument=returnArray(temp['search-results']['facet']['category']);
	if(totalRelevantDocument%25==0) { totalLevelRelevantDocument= Math.floor(totalRelevantDocument/25); lastLevelRelevantDocument=25;}
	else 			{ totalLevelRelevantDocument= Math.floor(totalRelevantDocument/25)+1;lastLevelRelevantDocument=totalRelevantDocument%25;}
	currentLevelRelevantDocument=1;
	readyMoreRelevantDocument=1;
//	getReferenceCity(relevantDocumentObject,getCityRelevantDocument); 
}

function getMoreRelevantDocument(response){
    	console.log("relevantDocument more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putRelevantDocumentData(temp);
    	readyMoreRelevantDocument=1;
//    	getReferenceCity(relevantDocumentObject,getCityRelevantDocument);
	}
	
	
function getCityRelevantDocument(response){
	getCityResponse(response,relevantDocumentObject,updateAllRelevantDocument);
}
function updateAllRelevantDocument(){
	console.log("hellooo");
	console.log(relevantDocumentObject);
	updateRelevantDocument(); //update david
}

function getRelevantDocumentFilter(affiliation){
	relevantDocumentAffiliation=affiliation;
	var url = encodeURI(urlRelevantDocument+" AND affil("+affiliation+")&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);");
	gadgets.sciverse.makeContentApiRequest(url, getRelevantDocument, requestHeaders);
}

function resetRelevantDocument(){
	relatedDocumentQuery(referenceObjectTemp);
}

function relatedDocumentQuery(buffer){
	var url="http://api.elsevier.com/content/search/index:SCOPUS?query=REFEID(";
	relevantDocumentAffiliation="";
	var count=0;
	for(var i=0;i<buffer.length;i++){
		scopusId=buffer[i]['scopus-id'];
		if(count==1){ urlRelevantDocument=urlRelevantDocument+" OR ";}
		if(i<numberRef){ urlRelevantDocument=urlRelevantDocument+"(2-s2.0-"+scopusId+")"; count=1;}
		
	}
	url=encodeURI(url+") AND NOT EID (2-s2.0-"+context.scDocId+")&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);");
	urlRelevantDocument=encodeURI(url+") AND NOT EID (2-s2.0-"+context.scDocId+")");
	gadgets.sciverse.makeContentApiRequest(url, getRelevantDocument, requestHeaders);
}

function putRelevantDocumentData(temp){
	if(!statusRelevantDocument){
	try	{totalRelevantDocument= temp['search-results']['opensearch:totalResults'];}
	catch(e){ updateRelevantDocument(); return;}
		statusRelevantDocument=true;}

	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No relevantDocument");
		return;}}
	catch(e){
	var buffer= returnArray(temp['search-results']['entry'])
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
		Obj.Abstract = buffer[i]['dc:description'];
		Obj.title =    buffer[i]['dc:title'];
       		Obj.type =     buffer[i]['subtypeDescription'];
       		Obj.citedbyCount = buffer[i]['citedby-count'];
       		Obj.creator= buffer[i]['dc:creator'];
       		Obj.publicationName = buffer[i]['prism:publicationName'];
       		var tempId=buffer[i]['dc:identifier'].split(":");
       		Obj.identifier= tempId[1];
     	  	Obj.date =buffer[i]['prism:coverDate'];
       		Obj.volume = buffer[i]['prim:volume'];
       		Obj.author=returnArray(buffer[i]['author']);     	
       		Obj.afid= returnArray(buffer[i]['affiliation'])[0]['afid'];
       		Obj.affilname= returnArray(buffer[i]['affiliation'])[0]['affilname'];
       		Obj.url="http://www.scopus.com/record/display.url?eid=2-s2.0-"+tempId[1]+"&origin=resultslist&sort=plf-f&src=s";
       	//	console.log(Obj);
		relevantDocumentObject.push(Obj);
		}
	}

}