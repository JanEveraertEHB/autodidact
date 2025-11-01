
window.addEventListener('DOMContentLoaded', () => {

	


	document.getElementById("submitLogin").addEventListener("click", (e) =>{
		const email = document.getElementById('loginEmail').value;
		const pass = document.getElementById('loginPass').value;
		var passhash = CryptoJS.MD5(pass).toString();
		window.electronAPI.setCookie({
		  url: 'https://206.189.8.155',
		  name: 'email',
		  value: email
		})
		window.electronAPI.setCookie({
		  url: 'https://206.189.8.155',
		  name: 'pass',
		  value: passhash
		})
		login(email, passhash);
	})

	document.getElementById("showRegister").addEventListener("click", (e) =>{
		document.getElementById('loginForm').style.display = "none";
		document.getElementById('registerForm').style.display = "block";

	})
	document.getElementById("showLogin").addEventListener("click", (e) =>{
		document.getElementById('loginForm').style.display = "block";
		document.getElementById('registerForm').style.display = "none";
	})
	document.getElementById("submitRegister").addEventListener("click", (e) =>{
		const first_name = document.getElementById('registerFirstname').value;
		const last_name = document.getElementById('registerLastname').value;
		const classgroup = document.getElementById('registerClass').value;
		const email = document.getElementById('registerEmail').value;
		const password = document.getElementById('registerPass').value;
		const hash = CryptoJS.MD5(password).toString();


		fetch("http://206.189.8.155:3000/students/register", {
				method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
				body: JSON.stringify({
					first_name: first_name, 
					last_name: last_name,
					email: email, 
					password: hash,
					class: classgroup,
					uuid: uuidv4()
				})
			})
				.then(r => r.json())
				.then(data => {
					console.log(data)
					window.electronAPI.setCookie({
					  url: 'https://206.189.8.155',
					  name: 'token',
					  value: data.token
					})
					window.electronAPI.setCookie({
					  url: 'https://206.189.8.155',
					  name: 'email',
					  value: email
					})
					window.electronAPI.setCookie({
					  url: 'https://206.189.8.155',
					  name: 'pass',
					  value: hash
					})
					document.getElementById('overlay').style.display = "none"
					document.getElementById("user").innerHTML = data.first_name + " " + data.last_name
				})
				.catch((e) => {
					console.log(e)
					console.error("wrong credentials")
				})
	})

	window.electronAPI.getCookies().then((c) => {
		console.log(c)
		const cookies = c;
		
		let email, pass, token;

		for(let i in cookies) {
			const cookie = cookies[i];
			if(cookie.name == "email" && cookie.domain == '206.189.8.155') {
				email = cookie.value;
			}
			if(cookie.name == "pass" && cookie.domain == '206.189.8.155') {
				pass = cookie.value;
			}
			if(cookie.name == "token" && cookie.domain == '206.189.8.155') {
				token = cookie.value;
			}
		}

		if(email && pass) {
			login(email, pass);
		} 
	});

})
function login(email, pass) {

		fetch("http://206.189.8.155:3000/students/login", {
				method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
				body: JSON.stringify({
					email: email, 
					password: pass
				})
			})
				.then(r => r.json())
				.then(data => {
					console.log(data)
					window.electronAPI.setCookie({
					  url: 'https://206.189.8.155',
					  name: 'token',
					  value: data.token
					})
					document.getElementById('overlay').style.display = "none"
					document.getElementById("user").innerHTML = data.first_name + " " + data.last_name
				})
				.catch((e) => {
					console.error("wrong credentials")
				})
}
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

function removeLogin() {
	document.getElementById("overlay").remove();
}