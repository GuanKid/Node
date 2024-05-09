const BlogPost = require('../models/BlogPost.js');
const path = require('path');

module.exports = (req, res) => {
    let image = req.files.image;
    image.mv(path.resolve(__dirname, '..', 'public/img', image.name), async (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }

        // Ensure userId is retrieved from the session
        const userId = req.session.userId;

        try {
            // Create new BlogPost object with userId included
            await BlogPost.create({
                ...req.body,
                image: '/img/' + image.name,
                userid: userId // Include userId here
            });
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    });
};
