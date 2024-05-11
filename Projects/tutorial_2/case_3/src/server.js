const mongoose = require("mongoose");

const db = require("./models");

const createTutorial = function (tutorial) {
    return db.Tutorial.create(tutorial).then(docTutorial => {
        console.log("\n>> Created Tutorial:\n", docTutorial);
        return docTutorial;
    });
};

const createCategory = function (category) {
    return db.Category.create(category).then(docCategory => {
        console.log("\n>> Created Category:\n", docCategory);
        return docCategory;
    });
};

const addTutorialToCategory = function (tutorialId, categoryId) {
    return db.Tutorial.findByIdAndUpdate(
        tutorialId,
        { category: categoryId },
        { new: true, useFindAndModify: false }
    );
};

const getTutorialsInCategory = function (categoryId) {
    return db.Tutorial.find({ category: categoryId })
        .populate("category", "name -_id")
        .select("-comments -images -__v");
};

const run = async function () {
    var tutorial = await createTutorial({
        title: "Tutorial #1",
        author: "bezkoder"
    });

    var category = await createCategory({
        name: "Node.js",
        description: "Node.js tutorial"
    });

    await addTutorialToCategory(tutorial._id, category._id);

    var newTutorial = await createTutorial({
        title: "Tutorial #2",
        author: "bezkoder"
    });

    await addTutorialToCategory(newTutorial._id, category._id);

    var tutorials = await getTutorialsInCategory(category._id);
    console.log("\n>> all Tutorials in Cagetory:\n", tutorials);
};

mongoose
    .connect("mongodb://localhost/tut2_one_to_many_alot", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Successfully connect to MongoDB."))
    .catch(err => console.error("Connection error", err));

run();