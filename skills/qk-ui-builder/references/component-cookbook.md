# Component Cookbook: 30 UI Component Archetypes

## Button

**When to use:** Trigger actions, submit forms, navigate, or toggle states. Primary user interaction point.

**Structure:**
```html
<button type="button" class="btn btn--primary">
  <span class="btn__text">Save Changes</span>
</button>
```

**States required:**
- Default
- Hover (color shift, subtle shadow)
- Active (slight scale down or darker shade)
- Focus (visible focus ring)
- Disabled (reduced opacity, `cursor: not-allowed`, `aria-disabled="true"`)
- Loading (spinner inside button, text changes to "Saving...")

**Common mistakes:**
- Using `<div>` or `<a>` instead of `<button>`
- Applying `transition: all` instead of specific properties
- Forgetting `type="button"` in forms (causes unintended submit)
- Making disabled buttons fully transparent (fails contrast)

---

## Input

**When to use:** Collect single-line text, numbers, or short responses from users.

**Structure:**
```html
<div class="form-field">
  <label class="form-field__label" for="email">Email address</label>
  <input
    class="form-field__input"
    type="email"
    id="email"
    name="email"
    placeholder="you@example.com"
    autocomplete="email"
  />
  <p class="form-field__error" id="email-error">Please enter a valid email</p>
</div>
```

**States required:**
- Default
- Focus (border color change, subtle ring)
- Filled (background or border indicates value present)
- Error (red border, error message visible, `aria-invalid="true"`)
- Disabled (grayed out, `disabled` attribute)
- Readonly (visual distinction from disabled, `readonly` attribute)

**Common mistakes:**
- Missing associated `<label>` (accessibility violation)
- Using placeholder as the only label
- Not providing `autocomplete` attributes
- Forgetting `id`/`for` linkage between label and input

---

## Card

**When to use:** Group related content, display summaries, or create visual containers for actions.

**Structure:**
```html
<article class="card">
  <div class="card__header">
    <h3 class="card__title">Project Alpha</h3>
    <span class="card__badge">Active</span>
  </div>
  <p class="card__body">Last updated 2 hours ago</p>
  <div class="card__actions">
    <button class="btn btn--secondary">View Details</button>
  </div>
</article>
```

**States required:**
- Default (subtle shadow, border)
- Hover (elevated shadow, slight lift)
- Selected (border highlight, checkmark)
- Disabled (reduced opacity, no hover)

**Common mistakes:**
- Nesting cards inside cards (card-in-card syndrome)
- Making the entire card clickable without clear affordance
- Using cards for unrelated content
- Ignoring card height consistency when in grids

---

## Modal

**When to use:** Focused tasks requiring user attention, confirmations, or forms that block main workflow.

**Structure:**
```html
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal__backdrop"></div>
  <div class="modal__content">
    <header class="modal__header">
      <h2 id="modal-title">Confirm Action</h2>
      <button class="modal__close" aria-label="Close modal">&times;</button>
    </header>
    <div class="modal__body">
      <p>Are you sure you want to delete this item?</p>
    </div>
    <footer class="modal__footer">
      <button class="btn btn--secondary">Cancel</button>
      <button class="btn btn--danger">Delete</button>
    </footer>
  </div>
</div>
```

**States required:**
- Closed (hidden from DOM or `display: none`)
- Opening (fade/scale animation)
- Open (visible, backdrop active)
- Closing (exit animation)

**Common mistakes:**
- Trapping focus incorrectly or not at all
- Not closing on Escape key
- Not preventing body scroll when open
- Nesting modals inside modals
- Missing `aria-modal` and `role="dialog"`

---

## Dropdown

**When to use:** Select one option from a list, toggle menus, or filter content.

**Structure:**
```html
<div class="dropdown">
  <button
    class="dropdown__trigger"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-labelledby="dropdown-label"
  >
    Select option
    <svg class="dropdown__icon">...</svg>
  </button>
  <ul class="dropdown__menu" role="listbox" aria-labelledby="dropdown-label">
    <li role="option" aria-selected="true">Option 1</li>
    <li role="option" aria-selected="false">Option 2</li>
    <li role="option" aria-selected="false">Option 3</li>
  </ul>
</div>
```

**States required:**
- Collapsed
- Expanded
- Hover (menu items)
- Selected (highlighted option)
- Disabled (grayed out, not clickable)

**Common mistakes:**
- Using native `<select>` for complex dropdowns
- Not managing `aria-expanded` state
- Forgetting keyboard navigation (Arrow keys, Enter, Escape)
- Closing dropdown on trigger click without toggle logic

---

## Tabs

**When to use:** Organize related content into switchable panels within the same viewport.

**Structure:**
```html
<div class="tabs">
  <div class="tabs__list" role="tablist" aria-label="Content sections">
    <button class="tabs__tab" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
      Overview
    </button>
    <button class="tabs__tab" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
      Details
    </button>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1">
    <p>Overview content...</p>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
    <p>Details content...</p>
  </div>
</div>
```

**States required:**
- Active tab (visual highlight, `aria-selected="true"`)
- Inactive tab (muted appearance)
- Hover (subtle background change)
- Disabled tab (reduced opacity, `aria-disabled="true"`)

**Common mistakes:**
- Using `<div>` for tabs instead of buttons with ARIA
- Not linking tabs to panels with `aria-controls`/`aria-labelledby`
- Forgetting `hidden` attribute on inactive panels
- Animating height changes without fixed or measured heights

---

## Table

**When to use:** Display structured data with rows and columns, especially for comparison or detailed lists.

**Structure:**
```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Status</th>
        <th scope="col">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Project Alpha</td>
        <td><span class="badge badge--success">Active</span></td>
        <td>2024-01-15</td>
      </tr>
    </tbody>
  </table>
</div>
```

**States required:**
- Default (zebra striping optional)
- Hover (row highlight)
- Sorted (arrow indicator on header)
- Selected (row highlight, checkbox)
- Loading (skeleton rows)

**Common mistakes:**
- Missing `scope` attributes on `<th>`
- No responsive wrapper for overflow
- Using tables for layout (semantic violation)
- Not providing sort indicators or accessibility labels

---

## Form

**When to use:** Collect multiple inputs for registration, checkout, settings, or data entry.

**Structure:**
```html
<form class="form" novalidate>
  <div class="form__group">
    <label class="form__label" for="name">Full name</label>
    <input class="form__input" type="text" id="name" name="name" required />
    <p class="form__error">Name is required</p>
  </div>
  <div class="form__group">
    <label class="form__label" for="email">Email</label>
    <input class="form__input" type="email" id="email" name="email" required />
  </div>
  <button class="btn btn--primary" type="submit">Submit</button>
</form>
```

**States required:**
- Default
- Focus (per-field)
- Valid (green border or checkmark)
- Invalid (red border, error message)
- Submitting (disable inputs, show spinner)
- Success (confirmation message, clear form)

**Common mistakes:**
- Not using `novalidate` if custom validation is implemented
- Forgetting `name` attributes for data binding
- Not grouping related fields with `<fieldset>`
- Showing all errors at once instead of on blur/submit

---

## Alert

**When to use:** Communicate important information, warnings, errors, or success states.

**Structure:**
```html
<div class="alert alert--success" role="alert" aria-live="polite">
  <svg class="alert__icon" aria-hidden="true">...</svg>
  <div class="alert__content">
    <p class="alert__title">Success</p>
    <p class="alert__message">Your changes have been saved.</p>
  </div>
  <button class="alert__close" aria-label="Dismiss">&times;</button>
</div>
```

**States required:**
- Info (blue)
- Success (green)
- Warning (yellow/orange)
- Error (red)
- Dismissed (removed from DOM or hidden)

**Common mistakes:**
- Using `alert` ARIA role for non-critical notifications
- Not providing a close button when appropriate
- Using color alone to convey meaning (add icon)
- Stacking multiple alerts without clear hierarchy

---

## Badge

**When to use:** Display status, counts, or short labels inline with other content.

**Structure:**
```html
<span class="badge badge--success">Active</span>
<span class="badge badge--count">3</span>
<span class="badge badge--warning">Pending</span>
```

**States required:**
- Default (solid background)
- Subtle (outline or light background)
- Dot (small indicator without text)

**Common mistakes:**
- Using badges for long text
- Not providing sufficient contrast for small text
- Using too many badge colors (limit to 3-4 semantic colors)

---

## Avatar

**When to use:** Represent users, authors, or entities in lists, comments, and profiles.

**Structure:**
```html
<img class="avatar" src="user.jpg" alt="Jane Doe" width="40" height="40" />
<span class="avatar avatar--fallback" aria-label="Jane Doe">JD</span>
```

**States required:**
- Image loaded
- Fallback (initials or icon)
- Online indicator (green dot)
- Offline indicator (gray dot)
- Status indicator (busy, away)

**Common mistakes:**
- Missing `alt` text or using `alt=""` when content is meaningful
- Not providing fallback for broken images
- Using gradient placeholders with initials (AI tell)
- Making clickable avatars without clear affordance

---

## Breadcrumb

**When to use:** Show navigation hierarchy for pages with parent/child relationships.

**Structure:**
```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a class="breadcrumb__link" href="/">Home</a>
    </li>
    <li class="breadcrumb__item" aria-current="page">
      <span class="breadcrumb__current">Products</span>
    </li>
  </ol>
</nav>
```

**States required:**
- Default (linked items)
- Current page (non-linked, `aria-current="page"`)
- Hover (link underline or color change)

**Common mistakes:**
- Using `>` or `/` as separators without aria-hidden
- Not marking current page with `aria-current`
- Using breadcrumbs for flat site structures
- Forgetting the `<nav>` wrapper with `aria-label`

---

## Pagination

**When to use:** Split large datasets or search results into discrete pages.

**Structure:**
```html
<nav class="pagination" aria-label="Pagination">
  <button class="pagination__btn" aria-label="Previous page">&larr;</button>
  <ol class="pagination__list">
    <li><a class="pagination__link" href="?page=1">1</a></li>
    <li><span class="pagination__current" aria-current="page">2</span></li>
    <li><a class="pagination__link" href="?page=3">3</a></li>
  </ol>
  <button class="pagination__btn" aria-label="Next page">&rarr;</button>
</nav>
```

**States required:**
- Current page (highlighted, `aria-current="page"`)
- Available page (linked)
- Disabled prev/next (grayed out, `disabled`)

**Common mistakes:**
- Not disabling prev/next at boundaries
- Showing all pages instead of ellipsis for large sets
- Missing `aria-label` on prev/next buttons
- Not providing skip links for screen readers

---

## Sidebar

**When to use:** Secondary navigation, filters, or contextual information alongside main content.

**Structure:**
```html
<aside class="sidebar" aria-label="Sidebar">
  <nav class="sidebar__nav">
    <a class="sidebar__link" href="#dashboard">Dashboard</a>
    <a class="sidebar__link sidebar__link--active" href="#settings">Settings</a>
  </nav>
</aside>
```

**States required:**
- Default
- Active (highlighted link)
- Collapsed (icons only)
- Mobile overlay (off-canvas)

**Common mistakes:**
- Not collapsing on mobile
- Using `<div>` for navigation instead of `<nav>`
- Not indicating active page/section
- Forgetting to trap focus in mobile drawer

---

## Navbar

**When to use:** Primary site navigation, brand identity, and user actions at the top of every page.

**Structure:**
```html
<header class="navbar">
  <a class="navbar__brand" href="/">Brand</a>
  <button class="navbar__toggle" aria-label="Toggle menu" aria-expanded="false">
    <span class="navbar__toggle-icon"></span>
  </button>
  <nav class="navbar__nav" aria-label="Main">
    <a class="navbar__link" href="#features">Features</a>
    <a class="navbar__link" href="#pricing">Pricing</a>
    <a class="navbar__link navbar__link--cta" href="#signup">Sign Up</a>
  </nav>
</header>
```

**States required:**
- Default
- Scrolled (background change, shadow)
- Mobile open (hamburger menu expanded)
- Active link (underline or color)

**Common mistakes:**
- Logo not linking to homepage
- Mobile menu without proper ARIA states
- Too many nav items (5-7 max)
- Not hiding scrollbar in mobile menu

---

## Footer

**When to use:** Site-wide links, legal information, social links, and secondary navigation.

**Structure:**
```html
<footer class="footer">
  <div class="footer__brand">
    <a class="footer__logo" href="/">Brand</a>
    <p class="footer__tagline">Building better software.</p>
  </div>
  <nav class="footer__nav" aria-label="Footer">
    <div class="footer__section">
      <h3 class="footer__heading">Product</h3>
      <a class="footer__link" href="#features">Features</a>
      <a class="footer__link" href="#pricing">Pricing</a>
    </div>
  </nav>
  <div class="footer__bottom">
    <p>&copy; 2024 Brand. All rights reserved.</p>
  </div>
</footer>
```

**States required:**
- Default
- Link hover (underline or color shift)

**Common mistakes:**
- Four-column generic structure (AI tell)
- Newsletter signup without clear value proposition
- Missing legal links (privacy, terms)
- Social icons without accessible labels

---

## Hero

**When to use:** Primary value proposition and call-to-action on landing or product pages.

**Structure:**
```html
<section class="hero">
  <div class="hero__content">
    <h1 class="hero__title">Build faster with our platform</h1>
    <p class="hero__subtitle">
      The complete toolkit for modern development teams.
    </p>
    <div class="hero__actions">
      <a class="btn btn--primary btn--lg" href="#signup">Start free trial</a>
      <a class="btn btn--secondary btn--lg" href="#demo">Watch demo</a>
    </div>
  </div>
  <div class="hero__media">
    <img class="hero__image" src="dashboard.png" alt="Dashboard preview" />
  </div>
</section>
```

**States required:**
- Default
- Animated entrance (fade up, staggered)

**Common mistakes:**
- Carousel instead of static hero (low engagement)
- Too many CTAs (decision paralysis)
- Generic headlines ("Welcome to our website")
- Missing clear value proposition

---

## FeatureGrid

**When to use:** Display product features, services, or benefits in a scannable layout.

**Structure:**
```html
<section class="feature-grid">
  <h2 class="feature-grid__title">Everything you need</h2>
  <div class="feature-grid__items">
    <div class="feature-card">
      <div class="feature-card__icon">
        <svg>...</svg>
      </div>
      <h3 class="feature-card__title">Analytics</h3>
      <p class="feature-card__desc">Track performance with real-time dashboards.</p>
    </div>
  </div>
</section>
```

**States required:**
- Default
- Hover (card lift, icon color change)
- Icon hover (subtle scale or glow)

**Common mistakes:**
- Exactly three cards every time (AI tell)
- Icon-heavy without text explanation
- Equal height cards with excessive whitespace
- Generic descriptions ("Powerful analytics")

---

## PricingTable

**When to use:** Display pricing plans, feature comparisons, or subscription options.

**Structure:**
```html
<section class="pricing-table">
  <div class="pricing-card">
    <h3 class="pricing-card__name">Starter</h3>
    <p class="pricing-card__price">$9<span>/mo</span></p>
    <ul class="pricing-card__features">
      <li>5 projects</li>
      <li>10GB storage</li>
      <li>Email support</li>
    </ul>
    <a class="btn btn--secondary" href="#signup">Get started</a>
  </div>
</section>
```

**States required:**
- Default
- Hover (card lift)
- Popular/Recommended (border highlight, badge)
- Selected (checkmark or border)

**Common mistakes:**
- Three-column cookie-cutter layout regardless of actual plans
- "Most Popular" badge on middle tier by default
- Hiding pricing behind "Contact us" without explanation
- Feature lists with checkmarks for non-inclusive features

---

## Testimonial

**When to use:** Social proof from customers, users, or stakeholders.

**Structure:**
```html
<blockquote class="testimonial">
  <p class="testimonial__quote">
    "This product transformed our workflow. We shipped 2x faster."
  </p>
  <footer class="testimonial__author">
    <img class="testimonial__avatar" src="avatar.jpg" alt="Jane Doe" />
    <div>
      <cite class="testimonial__name">Jane Doe</cite>
      <p class="testimonial__role">CTO, Acme Inc.</p>
    </div>
  </footer>
</blockquote>
```

**States required:**
- Default
- Hover (subtle card lift)

**Common mistakes:**
- Using "John Doe" or generic names
- Missing attribution (name, role, company)
- Using gradient avatars with initials
- Carousel instead of static grid (low engagement)

---

## FAQ

**When to use:** Address common questions, reduce support burden, and improve SEO.

**Structure:**
```html
<details class="faq-item">
  <summary class="faq-item__question">How do I reset my password?</summary>
  <div class="faq-item__answer">
    <p>Go to Settings > Security and click "Reset Password."</p>
  </div>
</details>
```

**States required:**
- Closed (default)
- Open (expanded)
- Hover (summary highlight)

**Common mistakes:**
- Building custom accordions instead of using native `<details>`
- Missing `open` attribute management for animations
- Long answers without clear structure
- Duplicate questions across the page

---

## Stats

**When to use:** Display key metrics, social proof numbers, or performance indicators.

**Structure:**
```html
<div class="stats">
  <div class="stat">
    <p class="stat__value">99.9%</p>
    <p class="stat__label">Uptime</p>
  </div>
  <div class="stat">
    <p class="stat__value">10M+</p>
    <p class="stat__label">Users</p>
  </div>
</div>
```

**States required:**
- Default
- Animated count-up (optional)

**Common mistakes:**
- Invented metrics without source data
- Using too many stats (3-5 max)
- Small text with low contrast
- Animating numbers that don't add value

---

## Timeline

**When to use:** Display chronological events, project milestones, or history.

**Structure:**
```html
<ul class="timeline">
  <li class="timeline__item">
    <div class="timeline__marker"></div>
    <div class="timeline__content">
      <h3 class="timeline__title">Project Launch</h3>
      <time class="timeline__date" datetime="2024-01-15">Jan 15, 2024</time>
      <p>Successfully launched to 10,000 users.</p>
    </div>
  </li>
</ul>
```

**States required:**
- Default
- Active (current milestone)
- Hover (card highlight)

**Common mistakes:**
- Vertical line broken by card backgrounds
- Using cards for every item (too heavy)
- Missing time elements for SEO
- Reverse chronological order without clear label

---

## Stepper

**When to use:** Guide users through multi-step processes like checkout, onboarding, or forms.

**Structure:**
```html
<ol class="stepper">
  <li class="stepper__step stepper__step--completed">
    <span class="stepper__marker">1</span>
    <span class="stepper__label">Account</span>
  </li>
  <li class="stepper__step stepper__step--active">
    <span class="stepper__marker">2</span>
    <span class="stepper__label">Details</span>
  </li>
  <li class="stepper__step">
    <span class="stepper__marker">3</span>
    <span class="stepper__label">Confirm</span>
  </li>
</ol>
```

**States required:**
- Completed (checkmark, muted)
- Active (highlighted, connected line)
- Pending (muted, no connection)
- Disabled (grayed out)

**Common mistakes:**
- Using icons without text labels
- Not indicating progress visually
- Allowing users to skip steps
- Not persisting step state across navigation

---

## FileUpload

**When to use:** Allow users to upload documents, images, or other files.

**Structure:**
```html
<div class="file-upload">
  <input type="file" id="file" class="file-upload__input" />
  <label class="file-upload__dropzone" for="file">
    <svg>...</svg>
    <p>Drag files here or <span class="file-upload__link">browse</span></p>
  </label>
  <ul class="file-upload__list">
    <li class="file-upload__item">
      <span>document.pdf</span>
      <button class="file-upload__remove" aria-label="Remove document.pdf">&times;</button>
    </li>
  </ul>
</div>
```

**States required:**
- Default (dropzone)
- Drag over (highlighted border)
- Uploading (progress bar)
- Success (file listed)
- Error (message, retry option)

**Common mistakes:**
- Using `<div>` instead of `<input type="file">`
- Not supporting drag and drop
- Not showing file names after selection
- Missing file size/type validation feedback

---

## DatePicker

**When to use:** Select dates for appointments, bookings, filters, or scheduling.

**Structure:**
```html
<div class="date-picker">
  <label class="date-picker__label" for="date">Select date</label>
  <div class="date-picker__input-group">
    <input
      class="date-picker__input"
      type="text"
      id="date"
      placeholder="MM/DD/YYYY"
      readonly
    />
    <button class="date-picker__toggle" aria-label="Open calendar">
      <svg>...</svg>
    </button>
  </div>
  <div class="date-picker__calendar" role="dialog" aria-label="Calendar">
    <div class="date-picker__header">
      <button aria-label="Previous month">&larr;</button>
      <span>January 2024</span>
      <button aria-label="Next month">&rarr;</button>
    </div>
    <div class="date-picker__grid" role="grid">
      <button role="gridcell">1</button>
      <button role="gridcell" aria-selected="true">2</button>
    </div>
  </div>
</div>
```

**States required:**
- Default (input with icon)
- Open (calendar visible)
- Hover (date cells)
- Selected (highlighted date)
- Disabled (past dates, grayed out)

**Common mistakes:**
- Not supporting keyboard navigation
- Missing month/year navigation ARIA
- Using native `<input type="date">` without custom styling fallback
- Not validating date ranges

---

## ColorPicker

**When to use:** Select colors for themes, branding, design tools, or customization.

**Structure:**
```html
<div class="color-picker">
  <label class="color-picker__label" for="color">Choose color</label>
  <div class="color-picker__swatches">
    <button class="color-picker__swatch" style="background: #6366f1" aria-label="Indigo"></button>
    <button class="color-picker__swatch" style="background: #8b5cf6" aria-label="Violet"></button>
  </div>
  <input class="color-picker__input" type="color" id="color" value="#6366f1" />
</div>
```

**States required:**
- Default (swatches + input)
- Hover (swatch ring)
- Selected (checkmark or border)
- Focus (input ring)

**Common mistakes:**
- Using `<input type="color">` without custom swatches
- Not providing hex/RGB text input
- Poor color contrast for selected state
- Not supporting keyboard navigation between swatches

---

## Tooltip

**When to use:** Provide brief, contextual information on hover or focus.

**Structure:**
```html
<div class="tooltip" data-tooltip="Save your changes">
  <button class="tooltip__trigger">Save</button>
  <div class="tooltip__content" role="tooltip" aria-hidden="true">
    Save your changes
  </div>
</div>
```

**States required:**
- Hidden (default)
- Visible (on hover/focus)
- Hover (tooltip stays visible)

**Common mistakes:**
- Using tooltips for critical information (use Alert instead)
- Not managing `aria-describedby` linkage
- Tooltips covering the triggering element
- Long tooltip text without line breaks

---

## Popover

**When to use:** Display contextual menus, forms, or detailed content anchored to a trigger element.

**Structure:**
```html
<div class="popover">
  <button class="popover__trigger" aria-expanded="false">Options</button>
  <div class="popover__content" role="dialog" aria-label="Options menu">
    <button class="popover__item">Edit</button>
    <button class="popover__item">Delete</button>
  </div>
</div>
```

**States required:**
- Closed
- Open
- Focus trap (when open)
- Hover (items)

**Common mistakes:**
- Not managing focus trap
- Closing on outside click without proper event handling
- Using popover for navigation (use Dropdown instead)
- Missing `aria-expanded` on trigger

---

## Skeleton

**When to use:** Show placeholder structure while content loads.

**Structure:**
```html
<div class="skeleton">
  <div class="skeleton__avatar"></div>
  <div class="skeleton__content">
    <div class="skeleton__title"></div>
    <div class="skeleton__text"></div>
  </div>
</div>
```

**States required:**
- Loading (shimmer animation)
- Loaded (content replaces skeleton)

**Common mistakes:**
- Using spinner instead of skeleton for content areas
- Incorrect skeleton dimensions (doesn't match actual content)
- Not removing skeleton from DOM after load
- Animating skeleton too fast (distracting)

---

## FileUpload (Alternative: DropZone)

**When to use:** Drag-and-drop file uploads with visual feedback.

**Structure:**
```html
<div class="dropzone" role="button" tabindex="0" aria-label="Upload files">
  <svg class="dropzone__icon">...</svg>
  <p class="dropzone__text">Drop files here or click to browse</p>
  <p class="dropzone__hint">PNG, JPG up to 5MB</p>
</div>
```

**States required:**
- Default
- Drag over (border highlight, background change)
- Disabled (grayed out, no interaction)
- Uploading (progress indicator)

**Common mistakes:**
- Not supporting keyboard activation (Enter/Space)
- Missing file type and size validation
- No visual feedback during drag
- Uploading multiple files without queue indication

---

## DatePicker (Alternative: DateRange)

**When to use:** Select start and end dates for bookings, reports, or filters.

**Structure:**
```html
<div class="date-range">
  <div class="date-range__field">
    <label for="start-date">Start</label>
    <input type="date" id="start-date" />
  </div>
  <span class="date-range__separator">to</span>
  <div class="date-range__field">
    <label for="end-date">End</label>
    <input type="date" id="end-date" />
  </div>
</div>
```

**States required:**
- Default
- Invalid range (end date before start date)
- Disabled dates (past dates, weekends)

**Common mistakes:**
- Not validating start < end relationship
- Using two separate inputs without clear relationship
- Not providing preset ranges (Last 7 days, This month)
- Poor mobile date input experience

---

## ColorPicker (Alternative: ThemePicker)

**When to use:** Select from predefined theme colors or create custom themes.

**Structure:**
```html
<div class="theme-picker">
  <p class="theme-picker__label">Choose theme</p>
  <div class="theme-picker__options">
    <button class="theme-picker__option theme-picker__option--active" data-theme="light">
      <span class="theme-picker__preview"></span>
      Light
    </button>
    <button class="theme-picker__option" data-theme="dark">
      <span class="theme-picker__preview"></span>
      Dark
    </button>
  </div>
</div>
```

**States required:**
- Default
- Selected (border, checkmark)
- Hover (subtle ring)

**Common mistakes:**
- Not applying theme immediately on selection
- Using radio buttons without proper ARIA
- Missing preview of theme colors
- Not persisting theme choice

---

## Tooltip (Alternative: InfoPopover)

**When to use:** Display rich content or forms anchored to a trigger, dismissible by user.

**Structure:**
```html
<div class="info-popover">
  <button class="info-popover__trigger" aria-expanded="false">?</button>
  <div class="info-popover__content">
    <h4>Need help?</h4>
    <p>Contact support for assistance.</p>
    <a href="#contact">Contact us</a>
  </div>
</div>
```

**States required:**
- Closed
- Open
- Focus trap (when open)

**Common mistakes:**
- Triggering on hover only (no keyboard support)
- Not dismissing on Escape
- Popover positioning causing viewport overflow
- Missing close button

---

## Skeleton (Alternative: ContentSkeleton)

**When to use:** Complex content placeholders for cards, lists, or article pages.

**Structure:**
```html
<article class="skeleton-card">
  <div class="skeleton-card__media"></div>
  <div class="skeleton-card__body">
    <div class="skeleton skeleton--title"></div>
    <div class="skeleton skeleton--text"></div>
    <div class="skeleton skeleton--text skeleton--short"></div>
  </div>
</article>
```

**States required:**
- Loading (animated shimmer)
- Loaded (content visible)

**Common mistakes:**
- Skeleton dimensions not matching actual content
- Too many skeleton elements (overkill)
- Shimmer animation too fast or slow
- Not transitioning smoothly to loaded state

---

## Additional Archetypes

### Toast
**When to use:** Temporary notifications that auto-dismiss.
**Structure:** Fixed positioned bar with icon, message, and close button.
**States:** Success, error, warning, info, dismissing.
**Mistakes:** Stacking too many, not auto-dismissing, missing close button.

### Toggle
**When to use:** Binary on/off states for settings.
**Structure:** Checkbox input with sliding thumb visual.
**States:** On, off, disabled, loading.
**Mistakes:** Using checkbox without visual toggle, confusing on/off labels, missing focus state.

### Slider
**When to use:** Select values within a range.
**Structure:** Track with draggable thumb, optional min/max labels.
**States:** Default, dragging, min, max, disabled.
**Mistakes:** No keyboard support, missing value display, breakpoints not aligned to values.

### Accordion
**When to use:** Expandable sections for FAQs or grouped content.
**Structure:** `<details>` or div with header and collapsible panel.
**States:** Closed, open, hover, disabled.
**Mistakes:** Multiple panels open at once (confusing), no animation, missing ARIA.

### Search
**When to use:** Filter or find content within a page or dataset.
**Structure:** Input with search icon, optional clear button, results dropdown.
**States:** Default, typing, results shown, empty state, loading.
**Mistakes:** No debounce, no empty state, missing search icon, results not keyboard navigable.

### Select
**When to use:** Single or multiple selection from predefined options.
**Structure:** Native `<select>` or custom dropdown with checkboxes.
**States:** Default, open, selected, disabled.
**Mistakes:** Custom select without keyboard support, missing label, options too long.

### ProgressBar
**When to use:** Indicate completion status for uploads, forms, or tasks.
**Structure:** Track with filled portion, percentage label.
**States:** Indeterminate, determinate, complete, error.
**Mistakes:** No percentage label, wrong color for complete state, not accessible to screen readers.

### Spinner
**When to use:** Indicate loading for async operations.
**Structure:** Animated circle or dots, optional label.
**States:** Spinning, complete, error.
**Mistakes:** No accessible label, animating too fast, using for short operations.

### Toolbar
**When to use:** Group related actions for content editing or viewing.
**Structure:** Row of icon buttons with separators, optional overflow menu.
**States:** Default, hover, active, disabled, overflow.
**Mistakes:** Too many buttons without overflow, no tooltips on icons, missing keyboard navigation.

### EmptyState
**When to use:** Communicate no data scenarios with guidance.
**Structure:** Illustration/icon, headline, description, CTA.
**States:** Default.
**Mistakes:** Generic copy ("No data"), no CTA, poor illustration choice, not actionable.
