var citedbyObject = new Array();
var statusCitedby=0;
var totalCitation=-1;
var totalLevelCitation=0;
var currentLevelCitation=-1;
var lastLevelCitation=0;
var affiliationCitation= new Array();
var readyMoreCitation=1;
function upCitedby(){ 
  if(readyMoreCitation==0) return;
  if(currentLevelCitation==-1 || currentLevelCitation==totalLevelCitation) return false;
  currentLevelCitation++;
  if(currentLevelCitation==totalLevelCitation){
    var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count="+lastLevelCitation+"&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");}
  else 
  {var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");}
  citedbyObject=[];
  readyMoreCitation=0;
  gadgets.sciverse.makeContentApiRequest(urlCitedby, getMoreCitedby, requestHeaders);
  return true;
}

function downCitedby(){
  if(readyMoreCitation==0) return;
  if(currentLevelCitation==-1 || currentLevelCitation==1) return false;
  currentLevelCitation--;
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
  citedbyObject=[];
  readyMoreCitation=0;
  gadgets.sciverse.makeContentApiRequest(urlCitedby, getMoreCitedby, requestHeaders);
}

function getCitedby(response){
    	console.log("citedby initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	putCitedbyData(temp);
	affiliationCitation=returnArray(temp['search-results']['facet']['category']);
	if(totalCitation%25==0) { totalLevelCitation= Math.floor(totalCitation/25); lastLevelCitation=25;}
	else 			{ totalLevelCitation= Math.floor(totalCitation/25)+1;lastLevelCitation=totalCitation%25;}
	currentLevelCitation=1;
	readyMoreCitation=1;
	updateCitedBy();
}

function getMoreCitedby(response){
    	console.log("citedby more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putCitedbyData(temp);
    	readyMoreCitation=1;
	updateCitedBy();}

function putCitedbyData(temp){
	if(!statusCitedby){
	try	{totalCitation= temp['search-results']['opensearch:totalResults'];}
	catch(e){ updateCitedBy(); return;}
		statusCitedby=true;}
		
	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No citedby");
		return;}}
	catch(e){
	//	var buffer;
	var buffer= returnArray(temp['search-results']['entry'])
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
	//	if( Object.prototype.toString.call( temp ['search-results']['entry']) === '[object Array]' ) {
	//	       buffer= temp['search-results']['entry'][i];}
//		else{  buffer= temp['search-results']['entry'];}
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
		citedbyObject.push(Obj);
		}
	}
	
}

function returnArray(a){
		if( Object.prototype.toString.call( a ) === '[object Array]' ) {
		       return a;}
		else{  var b = new Array();
		       b.push(a);
		       return b;}
}