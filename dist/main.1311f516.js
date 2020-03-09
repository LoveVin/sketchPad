// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
/*本地存储*/
var stor = JSON.parse(localStorage.getItem('colorHashMap'));
var storColor = JSON.parse(localStorage.getItem('currentColor'));
var currentColor;
var colorHashMap;

if (stor) {
  colorHashMap = stor;
} else {
  colorHashMap = [];
}

if (storColor) {
  currentColor = storColor;
} else {
  currentColor = '#000000';
}
/*本地读取*/


document.querySelectorAll('.paintTools .palette > div').forEach(function (element, index) {
  if (index < colorHashMap.length) {
    element.style.backgroundColor = colorHashMap[index];
    element.dataset.color = colorHashMap[index];
  }
});
/*Canvas相关*/

var canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineCap = "round";
var IsPoint = false;
var last;
var isTouchDevice = 'ontouchstart' in document.documentElement;
var isPaint = true;
var currentWidth = 2;
document.querySelector('#colorSelector').value = currentColor;

function drawline(x1, y1, x2, y2) {
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

if (isTouchDevice) {
  canvas.ontouchstart = function (e) {
    e.preventDefault();
    last = [e.touches[0].clientX, e.touches[0].clientY];
  };

  canvas.ontouchmove = function (e) {
    e.preventDefault();
    drawline(last[0], last[1], e.touches[0].clientX, e.touches[0].clientY);
    last = [e.touches[0].clientX, e.touches[0].clientY];
  };
} else {
  if (canvas.getContext) {
    console.log("该设备支持canvas画板");

    canvas.onmousedown = function (e) {
      IsPoint = true;
      last = [e.clientX, e.clientY];
    };

    canvas.onmousemove = function (e) {
      if (IsPoint === true) {
        drawline(last[0], last[1], e.clientX, e.clientY);
        last = [e.clientX, e.clientY];
      }
    };

    canvas.onmouseup = function () {
      IsPoint = false;
    };
  } else {
    console.log("该设备不支持canvas画板");
  }
}
/*页面元素*/


var currentIndex = colorHashMap.length + 1 || 1;

colorSelector.onchange = function (e) {
  var element = document.querySelector(".palette div:nth-child(".concat(currentIndex, ")"));
  element.style.backgroundColor = e.target.value;
  element.dataset.color = e.target.value;
  currentIndex = currentIndex % 15 + 1;
  currentColor = e.target.value;
  colorHashMap.push(e.target.value);
};

document.querySelectorAll('.paintTools .palette > div').forEach(function (element, index) {
  element.dataset.index = index + 1;

  element.onclick = function (e) {
    if (e.target.style.backgroundColor && isPaint) {
      currentColor = e.target.dataset.color;
      document.querySelector('#colorSelector').value = currentColor;
    }
  };
});

document.querySelector('.paintWidth .widthSelector').onclick = function () {
  this.nextElementSibling.classList.toggle('hidden');
};

document.querySelector('.icon-erase').onclick = function () {
  this.previousElementSibling.classList.remove('selected');
  this.classList.add('selected');
  currentColor = '#ffffff';
  isPaint = false;
};

document.querySelector('.icon-pen').onclick = function () {
  this.nextElementSibling.classList.remove('selected');
  this.classList.add('selected');
  isPaint = true;
  currentColor = document.querySelector('#colorSelector').value;
};

document.querySelectorAll('.lineSelector > div').forEach(function (el) {
  el.onclick = function () {
    var siblings = this.parentNode.children;

    for (var i = 0; i < siblings.length; i++) {
      if (siblings[i] !== this) {
        siblings[i].classList.remove('selected');
      }
    }

    this.classList.add('selected');
    currentWidth = parseInt(this.dataset.line);
    document.querySelector('.paintWidth .lineSelector').classList.add('hidden');
  };
});

document.querySelector('.finishOrclear .icon-clear').onclick = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

document.querySelector('.finishOrclear .icon-download').onclick = function () {
  var url = canvas.toDataURL('image/png'); //JavaScript初始化下载方法

  var a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = 'sketchPad.png'; //执行下载

  a.click();
  document.body.removeChild(a);
};
/*离开页面前存储数据*/


window.onbeforeunload = function () {
  var hashString1 = JSON.stringify(colorHashMap);
  localStorage.setItem('colorHashMap', hashString1);

  if (!isPaint) {
    currentColor = document.querySelector('#colorSelector').value;
  }

  var hashString2 = JSON.stringify(currentColor);
  localStorage.setItem('currentColor', hashString2);
};
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.1311f516.js.map