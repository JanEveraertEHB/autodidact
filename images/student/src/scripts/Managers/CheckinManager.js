
class CheckinManager {
  constructor() {
    
    document.getElementById('checkin').addEventListener('click', this.handleClick.bind(this))
  }
  handleClick(e) {
    const statusBar = document.getElementById('status-bar');
    const token = getCookie("token");

    fetch(window.location.hostname + ":3000/actions/checkin", {
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
  }
}

export default CheckinManager;