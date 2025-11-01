document.addEventListener('DOMContentLoaded', function() {
    
    
        const statusBar = document.getElementById('status-bar');

    document.getElementById('checkin').addEventListener('click', async function(e) {
    	
        const c = await window.electronAPI.getCookies();
        const token = c.filter((e) => e.name == "token")[0].value

        fetch("http://localhost:3000/actions/checkin", {
        	method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
        	body: JSON.stringify({
        		checkin: "0"
        	})
        })
	    	.then(r => r.json())
	    	.then((data) => {
	    		console.log(data)

	    		if(data.message == "success") {
	          statusBar.textContent = 'Checkin received!';
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

  })
});