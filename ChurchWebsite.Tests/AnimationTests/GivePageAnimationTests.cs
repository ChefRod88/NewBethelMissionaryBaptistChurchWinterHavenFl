namespace ChurchWebsite.Tests.AnimationTests;

/// <summary>
/// Verifies the "coming alive" blur-in animation is correctly wired on the Give page.
/// Give.cshtml uses inline &lt;style&gt; and &lt;script&gt; blocks — the external give.css/give.js
/// are never loaded, so all animation code must live directly in the .cshtml file.
/// </summary>
public class GivePageAnimationTests
{
    private static readonly string RepoRoot =
        Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../.."));

    private static string Read(string relativePath) =>
        File.ReadAllText(Path.Combine(RepoRoot, relativePath));

    [Fact]
    public void Give_Cshtml_HeroTitle_HasWordSpan()
    {
        var html = Read("Pages/Give.cshtml");
        Assert.Contains("class=\"word\"", html);
    }

    [Fact]
    public void Give_Cshtml_InlineStyle_HasWordStartingState()
    {
        var html = Read("Pages/Give.cshtml");
        Assert.Contains(".word", html);
        Assert.Contains("opacity: 0", html);
        Assert.Contains("blur(10px)", html);
    }

    [Fact]
    public void Give_Cshtml_InlineStyle_HasWordActiveState()
    {
        var html = Read("Pages/Give.cshtml");
        Assert.Contains(".word.show", html);
        Assert.Contains("opacity: 1", html);
    }

    [Fact]
    public void Give_Cshtml_InlineScript_HasLoadEventWordBlurin()
    {
        var html = Read("Pages/Give.cshtml");
        Assert.Contains("window.addEventListener('load'", html);
        Assert.Contains("querySelectorAll('.word')", html);
        Assert.Contains("classList.add('show')", html);
    }
}
