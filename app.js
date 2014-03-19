function randomwalk (options)
{
  this.randomint = function (min, max)
  {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  this.randompoint = function ()
  {
    return [this.randomint(0, this.$w), this.randomint(0, this.$h)];
  }

  this.colors = [
    '#0000ff', '#00ff00', '#ff0000',
    '#ffff00', '#ff00ff', '#00ffff',
    '#fff'
  ];

  // possible directions
  this.pd = [
    [-1, -1], [ 0, -1], [+1, -1],
    [-1,  0],           [+1,  0],
    [-1, +1], [ 0, +1], [+1, +1]
  ];

  this.nextpoint_async = function (prevpoint)
  {
    var i = this.randomint(0, this.pd.length - 1);
    return [
      prevpoint[0] + this.pd[i][0] * this.multiplier[0],
      prevpoint[1] + this.pd[i][1] * this.multiplier[1]
    ];
  }

  this.nextpoint_sync = function (prevpoint, i)
  {
    return [
      prevpoint[0] + this.pd[i][0] * this.multiplier[0],
      prevpoint[1] + this.pd[i][1] * this.multiplier[1]
    ];
  }

  this.check_newpoint = function (newpoint)
  {
    var overflow = false;
    // left overflow
    if (newpoint[0] < 0)
    {
      overflow = true;
      newpoint[0] += this.$w + 1;
    }
    // right overflow
    else if (newpoint[0] > this.$w)
    {
      overflow = true;
      newpoint[0] -= this.$w + 1;
    }
    // top overflow
    if (newpoint[1] < 0)
    {
      overflow = true;
      newpoint[1] += this.$h + 1;
    }
    // bottom overflow
    else if (newpoint[1] > this.$h)
    {
      overflow = true;
      newpoint[1] -= this.$h + 1;
    }
    return [newpoint, overflow];
  }

  this.update_points = function (inst, prevpoints)
  {
    inst.$steps[0].innerHTML = inst.totali ++;
    if (inst.sync)
    {
      var j = inst.randomint(0, inst.pd.length - 1);
      var funcname = 'nextpoint_sync';
    }
    else
    {
      var j = false;
      var funcname = 'nextpoint_async'; 
    }
    var newpoints = [];
    for (var i = 0; i < prevpoints.length; i ++)
    {
      var newpoint = inst[funcname](prevpoints[i][0], j);
      var checked = inst.check_newpoint(newpoint);
      newpoints.push(checked);
      inst.ctx.moveTo(prevpoints[i][0][0], prevpoints[i][0][1]);
      inst.ctx[checked[1] ? 'moveTo' : 'lineTo'](checked[0][0], checked[0][1]);
    }
    inst.ctx.stroke();
    if (inst.use_colors)
    {
      inst.ctx.closePath();
      inst.ctx.strokeStyle = inst.colors[inst.randomint(0, inst.colors.length - 1)];
      inst.ctx.beginPath();
    }
    inst.timerid = setTimeout(inst.update_points, 5, inst, newpoints);
  }

  this.clear_points = function ()
  {
    this.ctx.closePath();
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.beginPath();
    this.totali = 0;
  }

  this.stop = function ()
  {
    clearTimeout(this.timerid);
  }

  this.init = function (options)
  {
    var self = this;
    $.each(options, function (key, val)
    {
      self[key] = val;
    });

    this.$w = $(window).width();
    this.$h = $(window).height();

    var canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    canvas.width = this.$w;
    canvas.height = this.$h;

    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = 'round'; // butt, square
    this.ctx.lineJoin = 'round'; //bevel, miter
    this.ctx.beginPath();

    this.totali = 0;
    this.$steps = $('#steps div');

    var startpoints = [];
    for (var i = 0; i < this.quantity; i ++)
    {
      startpoints.push([this.randompoint(), true]);
      //[ [[x,y], overflow] ]
    }

    this.update_points(this, startpoints);
  }

  this.init(options);

  $('#actions')
   .find('input[data-coordinate="x"]').val(this.multiplier[0])
   .end()
   .find('input[data-coordinate="y"]').val(this.multiplier[1])
   .end()
   .find('#quantity').val(this.quantity)
   .end()
   .find('#sync').prop('checked', this.sync)
   .end()
   .find('#colors').prop('checked', this.use_colors);
}




var rw = new randomwalk({
  sync: true,
  quantity: 50,
  use_colors: true,
  multiplier: [3, 3]
});



$(function ()
{
  $('#actions').on('keyup change', 'input[data-coordinate]', function ()
  {
    var self = $(this),
    val = +self.val(),
    c = self.data('coordinate');
    if (val > 0 && (c == 'x' || c == 'y'))
    {
      var i = c == 'x' ? 0 : 1;
      rw.multiplier[i] = val;
    }
  })
  .on('keyup change', '#quantity', function ()
  {
    rw.stop();
    rw.clear_points();
    rw.init({
      sync: rw.sync,
      quantity: +$(this).val(),
      use_colors: rw.use_colors,
      multiplier: rw.multiplier
    });
  })
  .on('change', '#sync', function ()
  {
    rw.sync = this.checked;
  })
  .on('change', '#colors', function ()
  {
    rw.use_colors = this.checked;
  })
  .on('click', '#clearcontainer div', function ()
  {
    rw.clear_points();
  });
});
























