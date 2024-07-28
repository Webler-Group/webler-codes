import * as fs from "fs";
import * as path from "path";
import {BASE_DIR} from "../utils/globals";

const stringEn = fs.readFileSync(`${BASE_DIR}/res/values/strings/en.json`, { encoding: "utf8" });

let fileContent: string = `//Compiled on ${new Date()}\n\n`;

fileContent += makeStringResource("iStringResource", stringEn);

const R_DIR = path.resolve("./ts/src/utils/resourceManager.ts");
fs.writeFileSync(R_DIR, fileContent, "utf-8");
console.log("R generated successfully at: " + R_DIR);


function makeStringResource(interfaceName: string, strSource: string): string {
    let r = `interface ${interfaceName} {\n`;
    let enStr = "\n";
    strSource.split("\n")
        .forEach(str => {
            const _s = str.trim();
            if(_s.indexOf("{") < 0 && _s.indexOf("}") < 0) {
                if(_s.indexOf(":") >= 0) {
                    const _ss = _s.split(":");
                    r += `    ${_ss[0].substring(1, _ss[0].length - 1)}: string,\n`;
                    enStr += `    ${_ss[0].substring(1, _ss[0].length - 1)}: ${_ss[1]}\n`;
                }
            }
        });
    r += "}\n";

    r += `
interface iR {
    _strings: { [key: string]: iStringResource },
    locale: string,
    strings: iStringResource,
    localeStrings: iStringResource,
}

const R: iR = {
    _strings: {
        en: { ${enStr} },
    },
    locale: "en",
    
    get strings(): iStringResource {
        return R._strings["en"];
    },
    
    // TODO: implement auth user locale here
    get localeStrings(): iStringResource {
        return R._strings[R.locale] || { };
    },
};

export default R;
`;
    return r;
}