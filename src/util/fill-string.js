const _ = require("lodash");

/**
 * Fills a template string.
 * @param {string} str - The template string.
 * @param {object} data - The data to pull from.
 */
function fillStr(str, data) {
    const matches = str.match(/{{ ?[\w\.]+ ?}}/g);

    matches.forEach(match => {
        const path = match.match(/[\w\.]+/)[0];

        const value = _.get(data, path);

        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
            str = str.replace(match, value);
        } else if (typeof value === "object") {
             str = str.replace(match, JSON.stringify(value));
        } else {
            str = str.replace(match, "!INVALID");
        }
    });

    return str;
}

module.exports = fillStr;