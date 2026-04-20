# Design System Document: The Career Curator

## 1. Overview & Creative North Star
This design system rejects the "database" aesthetic common in recruitment tools in favor of **"The Career Curator."** The goal is to transform the search for employment into a high-end editorial experience. 

We achieve this through a "Luminous Editorial" approach: leveraging high-contrast typography, intentional asymmetry, and a sophisticated layering of surfaces. By moving away from rigid grids and standard borders, we create a digital environment that feels breathable, authoritative, and bespoke. The interface shouldn't just list jobs; it should present opportunities like pieces in a gallery.

---

## 2. Colors
Our palette is anchored by a deep, professional Emerald Green, supported by a sophisticated range of tonal neutrals that define structure without the need for traditional lines.

### Brand Palette
*   **Primary (`#006e2e`)**: Used for high-authority actions and core brand moments.
*   **Primary Container (`#00b14f`)**: Our vibrant Emerald. Use this for main CTAs and "New" status indicators to draw the eye with energy.
*   **Tertiary (`#af294c`)**: Reserved for critical alerts or high-energy accents (e.g., "Urgent Hiring").

### The "No-Line" Rule
To achieve a premium editorial feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a search section using `surface-container-low` should sit directly against a `surface` background, creating a clean, architectural break rather than a "boxed-in" feel.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base Layer**: `surface` (`#f8faf8`).
*   **Secondary Sections**: Use `surface-container-low` to define search areas or filter groups.
*   **Interactive Cards**: Use `surface-container-lowest` (`#ffffff`) to make job cards "pop" against the darker background tiers.

### The "Glass & Gradient" Rule
For floating elements (like a sticky search bar or a bottom navigation), apply a backdrop-blur (12px–20px) using a semi-transparent `surface` color. For main CTAs, use a subtle linear gradient from `primary` to `primary-container` at a 135-degree angle to provide "visual soul" and depth.

---

## 3. Typography
We use a dual-font strategy to balance character with extreme readability.

*   **Display & Headlines (Manrope)**: Chosen for its geometric, modern proportions. Use `display-sm` for page headers to create a bold, editorial entry point.
*   **Body & Labels (Inter)**: The industry standard for clarity. Use `body-md` for job descriptions and `label-sm` for metadata (location, salary).

**Editorial Hierarchy:** Use dramatic scale shifts. A `headline-lg` title should be paired with `label-md` metadata to create a clear visual tension that guides the user’s eye immediately to the most important information.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than traditional structural shadows.

### The Layering Principle
Stack surface tiers to create depth. A `surface-container-highest` element placed on a `surface-container-low` background creates a soft, natural lift. This mimics the appearance of fine paper sheets layered on a desk.

### Ambient Shadows
When a floating effect is required (e.g., a "Quick Apply" button), use extra-diffused shadows:
*   **Blur**: 24px–32px.
*   **Opacity**: 4%–8%.
*   **Color**: Use a tinted version of `on-surface` (`#191c1b`) to ensure the shadow feels like a natural part of the environment, not a grey smudge.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., input focus), use the **Ghost Border**: the `outline-variant` token at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Search Bars
Avoid the thin, outlined boxes seen in legacy apps. The search bar should be a `surface-container-high` pill with a `DEFAULT` (0.5rem) or `full` roundedness. Use a glassmorphism effect (backdrop-blur) when the search bar sticks to the top of the scroll.

### Job Cards
Forbid the use of divider lines.
*   **Container**: `surface-container-lowest` with a `lg` (1rem) corner radius.
*   **Spacing**: Use `spacing-4` for internal padding and `spacing-6` for vertical separation between cards.
*   **Signature Element**: Use a small vertical accent of `primary-container` on the left edge of "Featured" jobs to denote premium status without framing the whole card.

### List Items (Keywords)
Keywords should not be separated by lines. Use vertical white space (`spacing-4`) and `body-lg` typography. On hover or tap, transition the background to `surface-container-low` with a soft `md` corner radius.

### Buttons
*   **Primary**: Gradient-filled (`primary` to `primary-container`) with `on-primary` text. `full` roundedness for a modern, friendly feel.
*   **Secondary**: `surface-container-highest` background with `primary` text. No border.

### Chips (Salary/Location)
Use `secondary-container` with `on-secondary-container` text. These should feel like subtle "tags" rather than heavy buttons.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry**: Place the "Job Title" and "Company Logo" with intentional white space to create a modern layout.
*   **Embrace Negative Space**: Use `spacing-8` or `spacing-10` between major sections to let the design breathe.
*   **Use Tonal Shifts**: Define the header area by changing the background to `surface-variant` instead of drawing a line.

### Don't:
*   **No "Boxy" Grids**: Avoid wrapping every element in a high-contrast border. It creates visual noise and feels "templated."
*   **No Pure Black Shadows**: Never use `#000000` for shadows; always tint with the `on-surface` color.
*   **No Standard Dividers**: Horizontal rules (`<hr>`) are strictly forbidden. Use `spacing-px` with a subtle color shift if a separator is absolutely necessary.
*   **No Crowding**: If a screen feels busy, increase the spacing tokens rather than shrinking the typography.

---

*This design system is a living framework. It prioritizes the "feel" of the interface as much as the function, ensuring every interaction feels intentional and premium.*