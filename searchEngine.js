var queryAll=new Array();
var affiliation=new Array();
var queryCity=new Array();
var queryCountry=new Array();
var queryOrganization=new Array();
var queryAbstract= new Array();
var queryAuthorName= new Array();
var queryAuthorFirstName=new Array();
var queryAuthorLastName=new Array();
var queryFirstAuthor= new Array();
var queryKeywords= new Array();
var queryReference= new Array();
var querySourceTitle= new Array();
var queryArticleTitle= new Array();
var querySubjectArea= new Array();
//for parameter url
var queryStart=0;
var queryCount=100;
var queryStartYear;
var queryEndYear;
var querySort="+coverDate";
//total search results
var queryTotalResults=0;
//resultsObject
var queryResults=new Array();
//facets
var queryCtry= new Array();
var querySubjArea= new Array();
var queryPubYear=new Array();
var queryAuthName=new Array();
//subject
// querySearch.dateRange
// querySearch.doctype;
function resetQuery(){
  	queryCity=[];
  	queryCountry=[];
	queryOrganization=[];
	affiliation= [];
	queryAll= [];
	queryAbstract=[];
	queryAuthorName=[];
	queryAuthorFirstName=[];
	queryAuthorLastName=[];
	queryFirstAuthor=[];
	queryKeywords=[];
	queryReference=[];
	querySourceTitle=[]; // publisher(journal, conference dkk)
	queryArticleTitle=[];
	resetFacet();
}
function searchEngineTesting(){
  queryAll.push("heart");
  submitQuery(0);
}
function addQuery(query,index){
	if(index==0){ queryAll.push(query);}
	if(index==1){ queryAffiliation.push(query);}
	if(index==2){ queryCity.push(query);}
	if(index==3){ queryCountry.push(query);}
	if(index==4){ queryOrganization.push(query);}
	if(index==5){ queryAbstract.push(query);}
	if(index==6){ queryAuthorName.push(query);}
	if(index==7){ queryAuthorFirstName.push(query);}
	if(index==8){ queryAuthorLastName.push(query);}
	if(index==9){ queryFirstAuthor.push(query);}
	if(index==10){queryKeywords.push(query);}
	if(index==11){queryReference.push(query);}
	if(index==12){querySourceTitle.push(query);}
	if(index==13){queryArticleTitle.push("\""+query+"\"");}
	if(index==14){querySubjectArea.push(query);}
}

function deleteQuery(index,number){
	if(index==0){ queryAll.splice(number,1);}
	if(index==1){ queryAffiliation.splice(number,1);}
	if(index==2){ queryCity.splice(number,1);}
	if(index==3){ queryCountry.splice(number,1);}
	if(index==4){ queryOrganization.splice(number,1);}
	if(index==5){ queryAbstract.splice(number,1);}
	if(index==6){ queryAuthorName.splice(number,1);}
	if(index==7){ queryAuthorFirstName.splice(number,1);}
	if(index==8){ queryAuthorLastName.splice(number,1);}
	if(index==9){ queryFirstAuthor.splice(number,1);}
	if(index==10){queryKeywords.splice(number,1);}
	if(index==11){queryReference.splice(number,1);}
	if(index==12){querySourceTitle.splice(number,1);}
	if(index==13){queryArticleTitle.splice(number,1);}
	if(index==14){querySubjectArea.splice(number,1);}
}

function resetAffiliation(){
affiliation=[];
queryCity=[];
queryCountry=[];
queryOrganization=[];
resetFacet();
}

function changeSort(index){
if(index==0){ querySort="+coverDate";}
if(index==1){ querySort="-coverDate";}
if(index==2){ querySort="+citedby-count";}
if(index==3){ querySort="+aucite";}
if(index==4){ querySort="+creator";}
if(index==5){ querySort="-creator";}
if(index==6){ querySort="+publicationName";}
if(index==7){ querySort="+title";}
if(index==8){ querySort="-title";}
if(index==9){ querySort="+relevance";}
}


function submitQuery(status){
var empty=0;
var query="http://api.elsevier.com/content/search/index:scopus?query=";
for(var i=0;i<queryAll.length;i++)			{ if(i==0) query=query+"all("; if(empty==1) query+="AND"; else empty=1; query=query+"("+queryAll[i]+")"; if(i==queryAll.length-1) query=query+")"; }; empty=0;
/*
for(var i=0;i<queryAffiliation.length;i++) 	{ if(empty==1) query+="+"; else empty=1; query=query+"affil("+queryAffiliation[i]+")"; };
for(var i=0;i<queryCity.length;i++) 			{ if(empty==1) query+="+"; else empty=1; query=query+"affilcity("+queryCity[i]+")"; };
for(var i=0;i<queryCountry.length;i++)		{ if(empty==1) query+="+"; else empty=1; query=query+"affilcountry("+queryCountry[i]+")"; };
for(var i=0;i<queryOrganization.length;i++)  { if(empty==1) query+="+"; else empty=1; query=query+"affilorg("+queryOrganization[i]+")"; };
for(var i=0;i<queryAbstract.length;i++) 		{ if(empty==1) query+="+"; else empty=1; query=query+"abs("+queryAbstract[i]+")"; };
for(var i=0;i<queryAuthorName.length;i++) 	{ if(empty==1) query+="+"; else empty=1; query=query+"author-name("+queryAuthorName[i]+")"; };
for(var i=0;i<queryAuthorFirstName.length;i++){ if(empty==1) query+="+"; else empty=1; query=query+"authfirst("+queryAuthorFirstName[i]+")"; };
for(var i=0;i<queryAuthorLastName.length;i++){ if(empty==1) query+="+"; else empty=1; query=query+"authlastname("+queryAuthorLastName[i]+")"; };
for(var i=0;i<queryFirstAuthor.length;i++) 	 { if(empty==1) query+="+"; else empty=1; query=query+"firstauth("+queryAuthor[i]+")"; };
for(var i=0;i<queryKeywords.length;i++)		 { if(empty==1) query+="+"; else empty=1; query=query+"key("+queryAll[i]+")"; };
for(var i=0;i<queryReference.length;i++)	 { if(empty==1) query+="+"; else empty=1; query=query+"ref("+queryAll[i]+")"; };
for(var i=0;i<querySourceTitle.length;i++) 	 { if(empty==1) query+="+"; else empty=1; query=query+"srctitle("+queryAll[i]+")"; };
for(var i=0;i<queryArticleTitle.length;i++)  { if(empty==1) query+="+"; else empty=1; query=query+"title("+queryAll[i]+")"; };
for(var i=0;i<querySubjectArea.length;i++) 	 { if(empty==1) query+="+"; else empty=1; query=query+"subjarea("+queryAll[i]+")"; };


if(queryEndYear<queryStartYear)
	return 5;
if(queryStartYear==queryEndYear){
	query=query+"&PUBYEAR IS "+queryStartYear;}
if(queryStartYear!=null && queryEndYear!=null){
	query=query+"&PUBYEAR AFT "+queryStartYear+"&PUBYEAR BEF "+queryEndYear;
}
*/
if(status==1)
query=query+"&start="+queryStart+"&count="+queryCount;
query=query+"&sort="+querySort;
query=query+"&view=COMPLETE&facets=country(count=200,sort=fd);subjarea(count=100,sort=fd);pubyear(count=20,sort=na);authname(count=20,sort=fd);";
console.log(query);
gadgets.sciverse.makeContentApiRequest(query, getSearchRequest, requestHeaders);
}

function getSearchRequest(response){
	
		console.log("searchRequest is obtained");
		var temp = JSON.parse(parseValidator(response.data));
		console.log(temp);
		
		queryTotalResults=temp['search-results']['opensearch:totalResults'];
		var buffer= returnArray(temp['search-results']['entry']);
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
       			Obj.affilname= returnArray(buffer[i]['affiliation'])[0]['affilname'];}
       		catch(e){ console.log("error no affiliation in search engine "+i);}
	    	}
	        catch(e){ console.log("error no some property in search engine");}
       		Obj.url="http://www.scopus.com/record/display.url?eid=2-s2.0-"+tempId[1]+"&origin=resultslist&sort=plf-f&src=s";
       	//	console.log(Obj);
		queryResults.push(Obj);
		}
		//facets
		queryCtry=returnArray(temp['search-results']['facet'][0]['category']);
		querySubjArea=returnArray(temp['search-results']['facet'][1]['category']);
		queryPubYear=returnArray(temp['search-results']['facet'][2]['category']);
		queryAuthName=returnArray(temp['search-results']['facet'][3]['category']);

		if(queryTotalResults%100==0) { totalLevelSearchEngine= Math.floor(queryTotalResults/100); lastLevelSearchEngine=100;}
		else 			{ totalLevelSearchEngine= Math.floor(queryTotalResults/100)+1;lastLevelSearchEngine=queryTotalResults%100;}
		currentLevelSearchEngine=1;
		readyMoreSearchEngine=1;
		console.log("horee");
	//	getReferenceCity(citedbyObject,getCityCitedby);
}

var readyMoreSearchEngine=1;
var currentLevelSearchEngine=-1;
var totalLevelSearchEngine=0;
var lastLevelSearchEngine=0;

function upSearchEngine(){
	if(readyMoreSearchEngine==0) return;
	if(currentLevelSearchEngine==-1 || currentLevelSearchEngine==totalLevelSearchEngine) return false;
	currentLevelSearchEngine++;
	if(currentLevelSearchEngine==totalLevelSearchEngine){
	queryStart=(currentLevelSearchEngine-1)*100; queryCount=lastLevelSearchEngine;}
	else{
	queryStart=(currentLevelSearchEngine-1)*100; queryCount=100;}
	queryResults=[];
	readyMoreSearchEngine=0;
	getSearchRequest(1);
}

function downSearchEngine(){
	if(readyMoreSearchEngine==0) return;
	if(currentLevelSearchEngine==-1 || currentLevelSearchEngine==1) return false;
	currentLevelSearchEngine--;
	queryStart=(currentLevelSearchEngine-1)*100; queryCount=100;
	queryResults=[];
	readyMoreSearchEngine=0;
	getSearchRequest(1);
}
