var citedbyObject = new Array();
var statusCitedby=0;
var totalCitation=-1;
var totalLevelCitation=0;
var currentLevelCitation=-1;
var lastLevelCitation=0;
var countryCitedby= new Array();
var readyMoreCitation=1;
var citedbyAffiliation;
var countryCitedby=new Array();
function upCitedby(){ 
  if(readyMoreCitation==0) return;
  if(currentLevelCitation==-1 || currentLevelCitation==totalLevelCitation) return false;
  currentLevelCitation++;
  if(currentLevelCitation==totalLevelCitation){
    if(citedbyAffiliation)
    var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count="+lastLevelCitation+"&query=(refeid(2-s2.0-"+context.scDocId+") AND affil("+citedbyAffiliation+"))&view=COMPLETE&facets=country(count=200,sort=fd);");
    else
    var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count="+lastLevelCitation+"&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE&facets=country(count=200,sort=fd);");}
  else 
  {
    if(citedbyAffiliation)
     var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count=25&query=(refeid(2-s2.0-"+context.scDocId+") AND affil("+citedbyAffiliation+"))&view=COMPLETE&facets=country(count=200,sort=fd);");
    else
     var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE&facets=country(count=200,sort=fd);");}
  citedbyObject=[];
  readyMoreCitation=0;
  gadgets.sciverse.makeContentApiRequest(urlCitedby, getMoreCitedby, requestHeaders);
  return true;
}

function downCitedby(){
  if(readyMoreCitation==0) return;
  if(currentLevelCitation==-1 || currentLevelCitation==1) return false;
  currentLevelCitation--;
  if(citedbyAffiliation)
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count=25&query=(refeid(2-s2.0-"+context.scDocId+") AND affil("+citedbyAffiliation+"))&view=COMPLETE&facets=country(count=200,sort=fd);");
  else
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+((currentLevelCitation-1)*25)+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE&facets=country(count=200,sort=fd);");
  citedbyObject=[];
  readyMoreCitation=0;
  gadgets.sciverse.makeContentApiRequest(urlCitedby, getMoreCitedby, requestHeaders);
}

function getCitedby(response){
    	console.log("citedby initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	putCitedbyData(temp);
	countryCitedby=returnArray(temp['search-results']['facet']['category']);
	//console.log(affiliationCitation);
	if(totalCitation%25==0) { totalLevelCitation= Math.floor(totalCitation/25); lastLevelCitation=25;}
	else 			{ totalLevelCitation= Math.floor(totalCitation/25)+1;lastLevelCitation=totalCitation%25;}
	currentLevelCitation=1;
	readyMoreCitation=1;);
	updateCitedBy(citedbyObject,0);
	getReferenceCity(citedbyObject,getCityCitedby);
}

function getMoreCitedby(response){
    	console.log("citedby more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putCitedbyData(temp);
    	readyMoreCitation=1;
    	updateCitedBy(citedbyObject,0);
	getReferenceCity(citedbyObject,getCityCitedby);}



function getCityCitedby(response){
	getCityResponse(response,citedbyObject,updateAllCitedby);
}
function updateAllCitedby(){
	console.log("got citedby city");
	console.log(citedbyObject);
	showResult(0,citedbyObject);
	 //update david
}


function getCitedbyFilter(affiliation){
	citedbyAffiliation=affiliation;
	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=(refeid(2-s2.0-"+context.scDocId+") AND affil("+citedbyAffiliation+"))&view=COMPLETE&facets=country(count=200,sort=fd);");
 	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
}

function resetCitedbyAffiliation(){
	citedbyAffiliation="";
	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE&facets=country(count=200,sort=fd);");
	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);

}



function putCitedbyData(temp){
	if(!statusCitedby){
	try	{totalCitation= temp['search-results']['opensearch:totalResults'];}
	catch(e){  console.log("NO citedby catch "); updateCitedBy(new Array(),0); return;}
		statusCitedby=true;}
		
	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No citedby");
		return;}}
	catch(e){
	//	var buffer;
	var buffer= returnArray(temp['search-results']['entry'])
	countryCitedby=returnArray(temp['search-results']['facet']['category']);
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
       		Obj.identifier= tempId[1];
     	  	Obj.date =buffer[i]['prism:coverDate'];
       		Obj.volume = buffer[i]['prim:volume'];
       		Obj.author=returnArray(buffer[i]['author']);  
       		try{
       			Obj.afid= returnArray(buffer[i]['affiliation'])[0]['afid'];
       			Obj.affilname=returnArray(buffer[i]['affiliation'])[0]['affilname'];}
       		catch(e){ console.log("No affiliation property in citedby data");}
	      }
	    catch(e){ console.log("No some property in citedby data");}
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