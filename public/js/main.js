var Module = {
  canvas: (function () {
    var canvas = document.getElementById('canvas');
    return canvas;
  })()
};

// 上线引擎地址
var basehttpUrl = 'https://www.bjblackhole.com/default.aspx?dir=url_res03&path=';
var gprojName = 'res_jifang';

// 引擎监听事件相关
document.addEventListener('RealEngineReady', RealBIMInitSys);
document.addEventListener('RealBIMInitSys', RealBIMLoadMainSce);
document.addEventListener('RealEngineRenderReady', showCanvas);
document.addEventListener('RealBIMLoadMainSce', MainSceDown);
document.addEventListener('RealBIMLocateCam', function (e) { });
document.addEventListener('RealBIMSelModel', GetCurProbeRet);
// document.addEventListener("RealBIMLoadProgress", function (e) {
//   LoadingProgress(e.detail.progress, e.detail.info);
// });

if ((typeof g_re_em_window_width !== 'undefined') && (typeof g_re_em_window_height !== 'undefined')) {
  console.log("(typeof g_re_em_window_width != 'undefined') && (typeof g_re_em_window_height != 'undefined')");
  RealBIMInitSys();
}
// 改变三维图形窗口大小时，需重新给窗口宽高赋值；刷新页面时需要卸载GPU内存

function onunloadGLctx() {
  if (typeof GLctx !== 'undefined') {
    if (GLctx.getExtension('WEBGL_lose_context') != null) {
      GLctx.getExtension('WEBGL_lose_context').loseContext();
      console.log('onunloadGLctx==========================');
    }
  }
}

function LoadingProgress(percent, info) {
  console.log(percent);
}

// 场景初始化
function RealBIMInitSys() {
  // 页面实时反馈窗口宽高给引擎
  var workerjspath = 'js/RealBIMWeb_Worker.js';
  let width = window.innerWidth;
  let height = window.innerHeight;
  if (document.getElementById('emscripten')) {
    width = document.getElementById('emscripten').offsetWidth;
    height = document.getElementById('emscripten').offsetHeight;
  }
  var commonurl = basehttpUrl + 'res_gol001';
  var username = 'admin';
  var password = 'xiyangyang';
  REinitSys(workerjspath, width, height, commonurl, username, password);
}

// 为了浏览效果，初始canvas是display:none;天空盒资源加载完成时，才显示canvas
function showCanvas() {
  try {
    document.getElementById('canvas').style.display = 'block';
    Module.canvas.focus(); // 为了解决键盘事件的冲突
  } catch (e) {
    console.log(e);
  }
}

window.onresize = function () {
  g_re_em_window_width = window.innerWidth;
  g_re_em_window_height = window.innerHeight;
};

// 场景加载
function RealBIMLoadMainSce() {
  const urlRes = basehttpUrl;
  const projName = gprojName;
  const verinfo = '';
  REloadMainSce(urlRes, projName, verinfo);
  REsetMaxResMemMB(5500);
  REsetExpectMaxInstMemMB(4500);
  REsetExpectMaxInstDrawFaceNum(50000000);
  REsetPageLoadLev(2);
}

// 场景加载完成，其他跟模型相关的操作最好在该时间完成后再进行
function MainSceDown() {
  // REsetElemClr([],"",255,200,255);
}

// 获取当前探测结
function GetCurProbeRet() {
  proberet = REgetCurProbeRet();
  shpproberet_norm = REgetCurShpProbeRet(); // 获取当前拾取到的矢量(锚点、标签)相关信息
  // console.log(proberet);
  // console.log(shpproberet_norm)
}

// 相机方位相关
// 回到默认视角
function restoreCamLocation() {
  var direct = 'default';
  RElocateCamToDir(direct);
}
// 相机定位到构件ID集合，并改变颜色和透明度(临时颜色)
function focusCamTo(objarr, backdepth) {
  // var objarr = [684, 685, 686, 687];
  var backdepth = 2.0;
  REfocusCamTo(objarr, backdepth); // 转动相机接口
  REaddToSelElemIDs(objarr); // 把要查看的id集合加入到选择集中，则会自动变为选择集设置的颜色
}

function focusCamToDo(objarr) {
  var backdepth = 2.0;
  REfocusCamTo(objarr, backdepth); // 转动相机接口
}

// 获取屏幕快照
function getCanvasImg() {
  var dataURL = canvas.toDataURL();
}

// 改变构件颜色和透明度(永久有效)
function setElemClr(objarr, newclr, newclrpercent = 255, newalpha = 255, newalphapercent = 255) {
  // var objarr = [28461,75,20980,20979,3724,28461]; //表示要改变颜色的构件ID集合
  // var objarr = []; //改变所有的构件颜色
  // var newclr ="CE0000"; //表示新的颜色
  // var newclrpercent =255.46666; //表示新的颜色所占的权重，255表示100%,0表示0%
  // var newalpha =255;  //表示新的透明度，255表示不透明，80表示半透明，0表示全透明
  // var newalphapercent =255.5000000;  //表示新的透明度所占的权重，255表示100%，0表示0%
  REsetElemClr(objarr, newclr, newclrpercent, newalpha, newalphapercent);
}

// 恢复构件颜色和透明度(永久有效)
function resetElemClr(objarr) {
  // var objarr = [684,685,686,687]; //表示要改变颜色的构件ID集合
  // var objarr = []; //改变所有的构件颜色
  REresetElemClr(objarr);
}

// 电子围栏相关
// 开始编辑电子围栏
function editFenceBegin() {
  REeditFenceBegin(); // 进入编辑电子围栏的状态
}

function addFenceBegin() {
  REaddFenceBegin(); // 开始添加电子围栏，进入电子围栏编辑状态后可添加多个电子围栏
}

function addFenceEnd() {
  REaddFenceEnd(); // 结束当前电子围栏的添加，如果没有退出电子围栏编辑状态，可继续添加下一个
}

function editFenceEnd() {
  REeditFenceEnd(); // 退出编辑电子围栏的状态
}

// 选择集合相关
// 设置选择集的颜色、透明度、探测掩码（即是否可以被选中）
function setSelElemsAttr(clr) {
  // var clr = "000000"; //表示新的颜色为白色
  var clrpercent = 255; // 表示新的颜色所占的权重，255表示100%,0表示0%
  var alpha = 200; // 表示新的透明度，255表示不透明，80表示半透明，0表示全透明
  var alphapercent = 255; // 表示新的透明度所占的权重，255表示100%，0表示0%
  var probemask = 0; // 表示选择集中的构件不可被选中，为1则表示可以被选中；
  REsetSelElemsAttr(clr, clrpercent, alpha, alphapercent, probemask);
}

function getSelElemsAttr() {
  var seleleattr = REgetSelElemsAttr(); // 获取当前选择集的属性信息
}

function getSelElemIDs() {
  var seleleid = REgetSelElemIDs(); // 获取当前选择集的构件ID集合,以数组形式返回，两两一组代表一个id的高32位和低32位
  var arrid = [];
  for (var i = 0; i < seleleid.length; i += 2) {
    arrid.push(seleleid[i]);
  }
  // console.log(arrid); //输出ID数组
  // console.log(arrid.join(",")); //输出ID数组组成的字符串，以逗号隔开
}

function addToSelElemIDs() {
  var objarr = [684, 685, 686, 687];
  REaddToSelElemIDs(objarr); // 往当前选择集合添加构件，参数为要添加的构件id集合
}

function removeFromSelElemIDs() {
  // var objarr = [684,685,686,687];
  var objarr = [];
  REremoveFromSelElemIDs(objarr); // 从当前选择集合删除构件，参数为要删除的构件id集合,若为空，则删除全部id
}

// 设置单体化
function setUnverElem(projectdata) {
  REsetUnverElemData(projectdata); // projectdata表示所有倾斜摄影单体化的数据（json字符串）
}

// 获取当前单体化选择集的ID集合,以数组形式返回,Uint32Array类型
function getUnverElemIDs() {
  var selid = REgetUnverElemIDs();
  console.log(selid);
}
// 启用天空盒
function useSkyBox() {
  REsetSkyEnable(true);
}
// 设置天空盒背景颜色
function setSkyBoxClr() {
  var clr = '000033';
  REsetBackColor(clr);
}
// 天空盒控制
// 禁用天空盒
function unUseSkyBox() {
  REsetSkyEnable(false);
}
// 隐藏ViewCube
function hideViewCube() {
  REsetViewCubeVisible(0);
}
// 隐藏UI
function hideUI() {
  REsetUIPanelVisible(0);
}
// 设置地形透明度为半透
function setUnverAlpha() {
  REsetUnVerInstsAlpha(1);
}
// 获取当前构件的渲染状态
function GetSysRenderState() {
  return REgetSysRenderState();
}
// 设置当前构件的渲染状态
function SetSysRenderState(renderdata) {
  REsetSysRenderState(renderdata); // 参数为之前保存的渲染状态
}
// 获取剖面信息
function getClipData() {
  tempclipdata = REgetClipData();
  return tempclipdata;
}
// 设置剖面信息
function setClipData(tempclipdata) {
  REsetClipData(tempclipdata);
}
// 退出剖切
function exitClip() {
  REexitClip();
}
// 退出截面状态
function beginScreen() {
  REexitClipWithTwoPoint();
}

// 判断是否处于剖切浏览模式
function getREIsSceCliping() {
  return REisSceCliping();
}
// 删除全部围栏
function delAllFence() {
  REdelAllFences();
}

function setFencePotInfo(fenceinfo) {
  REaddFenceByPot(fenceinfo);
  fenceinfo = [];
}
