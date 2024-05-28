const urlBase = 'http://rodriguezagustin.com//LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() 
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("response").innerHTML = "";

	let tmp = { login: login, password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("response").innerHTML = "Invalid username or password";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				//saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

/*function saveCookie() 
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() 
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}*/

function doRegister() 
{
	userId = 0;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	if (firstName == "") 
	{
		document.getElementById("response").innerHTML = "Please input a first name";
		return;
	}

	if (lastName == "") 
	{
		document.getElementById("response").innerHTML = "Please input a last name";
		return;
	}

	if (login == "") 
	{
		document.getElementById("response").innerHTML = "Please input a login";
		return;
	}

	if (password == "") 
	{
		document.getElementById("response").innerHTML = "Please input a password";
		return;
	}

	let tmp = { firstName: firstName, lastName: lastName, login: login, password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try 
	{
		xhr.send(jsonPayload);
		document.getElementById("response").innerHTML = "Account has been successfully registered";
	}
	catch (err) 
	{
		document.getElementById("response").innerHTML = err.message;
	}
}

function loadName()
{
	document.getElementById("greeting").innerHTML = "Hello, " + firstName + " " + lastName + "!";
}

function doLogout() 
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function displayAddContacts()
{
	//document.getElementById("").innerHTML = "YOU CLICKED ME!";
	document.getElementById("searchContact").style.display = "none";
	document.getElementById("displayAddContacts").style.display = "none";
	document.getElementById("doSearch").style.display = "none";

	document.getElementById("doContacts").style.display = "block";
	document.getElementById("firstName").type = "show";
	document.getElementById("lastName").type = "show";
	document.getElementById("phone").type = "show";
	document.getElementById("email").type = "show";
}

function addContacts()
{
	let newColor = document.getElementById("contactText").value;
	document.getElementById("contactAddResult").innerHTML = "";

	//^\d{3}\-\d{3}\-\d{4}$ phone number regex

	///^[^\s@]+@[^\s@]+\.[^\s@]+$/ email regex


	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function showContacts()
{
	document.getElementById("searchContact").style.display = "initial";
	document.getElementById("displayAddContacts").style.display = "initial";
	document.getElementById("doSearch").style.display = "initial";

	document.getElementById("doContacts").style.display = "none";
	document.getElementById("firstName").type = "hidden";
	document.getElementById("lastName").type = "hidden";
	document.getElementById("phone").type = "hidden";
	document.getElementById("email").type = "hidden";
}

function searchContacts() 
{
	let srch = document.getElementById("searchContact").value;
	document.getElementById("searchResult").innerHTML = "";

	let contactList = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("searchResult").innerHTML = "Contact(s) have been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);

				for (let i = 0; i < jsonObject.results.length; i++) {
					contactList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1) {
						contactList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}