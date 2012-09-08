function loadCitedby(index){  
  if((index+1)*25<totalCitation){
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+index*25+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
  }
  else 
  {
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+index*25+"&count="+(totalCitation-index*25)+"&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
  }
  gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
}

function getCitedby(response){
    	console.log("citedby initial")
	var temp = JSON.parse(response.text);
	console.log(temp);
	if(!statusCitedby){
	totalCitation= temp['search-results']['opensearch:totalResults'];statusCitedby=true;loadCitedby(1);}
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