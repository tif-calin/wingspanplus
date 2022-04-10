# wingspanplusplus
This repository will serve as a hub for all my wingspan helper ideas. Not sure how likely I am to get through most of these ideas, but here's a list of some of them:
 - `makecard` - I'm really inspired by some of the fan-made expansions I saw and wanted to make a helper for that. It'd get data for different bird species and suggest certain attibutes automatically and also show similar existing cards as well as relevant stats (e.g. how many other bird cards exist with certain attributes).
 - `gameplot` - Keep track of certain stats during the game and at the end it can show you some pretty graphs of how the game went. Inspired by the amazing charts at the end of most Civ games that I spent a long time staring at after finishing a game.
 - `hearsong` - Automatically fetch the bird sounds of relevant birds (and play them in the background?).
 - `taxalink` - Show stats about the relevant birds and their taxonomical relationships. I feel like this background information can go a long way in showing the relationships between different birds.
 - `showvids` - I watch a lot of SciShow, Bizarre Creatures, TierZoo, and other science-y YouTube channels. It could be cool to link relevant videos to birds currently in play for people who wanna learn more.
 - `carddata` - WingSearch already exists and it's basically a simple API for all existing bird cards. Basically wanna do the same but add additional information like the names of the birds in different languages, links to their Wikipedias, taxonomic information, bird sounds, tier rankings of different cards by various sources, recommended strategies, etc.
 - `homerule` - A collection of house rules for the game.

## Setup
```
git clone git@github.com:tif-calin/wingspanplus.git
cd wingspanplus
cp .env.local.example .env.local
npm i
npm start
```
