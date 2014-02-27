function randomint (min, max)
{
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomsign ()
{
  return (randomint(0, 1) ? 1 : -1);
}

$(function ()
{

  function update_points (newpoint, overflow)
  {
    ctx[overflow ? 'moveTo' : 'lineTo'](newpoint[0], newpoint[1]);
    ctx.stroke();
    currentpoint = newpoint;
  }

  function clear_points ()
  {
    ctx.closePath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    totali = 0;
  }


  var $w = $(window).width(),
  $h = $(window).height();

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = $w;
  canvas.height = $h;

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round'; // butt, square
  ctx.lineJoin = 'round'; //bevel, miter
  ctx.beginPath();


  var currentpoint = [],
  totali = 0,
  timerid = 0,
  multiplier = [1, 1],
  $steps = $('#steps div');

  // possible directions
  var pd = [
    [-1, -1], [ 0, -1], [+1, -1],
    [-1,  0],           [+1,  0],
    [-1, +1], [ 0, +1], [+1, +1]
  ];

  var startpoint = [randomint(0, $w), randomint(0, $h)];
  update_points(startpoint, true);


  (function add_point (prevpoint)
  {
    $steps[0].innerHTML = totali ++;

    var i = randomint(0, pd.length - 1);
    var newpoint = [prevpoint[0] + pd[i][0] * multiplier[0], prevpoint[1] + pd[i][1] * multiplier[1]];

    var overflow = false;

    // left overflow
    if (newpoint[0] < 0)
    {
      overflow = true;
      newpoint[0] += $w + 1;
    }
    // right overflow
    else if (newpoint[0] > $w)
    {
      overflow = true;
      newpoint[0] -= $w + 1;
    }

    // top overflow
    if (newpoint[1] < 0)
    {
      overflow = true;
      newpoint[1] += $h + 1;
    }
    // bottom overflow
    else if (newpoint[1] > $h)
    {
      overflow = true;
      newpoint[1] -= $h + 1;
    }

    update_points(newpoint, overflow);

    timerid = setTimeout(add_point, 5, newpoint);

  })(startpoint);











  $('#actions').on('keyup change', 'input', function ()
  {
    var self = $(this),
    val = +self.val(),
    c = self.data('coordinate');
    if (val > 0 && (c == 'x' || c == 'y'))
    {
      var i = c == 'x' ? 0 : 1;
      multiplier[i] = val;
    }
  })
  .on('click', '#clearcontainer div', function ()
  {
    clear_points();
  });















});


