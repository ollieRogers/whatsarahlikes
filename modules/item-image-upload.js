var fs = require('fs');
var easyimg = require('easyimage');
var mkdirps = require('mkdirps');
/*
 * NOTE: easyimg requires the installation of imagemagik:  https://www.npmjs.org/package/easyimage
 * apt-get install imagemagick
 */



/*
 * Use nodes FileSystem(fs) module to make upload directories & upload images
 */

var uploadItemImages = function(req, user) {
  if(req.files.photo.size > 0){

    /*
     * file paths for image upload
     */
    var tmpPath = req.files.photo.path,
        webSafeImgName = req.files.photo.name.split(' ').join('-').toLowerCase(),
        UsrUploadDir   = './public/user-uploads/' + user.id,
        usrUploadFull  = './public/user-uploads/' + user.id + '/fullsized',
        newPathFull    =  usrUploadFull + '/' + webSafeImgName,     
        usrUploadThumb = './public/user-uploads/' + user.id + '/thumbnails',
        newPathThumb   =  usrUploadThumb + '/thumb-' + webSafeImgName, 

        // resize dimensions             
        thumbX = 500, 
        thumbY = 500,
        thumbCropX = 328,
        thumbCropY = 240,
        fullX = 640,
        fullY = 480


    // test if the image uploads directory exists
    fs.exists(UsrUploadDir, function (exists) { 
      /*
       * If users upload directory exists move the resized images there
       */
      if(exists) {

        // resize thumbnail  
        easyimg.rescrop({ 
          src:tmpPath, dst:newPathThumb,
          width:thumbX, height:thumbY,
          cropwidth:thumbCropX, cropheight:thumbCropY,
           x:0, y:0
         }, function(err, image) {
          if (err) throw err;
          
          // resize the image to the 'fullsize' dimensions
          easyimg.resize({
            src:tmpPath, dst:newPathFull,
            width:fullX, height:fullY
          }, function(err, image) {
            if (err) throw err;

            // remove original uploaded file from ./uploads
            fs.unlink(tmpPath, function(){  
              if(err) throw err;
            });
          });
        });

      /*
       * If the directory doesn't exist make it and move 
       * the images to their relevant directories
       */
      } else { 
        mkdirps([usrUploadFull, usrUploadThumb], function(err){
          if (err) throw err

          // resize thumbnail  
          easyimg.rescrop({ 
            src:tmpPath, dst:newPathThumb,
            width:thumbX, height:thumbY,
            cropwidth:thumbCropX, cropheight:thumbCropY,
            x:0, y:0
          }, function(err, image) {
            if (err) throw err;
            
            // resize the image to the 'fullsize' dimensions
            easyimg.resize({
              src:tmpPath, dst:newPathFull,
              width:fullX, height:fullY
            }, function(err, image) {
              if (err) throw err;

              // remove original uploaded file from ./uploads
              fs.unlink(tmpPath, function(){  
                if(err) throw err;
              });
            });
          });
        })
      }

    });

  } else {
    fs.unlink(req.files.photo.path, function(err){  // remove empty file from '/tmp' if no image attached
      if(err) throw err;
    }); 
  }

} 



module.exports = uploadItemImages;