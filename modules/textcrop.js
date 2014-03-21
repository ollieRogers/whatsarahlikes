var express = require('express');
var app = express();

/*
 * Crops the string 'text' to the length specified by 'n'
 */

function textCrop(text,n) {
  var short = text.substr(0, n);
  if (/^\S/.test(text.substr(n))){
      short.replace(/\s+\S*$/, "");
      short = short + '...'
      return short;
  }
  return short;
}


module.exports = textCrop;
