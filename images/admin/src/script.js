

const actionStates = {
  raise_hand: 0,
  unclear: 0,
  show_me: 0,
  too_fast: 0
}
const status = document.getElementById("status");
const messages = document.getElementById("questions");

const appendMessage = (content) => {
  const item = document.createElement("div");
  item.innerHTML = content;
  messages.appendChild(item);
};

const socket = io(window.location.protocol + "//"+window.location.hostname+":3000/");

socket.on("connect", () => {
  status.innerText = "Connected";
  console.log(`event: connect | session id: ${socket.id}`);
});

socket.on("connect_error", (err) => {
  appendMessage(`event: connect_error | reason: ${err.message}`);
});

socket.on("disconnect", (reason) => {
  status.innerText = "Disconnected";
  appendMessage(`event: disconnect | reason: ${reason}`);
});

socket.onAny((event, ...args) => {
  if(event == "message") {
    const ar = JSON.parse(args[0])
    if(ar.question){
      const html = `
        <div class="question" id="${ar.uuid}">
          <div class="questionHeader">
            <span class="username">${ar.user.first_name} ${ar.user.last_name}</span>
            <button id="btn-${ar.uuid}">Mark handled</button>
          </div>
          <p>${ar.question}</p>
        </div>`
      messages.insertAdjacentHTML("afterbegin", html);
      document.getElementById("btn-"+ar.uuid).addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById(ar.uuid).remove();
      })

    } else if(ar.request) {
      actionStates[ar.request] += ar.active ? 1 : -1;
      if(actionStates[ar.request] < 0) { 
        actionStates[ar.request] = 0;
      } 
      document.getElementById(ar.request).querySelector("div").innerText = actionStates[ar.request]
      if(actionStates[ar.request] > 0) {
        document.getElementById(ar.request).className = "request active";
      } else {
        document.getElementById(ar.request).className = "request";
      }

    }
  }
});