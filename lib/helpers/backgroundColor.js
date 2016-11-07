let hex_regex = /#[0-9a-f]{3}([0-9a-f]{3})?$/;
let rgb_regex = /rgb\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*\)$/;
let rgba_regex = /rgba\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*,\s*((0.[1-9])|[01])\s*\)$/;
let hsl_regex = /hsl\(\s*(0|[1-9]\d?|[12]\d\d|3[0-5]\d)\s*,\s*((0|[1-9]\d?|100)%)\s*,\s*((0|[1-9]\d?|100)%)\s*\)$/;
let hsla_regex = /hsla\(\s*(-?\d+)%?\s*,\s*(-?\d+)%\s*,\s*(-?\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/;

let parseColor = function(color, alpha){
  let a = null;
  let data = {
  	hex: color.match(hex_regex),
  	rgb: color.match(rgb_regex),
  	rgba: color.match(rgba_regex),
  	hsl: color.match(hsl_regex),
  	hsla: color.match(hsla_regex)
  }
  if(alpha > 1) alpha = 1;
  if(data.hex != null){
  	color = color.split('#').join('');
  	a = alpha ? alpha : 1;
    let bigint = parseInt(color, 16);
  	color = 'rgba('+[bigint >> 16 & 255, bigint >> 8 & 255, bigint & 255, a].join()+')';
  }
  if(data.rgb != null){
  	a = alpha ? alpha : 1;
  	color = 'rgba('+data.rgb[1]+','+data.rgb[2]+','+data.rgb[3]+','+a+')';
  }
  if(data.rgba != null){
  	a = alpha ? alpha : data.rgba[4];
  	color = 'rgba('+data.rgba[1]+','+data.rgba[2]+','+data.rgba[3]+','+a+')';
  }
  if(data.hsl != null){
  	a = alpha ? alpha : 1;
  	color= 'hsla('+data.hsl[1]+','+data.hsl[2]+','+data.hsl[3]+','+(alpha ? alpha:1)+')';
  }
  if(data.hsla != null){
  	a = alpha ? alpha : data.hsla[4];
  	color = 'hsla('+data.hsla[1]+','+data.hsla[2]+'%,'+data.hsla[3]+'%,'+a+')';
  }
  return [color, a];
}

let backgroundColor = function(el) {
  var el = el || this;
  if(!el.alphaColor) el.alphaColor = null;
  if(!el.style) el.style = {};
  return function(c, a){
    let color = null;
    if(c != null){
      let d = parseColor(c, a);
      el.style.backgroundColor = d[0];
      el.alphaColor = d[1];
      return d;
    }
    return [el.style.backgroundColor, el.alphaColor];
  }
}
export let colorParser = parseColor;
export default backgroundColor;