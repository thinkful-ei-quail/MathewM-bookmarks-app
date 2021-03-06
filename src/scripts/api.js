'use strict';


const api = (function() {
  
  const BASE_URL = ' https://thinkful-list-api.herokuapp.com/mathewmurray';

  const getItems = function(callback) {
    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch('https://thinkful-list-api.herokuapp.com/mathewmurray/bookmarks', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    $.getJSON(BASE_URL + '/bookmarks', callback);
  };

  const createItem = function(title, url, desc, rating, callback, onError) {
    const newItem = JSON.stringify(
      {
        title: title,
        url: url,
        desc: desc,
        rating: rating
      });
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: newItem,
      redirect: 'follow'
    };
      
    fetch(BASE_URL+'/bookmarks', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    $.ajax({
      url: BASE_URL + '/bookmarks',
      method: 'POST',
      contentType: 'application/json',
      data: newItem,
      success: callback,
      error: onError,
    });
  };

  const updateItem = function(id, updateData, callback) {
    
    let requestOptions = {
      method: 'PATCH',
      redirect: 'follow'
    };
    
    fetch(BASE_URL +'/bookmarks' + id, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateData),
      success: callback
    });
  };

  const deleteItem = function(id, callback) {
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    
    fetch(BASE_URL + '/bookmarks' + id, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'DELETE',
      success: callback
    });
  };

  return {
    getItems,
    createItem,
    updateItem,
    deleteItem,
  };
}());