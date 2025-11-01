const cache = [];

document.addEventListener('DOMContentLoaded', function() {
    monitorMicLevel(level => {
        cache.push(level);
        if (cache.length > 100) cache.shift();
    });

    setInterval(async () => {
        if (cache.length === 0) return;
        const total = cache.reduce((acc, val) => acc + val, 0);
        const average = 100 * (total / cache.length);
        const c = await window.electronAPI.getCookies();
        if(c.filter((e) => e.name == "token").length > 0) {
            const token = c.filter((e) => e.name == "token")[0].value
            
            if(average > 1.5) {
    	        fetch('http://localhost:3000/actions/mic-level', {
    	            method: 'POST',
    	            headers: { 
    	            	'Content-Type': 'application/json' ,
    	              "Authorization": token

    	            },
    	            body: JSON.stringify({ level: Math.ceil(average)})
    	        })
    	        .catch(console.error);
    	    }
        }
    }, 500);
});

async function monitorMicLevel(callback) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    function update() {
        analyser.getByteTimeDomainData(data);
        const rms = Math.sqrt(data.reduce((s, v) => s + (v - 128) ** 2, 0) / data.length);
        callback(rms / 128);
        requestAnimationFrame(update);
    }

    update();
}
