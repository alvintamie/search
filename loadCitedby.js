function loadCitedby(index){  
  requestHeaders['Accept-Charset'] = "utf-8";
  requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
  requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
  requestHeaders['Accept'] = "application/json, text/xml";
  if((index+1)*25<totalCitation){
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+index*25+"&count=25&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
  }
  else 
  {
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start="+index*25+"&count="+(totalCitation-index*25)+"&query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
  }
 
  gadgets.sciverse.makeContentApiRequest(urlCitedby, loadCitedbyCallback, requestHeaders);
  
}

function loadCitedbyCallback(response){
  
  console.log("load citedby");      
	var temp = JSON.parse(response.text);
	console.log(temp);
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