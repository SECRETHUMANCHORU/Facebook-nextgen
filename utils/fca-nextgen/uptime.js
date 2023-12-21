const gradient = require('gradient-string');
const axios = require('axios');

const successLoading = [
    '#33ff33',
    '#3399ff',
    '#00ccff',
    '#ff9933',
    '#ffff33'
];

const randomGradientloading = () => successLoading[Math.floor(Math.random() * successLoading.length)];
const crayon = gradient([randomGradientloading(), randomGradientloading()]);

const faildedLoading = [
    '#FF0004',
    '#8B0000'
];

const randomGradientfailde = () => faildedLoading[Math.floor(Math.random() * faildedLoading.length)];
const crayons = gradient([randomGradientfailde(), randomGradientfailde()]);

class Uptime {
    constructor(link, user) {
        this.link = link;
        this.user = user;

        setInterval(() => {
            axios.get(this.link)
                .then(() => {
                    this.logStatus("ONLINE STATUS ✓", this.user);
                })
                .catch((error) => {
                    this.logError(this.user, error.message);
                });
        }, 5000);
    }

    logStatus(status, link) {
        this.logHeader();
        const linkWithoutProtocol = link.replace(/^https?:\/\//, '');
const target = linkWithoutProtocol.split('.')[0];

        process.stderr.write(crayon(`║ Status: ${status.padEnd(27)}║\n`));
        process.stderr.write(crayon(`║ User: ${target.padEnd(29)}║\n`));
        this.logFooter();
    }

    logHeader() {
        process.stderr.write(crayon("╔═✧════════════════════════════════✧═╗\n"));
        process.stderr.write(crayon("║                                    ║\n"));
        process.stderr.write(crayon("║            ❯ UPTIME LOG ❮          ║\n"));
        process.stderr.write(crayon("║                                    ║\n"));
        process.stderr.write(crayon("╟─✦────────────────────────────────✦─╢\n"));
    }

    logFooter() {
        process.stderr.write(crayon("║                                    ║\n"));
        process.stderr.write(crayon("╚═✧════════════════════════════════✧═╝\n"));
    }

    logError(link) {
        this.logHeaders();
        const error = "error 404 System";
        const linkWithoutProtocol = link.replace(/^https?:\/\//, '');
const target = linkWithoutProtocol.split('.')[0];

        process.stderr.write(crayons(`║ User: ${target.padEnd(29)}║\n`));
        process.stderr.write(crayons(`║ Error: ${error.padEnd(28)}║\n`));
        this.logFooters();
    }

    logHeaders() {
        process.stderr.write(crayons("╔═✧════════════════════════════════✧═╗\n"));
        process.stderr.write(crayons("║                                    ║\n"));
        process.stderr.write(crayons("║            ❯ UPTIME LOG ❮          ║\n"));
        process.stderr.write(crayons("║                                    ║\n"));
        process.stderr.write(crayons("╟─✦────────────────────────────────✦─╢\n"));
    }

    logFooters() {
        process.stderr.write(crayons("║                                    ║\n"));
        process.stderr.write(crayons("╚═✧════════════════════════════════✧═╝\n"));
    }
}

const urlKey = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
const userKey = `${process.env.REPL_OWNER}`;

process.stderr.write(crayon(`[ Url ] » ${urlKey}\n[ User ] » ${userKey}\n`));
const monitor = new Uptime(urlKey, userKey);

function sendRequest() {
    axios.get(`https://uptimerobot.uptimevisionaries.repl.co/add?link=${urlKey}&user=${userKey}`)
        .then(response => {
            process.stderr.write(crayon(`[ Response ] » success when adding the link and user in Uptime Visionaries\n`));
        })
       .catch(error => {
            process.stderr.write(crayons(`[ Error ] » sending request: ${error.message}\n`));
       });
}

sendRequest();

module.exports = Uptime;
