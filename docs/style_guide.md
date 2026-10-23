# STYLE_GUIDE.md ClientReady

**Purpose:** A visual system for an early ClientReady concept: helping people who assemble small websites organize existing material by page and identify unanswered questions. Use this with the brand position when building. Never imply that a proposed feature is already working.

**Status:** User-selected second-round direction, **Content desk (A)**, selected October 9, 2026. ClientReady is the user-confirmed product focus. The user preferred direction 03’s warm palette and requested a clearer core workflow with less repetition. The user selected “A: materials → questions → page content.” Handong reported joint team agreement on ClientReady and a successful real-phone check of the A page and 02 logo on October 9. Device and browser details were not supplied; separate team approval of every visual rule is not implied. The user selected logo concept 02, Aligned sheets, with “02吧” on October 9, 2026; no rationale was provided. Current interview evidence comes from students and small informal projects; professional studio adoption has not been established.

**Reference implementation:** [`refinements/a-content-desk.html`](design/refinements/a-content-desk.html). Local design concept, not a deployed product. Two feedback-driven revisions are in [`refinements/index.html`](design/refinements/index.html); the first six options remain in [`index.html`](design/index.html).

## Color

| Token | Hex | Job |
|---|---|---|
| ink | `#4E281F` | Body text, headings, dark surfaces |
| ink faint | `#76503F` | Secondary text and labels on cream |
| background | `#F8ECD9` | Main page ground |
| accent | `#943E23` | Primary action, selected links, logo (terracotta) |
| second color | `#BA936F` | Warm structural lines and borders; never small text on cream |
| tint | `#F0DDC0` | Quiet explanation panels |
| surface | `#FFFAF1` | Sample project pages and input surfaces |
| border | `#BD9271` | Nonessential separators; not a substitute for focus or field boundaries |
| error | `#A33622` | Error text paired with a specific explanation |
| warning ink | `#87511C` | Missing-item label on `#FFF3D8`; always include words |
| dark accent | `#E8B890` | Logo on an ink background only |

**Rules:** Flat colors. No gradients. Keep terracotta concentrated in the primary action and a small number of intentional details. Muted tan is structural, not a second competing action color. Use text and shape, not color alone, to distinguish missing material. Do not lower text opacity without recalculating contrast. True black and true white are reserved for the one-color logo exports.

## Type

- **Headings:** Georgia, followed by Times New Roman and serif. Bold for hero headings, regular for section headings; sentence case. Hero 59 px maximum / 1.08 line height, approximately -1.8 px tracking. Mobile hero 41 px / 1.08, -1.2 px tracking; reduce if content length changes. Section titles 32–38 px / 1.15. Use italic only for a short meaningful phrase.
- **Body:** Arial, Helvetica, sans-serif. 16 px / 1.55–1.65; lead 18 px / 1.65; labels 11–13 px. Paragraphs should remain within roughly 60–70 characters per line. Tiny labels are auxiliary, never the only explanation of an essential action.
- **Wordmark:** ClientReady, one word, capital C and R, Arial/Helvetica bold, slight negative tracking. Use the provided SVG for consistent spacing. SVG wordmark text remains editable; mark geometry needs no font. The previews need no network fonts.

## Space and layout

- **Content width:** 1176 px inner width; outer shell up to 1260 px including 42 px side padding. At narrower sizes use 23–25 px side padding.
- **Section spacing:** 28–44 px on desktop; 24–36 px on mobile. This revision is intentionally more compact than round one. A 4 px spacing unit supports 8, 12, 16, 24, 32, 48 and 64 px increments.
- **Grids:** Content desk: headline and sample introduction followed by three workflow columns (material, questions, handoff), with 17 px gaps; stack below 740 px. Page workbook alternative: source column plus paired question/result workbook; stack below 750 px. Keep a readable order without relying on visual reordering.
- **Composition:** A compact headline introduces a complete, concrete transformation. The example is central: show actual source text, exact guiding questions, draft page content and unresolved decisions. Avoid large empty hero areas and repeating the same explanation below the example.

## Components

- **Buttons:** Minimum height 44 px. Pill-shaped primary actions; 3–4 px input radius. Primary: terracotta fill and warm white (`#FFF7E9`) text. Secondary: a text link with a visible underline, or an outlined neutral button. Labels say what the click does: “Explore a sample,” not “Get started” when no real signup exists. Hover darkens subtly. Focus uses a 3 px contrasting teal (`#255E79`) outline with 5 px offset.
- **Icons:** For this concept use only the local, original aligned-sheets mark and a consistent set of original geometric page symbols if needed. No icon library is installed. Future UI icons must come from one selected library at a consistent 2 px stroke; document that choice before adding them. Never use emoji as UI icons.
- **Cards:** Warm off-white fill, 1 px tan border, nearly square corners. The questions column may use a slightly deeper warm tint. Page workbook uses one flat offset tan backing; Content desk uses no shadow. Avoid decorative tilted paper or repeated cards without concrete content.
- **Lists and tables:** Prefer clear rows separated by 1 px rules. The handoff groups content under page and section names, preserves draft status, and shows missing information in words. Headers are semantic table headers when the structure is genuinely tabular. Do not encode state only in a colored pill.
- **Links:** Terracotta, underlined in prose. Underline offset 3–5 px. Navigation may omit the underline when its affordance is otherwise clear. All interactive controls must remain visibly focusable.
- **Forms:** Explicit labels, at least 44 px controls, native keyboard operation, visible error text. Review forms save locally and export JSON; they must not imply feedback has been submitted to a team or instructor.

## Imagery

- **Photos:** None in the current exploration. If a future test needs imagery, use actual project materials with permission, or clearly labeled placeholders. No stock photo is required to communicate this workflow.
- **Illustrations and video:** Prefer original HTML/SVG diagrams of pages and content, with honest illustrative labels. Draw simple paper outlines, short content bands, and unanswered questions. No video is currently used. The shown “campus journal” project and other sample projects are invented examples, not customers.
- **What to avoid:** Fake customer logos, testimonial portraits, invented screenshots of functioning integrations, exaggerated metrics, glossy 3D objects, generic AI sparkles and decorative stock people.
- **Alt text:** Tell the truth about the asset. Example: “Illustrative page outline with Home, About and Events; About still needs a bio.” Decorative SVG marks inside a text label are hidden from assistive technology. If AI-created raster imagery is used later, its description should identify it as an illustration when that distinction matters.

### Illustration prompt template

```text
Flat editorial diagram built from original vector page shapes and simple content bands.
Plain composition, with generous whitespace and one clear reading order.
Palette: cream #F8ECD9, ink #4E281F, terracotta #943E23, tan #BA936F, tint #F0DDC0.
Calm, practical mood. No gradients, photography, 3D render, sparkles, fake metrics,
customer marks or decorative UI controls. Show no capability as completed unless it exists.

Scene: [the specific page-organization task]
Color emphasis: terracotta identifies the main relationship, tan supplies structure.
Composition: [single page / before-and-after / three-stage sequence]
Evidence label: "Illustrative concept" when the material is a proposed interface.
```

This is a future-use prompt, not evidence that an image generator was used. Current illustrations were authored directly in SVG and HTML.

## Accessibility floors

4.5:1 text contrast, visible focus on every control, 44 px tap targets for primary controls, and real heading order. Normal body text is ink on cream. Secondary text is ink faint on cream. Warm white on terracotta is the primary button pairing. A calculated contrast report is included in `design/validation.json`.

Use landmarks and a skip link; provide explicit form labels and polite live status updates. Preserve browser zoom and keyboard navigation. Respect reduced-motion preferences. Do not put essential information solely in motion, hover states, icons or color. Handong reports the A page and 02 logo displayed normally on a real phone. An automated responsive audit, keyboard walkthrough and screen-reader check remain unperformed; repeat relevant checks when implementation changes.

## Never

- Never invent evidence, client names, performance numbers, endorsements or shipping dates.
- Never promise that a tool will make a person respond or decide a project's story.
- Never present polished filler text as a contributor's answer.
- Never use generic sparkle marks, gradients, heavy blur, visual noise or all-caps paragraphs.
- Never replace a specific task with vague AI language such as “supercharge your workflow.”
- Never claim this draft was selected or approved by the team until their feedback is recorded.

## Logo

- **The mark:** “Aligned sheets,” concept 02: two offset page shapes, with two transparent content lines in the foreground page. A solid front page and open rear page distinguish the two layers without gradients or effects. The selected family retains the warm terracotta palette.
- **Directions considered:** Twelve first-round marks remain in [`logo/concepts/contact-sheet.html`](logo/concepts/contact-sheet.html). AI initially recommended 01 Page slots and considered 03 Content brackets and 07 Handoff. The user instead selected 02 Aligned sheets with the exact message “02吧” on October 9, 2026. No reason was supplied, so none is attributed to the user. All developed assets now use 02; original sketches are retained as process history.
- **Files:** [`logo/`](logo/). Includes transparent mark, square icon, wordmark, horizontal lockup, dark treatment, true black/white versions, stacked treatment, avatar, SVG favicon, 16/32/48/180/192/512 PNG icons and multi-size ICO. [`logo/asset-preview.html`](logo/asset-preview.html) shows the matrix.
- **Rules:** Clearspace at least one quarter of the mark height. Use the simplified 16 px favicon at small sizes. Full mark minimum 24 px; wordmark minimum 100 px wide; lockup minimum 130 px wide. Terracotta on cream or white, white on terracotta, or the supplied dark treatment. Do not stretch, recolor casually, outline, rotate or add effects. In horizontal lockups, the visible mark height equals the wordmark’s capital height (32 units); the mark aligns with the top of the capitals and their baseline. Keep the 20-unit gap and proportions from the asset files.

## Design references and status

The four references in [`design_process.md`](design/design_process.md) were selected by AI and inspected for their official-page content and structure. They are not claims about the user’s taste. Actual user feedback on directions 01–04 is recorded there, and two revised options respond to it. The user has now reported a successful real-phone check and joint agreement on ClientReady. The reference set remains AI-selected; individual reference preferences and a separate logo-choice rationale were not supplied.
