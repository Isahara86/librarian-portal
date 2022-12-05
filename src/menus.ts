import { routes } from 'routes';


const menus = {
  books: {
    title: 'Books',
    url: routes.private.books.path,
  },
  createBook: {
    title: 'CreateBook',
    url: routes.private.createBook.path,
  },
};

export type AppMenus = typeof menus;

export default menus;
