var coauthorsObject = new Array();
var statusCoauthors=0;
var totalCoauthors=-1;
var totalLevelCoauthors=0;
var currentLevelCoauthors=-1;
var lastLevelCoauthors=0;
var affiliationCoauthors= new Array();
var readyMoreCoauthors=1;

function getCoauthors(response){
    	console.log("coauthors initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
	putCoauthorsData(temp);
//	affiliationCoauthors=returnArray(temp['search-results']['facet']['category']);
	updateCoauthors();
}

function getMoreCoauthors(response){
    	console.log("coauthors more initial");
    	var temp = JSON.parse(parseValidator(response.text));
	console.log(temp);
    	putCoauthorsData(temp);
    	readyMoreCoauthors=1;
	updateCoauthors();}

function putCoauthorsData(temp){
	if(!statusCoauthors){
	try	{totalCoauthors= temp['search-results']['opensearch:totalResults'];}
	catch(e){ updateCoauthors(); return;}
		statusCoauthors=true;}

	try{ if(temp['service-error']['status']['statusCode']=='INVALID_INPUT'){
		console.log("No coauthors");
		return;}}
	catch(e){
	//	var buffer;
	var buffer= returnArray(temp['search-results']['entry'])
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
		try{
		Obj.city= buffer[i]['affiliation-current']['affiliation-city'];
       		Obj.country=buffer[i]['affiliation-current']['affiliation-country'];
       		Obj.affiliationId=buffer[i]['affiliation-current']['affiliation-id'];
       		Obj.affiliationName=buffer[i]['affiliation-current']['affiliation-name'];}
		catch(e){};
       		Obj.id=buffer[i]['dc:identifier'].split(":")[1];
       		Obj.documentCount=buffer[i]['document-count'];
       		Obj.name=buffer[i]['preferred-name'];
       		Obj.url="http://www.scopus.com/authid/detail.url?authorId="+Obj.id;
       	//	console.log(Obj);
		coauthorsObject.push(Obj);
		}
	}

}