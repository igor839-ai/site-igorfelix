const fs = require('fs');
const path = require('path');
const GTM_ID = 'GTM-5KWQK3R2';
const HEAD_SNIPPET = "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" + GTM_ID + "');</script><!-- End Google Tag Manager -->";
const BODY_SNIPPET = '<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=' + GTM_ID + '" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->';
const OUT_DIR = path.join(__dirname, '_site');
function walk(dir){var out=[];var entries=fs.readdirSync(dir,{withFileTypes:true});for(var k=0;k<entries.length;k++){var entry=entries[k];var full=path.join(dir,entry.name);if(entry.isDirectory()){out=out.concat(walk(full));}else if(entry.isFile()&&entry.name.slice(-5)==='.html'){out.push(full);}}return out;}
var files=walk(OUT_DIR);var count=0;
for(var n=0;n<files.length;n++){var file=files[n];if(file.split(path.sep).indexOf('admin')!==-1){continue;}var html=fs.readFileSync(file,'utf8');if(html.indexOf(GTM_ID)!==-1){continue;}if(/<head[^>]*>/i.test(html)){html=html.replace(/<head[^>]*>/i,function(m){return m+HEAD_SNIPPET;});}if(/<body[^>]*>/i.test(html)){html=html.replace(/<body[^>]*>/i,function(m){return m+BODY_SNIPPET;});}fs.writeFileSync(file,html,'utf8');count++;}
console.log('[inject-gtm] GTM '+GTM_ID+' injetado em '+count+' arquivos HTML');
