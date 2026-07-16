# UI Copy Rules

Microcopy is the small bits of text that guide, inform, and reassure users. Good copy is invisible; bad copy creates friction.

## Button Labels

**Rule:** Verb-first, 1-3 words. Start with the action the user takes.

**Good:**
- Save changes
- Delete account
- Upload file
- Send message
- Continue to payment

**Bad:**
- Submission (noun, not verb)
- Click here (generic)
- Yes / No (without context)
- Submit your information here (too long)

**Guidelines:**
- Use imperative verbs: Save, Delete, Upload, Send, Continue
- Avoid articles: "Save" not "Save the changes"
- Match case to surrounding UI (usually sentence case)
- For destructive actions, include the object: "Delete file" not just "Delete"

---

## Error Messages

**Rule:** What happened + how to fix. Two sentences max.

**Formula:**
1. State the problem clearly
2. Provide a specific solution

**Good:**
- "Email address is invalid. Please include an @ symbol."
- "Password must be at least 8 characters. Try adding a number."
- "Connection lost. Check your internet and try again."

**Bad:**
- "Error 500" (technical, unhelpful)
- "Something went wrong" (vague)
- "Invalid input" (no fix guidance)
- "Please try again later" (no context)

**Guidelines:**
- Never blame the user ("You entered...")
- Use plain language, not technical jargon
- Include actionable next steps
- Keep it concise: 1-2 sentences

---

## Placeholder Text

**Rule:** Example, not instruction. Show what good looks like, don't tell users what to do.

**Good:**
- "you@example.com" (email input)
- "12/25/2024" (date input)
- "Project description..." (textarea)
- "Search by name or email..." (search input)

**Bad:**
- "Enter your email address" (instruction, redundant with label)
- "Type here..." (no helpful example)
- "Required" (states the obvious)
- "Your full name" (duplicates label)

**Guidelines:**
- Use actual example values
- Show format for structured data (dates, phone numbers)
- Avoid repeating the label text
- Placeholder disappears on focus, so it must be self-explanatory

---

## CTAs (Call to Action)

**Rule:** Specific, not generic. Tell users exactly what they get.

**Good:**
- Start free trial
- Download whitepaper
- Book a demo
- Get started
- Create account
- Upgrade to Pro

**Bad:**
- Submit (generic, no value)
- Click here (no context)
- Learn more (vague destination)
- Sign up (missing context: "Sign up for free")
- Get started (missing context: what are they starting?)

**Guidelines:**
- Include the value proposition: "Start free trial" not "Submit"
- Be specific about the outcome: "Download report" not "Continue"
- Avoid ambiguity: "Create account" not "Join us"
- Match CTA intensity to action weight (primary vs secondary)

---

## Ban List

These phrases are forbidden in UI copy:

### Absolutely Banned
- "Lorem ipsum" — placeholder text in production
- "Click here" — generic link text
- "Read more" — lazy, no context
- "Learn more" — vague, no value proposition
- "Submit" — generic, no action clarity
- "John Doe" / "Jane Smith" — fake names
- "Test User" — lazy placeholder data
- "Coming soon" — broken promise
- "Under construction" — unprofessional
- "TBD" — visible planning state
- "Error 404" — technical error without guidance
- "Something went wrong" — unhelpful error
- "Please try again later" — no context or fix

### Contextual Bans
- "Welcome to our website" — generic, no value
- "Thank you for your submission" — assumes success before validation
- "We value your feedback" — insincere, no action
- "Powered by AI" — unless AI is a selling point
- "Best in class" — unsubstantiated claim
- "Seamless" — meaningless buzzword
- "Synergy" — meaningless buzzword
- "Leverage" — pretentious verb
- "Robust" — vague adjective
- "Cutting-edge" — cliché

---

## Tone Guidelines

**Voice:** Confident, clear, helpful. Not overly casual or corporate.

**Person:** Second person ("you") for user actions. First person plural ("we") for company statements. Avoid third person.

**Length:** Short for actions, longer for explanations. Buttons: 1-3 words. Headlines: 2-8 words. Body: 1-3 sentences.

**Jargon:** Avoid unless audience is technical. If jargon is necessary, define it on first use.

**Humor:** Use sparingly. Only in error states, empty states, or onboarding. Never in critical flows or legal text.

---

## Accessibility Copy

**Alt Text:** Describe the image content, not "image of" or "photo of."
- Good: "Bar chart showing 40% increase in sales"
- Bad: "Image" or "Chart"

**ARIA Labels:** Be specific and contextual.
- Good: `aria-label="Close dialog"`
- Bad: `aria-label="Button"`

**Link Text:** Descriptive, not generic.
- Good: "View pricing plans"
- Bad: "Click here"

**Form Labels:** Clear and concise.
- Good: "Email address"
- Bad: "Please enter your email address in the field below"

---

## Validation States

**Success:**
- "Changes saved"
- "Account created"
- "File uploaded"

**Error:**
- "Invalid email address. Example: you@company.com"
- "Password must include a number and special character"
- "Connection failed. Please try again."

**Warning:**
- "You have unsaved changes. Leave without saving?"
- "Your session expires in 5 minutes"

**Info:**
- "New features available. Refresh to see updates."
- "Your trial ends in 3 days"

---

## Empty States

**No Data:**
- "No projects yet. Create your first project to get started."
- "No messages. Start a conversation with your team."

**No Search Results:**
- "No results for 'query'. Try different keywords or clear filters."
- "We couldn't find anything matching your search."

**Error States:**
- "Something went wrong on our end. Refresh the page or contact support if it persists."
- "Unable to load data. Check your connection and try again."

---

## Confirmation Messages

**Destructive Actions:**
- "Are you sure you want to delete this project? This cannot be undone."
- "Deactivate account? You will lose access to all projects."

**Success Actions:**
- "Account created! Check your email to verify."
- "File uploaded successfully."

**Conditional Actions:**
- "You have unsaved changes. Save before leaving?"
- "Discard draft? Your changes will be lost."

---

## Legal & Compliance

**Privacy:**
- "We use cookies to improve your experience. [Accept] [Settings]"
- "By signing up, you agree to our Terms and Privacy Policy."

**Consent:**
- "Send me emails with product updates and offers." (opt-in)
- "I agree to the Terms of Service." (required)

**Age:**
- "You must be 18 or older to create an account."

---

## Measurement

Copy is done when:
- Users complete tasks without reading the full text
- Error messages reduce support tickets
- CTAs have measurable click-through rates
- No placeholder text remains in production
