
const sharp = require("sharp");

class ImageProcessor {
    async getMetadata(file) {
        let metadata = {};
        try {
            metadata = await sharp(file).metadata();
        } catch (error) {
            metadata = {
                message: `An error occurred during processing: ${error}`
            };
        }
        return metadata;
    }
    
    async cropImage(file, dimentions, size,  dest) {
        try {
            await sharp(file)
            .extract({ width: dimentions[size].width, height: dimentions[size].height, left: dimentions[size].left, top: dimentions[size].top  })
            .toFile(dest);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ImageProcessor();