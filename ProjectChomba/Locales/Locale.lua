local addonName, addonTable = ...
local L = setmetatable({}, {
    __index = function(t, k)
        return k
    end
})

local locale = GetLocale()

if locale == "ruRU" then
    L["Project Chomba"] = "Project Chomba"
    L["Quest Tracker"] = "Отслеживание заданий"
    L["Location"] = "Локация"
    L["Chapter"] = "Глава"
    L["Quest"] = "Задание"
    L["Status"] = "Статус"
    L["Completed"] = "Выполнено"
    L["Not Completed"] = "Не выполнено"
    L["How to get"] = "Как получить"
    L["NPC"] = "NPC"
    L["Coordinates"] = "Координаты"
    L["Next Quest"] = "Следующее задание"
    L["No data for this quest."] = "Нет данных для этого задания."
end

-- Add more locales here if needed

addonTable.L = L
