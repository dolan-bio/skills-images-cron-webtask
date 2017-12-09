import * as GoogleImages from "google-images";

export class ImageFetcher {
    private googleImageClient: GoogleImages;

    constructor(config: GoogleSearchConfig) {
        this.googleImageClient = new GoogleImages(config.customSearchEngineId, config.apiKey);
    }

    public async findImage(searchTerm: string): Promise<GoogleImages.Image> {
        const images = await this.googleImageClient.search(`${searchTerm} logo transparent`, {
            size: "medium",
        });

        const filteredImages = images.filter((i) => i.url.endsWith(".png"));

        return filteredImages[0];
    }
}
