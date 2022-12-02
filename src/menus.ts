import links from 'links';

const menus = {
  books: {
    title: 'Books',
    url: links.books,
  },
};

export type AppMenus = typeof menus;

export default menus;
