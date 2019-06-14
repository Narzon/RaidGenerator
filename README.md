WoW Raid Generator
code compiled by Nicolai Antonov

This web app will take in any World of Warcraft guild and randomly generate a valid raid configuration based on provided parameters. 

Features include the ability to provide the names of "required" players who will always be included in the raid, the ability to provide "alt groups" of characters belonging to the same person to prevent repeat characters appearing in the raid, and the ability to "reroll" individual characters in the generated configuration to another character of the same role.

Drawbacks of the app include:
 - No easy way to deal with multiple "alt" characters beyond inputting the "alt group" string manually; there is no publically available method to see which characters belong to the same   account. 
 - No way to differentiate active and inactive characters/account; client will have to reroll these characters or regularly remove them from the guild.
 - No way to guarantee appropriate roles for each character; Blizzard API should return the role of each character's current spec, but players can always switch between specs.

Potential future updates include:
 - Provide a visual display of all provided "alt groups" for the user to keep track of.
 - Saving these provided groups to cookies
 - Provide ability to switch the role of any given character in the generated raid
