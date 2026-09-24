---
name: Civic High-Impact Pulse
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#5d3f3d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#926e6c'
  outline-variant: '#e7bcba'
  surface-tint: '#bf0022'
  primary: '#ac001e'
  on-primary: '#ffffff'
  primary-container: '#d90429'
  on-primary-container: '#ffeae8'
  inverse-primary: '#ffb3af'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#774a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#986000'
  on-tertiary-container: '#ffecd9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3af'
  on-primary-fixed: '#410005'
  on-primary-fixed-variant: '#930018'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes an energetic, transparent, and authoritative civic interface for urban municipal management. Moving decisively away from bureaucratic, stagnant government portals, the aesthetic takes inspiration from bold editorial sports and media interfaces (clean white expanses, high-impact red typographic anchor points, rich deep slate contrasts, and dense visual chips).

The emotional target is three-fold:
1. **Civic Empowerment & Urgency:** Inspires citizens to report neighborhood issues quickly with conviction and clarity.
2. **Institutional Competence:** Communicates public accountability, rapid tracking, and administrative reliability via deep slate navy typography, precise structured badges, and robust status cards.
3. **Contemporary Clarity:** Blends bold editorial scale with functional mobile-first utilities—delivering accessible touch targets, high contrast ratios (WCAG AAA for typography), and immediate data comprehension.

## Colors

The palette balances institutional strength with agile municipal responsiveness:

- **Primary (`#D90429` / Accent `#EF233C`):** The signature civic red, derived from municipal identity and bold editorial headlines. Used for primary CTAs, urgent status highlights, active reporting tabs, and branding focal anchors.
- **Secondary (`#0F172A` / Slate Navy `#1E293B`):** Grounding dark slate used for primary headlines, navigation headers, dark status surfaces, and contrasting callouts.
- **Tertiary (`#F59E0B`):** Amber tone designated strictly for pending reviews, in-progress validations, and precautionary civic alerts.
- **Success (`#10B981`):** Pure civic green allocated to resolved incidencias, completed tasks, and verified resolutions.
- **Destructive/Rejected (`#EF4444`):** Clear functional red for dismissed reports or system errors.
- **Neutrals & Canvas (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`, `#E2E8F0`):** Ultra-clean, breathable backgrounds that allow vibrant tags, photographs of urban damage, and bold typography to step forward without visual friction.

## Typography

Typography merges athletic editorial boldness with accessible civic utility:

- **Display & Headlines (`Outfit`):** Tight, geometric, high-impact sans-serif used in extra-bold weights (`700` and `800`) to anchor hero dashboard sections, category counters, and municipal announcement titles. Negative letter-spacing maintains tight visual cohesion even at scale.
- **Body & Labels (`Plus Jakarta Sans`):** Open apertures, clear x-height, and robust legibility across small handheld viewports. Ensures unhindered readability for form instructions, incident descriptions, geolocated street addresses, and status badges.
- **Labels & Micro-Tags:** Set in uppercase or capitalized semibold configurations with deliberate letter-spacing (`+0.02em` to `+0.04em`) to mirror athletic fixture badges and institutional status stamps.

## Layout & Spacing

The layout is architected around a mobile-first fluid baseline that extends to desktop dashboards:

- **Mobile (Default):** Fluid 4-column layout with `1rem` (16px) margins and `1rem` gutters. Interactive actions maintain a minimum 48px touch boundary.
- **Tablet (640px - 1024px):** 8-column layout with `1.5rem` margins and `1rem` gutters. Report card feeds shift into two-column adaptive grids.
- **Desktop (1024px+):** 12-column grid maxed at 1280px container width with `2.5rem` outer gutters. Splits the screen between live geospatial GIS incident maps on one side and continuous activity tracking lists on the other.
- **Spacing Rhythm:** Based on an 8px progressive scale (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 32px). Cards and forms strictly observe consistent internal padding (`space-md` or `space-lg`) to prevent information clutter.

## Elevation & Depth

Visual hierarchy leverages crisp surface tonal separation and subtle ambient diffusion:

- **Surface Tiers:**
  - `Background Base`: `#F8FAFC`
  - `Surface Elevated / Cards`: `#FFFFFF`
  - `Surface Highlight`: `#0F172A` (Inverted high-contrast cards, e.g., urgent alert banner or mini-dashboard widgets)
- **Ambient Shadow System:**
  - `Elevation-Low` (Cards, inputs): `0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)`
  - `Elevation-Mid` (Hover states, bottom sheet handles, floating buttons): `0 8px 20px -4px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)`
  - `Elevation-High` (Modals, bottom action bar): `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`
- **Border Strokes:** Flat, crisp micro-borders (`1px solid #E2E8F0`) are paired with ambient drop shadows to give structural integrity to incident photo tiles and file upload containers.

## Shapes

The geometric vocabulary features balanced, modern rounded forms:

- **Base Radius (`roundedness: 2` = 0.5rem / 8px):** Applied to form text inputs, small badges, and report preview thumbnails.
- **Large Radius (`rounded-lg` = 1rem / 16px):** Standard for incident cards, photo drag-and-drop dropzones, interactive map containers, and modal sheets.
- **Pill Formats (`rounded-full`):** Reserved for floating action buttons (FAB "Nuevo Reporte"), status indicator chips, filter pills, and bottom navigation pill selectors to preserve rapid ergonomic recognition.

## Components

### Buttons & Action Triggers
- **Primary CTA:** Filled `#D90429` background with white text, font `Outfit` semibold, 48px height, `0.75rem` or pill border-radius. Active hover shifts to `#EF233C` with smooth transition.
- **Secondary CTA:** High-contrast slate `#0F172A` with white typography, or clean white background with `1.5px solid #0F172A` outline.
- **Floating Action Button (FAB):** Centered or bottom-right pill element featuring a bold `+` icon alongside "Reportar", elevated with `Elevation-Mid` and primary civic red.

### Incident Report Cards
- **Structure:** White surface with subtle outline (`#E2E8F0`) and `16px` border-radius.
- **Header:** Category tag (e.g., "Alumbrado", "Bacheo", "Higiene Urbana") aligned left; state tag aligned right.
- **Body:** Bold title, geolocated address in secondary text with micro pin icon, dynamic time badge ("Hace 2 horas").
- **Media Preview:** 16:9 thumbnail on the card edge with rounded inner corners and photo count overlay badge (`+3 fotos`).

### Status Badges & Chips
- **En Revisión / Pendiente:** Amber container (`#FEF3C7`) with text `#B45309` and a pulsing dot.
- **En Cuadrilla / Proceso:** Blue-gray container (`#E0F2FE`) with text `#0369A1`.
- **Resuelto:** Emerald container (`#D1FAE5`) with text `#065F46` and checkmark icon.
- **Cancelado / No Aplica:** Red container (`#FEE2E2`) with text `#991B1B`.

### Mobile Bottom Navigation Bar
- Fixed bottom docking with blur backdrop (`rgba(255, 255, 255, 0.92)` + `backdrop-filter: blur(12px)`).
- Border-top: `1px solid #E2E8F0`.
- 4 navigation points (Inicio, Mis Reportes, Mapa Morón, Perfil) flanking an elevated central primary Red Action Button for instantaneous incident capture.

### Photo Capture & Geolocation Forms
- **Drag & Drop / Camera Trigger:** Large dashed outline container (`2px dashed #CBD5E1`), background `#F8FAFC`, featuring clear upload iconography, camera direct-trigger for smartphone browsers, and real-time thumbnail previews with individual remove actions.
- **Map Pin Selector:** Embedded interactive leaflet/map view with sticky center red beacon indicator and reverse-geocoded address display card floating at the top edge.