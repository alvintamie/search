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
        var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*200)+"&count="+lastLevelCoauthors+"&query=affil(university)&co-author="+context.au1Id); }
  else 
  {    var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*200)+"&count=200&query=affil(university)&co-author="+context.au1Id);} 
  coauthorsObject=[];
  readyMoreCoauthors=0;
  gadgets.sciverse.makeContentApiRequest(urlCoauthors, getMoreCoauthors, requestHeaders);
  return true;
}

function downCoauthors(){
  if(readyMoreCoauthors==0) return;
  if(currentLevelCoauthors==-1 || currentLevelCoauthors==1) return false;
  currentLevelCoauthors--;
  var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*200)+"&count=200&query=affil(university)&co-author="+context.au1Id);
  coauthorsObject=[];
  readyMoreCoauthors=0;
  gadgets.sciverse.makeContentApiRequest(urlCoauthors, getMoreCoauthors, requestHeaders);
}

function getCoauthors(response){
    	console.log("coauthors initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	putCoauthorsData(temp);
	if(totalCoauthors%200==0) { totalLevelCoauthors= Math.floor(totalCoauthors/200); lastLevelCoauthors=200;}
	else 			{ totalLevelCoauthors= Math.floor(totalCoauthors/200)+1;lastLevelCoauthors=totalCoauthors%200;}
	currentLevelCoauthors=1;
	readyMoreCoauthors=1;
	updateCoauthors(coauthorsObject,0);
	showResult(0,coauthorsObject);
		showOverallCountryCoAuthor(filterReferenceCountry(coauthorsObject));
}

function getMoreCoauthors(response){
    	console.log("coauthors more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putCoauthorsData(temp);
    	readyMoreCoauthors=1;
	updateCoauthors(coauthorsObject,0);
	showResults(0,coauthorsObject);
	showOverallCountryCoAuthor(filterReferenceCountry(coauthorsObject));
}



function putCoauthorsData(temp){
	if(!statusCoauthors){
	try	{totalCoauthors= temp['search-results']['opensearch:totalResults'];}
	catch(e){ updateCoauthors(); return;}
		statusCoauthors=true;}

	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No coauthors");
		return;}}
	catch(e){
	var buffer= returnArray(temp['search-results']['entry'])
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
		try{
		Obj.city= buffer[i]['affiliation-current']['affiliation-city'];
       		Obj.country=buffer[i]['affiliation-current']['affiliation-country'];
       		Obj.affiliationId=buffer[i]['affiliation-current']['affiliation-id'];
       		Obj.affiliationName=buffer[i]['affiliation-current']['affiliation-name'];}
		catch(e){ console.log("coauthor no affiliation")};
       		Obj.id=buffer[i]['dc:identifier'].split(":")[1];
       		Obj.documentCount=buffer[i]['document-count'];
       		Obj.name=buffer[i]['preferred-name'];
       		Obj.url="http://www.scopus.com/authid/detail.url?authorId="+Obj.id;
       		console.log(Obj);
      		coauthorsObject.push(Obj);
		}
	}
}