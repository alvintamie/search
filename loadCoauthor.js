function getCoauthor(response){
      console.log("coauthor");
	var temp = JSON.parse(response.text);
	console.log(temp);
	if(!statusCoauthors){
	totalCoauthors=temp['search-results']['opensearch:totalResults'];statusCoauthors=true;}
	console.log("totalCoauthors : "+totalCoauthors);
	for(var i=0;i<temp['search-results']['entry'].length;i++){
       		var urlCoauthor=temp['search-results']['entry'][i]['prism:url']; 		                       
		gadgets.sciverse.makeContentApiRequest(urlCoauthor, getCoauthorCallback, requestHeaders);
		}
}

function getCoauthorCallback(response){
//	console.log("coauthor details");
	var temp = JSON.parse(response.text);
//	console.log(temp);
	var Obj= new Object();
	coauthorObject.push(temp);
}

function loadCoauthor(index){  
  if((index+1)*25<totalCoauthor){
  var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+index*25+"&count="+25+"&query=affil(university)&co-author="+context.au1Id); 
  }
  else 
  {
  var urlCoauthor=encodeURI( "http://api.elsevier.com/content/search/index:author?start="+index*25+"&count="+(totalCoauthor-index*25)+"&query=affil(university)&co-author="+context.au1Id); 
  }
  gadgets.sciverse.makeContentApiRequest(urlCoauthor, getCoauthor, requestHeaders);
}
