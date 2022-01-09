import React from 'react';
import { createBrowserHistory } from 'history';
import './Navbar.css';

const links = [
  {
    id: 1,
    path: '/',
    name: 'Filter',
  },
  {
    id: 2,
    path: '/labels',
    name: 'Label',
  },
];

function Navbar() {
  const history = createBrowserHistory();
  const { pathname } = history.location;

  return (
    <div className="nav-container">
      <div className="container">
        <div className="nav-wrp">
          {links.map(({ id, path, name }) => (
            <a
              className={[path === pathname ? 'active' : ''].join(' ')}
              href={path}
              key={id}
            >
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
