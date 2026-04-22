# New Bethel Missionary Baptist Church — Winter Haven, FL

## Project Overview

ASP.NET Core Razor Pages website for New Bethel Missionary Baptist Church in Winter Haven, FL.

**Stack:** .NET (Razor Pages), C#, HTML, CSS, JavaScript, SignalR

---

## File Organization Rules

### JavaScript
- All `.js` files **must** live under `wwwroot/js/`
- Page-specific scripts go in `wwwroot/js/pages/`
- No JavaScript files outside of `wwwroot/js/` (excluding third-party libraries in `wwwroot/lib/`)

### CSS
- All `.css` files **must** live under `wwwroot/css/`
- Page-specific stylesheets go in `wwwroot/css/pages/`
- The one exception is Razor Pages component-scoped CSS (`.cshtml.css` files that live alongside their `.cshtml` page), which is an ASP.NET Core convention
- No standalone `.css` files outside of `wwwroot/css/` (excluding third-party libraries in `wwwroot/lib/`)

### Third-Party Libraries
- All third-party JS/CSS libraries go in `wwwroot/lib/`
- Do not mix custom code into `wwwroot/lib/`

---

## Pre-Commit Requirements

**Before every local commit and every remote push**, the following must pass:

1. **Build must succeed**
   ```
   dotnet build
   ```
   Zero errors are required. Warnings should be investigated and resolved where practical.

2. **No misplaced files** — verify that:
   - All new `.js` files are inside `wwwroot/js/` (or `wwwroot/lib/` for third-party)
   - All new `.css` files are inside `wwwroot/css/` (or `wwwroot/lib/` for third-party)

Do not commit or push if either check fails.

---

## Directory Structure

```
wwwroot/
  css/
    pages/        # page-specific stylesheets
    site.css      # global styles
    site-mobile.css
  js/
    pages/        # page-specific scripts
    site.js       # global scripts
  images/         # static images
  icons/          # icon assets
  lib/            # third-party libraries (Bootstrap, jQuery, etc.)
Pages/            # Razor Pages (.cshtml + .cshtml.cs)
Models/           # C# data models
Services/         # business logic and service layer
Hubs/             # SignalR hubs
Program.cs        # app entry point and DI configuration
```
