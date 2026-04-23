# Prime Medical Group — Cursor rules

These rules are enforced for this project.

## CSS & JavaScript placement

**All CSS must live in `wwwroot/css/` and all JavaScript must live in `wwwroot/js/`.**

- **CSS** → `wwwroot/css/booking.css` (booking/appointment flow), `wwwroot/css/styles.css` (global)
- **JS** → `wwwroot/js/booking.js` (booking/appointment flow), `wwwroot/js/main.js` (global)

**Never write `<style>` blocks or `<script>` blocks inside `.cshtml` files.**  
Inline `style=""` attributes on elements are acceptable only for one-off layout values (e.g. `margin-bottom:0`) that are not reused anywhere else.

When adding styles or scripts for a new page or feature:

1. Append to the appropriate existing file (`booking.css` / `booking.js` for anything under `/book`, otherwise `styles.css` / `main.js`).
2. Use scoped class prefixes (e.g. `.sp-` for self-pay, `.lien-` for lien) to avoid collisions.
3. The layout (`Pages/Shared/_Layout.cshtml`) controls which bundles load via `ViewData["BookingPage"]` — keep that pattern; do not add new `<link>` or `<script>` tags directly in page files.

## Hero background video & `wwwroot` media

**Untracked or undeployed video files produce a black hero** (only the CSS `background` shows). The `<video>` element has nothing to decode if the URL 404s.

Rules for this codebase:

1. **Commit and deploy binary media** under `wwwroot/` (e.g. `wwwroot/videos/give.mp4`). If a file stays untracked (`git status` shows `??`) or is gitignored, **production will not have it** unless the host uploads it some other way.
2. **Verify in the browser:** DevTools → **Network** → reload the page → confirm the `.mp4` request is **200**, not **404** or blocked.
3. **Hero layout:** Full-bleed background videos should follow the same stacking model as the home page: a **background wrapper** (video + optional overlay inside) and a **separate, absolutely positioned text layer** over the same height (see `Pages/Give.cshtml` `give-hero-section` / `give-hero-bg-wrap` / `give-hero-text-wrap` and `Pages/Index.cshtml` `hero-bg-wrap` / `hero-text-wrap`). Avoid relying on `z-index: -1` on the video without a clear stacking context—prefer `z-index: 0` on the video, higher values on overlay and copy.
4. **Playback:** Use `autoplay`, `muted`, `loop`, and `playsinline`; in script, set `muted = true` and call `video.play().catch(() => {})` after load where autoplay is flaky. Handle `error` on the video (e.g. gradient fallback) so a missing file is not an empty black box.
5. **Server static files:** `Program.cs` must include `app.UseStaticFiles()` so `wwwroot` paths like `/videos/...` are served in addition to any fingerprinted static-asset pipeline.

## Git workflow

**Local review before any push to GitHub**

1. **Run the site locally** so you can inspect the change in a browser (Church site uses port `7075` per `launchSettings.json`):

   ```bash
   dotnet run --project ChurchWebsite/ChurchWebsite.csproj --launch-profile http
   ```

2. Open `http://localhost:7075` (and the relevant page) and check layout, images, and responsive behavior.
3. **Do not `git push` to GitHub** until the user has reviewed the running site and **explicitly approved a push** (e.g. “yes, push” or “approved”).
4. After approval, follow the **Task completion** section below (merge to `main`, sync both branches) as that task requires.

**When committing locally (before push approval):**

```bash
git status                        # see what changed
git add .                         # stage all changes
git commit -m "type: description" # commit with a clear message
# push only after user approval
```

**Commit message format:**

- `feat: add services section to homepage`
- `fix: logo not displaying on mobile`
- `style: update hero colors to match brand`
- `chore: update build artifacts`

**Rules:**

- Always `git status` before staging so you know exactly what you're committing
- Never commit with a vague message like “changes”, “stuff”, or “fix”
- Commit after each meaningful change — do not batch up many unrelated changes into one commit
- Pushes to `origin` follow **local review and user approval** (see “Local review before any push”); do not push unreviewed work
- Never force-push (`git push --force`) without explicit instruction — it can overwrite history and break the Azure deployment
- The active branch is `cursor/development-environment-setup-7ed9` — always push to this branch
- **Never add `Co-Authored-By` or any AI attribution to commit messages.** Rodney Chery is the sole author of this project. Commit messages must contain only the subject and body — no trailing attribution lines of any kind.

## Task completion (after every task)

When you finish a task (and the user has **approved a push** after local review):

1. **Commit** your work on the working branch (`cursor/development-environment-setup-7ed9`) if the task is not already committed; then **push** to `origin` after approval.
2. **Merge into `main`** (via local merge or GitHub pull request, keeping history clean).
3. **Sync both branches:** `main` and `cursor/development-environment-setup-7ed9` should both contain the same completed work — merge `main` into the feature branch (or rebase as team policy allows) and **push both** to `origin` so local and remote stay aligned.

**Goal:** No completed work left only on one branch; Azure and collaborators see updates on `main`, and the named feature branch is not behind `main`.
