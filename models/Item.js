var mongoose = require('mongoose');


var itemSchema = new mongoose.Schema({
      userId: String,
      title: String,
      description: String,
      shortDesc: String,
      categories: Array,
      show:  { type: Boolean, default: true },
      dateAdded: Date,
      imageName: String
});




/**
 * sortByDateDesc
 * Sorts all visible Items for a user in date-added decending order
 */
itemSchema.statics.sortByDateDesc = function (user) {

  return this
          .find({ userId: user.id })
          .where('show').equals(true)
          .sort({'dateAdded': -1}) ;

}



/**
 * sortByDateAsc
 * Sorts all visible Items for a user in date-added ascending order
 */
itemSchema.statics.sortByDateAsc = function (user) {

  return this
          .find({ userId: user.id })
          .where('show').equals(true)
          .sort({'dateAdded': 1}) ;

}



itemSchema.statics.showCategory = function(user, category) {

  return this
          .find({ 
            userId: user.id, 
            categories: category 
          })
          .where('show').equals(true)
          .sort({'dateAdded': -1})
}





/**
 * showDeletedItems
 * returns all items deleted by a user
 */
itemSchema.statics.showDeletedItems = function (user) {

  return this
          .find({ userId: user.id })
          .where('show').equals(false)
          .sort({'dateAdded': -1}) ;

}





module.exports = mongoose.model('Item', itemSchema);
