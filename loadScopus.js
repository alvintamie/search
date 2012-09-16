var requestHeaders = {};
 var scopusId;
 var it;
 var referenceObject = new Array();
 var referenceSize;
 var currentReferenceSize;
 // var citedbyUrl = new Array();

 var k=4937;
 //var k        =60055420;
 var limitk   =60070000;

function getContextCallback(response) {
	context = response;
	
	var prefs= new gadgets.Prefs();
   
        requestHeaders['Accept-Charset'] = "utf-8";
        requestHeaders['X-ELS-APIKey'] = "0efd37da9830a0e7f43dbe261f5f7956";
        requestHeaders['X-ELS-Authtoken'] = context.secureAuthtoken;      
        requestHeaders['Accept'] = "application/json, text/xml";
  
  	var urlRef = encodeURI("http://api.elsevier.com/content/abstract/scopus_id:"+context.scDocId+"?view=REF&startref=0");
	var urlCitedby = encodeURI("http://api.elsevier.com/content/search/index:scopus?query=refeid(2-s2.0-"+context.scDocId+")&view=COMPLETE&facets=country(count=200,sort=fd);");
	var urlCoauthors=encodeURI( "http://api.elsevier.com/content/search/index:author?query=affil(university)&co-author="+context.au1Id+"&count=200&facets=country(count=200,sort=fd);");
//	var url=encodeURI( "http://api.elsevier.com/content/search/index:scopus?query=all(\"apple\")&sort=coverDate&facets=country(count=200,sort=fd);subjarea(count=100,sort=fd);pubyear(count=20);authname(count=20,sort=fd);");
//	var url=encodeURI( "http://api.elsevier.com/content/search/index:scopus?query=all((a) OR (b) OR (c) OR (d) OR (e) OR (f) OR (g) OR (h) OR (i) OR (j) OR (k) OR (l) OR (m) OR (n) OR (o) OR (p) OR (q) OR (r) OR (s) OR (t) OR (u) OR (v) OR (w) OR (x) OR (y) OR (z))&sort=coverDate&facets=country(count=250,sort=fd);");
//	gadgets.sciverse.makeContentApiRequest(urlCitedby, getCitedby, requestHeaders);
 //	gadgets.sciverse.makeContentApiRequest(urlCoauthors, getCoauthors, requestHeaders);

 //	setInterval(getTInit,150);
 //	setInterval(getNotRet,150);
 //	gadgets.sciverse.makeContentApiRequest(urlRelevantDocument, getR, requestHeaders);
 //	gadgets.sciverse.makeContentApiRequest(urlRef, getRef, requestHeaders);
 //	setInterval(getCountry,150);
 	writeT();
}
function writeT(){
	
	localStorage['0']="ayam";
}
	var countryArray=new Array("Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Czechoslovakia", "Democratic Republic Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Federated States of Micronesia", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "North Korea", "Northern Mariana Islands", "Norway", "Oman", "Pacific Islands", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Russian Federation", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United Nations", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City State", "Venezuela", "Viet Nam", "Virgin Islands", "Wallis and Futuna", "Western Sahara", "Yemen", "Yugoslavia", "Zaire", "Zambia", "Zimbabwe");
	var statusWait=1;
	var country;
	var cc=0;
function getCountry(){
	if(statusWait==0) return;
	if(cc>4) return;
	country=countryArray[cc];
	var url=encodeURI( "http://api.elsevier.com/content/search/index:affiliation?query=affil("+country+")");
	statusWait=0;
	cc++;
	gadgets.sciverse.makeContentApiRequest(url, getInitialR, requestHeaders);	
}
var justCount=0;
var justLast=0;
function getInitialR(response){
	console.log(country);
	var temp = JSON.parse(parseValidator(response.text));	
	var total=temp['search-results']['opensearch:totalResults'];
	console.log("total search = "+total);
	if(total==0) { console.log("no result"); statusWait=1; return;}
	justCount=0; justLast=Math.ceil(total/200);
	for(var i=0;i<Math.ceil(total/200);i++){
	var url=encodeURI( "http://api.elsevier.com/content/search/index:affiliation?query=affil("+country+")&start="+(200*i)+"&count=200");
	gadgets.sciverse.makeContentApiRequest(url,getR,requestHeaders);
	}
}
function getR(response){
//	console.log("search-test");
	var temp = JSON.parse(parseValidator(response.text));
	var buffer=returnArray(temp['search-results']['entry']);
	for(var i=0;i<buffer.length;i++){
		try {console.log(buffer[i]['affiliation-name']);} catch(e) {console.log("null");}
		try {console.log(buffer[i]['city']);} catch(e){console.log("null");}
		try {console.log(buffer[i]['country']);} catch(e){console.log("null");}
		try {console.log(buffer[i]['dc:identifier']);} catch(e) {console.log("null");}
	}
	
	if(justCount==justLast-1) statusWait=1;
	justCount++;
}

function getTInit(){
	if(k>limitk) return;
	var url=encodeURI("http://api.elsevier.com/content/affiliation/affiliation_id:"+k);
		try{
		gadgets.sciverse.makeContentApiRequest(url, getT, requestHeaders);}
		catch(e){};
	k++;}

function getNotRet(){

	if(k==notR.length) return;
	var l=notR[k];
	var url=encodeURI("http://api.elsevier.com/content/affiliation/affiliation_id:"+l);
		try{
		gadgets.sciverse.makeContentApiRequest(url, getT, requestHeaders);}
		catch(e){};
	k++;}

function getT(response){
	var temp = JSON.parse(response.text);
//	console.log(temp);
	console.log(temp['affiliation-retrieval-response']['affiliation-name']+"\n"+temp['affiliation-retrieval-response']['city']+"\n"+temp['affiliation-retrieval-response']['country']+"\n"+temp['affiliation-retrieval-response']['coredata']['dc:identifier']);


}

function panggil(){
    console.log("v1");
}