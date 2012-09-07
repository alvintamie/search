function loadCitedby(index){  
  requestHeaders['Accept-Charset'] = "utf-8";
  requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
  requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
  requestHeaders['Accept'] = "application/json, text/xml";
  gadgets.sciverse.makeContentApiRequest(citedbyUrl[index], loadCitedbyCallback, requestHeaders);
  
}

function loadCitedbyCallback(response){
  
  console.log("load citedby");      
	var temp = JSON.parse(response.text);
	console.log(temp);

}