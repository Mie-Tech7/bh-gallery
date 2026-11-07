# Museum view (3D walkthrough)

The Gallery page has two views: Normal (a grid) and Museum (a first person 3D room). Both read the same artwork list.

Open it at `/gallery?view=museum`, from the Museum link in the header, or with the toggle on the Gallery page.

## How it is built

- Plain Three.js (MIT license), loaded only when someone opens the Museum view, so the rest of the site stays light.
- Every texture (floor, placeholder art, wall labels, lettering) is drawn in code. No image or model files, no third party assets.
- Low poly room: planes and boxes only. Up to 13 spotlights on laptops, 6 on phones. Pixel ratio capped on phones.
- No WebGL: the toggle shows a short notice and stays in Normal view. If the GPU drops out mid visit, it switches back to Normal view.
- Reduced motion: Prev and Next jump straight to a piece instead of gliding, and look speed is lower.

Code:

- `src/lib/gallery/types.ts` artwork and room shapes
- `src/lib/gallery/get-artworks.ts` loads artworks for both views
- `src/lib/gallery/museum-layout.ts` room size, wall slots, collision (unit tested)
- `src/components/gallery/museum-view.tsx` the 3D scene and controls
- `src/components/gallery/gallery-views.tsx` the toggle and Normal view
- `src/components/gallery/artwork-details.tsx` details panel used by both views

## Controls

- Laptop: W A S D or arrow keys to walk, Shift to walk faster, click the room for mouse look (Esc to stop), or drag to look. Q and E or left and right arrows turn. Click a piece for details.
- Phone: joystick bottom left to walk, drag anywhere else to look, tap a piece for details.
- Both: Prev and Next buttons jump between pieces.

## Adding real artwork

A product shows in both gallery views when it is active and its `tags` include `museum`. Until at least one exists, the page shows clearly labeled placeholders. This keeps the seeded demo products out of the gallery.

Optional `museum` fields on a product:

| Field | Meaning |
| --- | --- |
| `featured` | Gets the center wall, a gold frame and a brighter spotlight |
| `medium`, `dimensions`, `year` | Shown on the label and details panel |
| `commentary` | Written note for the piece |
| `commentaryAudioUrl` | Recorded audio (mp3 or m4a). Without it, visitors can use Read it aloud |
| `commentaryBy` | Who is speaking |

The first photo in `images` is hung on the wall. Serve photos around 1600 px on the long side so they load fast.

## Commentary

When a visitor stands near a piece that has commentary and faces it, a "Commentary on ..." button appears. It opens the details panel with the note and either the recorded audio or a Read it aloud button (browser speech, free).

## Shows and auctions (not built yet)

`MuseumRoom` in `types.ts` sketches the shape: a room has a `kind` (`permanent`, `show`, `auction`), the artworks hung in it, and opening and closing times. Plan:

- Show room: a time boxed room with its own name on the wall, a curator intro at the door, commentary on each featured piece, and a link back to the main room through the south doorway.
- Auction room: same room, plus a live current bid on each label and a Bid button that opens a normal web form. Bidding and payment stay outside the 3D view and need their own build.
