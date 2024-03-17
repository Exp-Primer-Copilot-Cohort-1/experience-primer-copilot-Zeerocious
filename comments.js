// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors');
var path = require('path');
var comments = require('./comments.json');
var _ = require('lodash');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/comments', function(req, res) {
  res.json(comments);
});

app.post('/comments', function(req, res) {
  comments.push(req.body);
  fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
    res.json(comments);
  });
});

app.delete('/comments/:id', function(req, res) {
  var id = req.params.id;
  var comment = _.find(comments, {id: id});
  _.remove(comments, comment);
  fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
    res.json(comments);
  });
});

app.listen(3001, function() {
  console.log('Server started: http://localhost:3001/');
});
```

## 3. Create React components
```javascript
// Path: Comment.js
import React, { Component } from 'react';
import axios from 'axios';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
    this.edit = this.edit.bind(this);
    this.remove = this.remove.bind(this);
    this.save = this.save.bind(this);
  }

  edit() {
    this.setState({ editing: true });
  }

  remove() {
    this.props.onRemove(this.props.id);
  }

  save() {
    this.props.onSave(this.props.id, this.refs.newText.value);
    this.setState({ editing: false });
  }

  renderNormal() {
    return (
      <div>
        <div>{this.props.children}</div>
        <button onClick={this.edit}>Edit</button>
        <button onClick={this.remove}>Remove</button>
      </div>
    );
  }

  renderForm() {
    return (
      <div>
        <textarea ref="newText" defaultValue={this.props.children}></textarea>
        <button onClick={this.save}>Save</button>
      </div>
    );
  }

  render() {
    if (this.state.editing) {
      return this