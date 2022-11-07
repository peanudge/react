const hooks = [];
let currentComponet = 0;

export class Component {
  constructor(props) {
    this.props = props;
  }
}

export function createDOM(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  const element = document.createElement(node.tag);

  Object.entries(node.props).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  node.children.map(createDOM).forEach(element.appendChild.bind(element));
  return element;
}

function makeProps(props, children) {
  return { ...props, children: children.length === 1 ? children[0] : children };
}


// NOTE: this is pseudo code
// Not working
function useState(initValue) {
  const position = currentComponet - 1;
  if (!hooks[position]) {
    hooks[position] = initValue
  }

  const modifier = nextValue => {
    hooks[position] = nextValue;
  }

  return [hooks[position], modifier];
}

export function createElement(tag, props, ...children) {
  if (typeof tag === "function") {
    // TODO: 원래 Symbol로 비교해야함.
    if (tag.prototype instanceof Component) {
      // TODO: 상태가 변경될떄마다 매번 createElement가 호출되기에 instance가 새로 생성되는 상태
      // 실제로는 instance를 기억하고 render()만 호출하는 형태로 처리될 것입니다.
      const instance = new tag(makeProps(props, children));
      return instance.render();
    }

    hooks[currentComponet] = null;
    currentComponet++;

    if (children.length > 0) {
      return tag(makeProps(props, children));
    } else {
      return tag(props);
    }
  } else {
    props = props ?? {};
    return { tag, props, children };
  }
}

// export function render(vdom, container) {
//   container.appendChild(createDOM(vdom));
// }

export const render = (function () {
  let prevDom = null;
  return function (vdom, container) {
    if (prevDom === null) {
      prevDom = vdom;
    }

    // diff

    container.appendChild(createDOM(vdom));
  };
})();
