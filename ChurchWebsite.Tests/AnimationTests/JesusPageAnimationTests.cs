namespace ChurchWebsite.Tests.AnimationTests;

/// <summary>
/// Verifies the "coming alive" blur-in animation is correctly wired on the Jesus page.
/// Jesus.cshtml uses inline &lt;style&gt; and &lt;script&gt; blocks — the external jesus.css/jesus.js
/// are never loaded, so all animation code must live directly in the .cshtml file.
/// </summary>
public class JesusPageAnimationTests
{
    private static readonly string RepoRoot =
        Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../.."));

    private static string Read(string relativePath) =>
        File.ReadAllText(Path.Combine(RepoRoot, relativePath));

    [Fact]
    public void Jesus_Cshtml_HeroTitle_HasWordSpan()
    {
        var html = Read("Pages/Jesus.cshtml");
        Assert.Contains("class=\"word\"", html);
    }

    [Fact]
    public void Jesus_Cshtml_InlineStyle_HasWordStartingState()
    {
        var html = Read("Pages/Jesus.cshtml");
        Assert.Contains(".word", html);
        Assert.Contains("opacity: 0", html);
        Assert.Contains("blur(10px)", html);
    }

    [Fact]
    public void Jesus_Cshtml_InlineStyle_HasWordActiveState()
    {
        var html = Read("Pages/Jesus.cshtml");
        Assert.Contains(".word.show", html);
        Assert.Contains("opacity: 1", html);
    }

    [Fact]
    public void Jesus_Cshtml_InlineScript_HasLoadEventWordBlurin()
    {
        var html = Read("Pages/Jesus.cshtml");
        Assert.Contains("window.addEventListener('load'", html);
        Assert.Contains("querySelectorAll('.word')", html);
        Assert.Contains("classList.add('show')", html);
    }
}
