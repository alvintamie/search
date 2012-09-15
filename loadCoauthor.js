var coauthorsObject= new Array();
var totalCoauthors=-1;
var statusCoauthors=0;
var totalLevelCoauthors=0;
var lastLevelCoauthors=0;
var currentLevelCoauthors=-1;

function upCoauthors(){  
  if(currentLevelCoauthors==-1 || currentLevelCoauthors==totalLevelCoauthors) return false;
  if(currentLevelCoauthors==totalLevelCoauthors-1){
    var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*25)+"&count="+lastLevelCoauthors+"&query=affil(university)&co-author="+context.au1Id); 
  }
  else 
  {    var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+((currentLevelCoauthors-1)*25)+"&count=25&query=affil(university)&co-author="+context.au1Id);} 
   coauthorsObject=[];
  currentLevelCoauthors++;
  gadgets.sciverse.makeContentApiRequest(urlCoauthors, getMoreCoauthors, requestHeaders);
}

function downCoauthors(){
  if(currentLevelCoauthors==-1 || currentLevelCoauthors==1) return false;
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCoauthors-2)*25)+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
  coauthorsObject=[];
  currentLevelCoauthors--;
  gadgets.sciverse.makeContentApiRequest(urlCoauthors, getMoreCoauthors, requestHeaders);
}



function getCoauthor(response){
      	console.log("coauthor initial");
	var temp = JSON.parse(response.text);
	console.log(temp);
	if(!statusCoauthors){
	totalCoauthors=temp['search-results']['opensearch:totalResults'];statusCoauthors=true;}
	console.log("totalCoauthors : "+totalCoauthors);
	for(var i=0;i<temp['search-results']['entry'].length;i++){
       		var Obj= new Object();
       		Obj.city= temp['search-results']['entry'][i]['affiliation-current']['affiliation-city'];
       		Obj.country=temp['search-results']['entry'][i]['affiliation-current']['affiliation-country'];
       		Obj.affiliationId=temp['search-results']['entry'][i]['affiliation-current']['affiliation-id'];
       		Obj.affiliationName=temp['search-results']['entry'][i]['affiliation-current']['affiliation-name'];
       		Obj.affiliationId=temp['search-results']['entry'][i]['affiliation-current']['affiliation-id'];
       		Obj.id=temp['search-results']['entry'][i]['dc:identifier'];
       		Obj.documentCount=temp['search-results']['entry'][i]['document-count'];
       		Obj.name=temp['search-results']['entry'][i]['name-variant'];
       		coauthorsObject.push(Obj);
		}
       		if(totalCoauthors%25==0) { totalLevelCoauthors= Math.floor(totalCoauthors/25); lastLevelCoauthors=25;}
		else 			{ totalLevelCoauthors= Math.floor(totalCoauthors/25) + 1;lastLevelCoauthors=totalCoauthors%25;}
		currentLevelCoauthors=1;
		
}

function getMoreCoauthor(response){
      	console.log("coauthor initial");
	var temp = JSON.parse(response.text);
	console.log(temp);
	if(!statusCoauthors){
	totalCoauthors=temp['search-results']['opensearch:totalResults'];statusCoauthors=true;}
	console.log("totalCoauthors : "+totalCoauthors);
	for(var i=0;i<temp['search-results']['entry'].length;i++){
       		var Obj= new Object();
       		Obj.city= temp['search-results']['entry'][i]['affiliation-current']['affiliation-city'];
       		Obj.country=temp['search-results']['entry'][i]['affiliation-current']['affiliation-country'];
       		Obj.affiliationId=temp['search-results']['entry'][i]['affiliation-current']['affiliation-id'];
       		Obj.affiliationName=temp['search-results']['entry'][i]['affiliation-current']['affiliation-name'];
       		Obj.affiliationId=temp['search-results']['entry'][i]['affiliation-current']['affiliation-id'];
       		Obj.id=temp['search-results']['entry'][i]['dc:identifier'];
       		Obj.documentCount=temp['search-results']['entry'][i]['document-count'];
       		Obj.name=temp['search-results']['entry'][i]['name-variant'];
       		coauthorsObject.push(Obj);
	}
       		if(totalCoauthors%25==0) { totalLevelCoauthors= Math.floor(totalCoauthors/25); lastLevelCoauthors=25;}
		else 			{ totalLevelCoauthors= Math.floor(totalCoauthors/25) + 1;lastLevelCoauthors=totalCoauthors%25;}
		currentLevelCoauthors=1;
		
}


