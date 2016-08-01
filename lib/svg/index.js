var template=function(id,y){ return '<view id="shape-'+id+'-view" viewBox="0 '+y*24+' 24 24" />\n<use xlink:href="#shape-'+id+'" width="24" height="24" x="0" y="'+y*24+'" id="'+id+'"></use>';
}
var fs = require('fs')
  , filename = process.argv[2];
fs.readFile('kml-icons.svg', 'utf8', function(err, data) {
  if (err) throw err;
  var extract = data.match(/(?=id="shape-)(.*)(?=")/gm);
  extract.forEach(function(v,i){
  	var t = template(v.split('id="shape-').join(''),i);
  	console.log(t);
  })
});