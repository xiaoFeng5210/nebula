const ImgCode = class ImgCode {
  constructor() {
    const defaultOptions = {
      el: document.getElementById('captcha'),
      l: 42, // 滑块边长
      r: 9, // 滑块半径
      w: 310, // canvas宽度
      h: 155, // canvas高度
      PI: Math.PI,
      L: 42 + 9 * 2 + 3, // 滑块实际边长
      isIE: window.navigator.userAgent.indexOf('Trident') > -1
    };

    // 合并自定义配置
    this.options = Object.assign(defaultOptions);
  }

  init(obj) {
    if (obj) {
      this.options = Object.assign(this.options, obj);
    }
    this.options.el.style.positon = 'relative';
    this.options.el.style.width = this.w + 'px';
    this.initDOM();
    this.initImg();
    this.bindEvents();
  }

  // 创建dom
  initDOM() {
    const canvas = this.createCanvas(this.options.w, this.options.h); // 画布
    const block = canvas.cloneNode(true); // 滑块
    const sliderContainer = this.createElement('div', 'sliderContainer');
    const refreshIcon = this.createElement('div', 'refreshIcon');
    const sliderMask = this.createElement('div', 'sliderMask');
    const slider = this.createElement('div', 'slider');
    const sliderIcon = this.createElement('span', 'sliderIcon');
    const text = this.createElement('span', 'sliderText');

    block.className = 'block';
    text.innerHTML = '向右滑动填充拼图';

    const el = this.options.el;
    el.appendChild(canvas);
    el.appendChild(refreshIcon);
    el.appendChild(block);
    slider.appendChild(sliderIcon);
    sliderMask.appendChild(slider);
    sliderContainer.appendChild(sliderMask);
    sliderContainer.appendChild(text);
    el.appendChild(sliderContainer);

    Object.assign(this, {
      canvas,
      block,
      sliderContainer,
      refreshIcon,
      slider,
      sliderMask,
      sliderIcon,
      text,
      canvasCtx: canvas.getContext('2d'),
      blockCtx: block.getContext('2d')
    });
  }

  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  createElement(tagName, className) {
    const elment = document.createElement(tagName);
    elment.className = className;
    return elment;
  }

  // 准备图片
  initImg() {
    const self = this;
    const img = self.createImg(() => {
      this.draw();
      this.canvasCtx.drawImage(img, 0, 0, self.options.w, self.options.h);
      this.blockCtx.drawImage(img, 0, 0, self.options.w, self.options.h);
      const y = this.y - self.options.r * 2 - 1;
      const ImageData = this.blockCtx.getImageData(this.x - 3, y, self.options.L, self.options.L);
      this.block.width = self.options.L;
      this.blockCtx.putImageData(ImageData, 0, y);
    });
    self.img = img;
  }

  draw() {
    // 随机创建滑块的位置
    this.x = this.getRandomNumberByRange(this.options.L + 10, this.options.w - (this.options.L + 10));
    this.y = this.getRandomNumberByRange(10 + this.options.r * 2, this.options.h - (this.options.L + 10));
    this.drawCanvas(this.canvasCtx, this.x, this.y, 'fill');
    // 绘制滑块
    this.drawCanvas(this.blockCtx, this.x, this.y, 'clip');
  }

  clean() {
    this.canvasCtx.clearRect(0, 0, this.options.w, this.options.h);
    this.blockCtx.clearRect(0, 0, this.options.w, this.options.h);
    this.block.width = this.options.w;
  }

  createImg(onload) {
    const self = this;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = onload;
    // img.onerror = () => {
    //   img.setSrc(self.getRandomImgSrc());
    // };

    img.setSrc = function (src) {
      if (self.options.isIE) { // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
        const xhr = new XMLHttpRequest();
        xhr.onloadend = function (e) {
          const file = new FileReader(); // FileReader仅支持IE10+
          file.readAsDataURL(e.target.response);
          file.onloadend = function (e) {
            img.src = e.target.result;
          };
        };
        xhr.open('GET', src);
        xhr.responseType = 'blob';
        xhr.send();
      } else img.src = src;
    };
    // 设置随机图像
    img.setSrc(self.getRandomImgSrc());
    return img;
  }

  // 随机图片
  getRandomImgSrc() {
    return '/imgCode/' + this.getRandomNumberByRange(100, 120) + '.jpg';
  }

  // 随机数
  getRandomNumberByRange(start, end) {
    return Math.round(Math.random() * (end - start) + start);
  }

  drawCanvas(ctx, x, y, operation) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x + this.options.l / 2, y - this.options.r + 2, this.options.r, 0.72 * this.options.PI, 2.26 * this.options.PI);
    ctx.lineTo(x + this.options.l, y);
    ctx.arc(x + this.options.l + this.options.r - 2, y + this.options.l / 2, this.options.r, 1.21 * this.options.PI, 2.78 * this.options.PI);
    ctx.lineTo(x + this.options.l, y + this.options.l);
    ctx.lineTo(x, y + this.options.l);
    ctx.arc(x + this.options.r - 2, y + this.options.l / 2, this.options.r + 0.4, 2.76 * this.options.PI, 1.24 * this.options.PI, true);
    ctx.lineTo(x, y);
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.stroke();
    ctx[operation]();
    ctx.globalCompositeOperation = 'destination-over';
  }

  bindEvents() {
    this.options.el.onselectstart = () => false;
    this.refreshIcon.onclick = () => {
      this.reset();
      typeof this.onRefresh === 'function' && this.onRefresh();
    };

    let originX;
    let originY;
    const trail = [];
    let isMouseDown = false;

    const handleDragStart = (e) => {
      originX = e.clientX || e.touches[0].clientX;
      originY = e.clientY || e.touches[0].clientY;
      isMouseDown = true;
    };

    const handleDragMove = (e) => {
      if (!isMouseDown) return false;
      const eventX = e.clientX || e.touches[0].clientX;
      const eventY = e.clientY || e.touches[0].clientY;
      const moveX = eventX - originX;
      const moveY = eventY - originY;

      if (moveX < 0 || moveX + 38 >= this.options.w) return false;
      this.slider.style.left = moveX + 'px';
      const blockLeft = (this.options.w - 40 - 20) / (this.options.w - 40) * moveX;
      this.block.style.left = blockLeft + 'px';

      this.addClass(this.sliderContainer, 'sliderContainer_active');
      this.sliderMask.style.width = moveX + 'px';
      trail.push(moveY);
    };

    const handleDragEnd = (e) => {
      if (!isMouseDown) return false;
      isMouseDown = false;
      const eventX = e.clientX || e.changedTouches[0].clientX;
      if (eventX === originX) return false;
      this.removeClass(this.sliderContainer, 'sliderContainer_active');
      this.trail = trail;
      const { spliced, verified } = this.verify();
      if (spliced) {
        if (verified) {
          this.addClass(this.sliderContainer, 'sliderContainer_success');
          typeof this.options.onSuccess === 'function' && this.options.onSuccess();
        } else {
          this.addClass(this.sliderContainer, 'sliderContainer_fail');
          this.text.innerHTML = '再试一次';
          this.reset();
        }
      } else {
        this.addClass(this.sliderContainer, 'sliderContainer_fail');
        typeof this.options.onFail === 'function' && this.options.onFail();
        setTimeout(() => {
          this.reset();
        }, 1000);
      }
    };
    this.slider.addEventListener('mousedown', handleDragStart);
    this.slider.addEventListener('touchstart', handleDragStart);
    this.block.addEventListener('mousedown', handleDragStart);
    this.block.addEventListener('touchstart', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  }

  addClass(tag, className) {
    tag.classList.add(className);
  }

  removeClass(tag, className) {
    tag.classList.remove(className);
  }

  /**
   * 进行验证
   */
  verify() {
    const arr = this.trail; // 拖动时y轴的移动距离
    // 求平均数
    const average = arr.reduce(this.sum) / arr.length;
    // 计算偏差
    const deviations = arr.map(x => x - average);
    //
    const stddev = Math.sqrt(deviations.map(this.square).reduce(this.sum) / arr.length);
    // console.log(stddev);
    // 计算滑块左边距离
    const left = parseInt(this.block.style.left);
    return {
      // 如果偏差小于10
      spliced: Math.abs(left - this.x) < 10,
      verified: stddev !== 0 // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
    };
  }

  sum(x, y) {
    return x + y;
  }

  square(x) {
    return x * x;
  }

  reset() {
    this.sliderContainer.className = 'sliderContainer';
    this.slider.style.left = 0;
    this.block.style.left = 0;
    this.sliderMask.style.width = 0;
    this.clean();
    this.img.setSrc(this.getRandomImgSrc());
  }
};

export default ImgCode;
