Page({
  onReady() {
    var arr = [[23, 24], [50, 100], [5, 18], [40, 6]];
    var arrLength = arr.length;
    var arr1 = [], arr2 = [];
    for (var i = 0; i < arrLength; i++) {
      arr1.push(arr[i][0]);
      arr2.push(arr[i][1]);
    }
    var xMax = Math.max.apply(Math, arr1);
    var yMax = Math.max.apply(Math, arr2);
    var ctx = wx.createCanvasContext('firstCanvas');
    var distX = Math.ceil(xMax) / 5;
    var distY = Math.ceil(yMax) / 5;
    ctx.beginPath();
    //竖轴
    ctx.beginPath();
    ctx.moveTo(20, 250);
    ctx.lineWidth = "2";
    ctx.font="12px Arial";
    ctx.fillText('0', 8, 260);
    ctx.fillText('艺术豆', 30, 15);
    ctx.lineTo(20, 10);
    ctx.stroke();
    for (var i = 0; i <= 5; i++) {
      ctx.beginPath();
      ctx.textAlign = "start";
      var y = 250 - 48 * i;
      ctx.moveTo(20, y);
      if (i != 0) {
        ctx.fillText(distY * i, 0, y + 4);
      }
      ctx.lineTo(25, y);
      ctx.stroke();
    }
    //横轴
    ctx.beginPath();
    ctx.moveTo(20, 250);
    ctx.font = "12px Arial";
    ctx.fillText('价格(k)', 280, 240);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = "2";
    ctx.lineTo(306, 250);
    ctx.stroke();
    for (var i = 0; i <= 5; i++) {
      ctx.beginPath();
      var x = 20 + 57 * i;
      ctx.textAlign = "center";
      ctx.moveTo(x, 250);
      if (i != 0) {
        ctx.fillText(distX * i, x, 264);
      }
      ctx.lineTo(x, 245);
      ctx.stroke();
    }
    // 离散的点
    for (var i = 0; i < arrLength; i++) {
      var arcX = (arr[i][0] / xMax) * 286;
      var arcY = (arr[i][1] / yMax) * 240;
      ctx.moveTo(20 + arcX, 250 - arcY);
      ctx.arc(20 + arcX, 250 - arcY, 2, 0, 2 * Math.PI, false);
    }
    ctx.fillStyle = "rgba(51,166,149,0.7)";
    ctx.fill();
    // ctx.beginPath()
    // ctx.moveTo(10,250);
    // ctx.lineTo(300, 250);
    // ctx.stroke()
    //竖立轴
    // context.beginPath();
    // context.moveTo(10,10);
    // context.lineTo(0,240);
    // context.draw();
    // context.stroke();
    //描边路径
    ctx.draw();
  }
})