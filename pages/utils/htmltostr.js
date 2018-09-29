function htmlToStr(hStr) {
    console.log(hStr)
    var rootArr = hStr.split('');
    var finalArr = [],
        j = 0;
    for (var i = 0; i < rootArr.length; i++) {
        if (rootArr[i] == '<') {

            while (1) {
                if (rootArr[j] == '>') {
                    break;
                } else {
                    i++;
                    continue;
                }
            }
        }
        finalArr[j] = rootArr[i];
        j++;
    }

    return finalArr.join('');
    // return 'sssubb'
}

function coder(str) {
    var s = "";
    if (str.length == 0) return "";
    for (var i = 0; i < str.length; i++) {
        switch (str.substr(i, 1)) {
            case "<": s += "&lt;"; break;
            case ">": s += "&gt;"; break;
            case "&": s += "&amp;"; break;
            case " ": s += "&nbsp;"; break;
            case "\"": s += "&quot;"; break;
            default: s += str.substr(i, 1); break;
        }
    }
    return s;
}

function TemplateEngine(html, options) {
   var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
   var add = function(line, js) {
       js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
           (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
    //    return add;
    console.log(add)
   }
   while(match = re.exec(html)) {
       add(html.slice(cursor, match.index))(match[1], true);
       cursor = match.index + match[0].length;
   }
   add(html.substr(cursor, html.length - cursor));
   code += 'return r.join("");';
//    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
console.log(new Function(code.replace(/[\r\t\n]/g, '')).apply(options))
}

module.exports = {
    coder: coder
}