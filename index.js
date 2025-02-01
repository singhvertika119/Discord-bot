import { config } from "dotenv";
config();
import { Client, GatewayIntentBits } from "discord.js";

// Create a bot instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error("BOT TOKEN IS MISSING! Check your .env file.");
  process.exit(1);
}

// When the bot is ready
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch("1298688293357092874");
    if (channel) {
      channel.send("Hello everyone! I'm online ");
    } else {
      console.error(" Channel not found!");
    }
  } catch (error) {
    console.error("Error fetching channel:", error);
  }
});

// Listen for messages
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "hello") {
    message.channel.send(`Hello ${message.author.username}! `);
  }
});

console.log(
  "Bot Token:",
  process.env.DISCORD_BOT_TOKEN ? "Loaded " : "Not Loaded "
);

// Log in the bot
client.login(process.env.DISCORD_BOT_TOKEN);
