import links from 'links';

const menus = {
  books: {
    title: 'Books',
    url: links.books,
  },
  createBook: {
    title: 'CreateBook',
    url: links.createBook,
  },
};

export type AppMenus = typeof menus;

export default menus;
