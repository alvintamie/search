var idToIndex= new Object();
var readyRef=0;
var numberRef=0;
var currentReferenceSize=0;
var referenceObject = new Array();
var referenceObjectTemp;
var referenceSize;
var currentReferenceSize;
function getRef(response){
  	console.log("ref is obtained");
	var temp = JSON.parse(response.data);
	console.log(temp);
	var buffer=temp['abstracts-retrieval-response']['references']['reference'];
	referenceSize=buffer.length;
	console.log("SizeOfRef : "+buffer.length);
	numberRef=buffer.length;
	readyRef=1;
	referenceObject=[];
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
		try{
			Obj.author=returnArray(buffer[i]['author-list']['author']);
			Obj.citedby=buffer[i]['citedby-count'];
			Obj.sourcetitle=buffer[i]['sourcetitle'];
			Obj.scopusId=buffer[i]['scopus-id'];}
		catch(e){ console.log("initial reference property error");}
		idToIndex[Obj.scopusId]=i;
		referenceObject.push(Obj);
	}
	referenceObjectTemp=buffer;
	relatedDocumentQuery(buffer);
	referenceQuery(buffer);
}

function referenceQuery(buffer){
	urlReference="http://api.elsevier.com/content/search/index:SCOPUS?query=EID(";
	for(var i=0;i<buffer.length;i++){
		scopusId=buffer[i]['scopus-id'];
		if(i<numberRef){ urlReference=urlReference+"(2-s2.0-"+scopusId+")";}
		if(i<numberRef-1){ urlReference=urlReference+" OR ";}
	}
	urlReference=encodeURI(urlReference+")&view=COMPLETE&facets=country(count=200,sort=fd);");
	gadgets.sciverse.makeContentApiRequest(urlReference, getReference, requestHeaders);
}

function getReference(response){
	console.log("ref details is obtained");
	var temp = JSON.parse(response.data);
	console.log(temp);
	buffer=returnArray(temp['search-results']['entry']);
	for(var i=0;i<buffer.length;i++){
		try{
			var index=idToIndex[buffer[i]['dc:identifier'].split(':')[1]];
			try{
			var tempAffil= returnArray(buffer[i]['affiliation']);
			referenceObject[index].afid=tempAffil[0]['afid'];
			referenceObject[index].affilname=tempAffil[0]['affilname'];}
			catch(e) { console.log("No affiliation property in reference");}
			referenceObject[index].authkeywords=buffer[i]['authkeywords'];
			referenceObject[index].creator=buffer[i]['dc:creator'];
			referenceObject[index].abstract=buffer[i]['dc:description'];
			referenceObject[index].title=buffer[i]['dc:title'];
			referenceObject[index].publicationName=buffer[i]['publicationName'];
			referenceObject[index].volume=buffer[i]['volume'];
			referenceObject[index].type=buffer[i]['subtypeDescription'];	
		}
		catch(e){
			console.log("Reference details at index "+i+" is error");}
	}
      getReferenceCity(referenceObject,getCityReference);
}

function getCityReference(response){
	getCityResponse(response,referenceObject,updateAllReference);
}
function updateAllReference(){
	console.log("get city of references");
	console.log(referenceObject);
	_readyScroll=1;
	showResult(0,referenceObject);
}

function getReferenceCity(Obj,getCity){
	console.log("get city");
	//"http://api.elsevier.com/content/search/index:affiliation?query=af-id((60016912)OR(60029157))";
	urlCity="http://api.elsevier.com/content/search/index:affiliation?query=af-id(";
	var count=0;
	if(Obj.length==0) { console.log("reference city is 0"); return;}
	for(var i=0;i<Obj.length;i++){
		if(!Obj[i].afid) { continue;}
		if(count==1) urlCity=urlCity+"OR";
		if(i<Obj.length) { urlCity=urlCity+"("+Obj[i].afid+")"; count=1;}
	}
	urlCity=encodeURI(urlCity+")");
	console.log(urlCity);
	gadgets.sciverse.makeContentApiRequest(urlCity, getCity, requestHeaders);	
}

function getCityResponse(response,Obj,updateAll){
	console.log("get City now");
	var temp = JSON.parse(response.data);
//	console.log(temp);
	var mapCity= new Object();
	var mapCountry= new Object();
	var mapName= new Object();
	var mapUrl= new Object();
	var buffer= temp['search-results']['entry'];
	for(var i=0;i<buffer.length;i++){
		var index=buffer[i]['dc:identifier'].split(':')[1];
		mapCity[index]=buffer[i]['city'];
		mapCountry[index]=buffer[i]['country'];
		mapName[index]=buffer[i]['affiliation-name'];
		mapUrl[index]="www.scopus.com/affil/profile.url?afid="+index;
	}
	for(var i=0;i<Obj.length;i++){
		var index=Obj[i].afid;
		Obj[i].city=mapCity[index];
		Obj[i].country=mapCountry[index];
		Obj[i].affilname=mapName[index];
		Obj[i].affilurl=mapUrl[index];
	}
//	console.log(Obj);
	updateAll();
//	updateReference();
}
