document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message');
    const submitInput = document.getElementById('submitquestion');
    const statusBar = document.getElementById('status-bar');
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && messageInput.value.trim() !== '') {
            e.preventDefault();
            sendMessage();
        }
    });
    submitInput.addEventListener('click', function(e) {
    	if (messageInput.value.trim() !== '') {
            e.preventDefault();
            sendMessage();
        }
    })
    async function sendMessage() {
        const c = await window.electronAPI.getCookies();
        const token = c.filter((e) => e.name == "token")[0].value
        const message = messageInput.value.trim();
        fetch("http://localhost:3000/actions/questions", {
        	method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
        	body: JSON.stringify({
        		question:message,
            uuid: uuidv4()
        	})
        })
	    	.then(r => r.json())
	    	.then((data) => {
	    		console.log(data)

	    		if(data.message == "success") {
	          statusBar.textContent = 'Message received!';
	        	statusBar.className = 'status-bar success';
	    		} else {
	          statusBar.textContent = 'Something went wrong!';
	        	statusBar.className = 'status-bar error';
	    		}
	    	})
	    	.catch((e) => {
	          statusBar.textContent = 'Something went wrong!';
	        	statusBar.className = 'status-bar error';

	    	})

  }
});
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}