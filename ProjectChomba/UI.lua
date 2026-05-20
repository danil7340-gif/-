local addonName, addonTable = ...
local L = addonTable.L
local Data = addonTable.Data
local PC = addonTable.Core

local frame = CreateFrame("Frame", "ProjectChombaMainFrame", UIParent, "ButtonFrameTemplate")
frame:SetSize(700, 450)
frame:SetPoint("CENTER")
frame:Hide()
frame.TitleText:SetText(L["Project Chomba"])
frame.portrait:SetTexture("Interface\\Icons\\INV_Misc_Book_08")

-- Make it draggable
frame:SetMovable(true)
frame:EnableMouse(true)
frame:RegisterForDrag("LeftButton")
frame:SetScript("OnDragStart", frame.StartMoving)
frame:SetScript("OnDragStop", frame.StopMovingOrSizing)

-- Left List (Locations and Chapters)
local scrollFrame = CreateFrame("ScrollFrame", "ProjectChombaScrollFrame", frame, "UIPanelScrollFrameTemplate")
scrollFrame:SetPoint("TOPLEFT", 10, -70)
scrollFrame:SetPoint("BOTTOMLEFT", -520, 10)
scrollFrame:SetWidth(180)

local content = CreateFrame("Frame", nil, scrollFrame)
content:SetSize(160, 400)
scrollFrame:SetScrollChild(content)

-- Right Details Area
local detailFrame = CreateFrame("Frame", "ProjectChombaDetailFrame", frame)
detailFrame:SetPoint("TOPLEFT", 200, -70)
detailFrame:SetPoint("BOTTOMRIGHT", -10, 10)

local detailTitle = detailFrame:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
detailTitle:SetPoint("TOPLEFT", 10, -10)
detailTitle:SetText(L["Quest Tracker"])

local detailScroll = CreateFrame("ScrollFrame", "ProjectChombaDetailScroll", detailFrame, "UIPanelScrollFrameTemplate")
detailScroll:SetPoint("TOPLEFT", 10, -40)
detailScroll:SetPoint("BOTTOMRIGHT", -30, 10)

local detailContent = CreateFrame("Frame", nil, detailScroll)
detailContent:SetSize(450, 800)
detailScroll:SetScrollChild(detailContent)

local function UpdateQuestDetails(location, chapter)
    detailTitle:SetText(location .. " - " .. chapter)

    -- Clear previous content
    local children = { detailContent:GetChildren() }
    for _, child in ipairs(children) do child:Hide() end
    local regions = { detailContent:GetRegions() }
    for _, region in ipairs(regions) do region:Hide() end

    local yOffset = -10
    local quests = Data.Quests[location][chapter]

    for i, q in ipairs(quests) do
        local status = PC:GetQuestStatus(q.id)
        local color = PC:IsQuestCompleted(q.id) and "|cFF00FF00" or "|cFFFF0000"

        local t = detailContent:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
        t:SetPoint("TOPLEFT", 10, yOffset)
        t:SetWidth(400)
        t:SetJustifyH("LEFT")
        t:SetText(string.format("%s[%s] %s|r\n  %s: %s\n  %s: %s (%s, %s)\n  |cff888888%s|r",
            color, status, GetQuestLink(q.id) or ("Quest " .. q.id),
            L["NPC"], q.npc,
            L["Coordinates"], location, q.x, q.y,
            q.notes))
        t:Show()

        yOffset = yOffset - 70
    end
end

local function PopulateList()
    local yOffset = -5
    for locName, chapters in pairs(Data.Quests) do
        local locHeader = content:CreateFontString(nil, "OVERLAY", "GameFontNormal")
        locHeader:SetPoint("TOPLEFT", 10, yOffset)
        locHeader:SetText(locName)
        yOffset = yOffset - 20

        for chapName, _ in pairs(chapters) do
            local btn = CreateFrame("Button", nil, content)
            btn:SetSize(150, 20)
            btn:SetPoint("TOPLEFT", 20, yOffset)

            local btnText = btn:CreateFontString(nil, "OVERLAY", "GameFontHighlightSmall")
            btnText:SetPoint("LEFT", 0, 0)
            btnText:SetText(chapName)
            btn:SetFontString(btnText)

            btn:SetScript("OnClick", function()
                UpdateQuestDetails(locName, chapName)
            end)

            yOffset = yOffset - 20
        end
        yOffset = yOffset - 10
    end
end

function PC:ToggleWindow()
    if frame:IsShown() then
        frame:Hide()
    else
        PopulateList()
        frame:Show()
    end
end

function PC:UpdateUI()
    if frame:IsShown() then
        -- Refresh details if something is selected (logic can be expanded)
    end
end


-- Minimap Button
local minimapBtn = CreateFrame("Button", "ProjectChombaMinimapButton", Minimap)
minimapBtn:SetSize(32, 32)
minimapBtn:SetFrameLevel(8)
minimapBtn:SetHighlightTexture("Interface\\Minimap\\UI-Minimap-ZoomButton-Highlight")

local icon = minimapBtn:CreateTexture(nil, "BACKGROUND")
icon:SetTexture("Interface\\Icons\\INV_Misc_Book_08")
icon:SetSize(20, 20)
icon:SetPoint("CENTER", 0, 0)

local overlay = minimapBtn:CreateTexture(nil, "OVERLAY")
overlay:SetTexture("Interface\\Minimap\\MiniMap-TrackingBorder")
overlay:SetSize(52, 52)
overlay:SetPoint("TOPLEFT", 0, 0)

minimapBtn:SetPoint("TOPLEFT", Minimap, "TOPLEFT", 0, 0) -- Default position

-- Dragging logic for minimap button
minimapBtn:SetMovable(true)
minimapBtn:EnableMouse(true)
minimapBtn:RegisterForDrag("LeftButton")

minimapBtn:SetScript("OnDragStart", function(self) self:StartMoving() end)
minimapBtn:SetScript("OnDragStop", function(self)
    self:StopMovingOrSizing()
    -- Save position logic could go here
end)

minimapBtn:SetScript("OnClick", function()
    PC:ToggleWindow()
end)

minimapBtn:SetScript("OnEnter", function(self)
    GameTooltip:SetOwner(self, "ANCHOR_LEFT")
    GameTooltip:AddLine("Project Chomba")
    GameTooltip:AddLine(L["Quest Tracker"], 1, 1, 1)
    GameTooltip:Show()
end)
minimapBtn:SetScript("OnLeave", function()
    GameTooltip:Hide()
end)
