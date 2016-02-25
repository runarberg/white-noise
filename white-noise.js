var RECT = 15;

document.addEventListener("DOMContentLoaded", main);

function main() {
  var canvas = document.getElementById("white-noise");
  var canvasCtx = canvas.getContext("2d");

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  draw(canvasCtx);
  play(audioCtx);
}

function draw(ctx) {
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var gray, x, y;

  for (x = 0; x < width; x += RECT) {
    for (y = 0; y < height; y += RECT) {
      gray = (Math.random() * 256)|0;
      ctx.fillStyle = "rgb(" + gray + "," + gray + "," + gray + ")";
      ctx.fillRect(x, y, RECT, RECT);
    }
  }

  requestAnimationFrame(function() { draw(ctx); });
}

function play(audioCtx) {
  var channels = 2;
  var frameCount = 2 * audioCtx.sampleRate;
  var volume = 0.3;

  var buffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

  var channelData, channel, frame;
  for (channel = 0; channel < channels; channel += 1) {
    channelData = buffer.getChannelData(channel);
    for (frame = 0; frame < frameCount; frame += 1) {
      channelData[frame] = 2.0 * Math.random() - 1.0;
    }
  }

  var source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  var gain = audioCtx.createGain();
  gain.gain.value = volume;

  gain.connect(audioCtx.destination);
  source.connect(gain);

  source.start();
}
