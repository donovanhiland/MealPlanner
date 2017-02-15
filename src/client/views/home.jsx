import React from 'react';
import { Link } from 'react-router';

const Home = () => (
  <div>
    <div>Home Page</div>
    <Link to="/about">To About</Link>
  </div>
);

export default Home;
