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

// When the bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Listen for messages
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "ping") {
    message.reply("Pong! ");
  }
});

// Log in the bot
client.login(process.env.DISCORD_BOT_TOKEN);
