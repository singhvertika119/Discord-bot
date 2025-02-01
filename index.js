import { config } from "dotenv";
config();
import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";

// Create a bot instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("🏓 Pong!");
  } else if (commandName === "serverinfo") {
    await interaction.reply(
      `🏡 Server Name: ${interaction.guild.name}\n👥 Members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "userinfo") {
    await interaction.reply(
      `👤 Username: ${interaction.user.username}\n🆔 ID: ${interaction.user.id}`
    );
  } else if (commandName === "avatar") {
    await interaction.reply(
      interaction.user.displayAvatarURL({ dynamic: true, size: 256 })
    );
  } else if (commandName === "clear") {
    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
      return interaction.reply({
        content: "❌ You don't have permission to delete messages!",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("amount");
    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ Enter a number between 1 and 100.",
        ephemeral: true,
      });
    }

    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({
      content: `✅ Deleted **${amount}** messages!`,
      ephemeral: true,
    });
  } else if (interaction.commandName === "chat") {
    await interaction.deferReply();
    const userMessage = interaction.options.getString("message");

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText",
        {
          prompt: { text: userMessage },
        },
        {
          params: { key: process.env.GEMINI_API_KEY },
        }
      );

      const aiReply =
        response.data.candidates?.[0]?.output || "I couldn't understand that.";
      await interaction.editReply(aiReply);
    } catch (error) {
      console.error(
        "❌ Error fetching AI response:",
        error.response ? error.response.data : error.message
      );
      await interaction.editReply("❌ Sorry, I couldn't process that request.");
    }
  }
});

console.log(
  "Bot Token:",
  process.env.DISCORD_BOT_TOKEN ? "Loaded " : "Not Loaded "
);

// Log in the bot
client.login(process.env.DISCORD_BOT_TOKEN);
