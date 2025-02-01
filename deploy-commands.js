import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";
config();

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong! 🏓"),
  new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Displays server details."),
  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Displays user details."),
  new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Displays your avatar."),
  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletes a specific number of messages (Admin Only).")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with AI")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your message to the AI")
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

(async () => {
  try {
    console.log("🌐 Registering slash commands...");
    await rest.put(Routes.applicationCommands("1335269506553221191"), {
      body: commands,
    });
    console.log("✅ Slash commands registered!");
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
})();
