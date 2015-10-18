const Hilbertify = (function() {
  var gray = function( x ) {
    return( x ^ (x >> 1) );
  };

  var disgray = function( x ) {
    for ( var mask = x >> 1; mask != 0; mask = mask >> 1 ) x = x ^ mask;
    return x;
  };

  var ones_mask = function(x) { // ones_mask(5) => 0b11111
    var ones = 0;
    for ( var i = 0; i < x; ++i )
      ones += ( 1 << i );

    return ones;
  };

  var active_bit = function(x) {
    var len = 0;
    for ( var xx = x & -x; xx > 0; xx = xx >> 1 ) len++;
    return len + 1;
  };

  var rotate_bits = function(x, rotation, width) {
    var mask = ones_mask(width);
    x &= mask;
    return (mask & (x << rotation)) | (x >> (width - rotation));
  };

  return function( _scalar, rank ) {
    var MAX_SHIFT = 30,
        MAX_INT   = ((1 << MAX_SHIFT) -1 << 1) + 1,
        scalar    = _scalar * MAX_INT >> 1,
        rank_mask = ones_mask(rank),
        two_rank  = 1 << (rank - 1),
        grayed    = gray(scalar),
        rotation  = 0,
        flipbit   = 0,
        outputs   = [];

    while ( outputs.length < rank ) {
      outputs.push(0);
    }

    for ( var i = 0; i <= MAX_SHIFT; ++i ) {
      var shift     = MAX_SHIFT - rank * (i + 1);
      var shift_out = MAX_SHIFT - i;
      if ( shift < 0 ) break;

      var chunk   = two_rank ^ (rank_mask & (grayed >> shift)); // why flip the top bit of the chunk?
      var rotated = flipbit ^ rotate_bits(chunk, rotation, rank);

      for ( var j = 0; j < rank; j++ ) {
        if ( (rotated & (1 << j)) > 0 )
          outputs[j] += 1 << shift_out;
      }

      // prepare for the next round
      flipbit = 1 << rotation;
      rotation = (rotation + active_bit(chunk)) % rank;
    }

    for ( i = 0; i < outputs.length; i++ ) {
      outputs[i] = disgray(outputs[i]) / MAX_INT;
    }

    return outputs;
  }
})();

export default Hilbertify;
