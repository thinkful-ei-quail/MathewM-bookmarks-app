'use strict';

const store = (function() {

  const addItem = function(item) {
    this.items.push(Object.assign(item, {expanded: false}));
  };

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  function filterByRating(val) {
    this.filter = val;
  }

  return {
    items: [],
    adding: false,
    error: null,
    filter: 0,
    expandedIds: [],

    addItem,
    findById,
    findAndDelete, 
    filterByRating
  };
  
}());