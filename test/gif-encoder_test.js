var assert = require('assert');
var fs = require('fs');
var GifEncoder = require('../lib/GIFEncoder.js');

// TODO: Test multiple frames
describe('GifEncoder encoding a checkerboard', function () {
  before(function (done) {
    // Generate a new image
    var gif = new GifEncoder(10, 10);

    // Collect output
    var data = [];
    this.data = data;
    gif.on('data', function (val) {
      data.push(val);
    });
    gif.on('end', function () {
      done();
    });

    // Write content
    var pixels = require('./test-files/checkerboard-pixels.json');
    gif.writeHeader();
    gif.addFrame(pixels);
    gif.finish();

    // Save gif for later
    this.gif = gif;
  });

  it('generates the expected bytes', function () {
    // TODO: Output canvas to a file, perceptual diff GIF to canvas output =3
    // Grab the expected content
    var expectedBytes = fs.readFileSync(__dirname + '/expected-files/checkerboard.gif');

    // Grab the actual content
    var actualBytes = new Buffer(this.data);

    // DEV: Write out actual file to expected file
    if (process.env.DEBUG_TEST) {
      try { fs.mkdirSync(__dirname + '/actual-files'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual-files/checkerboard.gif', actualBytes);
    }

    // Assert the expected matches the actual content
    assert.deepEqual(expectedBytes, actualBytes);
  });
});
