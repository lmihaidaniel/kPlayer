import __style__ from './hotspot.sss';

import {
  addClass,
  createElement
} from '../../../helpers/dom';
import {
  isFunction
} from '../../../helpers/utils';
import deepmerge from '../../../helpers/deepmerge';


let config = {
  width: 80,
  height: 80,
  visible: false,
  label: "",
  expand: "center",
  icon: null,
  action: false
};

/*
 * Class
 */
class Hotspot {
  /**
   * Constructor
   * @description init settings and create target
   */
  constructor(player, settings = {}) {
    this.player = player;
    this.settings = deepmerge(config, settings);
    this.createTarget();
  }


  /**
   * Create target
   * @description use the widget core ui
   */
  createTarget() {
    const width = this.player.videoWidth();
    const height = this.player.videoHeight();

    // Create widget
    this.widget = this.player.widget(this.settings);

    // Widget content
    const content = this.createContent();
    this.widget.content(content);
  }


  /**
   * Load popup
   * @description load the popup
   */
  action() {
    if (isFunction(this.settings.action)) {
      this.settings.action(this);
      //open POPUP or whatever here
    }
  }


  /**
   * Create content
   * @description create HTMLElement
   */
  createContent() {
    // Target
    const target = createElement('div', {
      class: 'target'
    });

    // Display video on click
    if (this.settings.action) {
      target.addEventListener('click', () => {
        this.action();
      });
    }

    // Expand direction
    addClass(target, 'target--' + this.settings.expand);
    // Conditionnals classes
    if (this.settings.shadow) {
      addClass(target, 'target--shadow');
    }

    // Parens
    const parenLeft = createElement('div', {
      class: 'target-paren target-paren--left',
    });
    parenLeft.innerHTML = '(';

    const parenRight = createElement('div', {
      class: 'target-paren target-paren--right',
    });
    parenRight.innerHTML = ')';

    // Play button
    const playBtn = createElement('div', {
      class: 'target-btn',
    });

    const playBtnIcon = createElement('div', {
      class: 'target-icon',
      style: this.settings.icon?'background-image: url(' + this.settings.icon + ')':''
    });

    playBtn.appendChild(playBtnIcon);


    // Title
    const title = createElement('div', {
      class: 'target-title',
    });
    if (this.settings.label) {
      title.innerHTML = this.settings.label;
    }

    // Parenting
    target.appendChild(parenLeft);
    target.appendChild(playBtn);
    target.appendChild(title);
    target.appendChild(parenRight);

    // Return node
    return target;
  }


  /**
   * Hide
   * @description hide widget
   */
  hide() {
    this.widget.hide();
  }

  /**
   * Show
   * @description show widget
   */
  show() {
    this.widget.show();
  }
}


/*
 * Export
 */
export default Hotspot;