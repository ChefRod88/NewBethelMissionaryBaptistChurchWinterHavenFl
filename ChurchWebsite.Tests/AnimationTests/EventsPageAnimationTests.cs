namespace ChurchWebsite.Tests.AnimationTests;

/// <summary>
/// Verifies the "coming alive" blur-in animation is correctly wired on the Events page.
/// CSS: <c>wwwroot/css/pages/events-index.css</c>. JS: <c>wwwroot/js/pages/events-index.js</c>
/// (loaded from the Scripts section in <c>Pages/Events/Index.cshtml</c>). CSS targets .ev-title-word and .ev-eyebrow.
/// </summary>
public class EventsPageAnimationTests
{
    private static readonly string RepoRoot =
        Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../.."));

    private static string Read(string relativePath) =>
        File.ReadAllText(Path.Combine(RepoRoot, relativePath));

    [Fact]
    public void Events_Cshtml_TitleWords_HaveEvTitleWordSpans()
    {
        var html = Read("Pages/Events/Index.cshtml");
        Assert.Contains("ev-title-word", html);
    }

    [Fact]
    public void Events_Css_EvTitleWord_HasStartingState()
    {
        var css = Read("wwwroot/css/pages/events-index.css");
        Assert.Contains(".ev-title-word", css);
        Assert.Contains("opacity: 0", css);
        Assert.Contains("blur(10px)", css);
    }

    [Fact]
    public void Events_Css_EvTitleWord_HasActiveState()
    {
        var css = Read("wwwroot/css/pages/events-index.css");
        Assert.Contains(".ev-title-word.show", css);
        Assert.Contains("opacity: 1", css);
    }

    [Fact]
    public void Events_Css_EvEyebrow_HasActiveState()
    {
        var css = Read("wwwroot/css/pages/events-index.css");
        Assert.Contains(".ev-eyebrow.show", css);
    }

    [Fact]
    public void Events_Cshtml_ScriptsReferenceEventsIndexJs()
    {
        var html = Read("Pages/Events/Index.cshtml");
        Assert.Contains("events-index.js", html);
        Assert.Contains("ev-title-word", html);
    }

    [Fact]
    public void EventsIndexJs_LoadHandler_AddsShowToTitleWords()
    {
        var js = Read("wwwroot/js/pages/events-index.js");
        Assert.Contains("window.addEventListener('load'", js);
        Assert.Contains("ev-title-word", js);
        Assert.Contains("classList.add('show')", js);
    }

    [Fact]
    public void EventsIndexJs_LoadHandler_IncludesEyebrow()
    {
        var js = Read("wwwroot/js/pages/events-index.js");
        Assert.Contains("ev-eyebrow", js);
    }
}
