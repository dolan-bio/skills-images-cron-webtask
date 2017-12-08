import * as request from "request-promise";

import { ImageFetcher } from "./image-fetcher";
import { Skill } from "./skill-model";

interface ISkillCombinedResult {
    image: string;
    name: string;
}

export class SkillAction {
    private imageFetcher: ImageFetcher;

    constructor(config: GoogleSearchConfig) {
        this.imageFetcher = new ImageFetcher(config);
    }

    public async run(): Promise<ISkillCombinedResult[]> {
        const skills = await Skill.find();

        const images: ISkillCombinedResult[] = [];
        for (const skill of skills) {
            const image = await this.imageFetcher.findImage(skill.name);

            const response = await request.get({
                url: image.url,
                encoding: null,
                resolveWithFullResponse: true,
            });

            const type = response.headers["content-type"];
            const prefix = "data:" + type + ";base64,";
            const base64 = response.body.toString("base64");
            const base64Prefix = prefix + base64;

            images.push({
                image: base64Prefix,
                name: skill.name,
            });
        }

        return images;
    }
}
