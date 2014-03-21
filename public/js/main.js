$(function() {
  
  /*
   * store a full list of users category tags in 
   * the global window object 
   */
  if (window.GlobalCategoryArray) {
    tagsSettings = {
      source: GlobalCategoryArray  
    }
  } else {
    tagsSettings = "items"
  }




  /*
   * tags input plugin for the category typeahead
   * requires global variable "GlobalCategoryArray"
   */
  $("input#categories").tagsinput(tagsSettings);




  /*
   *  lazy load images with unveil plugin
   *  http://luis-almeida.github.com/unveil
   */
  $('img.lazy').unveil(200);  
 

})