/*global api bookmarkList store */
'use strict';



$(document).ready(function() {
  
  api.getItems(items => {
    items.forEach(item => {
      store.addItem(item);
    });
    bookmarkList.render();
  });
  bookmarkList.bindEventListeners();
});