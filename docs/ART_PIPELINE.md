# Art Pipeline

## Current State

Atlas Command currently uses Phaser-generated placeholder art for terrain,
buildings, props, shadows, labels, and agent markers. The placeholders are meant
to preserve layout, hit testing, status glows, and interaction while real art is
created separately.

## Target

The target visual direction is a cozy 2.5D/isometric fantasy village management
game. Buildings should be transparent-background PNG or WebP sprites with baked
soft shadows, three-quarter top-down perspective, consistent lighting from the
upper left, and no text baked into the image.

Claude or Codex should integrate finished assets into the app. Image generation,
an illustrator, or licensed asset packs should create the actual art.

## Asset Folders

- `public/assets/buildings/` - building sprites
- `public/assets/terrain/` - terrain tiles, path textures, grass, water, cliffs
- `public/assets/props/` - trees, bushes, rocks, fences, lamps, crates, signs
- `public/assets/agents/` - agent/villager sprites

## Building Naming Convention

Use these filenames for final building sprites:

- `hq.png`
- `treasury.png`
- `content-studio.png`
- `product-workshop.png`
- `freelance-guild.png`
- `approval-court.png`
- `research-library.png`
- `engineering-workshop.png`
- `atlas-tower.png`

WebP is also acceptable if the registry paths are updated.

## Recommended Dimensions

Start with transparent sprites around these approximate canvas sizes:

- Small buildings: 384x320 px
- Medium buildings: 448x384 px
- HQ / large hall: 512x448 px
- Atlas Tower: 448x560 px

Keep the building footprint centered horizontally. Leave enough transparent
padding for roof overhangs, signs, chimneys, scaffolding, and baked shadows.
Export at higher resolution than display size; Phaser scales down from the
registry dimensions in `lib/game/buildingAssets.ts`.

## Replacing Placeholder Buildings

1. Add the sprite file to `public/assets/buildings/`.
2. Open `lib/game/buildingAssets.ts`.
3. Find the matching building id.
4. Confirm `path`, `width`, `height`, `anchor`, `labelOffsetY`, `statusOffsetY`,
   `clickZone`, and `shadow` fit the sprite.
5. Set `spriteEnabled: true`.
6. Run `npm run lint` and `npm run build`.
7. Open `/base` and verify the label, glow, shadow, and click zone.

If a sprite is not enabled, the Phaser scene falls back to the generated
building silhouette for that id.

## Registry-Owned Interaction

Building click zones, label offsets, status offsets, sprite dimensions, anchor
points, and shadow dimensions are configured in `lib/game/buildingAssets.ts`.
Do not bake labels into art. The app renders labels and status text separately
so names, statuses, accessibility cues, and localization can change.

## License Caution

Downloaded art packs must have a license that allows use in this project,
modification, and future portfolio or commercial deployment. Keep license files
or purchase receipts near the assets or in `docs/`.

## Generation Prompt Templates

Use these as starting prompts. Generate one building per image.

### HQ / Keep Hall

Create a single isometric 2.5D fantasy village building sprite for HQ / Keep
Hall, transparent background, cozy fantasy management game style, warm
hand-painted pixel-art inspired, three-quarter top-down view, larger banner-
topped great hall, lit windows, command hall details, soft baked shadow, no
text, no watermark, consistent lighting from upper left.

### Treasury

Create a single isometric 2.5D fantasy village building sprite for Treasury,
transparent background, cozy fantasy management game style, warm hand-painted
pixel-art inspired, three-quarter top-down view, vault-fronted counting house,
coin trays, ledger details, sturdy stone and wood, soft baked shadow, no text,
no watermark, consistent lighting from upper left.

### Content Studio

Create a single isometric 2.5D fantasy village building sprite for Content
Studio, transparent background, cozy fantasy management game style, warm hand-
painted pixel-art inspired, three-quarter top-down view, creative atelier with
blue roof, quills, camera-like fantasy props, colorful pinboards, soft baked
shadow, no text, no watermark, consistent lighting from upper left.

### Product Workshop

Create a single isometric 2.5D fantasy village building sprite for Product
Workshop, transparent background, cozy fantasy management game style, warm
hand-painted pixel-art inspired, three-quarter top-down view, craft workshop
with blueprints, shelves, tools, warm windows, soft baked shadow, no text, no
watermark, consistent lighting from upper left.

### Freelance Guild

Create a single isometric 2.5D fantasy village building sprite for Freelance
Guild, transparent background, cozy fantasy management game style, warm hand-
painted pixel-art inspired, three-quarter top-down view, tavern-like guild hall
with notice board, contract scrolls, hanging sign without text, soft baked
shadow, no text, no watermark, consistent lighting from upper left.

### Approval Court

Create a single isometric 2.5D fantasy village building sprite for Approval
Court, transparent background, cozy fantasy management game style, warm hand-
painted pixel-art inspired, three-quarter top-down view, small formal courthouse
or temple with columns, amber lanterns, docket board without readable text,
soft baked shadow, no text, no watermark, consistent lighting from upper left.

### Research Library

Create a single isometric 2.5D fantasy village building sprite for Research
Library, transparent background, cozy fantasy management game style, warm hand-
painted pixel-art inspired, three-quarter top-down view, tall archive library
with books, quiet lamps, stacked shelves, soft baked shadow, no text, no
watermark, consistent lighting from upper left.

### Engineering Workshop

Create a single isometric 2.5D fantasy village building sprite for Engineering
Workshop, transparent background, cozy fantasy management game style, warm
hand-painted pixel-art inspired, three-quarter top-down view, workshop with
scaffolding, gears, sparks, blueprint rails, soft baked shadow, no text, no
watermark, consistent lighting from upper left.

### Atlas Tower

Create a single isometric 2.5D fantasy village building sprite for Atlas Tower,
transparent background, cozy fantasy management game style, warm hand-painted
pixel-art inspired, three-quarter top-down view, observatory tower with small
astrolabe or telescope, subtle chart/orbit motifs without text, soft baked
shadow, no text, no watermark, consistent lighting from upper left.
