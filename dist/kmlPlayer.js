/*! kmlplayer.js - v0.3.1 */
var kmlPlayer=function(){"use strict";function e(){try{var e=window.self!==window.top;if(e)for(var t=parent.document.getElementsByTagName("IFRAME"),n=0;n<t.length;n++){var i=t[n];i.contentWindow===window&&(e=i,i.setAttribute("allowfullscreen","true"),i.setAttribute("mozallowfullscreen","true"),i.setAttribute("webkitallowfullscreen","true"),i.setAttribute("frameborder","0"))}return e}catch(e){return!0}}function t(e){return e.charAt(0).toUpperCase()+e.slice(1)}function n(e){if(void 0===e||null===e)return!1;var t=!1;return e.indexOf&&e.indexOf("%")>-1&&(t=parseFloat(e)),t}function i(e){return"function"==typeof e||!1}function o(e,t,n){var i=!1,o=!1;return"px"!=e.units&&(e.units="em"),e.min!==!1&&e.ratio!==!1&&(i=e.ratio*t/1e3,i<e.min&&(i=e.min),"px"==e.units&&(i=Math.ceil(i)),!isNaN(e.lineHeight)&&e.lineHeight&&(o=i*e.lineHeight,o<1&&(o=1),o=+o.toFixed(3)+e.units),i=+i.toFixed(3)+e.units),n&&(i&&(n.style.fontSize=i),o&&(n.style.lineHeight=o)),{fontSize:i,lineHeight:o}}function r(e,t){return t={exports:{}},e(t,t.exports),t.exports}function s(e){try{throw new Error(e)}catch(e){return}}function a(){var e=0,t=0;this.save=function(){e=window.pageXOffset||0,t=window.pageYOffset||0},this.restore=function(){window.scrollTo(e,t)}}function l(e){for(var t=x.selectAll("source",e),n=0;n<t.length;n++)x.removeElement(t[n]);e.setAttribute("src","data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAGm1kYXQAAAGzABAHAAABthBgUYI9t+8AAAMNbW9vdgAAAGxtdmhkAAAAAMXMvvrFzL76AAAD6AAAACoAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAABhpb2RzAAAAABCAgIAHAE/////+/wAAAiF0cmFrAAAAXHRraGQAAAAPxcy++sXMvvoAAAABAAAAAAAAACoAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAgAAAAIAAAAAAG9bWRpYQAAACBtZGhkAAAAAMXMvvrFzL76AAAAGAAAAAEVxwAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABaG1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAShzdGJsAAAAxHN0c2QAAAAAAAAAAQAAALRtcDR2AAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAgACABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAXmVzZHMAAAAAA4CAgE0AAQAEgICAPyARAAAAAAMNQAAAAAAFgICALQAAAbABAAABtYkTAAABAAAAASAAxI2IAMUARAEUQwAAAbJMYXZjNTMuMzUuMAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAASAAAAAQAAABRzdGNvAAAAAAAAAAEAAAAsAAAAYHVkdGEAAABYbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAraWxzdAAAACOpdG9vAAAAG2RhdGEAAAABAAAAAExhdmY1My4yMS4x"),e.load()}function u(e,t){switch(t){case"video/webm":return!(!e.canPlayType||!e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/,""));case"video/mp4":return!(!e.canPlayType||!e.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/,""));case"video/ogg":return!(!e.canPlayType||!e.canPlayType('video/ogg; codecs="theora"').replace(/no/,""))}}function d(e){var t=this,n=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=q();i&&!function(){var o=!1,r=!1,s=!1,a=function(){r=!0},l={visible:function(){},hidden:function(){}},u=function(){l={visible:function(){},hidden:function(){}},o=!1,r=!1,Q.removeEventListener(Y,d,!1),e.removeEventListener("playing",a)},d=function(){o&&(Q[I]?(r&&!e.paused&&(e.pause(),s=!0),l.hidden()):(s&&e.paused&&(e.play(),s=!1),l.visible()))},c=function(t){i&&(Q.removeEventListener(Y,d,!1),e.removeEventListener("playing",a),l.visible=t.onVisible||l.visible,l.hidden=t.onHidden||l.hidden,o=!0,Q.addEventListener(Y,d,!1),e.addEventListener("playing",a))};l.visible=n.onVisible||l.visible,l.hidden=n.onHidden||l.hidden,o=!0,Q.addEventListener(Y,d,!1),e.addEventListener("playing",a),t.init=c,t.destroy=u,t.on=function(e,t){e in l&&(l[e]=t)},t.enabled=function(e){return"boolean"==typeof e&&(o=e),o}}()}var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},h=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},A=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},f=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t};!function(){for(var e=0,t=["ms","moz","webkit","o"],n=0;n<t.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame&&!/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||(window.requestAnimationFrame=function(t,n){var i=(new Date).getTime(),o=Math.max(0,16-(i-e)),r=window.setTimeout(function(){t(i+o)},o);return e=i+o,r}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})}(),function(e,t){if("function"!=typeof e.createEvent)return!1;var n,i,o,r,s,a,l,u,d="undefined"!=typeof jQuery,c=function(e){var t=e.toLowerCase(),n="MS"+e;return navigator.msPointerEnabled?n:t},h=!1,A={touchstart:c("PointerDown")+" touchstart",touchend:c("PointerUp")+" touchend",touchmove:c("PointerMove")+" touchmove"},f=function(e,t,n){for(var i=t.split(" "),o=i.length;o--;)e.addEventListener(i[o],n,!1)},p=function(e){return e.targetTouches?e.targetTouches[0]:e},m=function(){return(new Date).getTime()},v=function(t,o,r,s){var a=e.createEvent("Event");if(a.originalEvent=r,s=s||{},s.x=n,s.y=i,s.distance=s.distance,d&&(a=jQuery.Event(o,{originalEvent:r}),jQuery(t).trigger(a,s)),a.initEvent){for(var l in s)a[l]=s[l];a.initEvent(o,!0,!0),t.dispatchEvent(a)}for(;t;)t["on"+o]&&t["on"+o](a),t=t.parentNode},y=function(e){if("mousedown"!==e.type&&(h=!0),"mousedown"!==e.type||!h){var t=p(e);o=n=t.pageX,r=i=t.pageY,u=setTimeout(function(){v(e.target,"longtap",e),a=e.target},_),s=m(),S++}},g=function(e){if("mouseup"===e.type&&h)return void(h=!1);var t=[],d=m(),c=r-i,A=o-n;if(clearTimeout(l),clearTimeout(u),A<=-b&&t.push("swiperight"),A>=b&&t.push("swipeleft"),c<=-b&&t.push("swipedown"),c>=b&&t.push("swipeup"),t.length){for(var f=0;f<t.length;f++){var p=t[f];v(e.target,p,e,{distance:{x:Math.abs(A),y:Math.abs(c)}})}S=0}else o>=n-C&&o<=n+C&&r>=i-C&&r<=i+C&&s+x-d>=0&&(v(e.target,S>=2&&a===e.target?"dbltap":"tap",e),a=e.target),l=setTimeout(function(){S=0},E)},w=function(e){if("mousemove"!==e.type||!h){var t=p(e);n=t.pageX,i=t.pageY}},b=t.SWIPE_THRESHOLD||100,x=t.TAP_THRESHOLD||150,E=t.DBL_TAP_THRESHOLD||200,_=t.LONG_TAP_THRESHOLD||1e3,C=t.TAP_PRECISION/2||30,H=t.JUST_ON_TOUCH_DEVICES,S=0;f(e,A.touchstart+(H?"":" mousedown"),y),f(e,A.touchend+(H?"":" mouseup"),g),f(e,A.touchmove+(H?"":" mousemove"),w)}(document,window);var p=function(){var e=function e(t,n){if(n){var i=Array.isArray(n),o=i&&[]||{};return i?(t=t||[],o=o.concat(t),n.forEach(function(n,i){"undefined"==typeof o[i]?o[i]=n:"object"===("undefined"==typeof n?"undefined":c(n))?o[i]=e(t[i],n):t.indexOf(n)===-1&&o.push(n)})):(t&&"object"===("undefined"==typeof t?"undefined":c(t))&&Object.keys(t).forEach(function(e){o[e]=t[e]}),Object.keys(n).forEach(function(i){"object"===c(n[i])&&n[i]&&t[i]?o[i]=e(t[i],n[i]):o[i]=n[i]})),o}return t||[]};return e}(),m=function(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")},v=void 0,y=void 0,g=void 0,w=void 0;"classList"in document.documentElement?(v=function(e,t){return e.classList.contains(t)},y=function(e,t){if(null!=t){t=t.split(" ");for(var n in t)e.classList.add(t[n])}},g=function(e,t){e.classList.remove(t)}):(v=function(e,t){return m(t).test(e.className)},y=function(e,t){v(e,t)||(e.className=e.className+" "+t)},g=function(e,t){e.className=e.className.replace(m(t)," ")}),w=function(e,t){var n=v(e,t)?g:y;n(e,t)};var b=function(e){var t="Webkit Moz ms O".split(" "),n=document.documentElement.style;if(void 0!==n[e])return e;e=e.charAt(0).toUpperCase()+e.substr(1);for(var i=0;i<t.length;i++)if(void 0!==n[t[i]+e])return t[i]+e},x={stylePrefix:{transform:b("transform"),perspective:b("perspective"),backfaceVisibility:b("backfaceVisibility")},triggerWebkitHardwareAcceleration:function(e){this.stylePrefix.backfaceVisibility&&this.stylePrefix.perspective&&(e.style[this.stylePrefix.perspective]="1000px",e.style[this.stylePrefix.backfaceVisibility]="hidden")},transform:function(e,t){e.style[this.stylePrefix.transform]=t},selectAll:function(e,t){return(t||document).querySelectorAll(e)},select:function(e,t){return(t||document).querySelector(e)},hasClass:v,addClass:y,removeClass:g,toggleClass:w,autoLineHeight:function(e){var t=e.offsetHeight+"px";return e.style.lineHeight=t,t},createElement:function(e,t){var n=document.createElement(e);for(var i in t)n.setAttribute(i,t[i]);return n},emptyElement:function(e){for(;e.firstChild;)e.removeChild(e.firstChild)},replaceElement:function(e,t){e.parentNode.replaceChild(t,e)},removeElement:function(e){e.parentNode.removeChild(e)},insertAfter:function(e,t){t.parentNode.insertBefore(e,t.nextSibling)},insertBefore:function(e,t){t.parentNode.insertBefore(e,t)},getTextContent:function(e){return e.textContent||e.innerText},wrap:function(e,t){e.length||(e=[e]);for(var n=e.length-1;n>=0;n--){var i=n>0?t.cloneNode(!0):t,o=e[n],r=o.parentNode,s=o.nextSibling;return i.appendChild(o),s?r.insertBefore(i,s):r.appendChild(i),i}}},E=function(){var e,t,n,i=(navigator.appVersion,navigator.userAgent),o=navigator.appName,r=""+parseFloat(navigator.appVersion),s=parseInt(navigator.appVersion,10);if("Netscape"==o&&navigator.appVersion.indexOf("Trident")>-1){o="IE";var a=i.indexOf("Edge/");r=i.substring(a+5,i.indexOf(".",a))}else navigator.appVersion.indexOf("Windows NT")!==-1&&navigator.appVersion.indexOf("rv:11")!==-1?(o="IE",r="11;"):(t=i.indexOf("MSIE"))!==-1?(o="IE",r=i.substring(t+5)):(t=i.indexOf("Chrome"))!==-1?(o="Chrome",r=i.substring(t+7)):(t=i.indexOf("Safari"))!==-1?(o="Safari",r=i.substring(t+7),(t=i.indexOf("Version"))!==-1&&(r=i.substring(t+8))):(t=i.indexOf("Firefox"))!==-1?(o="Firefox",r=i.substring(t+8)):(e=i.lastIndexOf(" ")+1)<(t=i.lastIndexOf("/"))&&(o=i.substring(e,t),r=i.substring(t+1),o.toLowerCase()==o.toUpperCase()&&(o=navigator.appName));return(n=r.indexOf(";"))!==-1&&(r=r.substring(0,n)),(n=r.indexOf(" "))!==-1&&(r=r.substring(0,n)),s=parseInt(""+r,10),isNaN(s)&&(r=""+parseFloat(navigator.appVersion),s=parseInt(navigator.appVersion,10)),[o,s]}(),_={browser:E,isIE:function(){return"IE"===E[0]&&E[1]}(),isFirefox:function(){return"Firefox"===E[0]&&E[1]}(),isChrome:function(){return"Chrome"===E[0]&&E[1]}(),isSafari:function(){return"Safari"===E[0]&&E[1]}(),isTouch:"ontouchstart"in document.documentElement,isIos:/(iPad|iPhone|iPod)/g.test(navigator.platform)},C=function(e,t,n){var i=!1,r=function(){o(t,n.width(),e)};this.update=function(i){if(void 0!==i)return t||(t={ratio:1,min:1,lineHeight:!1}),t=p(t,i),o(t,n.width(),e)},this.enabled=function(e){return"boolean"==typeof e&&t&&(i=e),i},n.on&&n.on("resize",r)},H={x:0,y:0,width:"100%",height:"100%",fontSize:null,lineHeight:null,offsetX:0,offsetY:0,originPoint:"topLeft",visible:!1,transform:{x:null,y:null},translate:!0},S=function(e,t){var i=function(){return{offsetX:t.offsetX(),offsetY:t.offsetY(),width:t.width(),height:t.height(),scale:t.width()/t.videoWidth(),scaleY:t.width()/t.videoHeight()}},o={x:0,y:0,width:"100%",height:"100%",fontSize:null,lineHeight:null},r=0,s=0,a=0,l=0,u=null,d=p(H,e),c=!1,h=function(){if(c&&u&&u.nodeType){if(null!==o.width&&(u.style.width=o.width+"px"),null!==o.height&&(u.style.height=o.height+"px"),x.stylePrefix.transform&&d.translate){var e="";null!=o.x&&null!=o.y?(e="translate("+o.x+"px,"+o.y+"px)",u.style.left="auto",u.style.right="auto",u.style.bottom="auto",u.style.top="auto"):(null!=o.x&&(u.style.left="auto",u.style.right="auto",e="translateX("+o.x+"px)"),null!=o.y&&(u.style.bottom="auto",u.style.top="auto",e="translateY("+o.y+"px)")),x.transform(u,e)}else null!=o.x&&null!=o.y?(u.style.left=o.x+"px",u.style.top=o.y+"px"):(null!=o.x&&(u.style.left=o.x+"px"),null!=o.y&&(u.style.top=o.y+"px"));d.fontSize!==o.fontSize&&(u.style.fontSize=o.fontSize=d.fontSize),d.lineHeight!==o.lineHeight&&(u.style.lineHeight=o.lineHeight=d.lineHeight)}},A=function(){var e=t.width(),u=t.height(),c=t.offsetX(),A=t.offsetY();if(r!=e||s!=u||c!=a||A!=l){r=e,s=u,a=c,l=A;var f=i(),p=n(d.width);p?o.width=f.width*p/100:null!=d.width&&(o.width=f.width*f.scale),o.width=Math.ceil(o.width);var m=n(d.height);if(m?o.height=f.height*m/100:null!=d.height&&(o.height=f.height*f.scale),o.height=Math.ceil(o.height),null!=d.x){var v=n(d.x);v?o.x=f.offsetX+f.width*v/100:o.x=f.offsetX+d.x*f.scale,o.x=Math.floor(o.x);var y=n(d.transform.x);y&&(o.x+=y*o.width/100),d.offsetX&&(o.x+=d.offsetX)}if(null!=d.y){var g=n(d.y);g?o.y=f.offsetY+f.height*g/100:o.y=f.offsetY+d.y*f.scale,o.y=Math.floor(o.y);var w=n(d.transform.y);w&&(o.y+=w*o.width/100),d.offsetY&&(o.y+=d.offsetY)}h()}};this.applyTo=function(e){return e&&e.nodeType&&(u=e,A()),u};var f=function(){c&&A()};this.data=function(){return o},this.settings=function(e){return d=p(d,e),A(),d},this.enabled=function(e){return"boolean"==typeof e&&(c=e,e&&f()),c},t.on&&t.on("resize",f)},F=r(function(e){function t(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function n(){}var i=Object.prototype.hasOwnProperty,o="function"!=typeof Object.create&&"~";n.prototype._events=void 0,n.prototype.eventNames=function(){var e,t=this._events,n=[];if(!t)return n;for(e in t)i.call(t,e)&&n.push(o?e.slice(1):e);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(t)):n},n.prototype.listeners=function(e,t){var n=o?o+e:e,i=this._events&&this._events[n];if(t)return!!i;if(!i)return[];if(i.fn)return[i.fn];for(var r=0,s=i.length,a=new Array(s);r<s;r++)a[r]=i[r].fn;return a},n.prototype.emit=function(e,t,n,i,r,s){var a=o?o+e:e;if(!this._events||!this._events[a])return!1;var l,u,d=this._events[a],c=arguments.length;if("function"==typeof d.fn){switch(d.once&&this.removeListener(e,d.fn,void 0,!0),c){case 1:return d.fn.call(d.context),!0;case 2:return d.fn.call(d.context,t),!0;case 3:return d.fn.call(d.context,t,n),!0;case 4:return d.fn.call(d.context,t,n,i),!0;case 5:return d.fn.call(d.context,t,n,i,r),!0;case 6:return d.fn.call(d.context,t,n,i,r,s),!0}for(u=1,l=new Array(c-1);u<c;u++)l[u-1]=arguments[u];d.fn.apply(d.context,l)}else{var h,A=d.length;for(u=0;u<A;u++)switch(d[u].once&&this.removeListener(e,d[u].fn,void 0,!0),c){case 1:d[u].fn.call(d[u].context);break;case 2:d[u].fn.call(d[u].context,t);break;case 3:d[u].fn.call(d[u].context,t,n);break;default:if(!l)for(h=1,l=new Array(c-1);h<c;h++)l[h-1]=arguments[h];d[u].fn.apply(d[u].context,l)}}return!0},n.prototype.on=function(e,n,i){var r=new t(n,i||this),s=o?o+e:e;return this._events||(this._events=o?{}:Object.create(null)),this._events[s]?this._events[s].fn?this._events[s]=[this._events[s],r]:this._events[s].push(r):this._events[s]=r,this},n.prototype.once=function(e,n,i){var r=new t(n,i||this,(!0)),s=o?o+e:e;return this._events||(this._events=o?{}:Object.create(null)),this._events[s]?this._events[s].fn?this._events[s]=[this._events[s],r]:this._events[s].push(r):this._events[s]=r,this},n.prototype.removeListener=function(e,t,n,i){var r=o?o+e:e;if(!this._events||!this._events[r])return this;var s=this._events[r],a=[];if(t)if(s.fn)(s.fn!==t||i&&!s.once||n&&s.context!==n)&&a.push(s);else for(var l=0,u=s.length;l<u;l++)(s[l].fn!==t||i&&!s[l].once||n&&s[l].context!==n)&&a.push(s[l]);return a.length?this._events[r]=1===a.length?a[0]:a:delete this._events[r],this},n.prototype.removeAllListeners=function(e){return this._events?(e?delete this._events[o?o+e:e]:this._events=o?{}:Object.create(null),this):this},n.prototype.off=n.prototype.removeListener,n.prototype.addListener=n.prototype.on,n.prototype.setMaxListeners=function(){return this},n.prefixed=o,"undefined"!=typeof e&&(e.exports=n)}),k=F&&"object"===("undefined"==typeof F?"undefined":c(F))&&"default"in F?F.default:F,L={x:0,y:0,width:0,height:0},W=function(e,t){var i=e.videoWidth()||e.width||1,o=e.videoHeight()||e.height||1,r=p(L,t),s=n(r.width);s===!1&&(s=r.width/i*100);var a=n(r.height);a===!1&&(a=r.height/o*100);var l=n(r.x);l===!1&&(l=r.x/i*100);var u=n(r.y);return u===!1&&(u=r.y/o*100),{x:l,y:u,width:s,height:a}},T=function(e){function t(n,o,r,s){h(this,t);var a=!1,l=!1,u=!1,d=x.select(".body",n),c=f(this,e.call(this));return c.ctx=r,c.body=d,c.config=function(e){e&&(o=p(o,e));var t=new W(s,o);d.style.width=t.width+"%",d.style.height=t.height+"%",x.stylePrefix.transform?x.transform(d,"translate("+100/t.width*t.x+"%,"+100/t.height*t.y+"%)"):(d.style.top=t.x+"%",d.style.left=t.y+"%"),this.emit("config")},c.config(),s.on("resize",c.config),c.hide=function(){l&&(c.emit("beforeHide"),x.addClass(n,"hidden"),l=!1,o.pause&&(a||s.play(),u&&o.externalControls&&s.externalControls.enabled(!0)),setTimeout(function(){n.style.display="none",i(o.onHide)&&o.onHide(),r.checkVisibleElements(),c.emit("hide")},250))},c.show=function(){l||(l=!0,c.emit("beforeShow"),r.enabled(!0),n.style.display="block",setTimeout(function(){x.removeClass(n,"hidden"),i(o.onHide)&&o.onShow(),c.emit("show")},50),o.pause&&(s.paused()?a=!0:(a=!1,s.pause())),o.externalControls&&(s.externalControls.enabled()?(u=!0,s.externalControls.enabled(!1)):u=!0))},o.visible&&c.show(),c.visible=function(e){return"boolean"==typeof e&&(l=e),l},c}return A(t,e),t.prototype.destroy=function(){this.removeAllListeners(),this.ctx.remove(this.body)},t}(k),z=function(e){function t(n,i,o,r){h(this,t);var s=f(this,e.call(this,n,i,o,r)),a=x.createElement("div");x.addClass(a,"overlay triggerClose"),x.insertBefore(a,s.body);var l=document.createElement("h1");x.addClass(l,"header"),s._title=document.createElement("span"),l.appendChild(s._title),s._closeBtn=document.createElement("a"),s._closeBtn.innerHTML="<img src='svg/ic_close.svg'/>",x.addClass(s._closeBtn,"closeBtn"),s._closeBtn.addEventListener("click",s.hide),l.appendChild(s._closeBtn),s.body.appendChild(l),s.backgroundColor=function(e){return null!=e&&(a.style.backgroundColor=e),a.style.backgroundColor},s.scaleSize=function(e){this.config({x:(100-e)/2+"%",y:(100-e)/2+"%",width:e+"%",height:e+"%"})},r.on("resize",function(){s.emit("resize")}),["resize","config","beforeShow"].map(function(e){s.on(e,function(){s.autoLineHeight()})});for(var u=x.selectAll(".triggerClose",n),d=0,c=u.length;d<c;d+=1)u[d].addEventListener("click",s.hide);return s}return A(t,e),t.prototype.destroy=function(){this.removeAllListeners(),this.ctx.remove(this.body),x.removeElement(this.body.parentNode)},t.prototype.autoLineHeight=function(e){this.visible()&&(e?x.autoLineHeight(e):x.autoLineHeight(this._title.parentNode))},t.prototype.title=function(e){return null!=e?(this._title.innerHTML=e,this.autoLineHeight(),e):this._title.innerHTML},t}(T),O=!1,P="webkit moz o ms khtml".split(" "),N="";if("undefined"!=typeof document.cancelFullScreen)O=!0;else for(var R=0,B=P.length;R<B;R++){if(N=P[R],"undefined"!=typeof document[N+"CancelFullScreen"]){O=!0;break}if("undefined"!=typeof document.msExitFullscreen&&document.msFullscreenEnabled){N="ms",O=!0;break}}var M=""===N?"fullscreenchange":N+"fullscreenchange";M=M.toLowerCase();var I,Y,X=function(e){function t(){h(this,t);var n=f(this,e.call(this));if(n.iframe=null,n.scrollPosition=new a,n._fullscreenElement=null,n.fullscreenElementStyle={},O){var i=function(){n.isFullScreen()||setTimeout(n.scrollPosition.restore,100)};document.addEventListener(M,i,!1)}return n}return A(t,e),t.prototype.defualtFullScreenElement=function(e){var t=e;return null==t&&(t=this.iframe?this.iframe:this.wrapper),t},t.prototype.onFullscreenChange=function(e){this.media.addEventListener(M,function(e){return e.preventDefault(),e.stopPropagation,!1},!0)},t.prototype.isFullWindow=function(){return!1},t.prototype.isFullScreen=function(e){if(!O)return this.isFullWindow();var t=this.defualtFullScreenElement(e);switch(N){case"":return document.fullscreenElement==t;case"moz":return document.mozFullScreenElement==t;default:return document[N+"FullscreenElement"]==t}},t.prototype.requestFullWindow=function(e){if(!(this.isFullWindow()||O&&this.isFullScreen())){var t=this.defualtFullScreenElement(e);this.scrollPosition.save();var n=t.style;this.fullscreenElementStyle.position=n.position||"",this.fullscreenElementStyle.margin=n.margin||"",this.fullscreenElementStyle.top=n.top||"",this.fullscreenElementStyle.left=n.left||"",this.fullscreenElementStyle.width=n.width||"",this.fullscreenElementStyle.height=n.height||"",this.fullscreenElementStyle.zIndex=n.zIndex||"",this.fullscreenElementStyle.maxWidth=n.maxWidth||"",this.fullscreenElementStyle.maxHeight=n.maxHeight||"",t.style.position="absolute",t.style.top=t.style.left=0,t.style.margin=0,t.style.maxWidth=t.style.maxHeight=t.style.width=t.style.height="100%",t.style.zIndex=2147483647,this._fullscreenElement=t,this.isFullWindow=function(){return!0}}},t.prototype.requestFullScreen=function(e){var t=this.defualtFullScreenElement(e);return O?(this.scrollPosition.save(),""===N?t.requestFullScreen():t[N+("ms"==N?"RequestFullscreen":"RequestFullScreen")]()):void this.requestFullWindow(t)},t.prototype.cancelFullWindow=function(){if(this.isFullWindow()&&(!O||!this.isFullScreen())){for(var e in this.fullscreenElementStyle)this._fullscreenElement.style[e]=this.fullscreenElementStyle[e];this._fullscreenElement=null,this.isFullWindow=function(){return!1},this.scrollPosition.restore()}},t.prototype.cancelFullScreen=function(){return O?""===N?document.cancelFullScreen():document[N+("ms"==N?"ExitFullscreen":"CancelFullScreen")]():void this.cancelFullWindow()},t.prototype.toggleFullWindow=function(e){var t=!this.isFullWindow();t?this.requestFullWindow(e):this.cancelFullWindow()},t.prototype.toggleFullScreen=function(e){var t=this.isFullScreen();t?this.cancelFullScreen():this.requestFullScreen(e)},t.prototype.fullscreenElement=function(){return O?""===N?document.fullscreenElement:document[N+"FullscreenElement"]:this._fullscreenElement},t}(k),j=["ended","progress","stalled","playing","waiting","canplay","canplaythrough","loadstart","loadeddata","loadedmetadata","timeupdate","volumechange","play","playing","pause","error","seeking","emptied","seeked","ratechange","suspend"],V=function(e){function t(n){h(this,t);var i=f(this,e.call(this));return null==n?(s("You need to supply a HTMLVideoElement to instantiate the player"),f(i)):(i.media=n,j.forEach(function(e){n.addEventListener(e,function(){i.emit(e)})}),i.canPlay={mp4:u(n,"video/mp4"),webm:u(n,"video/webm"),ogg:u(n,"video/ogg")},i)}return A(t,e),t.prototype.autoplay=function(e){return"boolean"==typeof e&&(this.media.autoplay=e),this.media.autoplay},t.prototype.buffered=function(){return this.media.buffered},t.prototype.nativeControls=function(e){return"boolean"==typeof e&&(this.media.controls=e),this.media.controls},t.prototype.crossorigin=function(e){return"use-credentials"===e?(this.media.crossOrigin="use-credentials",e):e?(this.media.crossOrigin="anonymous","anonymous"):(e===!1&&(this.media.crossOrigin=null),this.media.crossOrigin)},t.prototype.loop=function(e){return"boolean"==typeof e&&(this.media.loop=e),this.media.loop},t.prototype.muted=function(e){return"boolean"==typeof e&&(this.media.muted=e),this.media.muted},t.prototype.mute=function(){this.muted(!0)},t.prototype.unmute=function(){this.muted(!1)},t.prototype.toggleMute=function(){return this.muted(!this.muted())},t.prototype.played=function(){return this.media.played},t.prototype.preload=function(e){return"metadata"===e||"meta"===e?(this.media.preload="metadata","metadata"):e?(this.media.preload="auto","auto"):e===!1?(this.media.preload="none","none"):this.media.preload},t.prototype.poster=function(e){return void 0!==e&&(this.media.poster=e),this.media.poster},t.prototype.src=function(e){if(void 0!==e)if(l(this.media),e instanceof Array){var t=0;for(e.length;t+=1;){if("video/mp4"===e[t].type&&this.canPlay.mp4)return this.media.src=e[t].src;if("video/webm"===e[t].type&&this.canPlay.webm)return this.media.src=e[t].src;if("video/ogg"===e[t].type&&this.canPlay.ogg)return this.media.src=e[t].src}}else e.src&&e.type?this.media.src=e.src:this.media.src=e;return this.media.currentSrc},t.prototype.play=function(){this.media.play()},t.prototype.pause=function(){this.media.pause()},t.prototype.paused=function(){return this.media.paused},t.prototype.playing=function(){return this.media.paused},t.prototype.togglePlay=function(){this.media.paused?this.play():this.pause()},t.prototype.currentTime=function(e){return null===e||isNaN(e)?this.media.currentTime:(e=parseFloat(e),e>this.media.duration&&(e=this.media.duration),e<0&&(e=0),this.media.currentTime=e,e)},t.prototype.seek=function(e){return this.currentTime(e)},t.prototype.load=function(e){void 0!==e&&this.src(e),this.media.load()},t.prototype.duration=function(){return this.media.duration},t.prototype.volume=function(e){return null===e||isNaN(e)?this.media.volume:(e=parseFloat(e),e>1&&(e=1),e<0&&(e=0),this.media.volume=e,e)},t}(X),G=function(){var e=0,t=function(t,n){void 0!==n&&(e=n);var i={wrapperWidth:t.offsetWidth,wrapperHeight:t.offsetHeight,scale:e||t.width/t.height,width:0,height:0,offsetX:0,offsetY:0};return i.wrapperScale=i.wrapperWidth/i.wrapperHeight,i.wrapperScale>i.scale?(i.height=i.wrapperHeight,i.width=i.scale*i.height,i.offsetX=(i.wrapperWidth-i.width)/2):(i.width=i.wrapperWidth,i.height=i.width/i.scale,i.offsetY=(i.wrapperHeight-i.height)/2),i};return t}(),Q=document||{};"undefined"!=typeof Q.hidden?(I="hidden",Y="visibilitychange"):"undefined"!=typeof Q.mozHidden?(I="mozHidden",Y="mozvisibilitychange"):"undefined"!=typeof Q.msHidden?(I="msHidden",Y="msvisibilitychange"):"undefined"!=typeof Q.webkitHidden&&(I="webkitHidden",Y="webkitvisibilitychange");var q=function(){return!("undefined"==typeof Q[I])},U=document||{},D=function(e){var t=!0,n=!0,i=null,o=e,r=function(e){if(t){if(o.parentNode.focus(),32==e.keyCode&&(o.paused?o.play():o.pause()),n){if(37==e.keyCode)return void(o.currentTime=o.currentTime-5);if(39==e.keyCode)return void(o.currentTime=o.currentTime+5)}if(38==e.keyCode){var i=o.volume;return i+=.1,i>1&&(i=1),void(o.volume=i)}if(40==e.keyCode){var r=o.volume;return r-=.1,r<0&&(r=0),void(o.volume=r)}}},s=function(e){};this.enabled=function(e){return void 0===e?t:void(t=e)},this.seekEnabled=function(e){return void 0===e?n:void(n=e)},this.init=function(){t=!0,i=null,n=!0,U.body.addEventListener("keydown",r.bind(this),!1),U.body.addEventListener("keyup",s.bind(this),!1)},this.destroy=function(){t=!1,i=null,n=!0,U.body.removeEventListener("keydown",r),U.body.removeEventListener("keyup",s)},this.init()},Z=function(){function e(e){var i=["get","post","put","delete"];return e=e||{},e.baseUrl=e.baseUrl||"",e.method&&e.url?n(e.method,e.baseUrl+e.url,t(e.data),e):i.reduce(function(i,o){return i[o]=function(i,r){return n(o,e.baseUrl+i,t(r),e)},i},{})}function t(e){return e||null}function n(e,t,n,o){var s=["then","catch","always"],l=s.reduce(function(e,t){return e[t]=function(n){return e[t]=n,e},e},{}),u=new XMLHttpRequest;return u.open(e,t,!0),u.withCredentials=o.hasOwnProperty("withCredentials"),i(u,o.headers),u.addEventListener("readystatechange",r(l,u),!1),u.send(a(n)),l.abort=function(){return u.abort()},l}function i(e,t){t=t||{},o(t)||(t["Content-Type"]="application/x-www-form-urlencoded"),Object.keys(t).forEach(function(n){t[n]&&e.setRequestHeader(n,t[n])})}function o(e){return Object.keys(e).some(function(e){return"content-type"===e.toLowerCase()})}function r(e,t){return function n(){t.readyState===t.DONE&&(t.removeEventListener("readystatechange",n,!1),e.always.apply(e,s(t)),t.status>=200&&t.status<300?e.then.apply(e,s(t)):e.catch.apply(e,s(t)))}}function s(e){var t;try{t=JSON.parse(e.responseText)}catch(n){t=e.responseText}return[t,e]}function a(e){return l(e)?u(e):e}function l(e){return"[object Object]"===Object.prototype.toString.call(e)}function u(e){return Object.keys(e).reduce(function(t,n){var i=t?t+"&":"";return i+d(n)+"="+d(e[n])},"")}function d(e){return encodeURIComponent(e)}return e}(),J=function(e){return e.stopPropagation(),e.preventDefault(),!1},$={videoWidth:920,videoHeight:520,autoplay:!1,loop:!1,controls:!1,font:{ratio:1,min:.5,units:"em"},contextMenu:!1},K=function(e){function n(i,o){h(this,n);var r=i.video,s=f(this,e.call(this,r));if(null==r)return f(s);s.device=_,s.__settings={},x.addClass(r,"kml"+t(r.nodeName.toLowerCase())),s.wrapper=x.wrap(s.media,x.createElement("div",{class:"kmlPlayer"})),x.triggerWebkitHardwareAcceleration(s.wrapper),s.settings(p($,i)),s.pageVisibility=new d(r),s.externalControls=new D(r);for(var a in o)s.on(a,o[a],s);return s.on("loadedmetadata",function(){s.media.width==s.media.videoWidth&&s.media.height==s.media.videoHeight||(s.videoWidth(),s.videoHeight(),s.emit("resize"))}),s}return A(n,e),n.prototype.settings=function(e){if(null==e)return this.__settings;this.__settings=p(this.__settings,e);for(var t in this.__settings){if(this[t]){if("autoplay"===t&&this.__settings[t]){this.play();continue}this[t](this.__settings[t])}"controls"===t&&"native"===this.__settings[t]&&this.nativeControls(!0)}return this.__settings},n.prototype.contextMenu=function(e){"boolean"==typeof e&&(e?this.media.removeEventListener("contextmenu",J):this.media.addEventListener("contextmenu",J))},n.prototype.ajax=function(e){return Z(e)},n.prototype.videoWidth=function(e){return this.media.videoWidth?(this.media.width=this.media.videoWidth,this.media.videoWidth):(isNaN(e)||(e=parseFloat(e),this.media.width=e),this.media.width)},n.prototype.videoHeight=function(e){return this.media.videoHeight?(this.media.height=this.media.videoHeight,this.media.videoHeight):(isNaN(e)||(e=parseFloat(e),this.media.height=e),this.media.height)},n.prototype.scale=function(){return this.videoWidth()/this.videoHeight()},n.prototype.bounds=function(e){var t=G(this.media);return null!==t[e]?t[e]:t},n.prototype.width=function(){return this.bounds("width")},n.prototype.height=function(){return this.bounds("height")},n.prototype.offsetX=function(){return this.bounds("offsetX")},n.prototype.offsetY=function(){return this.bounds("offsetY")},n.prototype.wrapperHeight=function(){return this.media.offsetHeight},n.prototype.wrapperWidth=function(){return this.media.offsetWidth},n.prototype.wrapperScale=function(){return this.media.offsetWidth/this.media.offsetHeight},n.prototype.addClass=function(e,t){return null!=t?void x.addClass(e,t):void x.addClass(this.wrapper,e)},n.prototype.removeClass=function(e,t){return null!=t?void x.removeClass(e,t):void("kmlPlayer"!==e&&x.removeClass(this.wrapper,e))},n.prototype.toggleClass=function(e,t){return null!=t?void x.toggleClass(e,t):void("kmlPlayer"!==e&&x.toggleClass(this.wrapper,e))},n}(V),ee=function(e){function t(n,o,r,s){h(this,t);var a=f(this,e.call(this,n,o,r,s)),l=document.createElement("video");a.body.appendChild(l),a.player=new K({video:l}),a.player.container;var u=!1;return a.on("beforeHide",function(){u=a.player.paused(),a.player.pause()}),a.on("show",function(){u||a.player.play()}),a.on("ended",function(){i(o.onEnded)&&o.onEnded()}),o.sizeRatio=o.sizeRatio||80,a.scaleSize=function(e){o.sizeRatio=e,this.emit("resize")},a.player.on("ended",function(){a.emit("ended")}),a.on("resize",function(){var e=0,t=0,n=s.width(),i=s.height(),r=a.player.scale(),l=n,u=i,d=n,c=i,h=10;n>r*i?(l=r*i,u=i,d=l,h=i/10/u*100,l=o.sizeRatio*(l/n*100)/100,u=o.sizeRatio):i>n/r?(u=n/r,l=n,c=u,h=i/10/u*100,u=o.sizeRatio*(u/i*100)/100,l=o.sizeRatio):(l=o.sizeRatio,u=o.sizeRatio),t=(100-l)/2,e=(100-u)/2,a._title.parentNode.style.height=h+"%",a.config({x:t/n*d+"%",y:5+e/i*c+"%",width:l+"%",height:u+"%"}),a.autoLineHeight()}),s.on("loadedmetadata",function(){a.emit("resize")}),a.player.on("loadedmetadata",function(){a.emit("resize")}),a.player.load(o.url),a}return A(t,e),t}(z),te={backgroundColor:"",onHide:null,onShow:null,
externalControls:!0,visible:!1,pause:!0},ne=function(){function e(t){var n=this;h(this,e),this.wrapper=x.createElement("div",{class:"kmlContainers"}),this._els=[];var i=new S({},t);i.applyTo(this.wrapper),this.enabled=function(e){return null!=e&&(0==e&&(e=!1,this.wrapper.style.display="none"),e&&(this.wrapper.style.display="block"),i.enabled(e)),i.enabled()},this.checkVisibleElements=function(){var e=0;for(var t in this._els)this._els[t].visible()&&(e+=1);this.enabled(e)},t.wrapper.appendChild(this.wrapper);var o=[];this.hide=function(e){for(var t in this._els){var n=this._els[t];this._els[t]!==e&&n.visible()&&(n.hide(),o.push(n),n.visible(!1))}},this.show=function(){for(var e in o)o[e].show();o=[]},this.add=function(e){var n=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=arguments[2],o="Container";"container"!=i&&(o="Popup");var r=p(te,e),s=x.createElement("div");t.addClass(s,"kml"+o+" hidden");var a=x.createElement("div");n?n.nodeType||(n=a):n=a,x.addClass(n,"body"),s.appendChild(n);var l=null;switch(i){case"video":l=new ee(s,r,this,t);break;case"popup":l=new z(s,r,this,t);break;default:l=new T(s,r,this,t)}return this._els.push(l),this.wrapper.appendChild(s),l},this.remove=function(e){for(var t=0,i=n._els.length;t<i;t+=1){var o=n._els[t];if(o.body===e){n._els.splice(t,1),0==n._els.length&&n.enabled(!1);break}}}}return e.prototype.els=function(e){return this._els[e]||this._els},e}(),ie=function(e){return e.stopPropagation(),e.preventDefault(),!1},oe={videoWidth:920,videoHeight:520,autoplay:!1,loop:!1,controls:!1,font:{ratio:1,min:.5,units:"em"}},re=function(n){function i(o,r,s){h(this,i);var a=o.video,l=f(this,n.call(this,a));if(l.iframe=e(),null==a)return f(l);l._bounds={},l.device=_,l.__settings=p(oe,o),x.addClass(a,"kml"+t(a.nodeName.toLowerCase())),l.wrapper=x.wrap(l.media,x.createElement("div",{class:"kmlPlayer"})),x.triggerWebkitHardwareAcceleration(l.wrapper),l.inIframe&&x.addClass(l.wrapper,"inFrame");for(var u in l.__settings){if(l[u]){if("autoplay"===u&&l.__settings[u]&&!l.inIframe){l.play();continue}l[u](l.__settings[u])}"controls"===u&&"native"===l.__settings[u]&&l.nativeControls(!0)}l.pageVisibility=new d(a),l.externalControls=new D(a),l.containers=new ne(l),l.container=function(e,t){return this.containers.add(e,t,"container")},l.videoContainer=function(e){return this.containers.add(e,null,"video")},l.popupContainer=function(e){return this.containers.add(e,null,"popup")},"boolean"==typeof l.__settings.font&&l.__settings.font&&(l.__settings.font=oe.font),l.autoFont=new C(l.wrapper,l.__settings.font,l),l.__settings.font&&l.autoFont.enabled(!0);for(var c in r)l.on(c,r[c],l);"function"==typeof s&&s.bind(l),l.on("loadedmetadata",function(){l.media.width==l.media.videoWidth&&l.media.height==l.media.videoHeight||(l.videoWidth(),l.videoHeight(),l.emit("resize")),l._app||(s.bind(l)(),l._app=!0)}),a.addEventListener("dbltap",function(){l.toggleFullScreen()});var A={w:l.width(),x:l.offsetX(),y:l.offsetY(),h:l.height()},m=function e(){l._bounds=G(l.media);var t=l.width(),n=l.width(),i=l.offsetX(),o=l.offsetY();A.w==t&&A.h==n&&A.x==i&&A.y==o||(A.w=t,A.h=n,A.x=i,A.y=o,l.emit("resize")),window.requestAnimationFrame(e)};return m(),l}return A(i,n),i.prototype.contextMenu=function(e){"boolean"==typeof e&&(e?this.media.removeEventListener("contextmenu",ie):this.media.addEventListener("contextmenu",ie))},i.prototype.ajax=function(e){return Z(e)},i.prototype.videoWidth=function(e){return this.media.videoWidth?(this.media.width=this.media.videoWidth,this.media.videoWidth):(isNaN(e)||(e=parseFloat(e),this.media.width=e),this.media.width)},i.prototype.videoHeight=function(e){return this.media.videoHeight?(this.media.height=this.media.videoHeight,this.media.videoHeight):(isNaN(e)||(e=parseFloat(e),this.media.height=e),this.media.height)},i.prototype.scale=function(){return this.videoWidth()/this.videoHeight()},i.prototype.bounds=function(e){return null!==this._bounds[e]?this._bounds[e]:this._bounds},i.prototype.width=function(){return this.bounds("width")},i.prototype.height=function(){return this.bounds("height")},i.prototype.offsetX=function(){return this.bounds("offsetX")},i.prototype.offsetY=function(){return this.bounds("offsetY")},i.prototype.wrapperHeight=function(){return this.media.offsetHeight},i.prototype.wrapperWidth=function(){return this.media.offsetWidth},i.prototype.wrapperScale=function(){return this.media.offsetWidth/this.media.offsetHeight},i.prototype.addClass=function(e,t){return null!=t?void x.addClass(e,t):void x.addClass(this.wrapper,e)},i.prototype.removeClass=function(e,t){return null!=t?void x.removeClass(e,t):void("kmlPlayer"!==e&&x.removeClass(this.wrapper,e))},i.prototype.toggleClass=function(e,t){return null!=t?void x.toggleClass(e,t):void("kmlPlayer"!==e&&x.toggleClass(this.wrapper,e))},i}(V);return _.isTouch&&(window.onerror=function(e,t,n,i){alert(n+":"+i+"-"+e)}),re}();