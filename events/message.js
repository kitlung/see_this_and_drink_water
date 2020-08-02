const moment = require("moment-timezone");
const config = require("../config");
const { removeReminder } = require("../utils");

// ==================
// GLOBAL VAR
// ==================
let intervals = [];

module.exports = async (client, message) => {
  const { prefix } = config;
  const { content } = message;

  // let voiceConnection;
  if (content.includes(`${prefix}hydrated`)) {
    hydrated(message, content.replace(`${prefix}hydrated`, ""));
  } else if (content.includes(`${prefix}stop`)) {
    stop(message);
  }

  // else if (content === `${prefix}join`) {
  //   if (message.member.voice.channel) {
  //     voiceConnection = await message.member.voice.channel.join();
  //     const stream = discordTTS.getVoiceStream("this is a test cookie");
  //     const dispatcher = voiceConnection.play(stream);
  //     dispatcher.on("finish", () => voiceChannel.leave());
  //   }
  // }
};

const hydrated = (message, content) => {
  const { channel, author } = message;
  const timeRegex = "(([0-1]?[0-9]|2[0-3]):?[0-5][0-9])";
  const regex = new RegExp(
    `till (?<to>${timeRegex}) every (?<minute>([0-9]+.)?[0-9]+) (minute|minutes|min)`
  );
  const text = content.match(regex);

  if (text && text.groups && text.groups.to && text.groups.minute) {
    let to = text.groups.to;
    let minute = text.groups.minute;

    const toHour = to.substring(0, to.length - 2).replace(":", "");
    const toMinute = to.substring(to.length - 2);

    const end = moment()
      .tz("Asia/Hong_Kong")
      .set({
        hour: parseInt(toHour),
        minute: parseInt(toMinute),
      });

    if (moment().isSameOrAfter(end)) {
      message.reply("Invalid time.");
      return;
    }

    message.reply("Ready to get wet?", { tts: true });
    const interval = setInterval(() => {
      if (moment().tz("Asia/Hong_Kong").isSameOrBefore(end)) {
        message.reply(
          `See This Drink Water. ${moment()
            .tz("Asia/Hong_Kong")
            .format("HH:mm:ss")} / ${end.format("HH:mm:ss")}`
        );
      } else {
        message.reply("You need to pee. See you next time.");
        removeReminder(intervals, author.id);
      }
    }, 1000 * 60 * minute);

    intervals[author.id] = interval;
  } else {
    message.reply("Invalid format. Example: ```till 10:00 every 10 minutes```");
  }
  return;
};

const stop = (message) => {
  const { author } = message;

  if (removeReminder(intervals, author.id)) {
    message.reply("Reminder cancelled.");
  } else {
    message.reply("No reminder found.");
  }
};
