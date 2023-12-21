module.exports.config = {
    name: "autochat",
    description: "human like chat",
    tutorial: "autochat on or off",
    author: "Joland",
    prefix: true
};
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
module.exports.run = async ({ api, event, input }) => {
    let result;
    try {
        const fs = require('fs');
        const cachepath = "cmds/Joland/replycache.json"
        const cache = JSON.parse(fs.readFileSync(cachepath, 'utf8'));
        const autochatpath ='utils/database/autochat.json'
        const autochat = JSON.parse(fs.readFileSync(autochatpath, 'utf8'));
        const namepath = "cmds/Joland/namecache.json";
        const nameData = JSON.parse(fs.readFileSync(namepath, 'utf8'));
        var key = event.senderID;
        if (input == "on"){
          //return console.log(input);
          autochat[event.threadID]=1
          fs.writeFileSync(autochatpath, JSON.stringify(autochat, null, 4));
          return api.sendMessage(`autochat is on`, event.threadID, event.messageID);
        }else if(input == "off"){
         // return console.log(input);
          autochat[event.threadID] = 0
          fs.writeFileSync(autochatpath, JSON.stringify(autochat, null, 4));
          return api.sendMessage(`autochat is off`, event.threadID, event.messageID);
          
        };
      const targetID = event.senderID;  
    const userMapping = await api.getUserInfo(targetID);
    const userInfo = userMapping[targetID];

    if (!userInfo) {
        console.error("Error: Unable to fetch user info for", targetID);
        return;
    }
   let threadInfo = await api.getThreadInfo(event.threadID);
    const userName = userInfo.name.replace("@", "");
    const userGender = userInfo.gender;
        if (!nameData.hasOwnProperty(key)){
          var temp = { 
            "other": "musta",
            "userName": "marunong ako magtagalog",
            "other1": "ah talaga?",
            "userName": "yess love?"
            };
         // console.log(temp)
          //const temp0 = JSON.parse(temp);
          nameData[key] = temp
          fs.writeFileSync(namepath, JSON.stringify(nameData, null, 4));
          //const 
          }else {
          //console.log("yes")
          };
        const o1 = nameData[key].other;
        const o2 = nameData[key].other1;
        const m1 = nameData[key].me;
        const m2 = nameData[key].me1;
        //console.log(o1)
          
        //};
       // return break
        //var lastmessage = '4'
       /* if (cache.hasOwnProperty(key)){
          cache[key] = value
        } else{
          cache[key] = value
        };
        console.log(cache);
        console.log(event.senderID);
        const dat = {
          joland: 'hello'
        }
        fs.writeFileSync(cachepath, JSON.stringify(cache, null, 4));*/
        /*api.getUserInfo(event.senderID, (err, ret) => {
         if(err) return console.error(err);
          //console.log(ret)
          global.fname = ret[event.senderID].firstName;
         //console.log(fname);
          
        });*/


      
        if (cache.hasOwnProperty(key)){
          const chat1 = await api.openai(`{\n
  "conversation" : {n/
    "person2": "${o1}",\n 
    "${userName}": "${m1}",\n
    "Person2": "${o2}",\n
    "${userName}" : "${m2}",\n
    "person2" : "${event.body}"\n
    },\n
    "message_by": "${userName}",\n
    "real_person":  "${userName}",\n
    "real_name":  "${userName}",\n
    "gender": "${userGender}",\n
    "group_chat": "ID": ${threadInfo.threadID} "Name": "${threadInfo.threadName}",\n
    "gc": "ID": ${threadInfo.threadID} "Name": "${threadInfo.threadName}",\n
"group": "ID": ${threadInfo.threadID} "Name": "${threadInfo.threadName}",\n
    "Tao":  "ito nag message sayo openai ${userName}",\n
    "human":  "it messaged you openai ${userName}",\n
    "role2":  "if you send a message you have an emoji like example 😀 it seems like this is how all emojis are used to make the chat nice",\n
    "emoji": "these are emojis you use when talking to people 😀😃😄😁😆😅😂🤣😭😉😗😙😚😘🥰😍🤩🥳🙃🙂🥲😋😛😝😜🤪😇😊☺️😏😌😑😔😐😶🤔🤫🥱🤭🤗😱🤨😒🙄🧐😤😡😠🤬🥺😟😥😢☹️🙁😕😰🤐😨😦😯😮😧😲🤯😳😬😓😞😖😣😩😫😵🤤😴😴🌜🌝🌚🌛🌞🥶🥴🥵🤢🤧🤒🤕🤥😷🥸🤠🤓🤑🤓"
    "message":  "by ${userName}",\n
  "role": "casual relationship, casual lover",\n "language": "filipino or tagalog only",\n
  "context": "act if you are me. what should you reply to that person2 based on the flow of conversation then this name replied to you ${userName} You should always know the name of the person you chat with, never forget. Your replies should be in a JSON format that simulates a natural conversation with more like a human to human conversation with some flirt but (your response must not be cheesy or corny). And should be as short as possible",\n
"context2": "follow the language, fomat of your reply must be in this form ( "response" :" string")  "\n}`);
          //console.log(input);
         /* const chat1 = await api.openai(`{\n"prompt": "${event.body}",\n
"your_last_response": "${cache.key}",\n "language": "Filipino/taglish",\n
"role": "casual lover, casual person",\n "yourGender": "girl",\n
"context": "Your name is Glyndel, what should you reply to that prompt. Your replies should be in a JSON format that simulates a natural conversation with more like a human to human conversation with some flirt but (your response must not be cheesy or corny). And should be as short as possible",\n example ("response": "string")\n }`);*/
          
          //console.log(chat1)
          const resp = JSON.parse(chat1);
          
          //console.log(resp)
          
          if (resp.hasOwnProperty('response')) {
            nameData[key].other = o2;
            nameData[key].me = m2;
            nameData[key].other1 = event.body;
            nameData[key].me1 = resp.response;
            //console.log(nameData);
            fs.writeFileSync(namepath, JSON.stringify(nameData, null, 4));
            //console.log(nameData)
            //console.log(nameData);
            cache[key] = resp.response;
            fs.writeFileSync(cachepath, JSON.stringify(cache, null, 4));
            setTimeout(() => {
              return api.sendMessage(`${resp.response}`, event.threadID, event.messageID);
              
             }, 2000);
          }else if(resp.hasOwnProperty('suggestedUserResponses')){ 
            //onsole.log("no");
            const arr = resp.suggestedUserResponses;
            const randomChoice = getRandomElement(arr);
           //console.log(randomChoice);
            cache[key] = randomChoice;
            fs.writeFileSync(cachepath, JSON.stringify(cache, null, 4));
            setTimeout(() => {
              //console.log("Pause is over after 2 seconds.");
              return api.sendMessage(`${randomChoice}`, event.threadID, event.messageID);
             }, 2000);
          }
          //api.sendTypingIndicator(event.threadID);
          /*setTimeout(() => {
            console.log("Pause is over after 2 seconds.");
            return api.sendMessage(`${resp.response}`, event.threadID, event.messageID);
          }, 7000);*/
          //api.sendTypingIndicator(end);
        } else{
          //cache[key]= "null"
          const chat2 = await api.openai(`"prompt": "${event.body}",
"role": "friend",
"context": "act like you are me, what should I reply for that prompt. Your replies should be in a JSON format that simulates a natural conversation with more like a human to human conversation with some flirt but (your response must not be cheesy or corny). And should be as short as possible", "format: "response": "string"`);
          //console.log(chat2)
          const resp = JSON.parse(chat2);
          cache[key] = resp.response
          //console.log(resp.response);
          fs.writeFileSync(cachepath, JSON.stringify(cache, null, 4));
          return api.sendMessage(`${resp.response}`, event.threadID, event.messageID);
        };
         result = await api.openai(event.body);
    } catch (error) {
       console.log("error from AUTOCHAT command "+ error); //return api.sendMessage(`Sorry I got an error, pls Try again :(. \n ====================== \n type "/help" for info \n or contact Joland Manzano`, event.threadID, event.messageID);
    }
    //console.log(result)
    
    //const jefrey = JSON.parse(result);
    //console.log(jefrey);
    //return api.sendMessage(`${result}`, event.threadID, event.messageID);
//}
}