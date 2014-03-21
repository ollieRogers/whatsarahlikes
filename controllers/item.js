var async = require('async');
var fs = require('fs');
var passport = require('passport');
var _ = require('underscore'); 
var util = require('util');
var mongoose = require('mongoose');
var User = require('../models/User');
var Item = require('../models/Item');
var textCrop = require('../modules/textcrop');
var uploadItemImages = require('../modules/item-image-upload');
var updateUserCategories = require('../modules/update-user-categories');










/**
 * GET items/all-items
 * gets all items and places them in a list
 */
var getItems = function(req, res){

  User.findById(req.user.id, function(err, user) {  
    Item                          
      .sortByDateDesc(user)  // sort by descending 'date added'
      .exec(function(user, item){  
        res.render('items/all-items', {  
          title: 'Things You Like',
          items: item                   
        });
      })    
  })

}








/**
 * GET items/deleted
 * gets all items and places them in a list
 */
var getDeletedItems = function(req, res){  

  User.findById(req.user.id, function(err, user) {  
    Item                          
      .showDeletedItems(user)  // show deleted items
      .exec(function(user, item){  
        res.render('items/all-items', { 
          title: 'Things You Have Deleted',
          items: item,                      
          deletedItems: true
        });
      })    
  })

}









/**
 * getCategory 
 * gets a list of all categories for an item and renders them to all-items view 
 */
var getCategory = function(req, res){  

  var category = req.params.category;

  User.findById(req.user.id, function(err, user) {
    Item
      .showCategory(user, category) // sort by descending 'date added'
      .exec(function(user, item){  
        res.render('items/all-items', {      
          title: 'Items Tagged "' + category + '"',
          items: item,
          category: category,
          displayByCategory: true
        });
      })    
  })

}









/**
 * GET /items/single-item 
 * gets an item by its id for editing
 */

var getSingleItem = function(req, res){

  var singleItemId = req.params.itemId // get item using the request parameter

  Item                          
    .findById(singleItemId)   
    .exec(function(user,item){ 
      res.render('items/single-item', {
        title: item.title,
        updatingItem: true,
        item: item
      });
    })

}



/**
 * GET /items/single-item 
 * gets an item by its id for editing
 */

var getSingleItemDetail = function(req, res){

  var singleItemId = req.params.itemId // get item using the request parameter

  Item                          
    .findById(singleItemId)   
    .exec(function(user,item){ 
      res.render('items/single-item-detail', {
        title: item.title,
        item: item
      });
    })

}




/**
 * GET /items/new-thing
 * renders empty new-item form
 */

var getNewItem = function(req, res){

  User.findById(req.user.id, function(err, user) { 
    res.render('items/single-item', {
      title: 'Something New That You Like', 
      newItem: true
    });
  })

}










/**
 * POST /items/single-thing/
 * updates an item the db
 */

var postUpdateSingleItem = function(req, res, next){

  // server side validation for title field 
  req.assert('title', 'You need to add a title').notEmpty();

  var errors = req.validationErrors();
  var singleItemId = req.params.itemId; // find the single item by the id in the request parameter 

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/items/new-item');
  }

  User.findById(req.user.id, function(err, user) {
    // upload image attachments to user-uploads directory
    uploadItemImages(req, user);
  });

  Item
    .findById(singleItemId)
    .exec(function(user,item) {

      var updatedItem = item;

      updatedItem.title = req.body.title; 
      updatedItem.description = req.body.description;
      updatedItem.shortDesc = textCrop(req.body.description, 50);  
      updatedItem.categories = _.toArray(req.body.categories).join('').split(','); // convert categories into array
      if(req.files.photo.size > 0){                      
        updatedItem.imageName = req.files.photo.name.split(' ').join('-').toLowerCase();
      }
      updatedItem.save(function(err) {
        req.flash('success', {
          msg: 'Successfully updated: ' + updatedItem.title
        }); 
        User.findById(req.user.id, function(err, user) { 

          // add any new categories to the list of users categories
          updateUserCategories(req, user, updatedItem);

          // redirect back to the items detail view after update
          res.redirect('/items/single-item-detail/' + updatedItem.id);
        })
      });

  });

}











/**
 * POST /items/new-thing
 * adds a new item to the items collection
 */
var postNewItem = function(req, res, next){

  // server side validation for title field
  req.assert('title', 'You need to add a title').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/items/new-item');
  }

  User.findById(req.user.id, function(err, user) { 
    var dateAdded = new Date();
    var item = new Item({
        title: req.body.title,
        description: req.body.description,
        shortDesc: textCrop(req.body.description, 50),
        categories: (req.body.categories)? _.toArray(req.body.categories).join('').split(',') : undefined,
        dateAdded: dateAdded,
        userId: user.id,
        imageName: req.files.photo.name.split(' ').join('-').toLowerCase() || undefined
      });


    // upload image attachments to user-uploads directory
    uploadItemImages(req, user);

    // add any new categories to the full list of users categories
    updateUserCategories(req, user, item);

    // save updates to item and render new view 
    item.save( function( err ){   
      if(err) throw err; 
      req.flash('success', { 
        msg: 'Added: ' + req.body.title
      }); 
      res.render('items/single-item', {                    
        title: 'Added: ' + req.body.title,        
        itemAdded: true
      });
    }); 

    
  })

  

}









/**
 * GET /items/delete-item:itemId
 * deletion an item by setting the state of item.show to false
 */

var deleteItem = function(req, res, next){
 
  var singleItemId = req.params.itemId; 
  
  Item
    .findById(singleItemId)
    .exec(function(user,item) {

      var deletedItem = item;

      deletedItem.show = false; // hide the item from the default listing
      deletedItem.save( function( err ){
        req.flash('deleted', {
          msg: deletedItem.title,
          deletedTitle: deletedItem.title,
          deleted: true,
          deletedItemId: deletedItem.id 
        });

        // redirect to items with message update
        res.redirect('/items/');
      }); 
    }); 

}









/**
 * GET /items/delete-item:itemId
 * undo the deletion of an item
 * by setting the state of item.show to true
 */
var undoDeleteItem = function(req, res, next){

  var singleItemId = req.params.itemId;
  
  Item
    .findById(singleItemId)
    .exec(function(user,item) {
      
      var undoItem = item;

      undoItem.show = true;
      undoItem.save( function( err ){ 
        req.flash('undo', {             
          msg: undoItem.title,
        });

      // redirect to items with message update
      res.redirect('/items/');
      })
    })
}







// export modules
module.exports.getItems = getItems;
module.exports.getSingleItem = getSingleItem;
module.exports.getSingleItemDetail = getSingleItemDetail;
module.exports.getDeletedItems = getDeletedItems;
module.exports.getCategory = getCategory;
module.exports.postUpdateSingleItem =postUpdateSingleItem;
module.exports.getNewItem = getNewItem;
module.exports.postNewItem = postNewItem;
module.exports.deleteItem = deleteItem;
module.exports.undoDeleteItem = undoDeleteItem;