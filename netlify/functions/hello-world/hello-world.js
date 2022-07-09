// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const handler = async (event) => {
  try {
    const tweets = await fetch(
      "https://api.twitter.com/2/tweets/search/recent?query=from%3A965845248281755649",
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_TOKEN}` },
      }
    );
    console.log(tweets);
    const tweetsJson = await tweets.json();
    await bot.telegram.sendMessage("-1001518787587", JSON.stringify(tweetsJson));
    return {
      statusCode: 200,
      body: 'Done',
    };
  } catch (error) {
    await bot.telegram.sendMessage("-1001518787587", JSON.stringify(error));
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
