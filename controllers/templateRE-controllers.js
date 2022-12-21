const fs = require("fs")
const TemplateRE = require("../models/templateRealEstate")

// POST http://localhost:8080/api/RE/template
const createAd = (req, res, next) => {
    // get the uploaded files and other fields from the request
    const files = req.files;
    const { pageId, price, location, category, numberOfRooms, adStatus, adTitle, description, metreSquare } = req.body;
    if (!files) {
        res.status(400).send('Please choose files');
        return;
    }

    // create object to store data in the collection
    let finalImg = {
        pageId,
        price,
        location,
        category,
        numberOfRooms,
        adStatus,
        adTitle,
        description,
        metreSquare,
        images: []
    };

    // iterate over the files and push them into the array
    files.forEach((file, index) => {
        let img = fs.readFileSync(file.path);
        let encode_image = img.toString('base64');

        finalImg.images.push({
            filename: file.originalname,
            contentType: file.mimetype,
            imageBase64: encode_image
        });
    });

    // save the object to the collection
    let newUpload = new TemplateRE(finalImg);
    newUpload.save().then(() => {
        res.status(200).json({ message: 'Files and other fields saved successfully' });
    }).catch(error => {
        res.status(500).json({ error: error.message });
    });
}



// GET http://localhost:8080/api/RE/template/:pageId
const getTemplatesByPageId = (req, res, next) => {
    const pageId = req.params.pageId;

    // Use the pageId to find the templates (houses) that belong to the page
    TemplateRE.find({ pageId: pageId })
        .then(templates => {
            res.status(200).json({
                message: 'Templates retrieved successfully',
                templates: templates
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
}




exports.createAd = createAd;
exports.getTemplatesByPageId = getTemplatesByPageId;
