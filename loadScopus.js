var searchElement= new Array("All","Affiliation","City","Country","Organization","Abstract","Author Name","Author First Name","Author Last Name","First Author","Keywords","Reference","Source Title","Article Title","Subject Area");

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
var queryList=new Array();
for(var i=0;i<15;i++){
	var Obj=new Object();
	Obj.string=new Array();
	queryList.push(Obj);}
queryList[0].syntax="ALL";
queryList[1].syntax="AFFIL";
queryList[2].syntax="affilcity";
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
for(var i=0;i<15;i++){
queryList[i].string=[];
}}

function addQuery(query,index,or){
	for(var i=0;i<15;i++){
	if(index==i){
		var Obj= new Object();
		Obj.value=query;
		Obj.state=or;
		queryList[i].string.push(Obj);
}}}

function deleteQuery(index,number){
	for(var i=0;i<15;i++){
	if(index==i){
		queryList[i].string.splice(number,1);
}}}

function resetAffiliation(){
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



function _queryList0(query,i){ // for i =0
	var OR="";
	var AND="";
	query=query+queryList[i].syntax+"(";
	for(var j=0;j<queryList[i].string.length;j++){
		if(queryList[i].string[j].state)
			AND=AND+queryList[i].string[j].value+" ";
		else{
			OR=OR+" OR ("+queryList[i].string[j].value+")";}
	}
	query="("+AND+")"+OR+")";
	if(OR||AND) Qstatus=1;
	return query;
}

function queryList1(query,i){ // for i =0
	var OR="";
	var AND="";
	var statusOR=0;
	query=query+queryList[i].syntax+"(";
	for(var j=0;j<queryList[i].string.length;j++){
		if(queryList[i].string[j].state)
			AND=AND+queryList[i].string[j].value+" ";
		else{
			if(statusOR==0)
			{ OR=OR+"("+queryList[i].string[j].value+")"; statusOR=1;}
			else 
			OR=OR+" OR ("+queryList[i].string[j].value+")";}
	}
	if(!status&&AND){
		query=query+queryList[i].syntax+"("+AND+")";Qstatus=1;}
	if(status&&AND){
		query=query+" AND "+queryList[i].syntax+"("+AND+")";Qstatus=1;}
	if(OR)
	query=query+" OR "+queryList[i].syntax+"("+OR+")";
	return query;
}
var Qstatus;
function submitQuery(status){
var and=0;
var query="http://api.elsevier.com/content/search/index:SCOPUS?query=";
var Qstatus=0;
// if(i==0) query=query+"ALL("; if(empty==1) query+="AND"; else empty=1; and=1; query=query+"("+queryAll[i]+")"; if(i==queryAll.length-1) query=query+")";
var status=0;
_queryList0(query,0);
for(int i=1;i<15;i++){ queryList1(query,i);}

if(queryStartYear==queryEndYear){
	query=query+" AND PUBYEAR IS "+queryStartYear+" ";}
if(queryStartYear!=null && queryEndYear!=null){
	query=query+" AND PUBYEAR AFT "+queryStartYear+" AND PUBYEAR BEF "+queryEndYear+" ";}

if(status==1)
query=query+"&start="+queryStart+"&count="+queryCount;
else
query=query+"&count=100";
query=query+"&sort="+querySort;
query=query+"&view=COMPLETE&facets=country(count=200,sort=fd);subjarea(count=100,sort=fd);pubyear(count=20,sort=na);authname(count=20,sort=fd);";
console.log(query);
gadgets.sciverse.makeContentApiRequest(encodeURI(query), getSearchRequest, requestHeaders);
}

function getSearchRequest(response){
		
		console.log("searchRequest is obtained");
		console.log(response);
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
