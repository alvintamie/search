var countingRef=0;
function getRefCitedby(scId,citedbyCount){
 
 var url = encodeURI("http://api.elsevier.com/content/search/index:scopus?"+"query=refeid(2-s2.0-"+scId+")&view=STANDRARD");
 console.log("url : "+url);
 gadgets.sciverse.makeContentApiRequest(url, loadRefCitedbyCallback, requestHeaders);
}

function loadRefCitedbyCallback(response){
  ++countingRef;
    console.log("citedby ref " + countingRef );
  var temp = JSON.parse(response.text);
	console.log(temp);
	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No citedby");
		return;}}
	catch(e){	
    /*
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
    */
	}
}