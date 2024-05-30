const urlBase = 'http://rodriguezagustin.com//LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

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
	try 
	{
		xhr.onreadystatechange = function () 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) 
				{
					document.getElementById("response").innerHTML = "Invalid username or password";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("response").innerHTML = err.message;
	}

}

function saveCookie() 
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
	for (var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") 
		{
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") 
		{
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") 
		{
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) 
	{
		window.location.href = "index.html";
	}
}

function doRegister() 
{
	document.getElementById("response").innerHTML = "";
	document.getElementById("response").style.color = "#ff0008";
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
		xhr.onreadystatechange = function () 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error === "")
				{
					document.getElementById("response").style.color = "green";
					document.getElementById("response").innerHTML = "Account successfully created"
				}
				else
				{
					document.getElementById("response").innerHTML = jsonObject.error;
				}
			}
		}
		xhr.send(jsonPayload);
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
	document.getElementById("searchResponse").innerHTML = "";
	document.getElementById("homeContactsScreen").style.display = "none";
	document.getElementById("addContactScreen").style.display = "block";
}

function addContacts()
{
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	if (firstName == "") {
		document.getElementById("response").innerHTML = "Please input a first name";
		return;
	}

	if (lastName == "") {
		document.getElementById("response").innerHTML = "Please input a last name";
		return;
	}

	if(!/^\d{3}\-\d{3}\-\d{4}$/.test(phone))
	{
		document.getElementById("response").innerHTML = "Phone number must be in the form XXX-XXX-XXXX";
		return;
	}

	if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
	{
		document.getElementById("response").innerHTML = "Email must be in the form name@email.com";
		return;
	}


	let tmp = {firstName:firstName,lastName:lastName,phone:phone,email:email, userID:userId};
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
				showContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function deleteContacts()
{
	let url = urlBase + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log("Contact has been deleted");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}

function showContacts()
{
	document.getElementById("firstName").value = "";
	document.getElementById("lastName").value = "";
	document.getElementById("phone").value = "";
	document.getElementById("email").value = "";
	document.getElementById("response").innerHTML = "";
	document.getElementById("homeContactsScreen").style.display = "initial";
	document.getElementById("addContactScreen").style.display = "none"
}

function searchContacts() 
{
    let srch = document.getElementById("searchContact").value;
    document.getElementById("searchResponse").innerHTML = "";
	let rowCount = document.getElementById("contactList").rows.length
	for (let i = rowCount - 1; i > 0; i--) 
	{
		document.getElementById("contactList").deleteRow(i);
	}

    let tmp = { search: srch, userID: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.id == 0) 
				{
					document.getElementById("contactList").style.display = "none";
					document.getElementById("searchResponse").innerHTML = "No contacts found";
					return;
				}

                for (let i = 0; i < jsonObject.results.length; i++) 
				{
					ids[i] = jsonObject.results[i].ID;
					document.getElementById("contactList").style.display = "table";
					let firstName = JSON.stringify(jsonObject.results[i].FirstName);
					let lastName = JSON.stringify(jsonObject.results[i].LastName);
					let phone = JSON.stringify(jsonObject.results[i].Phone);
					let email = JSON.stringify(jsonObject.results[i].Email);
					
					firstName = firstName.replace(/"/g, '');
					lastName = lastName.replace(/"/g, '');
					phone = phone.replace(/"/g, '');
					email = email.replace(/"/g, '');
					let row = document.getElementById("contactList").insertRow();
					row.style.backgroundColor = "transparent";
					let cell = row.insertCell(0);
					cell.innerHTML = firstName;
					cell = row.insertCell(1);
					cell.innerHTML = lastName;
					cell = row.insertCell(2);
					cell.innerHTML = phone;
					cell = row.insertCell(3);
					cell.innerHTML = email;
					cell = row.insertCell(4);

					let deleteButton = document.createElement("button");
					deleteButton.onclick = function() {deleteContact(row.rowIndex)};
					let deleteIcon = document.createElement("img")
					deleteIcon.src = "/images/Delete.png";
					deleteIcon.id = "deleteIcon";
					deleteButton.appendChild(deleteIcon)
					deleteButton.className = "deleteButton";
					cell.appendChild(deleteButton);

					let editButton = document.createElement("button");
					editButton.id = "editButton" + (i + 1);
					editButton.onclick = function() {startEditContact(row.rowIndex)};
					let editIcon = document.createElement("img")
					editIcon.src = "/images/Edit.png";
					editIcon.id = "editIcon";
					editButton.appendChild(editIcon)
					editButton.className = "deleteButton";
					cell.appendChild(editButton);

					let confirmButton = document.createElement("button");
					confirmButton.style.display = "none";
					confirmButton.id = "confirmButton" + (i + 1);
					confirmButton.onclick = function () { editContact(row.rowIndex) };
					let confirmIcon = document.createElement("img")
					confirmIcon.src = "/images/Confirm.png";
					confirmIcon.id = "confirmIcon";
					confirmButton.appendChild(confirmIcon)
					confirmButton.className = "deleteButton";
					cell.appendChild(confirmButton);
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) 
	{
        document.getElementById("searchResult").innerHTML = err.message;
    }
}

function deleteContact(row)
{
	let firstName = document.getElementById("contactList").rows[row].cells[0].innerHTML;
	let lastName = document.getElementById("contactList").rows[row].cells[1].innerHTML;
	if(confirm("Are you sure you want to delete contact " + firstName + " " + lastName + "?"))
	{
		let tmp = { userId: userId, firstName: firstName, lastName: lastName};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/DeleteContact.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		try {
			xhr.onreadystatechange = function () 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					document.getElementById("contactList").deleteRow(row);
				}
			};
			xhr.send(jsonPayload);
		}
		catch (err) 
		{
		}
	}
}

function startEditContact(row)
{
	document.getElementById("editButton" + row).style.display = "none";
	document.getElementById("confirmButton" + row).style.display = "inline-block";
	let firstName = document.getElementById("contactList").rows[row].cells[0].innerHTML;
	let lastName = document.getElementById("contactList").rows[row].cells[1].innerHTML;
	let phone = document.getElementById("contactList").rows[row].cells[2].innerHTML;
	let email = document.getElementById("contactList").rows[row].cells[3].innerHTML;
	document.getElementById("contactList").rows[row].cells[0].innerHTML = "<input type = 'edit' " + "id ='firstname" + row + "' " + "value = '" + firstName + "'>";
	document.getElementById("contactList").rows[row].cells[1].innerHTML = "<input type = 'edit' " + "id ='lastname" + row + "' " + "value = '" + lastName + "'>";
	document.getElementById("contactList").rows[row].cells[2].innerHTML = "<input type = 'edit' " + "id ='phone" + row + "' " + "value = '" + phone + "'>";
	document.getElementById("contactList").rows[row].cells[3].innerHTML = "<input type = 'edit' " + "id ='email" + row + "' " + "value = '" + email + "'>";
}

function editContact(row)
{
	let firstName = document.getElementById("firstname" + row).value;
	let lastName = document.getElementById("lastname" + row).value;
	let phone = document.getElementById("phone" + row).value;
	let email = document.getElementById("email" + row).value;
	let contactID = ids[row - 1];

	document.getElementById("contactList").rows[row].cells[0].innerHTML = firstName;
	document.getElementById("contactList").rows[row].cells[1].innerHTML = lastName;
	document.getElementById("contactList").rows[row].cells[2].innerHTML = phone;
	document.getElementById("contactList").rows[row].cells[3].innerHTML = email;

	document.getElementById("editButton" + row).style.display = "inline-block";
	document.getElementById("confirmButton" + row).style.display = "none";

	let tmp = {firstName: firstName, lastName: lastName, phone: phone, email: email, userID: userId, contactID: contactID}

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try 
	{
		xhr.onreadystatechange = function ()
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log("GOOD");
			}
		}
		xhr.send(jsonPayload);
	}
	catch (err) {
	}
}