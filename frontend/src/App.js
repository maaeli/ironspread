"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var mainElement = document.createElement('div');
document.body.appendChild(mainElement);
var useSemiPersistentState = function (key, initialState) {
    var _a = react_1["default"].useState(localStorage.getItem(key) || initialState), value = _a[0], setValue = _a[1];
    react_1["default"].useEffect(function () { localStorage.setItem(key, value); }, [value, key]);
    return [value, setValue];
};
var Item = function (_a) {
    var title = _a.title, url = _a.url, author = _a.author, num_comments = _a.num_comments, points = _a.points, objectID = _a.objectID;
    return (<div>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </div>);
};
var List = function (_a) {
    var list = _a.list;
    return (list.map(function (_a) {
        var objectID = _a.objectID, item = __rest(_a, ["objectID"]);
        return (<Item key={objectID} {...item}/>);
    }));
};
var Table1 = function (_a) {
    var header = _a.header, content = _a.content;
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    return (<div>
      <div><span key="corner1"></span>
      {header.map(function (cell, columnNumber) { return (<span key={"label " + columnNumber}>{alphabet[columnNumber]}</span>); })}
      </div>
      <div><span key="corner2"></span>
      {header.map(function (cell, columnNumber) { return (<span key={"header " + columnNumber}>{cell}</span>); })}
      </div>
      {content.map(function (row, rowNumber) { return (<div>
        {row.map(function (cell, columnNumber) {
        return <input type="text" value={cell} key={rowNumber + "," + columnNumber} name="name" onChange={function (event) { return console.log(rowNumber, columnNumber, event.target.value); }}/>;
    })}
     </div>); })} </div>);
};
var InputWithLabel = function (_a) {
    var id = _a.id, label = _a.label, _b = _a.type, type = _b === void 0 ? "text" : _b, value = _a.value, onInputChange = _a.onInputChange, children = _a.children;
    return (<>
    <label htmlFor={id}>{children}</label>
    <input id={id} type={type} value={value} onChange={onInputChange}/>
  </>);
};
var App = function () {
    var contentheader = ["Alabel", "Blabel", "Clabel"];
    var content = [
        ["A1", "B1", "C1"],
        ["A2", "B2", "C2"]
    ];
    var stories = [
        {
            title: 'React',
            url: 'https://reactjs.org/',
            author: 'Jordan Walke',
            num_comments: 3,
            points: 4,
            objectID: 0
        },
        {
            title: 'Redux',
            url: 'https://redux.js.org/',
            author: 'Dan Abramov, Andrew Clark',
            num_comments: 2,
            points: 5,
            objectID: 1
        },
    ];
    var _a = useSemiPersistentState('search', 'React'), searchTerm = _a[0], setSearchTerm = _a[1];
    var handleSearch = function (event) {
        setSearchTerm(event.target.value);
    };
    var searchedStories = stories.filter(function (story) {
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return (<div>
      <InputWithLabel id="search" value={searchTerm} onInputChange={handleSearch}>Search: </InputWithLabel>
      <p>Searching for <strong>{searchTerm}</strong></p>
      <hr />
      <List list={searchedStories}/>
      <Table1 content={content} header={contentheader}/>
    </div>);
};
react_dom_1["default"].render(<App />, mainElement);
