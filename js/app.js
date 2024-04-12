const audioContext = new AudioContext();
let osc = audioContext.createOscillator();
osc.type = "sine";
osc.connect(audioContext.destination);
osc.start(audioContext.currentTime);
