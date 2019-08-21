WoW RaidGenerator
code compiled by Nicolai Antonov

View at https://raidgenerator.herokuapp.com (requires valid Battle.net account)
or view demo at https://drive.google.com/file/d/1aviNXgv_3d-Dhyt75MycDYU-tzUjVZTY/view

This web app will take in any World of Warcraft guild and randomly generate a valid raid configuration based on provided parameters. The app is build in React and served by a Node.js Express server. Notable packages used include:
* React Bootstrap
* MongoDB (to store and provide user with auth token for accessing Battle.net API)
* Redux

Features include the ability to provide the names of "required" players who will always be included in the raid, the ability to provide "alt groups" of characters belonging to the same person to prevent repeat characters appearing in the raid, and the ability to "reroll" individual characters in the generated configuration to another character of the same role.

WIP goals:
 - No easy way to deal with multiple "alt" characters beyond inputting the "alt group" string manually; there is no publically available method to see which characters belong to the same account. 
 - No way to differentiate active and inactive characters/account; client will have to reroll these characters or demote/remove them from within the guild.
 - No way to guarantee appropriate roles for each character; Blizzard API should return the role of each character's current spec, but players often switch to secondary specs.

Potential future updates include:
 - Provide a visual display of all provided "alt groups" for the user to keep track of.
 - Provide ability to switch the role of any given character in the generated raid
