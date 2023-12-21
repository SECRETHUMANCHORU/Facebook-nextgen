module.exports.config = {
name: "element",
description: "The 'element' tool is a versatile and interactive platform designed to help users explore and understand various chemical elements. With an intuitive interface, users can dive deep into the properties, uses, and histories of individual elements, making it an invaluable resource for both students and professionals.",
tutorial: "element",
author: "Choru",
prefix: true
};

module.exports.run = async ({ api, event,input }) => {
const fs = require('fs-extra');
const axios = require('axios');

let data = fs.readFileSync(__dirname + '/privatecache/school/data.json', 'utf-8');
let elements = JSON.parse(data).elements;


  let element = elements[Math.floor(Math.random() * elements.length)];

  
let output = `Name: ${element.name}\n` +
    `Appearance: ${element.appearance}\n` +
    `Atomic Mass: ${element.atomic_mass}\n` +
    `Boil: ${element.boil}\n` +
    `Category: ${element.category}\n` +
    `Color: ${element.color}\n` +
    `Density: ${element.density}\n` +
    `Discovered By: ${element.discovered_by}\n` +
    `Melt: ${element.melt}\n` +
    `Molar Heat: ${element.molar_heat}\n` +
    `Named By: ${element.named_by}\n` +
    `Number: ${element.number}\n` +
    `Period: ${element.period}\n` +
    `Phase: ${element.phase}\n` +
    `Source: ${element.source}\n` +
    `Summary: ${element.summary}\n` +
    `Symbol: ${element.symbol}\n` +
    `Xpos: ${element.xpos}\n` +
    `Ypos: ${element.ypos}\n` +
    `Shells: ${element.shells}\n` +
    `Electron Configuration: ${element.electron_configuration}\n` +
    `Electron Configuration Semantic: ${element.electron_configuration_semantic}\n` +
    `Electron Affinity: ${element.electron_affinity}\n` +
    `Electronegativity Pauling: ${element.electronegativity_pauling}\n` +
    `Ionization Energies: ${element.ionization_energies}\n` +
    `CPK-HEX: ${element["cpk-hex"]}`;

return api.sendMessage(`${output}`, event.threadID, event.messageID)
}
