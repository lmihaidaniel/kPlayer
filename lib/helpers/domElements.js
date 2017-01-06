const attributeExceptions = [
  `role`,
];

function appendText(el, text) {
  const textNode = document.createTextNode(text);
  el.appendChild(textNode);
}

function appendArray(el, children) {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      appendArray(el, child);
    } else if (child instanceof window.Element) {
      el.appendChild(child);
    } else if (typeof child === `string`) {
      appendText(el, child);
    }
  });
}

function setStyles(el, styles) {
  if (!styles) {
    el.removeAttribute(`styles`);
    return;
  }

  Object.keys(styles).forEach((styleName) => {
    if (styleName in el.style) {
      el.style[styleName] = styles[styleName]; // eslint-disable-line no-param-reassign
    } else {
      console.warn(`${styleName} is not a valid style for a <${el.tagName.toLowerCase()}>`);
    }
  });
}

function makeElement(type, textOrPropsOrChild, ...otherChildren) {
  const el = document.createElement(type);

  if (Array.isArray(textOrPropsOrChild)) {
    appendArray(el, textOrPropsOrChild);
  } else if (textOrPropsOrChild instanceof window.Element) {
    el.appendChild(textOrPropsOrChild);
  } else if (typeof textOrPropsOrChild === `string`) {
    appendText(el, textOrPropsOrChild);
  } else if (typeof textOrPropsOrChild === `object`) {
    Object.keys(textOrPropsOrChild).forEach((propName) => {
      if (propName in el || attributeExceptions.includes(propName)) {
        const value = textOrPropsOrChild[propName];

        if (propName === `style`) {
          setStyles(el, value);
        } else if (value) {
          el[propName] = value;
        }
      } else {
        console.warn(`${propName} is not a valid property of a <${type}>`);
      }
    });
  }

  if (otherChildren) appendArray(el, otherChildren);

  return el;
}

/**
 * svg related
 */

const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

function _has(a,b){
  return Function.prototype.bind.call(Function.call, Object.prototype.hasOwnProperty)(a,b);
}

function makeElementSvg(name, attr, ...otherChildren) {
    var elem = document.createElementNS(svgns, name);
    if (attr){
      for (var key in attr) {
          if (!_has(attr, key)) continue;
          var nkey = key.replace(/([a-z])([A-Z])/g, function (_, a, b) {
              return a + '-' + b.toLowerCase();
          });
          //to do check if attribute requires a namespace, and add a map for common namespaces
          if(nkey == "href"){
            elem.setAttributeNS(xlinkns, nkey, attr[key]);
          }else{
            elem.setAttribute(nkey, attr[key]);
          }
      }
    }
    if (otherChildren) appendArray(elem, otherChildren);
    return elem;
}

export const a = (...args) => makeElement(`a`, ...args);
export const button = (...args) => makeElement(`button`, ...args);
export const div = (...args) => makeElement(`div`, ...args);
export const h1 = (...args) => makeElement(`h1`, ...args);
export const header = (...args) => makeElement(`header`, ...args);
export const p = (...args) => makeElement(`p`, ...args);
export const span = (...args) => makeElement(`span`, ...args);
export const element = (type, ...args) => makeElement(type, ...args);
export const svg = (...args) => makeElementSvg('svg', ...args);
export const use = (...args) => makeElementSvg('use', ...args);
export const elementSvg = (type, ...args)=> makeElementSvg(type, ...args);

/**
 * Example
 * import { a, div, h1, header } from 'domElements';
 * return div({ id: `app` },
    header({ className: `app__header` },
      h1({ className: `app__header-title` }, `Know It All`),
      a(
        {
          className: `app__header-help`,
          target: `_blank`,
          rel: `noopener noreferrer`,
          title: `Find out more about know it all, version ${props.version}`,
          href: `https://hackernoon.com/what-you-dont-know-about-web-development-d7d631f5d468#.ex2yp6d64`,
        },
        `What is this?`,
      ),
    ),
    element('table', {className: 'table'}),
  );
 */