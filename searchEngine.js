var searchElement= new Array("All","Affiliation","City","Country","Organization","Abstract","Author Name","Author First Name","Author Last Name","First Author","Keywords","Reference","Source Title","Article Title","Subject Area");

//for parameter url
var queryStart=0;
var queryCount=100;
var queryStartYear=0;
var queryEndYear=0;
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
var statusQ=0;
//subject
// querySearch.dateRange
// querySearch.doctype;
var readyMoreSearchEngine=1;
var currentLevelSearchEngine=-1;
var totalLevelSearchEngine=0;
var lastLevelSearchEngine=0;
var queryList=new Array();
//end initial
for(var i=0;i<15;i++){
	var Obj=new Object();
	Obj.string=new Array();
	queryList.push(Obj);}
	queryList[0].syntax="ALL";
	queryList[1].syntax="AFFIL";
	queryList[2].syntax="AFFILCITY";
	queryList[3].syntax="affilcountry";
	queryList[4].syntax="affilorg";
	queryList[5].syntax="abs";
	queryList[6].syntax="author-name";
	queryList[7].syntax="authfirst";
	queryList[8].syntax="authlastname";
	queryList[9].syntax="firstauth";
	queryList[10].syntax="key";
	queryList[11].syntax="ref";
	queryList[12].syntax="srctitle";
	queryList[13].syntax="title";
	queryList[14].syntax="subjarea";

function resetQuery(){
	statusQ=0;
queryResults=[];
for(var i=0;i<15;i++){
queryList[i].string=[];
}}

function addQuery(query,index,or){
	statusQ=0;
	console.log("add david"+query+" "+index+" "+or);
		var Obj= new Object();
		Obj.value=query;
		Obj.state=or;
		
		queryList[index].string.push(Obj);
}

function quickSearch(temp){
	resetQuery();
	addQuery(temp,0,1);
	submiQuery(0);
}

function deleteQuery(index,number){
		statusQ=0;
		queryList[index].string.splice(number,1);
}

function resetAffiliation(){
	statusQ=0;
	for(i=1;i<5;i++){
	queryList[i].string=[];	
}}

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

function changeDate(a,b){
queryStartYear=a;
queryEndYear=b;}

function _queryList0(query,i){ // for i =0
	if(!queryList[i].string.length) return query;
	var OR="";
	var AND="";
	query=query+queryList[i].syntax+"(";
	for(var j=0;j<queryList[i].string.length;j++){
		if(queryList[i].string[j].state)
			AND=AND+queryList[i].string[j].value+" ";
		else{
			OR=OR+" OR ("+queryList[i].string[j].value+")";}
	}
	query=query+"("+AND+")"+OR+")";
	if(OR||AND) Qstatus=1;
	return query;
}

function _queryList1(query,i){ // for i =0
        if(!queryList[i].string.length) return query;
	var OR="";
	var AND="";
	var statusOR=0;
	var numberOR=0;
	var numberAND=0;
	var numberANDCount=0;
	for(var j=0;j<queryList[i].string.length;j++)
		if(!queryList[i].string[j].state)
			numberOR++;
		else numberAND++;
	for(var j=0;j<queryList[i].string.length;j++){
		console.log("query list state : "+queryList[i].string[j].state);
		if(queryList[i].string[j].state){
			AND=AND+queryList[i].string[j].value;
			numberANDCount++;
			if(numberANDCount!=numberAND)
			AND=AND+" ";}
		else{
			if(statusOR==0)
			{ 	if(numberOR==1) { OR=OR+queryList[i].string[j].value; statusOR=1; continue;}
				OR=OR+"("+queryList[i].string[j].value+")"; statusOR=1;
			}
			else 
			OR=OR+" OR ("+queryList[i].string[j].value+")";}
	}
	if(Qstatus&&AND){
		query=query+" AND "+queryList[i].syntax+"("+AND+")";Qstatus=1;}
	if(!Qstatus&&AND){
		query=query+queryList[i].syntax+"("+AND+")";Qstatus=1;}
	if(OR)
	query=query+" OR "+queryList[i].syntax+"("+OR+")";
	return query;
}
var Qstatus=0;
function submitQuery(status){
queryResults=[];
var and=0;
var query="http://api.elsevier.com/content/search/index:SCOPUS?query=";
// if(i==0) query=query+"ALL("; if(empty==1) query+="AND"; else empty=1; and=1; query=query+"("+queryAll[i]+")"; if(i==queryAll.length-1) query=query+")";
var status=0;
query=_queryList0(query,0);
for(var i=1;i<15;i++){ query=_queryList1(query,i);}

if(queryStartYear==queryEndYear && queryStartYear!=0){
	query=query+" AND PUBYEAR IS "+queryStartYear+" ";}
else if (queryStartYear=="All years" && queryEndYear=="Present"){
	query=query+" PUBYEAR BEF 2013 ";
}
else if (queryStartYear=="All years" && queryEndYear!=0){
	query=query+" AND PUBYEAR BEF "+queryEndYear+" ";}

else if(queryEndYear=="Before 1960"){
	query=query+" PUBYEAR BEF 1960 ";
}
else if(queryEndYear=="Present"){
	query=query+" AND PUBYEAR AFT "+queryStartYear+" AND PUBYEAR BEF 2013 ";
}
else if(queryStartYear!=0 && queryEndYear!=0){
	query=query+" AND PUBYEAR AFT "+queryStartYear+" AND PUBYEAR BEF "+queryEndYear+" ";}

if(statusQ==2)
query=query+"&start="+queryStart+"&count="+queryCount;
else
query=query+"&count=100";
query=query+"&sort="+querySort;
query=query+"&view=COMPLETE&facets=country(count=200,sort=fd);subjarea(count=100,sort=fd);pubyear(count=20,sort=na);authname(count=20,sort=fd);";
console.log(query);
//console.log("queryList "+queryList[0].string[0].value)
loadingStatus++;
gadgets.sciverse.makeContentApiRequest(encodeURI(query), getSearchRequest, requestHeaders);
}

function getSearchRequest(response){
		loadingStatus--;
		console.log("searchRequest is obtained");
		//console.log(response);
		try{
		var temp = JSON.parse(parseValidator(response.data));
		console.log(temp);}
		catch(e){
			console.log("NO RESULTS FROM SEARCH ENGINE");	
		}
		queryTotalResults=temp['search-results']['opensearch:totalResults'];
		total_Search_Engine=queryTotalResults;
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
	       		Obj.scopusId= tempId[1];
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
		readyMoreSearchEngine=1;
		if(statusQ==0)
		currentLevelSearchEngine=1;
		
	
		
		getReferenceCity(queryResults,getCitySearchEngine);
}


function getCitySearchEngine(response){
	console.log("get City search Engine");
	getCityResponse(response,queryResults,updateAllSearchEngine);
}
function updateAllSearchEngine(){
	console.log("got city search engine");
	console.log(queryResults);
	//update david
	updateSearch(queryResults,0);
		showOverallCountrySearch(queryResults);
	showResult(searchMode,queryResults);
}



function upSearchEngine(){
	if(readyMoreSearchEngine==0) return;
	if(currentLevelSearchEngine==-1 || currentLevelSearchEngine==totalLevelSearchEngine) return false;
	currentLevelSearchEngine++;
	if(currentLevelSearchEngine==totalLevelSearchEngine){
	queryStart=(currentLevelSearchEngine-1)*100; queryCount=lastLevelSearchEngine;}
	else{
	queryStart=(currentLevelSearchEngine-1)*100; queryCount=100;}
	queryResults=[];
	statusQ=2;
	readyMoreSearchEngine=0;
	submitQuery(1);
}


function downSearchEngine(){
	if(readyMoreSearchEngine==0) return;
	if(currentLevelSearchEngine==-1 || currentLevelSearchEngine==1) return false;
	currentLevelSearchEngine--;
	queryStart=(currentLevelSearchEngine-1)*100; queryCount=100;
	queryResults=[];
	readyMoreSearchEngine=0;
	statusQ=2;
	submitQuery(1);
}

function resetSearchEngine(){
queryStart=0;
queryCount=100;
queryStartYear=0;
queryEndYear=0;
querySort="+coverDate";
//total search results
queryTotalResults=0;
//resultsObject
queryResults=new Array();
//facets
queryCtry= new Array();
querySubjArea= new Array();
queryPubYear=new Array();
queryAuthName=new Array();
statusQ=0;
//subject
// querySearch.dateRange
// querySearch.doctype;
readyMoreSearchEngine=1;
currentLevelSearchEngine=-1;
totalLevelSearchEngine=0;
lastLevelSearchEngine=0;
queryList=new Array();
}