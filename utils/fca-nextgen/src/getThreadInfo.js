"use strict";

const utils = require("../utils");
const log = require("npmlog");

function formatEventReminders(reminder) {
  return {
    reminderID: reminder.id,
    eventCreatorID: reminder.lightweight_event_creator.id,
    time: reminder.time,
    eventType: reminder.lightweight_event_type.toLowerCase(),
    locationName: reminder.location_name,
    locationCoordinates: reminder.location_coordinates,
    locationPage: reminder.location_page,
    eventStatus: reminder.lightweight_event_status.toLowerCase(),
    note: reminder.note,
    repeatMode: reminder.repeat_mode.toLowerCase(),
    eventTitle: reminder.event_title,
    triggerMessage: reminder.trigger_message,
    secondsToNotifyBefore: reminder.seconds_to_notify_before,
    allowsRsvp: reminder.allows_rsvp,
    relatedEvent: reminder.related_event,
    members: reminder.event_reminder_members.edges.map(function(member) {
      return {
        memberID: member.node.id,
        state: member.guest_list_state.toLowerCase()
      };
    })
  };
}

function formatThreadGraphQLResponse(data) {
  return {
    threadID: data.o0.data.message_thread.thread_key.thread_fbid ? data.o0.data.message_thread.thread_key.thread_fbid : data.o0.data.message_thread.thread_key.other_user_id,
    threadName: data.o0.data.message_thread.name,
    participantIDs: data.o0.data.message_thread.all_participants.edges.map(d => d.node.messaging_actor.id),
    userInfo: data.o0.data.message_thread.all_participants.edges.map(d => {
      const profilePicUrl = `https://graph.facebook.com/${d.node.messaging_actor.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      return {
        id: d.node.messaging_actor.id,
        name: d.node.messaging_actor.name,
        firstName: d.node.messaging_actor.short_name,
        vanity: d.node.messaging_actor.username,
        thumbSrc: d.node.messaging_actor.big_image_src.uri,
        profileUrl: profilePicUrl,
        gender: d.node.messaging_actor.gender,
        type: d.node.messaging_actor.__typename,
        isFriend: d.node.messaging_actor.is_viewer_friend,
        isBirthday: !!d.node.messaging_actor.is_birthday
      };
    }),
    unreadCount: data.o0.data.message_thread.unread_count,
    messageCount: data.o0.data.message_thread.messages_count,
    timestamp: data.o0.data.message_thread.updated_time_precise,
    muteUntil: data.o0.data.message_thread.mute_until,
    isGroup: data.o0.data.message_thread.thread_type == "GROUP",
    isSubscribed: data.o0.data.message_thread.is_viewer_subscribed,
    isArchived: data.o0.data.message_thread.has_viewer_archived,
    folder: data.o0.data.message_thread.folder,
    cannotReplyReason: data.o0.data.message_thread.cannot_reply_reason,
    eventReminders: data.o0.data.message_thread.event_reminders ? data.o0.data.message_thread.event_reminders.nodes.map(formatEventReminders) : null,
    emoji: data.o0.data.message_thread.customization_info ? data.o0.data.message_thread.customization_info.emoji : null,
    color: data.o0.data.message_thread.customization_info && data.o0.data.message_thread.customization_info.outgoing_bubble_color ? data.o0.data.message_thread.customization_info.outgoing_bubble_color.slice(2) : null,
    nicknames: data.o0.data.message_thread.customization_info && data.o0.data.message_thread.customization_info.participant_customizations ? data.o0.data.message_thread.customization_info.participant_customizations.reduce(function(res, val) {
      if (val.nickname) res[val.participant_id] = val.nickname;
      return res;
    }, {}) : {},
    adminIDs: data.o0.data.message_thread.thread_admins,
    approvalMode: Boolean(data.o0.data.message_thread.approval_mode),
    approvalQueue: data.o0.data.message_thread.group_approval_queue.nodes.map(a => ({
      inviterID: a.inviter.id,
      requesterID: a.requester.id,
      timestamp: a.request_timestamp,
      request_source: a.request_source
    })),
    reactionsMuteMode: data.o0.data.message_thread.reactions_mute_mode.toLowerCase(),
    mentionsMuteMode: data.o0.data.message_thread.mentions_mute_mode.toLowerCase(),
    isPinProtected: data.o0.data.message_thread.is_pin_protected,
    relatedPageThread: data.o0.data.message_thread.related_page_thread,
    name: data.o0.data.message_thread.name,
    snippet: data.o0.data.message_thread.last_message && data.o0.data.message_thread.last_message.nodes && data.o0.data.message_thread.last_message.nodes[0] ? data.o0.data.message_thread.last_message.nodes[0].snippet : null,
    snippetSender: data.o0.data.message_thread.last_message && data.o0.data.message_thread.last_message.nodes && data.o0.data.message_thread.last_message.nodes[0] && data.o0.data.message_thread.last_message.nodes[0].message_sender && data.o0.data.message_thread.last_message.nodes[0].message_sender.messaging_actor ? data.o0.data.message_thread.last_message.nodes[0].message_sender.messaging_actor.id : null,
    snippetAttachments: [],
    serverTimestamp: data.o0.data.message_thread.updated_time_precise,
    imageSrc: data.o0.data.message_thread.image ? data.o0.data.message_thread.image.uri : null,
    isCanonicalUser: data.o0.data.message_thread.is_canonical_neo_user,
    isCanonical: data.o0.data.message_thread.thread_type != "GROUP",
    recipientsLoadable: true,
    hasEmailParticipant: false,
    readOnly: false,
    canReply: data.o0.data.message_thread.cannot_reply_reason == null,
    lastMessageTimestamp: data.o0.data.message_thread.last_message ? data.o0.data.message_thread.last_message.timestamp_precise : null,
    lastMessageType: "message",
    lastReadTimestamp: data.o0.data.message_thread.last_read_receipt && data.o0.data.message_thread.last_read_receipt.nodes && data.o0.data.message_thread.last_read_receipt.nodes[0] && data.o0.data.message_thread.last_read_receipt.nodes[0].timestamp_precise ? data.o0.data.message_thread.last_read_receipt.nodes[0].timestamp_precise : null,
    threadType: data.o0.data.message_thread.thread_type == "GROUP" ? 2 : 1
  };
}

module.exports = function(defaultFuncs, api, ctx) {
  return function getThreadInfoGraphQL(threadID, callback) {
    var resolveFunc = function() {};
    var rejectFunc = function() {};
    var returnPromise = new Promise(function(resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (utils.getType(callback) != "Function" && utils.getType(callback) != "AsyncFunction") {
      callback = function(err, data) {
        if (err) {
          return rejectFunc(err);
        }
        resolveFunc(data);
      };
    }

    var form = {
      queries: JSON.stringify({
        o0: {
          doc_id: "3449967031715030",
          query_params: {
            id: threadID,
            message_limit: 0,
            load_messages: false,
            load_read_receipts: false,
            before: null
          }
        }
      }),
      batch_name: "MessengerGraphQLThreadFetcher"
    };

    defaultFuncs.post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, form).then(utils.parseAndCheckLogin(ctx, defaultFuncs)).then(function(resData) {
      if (resData.error) {
        throw resData;
      }
      if (resData[resData.length - 1].error_results !== 0) {
        throw new Error("error_result detected");
      }
      callback(null, formatThreadGraphQLResponse(resData[0]));
    }).catch(function(err) {
      log.error("getThreadInfoGraphQL", err);
      return callback(err);
    });

    return returnPromise;
  };
};
