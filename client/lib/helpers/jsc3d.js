this.JSC3DWrapper = function() {
  /*
   Copyright (c) 2011~2013 Humu <humu2009@gmail.com>
   This file is part of jsc3d project, which is freely distributable under the
   terms of the MIT license.
  */
  var a, JSC3D = JSC3D || {};
  JSC3D.Viewer = function(b, c) {
    this.params = c ? {
      SceneUrl: c.SceneUrl || "",
      InitRotationX: c.InitRotationX || 0,
      InitRotationY: c.InitRotationY || 0,
      InitRotationZ: c.InitRotationZ || 0,
      ModelColor: c.ModelColor || "#caa618",
      BackgroundColor1: c.BackgroundColor1 || "#ffffff",
      BackgroundColor2: c.BackgroundColor2 || "#383840",
      BackgroundImageUrl: c.BackgroundImageUrl || "",
      RenderMode: c.RenderMode || "flat",
      Definition: c.Definition || "standard",
      MipMapping: c.MipMapping || "off",
      CreaseAngle: c.parameters || -180,
      SphereMapUrl: c.SphereMapUrl || "",
      ProgressBar: c.ProgressBar ||
        "on",
      Renderer: c.Renderer || "",
      LocalBuffers: c.LocalBuffers || "retain"
    } : {
      SceneUrl: "",
      InitRotationX: 0,
      InitRotationY: 0,
      InitRotationZ: 0,
      ModelColor: "#caa618",
      BackgroundColor1: "#ffffff",
      BackgroundColor2: "#383840",
      BackgroundImageUrl: "",
      RenderMode: "flat",
      Definition: "standard",
      MipMapping: "off",
      CreaseAngle: -180,
      SphereMapUrl: "",
      ProgressBar: "on",
      Renderer: "",
      LocalBuffers: "retain"
    };
    this.canvas = b;
    this.selectionBuffer = this.zBuffer = this.colorBuffer = this.bkgColorBuffer = this.canvasData = this.ctx2d = null;
    this.frameWidth =
      b.width;
    this.frameHeight = b.height;
    this.sphereMap = this.defaultMaterial = this.scene = null;
    this.isFailed = this.isLoaded = false;
    this.abortUnfinishedLoadingFn = null;
    this.needRepaint = this.needUpdate = false;
    this.initRotZ = this.initRotY = this.initRotX = 0;
    this.zoomFactor = 1;
    this.panning = [0, 0];
    this.rotMatrix = new JSC3D.Matrix3x4;
    this.transformMatrix = new JSC3D.Matrix3x4;
    this.sceneUrl = "";
    this.modelColor = 13280792;
    this.bkgColor1 = 16777215;
    this.bkgColor2 = 3684416;
    this.bkgImageUrl = "";
    this.bkgImage = null;
    this.renderMode = "flat";
    this.definition = "standard";
    this.isMipMappingOn = false;
    this.creaseAngle = -180;
    this.sphereMapUrl = "";
    this.showProgressBar = true;
    this.buttonStates = {};
    this.keyStates = {};
    this.mouseY = this.mouseX = 0;
    this.isTouchHeld = false;
    this.baseZoomFactor = 1;
    this.afterupdate = this.beforeupdate = this.onmousewheel = this.onmousemove = this.onmouseup = this.onmousedown = this.onloadingerror = this.onloadingaborted = this.onloadingprogress = this.onloadingcomplete = this.onloadingstarted = null;
    this.mouseUsage = "default";
    this.isDefaultInputHandlerEnabled =
      true;
    this.webglBackend = this.messagePanel = this.progressRectangle = this.progressFrame = null;
    var e = this;
    if (JSC3D.PlatformInfo.isTouchDevice)
      if (JSC3D.Hammer) JSC3D.Hammer(this.canvas).on("touch release hold drag pinch", function(d) {
        e.gestureHandler(d)
      });
      else {
        this.canvas.addEventListener("touchstart", function(d) {
          e.touchStartHandler(d)
        }, false);
        this.canvas.addEventListener("touchend", function(d) {
          e.touchEndHandler(d)
        }, false);
        this.canvas.addEventListener("touchmove", function(d) {
          e.touchMoveHandler(d)
        }, false)
      } else {
      this.canvas.addEventListener("mousedown",
        function(d) {
          e.mouseDownHandler(d)
        }, false);
      this.canvas.addEventListener("mouseup", function(d) {
        e.mouseUpHandler(d)
      }, false);
      this.canvas.addEventListener("mousemove", function(d) {
        e.mouseMoveHandler(d)
      }, false);
      this.canvas.addEventListener(JSC3D.PlatformInfo.browser == "firefox" ? "DOMMouseScroll" : "mousewheel", function(d) {
        e.mouseWheelHandler(d)
      }, false);
      document.addEventListener("keydown", function(d) {
        e.keyDownHandler(d)
      }, false);
      document.addEventListener("keyup", function(d) {
        e.keyUpHandler(d)
      }, false)
    }
  };
  a = JSC3D.Viewer.prototype;
  a.setParameter = function(b, c) {
    this.params[b] = c
  };
  a.init = function() {
    this.sceneUrl = this.params.SceneUrl;
    this.initRotX = parseFloat(this.params.InitRotationX);
    this.initRotY = parseFloat(this.params.InitRotationY);
    this.initRotZ = parseFloat(this.params.InitRotationZ);
    this.modelColor = parseInt("0x" + this.params.ModelColor.substring(1));
    this.bkgColor1 = parseInt("0x" + this.params.BackgroundColor1.substring(1));
    this.bkgColor2 = parseInt("0x" + this.params.BackgroundColor2.substring(1));
    this.bkgImageUrl = this.params.BackgroundImageUrl;
    this.renderMode = this.params.RenderMode.toLowerCase();
    this.definition = this.params.Definition.toLowerCase();
    this.creaseAngle = parseFloat(this.params.CreaseAngle);
    this.isMipMappingOn = this.params.MipMapping.toLowerCase() == "on";
    this.sphereMapUrl = this.params.SphereMapUrl;
    this.showProgressBar = this.params.ProgressBar.toLowerCase() == "on";
    this.useWebGL = this.params.Renderer.toLowerCase() == "webgl";
    this.releaseLocalBuffers = this.params.LocalBuffers.toLowerCase() == "release";
    if (this.useWebGL && JSC3D.PlatformInfo.supportWebGL && JSC3D.WebGLRenderBackend) try {
      this.webglBackend =
        new JSC3D.WebGLRenderBackend(this.canvas, this.releaseLocalBuffers)
    } catch (b) {}
    if (!this.webglBackend) {
      this.useWebGL && JSC3D.console && JSC3D.console.logWarning("WebGL is not available. Software rendering is enabled instead.");
      try {
        this.ctx2d = this.canvas.getContext("2d");
        this.canvasData = this.ctx2d.getImageData(0, 0, this.canvas.width, this.canvas.height)
      } catch (c) {
        this.canvasData = this.ctx2d = null
      }
    }
    if (this.canvas.width <= 2 || this.canvas.height <= 2) this.definition = "standard";
    switch (this.definition) {
      case "low":
        this.frameWidth = ~~((this.canvas.width + 1) / 2);
        this.frameHeight = ~~((this.canvas.height + 1) / 2);
        break;
      case "high":
        this.frameWidth = this.canvas.width * 2;
        this.frameHeight = this.canvas.height * 2;
        break;
      case "standard":
      default:
        this.frameWidth = this.canvas.width;
        this.frameHeight = this.canvas.height;
        break
    }
    this.zoomFactor = 1;
    this.panning = [0, 0];
    this.rotMatrix.identity();
    this.transformMatrix.identity();
    this.needRepaint = this.needUpdate = this.isFailed = this.isLoaded = false;
    this.scene = null;
    this.defaultMaterial = new JSC3D.Material;
    this.defaultMaterial.ambientColor =
      0;
    this.defaultMaterial.diffuseColor = this.modelColor;
    this.defaultMaterial.transparency = 0;
    this.defaultMaterial.simulateSpecular = true;
    if (!this.webglBackend) {
      this.colorBuffer = new Array(this.frameWidth * this.frameHeight);
      this.zBuffer = new Array(this.frameWidth * this.frameHeight);
      this.selectionBuffer = new Array(this.frameWidth * this.frameHeight);
      this.bkgColorBuffer = new Array(this.frameWidth * this.frameHeight)
    }
    this.generateBackground();
    this.drawBackground();
    var e = this;
    (function d() {
      e.doUpdate();
      setTimeout(d, 30)
    })();
    this.setBackgroudImageFromUrl(this.bkgImageUrl);
    this.loadScene();
    this.setSphereMapFromUrl(this.sphereMapUrl)
  };
  a.update = function(b) {
    if (!this.isFailed)
      if (b) this.needRepaint = true;
      else this.needUpdate = true
  };
  a.rotate = function(b, c, e) {
    this.rotMatrix.rotateAboutXAxis(b);
    this.rotMatrix.rotateAboutYAxis(c);
    this.rotMatrix.rotateAboutZAxis(e)
  };
  a.setRenderMode = function(b) {
    this.renderMode = this.params.RenderMode = b
  };
  a.setDefinition = function(b) {
    if (this.canvas.width <= 2 || this.canvas.height <= 2) b = "standard";
    if (b != this.definition) {
      this.definition = this.params.Definition = b;
      b = this.frameWidth;
      switch (this.definition) {
        case "low":
          this.frameWidth = ~~((this.canvas.width + 1) / 2);
          this.frameHeight = ~~((this.canvas.height + 1) / 2);
          break;
        case "high":
          this.frameWidth = this.canvas.width * 2;
          this.frameHeight = this.canvas.height * 2;
          break;
        case "standard":
        default:
          this.frameWidth = this.canvas.width;
          this.frameHeight = this.canvas.height;
          break
      }
      b = this.frameWidth /
        b;
      this.zoomFactor *= b;
      this.panning[0] *= b;
      this.panning[1] *= b;
      if (!this.webglBackend) {
        b = this.frameWidth * this.frameHeight;
        if (this.colorBuffer.length < b) this.colorBuffer = new Array(b);
        if (this.zBuffer.length < b) this.zBuffer = new Array(b);
        if (this.selectionBuffer.length < b) this.selectionBuffer = new Array(b);
        if (this.bkgColorBuffer.length < b) this.bkgColorBuffer = new Array(b);
        this.generateBackground()
      }
    }
  };
  a.setBackgroudImageFromUrl = function(b) {
    this.bkgImageUrl = this.params.BackgroundImageUrl = b;
    if (b == "") this.bkgImage = null;
    else {
      var c = this,
        e = new Image;
      e.onload = function() {
        c.bkgImage = this;
        c.generateBackground()
      };
      e.src = b
    }
  };
  a.setSphereMapFromUrl = function(b) {
    this.sphereMapUrl = this.params.SphereMapUrl = b;
    if (b == "") this.sphereMap = null;
    else {
      var c = this,
        e = new JSC3D.Texture;
      e.onready = function() {
        c.sphereMap = e;
        c.update()
      };
      e.createFromUrl(this.sphereMapUrl)
    }
  };
  a.enableDefaultInputHandler = function(b) {
    this.isDefaultInputHandlerEnabled = b
  };
  a.setMouseUsage = function(b) {
    this.mouseUsage = b
  };
  a.isWebGLEnabled = function() {
    return this.webglBackend != null
  };
  a.replaceSceneFromUrl = function(b) {
    this.sceneUrl = this.params.SceneUrl = b;
    this.isFailed = this.isLoaded = false;
    this.loadScene()
  };
  a.replaceScene = function(b) {
    this.sceneUrl = this.params.SceneUrl = "";
    this.isFailed = false;
    this.isLoaded = true;
    this.setupScene(b)
  };
  a.resetScene = function() {
    var b = !this.scene || this.scene.isEmpty() ? 0 : this.scene.aabb.lengthOfDiagonal();
    this.zoomFactor = b == 0 ? 1 : (this.frameWidth < this.frameHeight ? this.frameWidth : this.frameHeight) / b;
    this.panning = [0, 0];
    this.rotMatrix.identity();
    this.rotMatrix.rotateAboutXAxis(this.initRotX);
    this.rotMatrix.rotateAboutYAxis(this.initRotY);
    this.rotMatrix.rotateAboutZAxis(this.initRotZ)
  };
  a.getScene = function() {
    return this.scene
  };
  a.pick = function(b, c) {
    var e = new JSC3D.PickInfo,
      d = this.canvas.getBoundingClientRect();
    b = b - d.left;
    d = c - d.top;
    e.canvasX = b;
    e.canvasY = d;
    c = 0;
    if (this.webglBackend) c = this.webglBackend.pick(b, d);
    else {
      var f = b,
        g = d;
      if (this.selectionBuffer != null && b >= 0 && b < this.canvas.width && d >= 0 && d < this.canvas.height) {
        switch (this.definition) {
          case "low":
            f = ~~(f / 2);
            g = ~~(g / 2);
            break;
          case "high":
            f *= 2;
            g *= 2;
            break;
          case "standard":
          default:
            break
        }
        c = this.selectionBuffer[g * this.frameWidth + f];
        if (c > 0) e.depth = this.zBuffer[g * this.frameWidth + f]
      }
    }
    if (c >
      0) {
      b = this.scene.getChildren();
      for (d = 0; d < b.length; d++)
        if (b[d].internalId == c) {
          e.mesh = b[d];
          break
        }
    }
    return e
  };
  a.doUpdate = function() {
    if (this.needUpdate || this.needRepaint) {
      this.beforeupdate != null && typeof this.beforeupdate == "function" && this.beforeupdate();
      if (this.scene) {
        if (this.needUpdate) {
          this.beginScene();
          this.render();
          this.endScene()
        }
        this.paint()
      } else this.drawBackground();
      this.needUpdate = this.needRepaint = false;
      this.afterupdate != null && typeof this.afterupdate == "function" && this.afterupdate()
    }
  };
  a.paint = function() {
    this.webglBackend || !this.ctx2d || this.ctx2d.putImageData(this.canvasData, 0, 0)
  };
  a.mouseDownHandler = function(b) {
    if (this.isLoaded) {
      if (this.onmousedown) {
        var c = this.pick(b.clientX, b.clientY);
        this.onmousedown(c.canvasX, c.canvasY, b.button, c.depth, c.mesh)
      }
      b.preventDefault();
      b.stopPropagation();
      if (this.isDefaultInputHandlerEnabled) {
        this.buttonStates[b.button] = true;
        this.mouseX = b.clientX;
        this.mouseY = b.clientY
      }
    }
  };
  a.mouseUpHandler = function(b) {
    if (this.isLoaded) {
      if (this.onmouseup) {
        var c = this.pick(b.clientX, b.clientY);
        this.onmouseup(c.canvasX, c.canvasY, b.button, c.depth, c.mesh)
      }
      b.preventDefault();
      b.stopPropagation();
      if (this.isDefaultInputHandlerEnabled) this.buttonStates[b.button] = false
    }
  };
  a.mouseMoveHandler = function(b) {
    if (this.isLoaded) {
      if (this.onmousemove) {
        var c = this.pick(b.clientX, b.clientY);
        this.onmousemove(c.canvasX, c.canvasY, b.button, c.depth, c.mesh)
      }
      b.preventDefault();
      b.stopPropagation();
      if (this.isDefaultInputHandlerEnabled) {
        c = this.keyStates[16] == true;
        var e = this.keyStates[17] == true;
        if (this.buttonStates[0] == true) {
          if (c && this.mouseUsage == "default" || this.mouseUsage == "zoom") this.zoomFactor *= this.mouseY <= b.clientY ? 1.04 : 0.96;
          else if (e && this.mouseUsage == "default" || this.mouseUsage == "pan") {
            c =
              this.definition == "low" ? 0.5 : this.definition == "high" ? 2 : 1;
            this.panning[0] += c * (b.clientX - this.mouseX);
            this.panning[1] += c * (b.clientY - this.mouseY)
          } else if (this.mouseUsage == "default" || this.mouseUsage == "rotate") {
            c = (b.clientX - this.mouseX) * 360 / this.canvas.height;
            this.rotMatrix.rotateAboutXAxis((b.clientY - this.mouseY) * 360 / this.canvas.width);
            this.rotMatrix.rotateAboutYAxis(c)
          }
          this.mouseX = b.clientX;
          this.mouseY = b.clientY;
          this.update()
        }
      }
    }
  };
  a.mouseWheelHandler = function(b) {
    if (this.isLoaded) {
      if (this.onmousewheel) {
        var c = this.pick(b.clientX, b.clientY);
        this.onmousewheel(c.canvasX, c.canvasY, b.button, c.depth, c.mesh)
      }
      b.preventDefault();
      b.stopPropagation();
      if (this.isDefaultInputHandlerEnabled) {
        this.zoomFactor *= (JSC3D.PlatformInfo.browser == "firefox" ? -b.detail : b.wheelDelta) < 0 ? 1.1 : 0.91;
        this.update()
      }
    }
  };
  a.touchStartHandler = function(b) {
    if (this.isLoaded)
      if (b.touches.length > 0) {
        var c = b.touches[0].clientX,
          e = b.touches[0].clientY;
        if (this.onmousedown) {
          var d = this.pick(c, e);
          this.onmousedown(d.canvasX, d.canvasY, 0, d.depth, d.mesh)
        }
        b.preventDefault();
        b.stopPropagation();
        if (this.isDefaultInputHandlerEnabled) {
          this.buttonStates[0] = true;
          this.mouseX = c;
          this.mouseY = e
        }
      }
  };
  a.touchEndHandler = function(b) {
    if (this.isLoaded) {
      if (this.onmouseup) {
        var c = this.pick(this.mouseX, this.mouseY);
        this.onmouseup(c.canvasX, c.canvasY, 0, c.depth, c.mesh)
      }
      b.preventDefault();
      b.stopPropagation();
      if (this.isDefaultInputHandlerEnabled) this.buttonStates[0] = false
    }
  };
  a.touchMoveHandler = function(b) {
    if (this.isLoaded)
      if (b.touches.length > 0) {
        var c = b.touches[0].clientX,
          e = b.touches[0].clientY;
        if (this.onmousemove) {
          var d = this.pick(c, e);
          this.onmousemove(d.canvasX, d.canvasY, 0, d.depth, d.mesh)
        }
        b.preventDefault();
        b.stopPropagation();
        if (this.isDefaultInputHandlerEnabled) {
          if (this.mouseUsage == "zoom") this.zoomFactor *= this.mouseY <= e ? 1.04 : 0.96;
          else if (this.mouseUsage == "pan") {
            b = this.definition == "low" ? 0.5 : this.definition == "high" ? 2 : 1;
            this.panning[0] += b * (c - this.mouseX);
            this.panning[1] +=
              b * (e - this.mouseY)
          } else if (this.mouseUsage == "default" || this.mouseUsage == "rotate") {
            b = (c - this.mouseX) * 360 / this.canvas.height;
            this.rotMatrix.rotateAboutXAxis((e - this.mouseY) * 360 / this.canvas.width);
            this.rotMatrix.rotateAboutYAxis(b)
          }
          this.mouseX = c;
          this.mouseY = e;
          this.update()
        }
      }
  };
  a.keyDownHandler = function(b) {
    if (this.isDefaultInputHandlerEnabled) this.keyStates[b.keyCode] = true
  };
  a.keyUpHandler = function(b) {
    if (this.isDefaultInputHandlerEnabled) this.keyStates[b.keyCode] = false
  };
  a.gestureHandler = function(b) {
    if (this.isLoaded) {
      var c = b.gesture.center.pageX - document.body.scrollLeft,
        e = b.gesture.center.pageY - document.body.scrollTop,
        d = this.pick(c, e);
      switch (b.type) {
        case "touch":
          this.onmousedown && this.onmousedown(d.canvasX, d.canvasY, 0, d.depth, d.mesh);
          this.baseZoomFactor = this.zoomFactor;
          this.mouseX = c;
          this.mouseY = e;
          break;
        case "release":
          this.onmouseup && this.onmouseup(d.canvasX, d.canvasY, 0, d.depth, d.mesh);
          this.isTouchHeld = false;
          break;
        case "hold":
          this.isTouchHeld = true;
          break;
        case "drag":
          this.onmousemove &&
            this.onmousemove(d.canvasX, d.canvasY, 0, d.depth, d.mesh);
          if (!this.isDefaultInputHandlerEnabled) break;
          if (this.isTouchHeld) {
            d = this.definition == "low" ? 0.5 : this.definition == "high" ? 2 : 1;
            this.panning[0] += d * (c - this.mouseX);
            this.panning[1] += d * (e - this.mouseY)
          } else {
            d = (c - this.mouseX) * 360 / this.canvas.height;
            this.rotMatrix.rotateAboutXAxis((e - this.mouseY) * 360 / this.canvas.width);
            this.rotMatrix.rotateAboutYAxis(d)
          }
          this.mouseX = c;
          this.mouseY = e;
          this.update();
          break;
        case "pinch":
          this.onmousewheel && this.onmousewheel(d.canvasX,
            d.canvasY, 0, d.depth, d.mesh);
          if (!this.isDefaultInputHandlerEnabled) break;
          this.zoomFactor = this.baseZoomFactor * b.gesture.scale;
          this.update();
          break;
        default:
          break
      }
      b.gesture.preventDefault();
      b.gesture.stopPropagation()
    }
  };
  a.loadScene = function() {
    this.abortUnfinishedLoadingFn && this.abortUnfinishedLoadingFn();
    this.scene = null;
    this.isLoaded = false;
    this.update();
    if (this.sceneUrl == "") return false;
    var b = this.sceneUrl.lastIndexOf("/");
    if (b == -1) b = this.sceneUrl.lastIndexOf("\\");
    b = this.sceneUrl.substring(b + 1);
    var c = b.lastIndexOf(".");
    if (c == -1) {
      JSC3D.console && JSC3D.console.logError("Cannot get file format for the lack of file extension.");
      return false
    }
    b = b.substring(c + 1);
    var e = JSC3D.LoaderSelector.getLoader(b);
    if (!e) {
      JSC3D.console &&
        JSC3D.console.logError('Unknown file format: "' + b + '".');
      return false
    }
    var d = this;
    e.onload = function(f) {
      d.abortUnfinishedLoadingFn = null;
      d.setupScene(f);
      d.onloadingcomplete && typeof d.onloadingcomplete == "function" && d.onloadingcomplete()
    };
    e.onerror = function(f) {
      d.scene = null;
      d.isLoaded = false;
      d.isFailed = true;
      d.abortUnfinishedLoadingFn = null;
      d.update();
      d.reportError(f);
      d.onloadingerror && typeof d.onloadingerror == "function" && d.onloadingerror(f)
    };
    e.onprogress = function(f, g) {
      d.showProgressBar && d.reportProgress(f,
        g);
      d.onloadingprogress && typeof d.onloadingprogress == "function" && d.onloadingprogress(f, g)
    };
    e.onresource = function(f) {
      f instanceof JSC3D.Texture && d.isMipMappingOn && !f.hasMipmap() && f.generateMipmaps();
      d.update()
    };
    this.abortUnfinishedLoadingFn = function() {
      e.abort();
      d.abortUnfinishedLoadingFn = null;
      d.hideProgress();
      d.onloadingaborted && typeof d.onloadingaborted == "function" && d.onloadingaborted()
    };
    e.loadFromUrl(this.sceneUrl);
    this.onloadingstarted && typeof this.onloadingstarted == "function" && this.onloadingstarted();
    return true
  };
  a.setupScene = function(b) {
    if (this.creaseAngle >= 0) {
      var c = this.creaseAngle;
      b.forEachChild(function(g) {
        g.creaseAngle = c
      })
    }
    b.init();
    if (!b.isEmpty()) {
      var e = b.aabb.lengthOfDiagonal(),
        d = this.frameWidth,
        f = this.frameHeight;
      this.zoomFactor = e == 0 ? 1 : (d < f ? d : f) / e;
      this.panning = [0, 0]
    }
    this.rotMatrix.identity();
    this.rotMatrix.rotateAboutXAxis(this.initRotX);
    this.rotMatrix.rotateAboutYAxis(this.initRotY);
    this.rotMatrix.rotateAboutZAxis(this.initRotZ);
    this.scene = b;
    this.isLoaded = true;
    this.needRepaint = this.needUpdate = this.isFailed =
      false;
    this.update();
    this.hideProgress();
    this.hideError()
  };
  a.reportProgress = function(b, c) {
    if (!this.progressFrame) {
      var e = this.canvas.getBoundingClientRect(),
        d = "rgb(" + (255 - ((this.bkgColor1 & 16711680) >> 16)) + "," + (255 - ((this.bkgColor1 & 65280) >> 8)) + "," + (255 - (this.bkgColor1 & 255)) + ")",
        f = e.left + 40,
        g = e.top + e.height * 0.38;
      e = e.width - (f - e.left) * 2;
      this.progressFrame = document.createElement("div");
      this.progressFrame.style.position = "absolute";
      this.progressFrame.style.left = f + "px";
      this.progressFrame.style.top = g + "px";
      this.progressFrame.style.width = e + "px";
      this.progressFrame.style.height =
        "20px";
      this.progressFrame.style.border = "1px solid " + d;
      this.progressFrame.style.pointerEvents = "none";
      document.body.appendChild(this.progressFrame);
      this.progressRectangle = document.createElement("div");
      this.progressRectangle.style.position = "absolute";
      this.progressRectangle.style.left = f + 3 + "px";
      this.progressRectangle.style.top = g + 3 + "px";
      this.progressRectangle.style.width = "0px";
      this.progressRectangle.style.height = "16px";
      this.progressRectangle.style.background = d;
      this.progressRectangle.style.pointerEvents =
        "none";
      document.body.appendChild(this.progressRectangle);
      if (!this.messagePanel) {
        this.messagePanel = document.createElement("div");
        this.messagePanel.style.position = "absolute";
        this.messagePanel.style.left = f + "px";
        this.messagePanel.style.top = g - 16 + "px";
        this.messagePanel.style.width = e + "px";
        this.messagePanel.style.height = "14px";
        this.messagePanel.style.font = "bold 14px Courier New";
        this.messagePanel.style.color = d;
        this.messagePanel.style.pointerEvents = "none";
        document.body.appendChild(this.messagePanel)
      }
    }
    if (this.progressFrame.style.display !=
      "block") {
      this.progressFrame.style.display = "block";
      this.progressRectangle.style.display = "block"
    }
    if (b && this.messagePanel.style.display != "block") this.messagePanel.style.display = "block";
    this.progressRectangle.style.width = (parseFloat(this.progressFrame.style.width) - 4) * c + "px";
    this.messagePanel.innerHTML = b
  };
  a.hideProgress = function() {
    if (this.progressFrame) {
      this.messagePanel.style.display = "none";
      this.progressFrame.style.display = "none";
      this.progressRectangle.style.display = "none"
    }
  };
  a.reportError = function(b) {
    if (!this.messagePanel) {
      var c = this.canvas.getBoundingClientRect(),
        e = "rgb(" + (255 - ((this.bkgColor1 & 16711680) >> 16)) + "," + (255 - ((this.bkgColor1 & 65280) >> 8)) + "," + (255 - (this.bkgColor1 & 255)) + ")",
        d = c.left + 40,
        f = c.top + c.height * 0.38;
      c = c.width - (d - c.left) * 2;
      this.messagePanel = document.createElement("div");
      this.messagePanel.style.position = "absolute";
      this.messagePanel.style.left = d + "px";
      this.messagePanel.style.top = f - 16 + "px";
      this.messagePanel.style.width = c + "px";
      this.messagePanel.style.height =
        "14px";
      this.messagePanel.style.font = "bold 14px Courier New";
      this.messagePanel.style.color = e;
      this.messagePanel.style.pointerEvents = "none";
      document.body.appendChild(this.messagePanel)
    }
    if (this.progressFrame.style.display != "none") {
      this.progressFrame.style.display = "none";
      this.progressRectangle.style.display = "none"
    }
    if (b && this.messagePanel.style.display != "block") this.messagePanel.style.display = "block";
    this.messagePanel.innerHTML = b
  };
  a.hideError = function() {
    if (this.messagePanel) this.messagePanel.style.display = "none"
  };
  a.generateBackground = function() {
    if (this.webglBackend) this.bkgImage ? this.webglBackend.setBackgroundImage(this.bkgImage) : this.webglBackend.setBackgroundColors(this.bkgColor1, this.bkgColor2);
    else this.bkgImage ? this.fillBackgroundWithImage() : this.fillGradientBackground()
  };
  a.fillGradientBackground = function() {
    for (var b = this.frameWidth, c = this.frameHeight, e = this.bkgColorBuffer, d = (this.bkgColor1 & 16711680) >> 16, f = (this.bkgColor1 & 65280) >> 8, g = this.bkgColor1 & 255, h = (this.bkgColor2 & 16711680) >> 16, i = (this.bkgColor2 & 65280) >> 8, l = this.bkgColor2 & 255, o = 0, u = 0; u < c; u++)
      for (var j = d + u * (h - d) / c & 255, B = f + u * (i - f) / c & 255, m = g + u * (l - g) / c & 255, M = 0; M < b; M++) e[o++] = j << 16 | B << 8 | m
  };
  a.fillBackgroundWithImage = function() {
    var b = this.frameWidth,
      c = this.frameHeight;
    if (!(this.bkgImage.width <= 0 || this.bkgImage.height <= 0)) {
      var e = false,
        d = JSC3D.Texture.cv;
      if (!d) try {
        d = document.createElement("canvas");
        JSC3D.Texture.cv = d;
        e = true
      } catch (f) {
        return
      }
      if (d.width != b || d.height != c) {
        d.width = b;
        d.height = c;
        e = true
      }
      var g = null;
      try {
        var h = d.getContext("2d");
        e || h.clearRect(0, 0, b, c);
        h.drawImage(this.bkgImage, 0, 0, b, c);
        g = h.getImageData(0, 0, b, c).data
      } catch (i) {
        return
      }
      e = this.bkgColorBuffer;
      b = b * c;
      for (d = c = 0; c < b; c++, d +=
        4) e[c] = g[d] << 16 | g[d + 1] << 8 | g[d + 2]
    }
  };
  a.drawBackground = function() {
    if (this.webglBackend || this.ctx2d) {
      this.beginScene();
      this.endScene();
      this.paint()
    }
  };
  a.beginScene = function() {
    if (this.webglBackend) this.webglBackend.beginFrame(this.definition);
    else
      for (var b = this.colorBuffer, c = this.zBuffer, e = this.selectionBuffer, d = this.bkgColorBuffer, f = this.frameWidth * this.frameHeight, g = -Number.MAX_VALUE, h = 0; h < f; h++) {
        b[h] = d[h];
        c[h] = g;
        e[h] = 0
      }
  };
  a.endScene = function() {
    if (this.webglBackend) this.webglBackend.endFrame();
    else {
      var b = this.canvasData.data,
        c = this.canvas.width,
        e = this.canvas.height,
        d = this.colorBuffer,
        f = this.frameWidth,
        g = f * this.frameHeight;
      switch (this.definition) {
        case "low":
          var h = c >> 1,
            i = f - h,
            l = 0,
            o = 0;
          for (g = 0; g < e; g++) {
            for (var u = 0; u < c; u++) {
              f = d[l];
              b[o] = (f & 16711680) >> 16;
              b[o + 1] = (f & 65280) >> 8;
              b[o + 2] = f & 255;
              b[o + 3] = 255;
              l += u & 1;
              o += 4
            }
            l += g & 1 ? i : -h
          }
          break;
        case "high":
          for (g = o = l = 0; g < e; g++) {
            for (u = 0; u < c; u++) {
              h = d[l];
              i = d[l + 1];
              var j = d[l + f],
                B = d[l + f + 1];
              b[o] = (h &
                16711680) + (i & 16711680) + (j & 16711680) + (B & 16711680) >> 18;
              b[o + 1] = (h & 65280) + (i & 65280) + (j & 65280) + (B & 65280) >> 10;
              b[o + 2] = (h & 255) + (i & 255) + (j & 255) + (B & 255) >> 2;
              b[o + 3] = 255;
              l += 2;
              o += 4
            }
            l += f
          }
          break;
        case "standard":
        default:
          for (o = l = 0; l < g; l++, o += 4) {
            f = d[l];
            b[o] = (f & 16711680) >> 16;
            b[o + 1] = (f & 65280) >> 8;
            b[o + 2] = f & 255;
            b[o + 3] = 255
          }
          break
      }
    }
  };
  a.render = function() {
    if (!this.scene.isEmpty()) {
      var b = this.scene.aabb;
      if (this.webglBackend) {
        var c = this.frameWidth,
          e = this.frameHeight,
          d = b.lengthOfDiagonal(),
          f = c / e;
        this.transformMatrix.identity();
        this.transformMatrix.translate(-(b.minX + b.maxX) / 2, -(b.minY + b.maxY) / 2, -(b.minZ + b.maxZ) / 2);
        this.transformMatrix.multiply(this.rotMatrix);
        c < e ? this.transformMatrix.scale(2 * this.zoomFactor / c, 2 * this.zoomFactor * f / c, -2 / d) : this.transformMatrix.scale(2 * this.zoomFactor / (e * f), 2 * this.zoomFactor / e, -2 / d);
        this.transformMatrix.translate(2 *
          this.panning[0] / c, -2 * this.panning[1] / e, 0)
      } else {
        this.transformMatrix.identity();
        this.transformMatrix.translate(-(b.minX + b.maxX) / 2, -(b.minY + b.maxY) / 2, -(b.minZ + b.maxZ) / 2);
        this.transformMatrix.multiply(this.rotMatrix);
        this.transformMatrix.scale(this.zoomFactor, -this.zoomFactor, this.zoomFactor);
        this.transformMatrix.translate(this.frameWidth / 2 + this.panning[0], this.frameHeight / 2 + this.panning[1], 0)
      }
      b = this.sortScene(this.transformMatrix);
      if (this.webglBackend) this.webglBackend.render(this.scene.getChildren(),
        this.transformMatrix, this.rotMatrix, this.renderMode, this.defaultMaterial, this.sphereMap);
      else
        for (c = 0; c < b.length; c++) {
          e = b[c];
          if (!e.isTrivial()) {
            JSC3D.Math3D.transformVectors(this.transformMatrix, e.vertexBuffer, e.transformedVertexBuffer);
            if (e.visible) switch (e.renderMode || this.renderMode) {
              case "point":
                this.renderPoint(e);
                break;
              case "wireframe":
                this.renderWireframe(e);
                break;
              case "flat":
                this.renderSolidFlat(e);
                break;
              case "smooth":
                this.renderSolidSmooth(e);
                break;
              case "texture":
                e.hasTexture() ? this.renderSolidTexture(e) :
                  this.renderSolidFlat(e);
                break;
              case "textureflat":
                e.hasTexture() ? this.renderTextureFlat(e) : this.renderSolidFlat(e);
                break;
              case "texturesmooth":
                if (e.isEnvironmentCast && this.sphereMap != null && this.sphereMap.hasData()) this.renderSolidSphereMapped(e);
                else e.hasTexture() ? this.renderTextureSmooth(e) : this.renderSolidSmooth(e);
                break;
              default:
                this.renderSolidFlat(e);
                break
            }
          }
        }
    }
  };
  a.sortScene = function(b) {
    for (var c = [], e = this.scene.getChildren(), d = 0; d < e.length; d++) {
      var f = e[d];
      if (!f.isTrivial()) {
        c.push(f);
        var g = f.aabb.center();
        JSC3D.Math3D.transformVectors(b, g, g);
        f.sortKey = {
          depth: g[2],
          isTransparnt: (f.material ? f.material : this.defaultMaterial).transparency > 0 || (f.hasTexture() ? f.texture.hasTransparency : false)
        }
      }
    }
    c.sort(function(h, i) {
      if (!h.sortKey.isTransparnt && i.sortKey.isTransparnt) return -1;
      if (h.sortKey.isTransparnt && !i.sortKey.isTransparnt) return 1;
      if (h.sortKey.isTransparnt) return h.sortKey.depth -
        i.sortKey.depth;
      return i.sortKey.depth - h.sortKey.depth
    });
    return c
  };
  a.renderPoint = function(b) {
    var c = this.frameWidth,
      e = c - 1,
      d = this.frameHeight - 1,
      f = b.transformedVertexBuffer,
      g = this.colorBuffer,
      h = this.zBuffer,
      i = this.selectionBuffer,
      l = f.length / 3,
      o = b.internalId;
    b = b.material ? b.material.diffuseColor : this.defaultMaterial.diffuseColor;
    for (var u = 0, j = 0; u < l; u++, j += 3) {
      var B = ~~(f[j] + 0.5),
        m = ~~(f[j + 1] + 0.5),
        M = f[j + 2];
      if (B >= 0 && B < e && m >= 0 && m < d) {
        B = m * c + B;
        if (M > h[B]) {
          h[B] = M;
          g[B] = b;
          i[B] = o
        }
        B++;
        if (M > h[B]) {
          h[B] = M;
          g[B] = b;
          i[B] = o
        }
        B += e;
        if (M > h[B]) {
          h[B] = M;
          g[B] = b;
          i[B] = o
        }
        B++;
        if (M > h[B]) {
          h[B] = M;
          g[B] = b;
          i[B] = o
        }
      }
    }
  };
  a.renderWireframe = function(b) {
    var c = this.frameWidth,
      e = c - 1,
      d = this.frameHeight - 1,
      f = b.indexBuffer,
      g = b.transformedVertexBuffer,
      h = b.transformedFaceNormalZBuffer,
      i = this.colorBuffer,
      l = this.zBuffer,
      o = this.selectionBuffer,
      u = b.faceCount,
      j = b.internalId,
      B = b.material ? b.material.diffuseColor : this.defaultMaterial.diffuseColor;
    if (!h || h.length < u) {
      b.transformedFaceNormalZBuffer = new Array(u);
      h = b.transformedFaceNormalZBuffer
    }
    JSC3D.Math3D.transformVectorZs(this.rotMatrix, b.faceNormalBuffer, h);
    for (var m = 0, M = 0; m < u;) {
      var H =
        h[m++];
      if (b.isDoubleSided) H = H > 0 ? H : -H;
      if (H < 0) {
        do; while (f[M++] != -1)
      } else {
        var x, K;
        x = f[M++] * 3;
        K = f[M++] * 3;
        H = x;
        for (var I = false; !I;) {
          var F = ~~(g[x] + 0.5),
            p = ~~(g[x + 1] + 0.5),
            r = g[x + 2],
            w = ~~(g[K] + 0.5),
            s = ~~(g[K + 1] + 0.5),
            v = g[K + 2],
            k = w - F,
            D = s - p,
            A = v - r,
            t, n, T;
          if (Math.abs(k) > Math.abs(D)) {
            t = k;
            n = k > 0 ? 1 : -1;
            T = k != 0 ? n * D / k : 0;
            k = k != 0 ? n * A / k : 0
          } else {
            t = D;
            T = D > 0 ? 1 : -1;
            n = D != 0 ? T * k / D : 0;
            k = D != 0 ? T * A / D : 0
          }
          F = F;
          p = p;
          r = r;
          if (t < 0) {
            F = w;
            p = s;
            r = v;
            t = -t;
            n = -n;
            T = -T;
            k = -k
          }
          for (w = 0; w < t; w++) {
            if (F >= 0 && F < e && p >= 0 && p < d) {
              s = ~~p * c + ~~F;
              if (r > l[s]) {
                l[s] = r;
                i[s] = B;
                o[s] = j
              }
            }
            F +=
              n;
            p += T;
            r += k
          }
          if (K == H) I = true;
          else {
            x = K;
            K = f[M] != -1 ? f[M++] * 3 : H
          }
        }
        M++
      }
    }
  };
  a.renderSolidFlat = function(b) {
    var c = this.frameWidth,
      e = this.frameHeight,
      d = b.indexBuffer,
      f = b.transformedVertexBuffer,
      g = b.transformedFaceNormalZBuffer,
      h = this.colorBuffer,
      i = this.zBuffer,
      l = this.selectionBuffer,
      o = b.faceCount,
      u = b.internalId,
      j = b.material ? b.material : this.defaultMaterial,
      B = j.getPalette(),
      m = j.transparency == 0,
      M = j.transparency * 255,
      H = 255 - M;
    var fixForMacSafari = 1 * null;
    if (j.transparency != 1) {
      if (!g || g.length < o) {
        b.transformedFaceNormalZBuffer = new Array(o);
        g = b.transformedFaceNormalZBuffer
      }
      JSC3D.Math3D.transformVectorZs(this.rotMatrix, b.faceNormalBuffer,
        g);
      j = new Array(3);
      for (var x = new Array(3), K = new Array(3), I = 0, F = 0; I < o;) {
        var p = g[I++];
        if (b.isDoubleSided) p = p > 0 ? p : -p;
        if (p < 0) {
          do; while (d[F++] != -1)
        } else {
          p = B[~~(p * 255)];
          var r, w, s;
          r = d[F++] * 3;
          w = d[F++] * 3;
          do {
            s = d[F++] * 3;
            j[0] = ~~(f[r] + 0.5);
            x[0] = ~~(f[r + 1] + 0.5);
            K[0] = f[r + 2];
            j[1] = ~~(f[w] + 0.5);
            x[1] = ~~(f[w + 1] + 0.5);
            K[1] = f[w + 2];
            j[2] = ~~(f[s] + 0.5);
            x[2] = ~~(f[s + 1] + 0.5);
            K[2] = f[s + 2];
            w = x[0] < x[1] ? 0 : 1;
            w = x[w] < x[2] ? w : 2;
            var v = x[0] > x[1] ? 0 : 1;
            v = x[v] > x[2] ? v : 2;
            var k = 3 - v - w;
            if (w != v) {
              var D = j[v],
                A = K[v],
                t = x[v] - x[w];
              t = t != 0 ? t : 1;
              var n = (j[v] - j[w]) /
                t;
              t = (K[v] - K[w]) / t;
              var T = j[v],
                y = K[v],
                E = x[v] - x[k];
              E = E != 0 ? E : 1;
              var C = (j[v] - j[k]) / E;
              E = (K[v] - K[k]) / E;
              var q = j[k],
                la = K[k],
                z = x[k] - x[w];
              z = z != 0 ? z : 1;
              var ra = (j[k] - j[w]) / z;
              z = (K[k] - K[w]) / z;
              var ma = x[v] * c;
              for (v = x[v]; v > x[w]; v--) {
                if (v >= 0 && v < e) {
                  var Q = ~~D,
                    V = A,
                    G, sa;
                  if (v > x[k]) {
                    G = ~~T;
                    sa = y
                  } else {
                    G = ~~q;
                    sa = la
                  }
                  if (Q > G) {
                    var da;
                    da = Q;
                    Q = G;
                    G = da;
                    da = V;
                    V = sa;
                    sa = da
                  }
                  if (Q < 0) Q = 0;
                  if (G >= c) G = c - 1;
                  sa = Q != G ? (sa - V) / (G - Q) : 1;
                  da = ma + Q;
                  if (m) {
                    Q = Q;
                    for (V = V; Q <= G; Q++, V += sa) {
                      if (V > i[da]) {
                        i[da] = V;
                        h[da] = p;
                        l[da] = u
                      }
                      da++
                    }
                  } else {
                    Q = Q;
                    for (V = V; Q < G; Q++, V += sa) {
                      if (V > i[da]) {
                        var ya =
                          h[da];
                        h[da] = (ya & 16711680) * M + (p & 16711680) * H >> 8 & 16711680 | (ya & 65280) * M + (p & 65280) * H >> 8 & 65280 | (ya & 255) * M + (p & 255) * H >> 8 & 255;
                        l[da] = u
                      }
                      da++
                    }
                  }
                }
                D -= n;
                A -= t;
                if (v > x[k]) {
                  T -= C;
                  y -= E
                } else {
                  q -= ra;
                  la -= z
                }
                ma -= c
              }
            }
            w = s
          } while (d[F] != -1);
          F++
        }
      }
    }
  };
  a.renderSolidSmooth = function(b) {
    var c = this.frameWidth,
      e = this.frameHeight,
      d = b.indexBuffer,
      f = b.transformedVertexBuffer,
      g = b.transformedVertexNormalZBuffer,
      h = b.vertexNormalIndexBuffer ? b.vertexNormalIndexBuffer : b.indexBuffer,
      i = b.transformedFaceNormalZBuffer,
      l = this.colorBuffer,
      o = this.zBuffer,
      u = this.selectionBuffer,
      j = b.faceCount,
      B = b.internalId,
      m = b.material ? b.material : this.defaultMaterial,
      M = m.getPalette(),
      H = m.transparency == 0,
      x = m.transparency * 255,
      K = 255 - x;
    var fixForMacSafari = 1 * null;
    if (m.transparency != 1) {
      if (!g || g.length < b.vertexNormalBuffer.length /
        3) {
        b.transformedVertexNormalZBuffer = new Array(b.vertexNormalBuffer.length / 3);
        g = b.transformedVertexNormalZBuffer
      }
      if (!i || i.length < j) {
        b.transformedFaceNormalZBuffer = new Array(j);
        i = b.transformedFaceNormalZBuffer
      }
      JSC3D.Math3D.transformVectorZs(this.rotMatrix, b.vertexNormalBuffer, g);
      JSC3D.Math3D.transformVectorZs(this.rotMatrix, b.faceNormalBuffer, i);
      b = b.isDoubleSided;
      m = new Array(3);
      for (var I = new Array(3), F = new Array(3), p = new Array(3), r = 0, w = 0; r < j;) {
        var s = i[r++];
        if (b) s = s > 0 ? s : -s;
        if (s < 0) {
          do; while (d[w++] != -1)
        } else {
          var v, k, D, A, t;
          s = d[w] * 3;
          D = h[w];
          w++;
          k = d[w] * 3;
          A = h[w];
          w++;
          do {
            v = d[w];
            v = v * 3;
            t = h[w];
            w++;
            m[0] = ~~(f[s] + 0.5);
            I[0] = ~~(f[s + 1] + 0.5);
            F[0] = f[s + 2];
            m[1] = ~~(f[k] + 0.5);
            I[1] = ~~(f[k + 1] + 0.5);
            F[1] = f[k + 2];
            m[2] = ~~(f[v] + 0.5);
            I[2] = ~~(f[v + 1] + 0.5);
            F[2] = f[v + 2];
            p[0] = g[D];
            p[1] = g[A];
            p[2] = g[t];
            if (b) {
              if (p[0] < 0) p[0] = -p[0];
              if (p[1] < 0) p[1] = -p[1];
              if (p[2] < 0) p[2] = -p[2]
            }
            k = I[0] < I[1] ? 0 : 1;
            k = I[k] < I[2] ? k : 2;
            var n = I[0] > I[1] ? 0 : 1;
            n = I[n] > I[2] ? n : 2;
            A = 3 - n - k;
            if (k != n) {
              var T = m[n],
                y = F[n],
                E = p[n] * 255,
                C = I[n] - I[k];
              C = C != 0 ? C : 1;
              var q = (m[n] - m[k]) / C,
                la = (F[n] -
                  F[k]) / C;
              C = (p[n] - p[k]) * 255 / C;
              var z = m[n],
                ra = F[n],
                ma = p[n] * 255,
                Q = I[n] - I[A];
              Q = Q != 0 ? Q : 1;
              var V = (m[n] - m[A]) / Q,
                G = (F[n] - F[A]) / Q;
              Q = (p[n] - p[A]) * 255 / Q;
              var sa = m[A],
                da = F[A],
                ya = p[A] * 255,
                ta = I[A] - I[k];
              ta = ta != 0 ? ta : 1;
              var ea = (m[A] - m[k]) / ta,
                Ea = (F[A] - F[k]) / ta;
              ta = (p[A] - p[k]) * 255 / ta;
              var Da = I[n] * c;
              for (n = I[n]; n > I[k]; n--) {
                if (n >= 0 && n < e) {
                  var S = ~~T,
                    Y = y,
                    na = E,
                    oa, ua, ja;
                  if (n > I[A]) {
                    oa = ~~z;
                    ua = ra;
                    ja = ma
                  } else {
                    oa = ~~sa;
                    ua = da;
                    ja = ya
                  }
                  if (S > oa) {
                    var fa;
                    fa = S;
                    S = oa;
                    oa = fa;
                    fa = Y;
                    Y = ua;
                    ua = fa;
                    fa = na;
                    na = ja;
                    ja = fa
                  }
                  ua = S != oa ? (ua - Y) / (oa - S) : 1;
                  ja = S != oa ? (ja - na) /
                    (oa - S) : 1;
                  if (S < 0) {
                    Y -= S * ua;
                    na -= S * ja;
                    S = 0
                  }
                  if (oa >= c) oa = c - 1;
                  fa = Da + S;
                  if (H) {
                    S = S;
                    Y = Y;
                    for (na = na; S <= oa; S++, Y += ua, na += ja) {
                      if (Y > o[fa]) {
                        o[fa] = Y;
                        l[fa] = M[na > 0 ? ~~na : 0];
                        u[fa] = B
                      }
                      fa++
                    }
                  } else {
                    S = S;
                    Y = Y;
                    for (na = na; S < oa; S++, Y += ua, na += ja) {
                      if (Y > o[fa]) {
                        var pa = M[na > 0 ? ~~na : 0],
                          va = l[fa];
                        l[fa] = (va & 16711680) * x + (pa & 16711680) * K >> 8 & 16711680 | (va & 65280) * x + (pa & 65280) * K >> 8 & 65280 | (va & 255) * x + (pa & 255) * K >> 8 & 255;
                        u[fa] = B
                      }
                      fa++
                    }
                  }
                }
                T -= q;
                y -= la;
                E -= C;
                if (n > I[A]) {
                  z -= V;
                  ra -= G;
                  ma -= Q
                } else {
                  sa -= ea;
                  da -= Ea;
                  ya -= ta
                }
                Da -= c
              }
            }
            k = v;
            A = t
          } while (d[w] != -1);
          w++
        }
      }
    }
  };
  a.renderSolidTexture = function(b) {
    var c = this.frameWidth,
      e = this.frameHeight,
      d = b.indexBuffer,
      f = b.transformedVertexBuffer,
      g = b.transformedFaceNormalZBuffer,
      h = this.colorBuffer,
      i = this.zBuffer,
      l = this.selectionBuffer,
      o = b.faceCount,
      u = b.internalId,
      j = b.texture,
      B = !j.hasTransparency,
      m = b.texCoordBuffer,
      M = b.texCoordIndexBuffer ? b.texCoordIndexBuffer : b.indexBuffer,
      H = j.data,
      x = j.width,
      K = x - 1,
      I = j.hasMipmap() ? j.mipmaps : null,
      F = I ? j.mipentries : null;
    var fixForMacSafari = 1 * null;
    if (!g || g.length < o) {
      b.transformedFaceNormalZBuffer = new Array(o);
      g = b.transformedFaceNormalZBuffer
    }
    JSC3D.Math3D.transformVectorZs(this.rotMatrix,
      b.faceNormalBuffer, g);
    for (var p = new Array(3), r = new Array(3), w = new Array(3), s = new Array(3), v = new Array(3), k = 0, D = 0; k < o;) {
      var A = g[k++];
      if (b.isDoubleSided) A = A > 0 ? A : -A;
      if (A < 0) {
        do; while (d[D++] != -1)
      } else {
        var t, n, T, y, E;
        A = d[D] * 3;
        T = M[D] * 2;
        D++;
        t = d[D] * 3;
        y = M[D] * 2;
        D++;
        if (I) {
          n = d[D] * 3;
          E = M[D] * 2;
          x = j.width;
          p[0] = f[A];
          r[0] = f[A + 1];
          p[1] = f[t];
          r[1] = f[t + 1];
          p[2] = f[n];
          r[2] = f[n + 1];
          s[0] = m[T] * x;
          v[0] = m[T + 1] * x;
          s[1] = m[y] * x;
          v[1] = m[y + 1] * x;
          s[2] = m[E] * x;
          v[2] = m[E + 1] * x;
          H = (p[1] - p[0]) * (r[2] - r[0]) - (r[1] - r[0]) * (p[2] - p[0]);
          if (H < 0) H = -H;
          H += 1;
          K =
            (s[1] - s[0]) * (v[2] - v[0]) - (v[1] - v[0]) * (s[2] - s[0]);
          if (K < 0) K = -K;
          H = K / H;
          K = 0;
          if (H < F[1]) K = 0;
          else if (H >= F[F.length - 1]) {
            K = F.length - 1;
            x = 1
          } else
            for (; H >= F[K + 1];) {
              K++;
              x /= 2
            }
          H = I[K];
          K = x - 1
        }
        do {
          n = d[D] * 3;
          E = M[D] * 2;
          D++;
          p[0] = ~~(f[A] + 0.5);
          r[0] = ~~(f[A + 1] + 0.5);
          w[0] = f[A + 2];
          p[1] = ~~(f[t] + 0.5);
          r[1] = ~~(f[t + 1] + 0.5);
          w[1] = f[t + 2];
          p[2] = ~~(f[n] + 0.5);
          r[2] = ~~(f[n + 1] + 0.5);
          w[2] = f[n + 2];
          s[0] = m[T] * x;
          v[0] = m[T + 1] * x;
          s[1] = m[y] * x;
          v[1] = m[y + 1] * x;
          s[2] = m[E] * x;
          v[2] = m[E + 1] * x;
          t = r[0] < r[1] ? 0 : 1;
          t = r[t] < r[2] ? t : 2;
          var C = r[0] > r[1] ? 0 : 1;
          C = r[C] > r[2] ? C : 2;
          y = 3 - C - t;
          if (t !=
            C) {
            var q = p[C],
              la = w[C],
              z = s[C],
              ra = v[C],
              ma = r[C] - r[t];
            ma = ma != 0 ? ma : 1;
            var Q = (p[C] - p[t]) / ma,
              V = (w[C] - w[t]) / ma,
              G = (s[C] - s[t]) / ma;
            ma = (v[C] - v[t]) / ma;
            var sa = p[C],
              da = w[C],
              ya = s[C],
              ta = v[C],
              ea = r[C] - r[y];
            ea = ea != 0 ? ea : 1;
            var Ea = (p[C] - p[y]) / ea,
              Da = (w[C] - w[y]) / ea,
              S = (s[C] - s[y]) / ea;
            ea = (v[C] - v[y]) / ea;
            var Y = p[y],
              na = w[y],
              oa = s[y],
              ua = v[y],
              ja = r[y] - r[t];
            ja = ja != 0 ? ja : 1;
            var fa = (p[y] - p[t]) / ja,
              pa = (w[y] - w[t]) / ja,
              va = (s[y] - s[t]) / ja;
            ja = (v[y] - v[t]) / ja;
            var Fa = r[C] * c;
            for (C = r[C]; C > r[t]; C--) {
              if (C >= 0 && C < e) {
                var aa = ~~q,
                  ga = la,
                  wa = z,
                  O = ra,
                  U, ka, ha, J;
                if (C > r[y]) {
                  U = ~~sa;
                  ka = da;
                  ha = ya;
                  J = ta
                } else {
                  U = ~~Y;
                  ka = na;
                  ha = oa;
                  J = ua
                }
                if (aa > U) {
                  var L;
                  L = aa;
                  aa = U;
                  U = L;
                  L = ga;
                  ga = ka;
                  ka = L;
                  L = wa;
                  wa = ha;
                  ha = L;
                  L = O;
                  O = J;
                  J = L
                }
                ka = aa != U ? (ka - ga) / (U - aa) : 1;
                ha = aa != U ? (ha - wa) / (U - aa) : 1;
                J = aa != U ? (J - O) / (U - aa) : 1;
                if (aa < 0) {
                  ga -= aa * ka;
                  wa -= aa * ha;
                  O -= aa * J;
                  aa = 0
                }
                if (U >= c) U = c - 1;
                L = Fa + aa;
                if (B) {
                  aa = aa;
                  ga = ga;
                  wa = wa;
                  for (O = O; aa <= U; aa++, ga += ka, wa += ha, O += J) {
                    if (ga > i[L]) {
                      i[L] = ga;
                      h[L] = H[(O & K) * x + (wa & K)];
                      l[L] = u
                    }
                    L++
                  }
                } else {
                  aa = aa;
                  ga = ga;
                  wa = wa;
                  for (O = O; aa < U; aa++, ga += ka, wa += ha, O += J) {
                    if (ga > i[L]) {
                      var Z = H[(O & K) * x + (wa & K)],
                        ca = h[L],
                        P = Z >>
                        24 & 255,
                        X = 255 - P;
                      h[L] = (ca & 16711680) * X + (Z & 16711680) * P >> 8 & 16711680 | (ca & 65280) * X + (Z & 65280) * P >> 8 & 65280 | (ca & 255) * X + (Z & 255) * P >> 8 & 255;
                      l[L] = u
                    }
                    L++
                  }
                }
              }
              q -= Q;
              la -= V;
              z -= G;
              ra -= ma;
              if (C > r[y]) {
                sa -= Ea;
                da -= Da;
                ya -= S;
                ta -= ea
              } else {
                Y -= fa;
                na -= pa;
                oa -= va;
                ua -= ja
              }
              Fa -= c
            }
          }
          t = n;
          y = E
        } while (d[D] != -1);
        D++
      }
    }
  };
  a.renderTextureFlat = function(b) {
    var c = this.frameWidth,
      e = this.frameHeight,
      d = b.indexBuffer,
      f = b.transformedVertexBuffer,
      g = b.transformedFaceNormalZBuffer,
      h = this.colorBuffer,
      i = this.zBuffer,
      l = this.selectionBuffer,
      o = b.faceCount,
      u = b.internalId,
      j = b.material ? b.material : this.defaultMaterial,
      B = j.getPalette(),
      m = b.texture,
      M = j.transparency == 0 && !m.hasTransparency,
      H = ~~((1 - j.transparency) * 255),
      x = b.texCoordBuffer,
      K = b.texCoordIndexBuffer ? b.texCoordIndexBuffer : b.indexBuffer,
      I = m.data,
      F = m.width,
      p = F - 1,
      r = m.hasMipmap() ? m.mipmaps :
      null,
      w = r ? m.mipentries : null;
    var fixForMacSafari = 1 * null;
    if (j.transparency != 1) {
      if (!g || g.length < o) {
        b.transformedFaceNormalZBuffer = new Array(o);
        g = b.transformedFaceNormalZBuffer
      }
      JSC3D.Math3D.transformVectorZs(this.rotMatrix, b.faceNormalBuffer, g);
      j = new Array(3);
      for (var s = new Array(3), v = new Array(3), k = new Array(3), D = new Array(3), A = 0, t = 0; A < o;) {
        var n = g[A++];
        if (b.isDoubleSided) n = n > 0 ? n : -n;
        if (n < 0) {
          do; while (d[t++] != -1)
        } else {
          n = B[~~(n * 255)];
          var T, y, E, C, q, la;
          T = d[t] * 3;
          C = K[t] * 2;
          t++;
          y = d[t] * 3;
          q = K[t] * 2;
          t++;
          if (r) {
            E = d[t] * 3;
            la = K[t] * 2;
            F = m.width;
            j[0] =
              f[T];
            s[0] = f[T + 1];
            j[1] = f[y];
            s[1] = f[y + 1];
            j[2] = f[E];
            s[2] = f[E + 1];
            k[0] = x[C] * F;
            D[0] = x[C + 1] * F;
            k[1] = x[q] * F;
            D[1] = x[q + 1] * F;
            k[2] = x[la] * F;
            D[2] = x[la + 1] * F;
            I = (j[1] - j[0]) * (s[2] - s[0]) - (s[1] - s[0]) * (j[2] - j[0]);
            if (I < 0) I = -I;
            I += 1;
            p = (k[1] - k[0]) * (D[2] - D[0]) - (D[1] - D[0]) * (k[2] - k[0]);
            if (p < 0) p = -p;
            I = p / I;
            p = 0;
            if (I < w[1]) p = 0;
            else if (I >= w[w.length - 1]) {
              p = w.length - 1;
              F = 1
            } else
              for (; I >= w[p + 1];) {
                p++;
                F /= 2
              }
            I = r[p];
            p = F - 1
          }
          do {
            E = d[t] * 3;
            la = K[t] * 2;
            t++;
            j[0] = ~~(f[T] + 0.5);
            s[0] = ~~(f[T + 1] + 0.5);
            v[0] = f[T + 2];
            j[1] = ~~(f[y] + 0.5);
            s[1] = ~~(f[y + 1] + 0.5);
            v[1] = f[y +
              2];
            j[2] = ~~(f[E] + 0.5);
            s[2] = ~~(f[E + 1] + 0.5);
            v[2] = f[E + 2];
            k[0] = x[C] * F;
            D[0] = x[C + 1] * F;
            k[1] = x[q] * F;
            D[1] = x[q + 1] * F;
            k[2] = x[la] * F;
            D[2] = x[la + 1] * F;
            y = s[0] < s[1] ? 0 : 1;
            y = s[y] < s[2] ? y : 2;
            var z = s[0] > s[1] ? 0 : 1;
            z = s[z] > s[2] ? z : 2;
            q = 3 - z - y;
            if (y != z) {
              var ra = j[z],
                ma = v[z],
                Q = k[z],
                V = D[z],
                G = s[z] - s[y];
              G = G != 0 ? G : 1;
              var sa = (j[z] - j[y]) / G,
                da = (v[z] - v[y]) / G,
                ya = (k[z] - k[y]) / G;
              G = (D[z] - D[y]) / G;
              var ta = j[z],
                ea = v[z],
                Ea = k[z],
                Da = D[z],
                S = s[z] - s[q];
              S = S != 0 ? S : 1;
              var Y = (j[z] - j[q]) / S,
                na = (v[z] - v[q]) / S,
                oa = (k[z] - k[q]) / S;
              S = (D[z] - D[q]) / S;
              var ua = j[q],
                ja = v[q],
                fa = k[q],
                pa = D[q],
                va = s[q] - s[y];
              va = va != 0 ? va : 1;
              var Fa = (j[q] - j[y]) / va,
                aa = (v[q] - v[y]) / va,
                ga = (k[q] - k[y]) / va;
              va = (D[q] - D[y]) / va;
              var wa = s[z] * c;
              for (z = s[z]; z > s[y]; z--) {
                if (z >= 0 && z < e) {
                  var O = ~~ra,
                    U = ma,
                    ka = Q,
                    ha = V,
                    J, L, Z, ca;
                  if (z > s[q]) {
                    J = ~~ta;
                    L = ea;
                    Z = Ea;
                    ca = Da
                  } else {
                    J = ~~ua;
                    L = ja;
                    Z = fa;
                    ca = pa
                  }
                  if (O > J) {
                    var P;
                    P = O;
                    O = J;
                    J = P;
                    P = U;
                    U = L;
                    L = P;
                    P = ka;
                    ka = Z;
                    Z = P;
                    P = ha;
                    ha = ca;
                    ca = P
                  }
                  L = O != J ? (L - U) / (J - O) : 1;
                  Z = O != J ? (Z - ka) / (J - O) : 1;
                  ca = O != J ? (ca - ha) / (J - O) : 1;
                  if (O < 0) {
                    U -= O * L;
                    ka -= O * Z;
                    ha -= O * ca;
                    O = 0
                  }
                  if (J >= c) J = c - 1;
                  P = wa + O;
                  if (M) {
                    O = O;
                    U = U;
                    ka = ka;
                    for (ha = ha; O <= J; O++, U += L, ka += Z,
                      ha += ca) {
                      if (U > i[P]) {
                        i[P] = U;
                        var X = I[(ha & p) * F + (ka & p)],
                          N = ((n & 16711680) >> 16) * ((X & 16711680) >> 8),
                          ba = ((n & 65280) >> 8) * ((X & 65280) >> 8),
                          W = (n & 255) * (X & 255) >> 8;
                        h[P] = N & 16711680 | ba & 65280 | W & 255;
                        l[P] = u
                      }
                      P++
                    }
                  } else {
                    O = O;
                    U = U;
                    ka = ka;
                    for (ha = ha; O < J; O++, U += L, ka += Z, ha += ca) {
                      if (U > i[P]) {
                        W = I[(ha & p) * F + (ka & p)];
                        X = h[P];
                        var ia = (W >> 24 & 255) * (H & 255) >> 8;
                        N = ((n & 16711680) >> 16) * ((W & 16711680) >> 8);
                        ba = ((n & 65280) >> 8) * ((W & 65280) >> 8);
                        W = (n & 255) * (W & 255) >> 8;
                        if (ia > 250) i[P] = U;
                        else {
                          var R = 255 - ia;
                          N = N * ia + (X & 16711680) * R >> 8;
                          ba = ba * ia + (X & 65280) * R >> 8;
                          W = W * ia + (X & 255) *
                            R >> 8
                        }
                        h[P] = N & 16711680 | ba & 65280 | W & 255;
                        l[P] = u
                      }
                      P++
                    }
                  }
                }
                ra -= sa;
                ma -= da;
                Q -= ya;
                V -= G;
                if (z > s[q]) {
                  ta -= Y;
                  ea -= na;
                  Ea -= oa;
                  Da -= S
                } else {
                  ua -= Fa;
                  ja -= aa;
                  fa -= ga;
                  pa -= va
                }
                wa -= c
              }
            }
            y = E;
            q = la
          } while (d[t] != -1);
          t++
        }
      }
    }
  };
  a.renderTextureSmooth = function(b) {
    var c = this.frameWidth,
      e = this.frameHeight,
      d = b.indexBuffer,
      f = b.transformedVertexBuffer,
      g = b.transformedVertexNormalZBuffer,
      h = b.vertexNormalIndexBuffer ? b.vertexNormalIndexBuffer : b.indexBuffer,
      i = b.transformedFaceNormalZBuffer,
      l = this.colorBuffer,
      o = this.zBuffer,
      u = this.selectionBuffer,
      j = b.faceCount,
      B = b.internalId,
      m = b.material ? b.material : this.defaultMaterial,
      M = m.getPalette(),
      H = b.texture,
      x = m.transparency == 0 && !H.hasTransparency,
      K = ~~((1 - m.transparency) * 255),
      I = b.texCoordBuffer,
      F = b.texCoordIndexBuffer ? b.texCoordIndexBuffer : b.indexBuffer,
      p = H.data,
      r = H.width,
      w = r - 1,
      s = H.hasMipmap() ? H.mipmaps : null,
      v = s ? H.mipentries : null;
    var fixForMacSafari = 1 * null;
    if (m.transparency != 1) {
      if (!g || g.length < b.vertexNormalBuffer.length / 3) {
        b.transformedVertexNormalZBuffer = new Array(b.vertexNormalBuffer.length / 3);
        g = b.transformedVertexNormalZBuffer
      }
      if (!i || i.length < j) {
        b.transformedFaceNormalZBuffer = new Array(j);
        i = b.transformedFaceNormalZBuffer
      }
      JSC3D.Math3D.transformVectorZs(this.rotMatrix, b.vertexNormalBuffer, g);
      JSC3D.Math3D.transformVectorZs(this.rotMatrix,
        b.faceNormalBuffer, i);
      b = b.isDoubleSided;
      m = new Array(3);
      for (var k = new Array(3), D = new Array(3), A = new Array(3), t = new Array(3), n = new Array(3), T = 0, y = 0; T < j;) {
        var E = i[T++];
        if (b) E = E > 0 ? E : -E;
        if (E < 0) {
          do; while (d[y++] != -1)
        } else {
          var C, q, la, z, ra, ma, Q, V;
          E = d[y] * 3;
          la = F[y] * 2;
          ma = h[y];
          y++;
          q = d[y] * 3;
          z = F[y] * 2;
          Q = h[y];
          y++;
          if (s) {
            C = d[y] * 3;
            ra = F[y] * 2;
            r = H.width;
            m[0] = f[E];
            k[0] = f[E + 1];
            m[1] = f[q];
            k[1] = f[q + 1];
            m[2] = f[C];
            k[2] = f[C + 1];
            t[0] = I[la] * r;
            n[0] = I[la + 1] * r;
            t[1] = I[z] * r;
            n[1] = I[z + 1] * r;
            t[2] = I[ra] * r;
            n[2] = I[ra + 1] * r;
            p = (m[1] - m[0]) * (k[2] -
              k[0]) - (k[1] - k[0]) * (m[2] - m[0]);
            if (p < 0) p = -p;
            p += 1;
            w = (t[1] - t[0]) * (n[2] - n[0]) - (n[1] - n[0]) * (t[2] - t[0]);
            if (w < 0) w = -w;
            p = w / p;
            w = 0;
            if (p < v[1]) w = 0;
            else if (p >= v[v.length - 1]) {
              w = v.length - 1;
              r = 1
            } else
              for (; p >= v[w + 1];) {
                w++;
                r /= 2
              }
            p = s[w];
            w = r - 1
          }
          do {
            C = d[y];
            C = C * 3;
            ra = F[y] * 2;
            V = h[y];
            y++;
            m[0] = ~~(f[E] + 0.5);
            k[0] = ~~(f[E + 1] + 0.5);
            D[0] = f[E + 2];
            m[1] = ~~(f[q] + 0.5);
            k[1] = ~~(f[q + 1] + 0.5);
            D[1] = f[q + 2];
            m[2] = ~~(f[C] + 0.5);
            k[2] = ~~(f[C + 1] + 0.5);
            D[2] = f[C + 2];
            t[0] = I[la] * r;
            n[0] = I[la + 1] * r;
            t[1] = I[z] * r;
            n[1] = I[z + 1] * r;
            t[2] = I[ra] * r;
            n[2] = I[ra + 1] * r;
            A[0] = g[ma];
            A[1] =
              g[Q];
            A[2] = g[V];
            if (b) {
              if (A[0] < 0) A[0] = -A[0];
              if (A[1] < 0) A[1] = -A[1];
              if (A[2] < 0) A[2] = -A[2]
            }
            q = k[0] < k[1] ? 0 : 1;
            q = k[q] < k[2] ? q : 2;
            var G = k[0] > k[1] ? 0 : 1;
            G = k[G] > k[2] ? G : 2;
            z = 3 - G - q;
            if (q != G) {
              Q = m[G];
              var sa = D[G],
                da = t[G],
                ya = n[G],
                ta = A[G] * 255,
                ea = k[G] - k[q];
              ea = ea != 0 ? ea : 1;
              var Ea = (m[G] - m[q]) / ea,
                Da = (D[G] - D[q]) / ea,
                S = (t[G] - t[q]) / ea,
                Y = (n[G] - n[q]) / ea;
              ea = (A[G] - A[q]) * 255 / ea;
              var na = m[G],
                oa = D[G],
                ua = t[G],
                ja = n[G],
                fa = A[G] * 255,
                pa = k[G] - k[z];
              pa = pa != 0 ? pa : 1;
              var va = (m[G] - m[z]) / pa,
                Fa = (D[G] - D[z]) / pa,
                aa = (t[G] - t[z]) / pa,
                ga = (n[G] - n[z]) / pa;
              pa = (A[G] - A[z]) *
                255 / pa;
              var wa = m[z],
                O = D[z],
                U = t[z],
                ka = n[z],
                ha = A[z] * 255,
                J = k[z] - k[q];
              J = J != 0 ? J : 1;
              var L = (m[z] - m[q]) / J,
                Z = (D[z] - D[q]) / J,
                ca = (t[z] - t[q]) / J,
                P = (n[z] - n[q]) / J;
              J = (A[z] - A[q]) * 255 / J;
              var X = k[G] * c;
              for (G = k[G]; G > k[q]; G--) {
                if (G >= 0 && G < e) {
                  var N = ~~Q,
                    ba = sa,
                    W = da,
                    ia = ya,
                    R = ta,
                    $, xa, za, Aa, Ba;
                  if (G > k[z]) {
                    $ = ~~na;
                    xa = oa;
                    za = ua;
                    Aa = ja;
                    Ba = fa
                  } else {
                    $ = ~~wa;
                    xa = O;
                    za = U;
                    Aa = ka;
                    Ba = ha
                  }
                  if (N > $) {
                    var qa;
                    qa = N;
                    N = $;
                    $ = qa;
                    qa = ba;
                    ba = xa;
                    xa = qa;
                    qa = W;
                    W = za;
                    za = qa;
                    qa = ia;
                    ia = Aa;
                    Aa = qa;
                    qa = R;
                    R = Ba;
                    Ba = qa
                  }
                  xa = N != $ ? (xa - ba) / ($ - N) : 1;
                  za = N != $ ? (za - W) / ($ - N) : 1;
                  Aa = N != $ ? (Aa - ia) / ($ - N) :
                    1;
                  Ba = N != $ ? (Ba - R) / ($ - N) : 0;
                  if (N < 0) {
                    ba -= N * xa;
                    W -= N * za;
                    ia -= N * Aa;
                    R -= N * Ba;
                    N = 0
                  }
                  if ($ >= c) $ = c - 1;
                  qa = X + N;
                  if (x) {
                    N = N;
                    ba = ba;
                    R = R;
                    W = W;
                    for (ia = ia; N <= $; N++, ba += xa, R += Ba, W += za, ia += Aa) {
                      if (ba > o[qa]) {
                        o[qa] = ba;
                        var Ca = M[R > 0 ? ~~R : 0],
                          Ha = p[(ia & w) * r + (W & w)],
                          Ia = ((Ca & 16711680) >> 16) * ((Ha & 16711680) >> 8),
                          Ja = ((Ca & 65280) >> 8) * ((Ha & 65280) >> 8);
                        Ca = (Ca & 255) * (Ha & 255) >> 8;
                        l[qa] = Ia & 16711680 | Ja & 65280 | Ca & 255;
                        u[qa] = B
                      }
                      qa++
                    }
                  } else {
                    N = N;
                    ba = ba;
                    R = R;
                    W = W;
                    for (ia = ia; N < $; N++, ba += xa, R += Ba, W += za, ia += Aa) {
                      if (ba > o[qa]) {
                        Ca = M[R > 0 ? ~~R : 0];
                        var Ga = p[(ia & w) * r + (W & w)];
                        Ha = l[qa];
                        var Ka = (Ga >> 24 & 255) * (K & 255) >> 8;
                        Ia = ((Ca & 16711680) >> 16) * ((Ga & 16711680) >> 8);
                        Ja = ((Ca & 65280) >> 8) * ((Ga & 65280) >> 8);
                        Ca = (Ca & 255) * (Ga & 255) >> 8;
                        if (Ka > 250) o[qa] = ba;
                        else {
                          Ga = 255 - Ka;
                          Ia = Ia * Ka + (Ha & 16711680) * Ga >> 8;
                          Ja = Ja * Ka + (Ha & 65280) * Ga >> 8;
                          Ca = Ca * Ka + (Ha & 255) * Ga >> 8
                        }
                        l[qa] = Ia & 16711680 | Ja & 65280 | Ca & 255;
                        u[qa] = B
                      }
                      qa++
                    }
                  }
                }
                Q -= Ea;
                sa -= Da;
                da -= S;
                ya -= Y;
                ta -= ea;
                if (G > k[z]) {
                  na -= va;
                  oa -= Fa;
                  ua -= aa;
                  ja -= ga;
                  fa -= pa
                } else {
                  wa -= L;
                  O -= Z;
                  U -= ca;
                  ka -= P;
                  ha -= J
                }
                X -= c
              }
            }
            q = C;
            z = ra;
            Q = V
          } while (d[y] != -1);
          y++
        }
      }
    }
  };
  a.renderSolidSphereMapped = function(b) {
    var c = this.frameWidth,
      e = this.frameHeight,
      d = b.indexBuffer,
      f = b.transformedVertexBuffer,
      g = b.transformedVertexNormalBuffer,
      h = b.vertexNormalIndexBuffer ? b.vertexNormalIndexBuffer : b.indexBuffer,
      i = b.transformedFaceNormalZBuffer,
      l = this.colorBuffer,
      o = this.zBuffer,
      u = this.selectionBuffer,
      j = b.faceCount,
      B = b.internalId,
      m = b.material ? b.material : this.defaultMaterial,
      M = m.getPalette(),
      H = this.sphereMap,
      x = H.data;
    H = H.width;
    var K = H - 1,
      I = m.transparency == 0,
      F = m.transparency * 255,
      p = 255 - F;
    var fixForMacSafari = 1 * null;
    if (m.transparency != 1) {
      if (!g || g.length < b.vertexNormalBuffer.length) {
        b.transformedVertexNormalBuffer = new Array(b.vertexNormalBuffer.length);
        g = b.transformedVertexNormalBuffer
      }
      if (!i || i.length < j) {
        b.transformedFaceNormalZBuffer = new Array(j);
        i = b.transformedFaceNormalZBuffer
      }
      JSC3D.Math3D.transformVectors(this.rotMatrix, b.vertexNormalBuffer, g);
      JSC3D.Math3D.transformVectorZs(this.rotMatrix, b.faceNormalBuffer, i);
      b = b.isDoubleSided;
      m = new Array(3);
      for (var r = new Array(3), w = new Array(3), s = new Array(3), v = new Array(3),
          k = new Array(3), D = 0, A = 0; D < j;) {
        var t = i[D++];
        if (b) t = t > 0 ? t : -t;
        if (t < 0) {
          do; while (d[A++] != -1)
        } else {
          var n, T, y, E, C;
          t = d[A] * 3;
          y = h[A] * 3;
          A++;
          n = d[A] * 3;
          E = h[A] * 3;
          A++;
          do {
            T = d[A] * 3;
            C = h[A] * 3;
            A++;
            m[0] = ~~(f[t] + 0.5);
            r[0] = ~~(f[t + 1] + 0.5);
            w[0] = f[t + 2];
            m[1] = ~~(f[n] + 0.5);
            r[1] = ~~(f[n + 1] + 0.5);
            w[1] = f[n + 2];
            m[2] = ~~(f[T] + 0.5);
            r[2] = ~~(f[T + 1] + 0.5);
            w[2] = f[T + 2];
            s[0] = g[y];
            v[0] = g[y + 1];
            k[0] = g[y + 2];
            s[1] = g[E];
            v[1] = g[E + 1];
            k[1] = g[E + 2];
            s[2] = g[C];
            v[2] = g[C + 1];
            k[2] = g[C + 2];
            if (b) {
              if (k[0] < 0) k[0] = -k[0];
              if (k[1] < 0) k[1] = -k[1];
              if (k[2] < 0) k[2] = -k[2]
            }
            n = r[0] <
              r[1] ? 0 : 1;
            n = r[n] < r[2] ? n : 2;
            var q = r[0] > r[1] ? 0 : 1;
            q = r[q] > r[2] ? q : 2;
            E = 3 - q - n;
            if (n != q) {
              var la = m[q],
                z = w[q],
                ra = k[q] * 255,
                ma = (s[q] / 2 + 0.5) * H & K,
                Q = (0.5 - v[q] / 2) * H & K,
                V = r[q] - r[n];
              V = V != 0 ? V : 1;
              var G = (m[q] - m[n]) / V,
                sa = (w[q] - w[n]) / V,
                da = (k[q] - k[n]) * 255 / V,
                ya = (s[q] - s[n]) / 2 * H / V;
              V = (v[n] - v[q]) / 2 * H / V;
              var ta = m[q],
                ea = w[q],
                Ea = k[q] * 255,
                Da = (s[q] / 2 + 0.5) * H & K,
                S = (0.5 - v[q] / 2) * H & K,
                Y = r[q] - r[E];
              Y = Y != 0 ? Y : 1;
              var na = (m[q] - m[E]) / Y,
                oa = (w[q] - w[E]) / Y,
                ua = (k[q] - k[E]) * 255 / Y,
                ja = (s[q] - s[E]) / 2 * H / Y;
              Y = (v[E] - v[q]) / 2 * H / Y;
              var fa = m[E],
                pa = w[E],
                va = k[E] * 255,
                Fa = (s[E] /
                  2 + 0.5) * H & K,
                aa = (0.5 - v[E] / 2) * H & K,
                ga = r[E] - r[n];
              ga = ga != 0 ? ga : 1;
              var wa = (m[E] - m[n]) / ga,
                O = (w[E] - w[n]) / ga,
                U = (k[E] - k[n]) * 255 / ga,
                ka = (s[E] - s[n]) / 2 * H / ga;
              ga = (v[n] - v[E]) / 2 * H / ga;
              var ha = r[q] * c;
              for (q = r[q]; q > r[n]; q--) {
                if (q >= 0 && q < e) {
                  var J = ~~la,
                    L = z,
                    Z = ra,
                    ca = ma,
                    P = Q,
                    X, N, ba, W, ia;
                  if (q > r[E]) {
                    X = ~~ta;
                    N = ea;
                    ba = Ea;
                    W = Da;
                    ia = S
                  } else {
                    X = ~~fa;
                    N = pa;
                    ba = va;
                    W = Fa;
                    ia = aa
                  }
                  if (J > X) {
                    var R;
                    R = J;
                    J = X;
                    X = R;
                    R = L;
                    L = N;
                    N = R;
                    R = Z;
                    Z = ba;
                    ba = R;
                    R = ca;
                    ca = W;
                    W = R;
                    R = P;
                    P = ia;
                    ia = R
                  }
                  N = J != X ? (N - L) / (X - J) : 1;
                  ba = J != X ? (ba - Z) / (X - J) : 1;
                  W = J != X ? (W - ca) / (X - J) : 1;
                  ia = J != X ? (ia - P) / (X - J) : 1;
                  if (J <
                    0) {
                    L -= J * N;
                    Z -= J * ba;
                    ca -= ca * W;
                    P -= P * ia;
                    J = 0
                  }
                  if (X >= c) X = c - 1;
                  R = ha + J;
                  if (I) {
                    J = J;
                    L = L;
                    Z = Z;
                    ca = ca;
                    for (P = P; J <= X; J++, L += N, Z += ba, ca += W, P += ia) {
                      if (L > o[R]) {
                        o[R] = L;
                        var $ = M[Z > 0 ? ~~Z : 0],
                          xa = x[(P & K) * H + (ca & K)],
                          za = (($ & 16711680) >> 16) * ((xa & 16711680) >> 8),
                          Aa = (($ & 65280) >> 8) * ((xa & 65280) >> 8);
                        $ = ($ & 255) * (xa & 255) >> 8;
                        l[R] = za & 16711680 | Aa & 65280 | $ & 255;
                        u[R] = B
                      }
                      R++
                    }
                  } else {
                    J = J;
                    L = L;
                    Z = Z;
                    ca = ca;
                    for (P = P; J < X; J++, L += N, Z += ba, ca += W, P += ia) {
                      if (L > o[R]) {
                        $ = M[Z > 0 ? ~~Z : 0];
                        var Ba = x[(P & K) * H + (ca & K)];
                        xa = l[R];
                        za = (($ & 16711680) >> 16) * ((Ba & 16711680) >> 8);
                        Aa = (($ & 65280) >>
                          8) * ((Ba & 65280) >> 8);
                        $ = ($ & 255) * (Ba & 255) >> 8;
                        za = za * p + (xa & 16711680) * F >> 8;
                        Aa = Aa * p + (xa & 65280) * F >> 8;
                        $ = $ * p + (xa & 255) * F >> 8;
                        l[R] = za & 16711680 | Aa & 65280 | $ & 255;
                        u[R] = B
                      }
                      R++
                    }
                  }
                }
                la -= G;
                z -= sa;
                ra -= da;
                ma -= ya;
                Q -= V;
                if (q > r[E]) {
                  ta -= na;
                  ea -= oa;
                  Ea -= ua;
                  Da -= ja;
                  S -= Y
                } else {
                  fa -= wa;
                  pa -= O;
                  va -= U;
                  Fa -= ka;
                  aa -= ga
                }
                ha -= c
              }
            }
            n = T;
            E = C
          } while (d[A] != -1);
          A++
        }
      }
    }
  };
  a.params = null;
  a.canvas = null;
  a.ctx2d = null;
  a.canvasData = null;
  a.bkgColorBuffer = null;
  a.colorBuffer = null;
  a.zBuffer = null;
  a.selectionBuffer = null;
  a.frameWidth = 0;
  a.frameHeight = 0;
  a.scene = null;
  a.defaultMaterial = null;
  a.sphereMap = null;
  a.isLoaded = false;
  a.isFailed = false;
  a.needUpdate = false;
  a.needRepaint = false;
  a.initRotX = 0;
  a.initRotY = 0;
  a.initRotZ = 0;
  a.zoomFactor = 1;
  a.panning = [0, 0];
  a.rotMatrix = null;
  a.transformMatrix = null;
  a.sceneUrl = "";
  a.modelColor = 13280792;
  a.bkgColor1 = 16777215;
  a.bkgColor2 = 16777088;
  a.renderMode = "flat";
  a.definition = "standard";
  a.isMipMappingOn = false;
  a.creaseAngle = -180;
  a.sphereMapUrl = "";
  a.showProgressBar = true;
  a.buttonStates = null;
  a.keyStates = null;
  a.mouseX = 0;
  a.mouseY = 0;
  a.onloadingstarted = null;
  a.onloadingcomplete = null;
  a.onloadingprogress = null;
  a.onloadingaborted = null;
  a.onloadingerror = null;
  a.onmousedown = null;
  a.onmouseup = null;
  a.onmousemove = null;
  a.onmousewheel = null;
  a.beforeupdate = null;
  a.afterupdate = null;
  a.mouseUsage = "default";
  a.isDefaultInputHandlerEnabled = false;
  JSC3D.PickInfo = function() {
    this.canvasY = this.canvasX = 0;
    this.depth = -Infinity;
    this.mesh = null
  };
  JSC3D.Scene = function(b) {
    this.name = b || "";
    this.aabb = null;
    this.children = [];
    this.maxChildId = 1
  };
  a = JSC3D.Scene.prototype;
  a.init = function() {
    if (!this.isEmpty()) {
      for (var b = 0; b < this.children.length; b++) this.children[b].init();
      if (!this.aabb) {
        this.aabb = new JSC3D.AABB;
        this.calcAABB()
      }
    }
  };
  a.isEmpty = function() {
    return this.children.length == 0
  };
  a.addChild = function(b) {
    b.internalId = this.maxChildId++;
    this.children.push(b)
  };
  a.removeChild = function(b) {
    b = this.children.indexOf(b);
    b >= 0 && this.children.splice(b, 1)
  };
  a.getChildren = function() {
    return this.children.slice(0)
  };
  a.forEachChild = function(b) {
    if (typeof b == "function")
      for (var c = 0; c < this.children.length; c++)
        if (b.call(null, this.children[c])) break
  };
  a.calcAABB = function() {
    this.aabb.minX = this.aabb.minY = this.aabb.minZ = Number.MAX_VALUE;
    this.aabb.maxX = this.aabb.maxY = this.aabb.maxZ = -Number.MAX_VALUE;
    for (var b = 0; b < this.children.length; b++) {
      var c = this.children[b];
      if (!c.isTrivial()) {
        var e = c.aabb.minX,
          d = c.aabb.minY,
          f = c.aabb.minZ,
          g = c.aabb.maxX,
          h = c.aabb.maxY;
        c = c.aabb.maxZ;
        if (this.aabb.minX > e) this.aabb.minX = e;
        if (this.aabb.minY > d) this.aabb.minY = d;
        if (this.aabb.minZ > f) this.aabb.minZ = f;
        if (this.aabb.maxX < g) this.aabb.maxX = g;
        if (this.aabb.maxY < h) this.aabb.maxY = h;
        if (this.aabb.maxZ < c) this.aabb.maxZ = c
      }
    }
  };
  a.name = "";
  a.aabb = null;
  a.children = null;
  a.maxChildId = 1;
  JSC3D.Mesh = function(b, c, e, d, f, g, h, i, l, o, u) {
    this.name = b || "";
    this.metadata = "";
    this.visible = c != undefined ? c : true;
    this.aabb = this.renderMode = null;
    this.vertexBuffer = i || null;
    this.indexBuffer = l || null;
    this.faceNormalBuffer = this.vertexNormalIndexBuffer = this.vertexNormalBuffer = null;
    this.material = e || null;
    this.texture = d || null;
    this.faceCount = 0;
    this.creaseAngle = f >= 0 ? f : -180;
    this.isDoubleSided = g || false;
    this.isEnvironmentCast = h || false;
    this.internalId = 0;
    this.texCoordBuffer = o || null;
    this.texCoordIndexBuffer = u || null;
    this.transformedVertexNormalBuffer =
      this.transformedFaceNormalZBuffer = this.transformedVertexNormalZBuffer = this.transformedVertexBuffer = null
  };
  a = JSC3D.Mesh.prototype;
  a.init = function() {
    if (!this.isTrivial()) {
      if (this.faceCount == 0) {
        this.calcFaceCount();
        if (this.faceCount == 0) return
      }
      if (!this.aabb) {
        this.aabb = new JSC3D.AABB;
        this.calcAABB()
      }
      if (!this.faceNormalBuffer) {
        this.faceNormalBuffer = new Array(this.faceCount * 3);
        this.calcFaceNormals()
      }
      if (!this.vertexNormalBuffer)
        if (this.creaseAngle >= 0) this.calcCreasedVertexNormals();
        else {
          this.vertexNormalBuffer = new Array(this.vertexBuffer.length);
          this.calcVertexNormals()
        }
      this.normalizeFaceNormals();
      this.transformedVertexBuffer = new Array(this.vertexBuffer.length)
    }
  };
  a.isTrivial = function() {
    return !this.vertexBuffer || this.vertexBuffer.length < 3 || !this.indexBuffer || this.indexBuffer.length < 3
  };
  a.setMaterial = function(b) {
    this.material = b
  };
  a.setTexture = function(b) {
    this.texture = b
  };
  a.hasTexture = function() {
    return this.texture != null && this.texture.hasData() && this.texCoordBuffer != null && this.texCoordBuffer.length >= 2 && (this.texCoordIndexBuffer == null || this.texCoordIndexBuffer.length >= 3 && this.texCoordIndexBuffer.length >= this.indexBuffer.length)
  };
  a.setRenderMode = function(b) {
    this.renderMode = b
  };
  a.calcFaceCount = function() {
    this.faceCount = 0;
    var b = this.indexBuffer;
    b[b.length - 1] != -1 && b.push(-1);
    for (var c = 0; c < b.length; c++) b[c] == -1 && this.faceCount++
  };
  a.calcAABB = function() {
    for (var b = minY = minZ = Number.MAX_VALUE, c = maxY = maxZ = -Number.MAX_VALUE, e = this.vertexBuffer, d = 0; d < e.length; d += 3) {
      var f = e[d],
        g = e[d + 1],
        h = e[d + 2];
      if (f < b) b = f;
      if (f > c) c = f;
      if (g < minY) minY = g;
      if (g > maxY) maxY = g;
      if (h < minZ) minZ = h;
      if (h > maxZ) maxZ = h
    }
    this.aabb.minX = b;
    this.aabb.minY = minY;
    this.aabb.minZ = minZ;
    this.aabb.maxX = c;
    this.aabb.maxY = maxY;
    this.aabb.maxZ = maxZ
  };
  a.calcFaceNormals = function() {
    for (var b = this.vertexBuffer, c = this.indexBuffer, e = this.faceNormalBuffer, d = 0, f = 0; d < c.length;) {
      var g = c[d++] * 3,
        h = b[g],
        i = b[g + 1],
        l = b[g + 2];
      g = c[d++] * 3;
      var o = b[g],
        u = b[g + 1],
        j = b[g + 2];
      g = c[d++] * 3;
      o = o - h;
      u = u - i;
      j = j - l;
      h = b[g] - h;
      i = b[g + 1] - i;
      l = b[g + 2] - l;
      g = u * l - j * i;
      l = j * h - o * l;
      o = o * i - u * h;
      e[f++] = g;
      e[f++] = l;
      e[f++] = o;
      do; while (c[d++] != -1)
    }
  };
  a.normalizeFaceNormals = function() {
    JSC3D.Math3D.normalizeVectors(this.faceNormalBuffer, this.faceNormalBuffer)
  };
  a.calcVertexNormals = function() {
    if (!this.faceNormalBuffer) {
      this.faceNormalBuffer = new Array(this.faceCount * 3);
      this.calcFaceNormals()
    }
    for (var b = this.indexBuffer, c = this.faceNormalBuffer, e = this.vertexNormalBuffer, d = 0; d < e.length; d++) e[d] = 0;
    this.vertexNormalIndexBuffer = null;
    for (var f = d = 0, g = 0; d < b.length;) {
      g = b[d++];
      if (g == -1) f += 3;
      else {
        g = g * 3;
        e[g] += c[f];
        e[g + 1] += c[f + 1];
        e[g + 2] += c[f + 2]
      }
    }
    JSC3D.Math3D.normalizeVectors(e, e)
  };
  a.calcCreasedVertexNormals = function() {
    if (!this.faceNormalBuffer) {
      this.faceNormalBuffer = new Array(this.faceCount * 3);
      this.calcFaceNormals()
    }
    for (var b = this.indexBuffer, c = new Array(this.vertexBuffer.length / 3), e = 0, d = 0, f = 0, g = 0; d < b.length; d++) {
      g = b[d];
      if (g >= 0) {
        e += 3;
        var h = c[g];
        if (h) h.push(f);
        else c[g] = [f]
      } else f++
    }
    f = this.faceNormalBuffer;
    var i = new Array(f.length);
    JSC3D.Math3D.normalizeVectors(f, i);
    if (!this.vertexNormalBuffer || this.vertexNormalBuffer.length < e) this.vertexNormalBuffer = new Array(e);
    e = this.vertexNormalBuffer;
    for (d = 0; d < e.length; d++) e[d] = 0;
    for (var l = this.vertexNormalIndexBuffer = [], o = Math.cos(this.creaseAngle * Math.PI / 180), u = d = 0, j = 0; d < b.length; d++) {
      g = b[d];
      if (g >= 0) {
        var B = u * 3;
        h = j * 3;
        e[B] += f[h];
        e[B + 1] += f[h + 1];
        e[B + 2] += f[h + 2];
        var m = i[h],
          M = i[h + 1],
          H = i[h + 2];
        h = c[g];
        for (g = 0; g < h.length; g++) {
          var x = h[g];
          if (j != x) {
            x = x * 3;
            if (m * i[x] + M * i[x + 1] + H * i[x + 2] > o) {
              e[B] += f[x];
              e[B + 1] += f[x + 1];
              e[B + 2] += f[x + 2]
            }
          }
        }
        l.push(u++)
      } else {
        j++;
        l.push(-1)
      }
    }
    JSC3D.Math3D.normalizeVectors(e, e)
  };
  a.checkValid = function() {};
  a.name = "";
  a.metadata = "";
  a.visible = false;
  a.renderMode = "flat";
  a.aabb = null;
  a.vertexBuffer = null;
  a.indexBuffer = null;
  a.vertexNormalBuffer = null;
  a.vertexNormalIndexBuffer = null;
  a.faceNormalBuffer = null;
  a.texCoordBuffer = null;
  a.texCoordIndexBuffer = null;
  a.material = null;
  a.texture = null;
  a.faceCount = 0;
  a.creaseAngle = -180;
  a.isDoubleSided = false;
  a.isEnvironmentCast = false;
  a.internalId = 0;
  a.transformedVertexBuffer = null;
  a.transformedVertexNormalZBuffer = null;
  a.transformedFaceNormalZBuffer = null;
  a.transformedVertexNormalBuffer = null;
  JSC3D.Material = function(b, c, e, d, f) {
    this.name = b || "";
    this.ambientColor = c || 0;
    this.diffuseColor = e || 8355711;
    this.transparency = d || 0;
    this.simulateSpecular = f || false;
    this.palette = null
  };
  a = JSC3D.Material.prototype;
  a.getPalette = function() {
    if (!this.palette) {
      this.palette = new Array(256);
      this.generatePalette()
    }
    return this.palette
  };
  a.generatePalette = function() {
    var b = (this.ambientColor & 16711680) >> 16,
      c = (this.ambientColor & 65280) >> 8,
      e = this.ambientColor & 255,
      d = (this.diffuseColor & 16711680) >> 16,
      f = (this.diffuseColor & 65280) >> 8,
      g = this.diffuseColor & 255;
    if (this.simulateSpecular) {
      for (var h = 0; h < 204;) {
        var i = b + h * d / 204,
          l = c + h * f / 204,
          o = e + h * g / 204;
        if (i > 255) i = 255;
        if (l > 255) l = 255;
        if (o > 255) o = 255;
        this.palette[h++] = i << 16 | l << 8 | o
      }
      for (; h < 256;) {
        i = b + d + (h - 204) * (255 - d) / 82;
        l = c + f + (h - 204) * (255 - f) / 82;
        o = e + g + (h - 204) * (255 - g) / 82;
        if (i > 255) i = 255;
        if (l > 255) l = 255;
        if (o > 255) o =
          255;
        this.palette[h++] = i << 16 | l << 8 | o
      }
    } else
      for (h = 0; h < 256;) {
        i = b + h * d / 256;
        l = c + h * f / 256;
        o = e + h * g / 256;
        if (i > 255) i = 255;
        if (l > 255) l = 255;
        if (o > 255) o = 255;
        this.palette[h++] = i << 16 | l << 8 | o
      }
  };
  a.name = "";
  a.ambientColor = 0;
  a.diffuseColor = 8355711;
  a.transparency = 0;
  a.simulateSpecular = false;
  a.palette = null;
  JSC3D.Texture = function(b, c) {
    this.name = b || "";
    this.height = this.width = 0;
    this.mipentries = this.mipmaps = this.data = null;
    this.hasTransparency = false;
    this.srcUrl = "";
    this.onready = c && typeof c == "function" ? c : null
  };
  a = JSC3D.Texture.prototype;
  a.createFromUrl = function(b, c) {
    var e = this,
      d = new Image;
    d.onload = function() {
      e.data = null;
      e.mipmaps = null;
      e.mipentries = null;
      e.width = 0;
      e.height = 0;
      e.hasTransparency = false;
      e.srcUrl = "";
      e.createFromImage(this, c);
      JSC3D.console && JSC3D.console.logInfo('Finished loading texture image file "' + this.src + '".')
    };
    d.onerror = function() {
      e.data = null;
      e.mipmaps = null;
      e.mipentries = null;
      e.width = 0;
      e.height = 0;
      e.hasTransparency = false;
      e.srcUrl = "";
      JSC3D.console && JSC3D.console.logWarning('Failed to load texture image file "' + this.src +
        '". This texture will be discarded.')
    };
    d.src = b
  };
  a.createFromImage = function(b, c) {
    if (!(b.width <= 0 || b.height <= 0)) {
      var e = false,
        d = JSC3D.Texture.cv;
      if (!d) try {
        d = document.createElement("canvas");
        JSC3D.Texture.cv = d;
        e = true
      } catch (f) {
        return
      }
      var g = b.width > b.height ? b.width : b.height;
      g = g <= 32 ? 32 : g <= 64 ? 64 : g <= 128 ? 128 : g <= 256 ? 256 : g <= 512 ? 512 : 1024;
      if (d.width != g || d.height != g) {
        d.width = d.height = g;
        e = true
      }
      var h;
      try {
        var i = d.getContext("2d");
        e || i.clearRect(0, 0, g, g);
        i.drawImage(b, 0, 0, g, g);
        h = i.getImageData(0, 0, g, g).data
      } catch (l) {
        return
      }
      e = h.length / 4;
      this.data = new Array(e);
      for (var o =
          i = 0; i < e; i++, o += 4) {
        d = h[o + 3];
        this.data[i] = d << 24 | h[o] << 16 | h[o + 1] << 8 | h[o + 2];
        if (d < 255) this.hasTransparency = true
      }
      this.height = this.width = g;
      this.mipmaps = null;
      c && this.generateMipmaps();
      this.srcUrl = b.src;
      this.onready != null && typeof this.onready == "function" && this.onready()
    }
  };
  a.hasData = function() {
    return this.data != null
  };
  a.generateMipmaps = function() {
    if (!(this.width <= 1 || this.data == null || this.mipmaps != null)) {
      this.mipmaps = [this.data];
      this.mipentries = [1];
      for (var b = 1 + ~~(0.1 + Math.log(this.width) * Math.LOG2E), c = this.width >> 1, e = 1; e < b; e++) {
        for (var d = new Array(c * c), f = this.mipmaps[e - 1], g = c << 1, h = 0, i = 0, l = 0; l < c; l++) {
          for (var o = 0; o < c; o++) {
            var u = f[h],
              j = f[h + 1],
              B = f[h + g],
              m = f[h + g + 1];
            d[i] = (((u & 4278190080) >>> 2) + ((j & 4278190080) >>> 2) + ((B & 4278190080) >>> 2) + ((m & 4278190080) >>> 2) & 4278190080) + ((u & 16711680) + (j & 16711680) + (B & 16711680) + (m & 16711680) >>
              2 & 16711680) + ((u & 65280) + (j & 65280) + (B & 65280) + (m & 65280) >> 2 & 65280) + ((u & 255) + (j & 255) + (B & 255) + (m & 255) >> 2 & 255);
            h += 2;
            i++
          }
          h += g
        }
        this.mipmaps.push(d);
        this.mipentries.push(Math.pow(4, e));
        c >>= 1
      }
    }
  };
  a.hasMipmap = function() {
    return this.mipmaps != null
  };
  a.name = "";
  a.data = null;
  a.mipmaps = null;
  a.mipentries = null;
  a.width = 0;
  a.height = 0;
  a.hasTransparency = false;
  a.srcUrl = "";
  a.onready = null;
  JSC3D.Texture.cv = null;
  JSC3D.AABB = function() {
    this.minZ = this.maxZ = this.minY = this.maxY = this.minX = this.maxX = 0
  };
  JSC3D.AABB.prototype.center = function() {
    return [(this.minX + this.maxX) / 2, (this.minY + this.maxY) / 2, (this.minZ + this.maxZ) / 2]
  };
  JSC3D.AABB.prototype.lengthOfDiagonal = function() {
    var b = this.maxX - this.minX,
      c = this.maxY - this.minY,
      e = this.maxZ - this.minZ;
    return Math.sqrt(b * b + c * c + e * e)
  };
  JSC3D.Matrix3x4 = function() {
    this.m00 = 1;
    this.m10 = this.m03 = this.m02 = this.m01 = 0;
    this.m11 = 1;
    this.m21 = this.m20 = this.m13 = this.m12 = 0;
    this.m22 = 1;
    this.m23 = 0
  };
  a = JSC3D.Matrix3x4.prototype;
  a.identity = function() {
    this.m00 = 1;
    this.m10 = this.m03 = this.m02 = this.m01 = 0;
    this.m11 = 1;
    this.m21 = this.m20 = this.m13 = this.m12 = 0;
    this.m22 = 1;
    this.m23 = 0
  };
  a.scale = function(b, c, e) {
    this.m00 *= b;
    this.m01 *= b;
    this.m02 *= b;
    this.m03 *= b;
    this.m10 *= c;
    this.m11 *= c;
    this.m12 *= c;
    this.m13 *= c;
    this.m20 *= e;
    this.m21 *= e;
    this.m22 *= e;
    this.m23 *= e
  };
  a.translate = function(b, c, e) {
    this.m03 += b;
    this.m13 += c;
    this.m23 += e
  };
  a.rotateAboutXAxis = function(b) {
    if (b != 0) {
      b *= Math.PI / 180;
      var c = Math.cos(b);
      b = Math.sin(b);
      var e = c * this.m11 - b * this.m21,
        d = c * this.m12 - b * this.m22,
        f = c * this.m13 - b * this.m23,
        g = c * this.m20 + b * this.m10,
        h = c * this.m21 + b * this.m11,
        i = c * this.m22 + b * this.m12,
        l = c * this.m23 + b * this.m13;
      this.m10 = c * this.m10 - b * this.m20;
      this.m11 = e;
      this.m12 = d;
      this.m13 = f;
      this.m20 = g;
      this.m21 = h;
      this.m22 = i;
      this.m23 = l
    }
  };
  a.rotateAboutYAxis = function(b) {
    if (b != 0) {
      b *= Math.PI / 180;
      var c = Math.cos(b);
      b = Math.sin(b);
      var e = c * this.m01 + b * this.m21,
        d = c * this.m02 + b * this.m22,
        f = c * this.m03 + b * this.m23,
        g = c * this.m20 - b * this.m00,
        h = c * this.m21 - b * this.m01,
        i = c * this.m22 - b * this.m02,
        l = c * this.m23 - b * this.m03;
      this.m00 = c * this.m00 + b * this.m20;
      this.m01 = e;
      this.m02 = d;
      this.m03 = f;
      this.m20 = g;
      this.m21 = h;
      this.m22 = i;
      this.m23 = l
    }
  };
  a.rotateAboutZAxis = function(b) {
    if (b != 0) {
      b *= Math.PI / 180;
      var c = Math.cos(b);
      b = Math.sin(b);
      var e = c * this.m10 + b * this.m00,
        d = c * this.m11 + b * this.m01,
        f = c * this.m12 + b * this.m02,
        g = c * this.m13 + b * this.m03,
        h = c * this.m01 - b * this.m11,
        i = c * this.m02 - b * this.m12,
        l = c * this.m03 - b * this.m13;
      this.m00 = c * this.m00 - b * this.m10;
      this.m01 = h;
      this.m02 = i;
      this.m03 = l;
      this.m10 = e;
      this.m11 = d;
      this.m12 = f;
      this.m13 = g
    }
  };
  a.multiply = function(b) {
    var c = b.m00 * this.m01 + b.m01 * this.m11 + b.m02 * this.m21,
      e = b.m00 * this.m02 + b.m01 * this.m12 + b.m02 * this.m22,
      d = b.m00 * this.m03 + b.m01 * this.m13 + b.m02 * this.m23 + b.m03,
      f = b.m10 * this.m00 + b.m11 * this.m10 + b.m12 * this.m20,
      g = b.m10 * this.m01 + b.m11 * this.m11 + b.m12 * this.m21,
      h = b.m10 * this.m02 + b.m11 * this.m12 + b.m12 * this.m22,
      i = b.m10 * this.m03 + b.m11 * this.m13 + b.m12 * this.m23 + b.m13,
      l = b.m20 * this.m00 + b.m21 * this.m10 + b.m22 * this.m20,
      o = b.m20 * this.m01 + b.m21 * this.m11 + b.m22 * this.m21,
      u = b.m20 * this.m02 + b.m21 * this.m12 + b.m22 * this.m22,
      j = b.m20 * this.m03 + b.m21 * this.m13 + b.m22 * this.m23 + b.m23;
    this.m00 = b.m00 * this.m00 + b.m01 * this.m10 + b.m02 * this.m20;
    this.m01 = c;
    this.m02 = e;
    this.m03 = d;
    this.m10 = f;
    this.m11 = g;
    this.m12 = h;
    this.m13 = i;
    this.m20 = l;
    this.m21 = o;
    this.m22 = u;
    this.m23 = j
  };
  JSC3D.Math3D = {
    transformVectors: function(b, c, e) {
      for (var d = 0; d < c.length; d += 3) {
        var f = c[d],
          g = c[d + 1],
          h = c[d + 2];
        e[d] = b.m00 * f + b.m01 * g + b.m02 * h + b.m03;
        e[d + 1] = b.m10 * f + b.m11 * g + b.m12 * h + b.m13;
        e[d + 2] = b.m20 * f + b.m21 * g + b.m22 * h + b.m23
      }
    },
    transformVectorZs: function(b, c, e) {
      for (var d = c.length / 3, f = 0, g = 0; f < d;) {
        e[f] = b.m20 * c[g] + b.m21 * c[g + 1] + b.m22 * c[g + 2] + b.m23;
        f++;
        g += 3
      }
    },
    normalizeVectors: function(b, c) {
      for (var e = b.length, d = 0; d < e; d += 3) {
        var f = b[d],
          g = b[d + 1],
          h = b[d + 2],
          i = Math.sqrt(f * f + g * g + h * h);
        if (i > 0) {
          i = 1 / i;
          f *= i;
          g *= i;
          h *= i
        }
        c[d] = f;
        c[d +
          1] = g;
        c[d + 2] = h
      }
    }
  };
  JSC3D.PlatformInfo = function() {
    for (var b = {
          browser: "other",
          version: "n/a",
          isTouchDevice: document.createTouch != undefined,
          supportTypedArrays: window.Uint32Array != undefined,
          supportWebGL: window.WebGLRenderingContext != undefined
        }, c = [
          ["firefox", /Firefox[\/\s](\d+(?:\.\d+)*)/],
          ["chrome", /Chrome[\/\s](\d+(?:\.\d+)*)/],
          ["opera", /Opera[\/\s](\d+(?:\.\d+)*)/],
          ["safari", /Safari[\/\s](\d+(?:\.\d+)*)/],
          ["webkit", /AppleWebKit[\/\s](\d+(?:\.\d+)*)/],
          ["ie", /MSIE[\/\s](\d+(?:\.\d+)*)/],
          ["ie", /Trident\/\d+\.\d+;\s.*rv:(\d+(?:\.\d+)*)/]
        ], e,
        d = 0; d < c.length; d++)
      if (e = c[d][1].exec(window.navigator.userAgent)) {
        b.browser = c[d][0];
        b.version = e[1];
        break
      }
    return b
  }();
  JSC3D.BinaryStream = function(b, c) {
    if (c) throw "JSC3D.BinaryStream constructor failed: Big endian is not supported yet!";
    this.data = b;
    this.offset = 0
  };
  a = JSC3D.BinaryStream.prototype;
  a.size = function() {
    return this.data.length
  };
  a.tell = function() {
    return this.offset
  };
  a.seek = function(b) {
    if (b < 0 || b >= this.data.length) return false;
    this.offset = b;
    return true
  };
  a.reset = function() {
    this.offset = 0
  };
  a.skip = function(b) {
    if (this.offset + b > this.data.length) this.offset = this.data.length;
    else this.offset += b
  };
  a.available = function() {
    return this.data.length - this.offset
  };
  a.eof = function() {
    return !(this.offset < this.data.length)
  };
  a.readUInt8 = function() {
    return this.decodeInt(1, false)
  };
  a.readInt8 = function() {
    return this.decodeInt(1, true)
  };
  a.readUInt16 = function() {
    return this.decodeInt(2, false)
  };
  a.readInt16 = function() {
    return this.decodeInt(2, true)
  };
  a.readUInt32 = function() {
    return this.decodeInt(4, false)
  };
  a.readInt32 = function() {
    return this.decodeInt(4, true)
  };
  a.readFloat32 = function() {
    return this.decodeFloat(4, 23)
  };
  a.readFloat64 = function() {
    return this.decodeFloat(8, 52)
  };
  a.readBytes = function(b, c) {
    var e = c;
    if (this.offset + c > this.data.length) e = this.data.length - this.offset;
    for (c = 0; c < e; c++) b[c] = this.data[this.offset++].charCodeAt(0) & 255;
    return e
  };
  a.decodeInt = function(b, c) {
    if (this.offset + b > this.data.length) {
      this.offset = this.data.length;
      return NaN
    }
    for (var e = 0, d = 1, f = 0; f < b; f++) {
      e += (this.data[this.offset++].charCodeAt(0) & 255) * d;
      d *= 256
    }
    if (c && e & Math.pow(2, b * 8 - 1)) e -= Math.pow(2, b * 8);
    return e
  };
  a.decodeFloat = function(b, c) {
    if (this.offset + b > this.data.length) {
      this.offset = this.data.length;
      return NaN
    }
    var e = b * 8 - c - 1,
      d = (1 << e) - 1,
      f = d >> 1,
      g = b - 1,
      h = this.data[this.offset + g].charCodeAt(0) & 255;
    g += -1;
    var i = -7,
      l = h & (1 << -i) - 1;
    h >>= -i;
    for (i += e; i > 0;) {
      l = l * 256 + (this.data[this.offset + g].charCodeAt(0) & 255);
      g += -1;
      i -= 8
    }
    e = l & (1 << -i) - 1;
    l >>= -i;
    for (i += c; i > 0;) {
      e = e * 256 + (this.data[this.offset + g].charCodeAt(0) & 255);
      g += -1;
      i -= 8
    }
    this.offset += b;
    switch (l) {
      case 0:
        l = 1 - f;
        break;
      case d:
        return e ? NaN : (h ? -1 : 1) * Infinity;
      default:
        e += Math.pow(2,
          c);
        l -= f;
        break
    }
    return (h ? -1 : 1) * e * Math.pow(2, l - c)
  };
  JSC3D.LoaderSelector = {
    registerLoader: function(b, c) {
      if (typeof c == "function") JSC3D.LoaderSelector.loaderTable[b] = c
    },
    getLoader: function(b) {
      b = JSC3D.LoaderSelector.loaderTable[b.toLowerCase()];
      if (!b) return null;
      var c;
      try {
        c = new b
      } catch (e) {
        c = null
      }
      return c
    },
    loaderTable: {}
  };
  JSC3D.ObjLoader = function(b, c, e, d) {
    this.onload = b && typeof b == "function" ? b : null;
    this.onerror = c && typeof c == "function" ? c : null;
    this.onprogress = e && typeof e == "function" ? e : null;
    this.onresource = d && typeof d == "function" ? d : null;
    this.requestCount = 0;
    this.requests = []
  };
  a = JSC3D.ObjLoader.prototype;
  a.loadFromUrl = function(b) {
    var c = "",
      e = b,
      d = b.lastIndexOf("/");
    if (d == -1) d = b.lastIndexOf("\\");
    if (d != -1) {
      c = b.substring(0, d + 1);
      e = b.substring(d + 1)
    }
    this.requestCount = 0;
    this.loadObjFile(c, e)
  };
  a.abort = function() {
    for (var b = 0; b < this.requests.length; b++) this.requests[b].abort();
    this.requests = [];
    this.requestCount = 0
  };
  a.loadObjFile = function(b, c) {
    var e = b + c,
      d = this;
    c = new XMLHttpRequest;
    c.open("GET", e, true);
    c.onreadystatechange = function() {
      if (this.readyState == 4)
        if (this.status == 200 || this.status == 0) {
          if (d.onload) {
            d.onprogress && d.onprogress("Loading obj file ...", 1);
            JSC3D.console && JSC3D.console.logInfo('Finished loading obj file "' + e + '".');
            var f = new JSC3D.Scene,
              g = d.parseObj(f, this.responseText);
            if (g.length > 0)
              for (var h = 0; h < g.length; h++) d.loadMtlFile(f, b, g[h]);
            d.requests.splice(d.requests.indexOf(this), 1);
            --d.requestCount ==
              0 && d.onload(f)
          }
        } else {
          d.requests.splice(d.requests.indexOf(this), 1);
          d.requestCount--;
          JSC3D.console && JSC3D.console.logError('Failed to load obj file "' + e + '".');
          d.onerror && d.onerror('Failed to load obj file "' + e + '".')
        }
    };
    if (this.onprogress) {
      this.onprogress("Loading obj file ...", 0);
      c.onprogress = function(f) {
        d.onprogress("Loading obj file ...", f.position / f.totalSize)
      }
    }
    this.requests.push(c);
    this.requestCount++;
    c.send()
  };
  a.loadMtlFile = function(b, c, e) {
    var d = c + e,
      f = this,
      g = new XMLHttpRequest;
    g.open("GET", d, true);
    g.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200 || this.status == 0) {
          f.onprogress && f.onprogress("Loading mtl file ...", 1);
          JSC3D.console && JSC3D.console.logInfo('Finished loading mtl file "' + d + '".');
          for (var h = f.parseMtl(this.responseText), i = {}, l = b.getChildren(), o = 0; o < l.length; o++) {
            var u = l[o];
            if (u.mtl != null && u.mtllib != null && u.mtllib == e) {
              var j = h[u.mtl];
              if (j != null) {
                j.material != null && u.setMaterial(j.material);
                if (j.textureFileName != "")
                  if (i[j.textureFileName]) i[j.textureFileName].push(u);
                  else i[j.textureFileName] = [u]
              }
            }
          }
          for (var B in i) f.setupTexture(i[B], c + B)
        } else JSC3D.console && JSC3D.console.logWarning('Failed to load mtl file "' + d + '". A default material will be applied.');
        f.requests.splice(f.requests.indexOf(this), 1);
        --f.requestCount == 0 && f.onload(b)
      }
    };
    if (this.onprogress) {
      this.onprogress("Loading mtl file ...", 0);
      g.onprogress = function(h) {
        f.onprogress("Loading mtl file ...", h.position / h.totalSize)
      }
    }
    this.requests.push(g);
    this.requestCount++;
    g.send()
  };
  a.parseObj = function(b, c) {
    var e = {},
      d = [],
      f = 0,
      g = null,
      h = "",
      i = "",
      l = [],
      o = [];
    g = "obj-" + f++;
    var u = new JSC3D.Mesh;
    u.name = g;
    u.indexBuffer = [];
    g = e.nomtl = u;
    var j = c.split(/[ \t]*\r?\n[ \t]*/);
    for (c = 0; c < j.length; c++) {
      i = j[c].split(/[ \t]+/);
      if (i.length > 0) switch (i[0]) {
        case "v":
          if (i.length > 3)
            for (var B = 1; B < 4; B++) l.push(parseFloat(i[B]));
          break;
        case "vn":
          break;
        case "vt":
          if (i.length > 2) {
            o.push(parseFloat(i[1]));
            o.push(1 - parseFloat(i[2]))
          }
          break;
        case "f":
          if (i.length > 3) {
            for (B = 1; B < i.length; B++) {
              var m = i[B].split("/"),
                M = parseInt(m[0]) -
                1;
              g.indexBuffer.push(M);
              if (m.length > 1)
                if (m[1] != "") {
                  if (!g.texCoordIndexBuffer) g.texCoordIndexBuffer = [];
                  g.texCoordIndexBuffer.push(parseInt(m[1]) - 1)
                } else if (m.length < 3 || m[2] == "") {
                if (!g.texCoordIndexBuffer) g.texCoordIndexBuffer = [];
                g.texCoordIndexBuffer.push(M)
              }
            }
            g.indexBuffer.push(-1);
            g.texCoordIndexBuffer && g.texCoordIndexBuffer.push(-1)
          }
          break;
        case "mtllib":
          if (i.length > 1) {
            h = i[1];
            d.push(h)
          } else h = "";
          break;
        case "usemtl":
          if (i.length > 1 && i[1] != "" && h != "") {
            i = i[1];
            B = h + "-" + i;
            g = e[B];
            if (!g) {
              g = new JSC3D.Mesh;
              g.name =
                "obj-" + f++;
              g.indexBuffer = [];
              g.mtllib = h;
              g.mtl = i;
              e[B] = g
            }
            g = g
          } else g = u;
          break;
        case "#":
        default:
          break
      }
    }
    f = l.length >= 3 ? new Array(l.length / 3) : null;
    h = o.length >= 2 ? new Array(o.length / 2) : null;
    for (var H in e) {
      g = e[H];
      if (l.length >= 3 && g.indexBuffer.length > 0) {
        for (c = 0; c < f.length; c++) f[c] = -1;
        g.vertexBuffer = [];
        for (c = j = u = 0; c < g.indexBuffer.length; c++) {
          u = g.indexBuffer[c];
          if (u != -1)
            if (f[u] == -1) {
              i = u * 3;
              g.vertexBuffer.push(l[i]);
              g.vertexBuffer.push(l[i + 1]);
              g.vertexBuffer.push(l[i + 2]);
              g.indexBuffer[c] = j;
              f[u] = j;
              j++
            } else g.indexBuffer[c] =
              f[u]
        }
      }
      if (o.length >= 2 && g.texCoordIndexBuffer != null && g.texCoordIndexBuffer.length > 0) {
        for (c = 0; c < h.length; c++) h[c] = -1;
        g.texCoordBuffer = [];
        for (c = j = u = 0; c < g.texCoordIndexBuffer.length; c++) {
          u = g.texCoordIndexBuffer[c];
          if (u != -1)
            if (h[u] == -1) {
              i = u * 2;
              g.texCoordBuffer.push(o[i]);
              g.texCoordBuffer.push(o[i + 1]);
              g.texCoordIndexBuffer[c] = j;
              h[u] = j;
              j++
            } else g.texCoordIndexBuffer[c] = h[u]
        }
      }
      g.isTrivial() || b.addChild(g)
    }
    return d
  };
  a.parseMtl = function(b) {
    var c = {},
      e = "";
    b = b.split(/[ \t]*\r?\n[ \t]*/);
    for (var d = 0; d < b.length; d++) {
      var f = b[d].split(/[ \t]+/);
      if (f.length > 0) switch (f[0]) {
        case "newmtl":
          e = f[1];
          f = {};
          f.material = new JSC3D.Material;
          f.textureFileName = "";
          c[e] = f;
          break;
        case "Ka":
          break;
        case "Kd":
          if (f.length == 4 && !isNaN(f[1])) {
            var g = parseFloat(f[1]) * 255 & 255,
              h = parseFloat(f[2]) * 255 & 255,
              i = parseFloat(f[3]) * 255 & 255;
            f = c[e];
            if (f != null) f.material.diffuseColor = g << 16 | h << 8 | i
          }
          break;
        case "Ks":
          break;
        case "d":
          if (f.length == 2 && !isNaN(f[1])) {
            g = parseFloat(f[1]);
            f = c[e];
            if (f != null) f.material.transparency = 1 - g
          }
          break;
        case "illum":
          break;
        case "map_Kd":
          if (f.length == 2) {
            g = f[1];
            f = c[e];
            if (f != null) f.textureFileName = g
          }
          break;
        case "#":
        default:
          break
      }
    }
    return c
  };
  a.setupTexture = function(b, c) {
    var e = this,
      d = new JSC3D.Texture;
    d.onready = function() {
      for (var f = 0; f < b.length; f++) b[f].setTexture(this);
      e.onresource && e.onresource(this)
    };
    d.createFromUrl(c)
  };
  a.onload = null;
  a.onerror = null;
  a.onprogress = null;
  a.onresource = null;
  a.requestCount = 0;
  JSC3D.LoaderSelector.registerLoader("obj", JSC3D.ObjLoader);
  JSC3D.StlLoader = function(b, c, e, d) {
    this.onload = b && typeof b == "function" ? b : null;
    this.onerror = c && typeof c == "function" ? c : null;
    this.onprogress = e && typeof e == "function" ? e : null;
    this.onresource = d && typeof d == "function" ? d : null;
    this.decimalPrecision = 3;
    this.request = null
  };
  a = JSC3D.StlLoader.prototype;
  a.loadFromUrl = function(b) {
    var c = this,
      e = JSC3D.PlatformInfo.browser == "ie",
      d = new XMLHttpRequest;
    d.open("GET", b, true);
    e ? d.setRequestHeader("Accept-Charset", "x-user-defined") : d.overrideMimeType("text/plain; charset=x-user-defined");
    d.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200 || this.status == 0) {
          JSC3D.console && JSC3D.console.logInfo('Finished loading STL file "' + b + '".');
          if (c.onload) {
            c.onprogress && c.onprogress("Loading STL file ...", 1);
            if (e) {
              var f = new JSC3D.Scene;
              try {
                c.parseStl(f,
                  function(h) {
                    for (var i = "", l = 0; l < h.length - 65536; l += 65536) i += String.fromCharCode.apply(null, h.slice(l, l + 65536));
                    return i + String.fromCharCode.apply(null, h.slice(l))
                  }((new VBArray(this.responseBody)).toArray()))
              } catch (g) {}
            } else {
              f = new JSC3D.Scene;
              c.parseStl(f, this.responseText)
            }
            c.onload(f)
          }
        } else {
          JSC3D.console && JSC3D.console.logError('Failed to load STL file "' + b + '".');
          c.onerror && c.onerror('Failed to load STL file "' + b + '".')
        }
        c.request = null
      }
    };
    if (this.onprogress) {
      this.onprogress("Loading STL file ...", 0);
      d.onprogress = function(f) {
        c.onprogress("Loading STL file ...", f.position / f.totalSize)
      }
    }
    this.request = d;
    d.send()
  };
  a.abort = function() {
    if (this.request) {
      this.request.abort();
      this.request = null
    }
  };
  a.setDecimalPrecision = function(b) {
    this.decimalPrecision = b
  };
  a.parseStl = function(b, c) {
    var e = new JSC3D.Mesh;
    e.vertexBuffer = [];
    e.indexBuffer = [];
    e.faceNormalBuffer = [];
    var d = false,
      f = new JSC3D.BinaryStream(c);
    f.skip(84);
    for (var g = 0; g < 256 && !f.eof(); g++)
      if (f.readUInt8() > 127) {
        d = true;
        break
      }
    if (JSC3D.console) JSC3D.console.logInfo("This is recognised as " + (d ? "a binary" : "an ASCII") + " STL file.");
    if (d) {
      f.reset();
      f.skip(80);
      d = f.readUInt32();
      c = 84 + 50 * d;
      if (f.size() < c) {
        JSC3D.console && JSC3D.console.logError("Failed to parse contents of the file. It seems not complete.");
        return
      }
      e.faceCount =
        d;
      h = {};
      for (g = 0; g < d; g++) {
        e.faceNormalBuffer.push(f.readFloat32());
        e.faceNormalBuffer.push(f.readFloat32());
        e.faceNormalBuffer.push(f.readFloat32());
        for (c = 0; c < 3; c++) {
          i = f.readFloat32();
          l = f.readFloat32();
          o = f.readFloat32();
          u = i.toFixed(this.decimalPrecision) + "-" + l.toFixed(this.decimalPrecision) + "-" + o.toFixed(this.decimalPrecision);
          j = h[u];
          if (j == undefined) {
            j = e.vertexBuffer.length / 3;
            h[u] = j;
            e.vertexBuffer.push(i);
            e.vertexBuffer.push(l);
            e.vertexBuffer.push(o)
          }
          e.indexBuffer.push(j)
        }
        e.indexBuffer.push(-1);
        f.skip(2)
      }
    } else {
      f =
        new RegExp("facet\\s+normal\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+outer\\s+loop\\s+vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+endloop\\s+endfacet",
          "ig");
      if (g = c.match(f)) {
        d = g.length;
        e.faceCount = d;
        var h = {};
        f.lastIndex = 0;
        f.global = false;
        for (d = f.exec(c); d != null; d = f.exec(c)) {
          e.faceNormalBuffer.push(parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]));
          for (g = 0; g < 3; g++) {
            var i = parseFloat(d[4 + g * 3]),
              l = parseFloat(d[5 + g * 3]),
              o = parseFloat(d[6 + g * 3]),
              u = i.toFixed(this.decimalPrecision) + "-" + l.toFixed(this.decimalPrecision) + "-" + o.toFixed(this.decimalPrecision),
              j = h[u];
            if (j === undefined) {
              j = e.vertexBuffer.length / 3;
              h[u] = j;
              e.vertexBuffer.push(i);
              e.vertexBuffer.push(l);
              e.vertexBuffer.push(o)
            }
            e.indexBuffer.push(j)
          }
          e.indexBuffer.push(-1)
        }
      }
    }
    if (!e.isTrivial()) {
      if (Math.abs(e.faceNormalBuffer[0]) < 1.0E-6 && Math.abs(e.faceNormalBuffer[1]) < 1.0E-6 && Math.abs(e.faceNormalBuffer[2]) < 1.0E-6) e.faceNormalBuffer = null;
      b.addChild(e)
    }
  };
  a.onload = null;
  a.onerror = null;
  a.onprogress = null;
  a.onresource = null;
  a.decimalPrecision = 3;
  JSC3D.LoaderSelector.registerLoader("stl", JSC3D.StlLoader);

  return JSC3D;

}
