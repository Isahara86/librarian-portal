import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { AppMenuItem } from 'types';
import { FC } from 'react';
import { menus } from 'routes';

export const useSmallScreenQuery = () => useMediaQuery({ query: '(max-width: 768px)' });

const renderSubMenu = (links: AppMenuItem['links']) => links && Object.getOwnPropertyNames(links).map(link => ({
  key: links[link].title,
  label: (
    <Link to={ links[link].url }>
      { links[link].title }
    </Link>
  ),
}));

export const LeftHeader: FC = () => {
  const isSmallScreen = useSmallScreenQuery();

  return (
    <div
      style={ {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        padding: '0',
        flex: '1 1 auto',
      } }
    >
      { /* <img */ }
      { /*  alt="logo" */ }
      { /*  src="" */ }
      { /*  style={ { */ }
      { /*    marginRight: '1rem', */ }
      { /*    width: '5rem', */ }
      { /*  } } */ }
      { /* /> */ }
      <Menu
        mode="horizontal"
        theme="dark"
        key={ isSmallScreen ? 0 : 1 }
        style={ {
          height: '100%',
          width: 'calc(100% - 8rem - 3rem)',
          background: 'transparent',
          boxShadow: 'none',
          borderBottom: 'none',
        } }
        items={ Object.entries(menus).map(([, value]) => {
          if (!('links' in value)) {
            return {
              key: value.url,
              label: (
                <Link to={ value.url }>
                  { value.title }
                </Link>
              ),
            };
          }

          return {
            key: value.title,
            label: value.title,
            style: { padding: '0 10px' },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            children: renderSubMenu(value.links),
          };
        }) }
      />
    </div>
  );
};

export default LeftHeader;
