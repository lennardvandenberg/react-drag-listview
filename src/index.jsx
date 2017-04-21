import React, {PropTypes} from 'react';
import classnames from 'classnames';

import styles from './index.less';
import {closest, getDomIndex, getScrollElement} from './util.jsx';

const Directions = {
  TOP: 1,
  BOTTOM: 3
};

class DraggingTable extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.autoScroll = this.autoScroll.bind(this);

    this.state = {
      dragIndex: -1,
      dragedIndex: -1
    };
    this.parentNodeQuery = 'tr';
    this.enableScroll = true;
    this.scrollElement = null;
    this.autoScrollTimerId = -1;
    this.direction = Directions.BOTTOM;
  }

  onMouseDown(e) {
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', true);
      target.ondragstart = this.onDragStart;
      target.ondragend = this.onDragEnd;
    }
  }

  onDragStart(e) {
    const target = this.getTrNode(e.target);
    if (target) {
      const parentNode = target.parentNode;
      e.dataTransfer.setData('Text', '');
      e.dataTransfer.effectAllowed = "move";
      parentNode.ondragenter = this.onDragEnter;
      parentNode.ondragover = function(ev) {
        ev.preventDefault();
        return true;
      };
      const dragIndex = this.getItemIndex(target);
      this.setState({dragIndex, dragedIndex: dragIndex});
      this.scrollElement = getScrollElement(parentNode);
    }
  }

  onDragEnter(e) {
    const target = this.getTrNode(e.target);
    let dragedIndex;
    if (target) {
      dragedIndex = this.getItemIndex(target);
      this.enableScroll && this.resolveAutoScroll(e, target);
    } else {
      dragedIndex = -1;
      this.stopAtuoScroll();
    }
    this.setState({dragedIndex});
  }

  onDragEnd(e) {
    const target = this.getTrNode(e.target);
    this.stopAtuoScroll();
    if (target) {
      target.removeAttribute('draggable');
      target.ondragstart = target.ondragend = target.parentNode.ondragenter = target.parentNode.ondragover = null;
      if (this.state.dragIndex >= 0 && this.state.dragIndex !== this.state.dragedIndex) {
        this.changeRow(this.state.dragIndex, this.state.dragedIndex);
      }
    }
    this.setState({dragIndex: -1, dragedIndex: -1});
  }

  autoScroll() {
    const scrollTop = this.scrollElement.scrollTop;
    if (this.direction === Directions.BOTTOM) {
      this.scrollElement.scrollTop = scrollTop + 6;
      if (scrollTop === this.scrollElement.scrollTop) {
        this.stopAtuoScroll();
      }
    } else if (this.direction === Directions.TOP) {
      this.scrollElement.scrollTop = scrollTop - 6;
      if (this.scrollElement.scrollTop <= 0) {
        this.stopAtuoScroll();
      }
    } else {
      this.stopAtuoScroll();
    }
  }

  resolveAutoScroll(e, target) {
    if (!this.scrollElement) {
      return;
    }
    const {top, height} = this.scrollElement.getBoundingClientRect();
    const targetHeight = target.offsetHeight;
    const {pageY} = e;
    const compatibleHeight = targetHeight * (2 / 3);
    this.direction = 0;
    if (pageY > (top + height - compatibleHeight)) {
      this.direction = Directions.BOTTOM;
    } else if (pageY < top + compatibleHeight) {
      this.direction = Directions.TOP;
    }
    if (this.direction) {
      if (this.autoScrollTimerId < 0) {
        this.autoScrollTimerId = setInterval(this.autoScroll, 20);
      }
    } else {
      this.stopAtuoScroll();
    }
  }

  stopAtuoScroll() {
    clearInterval(this.autoScrollTimerId);
    this.autoScrollTimerId = -1;
  }

  getTrNode(target) {
    return closest(target, this.parentNodeQuery, this.refs.dragList.tableNode);
  }

  getItemIndex(target) {
    if (this.parentNodeQuery === 'tr') {
      return target.rowIndex - 1;
    } else {
      return getDomIndex(target);
    }
  }

  getDragHandle(children) {
    return <span className={styles.dragHandle} draggable="false" onMouseDown={this.onMouseDown}>{children || 'Drag'}</span>;
  }

  getDragLine(index) {
    return this.state.dragIndex >= 0 && this.state.dragIndex !== this.state.dragedIndex && index === this.state.dragedIndex && <span className={classnames({
      [styles.dragLine]: true,
      [styles.LineTop]: this.state.dragedIndex < this.state.dragIndex
    })}></span> || '';
  }

  getDragContainer(children) {
    return <div ref="dragList" className={classnames({
      [styles.draggingList]: this.state.dragIndex >= 0
    })}>{children}</div>;
  }

  changeRow(dragIndex, dragedIndex) {
    console.log('from: ' + dragIndex + '  to: ' + dragedIndex);
  }
};

DraggingTable.propTypes = {};
export default DraggingTable;
