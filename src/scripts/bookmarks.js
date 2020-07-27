/* global store api $ */
'use strict';

const bookmarkList = (function () {
  function generateUIActions() {
    return `
    <div class='actions'>
        <button id="js-create-bookmark-form" aria-label="click to create a bookmark" class="header-button js-header-button">Add bookmark</button>
        <form id="js-filter-bookmark-form" class="filter-bookmark-form">
          <fieldset>
            <legend>Filter By</legend>
              <label for="rating-filter">
                <select aria-label="select a rating" class="header-select js-header-select" aria-activedescendant="rating-filter">
                  <option role="option" value="1" id="rating-filter" aria-label="select star rating">Rating</option>
                  <option aria-label="select 5 star rating" role="option" value="5" id="rating-filter-5" >5 stars</option>
                  <option  aria-label="select 4 star rating" role="option" value="4" id="rating-filter-4">4 stars</option>
                  <option  aria-label="select 3 star rating" role="option" value="3" id="rating-filter-3">3 stars</option>
                  <option  aria-label="select 2 star rating" role="option" value="2" id="rating-filter-2">2 stars</option>
                  <option aria-label="select 1 star rating" role="option" value="1" id="rating-filter-1" >1 star</option>
                </select>
              </label>
          </fieldset>
        </form>
      </div>
    `;
  }

  function generateBookmarkElement(item) {
    console.log(item, store.expandedIds);
    const expandedView = store.expandedIds.includes(item.id)
      ? `<p class="long-desc js-long-desc">${item.desc}</p>
        <a class="bookmark-link js-bookmark-link" href="${item.url}" target="_blank">${item.url}</a>
        <div class="button-container"> 
            <button title="${item.url}" data-item-url="${item.url}" class="visit-site-button js-visit-site-button" aria-label="click to visit ${item.title} website">VISIT</button>
            <button id="js-delete-bookmark" class="delete-bookmark-button js-delete-bookmark-button" type="submit" aria-label="click to delete ${item.title} website">DELETE</button>
        </div>`
      : '';

    const buttonToggle = store.expandedIds.includes(item.id)
      ? `<button data-item-id="${item.id}" class="close-button js-close-button" type="button" aria-label="click to close ${item.title} expanded view">Close</button>`
      : `<button data-item-id="${item.id}" class="expand-button js-expand-button" type="button" aria-label="click to enter ${item.title} expanded view">Expand</button>`;

    return `
    <li class="bookmark-list-items js-bookmark-list-items" data-item-id="${item.id}" aria-label="click to expand bookmark item">
      <h3 class="bookmark-title">
        <div class="title">${item.title}</div>
        ${buttonToggle}
      </h3>
      <section class="star-rating js-star-rating">
        <p class="star-number js-star-number" aria-label="${item.rating} star">${item.rating} STAR</p>
      </section>
      ${expandedView}
    </li>`;
  }

  function generateBookmarkString(bookmarkList) {
    const items = bookmarkList.map((item) => generateBookmarkElement(item));
    return items.join('');
  }

  function generateCreateBookmarkView() {
    return `
    <li class="create-bookmark-view js-create-bookmark-view" aria-live="polite">
        <h2>Create a Bookmark</h2>
        <button id="close-button-form" type="button">Close</button>
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
    $(document).on('click', '#js-create-bookmark-form', function () {
      store.adding = true;
      render();
    });
  }

  function handleCloseBookmarkForm() {
    $(document).on('click', '#close-button-form', function () {
      store.adding = false;
      render();
    });
  }

  function handleVisitLinkClick() {
    $(document).on('click', '.visit-site-button', function (event) {
      const url = $(event.target).data('item-url');
      window.open(url, '_blank');
    });
  }

  function handleCloseBookmarkClicked() {
    $(document).on('click', '.js-close-button', (event) => {
      const id = $(event.target).data('item-id');
      if (store.expandedIds.includes(id)) {
        const indexOfId = store.expandedIds.findIndex(
          (expandedId) => expandedId === id
        );
        store.expandedIds.splice(indexOfId);
        render();
      }
    });
  }

  function handleAddBookmarkClicked() {
    $('#js-add-bookmark').on('submit', function (event) {
      event.preventDefault();
      const title = event.currentTarget.title.value;
      const url = event.currentTarget.url.value;
      const desc = event.currentTarget.desc.value;
      const rate = event.currentTarget.rate.value;

      api.createItem(title, url, desc, rate, function (response) {
        store.addItem(response);
        store.adding = false;
        render();
      });
    });
  }

  function handleExpandViewClicked() {
    $(document).on('click', '.js-expand-button', (event) => {
      const id = $(event.target).data('item-id');
      if (!store.expandedIds.includes(id)) {
        store.expandedIds.push(id);
        render();
      }
    });
  }

  function handleDeleteBookmarkClicked() {
    $('.js-bookmark-list').on('click','.js-delete-bookmark-button',(event) => {
      const id = $(event.currentTarget.parentElement.parentElement).data(
        'item-id'
      );
      event.preventDefault();
      api.deleteItem(id, () => {
        store.findAndDelete(id);
        render();
      });
    }
    );
  }

  function handleFilter() {
    $(document).on('change','.js-header-select', function (event) {
      event.preventDefault();
      const val = $(event.currentTarget).val();
      store.filterByRating(val);
      render();
    });
  }

  //function getItemIdFromElement(item) {
    //return $(item).closest('.js-bookmark-list-items').data('item-id');
  //}

  function render() {
    const list = `<ul class="bookmark-list js-bookmark-list" aria-live="polite">
      </ul>`;
    $('.bookmark-panel').html(`${generateUIActions()}${list}`);
    $('.js-bookmark-list').empty();

    if (store.adding) {
      const bookmarkForm = generateCreateBookmarkView();
      $('.js-bookmark-list').prepend(bookmarkForm);
    }

    handleAddBookmarkClicked();

    handleDeleteBookmarkClicked();

    //get current items
    let items = store.items.filter((itm) => {
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
    handleCloseBookmarkForm();
    handleCloseBookmarkClicked();
    handleVisitLinkClick();
  }

  return {
    bindEventListeners,
    render,
  };
})();
