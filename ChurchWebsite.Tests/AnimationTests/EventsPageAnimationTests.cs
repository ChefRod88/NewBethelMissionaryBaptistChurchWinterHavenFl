namespace ChurchWebsite.Tests.AnimationTests;

/// <summary>
/// Verifies the "coming alive" blur-in animation is correctly wired on the Events page.
/// Events uses an external events-index.css (loaded correctly) but an inline &lt;script&gt; block,
/// so the JS must live in Index.cshtml directly. CSS targets .ev-title-word and .ev-eyebrow.
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
    public void Events_Cshtml_InlineScript_HasLoadEventTargetingTitleWords()
    {
        var html = Read("Pages/Events/Index.cshtml");
        Assert.Contains("window.addEventListener('load'", html);
        Assert.Contains("ev-title-word", html);
        Assert.Contains("classList.add('show')", html);
    }

    [Fact]
    public void Events_Cshtml_InlineScript_HasLoadEventTargetingEyebrow()
    {
        var html = Read("Pages/Events/Index.cshtml");
        Assert.Contains("ev-eyebrow", html);
    }
}
