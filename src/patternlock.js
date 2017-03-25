function Lock(config) {
  // 创建一个默认配置，在某些参数没有给配置的时候使用
  var defaultConfig = {
    // 注释的参数是必要的
    // ele: document.getElementById('context'),
    // formEle: document.getElementById('setStatus'),
    width: window.innerWidth,
    height: 300,
    n: 3,
    originFillColor: 'transparent',
    fillColor: '#ccc',
    originStrokeColor: '#fff',
    strokeColor: '#fff',
    border: 2,
    lineColor: '#999',
    lineWidth: 2,
    fontSize: 16,
    radius: 14,
    marginX: 38,
    marginY: 34,
    atleast: 5,
    tips: {
      original: '请输入手势密码',
      tooshort: '密码太短，至少需要5个点',
      repeat: '请再次输入手势密码',
      success: '密码设置成功',
      different: '两次输入不一致',
      wrong: '密码不正确',
      right: '密码正确！'
    }
  };
  // 使用默认配置传入 config 中没有的参数
  Object.keys(defaultConfig).forEach(function(key) {
    if(!config.hasOwnProperty(key)) {
      config[key] = defaultConfig[key];
    }
  });

  this.config = config;
  this.ctx = config.ele.getContext('2d');
  this.dots = [];
  this.lock = [];
  this.lockIndex = '';
  this.passwordIndex = '';
  // 密码状态为 0 就是设置密码，密码状态为 1 就是验证密码
  this.passwordStatus = '0';
  // 当还未触摸时 touched 为 false
  this.touched = false;
  this.tip = config.tips.original;
  this.init();
}

Lock.prototype.init = function() {
  var config = this.config;
  var ele = config.ele;
  // 设置 canvas 的宽高
  ele.width = config.width;
  ele.height = config.height;

  this.setDotsPos();
  this.createMatrix();
  this.changeStatus();
  this.bind();
};

// 了解用户是要设置密码还是验证密码
Lock.prototype.changeStatus = function() {
  var self = this;
  this.config.formEle.addEventListener('change', function(e) {
    // 切换 radio 时提示，passwordIndex 重置
    self.tip = self.config.tips.original;
    self.createMatrix();
    self.passwordIndex = '';
    // 改变绘制状态
    self.passwordStatus = e.target.value;
  });
};

// 得到所有点的位置
Lock.prototype.setDotsPos = function() {
  var config = this.config;
  var len = config.n;
  var dotLength = (config.radius + config.border) * 2;
  var disX = dotLength + config.marginX;
  var disY = dotLength + config.marginY;
  var startX = (config.width - disX * (len-1))/2;
  var startY = (config.height - disY * (len-1))/2;
  var dots = this.dots;

  for(var i = 0; i < len; i++) {
    for(var j = 0; j < len; j++) {
      var x = disX * i + startX;
      var y = disY * j + startY;
      dots.push({
        x: x,
        y: y
      });
    }
  }
};

// 根据点的位置绘制密码图，并且加上提示 tip
Lock.prototype.createMatrix = function() {
  var ctx = this.ctx;
  var config = this.config;
  var dots = this.dots;

  ctx.clearRect(0, 0, config.width, config.height);
  ctx.fillStyle = config.originFillColor;
  ctx.strokeStyle = config.originStrokeColor;
  ctx.lineWidth = config.border;

  for(var i = 0, len = dots.length; i < len; i++) {
    this.drawDot(dots[i].x, dots[i].y);
  }

  this.writeText();
};

// 画出密码的每个点
Lock.prototype.drawDot = function(x, y) {
  var ctx = this.ctx;
  var radius = this.config.radius;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2*Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// touchmove 时的路径
Lock.prototype.drawLine = function(pos) {
  var ctx = this.ctx;
  var config = this.config;
  var lock = this.lock;

  ctx.strokeStyle = config.lineColor;
  ctx.lineWidth = config.lineWidth;
  ctx.beginPath();
  ctx.moveTo(lock[0].x, lock[0].y);
  for(var i = 0, len = lock.length; i < len; i++) {
    ctx.lineTo(lock[i].x, lock[i].y);
  }
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
};

// 写文字
Lock.prototype.writeText = function() {
  var config = this.config;
  var ctx = this.ctx;
  var tip = this.tip;

  ctx.beginPath();
  ctx.font = config.fontSize+'px Times-Roman';
  ctx.fillStyle = '#000';
  var measure = ctx.measureText(tip);
  ctx.fillText(tip, (config.width - measure.width)/2, config.height - config.fontSize);
  ctx.fill();
};

// 获取目前手势与画布左上角定点的位移
Lock.prototype.getPosition = function (e) {
  var ele = this.config.ele;
  return {
    x: e.touches[0].clientX - ele.offsetLeft,
    y: e.touches[0].clientY - ele.offsetTop,
  };
};

// 手指移动时画布全部更新
Lock.prototype.update = function(pos) {
  var config = this.config;
  var ctx = this.ctx;
  var dots = this.dots;
  var lock = this.lock;

  // 绘上所有点
  this.createMatrix();
  // 绘上滑过的点
  for(var i = 0, len = lock.length; i < len; i++) {
    ctx.fillStyle = config.fillColor;
    ctx.strokeStyle = config.strokeColor;
    ctx.lineWidth = config.border;
    this.drawDot(lock[i].x, lock[i].y);
  }

  // 绘制当经过未锁定的点时的改变
  this.save(pos);

  // 绘制路径
  this.drawLine(pos);
};

// 绑定手势
Lock.prototype.bind = function() {
  var ele = this.config.ele;
  var tips = this.config.tips;
  var ctx = this.ctx;
  var self = this;

  // 手指按上屏幕时
  ele.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if(self.tip === tips.success) {
      self.tip = tips.original;
    }
    self.save(self.getPosition(e));
  });

  // 手指在屏幕上移动
  ele.addEventListener('touchmove', function(e) {
    e.preventDefault();
    self.touched && self.update(self.getPosition(e));
  });

  // 手指离开屏幕
  ele.addEventListener('touchend', function(e) {
    e.preventDefault();
    self.touched && self.showTips();
    self.touched = false;
  });
};

// 存储目前的绘制状态
Lock.prototype.save = function(pos) {
  var ctx = this.ctx;
  var config = this.config;
  var dots = this.dots;
  var radius = config.radius;

  for(var i = 0, len = dots.length; i < len; i++) {
    if(Math.abs(pos.x - dots[i].x) < radius && Math.abs(pos.y - dots[i].y) < radius) {
      !this.touched && (this.touched = true);

      ctx.fillStyle = config.fillColor;
      ctx.strokeStyle = config.strokeColor;
      ctx.lineWidth = config.border;
      this.drawDot(dots[i].x, dots[i].y);

      if(this.lock.indexOf(dots[i]) === -1) {
        this.lock.push(dots[i]);
        this.lockIndex += i;
      }
      break;
    }
  }
};

Lock.prototype.showTips = function() {
  var config = this.config;
  var ctx = this.ctx;
  // 提示信息
  var tips = config.tips;
  var tip = '';

  if(this.passwordStatus === '0') {
    if(this.lock.length < config.atleast && !this.passwordIndex) {
      tip = tips.tooshort;
    } else if(!this.passwordIndex) {
      // 将第一次设置的手势存储起来
      this.passwordIndex = this.lockIndex;
      tip = tips.repeat;
    } else {
      // 比较两次输入的手势密码是否一致
      var compare = (this.passwordIndex === this.lockIndex);
      if(compare) {
        tip = tips.success;
        localStorage.setItem('password', this.passwordIndex);
      } else {
        tip = tips.different;
      }
      // 将第一次保存的 passwordIndex 置空
      this.passwordIndex = '';
    }
  } else {
    if(this.lockIndex === localStorage.getItem('password')) {
      tip = tips.right;
    } else {
      tip = tips.wrong;
    }
  }

  this.tip = tip;
  // 将手势置空
  this.lock = [];
  this.lockIndex = '';
  // 将图案重置
  this.createMatrix();
};