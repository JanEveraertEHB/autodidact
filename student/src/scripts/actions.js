

const actionStates = {
  raise_hand: false,
  unclear: false,
  show_me: false,
  too_fast: false
}
document.addEventListener('DOMContentLoaded', async function() {
  const c = await window.electronAPI.getCookies();
  if(c.filter((e) => e.name == "token").length > 0) {
    const token = c.filter((e) => e.name == "token")[0].value
    fetch('http://localhost:3000/actions/request', {
        headers: { 
          'Content-Type': 'application/json' ,
          "Authorization": token

        }
    })
    .then(r => r.json())
    .then((d) => {
      d.forEach((e) =>{
        actionStates[e.request] = e.active;
      })
      updateStates()
    })
    .catch(console.error);
  }

  const raise_hand = document.getElementById("raise_hand")
  const unclear = document.getElementById("unclear")
  const show_me = document.getElementById("show_me")
  const too_fast = document.getElementById("too_fast")


  raise_hand.addEventListener('click', function(e) {
    e.preventDefault()
    actionStates.raise_hand = !actionStates.raise_hand
    sendToAPI("raise_hand", actionStates.raise_hand)
    updateStates();
  })
  unclear.addEventListener('click', function(e) {
    e.preventDefault()
    actionStates.unclear = !actionStates.unclear
    sendToAPI("unclear", actionStates.unclear)
    updateStates();
  })
  show_me.addEventListener('click', function(e) {
    e.preventDefault()
    actionStates.show_me = !actionStates.show_me
    sendToAPI("show_me", actionStates.show_me)
    updateStates();
  })
  too_fast.addEventListener('click', function(e) {
    e.preventDefault()
    actionStates.too_fast = !actionStates.too_fast
    sendToAPI("too_fast", actionStates.too_fast)
    updateStates();
  })
});
function updateStates() {
  show_me.className =  actionStates.show_me ? "action active" : "action"
  too_fast.className =  actionStates.too_fast ? "action active" : "action"
  unclear.className =  actionStates.unclear ? "action active" : "action"
  raise_hand.className =  actionStates.raise_hand ? "action active" : "action"

}
async function sendToAPI(action, active) {
  const c = await window.electronAPI.getCookies();
  if(c.filter((e) => e.name == "token").length > 0) {
    const token = c.filter((e) => e.name == "token")[0].value
    fetch('http://localhost:3000/actions/request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' ,
          "Authorization": token

        },
        body: JSON.stringify({ 
          request: action,
          active: active
        })
    })
    .catch(console.error);
  }
}
