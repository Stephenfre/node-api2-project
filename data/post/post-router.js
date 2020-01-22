const express = require('express')
const Post = require('../db.js')

const router = express.Router();



/*
CRUD
C - CREATE - post
R - READ - get
U - UPDATE - put
D - DELETE - delete

*/

/*
-----------------------------------------------------------------------------------------
 retrieve info from the db
----------------------------------------------------------------------------------------- 
*/
router.get('/', (req, res) => {
    Post.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error retrieving the posts', err })
        })
})

router.get('/:id', (req, res) => {
    // console.log(req.params.id)
    Post.findById(req.params.id)
        .then(posts => {
            if (posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be retrieved.", err })
        })
})

router.get('/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)
        .then(comments => {
            if (comments.length > 0) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            express.status(500).json({ error: "The comments information could not be retrieved.", err })
        })
})

/*
-----------------------------------------------------------------------------------------
 add a record to the db
----------------------------------------------------------------------------------------- 
*/

router.post('/', (req, res) => {
    const postInfo = req.body;
    if (!postInfo.title || !postInfo.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    Post.insert(postInfo)
        .then(posts => {
            // console.log(posts)
            Post.findById(posts.id)
                // console.log(newPosts)
                .then(newPosts => {
                    res.status(201).json({ success: true, newPosts })
                })
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database", err })
        })
})


router.post('/:id/comments', (req, res) => {
    const commentsInfo = req.body;
    commentsInfo.post_id = req.params.id;
    Post.findById(commentsInfo.post_id)
        .then(post => {
            if (post) {
                Post.insertComment(commentsInfo)
                    .then(comment => {
                        res.status(201).json(comment)
                    })
                    .catch(err => res.status(400).json({ errorMessage: "Please provide text for the comment.", err }))
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => res.status(500).json({ error: "There was an error while saving the comment to the database", err }))
})

/*
-----------------------------------------------------------------------------------------
 delete records
-----------------------------------------------------------------------------------------
*/

router.delete('/:id', (req, res) => {
    const postId = req.params.id

    Post.findById(postId)
        .then(id => {
            if (id) {
                Post.remove(postId)
                    .then(posts => {
                        res.status(200).json({ message: 'post removed', posts })
                    })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist.", err })
            }
        })
        .catch(err => res.status(500).json({ error: "The post could not be removed", err }))
})


/*
-----------------------------------------------------------------------------------------
 modify a record in the db
-----------------------------------------------------------------------------------------
*/

router.put('/:id', (req, res) => {
    const postInfo = req.body;
    if (!postInfo.title || !postInfo.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    Post.findById(req.params.id, postInfo)
        .then(postId => {
            if (postId) {
                Post.update(req.params.id, postInfo)
                    .then(updating => {
                        res.status(200).json({ success: true, updating })
                    })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist.", err })
            }
        })
        .catch(err => res.status(500).json({ error: "The post information could not be modified.", err }))
})

module.exports = router;


// router.post('/', (req, res) => {
//     Post.insert(req.body)
//         .then(post => {
//             if (!post.title || !post.contents) {
//                 res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
//             } else {
//                 res.status(201).json(post)
//             }
//         })
//         .catch(err => {
//             res.status(500).json({ error: "There was an error while saving the post to the database".err })
//         })
// })