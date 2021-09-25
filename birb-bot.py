import discord
from discord.errors import ClientException
from discord.ext import commands
import youtube_dl
import os

client = commands.Bot(command_prefix="~")
# Youtube download options
ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'outtmpl': 'song.%(ext)s'
}

# @client.command()
# async def play(ctx, url : str):
#     # Delete the existing song 
#     song_there = os.path.isfile("song.mp3")
#     try:
#         if song_there:
#             os.remove("song.mp3")
#     except PermissionError:
#         await ctx.send("Wait for the current playing music to end or use the 'stop' command.")
#         return

#     # Only connects to general for now
#     # TODO: Allow it to connect to whatever channel the user is in
#     voiceChannel = discord.utils.get(ctx.guild.voice_channels, name='General')
#     try:
#         await voiceChannel.connect()
#     except ClientException:
#         pass

#     voice = discord.utils.get(client.voice_clients, guild=ctx.guild)

#     # Download the song using the given options
#     with youtube_dl.YoutubeDL(ydl_opts) as ydl:
#         ydl.download([url])
    
#     # Rename the downloaded file to song.mp3 and play it
#     for file in os.listdir("./"):
#         if file.endswith(".mp3"):
#             os.rename(file, "song.mp3")
#     voice.play(discord.FFmpegPCMAudio("song.mp3"))
    
@client.command()
async def play(ctx, url : str):
    voice = discord.utils.get(client.voice_clients, guild = ctx.guild)

    if not voice:
        v_state = ctx.author.voice
        if not v_state:
            await ctx.send('You\'re not in a voice channel.')
            return
        
        v_channel = v_state.channel
        voice = await v_channel.connect()
    
    if url:
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            info_dict = ydl.extract_info(url, download=False)
            video_title = info_dict.get('title', None)
        
        if not voice.is_playing():
            voice.play(discord.FFmpegPCMAudio('song.mp3'))
            await ctx.send('Now playing ' + video_title)

@client.command()
async def leave(ctx):
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    if voice.is_connected():
        await voice.disconnect()
    else:
        await ctx.send("The bot is not connected to a voice channel.")

@client.command()
async def pause(ctx):
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    if voice.is_playing():
        voice.pause()
        await ctx.send("Paused.")
    else:
        await ctx.send("Currently no audio is playing.")

@client.command()
async def resume(ctx):
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    if voice.is_paused():
        voice.resume()
        await ctx.send("Resumed.")
    else:
        await ctx.send("The audio is not paused.")

@client.command()
async def stop(ctx):
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    voice.stop()

@client.command()
async def commands(ctx):
    await ctx.send("```Commands: \n" + 
                    "~play [YouTube URL] - plays the song in the given youtube link \n" + 
                    "E.g., ~play <https://www.youtube.com/watch?v=dQw4w9WgXcQ> \n" + 
                    "~pause - pauses the current song \n" + 
                    "~resume - resumes the current song \n" + 
                    "~stop - stops playing the current song \n" + 
                    "~leave - stops playing the current song and leaves the channel```")


client.run('ODgxNTk3ODA1MTYzMDYxMjU4.YSvJ8A.cEAwyBD9h2s-4PozVgbU2U9bzPA')