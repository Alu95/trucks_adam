const {data} = require('./trucks');
const {xnla} = require('./xnla')
const moment = require('moment');
const fs = require("fs");
const XLSX = require("xlsx")
const tempfile = require('tempfile');
/* var xlsx = require('json-as-xlsx'); */

const setEx = new Set(['BCN2',"LIL1"]);

const findId = (source, elem) => {
    if (setEx.has(source)) {
        return xnla.filter(item => item["hub_arrival_trailer_id"] === elem).reduce((acc, currentValue) => {
            //console.log(acc, currentValue)
            if (Array.isArray(acc) && acc.find(elem => elem === currentValue["hub_departure_trailer_id"]))
            {
               return acc;
            }
            else{
                acc.push(currentValue["hub_departure_trailer_id"])
                return acc;
            }
        }, []);
    }
    return "-"
}
const results = data
    .filter(elem => elem["Stow By Date:"].startsWith("2020-10-09"))
    .map(elem => {
        const findElem = findId(elem["Source FC"], elem["Load ID"]);
        const data = Array.isArray(findElem) && findElem.length > 0 ? findElem.join(", ") : findElem;

        return {
            "Load ID": elem["Load ID"],
            "Source FC": elem["Source FC"],
            "Vrid XNLA": data,
            "Details": elem["Details"],
            "Stow By Date:": moment(elem["Stow By Date:"].replace(" CEST", "")).format("HH:mm")
        }
    })

fs.writeFile("./results/" + moment().format("YYYY_MM_DD_HH_mm") + ".json", JSON.stringify(results, null, " "), err => console.log(err));

