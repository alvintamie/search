function loadCitedby(index){  
  requestHeaders['Accept-Charset'] = "utf-8";
  requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
  requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
  requestHeaders['Accept'] = "application/json, text/xml";
  
  var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?start=25&count=10&query=refeid;
  (2-s2.0-"+context.scDocId+")&view=COMPLETE");

  gadgets.sciverse.makeContentApiRequest(urlCitedby, loadCitedbyCallback, requestHeaders);
  
}

function loadCitedbyCallback(response){
  
  console.log("load citedby");      
	var temp = JSON.parse(response.text);
	console.log(temp);

}