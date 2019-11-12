const fs = require("fs");
const fillStr = require("../util/fill-string");
const sEval = require("safe-eval");

module.exports = class Jemplator {
    constructor(templateFilePath, outputFilePath, autoUpdate = false) {
        this.autoUpdate = autoUpdate;
        this._templateFilePath = templateFilePath;
        this._outputFilePath = outputFilePath;
        this._templateFileContent = this._open();
        this._fileContent = this._templateFileContent;
    }

    _open() {
        return fs.readFileSync(this._templateFilePath, {
            encoding: "utf8"
        });
    }

    /**
     * Matches subroutine regular expressions.
     * 
     * Indicators:
     * - %s : variable
     * - %p : path.to.value
     * - %e : something to evaluate
     * - %w : any amount of whitespace
     * 
     * @param {string} str - The string to search.
     * @param {string} syntax - The syntax to match.
     * @param {false} strict - Whether or not to make sure that the match is the entire string.
     * 
     * @returns { { match: string, attributes: string[] }[] }
     */
    _matchSubroutineExp(str, syntax, strict = false) {
        syntax = syntax
            .replace(/%s/g, "(\\w+)")
            .replace(/%p/g, "([\\w\\.]+)")
            .replace(/%e/g, "(.+)")
            .replace(/%w/g, "\\s*")
            .replace(/ +/g, "\\s+");

        const matches = str.match(new RegExp(`${strict ? "^" : ""}{{>> ?${syntax} ?}}${strict ? "$" : ""}`, "g"));

        if (!matches) {
            return [];
        }

        return matches.map(match => {
            const attributes = [...match.match(new RegExp(`${strict ? "^" : ""}{{>> ?${syntax} ?}}${strict ? "$" : ""}`))].slice(1);

            return {
                match,
                attributes
            };
        });
    }

    // _s_ prefix means subroutine

    _s_output(str, data) {
        const expressions = this._matchSubroutineExp(str, "js %e");

        for (let exp of expressions) {
            console.log(exp.attributes[0]);
            str = str.replace(exp.match, sEval(this._allRoutines(exp.attributes[0], data)));
        }

        return str;
    }

    _s_all(str, data) {
        str = this._s_output(str, data);

        return str;
    }

    _allRoutines(str, data) {
        str = this._s_all(str, data);
        str = fillStr(str, data);

        return str;
    }

    /**
     * Updates the output file.
     */
    update() {
        fs.writeFileSync(this._outputFilePath, this._fileContent, {
            encoding: "utf8"
        });

        return this;
    }

    /**
     * Fills the template file fields with their respective content.
     * @param {object} fields - The fields to fill and their content.
     */
    fill(fields) {
        this._fileContent = this._allRoutines(this._fileContent, fields);

        if (this.autoUpdate) this.update();

        return this;
    }

    /**
     * Fills a template string.
     * @param {string} str - The template string.
     * @param {object} fields - The fields to fill.
     */
    static fillStr(str, fields) {
        return fillStr(str, fields);
    }
}