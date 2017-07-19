import React from 'react';
import PropTypes from 'prop-types';
import { closest, getDomIndex, getScrollElement } from './util.js';

const DEFAULT_NODE_SELECTOR = 'tr';
const DIRECTIONS = {
  TOP: 1,
  BOTTOM: 3
};
const UNIT_PX = 'px';
const DRAG_LIND_STYLE = 'position:fixed;z-index:9999;height:0;' +
                        'margin-top:-1px;border-bottom:dashed 2px red;display:none;';

class ReactDragListView extends React.Component {

  static propTypes = {
    onDragEnd: PropTypes.func.isRequired,
    handleSelector: PropTypes.string,
    nodeSelector: PropTypes.string,
    enableScroll: PropTypes.bool,
    scrollSpeed: PropTypes.number,
    lineClassName: PropTypes.string,
    children: PropTypes.node
  }

  static defaultProps = {
    nodeSelector: DEFAULT_NODE_SELECTOR,
    enableScroll: true,
    scrollSpeed: 10
  }

  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.autoScroll = this.autoScroll.bind(this);

    this.state = {
      fromIndex: -1,
      toIndex: -1
    };

    this.scrollElement = null;
    this.scrollTimerId = -1;
    this.direction = DIRECTIONS.BOTTOM;
  }

  componentWillUnmount() {
    if (this.dragLine && this.dragLine.parentNode) {
      this.dragLine.parentNode.removeChild(this.dragLine);
      this.dragLine = null;
      this.cacheDragTarget = null;
    }
  }

  onMouseDown(e) {
    const handle = this.getHandleNode(e.target);
    if (handle) {
      const target = (!this.props.handleSelector || this.props.handleSelector
          === this.props.nodeSelector)
        ? handle
        : this.getDragNode(handle);
      if (target) {
        handle.setAttribute('draggable', false);
        target.setAttribute('draggable', true);
        target.ondragstart = this.onDragStart;
        target.ondragend = this.onDragEnd;
      }
    }
  }

  onDragStart(e) {
    const target = this.getDragNode(e.target);
    const eventData = e;
    if (target) {
      const parentNode = target.parentNode;
      eventData.dataTransfer.setData('Text', '');
      eventData.dataTransfer.effectAllowed = 'move';
      parentNode.ondragenter = this.onDragEnter;
      parentNode.ondragover = function(ev) {
        ev.preventDefault();
        return true;
      };
      const fromIndex = this.getItemIndex(target);
      this.setState({ fromIndex, toIndex: fromIndex });
      this.scrollElement = getScrollElement(parentNode);
    }
  }

  onDragEnter(e) {
    const target = this.getDragNode(e.target);
    const eventData = e;
    let toIndex;
    if (target) {
      toIndex = this.getItemIndex(target);
      if (this.props.enableScroll) {
        this.resolveAutoScroll(eventData, target);
      }
    } else {
      toIndex = -1;
      this.stopAtuoScroll();
    }
    this.cacheDragTarget = target;
    this.setState({ toIndex });
    this.fixDragLine(target);
  }

  onDragEnd(e) {
    const target = this.getDragNode(e.target);
    this.stopAtuoScroll();
    if (target) {
      target.removeAttribute('draggable');
      target.ondragstart = target.ondragend
                         = target.parentNode.ondragenter
                         = target.parentNode.ondragover
                         = null;
      if (this.state.fromIndex >= 0 && this.state.fromIndex !== this.state.toIndex) {
        this.props.onDragEnd(this.state.fromIndex, this.state.toIndex);
      }
    }
    this.hideDragLine();
    this.setState({ fromIndex: -1, toIndex: -1 });
  }

  getItemIndex(target) {
    return this.props.nodeSelector === DEFAULT_NODE_SELECTOR
            ? (target.rowIndex - 1)
            : getDomIndex(target);
  }

  getDragNode(target) {
    return closest(target, this.props.nodeSelector, this.refs.dragList);
  }

  getHandleNode(target) {
    return closest(target,
        this.props.handleSelector || this.props.nodeSelector,
        this.refs.dragList);
  }

  getDragLine() {
    if (!this.dragLine) {
      this.dragLine = document.createElement('div');
      this.dragLine.setAttribute('style', DRAG_LIND_STYLE);
      document.body.appendChild(this.dragLine);
    }
    this.dragLine.className = this.props.lineClassName || '';
    return this.dragLine;
  }

  resolveAutoScroll(e, target) {
    if (!this.scrollElement) {
      return;
    }
    const { top, height } = this.scrollElement.getBoundingClientRect();
    const targetHeight = target.offsetHeight;
    const { pageY } = e;
    const compatibleHeight = targetHeight * 2 / 3;
    this.direction = 0;
    if (pageY > (top + height - compatibleHeight)) {
      this.direction = DIRECTIONS.BOTTOM;
    } else if (pageY < top + compatibleHeight) {
      this.direction = DIRECTIONS.TOP;
    }
    if (this.direction) {
      if (this.scrollTimerId < 0) {
        this.scrollTimerId = setInterval(this.autoScroll, 20);
      }
    } else {
      this.stopAtuoScroll();
    }
  }

  stopAtuoScroll() {
    clearInterval(this.scrollTimerId);
    this.scrollTimerId = -1;
    this.fixDragLine(this.cacheDragTarget);
  }

  autoScroll() {
    const scrollTop = this.scrollElement.scrollTop;
    if (this.direction === DIRECTIONS.BOTTOM) {
      this.scrollElement.scrollTop = scrollTop + this.props.scrollSpeed;
      if (scrollTop === this.scrollElement.scrollTop) {
        this.stopAtuoScroll();
      }
    } else if (this.direction === DIRECTIONS.TOP) {
      this.scrollElement.scrollTop = scrollTop - this.props.scrollSpeed;
      if (this.scrollElement.scrollTop <= 0) {
        this.stopAtuoScroll();
      }
    } else {
      this.stopAtuoScroll();
    }
  }

  hideDragLine() {
    if (this.dragLine) {
      this.dragLine.style.display = 'none';
    }
  }

  fixDragLine(target) {
    const dragLine = this.getDragLine();
    if (!target || this.state.fromIndex < 0
        || this.state.fromIndex === this.state.toIndex) {
      this.hideDragLine();
      return;
    }
    const { left, top, width, height } = target.getBoundingClientRect();
    const lineTop = (this.state.toIndex < this.state.fromIndex
      ? top
      : (top + height));
    if (this.props.enableScroll && this.scrollElement) {
      const {
        height: scrollHeight,
        top: scrollTop
      } = this.scrollElement.getBoundingClientRect();
      if (lineTop < (scrollTop - 2) || lineTop > (scrollTop + scrollHeight + 2)) {
        this.hideDragLine();
        return;
      }
    }
    dragLine.style.left = left + UNIT_PX;
    dragLine.style.width = width + UNIT_PX;
    dragLine.style.top = lineTop + UNIT_PX;
    dragLine.style.display = 'block';
  }

  render() {
    return (
      <div onMouseDown={this.onMouseDown} ref="dragList">
          {this.props.children}
      </div>
    );
  }
}

export default ReactDragListView;
