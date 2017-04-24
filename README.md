# react-drag-listview

React drag list component.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/react-drag-listview.svg?style=flat-square
[npm-url]: http://npmjs.org/package/react-drag-listview
[travis-image]: https://img.shields.io/travis/raisezhang/react-drag-listview.svg?style=flat-square
[travis-url]: https://travis-ci.org/raisezhang/react-drag-listview
[coveralls-image]: https://img.shields.io/coveralls/raisezhang/react-drag-listview.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/raisezhang/react-drag-listview?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/raisezhang/react-drag-listview.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/raisezhang/react-drag-listview
[download-image]: https://img.shields.io/npm/dm/react-drag-listview.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-drag-listview

## install

[![rc-table](https://nodei.co/npm/react-drag-listview.png)](https://npmjs.org/package/react-drag-listview)

## Development

```
npm install
npm start
```

## Usage

```jsx
const ReactDragListView = require('react-drag-listview');
class Demo extends React.Component {
  constructor(props) {
    super(props);
    const data = [];
    for (let i = 1, len = 7; i < len; i++) {
      data.push({
        title: `rows${i}`
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
      <div className="simple simple1">
        <h2>Dragging handle</h2>
        <div className="container">
          <ReactDragListView {...dragProps}>
            <ol>
              {this.state.data.map((item, index) => (
                <li key={index}>
                  {item.title}
                  <a href="#">Drag</a>
                </li>
              ))}
            </ol>
          </ReactDragListView>
        </div>
      </div>
    );
  }
}

```
