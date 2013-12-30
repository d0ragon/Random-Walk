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
  var $path = $('svg path'),
  dattr = '',
  currentpoint = [];
  function update_points (newpoint, action)
  {
    dattr += action + newpoint[0] + ' ' + newpoint[1] + ' ';
    $path.attr('d', dattr);
    currentpoint = newpoint;
  }
  function clear_points ()
  {
    dattr = 'M' + currentpoint[0] + ' ' + currentpoint[1] + ' ';
  }

  var $w = $(window).width(),
  $h = $(window).height();

  // possible directions
  var pd = [
    [-1, -1], [ 0, -1], [+1, -1],
    [-1,  0],           [+1,  0],
    [-1, +1], [ 0, +1], [+1, +1]
  ];

  var startpoint = [randomint(0, $w), randomint(0, $h)];
  update_points(startpoint, 'M');

  var timerid = 0,
  multiplier = [1, 1];


  (function add_point (prevpoint)
  {

    var i = randomint(0, pd.length - 1);
    var newpoint = [prevpoint[0] + pd[i][0] * multiplier[0], prevpoint[1] + pd[i][1] * multiplier[1]];

    var action = 'L';

    if (newpoint[0] < 0)
    {
      action = 'M';
      newpoint[0] += $w + 1;
    }
    else if (newpoint[0] > $w)
    {
      action = 'M';
      newpoint[0] -= $w + 1;
    }

    if (newpoint[1] < 0)
    {
      action = 'M';
      newpoint[1] += $h + 1;
    }
    else if (newpoint[1] > $h)
    {
      action = 'M';
      newpoint[1] -= $h + 1;
    }

    update_points(newpoint, action);

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


