var coauthorsObject = new Array();
var statuscoauthors=0;
var totalCoauthors=-1;
var totalLevelCoauthors=0;
var currentLevelCoauthors=-1;
var lastLevelCoauthors=0;
var affiliationCoauthors= new Array();
var readyMoreCoauthors=1;
function upcoauthors(){ 
  if(readyMoreCoauthors==0) return;
  if(currentLevelCoauthors==-1 || currentLevelCoauthors==totalLevelCoauthors) return false;
  currentLevelCoauthors++;
  if(currentLevelCoauthors==totalLevelCoauthors){
        var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*25)+"&count="+lastLevelCoauthors+"&query=affil(university)&co-author="+context.au1Id); }
  else 
  {    var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*25)+"&count=25&query=affil(university)&co-author="+context.au1Id);} 
  coauthorsObject=[];
  readyMoreCoauthors=0;
  gadgets.sciverse.makeContentApiRequest(urlcoauthors, getMorecoauthors, requestHeaders);
  return true;
}

function downcoauthors(){
  if(readyMoreCoauthors==0) return;
  if(currentLevelCoauthors==-1 || currentLevelCoauthors==1) return false;
  currentLevelCoauthors--;
  var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*25)+"&count=25&query=affil(university)&co-author="+context.au1Id);
  coauthorsObject=[];
  readyMoreCoauthors=0;
  gadgets.sciverse.makeContentApiRequest(urlcoauthors, getMorecoauthors, requestHeaders);
}

function getcoauthors(response){
    	console.log("coauthors initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	putcoauthorsData(temp);
	affiliationCoauthors=returnArray(temp['search-results']['facet']['category']);
	if(totalCoauthors%25==0) { totalLevelCoauthors= Math.floor(totalCoauthors/25); lastLevelCoauthors=25;}
	else 			{ totalLevelCoauthors= Math.floor(totalCoauthors/25)+1;lastLevelCoauthors=totalCoauthors%25;}
	currentLevelCoauthors=1;
	readyMoreCoauthors=1;
	updatecoauthors();
}

function getMorecoauthors(response){
    	console.log("coauthors more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putcoauthorsData(temp);
    	readyMoreCoauthors=1;
	updatecoauthors();}

function putcoauthorsData(temp){
	if(!statuscoauthors){
	try	{totalCoauthors= temp['search-results']['opensearch:totalResults'];}
	catch(e){ updatecoauthors(); return;}
		statuscoauthors=true;}

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

		Obj.city= buffer[i]['affiliation-current']['affiliation-city'];
       		Obj.country=buffer[i]['affiliation-current']['affiliation-country'];
       		Obj.affiliationId=buffer[i]['affiliation-current']['affiliation-id'];
       		Obj.affiliationName=buffer[i]['affiliation-current']['affiliation-name'];
       		Obj.affiliationId=buffer[i]['affiliation-current']['affiliation-id'];
       		Obj.id=buffer[i]['dc:identifier'];
       		Obj.documentCount=buffer[i]['document-count'];
       		Obj.name=buffer[i]['name-variant'];
       		console.log(Obj);
       	//	Obj.url="http://www.scopus.com/record/display.url?eid=2-s2.0-"+tempId[1]+"&origin=resultslist&sort=plf-f&src=s";
		coauthorsObject.push(Obj);
		}
	}

}