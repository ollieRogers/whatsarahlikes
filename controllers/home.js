/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  if(req.user){
    res.redirect('/items/')
  } else {
    res.render('home', {
    title: 'Home'
  });
  }
  
};
