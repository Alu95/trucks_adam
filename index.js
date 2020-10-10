const {data} = require('./trucks');
const {xnla} = require('./xnla')
const moment = require('moment');
const fs = require("fs");

const setEx = new Set(['BCN2',"LIL1"]);

const findId = (source, elem) => {
    if (setEx.has(source)) {
        return xnla.filter(item => item["hub_arrival_trailer_id"] === elem);
    }
    return source;
}
const results = data
    .filter(elem => elem["Stow By Date:"].startsWith("2020-10-09"))
    .map(elem => {
        return {
            "Load ID": elem["Load ID"],
            "Source FC": {
                "Source FC": elem["Source FC"],
                xnla: findId(elem["Source FC"], elem["Load ID"])
            },
            "Details": elem["Details"],
            "Stow By Date:": moment(elem["Stow By Date:"].replace(" CEST", "")).format("HH:mm")
        }
    });

fs.writeFile("test.json", JSON.stringify(results, null, " "), err => console.log(err));

console.log(
    results
);