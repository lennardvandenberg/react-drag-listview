# react-drag-listview

React drag list component.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/react-drag-listview.svg?style=flat-square
[npm-url]: http://npmjs.org/package/react-drag-listview
[travis-image]: https://img.shields.io/travis/raisezhang/react-drag-listview.svg?style=flat-square
[travis-url]: https://travis-ci.org/raisezhang/react-drag-listview
[download-image]: https://img.shields.io/npm/dm/react-drag-listview.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-drag-listview

## install

[![rc-table](https://nodei.co/npm/react-drag-listview.png)](https://npmjs.org/package/react-drag-listview)

## Development

```bash
npm install
npm start
```

## Usage

```javascript
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
    );
  }
}

```

## License

react-drag-listview is released under the MIT license.
