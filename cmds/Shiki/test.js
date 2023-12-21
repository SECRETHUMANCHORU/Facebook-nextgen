const axios = require("axios");
module.exports.config = {
    name: "test",
    description: "puku",
    tutorial: "pul",
    author: "Shiki",
    prefix: true
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, type, messageReply, body } = event;

  let question = "";

  if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
    const attachment = messageReply.attachments[0];
    const imageURL = attachment.url;
    question = await convertImageToText(imageURL);

    if (!question) {
      api.sendMessage("❌ Failed to convert the photo to text. Please try again with a clearer photo.", threadID, messageID);
      return;
    }
  } else {
    question = body.slice(5).trim();

    if (!question) {
      api.sendMessage("Please provide a question or query", threadID, messageID);
      return;
    }
  }

  api.sendMessage("🕖|𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖿𝗈𝗋 𝖺𝗇 𝖺𝗇𝗌𝗐𝖾𝗋, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...", threadID, messageID);

  try {
    const res = await axios.get(`https://gpt-35-turbo.hayih59124.repl.co/gpt?msg=${encodeURIComponent(question)}`);
    let respond = res.data.message; // Update this line to match your JSON structure

    respond = formatFont(respond); // Apply font formatting

    api.sendMessage(respond, threadID, messageID);
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    api.sendMessage("An error occurred while fetching data. Please try again later.", threadID, messageID);
  }
};

async function convertImageToText(imageURL) {
  const response = await axios.get(`https://sphericalofficialclients.hayih59124.repl.co/other/img2text?input=${encodeURIComponent(imageURL)}`);
  return response.data.extractedText;
}

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
                                   }
      