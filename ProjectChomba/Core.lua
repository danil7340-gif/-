local addonName, addonTable = ...
local L = addonTable.L
local Data = addonTable.Data

ProjectChomba = CreateFrame("Frame")
ProjectChomba:RegisterEvent("ADDON_LOADED")
ProjectChomba:RegisterEvent("QUEST_LOG_UPDATE")
ProjectChomba:SetScript("OnEvent", function(self, event, ...)
    if event == "ADDON_LOADED" and (...) == addonName then
        self:Initialize()
    elseif event == "QUEST_LOG_UPDATE" then
        if self.UpdateUI then self:UpdateUI() end
    end
end)

function ProjectChomba:Initialize()
    ProjectChombaDB = ProjectChombaDB or {
        minimap = { hide = false },
        window = { x = 0, y = 0, width = 600, height = 400, shown = false }
    }
    self.db = ProjectChombaDB
    print("|cFF00FF00Project Chomba loaded!|r Use /chomba to toggle window.")
end

function ProjectChomba:Print(msg)
    print("|cFF00FF00Project Chomba:|r " .. tostring(msg))
end

-- Slash command
SLASH_PROJECTCHOMBA1 = "/chomba"
SlashCmdList["PROJECTCHOMBA"] = function(msg)
    if ProjectChomba.ToggleWindow then
        ProjectChomba:ToggleWindow()
    else
        print("UI not loaded yet.")
    end
end

function ProjectChomba:IsQuestCompleted(id)
    return IsQuestFlaggedCompleted(id)
end

function ProjectChomba:GetQuestStatus(id)
    if self:IsQuestCompleted(id) then
        return L["Completed"]
    else
        return L["Not Completed"]
    end
end

addonTable.Core = ProjectChomba
