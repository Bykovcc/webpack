import React from 'react';
import {render} from 'react-dom';
import * as $ from 'jquery';
import Post from './Post';
import WebpackLogo from './assets/webpack-logo.png';
import './styles/styles.css';
import './styles/style.scss';

const post = new Post ("Webpack post title", WebpackLogo);
$('pre').html(post.toString());

const App = () => (
    <>
        <div className="container">
            <h1>Webpack course</h1>
        </div>
        <hr/>
        <div className="logo"/>
        <hr/>
        <pre/>
        <hr/>
        <div className="text">
            It is <span className="text__main">scss</span>
        </div>
    </>
);

render(<App/>, document.getElementById('app'));