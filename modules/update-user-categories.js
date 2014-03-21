var _ = require('underscore');

/*
 * Updates user collection with all item categories for use in typeahead item tags
 */ 

var updateUserCategories = function(req, user, item){
  if (req.body.categories){
    if (!user.allCategories){
      
      // If no user.categories array use the new values as the categories
      // (for new users or users with no tags)
      user.allCategories = item.categories; 
    } else {

      // combine the submitted categories with the  
      // new ones to get a full list of all user categories 
      user.allCategories = _.union(item.categories, user.allCategories); 
    }
    // save all-categories to user 
    user.save(); 
  } 
}



module.exports = updateUserCategories;