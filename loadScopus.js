var requestHeaders = {};
var authorObject=new Object();
var scopusId;
var it;


function getContextCallback(response) {
	context = response;
	console.log(response);
	var prefs= new gadgets.Prefs();
   
        requestHeaders['Accept-Charset'] = "utf-8";
        requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
        requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
        requestHeaders['Accept'] = "application/json, text/xml";
  	var urlAuthor = encodeURI("http://api.elsevier.com/content/search/index:author?query=auid("+context.au1Id+")");
  	gadgets.sciverse.makeContentApiRequest(urlAuthor, startingRequest, requestHeaders);
}
function startingRequest(response){
	console.log("main author");
	var temp = JSON.parse(response.data);
	console.log(temp);
	var buffer = returnArray(temp['search-results']['entry'])[0]['affiliation-current'];
	authorObject.country=buffer['affiliation-country'];
	authorObject.city=buffer['affiliation-city'];
	authorObject.id=buffer['affiliation-id'];
	authorObject.affiliationName=buffer['affiliation-name'];
	authorObject.name=context.au1;
	authorObject.title=context.docTitle;	

	var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=REF");
	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE&&facets=country(count=200,sort=fd);");
	var urlCoauthors=encodeURI( "http://api.elsevier.com/content/search/index:author?query=affil(university)&co-author="+context.au1Id+"&count=200&facets=country(count=200,sort=fd);");
        urlTest = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=all(quantum) AND AFFIL((singapore) OR (japan))&facets=country(count=200,sort=fd);");
 	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
 	gadgets.sciverse.makeContentApiRequest(urlCoauthors, getCoauthors, requestHeaders);
 	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);      
 	gadgets.sciverse.makeContentApiRequest(urlTest,getTest,requestHeaders);
 	//searchEngineTesting()
}

function getTest(response){
	console.log(urlTest);
	console.log("testing results");
	console.log(response);
	var temp = JSON.parse(response.data);
	console.log(temp);
}
function waiting( ms )
{
	var date = new Date();
	var curDate = null;
	while (curDate - date < ms) curDate = new Date();

}

function newMainArticle(Obj){
	context= new Object();
	context.scDocId=Obj.auId;
	context.scopusId=Obj.scopusId;
	
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