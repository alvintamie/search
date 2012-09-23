var requestHeaders = {};
var authorObject=new Object();
var scopusId;
var it;
var loadingStatus=0;

function getContextCallback(response) {
	context = response;
	console.log(response);
	var prefs= new gadgets.Prefs();
   
        requestHeaders['Accept-Charset'] = "utf-8";
        requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
        requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
        requestHeaders['Accept'] = "application/json, text/xml";
  	var urlAuthor = encodeURI("http://api.elsevier.com/content/search/index:author?query=auid("+context.au1Id+")");
  	authorObject.name=context.au1;
	authorObject.title=context.docTitle;	
	var div= document.getElementById('judul');
       	div.innerHTML= "<b>"+context.docTitle+"</b><br>"+context.au1;
       	loadingStatus++;
  	gadgets.sciverse.makeContentApiRequest(urlAuthor, startingRequest, requestHeaders);
}
function startingRequest(response){
	loadingStatus--;
	console.log("main author");
	var temp = JSON.parse(response.data);
	console.log(temp);
	var buffer = returnArray(temp['search-results']['entry'])[0]['affiliation-current'];
	authorObject.country=buffer['affiliation-country'];
	authorObject.city=buffer['affiliation-city'];
	authorObject.id=buffer['affiliation-id'];
	authorObject.affiliationName=buffer['affiliation-name'];


	console.log(authorObject.title);
	console.log("///////////");

	var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=REF");
	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE&&facets=country(count=200,sort=fd);");
	var urlCoauthors=encodeURI( "http://api.elsevier.com/content/search/index:author?query=affil(university)&co-author="+context.au1Id+"&count=200&facets=country(count=200,sort=fd);");
        urlTest = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=all(quantum) AND AFFIL((singapore) OR (japan))&facets=country(count=200,sort=fd);");
 	loadingStatus++;
 	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
 	loadingStatus++;
 	gadgets.sciverse.makeContentApiRequest(urlCoauthors, getCoauthors, requestHeaders);
 	loadingStatus++;
 	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);      
 	//searchEngineTesting()
}


function waiting( ms )
{
	var date = new Date();
	var curDate = null;
	while (curDate - date < ms) curDate = new Date();

}

function newMainArticle(Obj){
	console.log("newMainArticle");
	console.log(Obj.url);
	context= new Object();
	context.scDocId=Obj.scopusId;
	context.authorId=Obj.authorId;
	masterReset();
	var urlAuthor = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=eid(2-s2.0-"+context.scDocId+")&view=COMPLETE");
  	console.log(Obj.authorId+" "+Obj.scopusId);
  	gadgets.sciverse.makeContentApiRequest(urlAuthor, startingRequestAgain, requestHeaders);
}


function startingRequestAgain(response){
	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){

		return;}}
	catch(e){
	//	var buffer;
	var buffer= returnArray(temp['search-results']['entry'])
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
       		Obj.scopusId= tempId[1];
     	  	Obj.date =buffer[i]['prism:coverDate'];
       		Obj.volume = buffer[i]['prim:volume'];
       		Obj.author=returnArray(buffer[i]['author']);  
       		Obj.authorId=Obj.author[0]['authid'];
       		try{
       			Obj.afid= returnArray(buffer[i]['affiliation'])[0]['afid'];
       			Obj.affilname=returnArray(buffer[i]['affiliation'])[0]['affilname'];}
       		catch(e){ console.log("No affiliation property in citedby data");}
	      }
	    catch(e){ console.log("No some property in citedby data");}
       		Obj.url="http://www.scopus.com/record/display.url?eid=2-s2.0-"+tempId[1]+"&origin=resultslist&sort=plf-f&src=s";
		
		
		var urlAuthor = encodeURI("http://api.elsevier.com/content/search/index:author?query=auid("+context.authorId+")");
  
	  	authorObject.name=Obj.creator" halo ";
		authorObject.title=Obj.title;	
		var div= document.getElementById('judul');
	       	div.innerHTML= "<b>"+context.docTitle+"</b><br>"+context.au1;
	       	loadingStatus++;
	  	gadgets.sciverse.makeContentApiRequest(urlAuthor, startingRequest, requestHeaders);
		}
	}

}


function parseValidator(b){
		while(b.indexOf("\"$\" :\}")>0){
    			b=b.replace("\"$\" :\}","    }");	}
    		return b;
}

function masterReset(){
authorObject=new Object();
idToIndex= new Object();
resetSearchEngine();
resetReference();
resetCoauthors();
resetRelevantDocument();
resetCitedby();
}