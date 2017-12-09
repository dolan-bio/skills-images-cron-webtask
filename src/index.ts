import "babel-polyfill";
import * as mongoose from "mongoose";

import { SkillAction } from "./action";

module.exports = async (context, cb) => {
    mongoose.connect(context.secrets.MONGODB_URI);

    console.log("Getting skills");
    const action = new SkillAction({
        customSearchEngineId: context.secrets.CSE_ID,
        apiKey: context.secrets.API_KEY,
    });

    try {
        const images = await action.run();
        cb(null, images);
    } catch (err) {
        console.error(err);
        const errorResponse: ServerError = {
            message: "Something went wrong with the server",
        };
        cb(errorResponse);
    }
};
