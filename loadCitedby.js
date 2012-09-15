var totalCitation=-1;
var totalLevelCitation=0;
var currentLevelCitation=-1;
var lastLevelCitation=0;
// startCitation and endCitation is not complete;
function upCitedby(){  
  if(currentLevelCitation==-1 || currentLevelCitation==totalLevelCitation) return false;
  if(currentLevelCitation==totalLevelCitation-1){
    var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count="+lastLevelCitation+"&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");}
  else 
  {var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");}
  citedbyObject=[];
  currentLevelCitation++;
  gadgets.sciverse.makeContentApiRequest(urlCitedby, getMoreCitedby, requestHeaders);
}

function downCitedby(){
  if(currentLevelCitation==-1 || currentLevelCitation==1) return false;
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-2)*25)+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
  citedbyObject=[];
  currentLevelCitation--;
  gadgets.sciverse.makeContentApiRequest(urlCitedby, getMoreCitedby, requestHeaders);
}

function getCitedby(response){
    	console.log("citedby initial")
	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	if(!statusCitedby){
	totalCitation= temp['search-results']['opensearch:totalResults'];statusCitedby=true;}
	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No citedby");
		return;}}
	catch(e){	
	for(var i=0;i<temp['search-results']['entry'].length;i++){
		var Obj= new Object();
		Obj.abstract = temp['search-results']['entry'][i]['dc:description'];
		Obj.title =    temp['search-results']['entry'][i]['dc:title'];
       		Obj.type =     temp['search-results']['entry'][i]['subtypeDescription'];
       		Obj.citedbyCount = temp['search-results']['entry'][i]['citedby-count'];
       		Obj.creator= temp['search-results']['entry'][i]['creator'];
       		Obj.publicationName = temp['search-results']['entry'][i]['prism:publicationName'];
       		var tempId=temp['search-results']['entry'][i]['dc:identifier'].split(":");
       		Obj.identifier= tempId[1];
     	  	Obj.date = temp['search-results']['entry'][i]['prism:coverDate'];
       		Obj.volume = temp['search-results']['entry'][i]['prim:volume'];
       		Obj.author=temp['search-results']['entry'][i]['author'];     	
       		Obj.affiliation= temp['search-results']['entry'][i]['affiliation'];
		citedbyObject.push(Obj);
		}
		endCitation+=temp['search-results']['entry'].length;
		if(totalCitation%25==0) { totalLevelCitation= Math.floor(totalCitation/25); lastLevelCitation=25;}
		else 			{ totalLevelCitation= Math.floor(totalCitation/25) + 1;lastLevelCitation=totalCitation%25;}
		currentLevelCitation=1;
	}
}

function getMoreCitedby(response){
    	console.log("citedby More")
	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	if(!statusCitedby){statusCitedby=true;}
	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No citedby");
		return;}}
	catch(e){	
	for(var i=0;i<temp['search-results']['entry'].length;i++){
		var Obj= new Object();
		Obj.abstract = temp['search-results']['entry'][i]['dc:description'];
		Obj.title =    temp['search-results']['entry'][i]['dc:title'];
       		Obj.type =     temp['search-results']['entry'][i]['subtypeDescription'];
       		Obj.citedbyCount = temp['search-results']['entry'][i]['citedby-count'];
       		Obj.creator= temp['search-results']['entry'][i]['creator'];
       		Obj.publicationName = temp['search-results']['entry'][i]['prism:publicationName'];
       		var tempId=temp['search-results']['entry'][i]['dc:identifier'].split(":");
       		Obj.identifier= tempId[1];
     	  	Obj.date = temp['search-results']['entry'][i]['prism:coverDate'];
       		Obj.volume = temp['search-results']['entry'][i]['prim:volume'];
       		Obj.author=temp['search-results']['entry'][i]['author'];     	
       		Obj.affiliation= temp['search-results']['entry'][i]['affiliation'];
		citedbyObject.push(Obj);
		}
	}
}