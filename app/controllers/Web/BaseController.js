const config = require("../../config");
const assets = require("../../modules/assets");

class BaseController {
    constructor() {
        this.baseConfig = {
            config: config,
            protocol: '',
            hostname: '',
            baseUrl: '',
            assets: {
                js: false,
                css: false
            }
        }
    }

    /**
     * Returns the complete config base + page specific
     *
     * @param request
     * @param pageSpecificConfig
     */
    mergePageConfig(request, pageSpecificConfig) {
        const files = assets();

        this.baseConfig.hostname = request.get('host');
        this.baseConfig.protocol = request.protocol;
        this.baseConfig.baseUrl = `${request.protocol}://${request.get('host')}${config.application.basePath}`;

        this.baseConfig.assets.js = files["main.js"];
        this.baseConfig.assets.css = files["main.css"];

        return Object.assign(this.baseConfig, pageSpecificConfig);
    }
}

module.exports = BaseController;
