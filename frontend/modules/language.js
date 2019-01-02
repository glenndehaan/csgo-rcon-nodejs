import langFiles from "../lang";
import store from './store';
import storage from './storage';

export default new class language {
    /**
     * Constructor
     */
    constructor() {
        window.langSwitch = this.set;
    }

    /**
     * Checks if the initial lang has been set and loads the lang set
     */
    init() {
        const currentLang = storage.get("lang");
        if(currentLang === null) {
            storage.set("lang", "en");
            this.set("en");

            return;
        }

        this.set(currentLang);
    }

    /**
     * Sets the new language
     *
     * @param lang
     */
    set(lang) {
        if(typeof langFiles[lang] !== "undefined") {
            storage.set("lang", lang);

            store.setState({
                lang: langFiles[lang]
            });
        } else {
            console.warn("Language not found!")
        }
    }
}
