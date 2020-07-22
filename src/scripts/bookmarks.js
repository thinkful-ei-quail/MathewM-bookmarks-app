/* global store api $ */
'use strict';

const bookmarkList = (function() {

  function generateBookmarkElement(item) {
    return `
    <li class="bookmark-list-items js-bookmark-list-items" data-item-id="${item.id}" aria-label="click to expand bookmark item">
      <h3 class="list-title js-list-title">${item.title}</h3>
      <a class="list-link js-list-link" href="${item.url}" target="_blank">${item.url}</a>
      <section class="star-rating js-star-rating">
        <p class="star-number js-star-number" aria-label="${item.rating} star">${item.rating} STAR</p>
      </section>
    </li>`;
  }


  function generateBookmarkString(bookmarkList) {
    const items = bookmarkList.map((item) => generateBookmarkElement(item));
    return items.join('');
  }


  function generateExpandedView(item){
    return `
      <li aria-label="click to expand bookmark"class="expand-bookmark-view js-expand-bookmark-view" data-item-id="${item.id}">
        <h2>${item.title}</h2>
        <form id="js-close-expanded" class="header-right js-header-right">
        <p class="expanded-stars js-expanded-stars">${item.rating} STAR</p>
          <button class="close-button js-close-button" type="submit" aria-label="click to close ${item.title} expanded view">Close</button>
        </form>
        <p class="long-desc js-long-desc">${item.desc}</p>
        <a class="bookmark-link js-bookmark-link" href="${item.url}" target="_blank">${item.url}</a>
        <div> 
            <a class="bookmark-link js-bookmark-link" href="${item.url}" target="_blank">
            <button class="visit-site-button js-visit-site-button" aria-label="click to visit ${item.title} website">VISIT</button></a>
        </div>
        <form id="js-delete-bookmark">
          <button class="delete-bookmark-button js-delete-bookmark-button" type="submit" aria-label="click to delete ${item.title} website">DELETE</button>
        </form>
      </li>`;
  }


  function generateCreateBookmarkView() {
    return `
    <li class="create-bookmark-view js-create-bookmark-view" aria-live="polite">
      <h2>Create a Bookmark</h2>
        <form for="close-button" id="js-close-expanded" class="close-header-right js-header-right" id="close-button">
          <button class="create-close-button js-close-button" type="submit" aria-label="click to close expanded view">Close</button>
        </form>
        <form id="js-add-bookmark">
          <label for="add-bookmark-title"></label>
          <input class="add-bookmark add-bookmark-title js-add-bookmark-title" id="add-bookmark-title" name="title" type="text" placeholder="title" required aria-label="please enter a name for your bookmark">
          <label for="add-bookmark-link"></label>
          <input class="add-bookmark add-bookmark-link js-add-bookmark-link" id="add-bookmark-link" name="url" type="url" aria-label="please enter a url for your bookmark"value="http://" placeholder="http://url-address.com" required>
          <label for="add-bookmark-desc"></label>
          <input class="add-bookmark add-bookmark-desc js-add-bookmark-desc" id="add-bookmark-desc" name="desc" type="text" placeholder="Add long description here" aria-label="please enter a long description for your bookmark"align="top">
          <div id="add-star-rating js-add-star-rating">
            <div class="add-bookmark rate-radio-button js-rate-radio-buttons" aria-label="please select rating for new bookmark">
              <fieldset>
                <Legend required>STARS</Legend>
                <label aria-label="select rating 5 star"for="5-stars">5</label>
                <input type="radio" id="5-stars"
                  name="rate" value="5" required>
                <label aria-label="select rating 4 star"for="4-stars">4</label>
                <input type="radio" id="4-stars"
                  name="rate" value="4">
                <label aria-label="select rating 3 star"for="3-stars">3</label>
                <input type="radio" id="3-stars"
                  name="rate" value="3">
                <label aria-label="select rating 2 star"for="2-stars">2</label>
                <input type="radio" id="2-stars"
                  name="rate" value="2">
                <label aria-label="select rating 1 star" for="1-stars">1
                <input type="radio" id="1-star"
                  name="rate" value="1">
              </fieldset>
            </div>
          </div>
          <div>
            <button class="add-button-submit js-add-button-submit" type="submit" aria-label="click to add bookmark">ADD</button>
          </div>
        </form>
      </li>`;
  }


  function handleCreateBookmarkClicked() {
    $('#js-create-bookmark-form').on('submit', (function(event) {
      event.preventDefault();
      store.adding = true;
      render();
    }));
  }


  function handleCloseBookmarkClicked() {
    $('#js-close-expanded').on('click', '.js-bookmark-list-button', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      let item = store.findById(id);
      store.closing = true;
      if (store.closing && item.id === id) {
        render();
        store.closing = false;
      }
    });
  }


  function handleAddBookmarkClicked() {
    $('#js-add-bookmark').on('submit', (function(event) {
      event.preventDefault();
      const title = event.currentTarget.title.value;
      const url = event.currentTarget.url.value;
      const desc = event.currentTarget.desc.value;
      const rate = event.currentTarget.rate.value;

      api.createItem(title, url, desc, rate, function(response) {
        store.addItem(response);
        store.adding = false;
        render();
      });
    }));
  }


  function handleExpandViewClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-list-items', event => {
      const id = getItemIdFromElement(event.currentTarget);
      let item = store.findById(id);
      $(event.currentTarget).remove();
      if(item.id === id) {
        const expandView = generateExpandedView(item);
        $('.js-bookmark-list').prepend(expandView);
        store.expanded = true;
      }
    });
  }


  function handleDeleteBookmarkClicked() {
    $('.js-bookmark-list').on('click', '.js-delete-bookmark-button', event => {
      const id = $(event.currentTarget.parentElement.parentElement).data('item-id');
      event.preventDefault();
      api.deleteItem(id, () => {
        store.findAndDelete(id);
        render();
      });
    });
  }

  function handleFilter(){
    $('.js-header-select').on('change', function(event) {
      event.preventDefault();
      const val = $(event.currentTarget).val();
      store.filterByRating(val);
      render();
    });
  }

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-bookmark-list-items')
      .data('item-id');
  }


  function render() {
    $('.js-bookmark-list').empty();
   
    if(store.adding) {
      const bookmarkForm = generateCreateBookmarkView();
      $('.js-bookmark-list').prepend(bookmarkForm);
    }

    handleAddBookmarkClicked();

    handleDeleteBookmarkClicked();

    //get current items
    let items = store.items.filter(itm => {
      return itm.rating >= parseInt(store.filter);
    });

    // create element string
    const bookmarkString = generateBookmarkString(items);

    //insert html into DOM
    $('.js-bookmark-list').append(bookmarkString);

  }


  function bindEventListeners() {
    handleFilter();
    handleExpandViewClicked();
    handleCreateBookmarkClicked();
    handleCloseBookmarkClicked();
  }

  return {
    bindEventListeners,
    render
  };

}());