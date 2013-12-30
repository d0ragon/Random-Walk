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
  var $polyline = $('svg polyline'),
  points_attr = '';
  function update_points (newpoint)
  {
    points_attr += ' ' + newpoint[0] + ',' + newpoint[1];
    $polyline.attr('points', points_attr);
  }


  var $w = $(window).width(),
  $h = $(window).height();

  // possible directions
  var pd = [
    [-1, -1], [ 0, -1], [+1, -1],
    [-1,  0],           [+1,  0],
    [-1, +1], [ 0, +1], [+1, +1]
  ];
  /*
  035
  247
  pd.splice(0, 1);
  pd.splice(3, 1);
  pd.splice(5, 1);
  console.log(pd);
  */

  var startpoint = [randomint(0, $w), randomint(0, $h)];

  update_points(startpoint);


  (function add_point (prevpoint)
  {
    var multiplier = 5;

    var i = randomint(0, pd.length - 1);
    var newpoint = [prevpoint[0] + pd[i][0] * multiplier, prevpoint[1] + pd[i][1] * multiplier];

    update_points(newpoint);

    var timerid = setTimeout(add_point, 4, newpoint);

  })(startpoint);



});


