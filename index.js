// ========================================================================= \\
require("events").EventEmitter.defaultMaxListeners = 100;
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send(`Project has been startred..!`)
});
app.listen(60000, () => { });
// ========================================================================= \\
const {
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");
const Discord = require("discord.js");
const client = new Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_INTEGRATIONS", "GUILD_MESSAGES"], partials: ["REACTION"] })
require("./Database/connect.js")(client);
var db = require("./Database/database.js")
const devs = [
  "681398021824839700", // ايديك
  "another_id", // ايدي اي شخص تبيه يتحكم بالبوت
  "another_id", // ايدي اي شخص تبيه يتحكم بالبوت
  "another_id", // ايدي اي شخص تبيه يتحكم بالبوت
]
const config = {
guild: "941294660519858178", // ايدي سيرفرك
repeat: true
}
 
// ========================================================================= \\
client.on('ready', async () => {
  console.log("(!) " + client.user.tag + " has been successfully connected.");
  client.user.setPresence({ activities: [{ type: 'PLAYING', name: `By Taha +_+`, status: "idle" }] })
})
// ========================================================================= \\
client.on('ready', async () => {
  var guild = client.guilds.cache.get(config.guild)
  // ----- \\
  await guild.commands.create({
    name: "select_channel",
    description: 'Select the counting room',
    options: [{
      name: 'channel',
      description: 'counting room',
      required: true,
      type: "CHANNEL"
    }]
  })
  // ----- \\
  await guild.commands.create({
    name: "deselect_channel",
    description: 'Deselect the counting room'
  })
  // ----- \\
  await guild.commands.create({
    name: "reset_counting",
    description: 'Reset count numbers'
  })
})
// ========================================================================= \\
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return
  const { commandName, options } = interaction
  if (commandName === 'select_channel') {
  var channel = interaction.options.getChannel('channel')
  var find = await db.findOne({ guild: interaction.guild.id })
  if (find) return interaction.reply({content:`The counting room has already been selected in __<#${find.channel}>__`,ephemeral:true})
  await new db({
      guild: interaction.guild.id,
      channel: channel.id,
      count: 0,
    }).save();
    interaction.reply({content:`Counting room selected in __${channel}__`,ephemeral:true})
  }
  if (commandName === 'deselect_channel') {
  var find = await db.findOne({ guild: interaction.guild.id })
  if (!find) return interaction.reply({content:`Please choose the counting room first`,ephemeral:true})
    await db.deleteOne({ guild: interaction.guild.id })
    interaction.reply({content:`The counting room has been removed from __<#${find.channel}>__`,ephemeral:true})
  }
  if (commandName === 'reset_counting'){
      var find = await db.findOne({ guild: interaction.guild.id })
  if (!find) return interaction.reply({content:`Please choose the counting room first`,ephemeral:true})
    await db.findOneAndUpdate( { guild: interaction.guild.id },
        { count: 0 },{ new: true });
    interaction.reply({content:`Count numbers have been reset to **0**`,ephemeral:true})
  }
})
// ========================================================================= \\
client.on('messageCreate', async message =>{
var find = await db.findOne({ guild: message.guild.id })
if (!find) return
var channel = client.channels.cache.get(find.channel)
if (message.channel.id != channel.id) return
var numbers = parseInt(message.content) === find.count + 1
if (config.repeat) {
if (numbers){
await db.findOneAndUpdate( { guild: message.guild.id },
        {
count: find.count + 1,
author: message.author.id
        },
        { new: true });
} else {
  message.delete()
}
} else {
if (numbers){
if (message.author.id === find.author) return message.delete()
await db.findOneAndUpdate( { guild: message.guild.id },
        {
count: find.count + 1,
author: message.author.id
        },
        { new: true });
} else {
  message.delete()
}
}
})
// ========================================================================= \\
client.login(process.env.token).catch(err => console.log("Invaild Token..!"))
// ========================================================================= \\
