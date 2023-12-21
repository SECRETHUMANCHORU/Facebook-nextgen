"use strict";

var utils = require("../utils");
var log = require("npmlog");

function formatData(data) {
  var retObj = {};
  var genderMap = {
    1: "female",
    2: "male",
  };

  for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
      var innerObj = data[prop];
      const profilePicUrl = `https://graph.facebook.com/${prop}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
 
      var genderValue = genderMap[innerObj.gender] || `Gender ${innerObj.gender}`;

      retObj[prop] = {
        name: innerObj.name,
        firstName: innerObj.firstName,
        uid: prop,
        vanity: innerObj.vanity,
        thumbSrc: innerObj.thumbSrc,
        profileUrl: innerObj.uri,
        gender: genderValue,
        type: innerObj.type,
        isFriend: innerObj.is_friend,
        isBirthday: innerObj.is_birthday,
        highResProfilePic: profilePicUrl  
      };
    }
  }

  return retObj;
}


module.exports = function (defaultFuncs, api, ctx) {
  return function getUserInfo(id, callback) {
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err, userInfo) {
        if (err) return rejectFunc(err);
        resolveFunc(userInfo);
      };
    }

    if (utils.getType(id) !== "Array") id = [id];

    var form = {};
    id.map(function (v, i) {
      form["ids[" + i + "]"] = v;
    });
    defaultFuncs
      .post("https://www.facebook.com/chat/user_info/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.error) throw resData;
        return callback(null, formatData(resData.payload.profiles));
      })
      .catch(function (err) {
        log.error("getUserInfo", "Path: getUserInfo God's Spam Cake Too Much!,Let's Try Again !");
        return callback(err);
      });

    return returnPromise;
  };
};
