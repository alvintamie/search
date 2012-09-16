var relevantDocumentObject = new Array();
var statusRelevantDocument=0;
var totalRelevantDocument=-1;
var totalLevelRelevantDocument=0;
var currentLevelRelevantDocument=-1;
var lastLevelRelevantDocument=0;
var affiliationRelevantDocument= new Array();
var readyMoreRelevantDocument=1;
function upRelevantDocument(){ 
  if(readyMoreRelevantDocument==0) return;
  if(currentLevelRelevantDocument==-1 || currentLevelRelevantDocument==totalLevelRelevantDocument) return false;
  currentLevelRelevantDocument++;
  if(currentLevelRelevantDocument==totalLevelRelevantDocument){
     var urlTemp=encodeURI(urlRelevantDocument+"&start="+((currentLevelRelevantDocument-1)*25)+"&count="+lastLevelRelevantDocument);}
  else 
  {  var urlTemp=encodeURI(urlRelevantDocument+"&start="+((currentLevelRelevantDocument-1)*25)+"&count=25");}
  relevantDocumentObject=[];
  readyMoreRelevantDocument=0;
  gadgets.sciverse.makeContentApiRequest(urlTemp, getMoreRelevantDocument, requestHeaders);
  return true;
}

function downRelevantDocument(){
  if(readyMoreRelevantDocument==0) return;
  if(currentLevelRelevantDocument==-1 || currentLevelRelevantDocument==1) return false;
  currentLevelRelevantDocument--;
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
	affiliationRelevantDocument=returnArray(temp['search-results']['facet']['category']);
	if(totalRelevantDocument%25==0) { totalLevelRelevantDocument= Math.floor(totalRelevantDocument/25); lastLevelRelevantDocument=25;}
	else 			{ totalLevelRelevantDocument= Math.floor(totalRelevantDocument/25)+1;lastLevelRelevantDocument=totalRelevantDocument%25;}
	currentLevelRelevantDocument=1;
	readyMoreRelevantDocument=1;
//	for(var i=0;i<relevantDocumentObject.length;i++) console.log(relevantDocumentObject[i].Abstract);
	updateRelevantDocument();
}

function getMoreRelevantDocument(response){
    	console.log("relevantDocument more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putRelevantDocumentData(temp);
    	readyMoreRelevantDocument=1;
	updateRelevantDocument();}

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
       		Obj.creator= buffer[i]['creator'];
       		Obj.publicationName = buffer[i]['prism:publicationName'];
       		var tempId=buffer[i]['dc:identifier'].split(":");
       		Obj.identifier= tempId[1];
     	  	Obj.date =buffer[i]['prism:coverDate'];
       		Obj.volume = buffer[i]['prim:volume'];
       		Obj.author=returnArray(buffer[i]['author']);     	
       		Obj.affiliation= returnArray(buffer[i]['affiliation']);
       		Obj.url="http://www.scopus.com/record/display.url?eid=2-s2.0-"+tempId[1]+"&origin=resultslist&sort=plf-f&src=s";
       	//	console.log(Obj);
       		
		relevantDocumentObject.push(Obj);
		}
	}

}