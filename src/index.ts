import "babel-polyfill";
import * as mongoose from "mongoose";
import * as logger from "winston";

import { SkillAction } from "./action";

module.exports = async (context, cb) => {
    mongoose.connect(context.secrets.MONGODB_URI);

    logger.debug("Getting skills");
    const action = new SkillAction({
        customSearchEngineId: context.secrets.CSE_ID,
        apiKey: context.secrets.API_KEY,
    });

    try {
        const images = await action.run();
        cb(null, images);

        logger.info(images);
    } catch (err) {
        logger.error(err);
        const errorResponse: ServerError = {
            message: "Something went wrong with the server",
        };
        cb(errorResponse);
    }
};
