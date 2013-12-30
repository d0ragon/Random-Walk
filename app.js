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
  var $polyline = $('svg polyline');
  function update_points (points)
  {
    $polyline.attr('points', points);
  }


  var $w = $(window).width(),
  $h = $(window).height();

  var startpoint = [randomint(0, $w), randomint(0, $h)];

  var startpointattr = startpoint[0] + ',' + startpoint[1];
  update_points(startpointattr);

  // possible directions
  var pd = [
    [+1, +1],
    [+1,  0],
    [+1, -1],
    [ 0, +1],
    [ 0, -1],
    [-1, +1],
    [-1,  0],
    [-1, -1]
  ];


  (function add_point (prevpoint, prevpointsattr)
  {

    var i = randomint(0, pd.length - 1);
    var newpoint = [prevpoint[0] + pd[i][0], prevpoint[1] + pd[i][1]];

    var newpointsattr = prevpointsattr + ' ' + newpoint[0] + ',' + newpoint[1];
    update_points(newpointsattr);

    var timerid = setTimeout(add_point, 4, newpoint, newpointsattr);

  })(startpoint, startpointattr);



});


