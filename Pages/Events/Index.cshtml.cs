using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ChurchWebsite.Pages.Events;

public class IndexModel : PageModel
{
    private static readonly Regex BeaconFilePattern = new(
        "^bethel_beacon_(front|back)_(?<dateToken>.+)\\.(?:jpe?g)$",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static readonly string[] SupportedDateFormats =
    [
        "yyyy-MM-dd",
        "yyyy_MM_dd",
        "yyyyMMdd",
        "MM-dd-yyyy",
        "M-d-yyyy",
        "MM_dd_yyyy",
        "M_d_yyyy",
        "MMMM-d-yyyy",
        "MMMM_d_yyyy",
        "MMM-d-yyyy",
        "MMM_d_yyyy"
    ];

    private readonly IWebHostEnvironment _environment;

    public IndexModel(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public BeaconPairViewModel? CurrentBeacon { get; private set; }

    public bool HasCurrentBeacon => CurrentBeacon is not null;

    public void OnGet()
    {
        CurrentBeacon = LoadCurrentBeacon();
    }

    private BeaconPairViewModel? LoadCurrentBeacon()
    {
        var beaconDirectory = Path.Combine(_environment.WebRootPath, "BethelBeacon");
        if (!Directory.Exists(beaconDirectory))
        {
            return null;
        }

        var candidates = new Dictionary<string, BeaconCandidate>(StringComparer.OrdinalIgnoreCase);

        foreach (var filePath in Directory.EnumerateFiles(beaconDirectory, "*.*", SearchOption.TopDirectoryOnly))
        {
            var fileName = Path.GetFileName(filePath);
            var match = BeaconFilePattern.Match(fileName);
            if (!match.Success)
            {
                continue;
            }

            var side = match.Groups[1].Value.ToLowerInvariant();
            var dateToken = match.Groups["dateToken"].Value;
            var fileInfo = new FileInfo(filePath);

            if (!candidates.TryGetValue(dateToken, out var candidate))
            {
                candidate = new BeaconCandidate(
                    dateToken,
                    TryParseDateToken(dateToken),
                    fileInfo.LastWriteTimeUtc);
                candidates[dateToken] = candidate;
            }
            else if (fileInfo.LastWriteTimeUtc > candidate.LastUpdatedUtc)
            {
                candidate.LastUpdatedUtc = fileInfo.LastWriteTimeUtc;
            }

            var asset = new BeaconAsset(
                $"/BethelBeacon/{Uri.EscapeDataString(fileName)}",
                BuildAltText(side, dateToken),
                fileInfo.LastWriteTimeUtc);

            if (side == "front")
            {
                if (candidate.Front is null || asset.LastUpdatedUtc > candidate.Front.LastUpdatedUtc)
                {
                    candidate.Front = asset;
                }
            }
            else if (candidate.Back is null || asset.LastUpdatedUtc > candidate.Back.LastUpdatedUtc)
            {
                candidate.Back = asset;
            }
        }

        var selectedPair = candidates.Values
            .Where(candidate => candidate.Front is not null && candidate.Back is not null)
            .OrderByDescending(candidate => candidate.ParsedDate ?? DateOnly.MinValue)
            .ThenByDescending(candidate => candidate.LastUpdatedUtc)
            .FirstOrDefault();

        if (selectedPair?.Front is null || selectedPair.Back is null)
        {
            return null;
        }

        return new BeaconPairViewModel(
            FormatDateLabel(selectedPair.DateToken, selectedPair.ParsedDate),
            selectedPair.DateToken,
            selectedPair.Front,
            selectedPair.Back);
    }

    private static DateOnly? TryParseDateToken(string dateToken)
    {
        foreach (var format in SupportedDateFormats)
        {
            if (DateOnly.TryParseExact(dateToken, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
            {
                return parsedDate;
            }
        }

        return DateOnly.TryParse(dateToken, CultureInfo.InvariantCulture, DateTimeStyles.None, out var fallbackDate)
            ? fallbackDate
            : null;
    }

    private static string FormatDateLabel(string dateToken, DateOnly? parsedDate)
    {
        return parsedDate?.ToString("MMMM d, yyyy", CultureInfo.InvariantCulture) ?? dateToken.Replace('_', ' ');
    }

    private static string BuildAltText(string side, string dateToken)
    {
        var pageLabel = side == "front" ? "front page" : "back page";
        return $"Bethel Beacon {pageLabel} for {FormatDateLabel(dateToken, TryParseDateToken(dateToken))}.";
    }

    public sealed record BeaconPairViewModel(
        string DisplayDate,
        string DateToken,
        BeaconAsset Front,
        BeaconAsset Back);

    public sealed record BeaconAsset(
        string Url,
        string AltText,
        DateTime LastUpdatedUtc);

    private sealed class BeaconCandidate
    {
        public BeaconCandidate(string dateToken, DateOnly? parsedDate, DateTime lastUpdatedUtc)
        {
            DateToken = dateToken;
            ParsedDate = parsedDate;
            LastUpdatedUtc = lastUpdatedUtc;
        }

        public string DateToken { get; }

        public DateOnly? ParsedDate { get; }

        public DateTime LastUpdatedUtc { get; set; }

        public BeaconAsset? Front { get; set; }

        public BeaconAsset? Back { get; set; }
    }
}
