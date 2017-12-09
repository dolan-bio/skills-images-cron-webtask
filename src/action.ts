import * as request from "request-promise";

import { ImageFetcher } from "./image-fetcher";
import { Skill } from "./skill-model";

export class SkillAction {
    private imageFetcher: ImageFetcher;

    constructor(config: GoogleSearchConfig) {
        this.imageFetcher = new ImageFetcher(config);
    }

    public async run(): Promise<void> {
        const skills = await Skill.find();
        console.log(skills);

        for (const skill of skills) {
            const image = await this.imageFetcher.findImage(skill.name);

            console.log(image.url);

            if (!image.url) {
                console.log(image);
                continue;
            }

            const response = await request.get({
                url: image.url,
                encoding: null,
                resolveWithFullResponse: true,
            });

            const type = response.headers["content-type"];
            const prefix = "data:" + type + ";base64,";
            const base64 = response.body.toString("base64");
            const base64Prefix = prefix + base64;

            skill.image = base64Prefix;
            await skill.save();
        }
    }
}
