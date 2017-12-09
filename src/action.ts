import { Image } from "google-images";
import * as request from "request-promise";

import { ImageFetcher } from "./image-fetcher";
import { Skill } from "./skill-model";

export class SkillAction {
    private imageFetcher: ImageFetcher;

    constructor(config: GoogleSearchConfig) {
        this.imageFetcher = new ImageFetcher(config);
    }

    public async run(): Promise<void> {
        const skills = await Skill.find({}, "name");

        for (const skill of skills) {
            const images = await this.imageFetcher.findImage(skill.name);

            const base64Prefix = await this.getImage(images);

            skill.image = base64Prefix;
            console.log(`Saving ${skill.name}`);
            await skill.save();
        }
    }

    private async getImage(googleImages: Image[]): Promise<string> {
        for (const image of googleImages) {
            console.log(image.url);

            try {
                const response = await request.get({
                    url: image.url,
                    encoding: null,
                    resolveWithFullResponse: true,
                });

                const type = response.headers["content-type"];
                const prefix = "data:" + type + ";base64,";
                const base64 = response.body.toString("base64");
                const base64Prefix = prefix + base64;

                return base64Prefix;
            } catch {
                continue;
            }
        }
    }
}
