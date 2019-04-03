// in src/app.js
import React from 'react';
import { Admin, Resource, ListGuesser  } from 'react-admin';
import { UserList } from './users';
import jsonServerProvider from 'ra-data-json-server';
import Dashboard from './Dashboard';
import authProvider from './authProvider';
import dataProvider from './dataProvider';

// const dataProvider = jsonServerProvider('http://jsonplaceholder.typicode.com');
const App = () => (
  <Admin
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
  >
  <Resource name="users" list={ListGuesser} />
    {/* <Resource name="users" list={UserList} /> */}
  </Admin>
);

export default App;