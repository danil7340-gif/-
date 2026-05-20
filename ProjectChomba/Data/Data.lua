local addonName, addonTable = ...
local Data = {}

-- Structure:
-- Data[LocationName][ChapterName] = { {questID, npcName, x, y, notes}, ... }

Data.Quests = {
    ["Azsuna"] = {
        ["Behind Enemy Lines"] = {
            {id = 40222, npc = "Khaseem", x = 32.2, y = 45.4, notes = "First quest in the zone."},
            {id = 40224, npc = "Khaseem", x = 32.2, y = 45.4, notes = "Requires Behind Enemy Lines."},
        },
        ["Defending Azurewing Repose"] = {
            {id = 40228, npc = "Senegos", x = 45.1, y = 23.3, notes = "Start of the blue dragonflight chain."},
        }
    },
    ["Suramar"] = {
        ["Nightfallen But Not Forgotten"] = {
            {id = 40123, npc = "Khadgar", x = 22.0, y = 33.0, notes = "Starts at Dalaran."},
        }
    }
}

addonTable.Data = Data
