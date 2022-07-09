// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const handler = async (event) => {
  try {
    const tweets = await fetch(
      "https://api.twitter.com/2/tweets/search/recent?query=from%3A36327407&tweet.fields=attachments,author_id,created_at,geo,lang,source,text&expansions=attachments.media_keys,author_id&media.fields=preview_image_url,url",
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_TOKEN}` },
      }
    );
    const tweetsJson = await tweets.json();
    console.log(tweetsJson);
    const { data } = tweetsJson;
    const html = data
      .map((tweet) => {
        const date = new Date(tweet.created_at);
        return `
         Tweeted at - <b>${date.toLocaleString("en-IN")} </b>
         Tweet:
          <pre>${tweet.text}</pre>
      `;
      })
      .join("\n");
    await bot.telegram.sendMessage("-1001518787587", html, {
      parse_mode: "HTML",
    });
    // bot.telegram.
    return {
      statusCode: 200,
      body: "Done",
    };
  } catch (error) {
    await bot.telegram.sendMessage("-1001518787587", JSON.stringify(error));
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
