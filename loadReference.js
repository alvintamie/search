var idToIndex= new Object();
var readyRef=0;
var currentReferenceSize=0;
var referenceObject = new Array();
var referenceObjectTemp;
var referenceSize;
var currentReferenceSize;
var referenceLevel=0;
var countryReference= new Array();
function getRef(response){
  	console.log("ref is obtained");
	var temp = JSON.parse(response.data);
	console.log(temp);
	var buffer=temp['abstracts-retrieval-response']['references']['reference'];
	console.log("SizeOfRef : "+buffer.length);
	readyRef=1;
	for(var i=0;i<buffer.length;i++){
		var Obj= new Object();
		try{
			Obj.author=returnArray(buffer[i]['author-list']['author']);
			Obj.citedby=buffer[i]['citedby-count'];
			Obj.sourcetitle=buffer[i]['sourcetitle'];
			Obj.scopusId=buffer[i]['scopus-id'];}
		catch(e){ console.log("initial reference property error");}
		idToIndex[Obj.scopusId]=i+(40*referenceLevel);
		referenceObject.push(Obj);
	}
	referenceObjectTemp=buffer;
	// 
	if(buffer.length==40){
		referenceLevel++;
		var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=REF&startref="+referenceLevel*40+"&refcount=40");
		gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);    
	}
	else{
		referenceSize=referenceObject.length;
		numberRef=referenceObject.length;
		relatedDocumentQuery(buffer);
	referenceQuery(referenceObject);}
}

function referenceQuery(buffer){
	var urlR="http://api.elsevier.com/content/search/index:SCOPUS?query=EID(";
	console.log("hoi "+buffer.length);
	console.log(buffer);
	var sc;
	for(var i=0;i<buffer.length;i++){
		sc=buffer[i].scopusId;
		if(i<buffer.length){ urlR=urlR+"(2-s2.0-"+sc+")";}
		if(i<buffer.length-1){ urlR=urlR+" OR ";}
	}

	urlR=encodeURI(urlR+")&view=COMPLETE&start=0&count=200&facets=country(count=200,sort=fd);");
	console.log(urlR);
	gadgets.sciverse.makeContentApiRequest(urlR, getReference, requestHeaders);
}

function getReference(response){
	console.log("ref details is obtained");
	var temp = JSON.parse(response.data);
	   
	buffer=returnArray(temp['search-results']['entry']);
	console.log(buffer.length);
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
			referenceObject[index].Abstract=buffer[i]['dc:description'];
			referenceObject[index].title=buffer[i]['dc:title'];
			referenceObject[index].publicationName=buffer[i]['publicationName'];
			referenceObject[index].volume=buffer[i]['volume'];
			referenceObject[index].type=buffer[i]['subtypeDescription'];
			referenceObject[index].url="http://www.scopus.com/record/display.url?eid=2-s2.0-"+referenceObject[index].scopusId+"&origin=resultslist&sort=plf-f&src=s";
			// console.log("index "+index+" "+buffer[i]['dc:title']);
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
	updateReference(referenceObject,0);
	showOverallCountryReference(filterReferenceCountry(referenceObject));

	showResult(0,referenceObject);
}

function filterReferenceCountry(Obj){
	var temp= new Object();
	for(var i=0;i<Obj.length;i++){
		if( typeof temp[Obj[i].country]=='undefined')
		temp[Obj[i].country]=1;
		else
		temp[Obj[i].country]++;
	}
	var buffer = new Array();
	for(key in temp){
		if(temp[key]=='undefined') continue;
		var b= new Object();
		b.name=key;
		b.hitCount=temp[key];
		if(b.name=='undefined') continue;
		buffer.push(b);
	}
	for(var i=0;i<buffer.length;i++){
		for(var j=i+1;j<buffer.length;j++){
			if(buffer[i].hitCount<buffer[j].hitCount){
				var x = buffer[j];
				buffer[j]=buffer[i];
				buffer[i]=x;
			}
		}
	}
	console.log("buffer");
	console.log(buffer);
	return buffer;
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
	urlCity=encodeURI(urlCity+")&start=0&count=200");
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