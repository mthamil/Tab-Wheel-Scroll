
function setDefaultSelections()
{
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService);
        
    var tabScrollPrefs = prefService.getBranch("extensions.tabscroll.");
    var downScrollsLeft = tabScrollPrefs.getBoolPref("downScrollsLeft");
    if (downScrollsLeft)
    {
        var downIsLeftOption = document.getElementById("downIsLeft");
        downIsLeftOption.setAttribute("selected", true);
        var downIsRightOption = document.getElementById("downIsRight");
        downIsRightOption.setAttribute("selected", false);
    }
    else
    {
        var downIsRightOption = document.getElementById("downIsRight");
        downIsRightOption.setAttribute("selected", true);
        var downIsLeftOption = document.getElementById("downIsLeft");
        downIsLeftOption.setAttribute("selected", false);
    }
}
