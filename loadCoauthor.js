var coauthorsObject = new Array();
var statusCoauthors=0;
var totalCoauthors=-1;
var totalLevelCoauthors=0;
var currentLevelCoauthors=-1;
var lastLevelCoauthors=0;
var affiliationCoauthors= new Array();
var readyMoreCoauthors=1;
function upCoauthors(){ 
  if(readyMoreCoauthors==0) return;
  if(currentLevelCoauthors==-1 || currentLevelCoauthors==totalLevelCoauthors) return false;
  currentLevelCoauthors++;
  if(currentLevelCoauthors==totalLevelCoauthors){
        var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*25)+"&count="+lastLevelCoauthors+"&query=affil(university)&co-author="+context.au1Id); }
  else 
  {    var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*25)+"&count=25&query=affil(university)&co-author="+context.au1Id);} 
  coauthorsObject=[];
  readyMoreCoauthors=0;
  gadgets.sciverse.makeContentApiRequest(urlCoauthors, getMoreCoauthors, requestHeaders);
  return true;
}

function downCoauthors(){
  if(readyMoreCoauthors==0) return;
  if(currentLevelCoauthors==-1 || currentLevelCoauthors==1) return false;
  currentLevelCoauthors--;
  var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*25)+"&count=25&query=affil(university)&co-author="+context.au1Id);
  coauthorsObject=[];
  readyMoreCoauthors=0;
  gadgets.sciverse.makeContentApiRequest(urlCoauthors, getMoreCoauthors, requestHeaders);
}

function getCoauthors(response){
    	console.log("coauthors initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	putCoauthorsData(temp);
//	affiliationCoauthors=returnArray(temp['search-results']['facet']['category']);
	if(totalCoauthors%25==0) { totalLevelCoauthors= Math.floor(totalCoauthors/25); lastLevelCoauthors=25;}
	else 			{ totalLevelCoauthors= Math.floor(totalCoauthors/25)+1;lastLevelCoauthors=totalCoauthors%25;}
	currentLevelCoauthors=1;
	readyMoreCoauthors=1;
	updateCoauthors();
}

function getMoreCoauthors(response){
    	console.log("coauthors more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putCoauthorsData(temp);
    	readyMoreCoauthors=1;
	updateCoauthors();}

function putCoauthorsData(temp){
	if(!statusCoauthors){
	try	{totalCoauthors= temp['search-results']['opensearch:totalResults'];}
	catch(e){ updateCoauthors(); return;}
		statusCoauthors=true;}

	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No coauthors");
		return;}}
	catch(e){
	//	var buffer;
	var buffer= returnArray(temp['search-results']['entry'])
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
	//	if( Object.prototype.toString.call( temp ['search-results']['entry']) === '[object Array]' ) {
	//	       buffer= temp['search-results']['entry'][i];}
//		else{  buffer= temp['search-results']['entry'];}
		try{
		Obj.city= buffer[i]['affiliation-current']['affiliation-city'];
       		Obj.country=buffer[i]['affiliation-current']['affiliation-country'];
       		Obj.affiliationId=buffer[i]['affiliation-current']['affiliation-id'];
       		Obj.affiliationName=buffer[i]['affiliation-current']['affiliation-name'];}
		catch(e){};
       		Obj.id=buffer[i]['dc:identifier'].split(":")[1];
       		Obj.documentCount=buffer[i]['document-count'];
       		Obj.name=buffer[i]['preferred-name'];
       		console.log(Obj);
       	//	Obj.url="http://www.scopus.com/record/display.url?eid=2-s2.0-"+tempId[1]+"&origin=resultslist&sort=plf-f&src=s";
		coauthorsObject.push(Obj);
		}
	}

}