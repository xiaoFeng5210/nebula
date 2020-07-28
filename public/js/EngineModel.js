const EngineModel = class PureFullPage {
  constructor(options) {
    const defaultOptions = {
      Module: {
        canvas: (() => {
          var canvas = document.getElementById('canvas');
          return canvas;
        })()
      },
      httpurl: 'https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=',
      projName: 'res_gaohangyou_20200423',
      width: 800,
      height: 800,
      MemMB: 5500, // 设置渲染时引擎最大允许的内存占用空间(以MB为单位)
      InstMemMB: 4500, // 设置渲染时引擎建议分配的内存空间
      FaceNum: 50000000, // 设置模型每帧最大渲染面数，范围100万到4000万面
      LoadLev: 2 // 设置页面调度等级，等级越高，模型加载越快，对硬件要求越高。PC端推荐设为2，手机端设为1
    };
    // 合并自定义配置
    this.options = Object.assign(defaultOptions, options);
    /**
     * 初始化
     */
    // this.init();
  }

  init(data) {
    /**
     * 初始化
     */
    const self = this;
    if (document.getElementById('RealBIMWeb') === null) {
      self.createScript('js/RealBIMWeb.js', 'RealBIMWeb');
    }
    if (data) {
      self.options = Object.assign(data);
    }
    window.Module = self.options.Module;
    setTimeout(() => {
      document.addEventListener('RealEngineReady', self.EngineReadyDown());
      if ((typeof self.options.g_re_em_window_width !== 'undefined') && (typeof self.options.g_re_em_window_height !== 'undefined')) {
        console.log("(typeof g_re_em_window_width != 'undefined') && (typeof g_re_em_window_height != 'undefined')");
        self.EngineReadyDown();
      }
    }, 500);
    setTimeout(() => {
      document.addEventListener('RealBIMInitSys', self.InitSysDown());
      document.addEventListener('RealBIMLoadMainSce', self.MainSceDown());
      document.addEventListener('RealEngineRenderReady', self.showCanvas());
    }, 5000);
  }

  createScript(src, id, isAsync) {
    const script = document.createElement('script');
    if (isAsync) {
      script.setAttribute('async', 'async');
    }
    script.src = src;
    script.setAttribute('id', id);
    const body = document.querySelector('body');
    body.append(script);
  }

  EngineReadyDown() {
    console.log('Listen RealEngineReady!');
    const workerjspath = 'js/RealBIMWeb_Worker.js';
    const width = this.options.width;
    const height = this.options.height;
    const commonurl = this.options.httpurl + 'res_gol001';
    const username = 'admin';
    const password = 'xiyangyang';
    this.REinitSys(workerjspath, width, height, commonurl, username, password);
  }

  InitSysDown() {
    console.log('Listen RealBIMInitSys!');
    var urlRes = this.options.httpurl;
    var projName = this.options.projName;
    var verinfo = '';
    this.REloadMainSce(urlRes, projName, verinfo); // 加载模型资源
    // 以下为设置模型渲染相关参数
    this.REsetMaxResMemMB(this.options.MemMB);
    this.REsetExpectMaxInstMemMB(this.options.InstMemMB);
    this.REsetExpectMaxInstDrawFaceNum(this.options.FaceNum);
    this.REsetPageLoadLev(this.options.LoadLev);
  }

  MainSceDown() {
    console.log('Listen RealBIMLoadMainSce!');
  }

  showCanvas() {
    console.log('addEventListener RealEngineRenderReady!');
    window.Module.canvas.focus();
  }

  // 场景初始化
  REinitSys(workerjspath, width, height, commonurl, username, password) {
    var g_re_em_window_width = document.getElementById('modelBox').offsetWidth - 100;
    var g_re_em_window_height = document.getElementById('modelBox').offsetHeight - 100;
    var bool = window.Module.RealBIMWeb.CreateEmuMgr(workerjspath, 'BlackHole', width, height,
      false, 500, '', commonurl, '/window.ModuleDir/TempFile/', '/WebCache0001/',
      username, password);
    return bool;
  }

  // 获取当前js版本
  REgetJsVersion() {
    var ver = window.Module.RealBIMWeb.GetRealEngineVersion();
    return ver;
  }

  // 设置渲染时引擎最大允许的内存占用空间(以MB为单位)
  REsetMaxResMemMB(val) {
    window.Module.RealBIMWeb.SetMaxResMemMB(window.Module.RE_ResourceMgr_MEM.HUGEMBLOCK, val);
  }

  // 获取渲染时引擎最大允许的内存占用空间(以MB为单位)
  REgetMaxResMemMB() {
    var val = window.Module.RealBIMWeb.GetMaxResMemMB(window.Module.RE_ResourceMgr_MEM.HUGEMBLOCK);
    return val;
  }

  // 设置渲染时引擎建议分配的内存空间(以MB为单位)
  REsetExpectMaxInstMemMB(val) {
    window.Module.RealBIMWeb.SetExpectMaxInstMemMB(window.Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, val);
  }

  // 获取渲染时引擎建议分配的内存空间(以MB为单位)
  REgetExpectMaxInstMemMB() {
    var val = window.Module.RealBIMWeb.GetExpectMaxInstMemMB(window.Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
    return val;
  }

  // 设置模型每帧最大渲染面数
  REsetExpectMaxInstDrawFaceNum(val) {
    window.Module.RealBIMWeb.SetExpectMaxInstDrawFaceNum(window.Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, val);
  }

  // 获取模型每帧最大渲染面数
  REgetExpectMaxInstDrawFaceNum() {
    var val = window.Module.RealBIMWeb.GetExpectMaxInstDrawFaceNum(window.Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
    return val;
  }

  // 设置页面调度等级
  REsetPageLoadLev(val) {
    window.Module.RealBIMWeb.SetPageLoadLev(val);
  }

  // 获取页面调度等级
  REgetPageLoadLev() {
    var val = window.Module.RealBIMWeb.GetPageLoadLev();
    return val;
  }

  // 设置每帧允许的最大资源加载总数
  REsetTotalResMaxLoadNum(val) {
    if (val === 0) {
      window.Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0);
    } else if (val === 1) {
      window.Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0xffffffff);
    }
  }

  // 获取每帧允许的最大资源加载总数
  REgetTotalResMaxLoadNum() {
    var val = window.Module.RealBIMWeb.GetTotalResMaxLoadNumPerFrame();
    return val;
  }

  // 场景加载
  REloadMainSce(urlRes, projName, verinfo) {
    var bool = window.Module.RealBIMWeb.LoadMainSce(urlRes,
      '!(DefaultResRootDir)' + projName + '/total.xml',
      '!(RealBIMTempFileCache)/cam001.camera', false);
    let ver = '';
    if (verinfo === '') {
      ver = { m_sVer0: 0x7fffffff, m_sVer1: -1, m_uVer0GolIDBias_L32: 0, m_uVer0GolIDBias_H32: 0, m_uVer1GolIDBias_L32: 0, m_uVer1GolIDBias_H32: 0 };
    } else {
      ver = { m_sVer0: verinfo, m_sVer1: -1, m_uVer0GolIDBias_L32: 0, m_uVer0GolIDBias_H32: 0, m_uVer1GolIDBias_L32: 0, m_uVer1GolIDBias_H32: 0 };
    }
    console.log(ver);
    var verbool = window.Module.RealBIMWeb.SetSceVersionInfo(ver);
    return bool && verbool;
  }

  // 多个场景加载
  // 加载多个场景时，必须以第一个为主场景，加载主场景时会把前边的场景清空
  // projInfo = [
  //             {
  //               "projName":"proj01",
  //               "urlRes":"https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=",
  //               "projResName":"res_test1",
  //               "useNewVer":true,
  //               "verInfo":0,
  //               "useTransInfo":false,
  //               "transInfo":""
  //             },{
  //               "projName":"proj02",
  //               "urlRes":"https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=",
  //               "projResName":"res_test2",
  //               "useNewVer":true,
  //               "verInfo":0,
  //               "useTransInfo":false,
  //               "transInfo":""
  //             }
  //            ]
  REloadMainSce_projs(projInfo) {
    var _defMainProjResRoot = ''; var _defMainProjCamFile = '';
    var _deftransinfo = [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]];
    var _l = projInfo.length;
    var _isMainProj = false;
    var _useCamPost = false;
    for (var i = 0; i < _l; ++i) {
      var intprojid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projInfo[i].projName);
      var _ver = { m_sVer0: 0x7fffffff, m_sVer1: -1, m_uVer0GolIDBias_L32: 0, m_uVer0GolIDBias_H32: intprojid, m_uVer1GolIDBias_L32: 0, m_uVer1GolIDBias_H32: 0 };
      _isMainProj = ((i == 0)); // 如果是从单项目变成多项目，需注释掉此行代码，结合加载单项目的接口一起使用即可
      if (!projInfo[i].useNewVer) {
        _verInfo = projInfo[i].verInfo;
        _ver = { m_sVer0: _verInfo, m_sVer1: -1, m_uVer0GolIDBias_L32: 0, m_uVer0GolIDBias_H32: intprojid, m_uVer1GolIDBias_L32: 0, m_uVer1GolIDBias_H32: 0 };
      }
      if (projInfo[i].useTransInfo) {
        _deftransinfo = projInfo[i].transInfo;
      }

      window.Module.RealBIMWeb.LoadMainSceExt(projInfo[i].projName, _isMainProj, projInfo[i].urlRes + projInfo[i].projResName + '/total.xml',
        _deftransinfo[0], _deftransinfo[1], _deftransinfo[2],
        _defMainProjResRoot, _defMainProjCamFile, _useCamPost);
      var verbool = window.Module.RealBIMWeb.SetSceVersionInfoExt(projInfo[i].projName, _ver);
    }
  }

  REloadMainSce_projsExt(projInfo) {
    var _defMainProjResRoot = ''; var _defMainProjCamFile = '';
    var _deftransinfo = [[1, 1, 1], [0, 0, 0, 1], [0, 0, 0]];
    var _l = projInfo.length;
    var _isMainProj = false;
    var _useCamPost = false;
    for (var i = 0; i < _l; ++i) {
      var intprojid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projInfo[i].projName);
      var _ver = { m_sVer0: 0x7fffffff, m_sVer1: -1, m_uVer0GolIDBias_L32: 0, m_uVer0GolIDBias_H32: intprojid, m_uVer1GolIDBias_L32: 0, m_uVer1GolIDBias_H32: 0 };
      // _isMainProj = ((i==0)? true : false); //如果是从单项目变成多项目，需注释掉此行代码，结合加载单项目的接口一起使用即可
      if (!projInfo[i].useNewVer) {
        _verInfo = projInfo[i].verInfo;
        _ver = { m_sVer0: _verInfo, m_sVer1: -1, m_uVer0GolIDBias_L32: 0, m_uVer0GolIDBias_H32: intprojid, m_uVer1GolIDBias_L32: 0, m_uVer1GolIDBias_H32: 0 };
      }
      if (projInfo[i].useTransInfo) {
        _deftransinfo = projInfo[i].transInfo;
      }

      window.Module.RealBIMWeb.LoadMainSceExt(projInfo[i].projName, _isMainProj, projInfo[i].urlRes + projInfo[i].projResName + '/total.xml',
        _deftransinfo[0], _deftransinfo[1], _deftransinfo[2],
        _defMainProjResRoot, _defMainProjCamFile, _useCamPost);
      var verbool = window.Module.RealBIMWeb.SetSceVersionInfoExt(projInfo[i].projName, _ver);
    }
  }

  // 获取当前加载的所有项目名称
  REgetAllMainSceNames() {
    var temparr = window.Module.RealBIMWeb.GetAllMainSceNames();
    var namearr = [];
    for (i = 0; i < temparr.size(); ++i) {
      namearr.push(temparr.get(i));
    }
    return namearr;
  }

  // 卸载一个场景
  REunloadMainSce(projName) {
    window.Module.RealBIMWeb.UnLoadMainSce(projName);
  }

  // 卸载所有场景
  REunloadAllMainSce() {
    var temparr = window.Module.RealBIMWeb.GetAllMainSceNames();
    for (i = 0; i < temparr.size(); ++i) {
      var tempprojname = temparr.get(i);
      window.Module.RealBIMWeb.UnLoadMainSce(tempprojname);
    }
  }

  // 退出引擎界面
  REreleaseEngine() {
    window.Module.RealBIMWeb.ReleaseEmuMgr();
  }

  // 相机定位到构件ID集合
  REfocusCamTo(objarr, backdepth) {
    var _s = objarr.length;
    var _s01 = (_s * 8).toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
    for (i = 0; i < _s; ++i) {
      var eleid = objarr[i];
      elemIds.set([eleid, 0], i * 2);
    }
    window.Module.RealBIMWeb.FocusCamToSubElems('DefaultProj', '', elemIds.byteLength, elemIds.byteOffset, backdepth); // backdepth表示相机后退的强度，可设置
  }

  // 相机定位到构件ID集合_多项目
  // projIdInfo = [
  //               {"projName":"test1","objarr":[1,2,3]},
  //               {"projName":"test2","objarr":[1,2,3]}
  //              ]
  REfocusCamTo_projs(projIdInfo, backdepth) {
    var obj_s = 0;
    var _offset = 0;
    for (var i = 0; i < projIdInfo.length; ++i) {
      obj_s += projIdInfo[i].objarr.length;
    }
    var _s01 = (obj_s * 8).toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
    for (var i = 0; i < projIdInfo.length; ++i) {
      var projname = projIdInfo[i].projName;
      var projid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projname);
      var tempobjarr = projIdInfo[i].objarr;
      for (var j = 0; j < tempobjarr.length; ++j) {
        var eleid = tempobjarr[j];
        elemIds.set([eleid, projid], _offset);
        _offset += 2;
      }
    }
    window.Module.RealBIMWeb.FocusCamToSubElems('', '', elemIds.byteLength, elemIds.byteOffset, backdepth); // backdepth表示相机后退的强度，可设置
  }

  // 相机定位到场景节点
  REfocusCamToSce(scename, backdepth) {
    window.Module.RealBIMWeb.FocusCamToSubElems('', scename, 0, 0, backdepth); // backdepth表示相机后退的强度，可设置
  }

  // 相机方位相关
  RElocateCamToDir(dirinfo) {
    if (dirinfo == 'default') {
      window.Module.RealBIMWeb.RestoreCamLocation();
    } else if (dirinfo == 'top') {
      window.Module.RealBIMWeb.ResetCamToTotalSce(window.Module.RE_CAM_DIR.TOP);
    } else if (dirinfo == 'bottom') {
      window.Module.RealBIMWeb.ResetCamToTotalSce(window.Module.RE_CAM_DIR.BOTTOM);
    } else if (dirinfo == 'left') {
      window.Module.RealBIMWeb.ResetCamToTotalSce(window.Module.RE_CAM_DIR.LEFT);
    } else if (dirinfo == 'right') {
      window.Module.RealBIMWeb.ResetCamToTotalSce(window.Module.RE_CAM_DIR.RIGHT);
    } else if (dirinfo == 'front') {
      window.Module.RealBIMWeb.ResetCamToTotalSce(window.Module.RE_CAM_DIR.FRONT);
    } else if (dirinfo == 'back') {
      window.Module.RealBIMWeb.ResetCamToTotalSce(window.Module.RE_CAM_DIR.BACK);
    }
  }

  // 获取当前相机方位
  REgetCamLocation() {
    var camloc = window.Module.RealBIMWeb.GetCamLocation();
    return camloc;
  }

  // 调整相机到方位
  RElocateCamTo(pos, dir, deltime) {
    window.Module.RealBIMWeb.LocateCamTo(pos, dir, deltime);
  }

  // 生成屏幕快照
  REgetScreenPrintImage() {
    return window.Module.canvas.toDataURL();
  }

  // 颜色转换工具函数
  REclrFix(clr, clrpercent) {
    var newclr01 = clr.substring(0, 2);
    var newclr02 = clr.substring(2, 4);
    var newclr03 = clr.substring(4, 6);
    var newclr = newclr03 + newclr02 + newclr01;
    var intclrper = Math.round(clrpercent);
    var newclrper = (intclrper > 15 ? (intclrper.toString(16)) : ('0' + intclrper.toString(16)));
    var clrinfo = '0x' + newclrper + newclr;
    var clr = parseInt(clrinfo);
    return clr;
  }

  // 透明度转换工具函数
  REalphaFix(alpha, alphapercent) {
    var intalphainfo = Math.round(alpha);
    var intalphaper = Math.round(alphapercent);
    var newalphainfo = (intalphainfo > 15 ? (intalphainfo.toString(16)) : ('0' + intalphainfo.toString(16)));
    var newalphaper = (intalphaper > 15 ? (intalphaper.toString(16)) : ('0' + intalphaper.toString(16)));
    var alphainfo = '0x' + newalphaper + newalphainfo + 'ffff';
    var alpha = parseInt(alphainfo);
    return alpha;
  }

  // 发光和PBR转换工具函数
  REpbrFix(emis, emis_ratio, smooth, metal, smme_ratio) {
    var intemis = Math.round(emis);
    var intemisratio = Math.round(emis_ratio);
    var intsmoothtemp = Math.round(smooth);
    var intmetaltemp = Math.round(metal);
    var intsmmeratio = Math.round(smme_ratio);
    var intsmooth = Math.round(intsmoothtemp / 255 * 63);
    var intmetal = Math.round(intmetaltemp / 255 * 3);
    var pbrtemp = intemis + intemisratio * 256 + intsmooth * 65536 + intmetal * 4194304 + intsmmeratio * 268435456;
    var pbr = Math.round(pbrtemp);
    return pbr;
  }

  // 改变构件集合颜色(永久)
  REsetElemClr(objarr, newclr, newclrpercent, newalpha, newalphapercent) {
    var clr = REclrFix(newclr, newclrpercent);
    var alpha = REalphaFix(newalpha, newalphapercent);
    var _s = objarr.length;
    if (_s == 0) { // 如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (16).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0, 0, alpha, clr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('DefaultProj', '', 0xffffffff, clrs.byteOffset);
    } else {
      var _s01 = (_s * 16).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = objarr[i];
        clrs.set([eleid, 0, alpha, clr], i * 4);
      }
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('DefaultProj', '', clrs.byteLength, clrs.byteOffset);
    }
  }

  // 多项目改变构件集合颜色(永久)
  REsetElemClr_projs(projname, objarr, newclr, newclrpercent, newalpha, newalphapercent) {
    var clr = REclrFix(newclr, newclrpercent);
    var alpha = REalphaFix(newalpha, newalphapercent);
    var projid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projname);
    var _s = objarr.length;
    if (projname == '') {
      var _l = (16).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0, 0, alpha, clr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('', '', 0xffffffff, clrs.byteOffset);
    } else {
      if (_s == 0) { // 如果构件ID集合为空，则默认为改变所有构件的信息
        var _l = (16).toString();
        window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
        clrs.set([0, projid, alpha, clr], 0);
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projname, '', 0xffffffff, clrs.byteOffset);
      } else {
        var _s01 = (_s * 16).toString();
        window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _s; ++i) {
          var eleid = objarr[i];
          clrs.set([eleid, projid, alpha, clr], i * 4);
        }
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projname, '', clrs.byteLength, clrs.byteOffset);
      }
    }
  }

  // 恢复构件集合颜色(永久)
  REresetElemClr(objarr) {
    var clr = 0x000000ff;
    var alpha = 0x0080ffff;
    var _s = objarr.length;
    if (_s == 0) { // 如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (16).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0, 0, alpha, clr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('DefaultProj', '', 0xffffffff, clrs.byteOffset);
    } else {
      var _s01 = (_s * 16).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = objarr[i];
        clrs.set([eleid, 0, alpha, clr], i * 4);
      }
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('DefaultProj', '', clrs.byteLength, clrs.byteOffset);
    }
  }

  // 多项目恢复构件集合颜色(永久)
  REresetElemClr_projs(projname, objarr) {
    var clr = 0x000000ff;
    var alpha = 0x0080ffff;
    var projid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projname);
    var _s = objarr.length;
    if (projname == '') {
      var _l = (16).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0, 0, alpha, clr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('', '', 0xffffffff, clrs.byteOffset);
    } else {
      if (_s == 0) { // 如果构件ID集合为空，则默认为改变所有构件的信息
        var _l = (16).toString();
        window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
        clrs.set([0, projid, alpha, clr], 0);
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projname, '', 0xffffffff, clrs.byteOffset);
      } else {
        var _s01 = (_s * 16).toString();
        window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _s; ++i) {
          var eleid = objarr[i];
          clrs.set([eleid, projid, alpha, clr], i * 4);
        }
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projname, '', clrs.byteLength, clrs.byteOffset);
      }
    }
  }

  // 改变构件集合颜色(永久,增强版)
  REsetElemClrExt(objarr, newclr, newclr_ratio, newalpha, newalpha_ratio,
    newemis, newemis_ratio, newsmooth, newmetal, newsmme_ratio) {
    var clr = REclrFix(newclr, newclr_ratio);
    var alpha = REalphaFix(newalpha, newalpha_ratio);
    var pbr = REpbrFix(newemis, newemis_ratio, newsmooth, newmetal, newsmme_ratio);
    var _s = objarr.length;
    if (_s == 0) { // 如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (24).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0, 0, alpha, 0, clr, pbr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt('DefaultProj', '', 0xffffffff, clrs.byteOffset);
    } else {
      var _s01 = (_s * 24).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = objarr[i];
        clrs.set([eleid, 0, alpha, 0, clr, pbr], i * 6);
      }
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt('DefaultProj', '', clrs.byteLength, clrs.byteOffset);
    }
  }

  // 多项目改变构件集合颜色(永久,增强版)
  REsetElemClrExt_projs(projname, objarr, newclr, newclr_ratio, newalpha, newalpha_ratio,
    newemis, newemis_ratio, newsmooth, newmetal, newsmme_ratio) {
    var clr = REclrFix(newclr, newclr_ratio);
    var alpha = REalphaFix(newalpha, newalpha_ratio);
    var pbr = REpbrFix(newemis, newemis_ratio, newsmooth, newmetal, newsmme_ratio);
    var projid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projname);
    var _s = objarr.length;
    if (projname == '') {
      var _l = (24).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0, 0, alpha, 0, clr, pbr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt('', '', 0xffffffff, clrs.byteOffset);
    } else {
      if (_s == 0) { // 如果构件ID集合为空，则默认为改变所有构件的信息
        var _l = (24).toString();
        window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
        clrs.set([0, projid, alpha, 0, clr, pbr], 0);
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projname, '', 0xffffffff, clrs.byteOffset);
      } else {
        var _s01 = (_s * 24).toString();
        window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _s; ++i) {
          var eleid = objarr[i];
          clrs.set([eleid, projid, alpha, 0, clr, pbr], i * 6);
        }
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projname, '', clrs.byteLength, clrs.byteOffset);
      }
    }
  }

  // 恢复构件集合颜色(永久,增强版)
  REresetElemClrExt(objarr) {
    var clr = 0x000000ff;
    var alpha = 0x0080ffff;
    var pbr = 0x00000000;
    var _s = objarr.length;
    if (_s == 0) { // 如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (24).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0, 0, alpha, 0, clr, pbr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt('DefaultProj', '', 0xffffffff, clrs.byteOffset);
    } else {
      var _s01 = (_s * 24).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = objarr[i];
        clrs.set([eleid, 0, alpha, 0, clr, pbr], i * 6);
      }
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt('DefaultProj', '', clrs.byteLength, clrs.byteOffset);
    }
  }

  // 多项目恢复构件集合颜色(永久,增强版)
  REresetElemClrExt_projs(projname, objarr) {
    var clr = 0x000000ff;
    var alpha = 0x0080ffff;
    var pbr = 0x00000000;
    var projid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projname);
    var _s = objarr.length;
    if (projname == '') {
      var _l = (24).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0, 0, alpha, 0, clr, pbr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt('', '', 0xffffffff, clrs.byteOffset);
    } else {
      if (_s == 0) { // 如果构件ID集合为空，则默认为改变所有构件的信息
        var _l = (24).toString();
        window.Module.RealBIMWeb.ReAllocHeapViews(_l); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
        clrs.set([0, projid, alpha, 0, clr, pbr], 0);
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projname, '', 0xffffffff, clrs.byteOffset);
      } else {
        var _s01 = (_s * 24).toString();
        window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
        for (i = 0; i < _s; ++i) {
          var eleid = objarr[i];
          clrs.set([eleid, projid, alpha, 0, clr, pbr], i * 6);
        }
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projname, '', clrs.byteLength, clrs.byteOffset);
      }
    }
  }

  // 根据id判断一个构件是否被设为透明
  REisElemHide(elemid) {
    window.Module.RealBIMWeb.ReAllocHeapViews('16'); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([elemid, 0, 0x00000000, 0x00000000], 0);
    var retarray = window.Module.RealBIMWeb.GetHugeObjSubElemClrInfos('DefaultProj', '', clrs.byteLength, clrs.byteOffset);
    var alphainfo = retarray[2].toString(16);
    var isusenewalpha = alphainfo.substring(6, 8);
    var newalpha = alphainfo.substring(2, 4);
    var newalphapercent = alphainfo.substring(0, 2);
    var temp01 = parseInt(isusenewalpha, 16);
    var temp02 = parseInt(newalpha, 16);
    var temp03 = parseInt(newalphapercent, 16);
    if (temp01 > 0 && temp02 == 0 && temp03 == 255) {
      return true;
    } else {
      return false;
    }
  }

  // 设置场景节点颜色
  REsetSceClr(scearr, newclr, newclrpercent, newalpha, newalphapercent) {
    var clr = REclrFix(newclr, newclrpercent);
    var alpha = REalphaFix(newalpha, newalphapercent);
    var _s = scearr.length;
    if (_s == 0) { // 如果场景ID集合为空，则默认为改变所有场景的信息
      window.Module.RealBIMWeb.ReAllocHeapViews('16'); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0); clrs.set([0, 0, alpha, clr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('', '', 0xffffffff, clrs.byteOffset);
    } else {
      var _s01 = (_s * 16).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = scearr[i];
        clrs.set([0, 0, alpha, clr], 0);
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('', eleid, 0xffffffff, clrs.byteOffset);
      }
    }
  }

  // 恢复场景节点颜色
  REresetSceClr(scearr) {
    var clr = 0x000000ff;
    var alpha = 0x0080ffff;
    var _s = scearr.length;
    if (_s == 0) { // 如果场景ID集合为空，则默认为改变所有场景的信息
      window.Module.RealBIMWeb.ReAllocHeapViews('16'); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0); clrs.set([0, 0, alpha, clr], 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('', '', 0xffffffff, clrs.byteOffset);
    } else {
      var _s01 = (_s * 16).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = scearr[i];
        clrs.set([0, 0, alpha, clr], 0);
        window.Module.RealBIMWeb.SetHugeObjSubElemClrInfos('', eleid, 0xffffffff, clrs.byteOffset);
      }
    }
  }

  // 获取当前构件的渲染状态
  REgetSysRenderState() {
    var renderdata = new Uint8Array(window.Module.RealBIMWeb.GetSysRenderState());
    return renderdata;
  }

  // 设置构件的渲染状态
  REsetSysRenderState(renderdata) {
    var strrenderdata = renderdata.byteLength.toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(strrenderdata); data = window.Module.RealBIMWeb.GetHeapView_U8(0);
    data.set(renderdata, 0);
    window.Module.RealBIMWeb.SetSysRenderState(data.byteLength, data.byteOffset);
  }

  // 设置构件的探测掩码
  REsetElemsProbeMask(objarr, bool) {
    var _s = objarr.length;
    if (_s == 0) { // 如果构件ID集合为空，则默认为设置所有构件
      window.Module.RealBIMWeb.SetHugeObjSubElemProbeMasks('DefaultProj', '', 0xffffffff, 0, bool);
    } else {
      var _s01 = (_s * 8).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = objarr[i];
        elemIds.set([eleid, 0], i * 2);
      }
      window.Module.RealBIMWeb.SetHugeObjSubElemProbeMasks('DefaultProj', '', elemIds.byteLength, elemIds.byteOffset, bool);
    }
  }

  // 锚点设置相关
  // 批量添加锚点
  REaddAnchors(ancinfo) {
    var tempanchors = new window.Module.RE_Vector_ANCHOR();
    for (i = 0; i < ancinfo.length; ++i) {
      var tempobj = {
        m_strName: ancinfo[i].ancname,
        m_vPos: ancinfo[i].pos,
        m_cTexRegion: {
          m_strTexPath: ancinfo[i].picpath,
          m_qTexRect: [-30, 0, 0, 30],
          m_uTexClrMult: 0xffffffff,
          m_vMinTexUV: [0.0, 0.0],
          m_vMaxTexUV: [1.0, 1.0],
          m_uFrameNumU: 1,
          m_uFrameNumV: 1,
          m_uFrameStrideU: 30,
          m_uFrameStrideV: 30,
          m_fFrameFreq: 0.0
        },
        m_cTextRegion: {
          m_strGolFontID: 'RealBIMFont001',
          m_bTextWeight: false,
          m_strText: ancinfo[i].textinfo,
          m_uTextClr: 0xffffffff,
          m_uTextBorderClr: 0x80000000,
          m_qTextRect: [0, 0, 1, 1],
          m_uTextFmtFlag: (0x1/* TEXT_FMT_BOTTOM */ | 0x8/* TEXT_FMT_LEFT */ | 0x40/* TEXT_FMT_NOCLIP */)
        }
      };
      tempanchors.push_back(tempobj);
    }
    var bool = window.Module.RealBIMWeb.AddAnchors(tempanchors);
    return bool;
  }

  // 批量删除锚点
  REdelAnchors(arrancname) {
    var tempanchors = new window.Module.RE_Vector_WStr();
    for (i = 0; i < arrancname.length; ++i) {
      tempanchors.push_back(arrancname[i]);
    }
    var bool = window.Module.RealBIMWeb.DelAnchors(tempanchors);
    return bool;
  }

  // 删除全部锚点
  REdelAllAnchors() {
    window.Module.RealBIMWeb.DelAllAnchors();
  }

  // 获取系统中所有锚点总数
  REgetAnchorNum() {
    var ancnum = window.Module.RealBIMWeb.GetAnchorNum();
    return ancnum;
  }

  // 获取某个锚点的信息
  REgetAnchorData(ancname) {
    var ancdata = window.Module.RealBIMWeb.GetAnchor(ancname);
    return ancdata;
  }

  // 获取系统中所有锚点信息
  REgetAllAnchorsData() {
    var allancdata = window.Module.RealBIMWeb.GetAllAnchors();
    return allancdata;
  }

  // 批量添加闪烁锚点
  REaddAnimAnchors(ancinfo) {
    var tempanchors = new window.Module.RE_Vector_ANCHOR();
    for (i = 0; i < ancinfo.length; ++i) {
      var tempobj = {
        m_strName: ancinfo[i].ancname,
        m_vPos: ancinfo[i].pos,
        m_cTexRegion: {
          m_strTexPath: ancinfo[i].picpath,
          m_qTexRect: [-ancinfo[i].picwidth, 0, 0, ancinfo[i].picheight],
          m_uTexClrMult: 0xffffffff,
          m_vMinTexUV: [0.0, 0.0],
          m_vMaxTexUV: [1.0 / ancinfo[i].picnum, 1.0],
          m_uFrameNumU: ancinfo[i].picnum,
          m_uFrameNumV: 1,
          m_uFrameStrideU: ancinfo[i].picwidth,
          m_uFrameStrideV: ancinfo[i].picheight,
          m_fFrameFreq: ancinfo[i].playframe
        },
        m_cTextRegion: {
          m_strGolFontID: 'RealBIMFont001',
          m_bTextWeight: false,
          m_strText: ancinfo[i].textinfo,
          m_uTextClr: 0xffffffff,
          m_uTextBorderClr: 0x80000000,
          m_qTextRect: [0, 0, 1, 1],
          m_uTextFmtFlag: (0x1/* TEXT_FMT_BOTTOM */ | 0x8/* TEXT_FMT_LEFT */ | 0x40/* TEXT_FMT_NOCLIP */)
        }
      };
      tempanchors.push_back(tempobj);
    }
    window.Module.RealBIMWeb.AddAnchors(tempanchors);
  }

  // 停止闪烁
  REstopAncAnim(ancname) {
    var bool = window.Module.RealBIMWeb.SetShpObjInfo(ancname, { m_uRGBBlendInfo: 0x00ffffff, m_uAlpha: 0, m_uAlphaAmp: 0, m_uForceAnimFrame: 0, m_uProbeMask: 1 });
    return bool;
  }

  // 设置系统中锚点是否允许被场景遮挡
  REsetAnchorContactSce(bool) {
    window.Module.RealBIMWeb.SetAnchorContactSce(bool);
  }

  // 获取系统中锚点是否允许被场景遮挡
  REgetAnchorContactSce() {
    return window.Module.RealBIMWeb.GetAnchorContactSce();
  }

  // 标签相关
  // 生成一个标签内部对象
  // TEXT_FMT_BOTTOM     =(1<<0)_0x1,  //表示文字底部对齐
  // TEXT_FMT_VCENTER    =(1<<1)_0x2,  //表示文字竖向居中(优先级高于TEXT_FMT_BOTTOM)
  // TEXT_FMT_TOP      =(1<<2)_0x4,  //表示文字顶部对齐(优先级高于TEXT_FMT_VCENTER)
  // TEXT_FMT_LEFT     =(1<<3)_0x8,  //表示文字左对齐
  // TEXT_FMT_HCENTER    =(1<<4)_0x10,  //表示文字横向居中(优先级高于TEXT_FMT_LEFT)
  // TEXT_FMT_RIGHT      =(1<<5)_0x20,  //表示文字右对齐(优先级高于TEXT_FMT_HCENTER)
  // TEXT_FMT_NOCLIP     =(1<<6)_0x40,  //表示不裁剪掉文字超出给定矩形区域外的部分
  // TEXT_FMT_SINGLELINE   =(1<<7)_0x80,  //表示所有文字全部显示在一横行上，忽略所有的换行符以及TEXT_FMT_WORDBREAK属性
  // TEXT_FMT_WORDBREAK    =(1<<8)_0x100,  //若当前字符有一部分在给定矩形区域外的话，则强制换行显示该字符，避免字符横向超出矩形区域外
  REgenATag(taginfo) {
    var temptexregions = new window.Module.RE_Vector_SHP_TEX();
    var temptextregions = new window.Module.RE_Vector_SHP_TEXT();
    var _l = taginfo.info.length;
    var _h = 26; var _s = 3;
    for (i = 0; i < _l; ++i) {
      temptexregions.push_back({
        m_strTexPath: taginfo.info[i].picpath,
        m_qTexRect: [-50, _h * (_l - i - 1) + _s, -30, _h * (_l - i) - _s],
        m_uTexClrMult: 0xffffffff,
        m_vMinTexUV: [0.0, 0.0],
        m_vMaxTexUV: [1.0, 1.0],
        m_uFrameNumU: 1,
        m_uFrameNumV: 1,
        m_uFrameStrideU: 0,
        m_uFrameStrideV: 0,
        m_fFrameFreq: 0.0
      }); // 纹理矩形区域在2维像素裁剪空间(Y轴向上递增)下相对于定位点的覆盖区域<左，下，右，上>
    }
    for (i = 0; i < _l; ++i) {
      temptextregions.push_back({
        m_strGolFontID: 'RealBIMFont001',
        m_bTextWeight: false,
        m_strText: taginfo.info[i].textinfo,
        m_uTextClr: 0xffffffff,
        m_uTextBorderClr: 0x80000000,
        m_qTextRect: [0, _h * (_l - i - 1) + _s, 30, _h * (_l - i) - _s],
        m_uTextFmtFlag: ((1 << 1)/* TEXT_FMT_VCENTER */ | (1 << 3)/* TEXT_FMT_LEFT */ | (1 << 6)/* TEXT_FMT_NOCLIP */)
      });
    }
    var tempobj = {
      m_strName: taginfo.tagname,
      m_vPos: taginfo.pos,
      m_vBgMinSize: [150, 10],
      m_vBgPadding: [5, 5],
      m_uBgAlignX: 1,
      m_uBgAlignY: 1,
      m_vArrowOrigin: [0, 10],
      m_uBgColor: 0x80000000,
      m_arrTexContents: temptexregions,
      m_arrTextContents: temptextregions
    };
    return tempobj;
  }

  // 批量添加标签
  REaddTags(taginfos) {
    var temptags = new window.Module.RE_Vector_TAG();
    for (var i = 0; i < taginfos.length; ++i) {
      temptags.push_back(REgenATag(taginfos[i]));
    }
    var bool = window.Module.RealBIMWeb.AddTags(temptags);
    return bool;
  }

  // 批量删除标签
  REdelTags(arrtagname) {
    var temptags = new window.Module.RE_Vector_WStr();
    for (i = 0; i < arrtagname.length; ++i) {
      temptags.push_back(arrtagname[i]);
    }
    var bool = window.Module.RealBIMWeb.DelTags(temptags);
    return bool;
  }

  // 删除全部标签
  REdelAllTags() {
    window.Module.RealBIMWeb.DelAllTags();
  }

  // 获取系统中所有标签总数
  REgetTagNum() {
    var tagnum = window.Module.RealBIMWeb.GetTagNum();
    return tagnum;
  }

  // 获取某个标签的信息
  REgetTagData(tagname) {
    var tagdata = window.Module.RealBIMWeb.GetTag(tagname);
    return tagdata;
  }

  // 获取系统中所有标签信息
  REgetAllTagsData() {
    var alltagdata = window.Module.RealBIMWeb.GetAllTags();
    return alltagdata;
  }

  // 设置系统中标签是否允许被场景遮挡
  REsetTagContactSce(bool) {
    window.Module.RealBIMWeb.SetTagContactSce(bool);
  }

  // 获取系统中标签是否允许被场景遮挡
  REgetTagContactSce() {
    return window.Module.RealBIMWeb.GetTagContactSce();
  }

  // 标注相关
  // 开始添加标注
  REaddMarkBegin() {
    var bool = window.Module.RealBIMWeb.BeginAddMark(); // 进入创建标注的状态
    return bool;
  }

  // 添加标注文字
  REaddMarkText(textdata) {
    window.Module.RealBIMWeb.SetMarkText(textdata);
  }

  // 获取当前标注信息
  REgetMarkData() {
    var markdata = new Uint8Array(window.Module.RealBIMWeb.GetMarkInfo());
    return markdata;
  }

  // 结束添加标注
  REaddMarkEnd() {
    var bool = window.Module.RealBIMWeb.EndAddMark();
    return bool;
  }

  // 查看之前保存的标注信息，参数为之前保存的字符串
  REshowMark(markdata) {
    var strmarkdata = markdata.byteLength.toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(strmarkdata); data = window.Module.RealBIMWeb.GetHeapView_U8(0);
    data.set(markdata, 0);
    window.Module.RealBIMWeb.ShowMarkInfo(data.byteLength, data.byteOffset);
  }

  // 电子围栏相关
  // 进入电子围栏编辑状态
  REeditFenceBegin() {
    window.Module.RealBIMWeb.EnterFenceEditMode(); // 进入编辑电子围栏的状态
  }

  REaddFenceBegin() {
    var bool = window.Module.RealBIMWeb.BeginAddFence(); // 开始添加电子围栏，进入电子围栏编辑状态后可添加多个电子围栏
    return bool;
  }

  REaddFenceEnd() {
    var bool = window.Module.RealBIMWeb.EndAddFence(); // 结束当前电子围栏的添加，如果没有退出电子围栏编辑状态，可继续添加下一个
    return bool;
  }

  REeditFenceEnd() {
    window.Module.RealBIMWeb.ExitFenceEditMode(); // 退出编辑电子围栏的状态
  }

  // 设置添加电子围栏时的小提示图标
  REsetFenceEditPic(strpicpath) {
    var temptexregions = {
      m_strTexPath: strpicpath,
      m_qTexRect: [-32, 0, 0, 32],
      m_uTexClrMult: 0xffffffff,
      m_vMinTexUV: [0.0, 0.0],
      m_vMaxTexUV: [1.0, 1.0],
      m_uFrameNumU: 1,
      m_uFrameNumV: 1,
      m_uFrameStrideU: 32,
      m_uFrameStrideV: 32,
      m_fFrameFreq: 0.0
    };
    window.Module.RealBIMWeb.SetFencePotUniformIcon(temptexregions);
  }

  // 获取当前所有电子围栏的顶点信息
  REgetFencePot() {
    var fenceinfo = window.Module.RealBIMWeb.GetSceFenceInfos();
    return fenceinfo;
  }

  // 根据电子围栏的顶点和线的名称返回围栏的名称
  REgetFenceName(childname) {
    var fencedata = window.Module.RealBIMWeb.GetShpObjExtInfo(shpproberet_norm.m_strSelShpObjName);
    if ((fencedata.m_eType.value == 3) || (fencedata.m_eType.value == 4)) {
      var fencename = fencedata.m_strParent;
      return fencename;
    }
  }

  // 设置电子围栏的顶点信息
  REaddFenceByPot(fenceinfo) {
    window.Module.RealBIMWeb.ExitFenceEditMode(); // 必须退出编辑电子围栏的状态，才可设置所有围栏的信息
    for (i = 0; i < fenceinfo.length; ++i) {
      fenceinfo[i].m_uClr = REclrFix(fenceinfo[i].m_uClr, fenceinfo[i].m_uAlpha);
      delete fenceinfo[i].m_uAlpha;
    }
    var tempfencepots = new window.Module.RE_Vector_FENCE_POT();
    for (i = 0; i < fenceinfo.length; ++i) {
      tempfencepots.push_back(fenceinfo[i]);
    }
    var bool = window.Module.RealBIMWeb.SetSceFenceInfos(tempfencepots);
    return bool;
  }

  // 删除一个围栏顶点
  REdelFencePot(fencepotname) {
    window.Module.RealBIMWeb.EnterFenceEditMode(); // 进入编辑电子围栏的状态
    var bool = window.Module.RealBIMWeb.DelFencePot(fencepotname);
    window.Module.RealBIMWeb.ExitFenceEditMode(); // 退出编辑电子围栏的状态
    return bool;
  }

  // 删除一个围栏
  REdelFence(fencename) {
    window.Module.RealBIMWeb.EnterFenceEditMode(); // 进入编辑电子围栏的状态
    var bool = window.Module.RealBIMWeb.DelFence(fencename);
    window.Module.RealBIMWeb.ExitFenceEditMode(); // 退出编辑电子围栏的状态
    return bool;
  }

  // 删除全部围栏
  REdelAllFences() {
    window.Module.RealBIMWeb.EnterFenceEditMode(); // 进入编辑电子围栏的状态
    var bool = window.Module.RealBIMWeb.DelAllFences();
    window.Module.RealBIMWeb.ExitFenceEditMode(); // 退出编辑电子围栏的状态
    return bool;
  }

  // 选择集合相关（选择集包含鼠标选中的构件ID集合，鼠标点击空白处，选择集自动清空）
  // 设置选择集的颜色、透明度、探测掩码（即是否可以被选中）
  // clr: 表示新的颜色
  // clrpercent: 表示新的颜色所占的权重，255表示100%,0表示0%
  // alpha: 表示新的透明度，255表示不透明，80表示半透明，0表示全透明
  // alphapercent: 表示新的透明度所占的权重，255表示100%，0表示0%
  // probemask : 0：表示选择集中的构件不可被选中，为1则表示可以被选中；
  REsetSelElemsAttr(clr, clrpercent, alpha, alphapercent, probemask) {
    var tempclr01 = clr.substring(0, 2); var clr01 = (parseInt(tempclr01, 16) / 255);
    var tempclr02 = clr.substring(2, 4); var clr02 = (parseInt(tempclr02, 16) / 255);
    var tempclr03 = clr.substring(4, 6); var clr03 = (parseInt(tempclr03, 16) / 255);
    var clrper = (clrpercent / 255);
    var alphadata = (alpha / 255);
    var alphaper = (alphapercent / 255);
    var bool = window.Module.RealBIMWeb.SetSelElemsAttr({ m_qClrBlend: [clr01, clr02, clr03, clrper], m_vAlphaBlend: [alphadata, alphaper], m_uProbeMask: probemask });
    return bool;
  }

  // 获取当前选择集的属性信息
  REgetSelElemsAttr() {
    var curattr = window.Module.RealBIMWeb.GetSelElemsAttr();
    return curattr;
  }

  // 获取当前选择集的构件ID集合,以数组形式返回，两两一组代表一个id的高32位和低32位
  REgetSelElemIDs() {
    var selids = new Uint32Array(window.Module.RealBIMWeb.GetSelElemIDs());
    return selids;
  }

  // 往当前选择集合添加构件，参数为要添加的构件id集合
  REaddToSelElemIDs(objarr) {
    var _s = objarr.length;
    if (_s == 0) {
      window.Module.RealBIMWeb.AddToSelElemIDs(0xffffffff, elemIds.byteOffset); // 添加全部构件,目前暂不支持
    } else {
      var _s01 = (_s * 8).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = objarr[i];
        elemIds.set([eleid, 0], i * 2);
      }
      window.Module.RealBIMWeb.AddToSelElemIDs(elemIds.byteLength, elemIds.byteOffset);
    }
  }

  // 从当前选择集合删除构件，参数为要删除的构件id集合
  REremoveFromSelElemIDs(objarr) {
    var _s = objarr.length;
    if (_s == 0) {
      window.Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff, 0); // 删除全部构件
    } else {
      var _s01 = (_s * 8).toString();
      window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
      for (i = 0; i < _s; ++i) {
        var eleid = objarr[i];
        elemIds.set([eleid, 0], i * 2);
      }
      window.Module.RealBIMWeb.RemoveFromSelElemIDs(elemIds.byteLength, elemIds.byteOffset);
    }
  }

  // 获取元素集合的总包围盒信息
  REgetTotalBoxByElemIDs(objarr) {
    var _s = objarr.length;
    var tempbv;
    if (_s == 0) {
      tempbv = window.Module.RealBIMWeb.GetHugeObjSubElemsTotalBV('DefaultProj', '', 0xffffffff, 0); // 获取所有构件的包围盒信息
    } else {
      var temparr = [];
      for (var i = 0; i < _s; ++i) {
        temparr.push(objarr[i]);
        temparr.push(0);
      }
      var selids = new Uint32Array(temparr);
      var tempids;
      window.Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids = window.Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
      tempbv = window.Module.RealBIMWeb.GetHugeObjSubElemsTotalBV('DefaultProj', '', tempids.byteLength, tempids.byteOffset);
    }
    var aabbarr = [];
    aabbarr.push(tempbv[0][0]); // Xmin
    aabbarr.push(tempbv[1][0]); // Xmax
    aabbarr.push(tempbv[0][1]); // Ymin
    aabbarr.push(tempbv[1][1]); // Ymax
    aabbarr.push(tempbv[0][2]); // Zmin
    aabbarr.push(tempbv[1][2]); // Zmax
    return aabbarr;
  }

  // 获取元素集合的总包围盒信息
  REgetTotalBoxByElemIDs_projs(projname, objarr) {
    var _s = objarr.length;
    var projid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projname);
    var tempbv;
    if (projname == '') {
      tempbv = window.Module.RealBIMWeb.GetHugeObjSubElemsTotalBV('', '', 0xffffffff, 0); // 获取所有构件的包围盒信息
    } else {
      if (_s == 0) {
        tempbv = window.Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(projname, '', 0xffffffff, 0); // 获取所有构件的包围盒信息
      } else {
        var temparr = [];
        for (var i = 0; i < _s; ++i) {
          temparr.push(objarr[i]);
          temparr.push(projid);
        }
        var selids = new Uint32Array(temparr);
        var tempids;
        window.Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids = window.Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
        tempbv = window.Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(projname, '', tempids.byteLength, tempids.byteOffset);
      }
    }

    var aabbarr = [];
    aabbarr.push(tempbv[0][0]); // Xmin
    aabbarr.push(tempbv[1][0]); // Xmax
    aabbarr.push(tempbv[0][1]); // Ymin
    aabbarr.push(tempbv[1][1]); // Ymax
    aabbarr.push(tempbv[0][2]); // Zmin
    aabbarr.push(tempbv[1][2]); // Zmax
    return aabbarr;
  }

  // 鼠标探测相关
  // 获取当前选中点相关参数
  REgetCurProbeRet() {
    var proberet = window.Module.RealBIMWeb.GetCurProbeRet(window.Module.RE_PROBE_TYPE.POT);
    var projid = proberet.m_uSelActorSubID_H32;
    var projname = window.Module.RealBIMWeb.ConvGolIntID2StrID(projid);
    proberet.m_strProjName = projname;
    delete proberet.m_uSelActorSubID_H32;
    return proberet;
  }

  // 获取当前拾取到的矢量(锚点、标签)相关信息
  REgetCurShpProbeRet() {
    var shpproberet_norm = window.Module.RealBIMWeb.GetCurShpProbeRet(window.Module.RE_SHP_PROBE_TYPE.NORM);
    return shpproberet_norm;
  }

  // 获取当前拾取到的UI相关信息(不常用)
  REgetCurUIShpProbeRet() {
    var shpproberet_ortho = window.Module.RealBIMWeb.GetCurShpProbeRet(window.Module.RE_SHP_PROBE_TYPE.ORTHO);
    return shpproberet_ortho;
  }

  // 获取剖切后的构件ID
  REgetClipID(deletecrosspart) {
    var data = window.Module.RealBIMWeb.GetClippedElementIds(deletecrosspart);
    return data;
  }

  // 获取剖面信息
  REgetClipData() {
    var data = window.Module.RealBIMWeb.GetSceneClippingInfo();
    return data;
  }

  // 设置剖面信息
  REsetClipData(clipdata) {
    var bool = window.Module.RealBIMWeb.SetSceneClippingInfo(clipdata);
    return bool;
  }

  // 退出剖切
  REexitClip() {
    window.Module.RealBIMWeb.EndSceneClipping();
  }

  // 判断是否处于剖切浏览模式
  REisSceCliping() {
    var bool = window.Module.RealBIMWeb.IsSceneClippingBrowsing();
    return bool;
  }

  // 倾斜摄影单体化相关接口
  // 设置倾斜摄影压平数据，参数为固定格式json字符串
  REsetUnverProjectData(unverprojectiondata) {
    var jsonStr = JSON.stringify(unverprojectiondata);
    window.Module.RealBIMWeb.ParseUnverprojectInfo(jsonStr);
  }

  // 取消拍平区域，参数为要取消的拍平区域id集合
  REremoveUnverProjectData(elemarr) {
    var _s = elemarr.length;
    var _s01 = (_s * 8).toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
    for (i = 0; i < _s; ++i) {
      var eleid = elemarr[i];
      elemIds.set([eleid, 0], i);
    }
    window.Module.RealBIMWeb.RemoveUnverprojectToSelection(elemIds.byteLength, elemIds.byteOffset);
  }

  // 设置拍平区域，参数为要取消的拍平区域id集合
  REresetUnverProjectData(elemarr) {
    var _s = elemarr.length;
    var _s01 = (_s * 8).toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
    for (i = 0; i < _s; ++i) {
      var eleid = elemarr[i];
      elemIds.set([eleid, 0], i);
    }
    window.Module.RealBIMWeb.AddUnverprojectToSelection(elemIds.byteLength, elemIds.byteOffset);
  }

  // 设置倾斜摄影单体化数据，参数为固定格式json字符串
  REsetUnverElemData(unverelemdata) {
    var jsonStr = JSON.stringify(unverelemdata);
    window.Module.RealBIMWeb.ParseUnverelemInfo(jsonStr);
  }

  // 高亮倾斜摄影单体化区域，参数为要查看的单体化id集合
  REshowUnverElemData(elemarr) {
    var _s = elemarr.length;
    var _s01 = (_s * 8).toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
    for (i = 0; i < _s; ++i) {
      var eleid = elemarr[i];
      elemIds.set([eleid, 0], i);
    }
    window.Module.RealBIMWeb.HighlightUnverelem(elemIds.byteLength, elemIds.byteOffset);
  }

  // 取消高亮倾斜摄影单体化区域，参数为要隐藏的单体化id集合
  REhideUnverElemData(elemarr) {
    var _s = elemarr.length;
    var _s01 = (_s * 8).toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
    for (i = 0; i < _s; ++i) {
      var eleid = elemarr[i];
      elemIds.set([eleid, 0], i);
    }
    window.Module.RealBIMWeb.CancelHighlightUnverelem(elemIds.byteLength, elemIds.byteOffset);
  }

  // 向选择集添加单体化区域，参数为要添加的单体化id集合
  REaddToSelUElemIDs(elemarr) {
    var _s = elemarr.length;
    var _s01 = (_s * 8).toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
    for (i = 0; i < _s; ++i) {
      var eleid = elemarr[i];
      elemIds.set([eleid, 0], i);
    }
    window.Module.RealBIMWeb.AddUnverelemsToSelection(elemIds.byteLength, elemIds.byteOffset);
  }

  // 从选择集移除单体化区域，参数为要移除的单体化id集合
  REremoveFromSelUElemIDs(elemarr) {
    var _s = elemarr.length;
    var _s01 = (_s * 8).toString();
    window.Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds = window.Module.RealBIMWeb.GetHeapView_U32(0);
    for (i = 0; i < _s; ++i) {
      var eleid = elemarr[i];
      elemIds.set([eleid, 0], i);
    }
    window.Module.RealBIMWeb.RemoveUnverelemsToSelection(elemIds.byteLength, elemIds.byteOffset);
  }

  // 获取单体化选择集ID
  REgetUnverElemIDs() {
    var selids = new Uint32Array(window.Module.RealBIMWeb.GetSelectedUnverelemId());
    return selids;
  }

  // 设置单体化区域选中颜色
  // cn::u32 m_UnverelmSelectionColor = 0xff00ffff;
  // clr ="FF0000"; //颜色
  // alpha =25;  //透明度，255表示不透明，80表示半透明，0表示全透明
  REsetUnverElemClr(clr, alpha) {
    var newclr01 = clr.substring(0, 2);
    var newclr02 = clr.substring(2, 4);
    var newclr03 = clr.substring(4, 6);
    var newclr = newclr03 + newclr02 + newclr01;
    var intalphainfo = Math.round(alpha);
    var newalphainfo = (intalphainfo > 15 ? (intalphainfo.toString(16)) : ('0' + intalphainfo.toString(16)));
    var clrinfo = '0x' + newalphainfo + newclr;
    var clr = parseInt(clrinfo);
    window.Module.RealBIMWeb.SetUnverelemSelectionColor(clr);
  }

  // 天空盒相关
  // 设置天空盒的启用状态
  REsetSkyEnable(bool) {
    window.Module.RealBIMWeb.SetSkyEnable(bool);
  }

  // 获取天空盒的启用状态
  REgetSkyEnable() {
    var bool = window.Module.RealBIMWeb.GetSkyEnable();
    return bool;
    var namearr = ['sce01', 'sce02'];
  }

  // 设置天空盒的背景颜色
  REsetBackColor(clr) {
    var tempclr01 = clr.substring(0, 2); var clr01 = (parseInt(tempclr01, 16) / 255);
    var tempclr02 = clr.substring(2, 4); var clr02 = (parseInt(tempclr02, 16) / 255);
    var tempclr03 = clr.substring(4, 6); var clr03 = (parseInt(tempclr03, 16) / 255);
    var clrarr = [clr01, clr02, clr03];
    window.Module.RealBIMWeb.SetBackColor(clrarr);
  }

  // 获取天空盒的背景颜色
  REgetBackColor() {
    var color = window.Module.RealBIMWeb.GetBackColor();
    return color;
  }

  // 获取场景所有地形和倾斜摄影的节点id
  REgetAllUnVerHugeGroupIDs() {
    var arr1 = window.Module.RealBIMWeb.GetAllUnVerHugeGroupNames();
    var namearr = [];
    for (i = 0; i < arr1.size(); ++i) {
      namearr.push(arr1.get(i));
    }
    return namearr;
  }

  // 设置地形的透明度
  REsetUnVerHugeGroupAlpha(sceid, alpha) {
    window.Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(sceid, { m_uDestAlpha: alpha, m_uDestAlphaAmp: 255, m_uDestRGBBlendInfo: 0x00000000 });
  }

  // 获取当前设置的地形的透明度
  REgetUnVerHugeGroupAlpha(sceid) {
    var alpha = window.Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(sceid);
    return alpha.m_uDestAlpha;
  }

  // 设置引擎UI按钮面板是否可见
  REsetUIPanelVisible(bool) {
    window.Module.RealBIMWeb.SetUIPanelVisible(bool);
  }

  // 设置引擎右上方ViewCube是否可见
  REsetViewCubeVisible(bool) {
    window.Module.RealBIMWeb.SetViewCubeVisibility(bool);
  }

  // 重置所有元素的显示状态
  REresetUserOperation() {
    window.Module.RealBIMWeb.ResetUserOperation(0);
  }

  // 获取场景所有地形和倾斜摄影的节点id
  REgetAllHugeGroupIDs() {
    arr1 = window.Module.RealBIMWeb.GetAllHugeObjNames();
    var namearr = [];
    for (i = 0; i < arr1.size(); ++i) {
      namearr.push(arr1.get(i));
    }
    return namearr;
  }

  // 获取当前场景的所有可见元素id
  REgetEleIDsBySceID(sceid, visibalonly) {
    var tempelemids = new Uint32Array(window.Module.RealBIMWeb.GetHugeObjSubElemIDs('DefaultProj', sceid, visibalonly));

    var elemids = [];
    for (i = 0; i < tempelemids.length; i += 2) {
      elemids.push(tempelemids[i]);
    }
    return elemids;
  }

  // 正交投影下开始添加剖切线顶点
  REclipWithTwoPoint(clipdir) {
    if (clipdir == 'horizontal') {
      return window.Module.RealBIMWeb.OrthographicBeginAddClippingVertex(window.Module.RE_CLIP_DIR.HORIZONTAL);
    } else if (clipdir == 'vertical') {
      return window.Module.RealBIMWeb.OrthographicBeginAddClippingVertex(window.Module.RE_CLIP_DIR.VERTICAL);
    }
  }

  // 正交投影下退出剖切状态
  REexitClipWithTwoPoint() {
    window.Module.RealBIMWeb.OrthographicEndSceneClipping();
  }

  // 进入单面剖切状态
  REbeginSingleClip() {
    window.Module.RealBIMWeb.OnSingleSurfaceClipClicked();
  }

  // 设置剖切完成后是否自动聚焦到剖切面
  REisAutoFocusWithClip(bool) {
    window.Module.RealBIMWeb.setTargetToClipPlane(bool);
  }

  // 进入计算任意点到围栏最短距离的操作状态
  REbeginShowDis() {
    return window.Module.RealBIMWeb.EnterPotAndFenceDistMeasureState();
  }

  // 退出计算任意点到围栏最短距离的操作状态
  REendShowDis() {
    window.Module.RealBIMWeb.ExitPotAndFenceDistMeasureState();
  }

  // 在屏幕上显示两个点之间的距离
  REshowDistWithTwoPoint(point1, point2, text) {
    window.Module.RealBIMWeb.DrawHoriMeasureData(point1, point2, text);
  }

  // 清除屏幕上的两点之间信息的信息
  REclearDistWithTwoPoint() {
    window.Module.RealBIMWeb.ClearHoriMeasureData();
  }

  // 获取相机自动动画启用状态
  REgetAutoCamAnimEnable() {
    return window.Module.RealBIMWeb.GetAutoCamAnimEnable();
  }

  // 设置相机自动动画参数
  REsetAutoCamAnimParams(pot, speed, bool) {
    var val = 2 * 3.1415 / speed;
    window.Module.RealBIMWeb.SetAutoCamAnimParams(pot, val);
    window.Module.RealBIMWeb.SetAutoCamAnimEnable(bool);
  }

  // 地理坐标信息相关
  // 增加一套地理信息坐标
  REaddGeoCoordInfo(name, refpointarr, targetpointarr) {
    var ref01 = refpointarr[0]; var ref02 = refpointarr[1]; var ref03 = refpointarr[2]; var ref04 = refpointarr[3];
    var target01 = targetpointarr[0]; var target02 = targetpointarr[1]; var target03 = targetpointarr[2]; var target04 = targetpointarr[3];
    return window.Module.RealBIMWeb.AddGeoCoordInfo(name, ref01, ref02, ref03, ref04, target01, target02, target03, target04);
  }

  // 删除一套地理信息坐标
  REdelGeoCoordInfo(name) {
    return window.Module.RealBIMWeb.DelGeoCoordInfo(name);
  }

  // 轴网和标高相关
  // 加载轴网和标高数据
  RErequestGridAndLevelData(urlRes, projName) {
    var miscdataurl = urlRes + projName + '/miscs/GridAndLevelData.json';
    window.Module.RealBIMWeb.RequestProjectMiscData(miscdataurl);
  }

  // 隐藏或显示轴网、标高
  REshowGridAndLevelBySceID(visible, sceArr) {
    var tempsceids = new window.Module.RE_Vector_Str();
    for (i = 0; i < sceArr.length; ++i) {
      tempsceids.push_back(sceArr[i]);
    }
    var bool = window.Module.RealBIMWeb.SetProjectMiscDataVisible(visible, tempsceids);
    return bool;
  }

  // 设置轴网颜色
  // clr ="FF0000"; //颜色
  // alpha =25;  //透明度，255表示不透明，80表示半透明，0表示全透明
  REsetGridColor(clr, alpha) {
    var newclr01 = clr.substring(0, 2);
    var newclr02 = clr.substring(2, 4);
    var newclr03 = clr.substring(4, 6);
    var newclr = newclr03 + newclr02 + newclr01;
    var intalphainfo = Math.round(alpha);
    var newalphainfo = (intalphainfo > 15 ? (intalphainfo.toString(16)) : ('0' + intalphainfo.toString(16)));
    var clrinfo = '0x' + newalphainfo + newclr;
    var clr = parseInt(clrinfo);
    window.Module.RealBIMWeb.SetAxisColor(clr);
  }

  // 设置标高颜色
  // clr ="FF0000"; //颜色
  // alpha =25;  //透明度，255表示不透明，80表示半透明，0表示全透明
  REsetLevelColor(clr, alpha) {
    var newclr01 = clr.substring(0, 2);
    var newclr02 = clr.substring(2, 4);
    var newclr03 = clr.substring(4, 6);
    var newclr = newclr03 + newclr02 + newclr01;
    var intalphainfo = Math.round(alpha);
    var newalphainfo = (intalphainfo > 15 ? (intalphainfo.toString(16)) : ('0' + intalphainfo.toString(16)));
    var clrinfo = '0x' + newalphainfo + newclr;
    var clr = parseInt(clrinfo);
    window.Module.RealBIMWeb.SetLevelColor(clr);
  }

  // 相机定位到某一个场景节点的某一个标高
  RElocateCamToLevelBySceID(sceID, levelGuid, useOffset, bootom, top) {
    var offsetArr = [bootom, top];
    var bool = window.Module.RealBIMWeb.ClipAndTargetToLevel(sceID, levelGuid, useOffset, offsetArr);
    return bool;
  }

  // 根据标高的id创建剖切面
  REcreatSectionByLevelID(sceID, levelGuid, offset) {
    var bool = window.Module.RealBIMWeb.SingleSurfaceClipByLevelData(sceID, levelGuid, offset);
    return bool;
  }

  REgetHeightByLevelID(sceID, levelGuid) {
    return window.Module.RealBIMWeb.GetLevelHeight(sceID, levelGuid);
  }

  // 测量轴网的距离（根据轴网id计算）
  REgetGridDistance(sceID, gridGuid0, gridGuid1) {
    var griddist = window.Module.RealBIMWeb.MeasureGridDistance(sceID, gridGuid0, gridGuid1);
    return griddist;
  }

  // 测量轴网的距离（根据鼠标选中的轴网计算）
  REbeginMesureGridDistance() {
    window.Module.RealBIMWeb.BeginMeasureGridDistance();
  }

  // 设置轴网是否可选中
  REsetGridProbeEnable(bool) {
    window.Module.RealBIMWeb.SetGridProbeEnable(bool);
  }

  // 设置标高是否可选中
  REsetLevelProbeEnable(bool) {
    window.Module.RealBIMWeb.SetLevelProbeEnable(bool);
  }

  // 设置轴网和标高是否可被遮挡
  REsetMiscDataDepthTest(bool) {
    window.Module.RealBIMWeb.SetMiscDataDepthTest(bool);
  }

  // 获取系统中的全局元素骨骼总数
  REgetGolElemBoneNum() {
    return window.Module.RealBIMWeb.GetGolElemBoneNum();
  }

  // 设置场景内构件集合使用的全局骨骼索引
  // 要绑定到某一个骨骼上的元素ID集合，array类型，为空表示设置场景内的全部构件
  // uBoneID：要设置的骨骼索引
  REbindElemToBoneID(uElemArr, uBoneID) {
    var _s = uElemArr.length;
    if (_s == 0) {
      window.Module.RealBIMWeb.SetHugeObjSubElemBoneIDs('', '', 0xffffffff, 0, uBoneID); // 绑定全部构件
    } else {
      var temparr = [];
      for (var i = 0; i < _s; ++i) {
        temparr.push(uElemArr[i]);
        temparr.push(0);
      }
      var selids = new Uint32Array(temparr);
      var tempids;
      window.Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids = window.Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
      window.Module.RealBIMWeb.SetHugeObjSubElemBoneIDs('', '', tempids.byteLength, tempids.byteOffset, uBoneID);
    }
  }

  // 多项目设置场景内构件集合使用的全局骨骼索引
  // projName:项目名称，为空字符串则表示所有项目
  // uElemArr:要绑定到某一个骨骼上的元素ID集合，array类型，为空表示设置场景内的全部构件
  // uBoneID：要设置的骨骼索引
  REbindElemToBoneID_projs(projName, uElemArr, uBoneID) {
    if (projName == '') {
      window.Module.RealBIMWeb.SetHugeObjSubElemBoneIDs('', '', 0xffffffff, 0, uBoneID); // 绑定全部构件
    } else {
      var projid = window.Module.RealBIMWeb.ConvGolStrID2IntID(projName);
      var _s = uElemArr.length;
      if (_s == 0) {
        window.Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(projName, '', 0xffffffff, 0, uBoneID); // 绑定全部构件
      } else {
        var temparr = [];
        for (var i = 0; i < _s; ++i) {
          temparr.push(uElemArr[i]);
          temparr.push(projid);
        }
        var selids = new Uint32Array(temparr);
        window.Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString());
        var tempids = window.Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
        window.Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(projName, '', tempids.byteLength, tempids.byteOffset, uBoneID);
      }
    }
  }

  // 设置全局元素骨骼的目标方位
  // uBoneID：表示骨骼全局ID
  // cDestLoc：表示骨骼的目标方位
  // dInterval：表示骨骼从当前方位过渡到目标方位所需的时长
  // uProcBatch：表示骨骼的方位过渡批次
  // bSendPostEvent：表示骨骼方位过渡完毕后是否发送事件消息
  REsetGolElemBoneDestLoc(uBoneID, cDestLoc, dInterval, uProcBatch, bSendPostEvent) {
    return window.Module.RealBIMWeb.SetGolElemBoneDestLoc(uBoneID, cDestLoc, dInterval, uProcBatch, bSendPostEvent);
  }

  // 设置全局元素骨骼的目标方位扩展版,增加缩放系数
  // uBoneID：表示骨骼全局ID
  // cDestLoc：表示骨骼的目标方位
  // dInterval：表示骨骼从当前方位过渡到目标方位所需的时长
  // uProcBatch：表示骨骼的方位过渡批次
  // bSendPostEvent：表示骨骼方位过渡完毕后是否发送事件消息
  REsetGolElemBoneDestLocExt(uBoneID, cDestLoc, dInterval, uProcBatch, bSendPostEvent) {
    return window.Module.RealBIMWeb.SetGolElemBoneDestLocExt(uBoneID, cDestLoc, dInterval, uProcBatch, bSendPostEvent);
  }

  // 重置所有全局元素骨骼为默认方位
  REresetAllGolElemBones() {
    window.Module.RealBIMWeb.ResetAllGolElemBones();
  }

  // 添加复杂标签样式1
  REaddCustomTag01(tagname, pos, tag_w1, tag_w2, tag_h1, tag_h2, caption, contents, pics, captionclr, contentsclr, backclr, frameclr) {
    temptags = new window.Module.RE_Vector_TAG();
    temptexregions = new window.Module.RE_Vector_SHP_TEX();
    for (i = 0; i < pics.length; ++i) {
      temptexregions.push_back({
        m_vMinTexUV: [0.0, 0.0],
        m_vMaxTexUV: [1.0, 1.0],
        m_uFrameNumU: 1,
        m_uFrameNumV: 1,
        m_uFrameStrideU: 0,
        m_uFrameStrideV: 0,
        m_fFrameFreq: 0.0,
        m_strTexPath: pics[i].path,
        m_qTexRect: pics[i].rect,
        m_uTexClrMult: 0xe0ffffff
      });
    }
    temptextregions = new window.Module.RE_Vector_SHP_TEXT();
    temptextregions.push_back({
      m_strGolFontID: 'RealBIMFont002',
      m_bTextWeight: true,
      m_uTextClr: captionclr,
      m_uTextBorderClr: 0x00000000,
      m_strText: caption,
      m_qTextRect: [-tag_w1 / 2, 0, tag_w1 / 2, tag_h1],
      m_uTextFmtFlag: (0x2/* TEXT_FMT_VCENTER */ | 0x10/* TEXT_FMT_HCENTER */ /* | 0x40TEXT_FMT_NOCLIP */ /* | 0x100TEXT_FMT_WORDBREAK */)
    });
    for (i = 0; i < contents.length; ++i) {
      temptextregions.push_back({
        m_strGolFontID: 'RealBIMFont001',
        m_bTextWeight: false,
        m_uTextClr: contentsclr,
        m_uTextBorderClr: 0x00000000,
        m_strText: contents[i],
        m_qTextRect: [-tag_w1 / 2, -(i + 1) * tag_h2, -tag_w1 / 2 + tag_w2, -i * tag_h2],
        m_uTextFmtFlag: (0x2/* TEXT_FMT_VCENTER */ | 0x8/* TEXT_FMT_LEFT */ | 0x40/* TEXT_FMT_NOCLIP */ | 0x100/* TEXT_FMT_WORDBREAK */)
      });
    }
    tempobj = {
      m_strName: tagname,
      m_vPos: pos,
      m_vBgMinSize: [50, 10],
      m_vBgPadding: [5, 5],
      m_uBgAlignX: 1,
      m_uBgAlignY: 1,
      m_vArrowOrigin: [-5, 20],
      m_uBgColor: backclr,
      m_arrTexContents: temptexregions,
      m_arrTextContents: temptextregions
    };

    frameline = {
      m_vMinTexUV: [0.0, 0.0],
      m_vMaxTexUV: [1.0, 1.0],
      m_uFrameNumU: 1,
      m_uFrameNumV: 1,
      m_uFrameStrideU: 0,
      m_uFrameStrideV: 0,
      m_fFrameFreq: 0.0,
      m_strTexPath: '',
      m_qTexRect: [0, 0, 0, 0],
      m_uTexClrMult: frameclr
    };
    var framelinewidth = 2; var framegap = 6;
    frameline.m_qTexRect = [-tag_w1 / 2 - framegap, tag_h1, tag_w1 / 2 + framegap, tag_h1 + framelinewidth]; temptexregions.push_back(frameline);
    frameline.m_qTexRect = [-tag_w1 / 2 - framegap, -framelinewidth, tag_w1 / 2 + framegap, 0]; temptexregions.push_back(frameline);
    frameline.m_qTexRect = [-tag_w1 / 2 - framegap, -tag_h2 * contents.length - framelinewidth, tag_w1 / 2 + framegap, -tag_h2 * contents.length]; temptexregions.push_back(frameline);
    frameline.m_qTexRect = [-tag_w1 / 2 - framegap, -tag_h2 * contents.length - framelinewidth, -tag_w1 / 2 - framegap + framelinewidth, tag_h1 + framelinewidth]; temptexregions.push_back(frameline);
    frameline.m_qTexRect = [tag_w1 / 2 + framegap - framelinewidth, -tag_h2 * contents.length - framelinewidth, tag_w1 / 2 + framegap, tag_h1 + framelinewidth]; temptexregions.push_back(frameline);

    temptags.push_back(tempobj);
    window.Module.RealBIMWeb.AddTags(temptags);
  }

  REaddCustomTag02(tagname, pos, tag_w, tag_h1, tag_h2, caption, contents, captionclr, contentsclr, backclr, frameclr) {
    temptags = new window.Module.RE_Vector_TAG();
    temptexregions = new window.Module.RE_Vector_SHP_TEX();
    temptextregions = new window.Module.RE_Vector_SHP_TEXT();
    temptextregions.push_back({
      m_strGolFontID: 'RealBIMFont002',
      m_bTextWeight: true,
      m_uTextClr: captionclr,
      m_uTextBorderClr: 0x00000000,
      m_strText: caption,
      m_qTextRect: [-tag_w / 2, 0, tag_w / 2, tag_h1],
      m_uTextFmtFlag: (0x2/* TEXT_FMT_VCENTER */ | 0x10/* TEXT_FMT_HCENTER */ /* | 0x40TEXT_FMT_NOCLIP */ /* | 0x100TEXT_FMT_WORDBREAK */)
    });
    for (i = 0; i < contents.length; ++i) {
      sub_w = tag_w / contents[i].length; sub_base = -tag_w / 2;
      for (j = 0; j < contents[i].length; ++j) {
        temptextregions.push_back({
          m_strGolFontID: 'RealBIMFont001',
          m_bTextWeight: false,
          m_uTextClr: contentsclr,
          m_uTextBorderClr: 0x00000000,
          m_strText: contents[i][j],
          m_qTextRect: [sub_base, -(i + 1) * tag_h2, sub_base + sub_w, -i * tag_h2],
          m_uTextFmtFlag: (0x2/* TEXT_FMT_VCENTER */ | 0x8/* TEXT_FMT_LEFT */ /* | 0x40TEXT_FMT_NOCLIP */ | 0x100/* TEXT_FMT_WORDBREAK */)
        });
        sub_base += sub_w;
      }
    }
    tempobj = {
      m_strName: tagname,
      m_vPos: pos,
      m_vBgMinSize: [50, 10],
      m_vBgPadding: [5, 5],
      m_uBgAlignX: 1,
      m_uBgAlignY: 1,
      m_vArrowOrigin: [-5, 20],
      m_uBgColor: backclr,
      m_arrTexContents: temptexregions,
      m_arrTextContents: temptextregions
    };

    frameline = {
      m_vMinTexUV: [0.0, 0.0],
      m_vMaxTexUV: [1.0, 1.0],
      m_uFrameNumU: 1,
      m_uFrameNumV: 1,
      m_uFrameStrideU: 0,
      m_uFrameStrideV: 0,
      m_fFrameFreq: 0.0,
      m_strTexPath: '',
      m_qTexRect: [0, 0, 0, 0],
      m_uTexClrMult: frameclr
    };
    var framelinewidth = 2; var framegap = 6;
    frameline.m_qTexRect = [-tag_w / 2 - framegap, tag_h1, tag_w / 2 + framegap, tag_h1 + framelinewidth]; temptexregions.push_back(frameline);
    frameline.m_qTexRect = [-tag_w / 2 - framegap, -tag_h2 * contents.length - framelinewidth, tag_w / 2 + framegap, -tag_h2 * contents.length]; temptexregions.push_back(frameline);
    frameline.m_qTexRect = [-tag_w / 2 - framegap, -tag_h2 * contents.length - framelinewidth, -tag_w / 2 - framegap + framelinewidth, tag_h1 + framelinewidth]; temptexregions.push_back(frameline);
    frameline.m_qTexRect = [tag_w / 2 + framegap - framelinewidth, -tag_h2 * contents.length - framelinewidth, tag_w / 2 + framegap, tag_h1 + framelinewidth]; temptexregions.push_back(frameline);
    for (i = 0; i < contents.length; ++i) {
      subline_w_hori = (i == 0) ? framelinewidth : framelinewidth / 2; subline_w_vert = framelinewidth / 2;
      frameline.m_qTexRect = [-tag_w / 2 - framegap, -subline_w_hori - i * tag_h2, tag_w / 2 + framegap, 0 - i * tag_h2]; temptexregions.push_back(frameline);
      sub_w = tag_w / contents[i].length; sub_base = -tag_w / 2 - 2;
      for (j = 0; j + 1 < contents[i].length; ++j) {
        frameline.m_qTexRect = [sub_base + sub_w - subline_w_vert, -(i + 1) * tag_h2, sub_base + sub_w, -i * tag_h2]; temptexregions.push_back(frameline);
        sub_base += sub_w;
      }
    }

    temptags.push_back(tempobj);
    window.Module.RealBIMWeb.AddTags(temptags);
  }
};

window.EngineModel = EngineModel;
export default window.EngineModel;
