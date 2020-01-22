const express = require('express');
const postRouter = require('./data/post/post-router.js');
const server = express();

server.use(express.json());
server.use('/api/posts', postRouter)


module.exports = server;