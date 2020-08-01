const moment = require("moment");
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
    hydrated({ ...message, content: content.replace(`${prefix}hydrated`, "") });
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

const hydrated = (message) => {
  const { content, channel, author } = message;
  const timeWithColon = "(([0-1]?[0-9]|2[0-3]):[0-5][0-9])";
  const timeWithoutColon = "(([0-1]?[0-9]|2[0-3])[0-5][0-9])";
  const regex = new RegExp(
    `from (?<from>now|${timeWithColon}|${timeWithoutColon}) to (?<to>${timeWithColon}|${timeWithoutColon}) every (?<minute>[0-9]+) (minute|minutes|min)`
  );
  const text = content.match(regex);
  console.log("==== text", text);
  const end = moment().add("10", "seconds");
  message.reply("Ready to get wet?", { tts: true });

  // const interval = setInterval(() => {
  //   if (moment().isSameOrBefore(end)) {
  //     channel.send(
  //       `See This Drink Water. ${moment().format("HH:mm:ss")} / ${end.format(
  //         "HH:mm:ss"
  //       )}`
  //     );
  //   } else {
  //     message.reply("You need to pee. See you next time.");
  //     removeReminder(intervals, author.id);
  //   }
  // }, 2000);

  // intervals[author.id] = interval;
};

const stop = (message) => {
  const { author } = message;

  if (removeReminder(intervals, author.id)) {
    message.reply("Reminder cancelled.");
  } else {
    message.reply("No reminder found.");
  }
};
