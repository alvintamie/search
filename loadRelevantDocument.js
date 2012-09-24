var relevantDocumentObject = new Array();
var countryRelevantDocument= new Array();
var statusRelevantDocument=0;
var totalRelevantDocument=-1;
var totalLevelRelevantDocument=0;
var currentLevelRelevantDocument=-1;
var lastLevelRelevantDocument=0;
var readyMoreRelevantDocument=1;
var urlRelevantDocument; // initally to get normal url relevant document without any parameter so can be extend
var relevantDocumentAffiliation=""; // city of specified query
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
     var urlTemp = encodeURI(urlRelevantDocument+"&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);&start="+((currentLevelRelevantDocument-1)*25)+"&count=25");}
  relevantDocumentObject=[];
  readyMoreRelevantDocument=0;
  console.log(urlTemp);
  loadingStatus++;
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
  var urlTemp = encodeURI(urlRelevantDocument+"&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);&start="+((currentLevelRelevantDocument-1)*25)+"&count=25");
  relevantDocumentObject=[];
  readyMoreRelevantDocument=0;
  loadingStatus++;
  gadgets.sciverse.makeContentApiRequest(urlTemp, getMoreRelevantDocument, requestHeaders);
}

function getRelevantDocument(response){
        loadingStatus--;
      	console.log("relevantDocument initial");
      	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	putRelevantDocumentData(temp);
	if(totalRelevantDocument%25==0) { totalLevelRelevantDocument= Math.floor(totalRelevantDocument/25); lastLevelRelevantDocument=25;}
	else 			{ totalLevelRelevantDocument= Math.floor(totalRelevantDocument/25)+1;lastLevelRelevantDocument=totalRelevantDocument%25;}
	currentLevelRelevantDocument=1;
	readyMoreRelevantDocument=1;    	
	console.log("anak ajaib");
    	console.log(relevantDocumentObject);
	updateRelevantDocument(relevantDocumentObject,0);
	
	getReferenceCity(relevantDocumentObject,getCityRelevantDocument); 
}

function getMoreRelevantDocument(response){
        loadingStatus--;
    	console.log("relevantDocument more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putRelevantDocumentData(temp);
    	readyMoreRelevantDocument=1;
    	updateRelevantDocument(relevantDocumentObject,0);
   	getReferenceCity(relevantDocumentObject,getCityRelevantDocument);
	}
	

function getCityRelevantDocument(response){
	getCityResponse(response,relevantDocumentObject,updateAllRelevantDocument);
}
function updateAllRelevantDocument(){
	console.log("got city of relevant document");
	console.log(relevantDocumentObject);
    	changeModeRelevantDocument();
	showResult(relevantDocumentMode,relevantDocumentObject);
}


function getRelevantDocumentFilter1(array){
	console.log("get Coauthors filter all");
	var affiliation="";
	if(array.length==1) affiliation=array[0].country;
	else
	for(var i=0;i<array.length;i++){
		if(i!=0) 
		affiliation=affiliation+" OR ";
		affiliation=affiliation+"("+array[i].country+")";
	}
	relevantDocumentAffiliation=affiliation;
	console.log(affiliation+" + "+array[0].country);
	var url = encodeURI(urlRelevantDocument+" AND AFFILCOUNTRY("+affiliation+")&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);");
	console.log(url);
	resetRelevantDocument();
	gadgets.sciverse.makeContentApiRequest(url, getRelevantDocument, requestHeaders);
}

function getRelevantDocumentFilter2(response){
	console.log("get Coauthors filter 25");

	var temp=new Array();
	for(var i=0;i<relevantDocumentObject.length;i++){
		for(var j=0;j<response.length;j++){
		if(relevantDocumentObject[i].country==response[j])
			{ temp.push(relevantDocumentObject[i]);}
	}}
	console.log(temp);
	updateRelevantDocument(temp,1);
	showResult(relevantDocumentMode,relevantDocumentObject);
}

function changeModeRelevantDocument(){
	console.log("change mode");
	console.log(relevantDocumentObject);
	showOverallCountryRelevantDocument(filterReferenceCountry(relevantDocumentObject));
}



function resetQueryRelevantDocument(){
		resetRelevantDocument();
	relatedDocumentQuery(referenceObjectTemp);
}

function changeModeRelevantDocument1(){
	showOverallCountryRelevantDocument(filterReferenceCountry(countryRelevantDocument));	
}

function resetRelevantDocument(){
relevantDocumentObject = new Array();
countryRelevantDocument= new Array();
statusRelevantDocument=0;
totalRelevantDocument=-1;
totalLevelRelevantDocument=0;
currentLevelRelevantDocument=-1;
lastLevelRelevantDocument=0;
readyMoreRelevantDocument=1;
relevantDocumentAffiliation="";
}
function relatedDocumentQuery(buffer){
	var url="http://api.elsevier.com/content/search/index:SCOPUS?query=REFEID(";
	relevantDocumentAffiliation="";
	var count=0;
	for(var i=0;i<buffer.length;i++){
		scopusId=buffer[i]['scopus-id'];
		if(count==1){ url=url+" OR ";}
		if(i<numberRef){ url=url+"(2-s2.0-"+scopusId+")"; count=1;}
		
	}
	urlRelevantDocument=encodeURI(url+")");
	url=encodeURI(url+") AND NOT EID (2-s2.0-"+context.scDocId+")&view=COMPLETE&sort=+relevance&facets=country(count=200,sort=fd);");	
	loadingStatus++;
	gadgets.sciverse.makeContentApiRequest(url, getRelevantDocument, requestHeaders);
}

function putRelevantDocumentData(temp){
	if(!statusRelevantDocument){
	try	{totalRelevantDocument= temp['search-results']['opensearch:totalResults'];
		total_Relevant_Document=totalRelevantDocument;
	
	}
	catch(e){ updateRelevantDocument(); return;}
		statusRelevantDocument=true;}

	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No relevantDocument");
		return;}}
	catch(e){
	var buffer= returnArray(temp['search-results']['entry']);
	countryRelevantDocument=returnArray(temp['search-results']['facet']['category']);
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
	    try{
		Obj.Abstract = buffer[i]['dc:description'];
		Obj.title =    buffer[i]['dc:title'];
       		Obj.type =     buffer[i]['subtypeDescription'];
       		Obj.citedbyCount = buffer[i]['citedby-count'];
       		Obj.creator= buffer[i]['dc:creator'];
       		Obj.publicationName = buffer[i]['prism:publicationName'];
       		var tempId=buffer[i]['dc:identifier'].split(":");
       		Obj.scopusId= tempId[1];
     	  	Obj.date =buffer[i]['prism:coverDate'];
       		Obj.volume = buffer[i]['prim:volume'];
       		Obj.author=returnArray(buffer[i]['author']);
       		Obj.authorId=Obj.author[0]['afid'];
       		try{
       			Obj.afid= returnArray(buffer[i]['affiliation'])[0]['afid'];
       			Obj.affilname= returnArray(buffer[i]['affiliation'])[0]['affilname'];}
       		catch(e){ console.log("error no affiliation in relevant document");}
	    	}
	    catch(e){ console.log("error no some property in relevant document");}
       		Obj.url="http://www.scopus.com/record/display.url?eid=2-s2.0-"+tempId[1]+"&origin=resultslist&sort=plf-f&src=s";
       	//	console.log(Obj);
		relevantDocumentObject.push(Obj);
		}
	}

}