const Jemplator = require("../src");
const fs = require("fs");

/**
 * @param {"SUCCESS" | "FAILURE" | "PASSED"} res 
 * @param {string} info 
 */
function result(res, info) {
    if (res === "SUCCESS") {
        console.log(`[SUCCESS] ${info}`);
    } else if (res === "FAILURE") {
        console.warn(`[FAILURE] ${info}`);

        process.exit();
    } else {
        console.log(`[PASSED] ${info}`);
    }
}

/* ================= *\
     Testing setup
\* ================= */

// General

const data = {
    user: {
        name: "Juan de Urtubey",
        age: 18,
        gender: "Male"
    },
    numbers: [1, 2, 3]
};

// Template file

const inputFilePath = `${__dirname}/template.txt`;
const outputFilePath = `${__dirname}/output.md`;
const desiredOutputFilePath = `${__dirname}/desired-output.md`;

if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
}

// Template string

const templateStr = "Hello my name is {{ user.name }} and I am a {{ user.age }} year-old {{ user.gender }}!";
const desiredTemplateStrOutput = "Hello my name is Juan de Urtubey and I am a 18 year-old Male!";

/* ============================================= *\
     Template file testing without auto-update
\* ============================================= */

(() => {
    const initialTemplateFileContent = fs.readFileSync(inputFilePath, {
        encoding: "utf8"
    });
    const desiredOutputFileContent = fs.readFileSync(desiredOutputFilePath, {
        encoding: "utf8"
    });

    const template = new Jemplator(inputFilePath, outputFilePath);

    template.fill(data);

    let finalTemplateFileContent = fs.readFileSync(inputFilePath, {
        encoding: "utf8"
    });

    let outputFileContent;

    try {
        outputFileContent = fs.readFileSync(outputFilePath, {
            encoding: "utf8"
        });

        result("FAILURE", "The output file was modified before updating.");
    } catch (err) {
        result("SUCCESS", "The output file was left unchanged before updating.");
    }

    if (initialTemplateFileContent !== finalTemplateFileContent) {
        result("FAILURE", "Template file content was changed (pre-update).");
    } else {
        result("SUCCESS", "Tempalte file content was left unchanged (pre-update).");
    }

    template.update();

    outputFileContent = fs.readFileSync(outputFilePath, {
        encoding: "utf8"
    });

    if (initialTemplateFileContent !== finalTemplateFileContent) {
        result("FAILURE", "Template file content was changed (post-update).");
    } else {
        result("SUCCESS", "Tempalte file content was left unchanged (post-update).");
    }

    if (outputFileContent !== desiredOutputFileContent) {
        result("FAILURE", "Template file wasn't properly filled in.");
    } else {
        result("SUCCESS", "Template file was propely filled in.");
    }

    result("PASSED", "Template file without auto-update");
})();

/* ========================================== *\
     Template file testing with auto-update
\* ========================================== */

(() => {
    const initialTemplateFileContent = fs.readFileSync(inputFilePath, {
        encoding: "utf8"
    });
    const desiredOutputFileContent = fs.readFileSync(desiredOutputFilePath, {
        encoding: "utf8"
    });

    const template = new Jemplator(inputFilePath, outputFilePath);

    template.fill(data);

    let finalTemplateFileContent = fs.readFileSync(inputFilePath, {
        encoding: "utf8"
    });
    let outputFileContent = fs.readFileSync(outputFilePath, {
        encoding: "utf8"
    });

    if (initialTemplateFileContent !== finalTemplateFileContent) {
        result("FAILURE", "Template file content was changed.");
    } else {
        result("SUCCESS", "Tempalte file content was left unchanged.");
    }

    if (outputFileContent !== desiredOutputFileContent) {
        result("FAILURE", "Template file wasn't properly filled in.");
    } else {
        result("SUCCESS", "Template file was propely filled in.");
    }

    result("PASSED", "Template file with auto-update");
})();

/* =========================== *\
     Template string testing
\* =========================== */

(() => {
    const outputString = Jemplator.fillStr(templateStr, data);

    if (outputString !== desiredTemplateStrOutput) {
        result("FAILURE", "Template string wasn't properly filled in.");
    } else {
        result("SUCCESS", "Template string was properly filled in.");
    }

    result("PASSED", "Template string");
})();

/* ================ *\
     Post-testing
\* ================ */

if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
}
