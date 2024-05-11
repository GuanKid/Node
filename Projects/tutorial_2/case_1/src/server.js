const mongoose = require("mongoose");

const db = require("./models");

const createTutorial = function (tutorial) {
    return db.Tutorial.create(tutorial).then(docTutorial => {
        console.log("\n>> Created Tutorial:\n", docTutorial);
        return docTutorial;
    });
};

const createImage = function (tutorialId, image) {
    return db.Image.create(image).then(docImage => {
        console.log("\n>> Created Image:\n", docImage);
        return db.Tutorial.findByIdAndUpdate(
            tutorialId,
            {
                $push: {
                    images: {
                        _id: docImage._id,
                        url: docImage.url,
                        caption: docImage.caption
                    }
                }
            },
            { new: true, useFindAndModify: false }
        );
    });
};

const run = async function () {
    var tutorial = await createTutorial({
        title: "Tutorial #1",
        author: "bezkoder"
    });

    tutorial = await createImage(tutorial._id, {
        path: "sites/uploads/images/mongodb.png",
        url: "/images/mongodb.png",
        caption: "MongoDB Database",
        createdAt: Date.now()
    });
    console.log("\n>> Tutorial:\n", tutorial);

    tutorial = await createImage(tutorial._id, {
        path: "sites/uploads/images/one-to-many.png",
        url: "/images/one-to-many.png",
        caption: "One to Many Relationship",
        createdAt: Date.now()
    });
    console.log("\n>> Tutorial:\n", tutorial);
};

mongoose
    .connect("mongodb://localhost/tut2_one_to_many_few", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Successfully connect to MongoDB."))
    .catch(err => console.error("Connection error", err));

run();