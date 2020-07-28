<template>
  <div class="fabric">
    <canvas id="tela" style="bordere:1px dashed #007aff;"></canvas>
  </div>
</template>
<script>
import { fabric } from 'fabric';
export default {
  name: 'fabric',
  props: {
    imgUrl: String,
    fabricF: String,
    fabricC: String
  },
  data() {
    return {
      rect: [],
      canvas: {},
      mosaic: {},
      x: '',
      y: '',
      mouseFrom: {},
      mouseTo: {},
      drawType: null,
      canvasObjectIndex: 0,
      textbox: null,
      rectangleLabel: 'warning',
      drawWidth: 2, // 笔触宽度
      color: '#E34F51', // 画笔颜色
      drawingObject: null, // 当前绘制对象
      moveCount: 1, // 绘制移动计数器
      doDrawing: false, // 绘制状态

      // polygon 相关参数
      polygonMode: false,
      pointArray: [],
      lineArray: [],
      activeShape: false,
      activeLine: '',
      line: {},
      IMgs: '',
      imgFile: {},
      imgSrc: ''
    };
  },
  mounted() {
    const that = this;
    that.canvas = new fabric.Canvas('tela', {
      height: window.innerHeight - 80, // 让画布同视窗大小
      width: window.innerWidth - 510 // 让画布同视窗大小
      // isDrawingMode: true,
      // skipTargetFind: true,
      // selectable: false,
      // selection: false
    });
    that.canvas.on('mouse:down', that.mousedown);
    that.canvas.on('mouse:move', that.mousemove);
    that.canvas.on('mouse:up', that.mouseup);

    document.onkeydown = e => {
      if (e.keyCode === 46) {
        that.deleteObj();
      }
      if (e.keyCode === 90 && e.ctrlKey) {
        that.canvas.remove(
          that.canvas.getObjects()[that.canvas.getObjects().length - 1]
        );
      }
    };
  },
  watch: {
    imgUrl() {
      this.loadExpImg();
    },
    fabricF(newFont) {
      this.drawWidth = newFont;
      this.canvas.freeDrawingBrush.width = this.drawWidth;
    },
    fabricC(newC) {
      this.color = newC;
      this.canvas.freeDrawingBrush.color = this.color;
    }
  },
  methods: {
    loadExpImg() {
      const that = this;
      that.IMgs = fabric.Image.fromURL(that.$props.imgUrl, function(oImg) {
        oImg.selectable = false;
        oImg.scale(1);
        that.canvas.add(oImg);
      });
    },
    drawTypeChange(objs) {
      const _this = this;
      _this.drawType = objs;
      const len = _this.canvas.getObjects().length;
      if (objs === 'pen') {
        _this.canvas.isDrawingMode = true;
        _this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        _this.canvas.freeDrawingBrush.color = _this.color;
        _this.canvas.freeDrawingBrush.width = _this.drawWidth;
      } else if (objs === 'mosaic') {
        _this.canvas.isDrawingMode = true;
        _this.canvas.freeDrawingBrush = new fabric.SprayBrush(this.canvas);
        _this.canvas.freeDrawingBrush.color = 'rgba(255,0,0, 0.3)';
        _this.canvas.freeDrawingBrush.width = 10;
      } else if (objs === 'cloud') {
        _this.canvas.isDrawingMode = false;
        this.drawCloud();
      } else if (objs === 'back') {
        _this.canvas.isDrawingMode = false;
        if (len > 1) {
          _this.canvas.remove(_this.canvas.getObjects()[len - 1]);
        }
      } else {
        _this.canvas.isDrawingMode = false;
      }
    },
    mousedown(e) {
      var xy = this.transformMouse(e.e.offsetX, e.e.offsetY);
      this.mouseFrom.x = xy.x;
      this.mouseFrom.y = xy.y;
      this.doDrawing = true;
      if (this.drawType === 'text') {
        this.drawing();
      }
    },
    mouseup(e) {
      var xy = this.transformMouse(e.e.offsetX, e.e.offsetY);
      this.mouseTo.x = xy.x;
      this.mouseTo.y = xy.y;
      // drawing();
      this.drawingObject = null;
      this.moveCount = 1;
      if (this.drawType !== 'polygon') {
        this.doDrawing = false;
      }
    },
    mousemove(e) {
      if (this.moveCount % 2 && !this.doDrawing) {
        // 减少绘制频率
        return;
      }
      this.moveCount++;
      var xy = this.transformMouse(e.e.offsetX, e.e.offsetY);
      this.mouseTo.x = xy.x;
      this.mouseTo.y = xy.y;
      if (this.drawType !== 'text' || this.drawType !== 'polygon') {
        this.drawing();
      }
      if (this.drawType === 'polygon') {
        if (this.activeLine && this.activeLine.class === 'line') {
          var pointer = this.canvas.getPointer(e.e);
          this.activeLine.set({ x2: pointer.x, y2: pointer.y });

          var points = this.activeShape.get('points');
          points[this.pointArray.length] = {
            x: pointer.x,
            y: pointer.y,
            zIndex: 1
          };
          this.activeShape.set({
            points: points
          });
          this.canvas.renderAll();
        }
        this.canvas.renderAll();
      }
    },
    deleteObj() {
      this.canvas.getActiveObjects().map(item => {
        this.canvas.remove(item);
      });
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / 1, y: mouseY / 1 };
    },
    drawing() {
      if (this.drawingObject) {
        this.canvas.remove(this.drawingObject);
      }
      var canvasObject = null;
      var left = this.mouseFrom.x;
      var top = this.mouseFrom.y;
      var mouseFrom = this.mouseFrom;
      var mouseTo = this.mouseTo;
      switch (this.drawType) {
      case 'arrow': // 箭头
        var x1 = mouseFrom.x;
        var x2 = mouseTo.x;
        var y1 = mouseFrom.y;
        var y2 = mouseTo.y;
        var w = x2 - x1;
        var h = y2 - y1;
        var sh = Math.cos(Math.PI / 4) * 16;
        var sin = h / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
        var cos = w / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
        var w1 = (16 * sin) / 4;
        var h1 = (16 * cos) / 4;
        var centerx = sh * cos;
        var centery = sh * sin;
        /**
           * centerx,centery 表示起始点，终点连线与箭头尖端等边三角形交点相对x，y
           * w1 ，h1用于确定四个点
           */

        var path = ' M ' + x1 + ' ' + y1;
        path += ' L ' + (x2 - centerx + w1) + ' ' + (y2 - centery - h1);
        path +=
            ' L ' + (x2 - centerx + w1 * 2) + ' ' + (y2 - centery - h1 * 2);
        path += ' L ' + x2 + ' ' + y2;
        path +=
            ' L ' + (x2 - centerx - w1 * 2) + ' ' + (y2 - centery + h1 * 2);
        path += ' L ' + (x2 - centerx - w1) + ' ' + (y2 - centery + h1);
        path += ' Z';
        canvasObject = new fabric.Path(path, {
          stroke: this.color,
          fill: this.color,
          strokeWidth: this.drawWidth
        });
        break;
      case 'ellipse': // 椭圆
        canvasObject = new fabric.Ellipse({
          left: (mouseTo.x - left) / 2 + left,
          top: (mouseTo.y - top) / 2 + top,
          stroke: this.color,
          fill: 'rgba(255, 255, 255, 0)',
          originX: 'center',
          originY: 'center',
          rx: Math.abs(left - mouseTo.x) / 2,
          ry: Math.abs(top - mouseTo.y) / 2,
          strokeWidth: this.drawWidth
        });
        break;
      case 'rectangle': // 长方形
        var pathr =
            'M ' +
            mouseFrom.x +
            ' ' +
            mouseFrom.y +
            ' L ' +
            mouseTo.x +
            ' ' +
            mouseFrom.y +
            ' L ' +
            mouseTo.x +
            ' ' +
            mouseTo.y +
            ' L ' +
            mouseFrom.x +
            ' ' +
            mouseTo.y +
            ' L ' +
            mouseFrom.x +
            ' ' +
            mouseFrom.y +
            ' z';
        canvasObject = new fabric.Path(pathr, {
          left: left,
          top: top,
          stroke: this.color,
          strokeWidth: this.drawWidth,
          fill: 'rgba(255, 255, 255, 0)',
          hasControls: false
        });
        // 也可以使用fabric.Rect
        break;
      case 'rectangle-text': // 长方形带标注框
        var patht =
            'M ' +
            mouseFrom.x +
            ' ' +
            mouseFrom.y +
            ' L ' +
            mouseTo.x +
            ' ' +
            mouseFrom.y +
            ' L ' +
            mouseTo.x +
            ' ' +
            mouseTo.y +
            ' L ' +
            mouseFrom.x +
            ' ' +
            mouseTo.y +
            ' L ' +
            mouseFrom.x +
            ' ' +
            mouseFrom.y +
            ' z';
        canvasObject = new fabric.Path(patht, {
          left: left,
          top: top,
          stroke: this.color,
          strokeWidth: this.drawWidth,
          fill: 'rgba(255, 255, 255, 0)',
          hasControls: false
        });
        // this.textbox.enterEditing();
        // this.textbox.hiddenTextarea.focus();
        // 也可以使用fabric.Rect
        break;
      case 'text': // 文本框
        this.textbox = new fabric.Textbox('', {
          left: mouseFrom.x,
          top: mouseFrom.y - 10,
          // width: 150,
          fontSize: 16,
          borderColor: this.color,
          fill: this.color,
          hasControls: false
        });
        this.canvas.add(this.textbox);
        this.textbox.enterEditing();
        break;
      case 'cloud': // 云朵
        var fx = mouseFrom.x;
        var tx = mouseTo.x;
        var fy = mouseFrom.y;
        var ty = mouseTo.y;
        var wx = tx - fx;
        var hy = ty - fy;
        var radian = Math.cos(Math.PI / 4) * 16;
        var siny = hy / Math.sqrt(Math.pow(wx, 2) + Math.pow(hy, 2));
        var cosx = wx / Math.sqrt(Math.pow(wx, 2) + Math.pow(hy, 2));
        var w1x = (16 * siny) / 4;
        var h1y = (16 * cosx) / 4;
        var centerxx = radian * cosx;
        var centeryy = radian * siny;
        // var pathc = 'M500 500';
        // pathc += 'L' + '700 500';
        // pathc += 'Q' + '740 480  700 440';
        // pathc += 'Q' + '650 344  580 400';
        // pathc += 'Q' + '540 390  520 440';
        // pathc += 'Q' + '450 460  500 500';
        // console.log(fx, fy, tx, ty, w1x, h1y, centerxx, centeryy);
        // var pathc = 'M' + fx + ' ' + fy;
        // pathc += ' L ' + tx + ' ' + ty;
        // pathc += ' Q ' + this.getPosition(tx, ty, tx - 10, ty - 300, 30);
        // pathc += ' Q ' + this.getPosition(tx - 30, ty - 300, fx + 10, ty - 300, 30);
        // pathc += ' Q ' + this.getPosition(tx, ty, fx, fy, -30);
        // canvasObject = new fabric.Path(pathc, {
        //   stroke: this.color,
        //   fill: 'rgba(255, 255, 255, 0)',
        //   strokeWidth: this.drawWidth
        // });
        break;
      default:
        break;
      }

      if (canvasObject) {
        // canvasObject.index = getCanvasObjectIndex();\
        this.canvas.add(canvasObject); // .setActiveObject(canvasObject)
        this.drawingObject = canvasObject;
      }
    },
    drawCloud() {
      var pathc = 'M500 500';
      pathc += 'L' + '700 500';
      pathc += 'Q' + '740 480  700 440';
      pathc += 'Q' + '650 344  580 400';
      pathc += 'Q' + '540 390  520 440';
      pathc += 'Q' + '450 460  500 500';
      var canvasObject = new fabric.Path(pathc, {
        stroke: this.color,
        fill: 'rgba(255, 255, 255, 0)',
        strokeWidth: this.drawWidth
      });
      this.canvas.add(canvasObject);
    },
    saveFile() {
      var imgData = this.canvas.toDataURL('png');
      imgData = imgData.replace('image/png', 'image/octet-stream');
      // 下载后的问题名
      var filename = 'drawingboard_' + new Date().getTime() + '.' + 'png';
      this.$emit('savesImg', imgData, filename);
      this.canvas.clear();
    },
    clearC() {
      this.canvas.clear();
    },
    // 设置默认标记样式
    settingMark() {
      const canvas = new fabric.Canvas('tela');
      console.log(canvas.defaultCursor);
      canvas.defaultCursor = 'hoverCursor';
    },
    getPosition(fx, fy, tx, ty, angle) {
      var x1 = fx;
      var y1 = fy;
      var x2 = tx;
      var y2 = ty;
      var PI = Math.PI;

      // 两点间的x轴夹角弧度
      var xAngle = Math.atan2(y2 - y1, x2 - x1);
      // 转为角度
      xAngle = (360 * xAngle) / (2 * PI);
      // 两点间的长度
      var L = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
      // 计算等腰三角形斜边长度
      var L2 = L / 2 / Math.cos((angle * 2 * PI) / 360);

      var rx1 =
        x1 + Math.round(L2 * Math.cos(((xAngle + angle) * 2 * PI) / 360));
      var ry1 =
        y1 + Math.round(L2 * Math.sin(((xAngle + angle) * 2 * PI) / 360));
      var rx2 =
        x1 + Math.round(L2 * Math.cos(((xAngle - angle) * 2 * PI) / 360));
      var ry2 =
        y1 + Math.round(L2 * Math.sin(((xAngle - angle) * 2 * PI) / 360));

      return rx1 + ' ' + ry1 + ' ' + rx2 + ' ' + ry2;
    }
  }
};
</script>
<style lang="scss" scoped>
.fabric {
  width: 100%;
  height: 100%;
  position: relative;
  #EnginImg {
    width: 100%;
    height: 100%;
  }
  .btns {
    position: fixed;
    left: 35%;
    top: 20%;
    z-index: 1000;
  }
  img {
    display: none;
  }
}
</style>
