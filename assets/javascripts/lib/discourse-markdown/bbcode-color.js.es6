import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features["bbcode-color"] = true;
});

function replaceFontColor(text) {
  text = text || "";
  while (text !== (text = text.replace(/\[color=([^\]]+)\]((?:(?!\[color=[^\]]+\]|\[\/color\])[\S\s])*)\[\/color\]/ig, function (match, p1, p2) {
    return `<font color='${p1}'>${p2}</font>`;
  })));
  return text;
}

function replaceFontBgColor(text) {
  text = text || "";
  while (text !== (text = text.replace(/\[bgcolor=([^\]]+)\]((?:(?!\[bgcolor=[^\]]+\]|\[\/bgcolor\])[\S\s])*)\[\/bgcolor\]/ig, function (match, p1, p2) {
    return `<span style='background-color:${p1}'>${p2}</span>`;
  })));
  return text;
}

export function setup(helper) {
  helper.whiteList(['font[color]']);
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === 'span' && name === 'style') {
        return /^background-color:#?[a-zA-Z0-9]+$/.exec(value);
      }
    }
  });

  if (helper.markdownIt) {
    helper.registerPlugin(md => {
      const ruler = md.inline.bbcode_ruler;

      ruler.push('bgcolor', {
        tag: 'bgcolor',
        wrap: function(token, tagInfo){
          token.tag = 'span';
          token.attrs = [['style', 'background-color:' + tagInfo.attrs._default.trim()]];
          return true;
        }
      });

      ruler.push('color', {
        tag: 'color',
        wrap: function(token, tagInfo){
          token.tag = 'font';
          token.attrs = [['color', tagInfo.attrs._default]];
          return true;
        }
      });
    });
  } else {
    helper.addPreProcessor(text => replaceFontColor(text));
    helper.addPreProcessor(text => replaceFontBgColor(text));
  }
}
