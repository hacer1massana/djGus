
  const AC = new AudioContext();
  
  
const playButton = document.getElementById('play')
const stopButton = document.getElementById('stop')

const masterVolume = AC.createGain()  
masterVolume.gain.value = 0.0
masterVolume.connect(AC.destination)

/*const createAudioNode = ({type = 'sine', freq = 440, gain = 1.0} = {}) => {
  const osc = AC.createOscillator()
  osc.frequency.value = freq
  osc.type = type
  const _gain = AC.createGain()
  _gain.gain.value = gain
  osc.connect(_gain)
  return { osc, gain: _gain }
}*/
const carrier = createAudioNode({"type":"sine","freq":440,"gain":0.30000001192092896});
const modulators = [].map(m => createAudioNode(m));
const startSound = () => {
  if (modulators.length > 0) {
    modulators[0].gain.connect(carrier.osc.frequency)
    modulators.reduce((a, b) => {
      b.gain.connect(a.gain.gain)
      return b
    })
    modulators.map(m => m.osc.start())  
  }
  carrier.osc.start()
  carrier.gain.connect(masterVolume)
}
startSound()

const discardSound = () => {
  modulators.map(m => {
    m.gain.disconnect()
    m.osc.stop()
  })
  carrier.osc.disconnect()
  carrier.osc.stop()
}
/*
playButton.addEventListener('click', () => {
  if (AC.state === "suspended") {
    AC.resume()
  }
  if (masterVolume.gain.value === 0.0) {
    masterVolume.gain.setValueAtTime(0.01, AC.currentTime)
  }
  masterVolume.gain.exponentialRampToValueAtTime(1.0, AC.currentTime + 1)
})

stopButton.addEventListener('click', () => {
  masterVolume.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + 1)
})*/

  
  function OSCdisplay() {
    this.analyser = AC.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.connect(AC.destination)
    this.buffer = new Uint8Array(this.analyser.frequencyBinCount)
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.anim()
  }
  
  const createAudioNode = ({type = "sine", freq = 440, gain = 1.0} = {}) => {
  const _osc = AC.createOscillator()
  _osc.frequency.value = freq
  _osc.type = type
  _osc.start()
  const _gain = AC.createGain()
  _gain.gain.value = gain
  _osc.connect(_gain)
  return {
    get type() {
      return _osc.type
    },
    set type(val) {
      _osc.type = val
    },
    get freq() {
      return _osc.frequency.value
    },
    set freq(val) {
      _osc.frequency.value = val
    },
    get gain() {
      return _gain.gain.value
    },
    set gain(val) {
      _gain.gain.value = val
    },
    toJSON() {
      return {
        type: _osc.type,
        freq: _osc.frequency.value,
        gain: _gain.gain.value
      }
    },
    _gain, _osc    
  }
}

funtion addOscillator(type = "sine", freq = 1, gain = 100.0) {
    this.disconnectNodes()
    this.mods.push(createAudioNode({ type, freq, gain }))
    this.connectNodes()
  };
  funtion removeOscillator(idx) {
    this.disconnectNodes()
    this.mods.splice(idx, 1)
    this.connectNodes()
  };
  funtion connectNodes() {
    if (this.mods.length > 0) {
      this.mods[0]._gain.connect(this.carrier._osc.frequency)
      for (i = 1; i < this.mods.length; i++) {
        this.mods[i]._gain.connect(this.mods[i - 1]._gain.gain)
      }
    }
  };
 function disconnectNodes() {
      this.mods.map(mod => mod._gain.disconnect())
    };
   function play() {
     
     test('play')
     
      if (AC.state === "suspended") {
        AC.resume()
      }
      this.disconnectNodes()
      this.connectNodes()
      this.carrier._gain.connect(this.analyser)
    };
   function stop() {
      this.carrier._gain.disconnect()
    };
  function anim() {
    requestAnimationFrame(() => this.anim())
    const { ctx, canvas, analyser, buffer } = this
    const width = canvas.width || 400
    const height = canvas.height || 300
    ctx.strokeStyle = "rgb(128,255,128)"
    ctx.clearRect(0, 0, width, height)
    analyser.getByteTimeDomainData(buffer)
    const dx = width / buffer.length
    const my = height / 2
    ctx.beginPath()
    ctx.moveTo(0, my + ((127 - buffer[0]) / 128.0) * my)
    for (let i = 1; i < buffer.length; i++) {
      ctx.lineTo(i * dx, my + ((127 - buffer[i]) / 128.0) * my)
    }
    ctx.stroke()
  };
