// newPostController.js

module.exports = (req, res) => {
    if (req.session.userId) {
        res.render("create", { userId: req.session.userId, createPost: true });
    } else {
        res.redirect('/auth/login');
    }
};
