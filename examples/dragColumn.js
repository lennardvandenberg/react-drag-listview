/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const ReactDragListView = require('react-drag-listview/src/index.js');
const DragColumn = ReactDragListView.DragColumn;

require('./index.less');
require('./dragColumn.less');

class Demo extends React.Component {
  constructor(props) {
    super(props);
    const data = [];
    for (let i = 1, len = 21; i < len; i++) {
      data.push({
        title: `col${i}`
      });
    }
    this.state = {
      data
    };
  }

  render() {
    const that = this;
    const dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const data = that.state.data;
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        that.setState({ data });
      },
      nodeSelector: 'li',
      handleSelector: 'a'
    };

    return (
      <div className="simple simple1 simple2">
        <h2>Dragging columns</h2>
        <div className="simple-inner">
          <DragColumn {...dragProps}>
            <ol style={{ width: 70 * this.state.data.length }}>
            {this.state.data.map((item, index) => (
              <li key={index}>
                {item.title}
                <a href="#">Drag</a>
              </li>
            ))}
            </ol>
          </DragColumn>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Demo/>, document.getElementById('__react-content'));
