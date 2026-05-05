/**
 * Pitch-Prompt Templates + Builder.
 *
 * Zwei sehr grosse, vom Nutzer gelieferte Prompts werden hier als
 * Konstanten gepflegt und ueber `{{placeholder}}`-Tokens mit dem
 * BusinessProfile-Objekt gefuellt. Arrays werden als Bullet-Listen
 * gerendert, leere Felder als „—" damit der finale Prompt lesbar
 * bleibt ohne zu luegen.
 *
 * Auto-Mode-Vorschlag:
 *   - `profile.has_website` true  → redesign
 *   - sonst                        → new
 *   Nutzer kann das im Modal per Toggle ueberschreiben.
 */

import type { BusinessProfile } from "./types";

export type PitchPromptMode = "new" | "redesign";

export interface PitchPromptModeOption {
  value: PitchPromptMode;
  label: string;
  hint: string;
}

export const PITCH_PROMPT_MODES: readonly PitchPromptModeOption[] = [
  {
    value: "new",
    label: "Website erstellen",
    hint: "Erste Website-Konzepte für ein Unternehmen ohne eigene Website.",
  },
  {
    value: "redesign",
    label: "Website Redesign",
    hint: "Redesign-Konzepte für ein Unternehmen mit bestehender Website.",
  },
];

export function suggestPitchPromptMode(profile: BusinessProfile): PitchPromptMode {
  return profile.has_website ? "redesign" : "new";
}

/** Website Creation Template — 1:1 aus der Nutzer-Vorlage, Platzhalter
 * in `{{snake_case}}`. Aenderungen am Wortlaut hier bitte nur nach
 * Ruecksprache, sonst drehen sich Outreach-Mails anders. */
export const CREATION_TEMPLATE = `https://github.com/Leonxlnx/taste-skill

Based on the skill above, generate images for a first website concept for an already running business that currently has no website.

This is not a generic website concept.
This should feel like a highly intentional, premium, art-directed first-website proposal specifically made for this exact business.

The goal is to create a visual website concept that can be used in a personalized outreach email.
The business owner should immediately understand:
"This was made specifically for our company, our industry, our customers, and our online potential."

This business currently has no website.
Because of that, use the available business data, Google Business Profile data, business category, location, public reviews, public photos, industry context, competitor references, and inferred business needs to create a premium first-website concept.

The concept should feel like a complete digital foundation:
- professional first impression
- trust-building
- service explanation
- local SEO positioning
- contact conversion
- clear customer journey
- modern visual identity
- strong business credibility

Business dataset:

Business name:
{{business_name}}

Business branch:
{{business_branch}}

Sub-branch / specialization:
{{sub_branch}}

Website:
{{website_url}}

Has website:
{{has_website}}

Google Business Profile:
{{google_business_profile_url}}

Google Business category:
{{google_business_category}}

Location:
{{city}} / {{region}} / {{country}}

Address:
{{address}}

Phone:
{{phone}}

Email:
{{email}}

Opening hours:
{{opening_hours}}

Primary CTA:
{{primary_cta}}

Secondary CTAs:
{{secondary_ctas}}

Public social proof:
{{google_rating}}
{{google_review_count}}
Source: {{review_source}}
Verification status: {{review_verification_status}}

Review highlights:
{{review_highlights}}

Business photos available:
{{business_photos_available}}

Main services:
{{main_services}}

Secondary services:
{{secondary_services}}

Inferred services:
{{inferred_services}}

Target customers:
{{target_customers}}

Unique selling points:
{{unique_selling_points}}

No-website opportunity:
{{no_website_opportunity}}

Design opportunities:
{{design_opportunities}}

Competitor reference websites:
{{competitor_reference_websites}}

Recommended positioning:
{{recommended_positioning}}

Recommended website goal:
{{recommended_website_goal}}

Desired style:
{{desired_style}}

Preferred theme:
{{preferred_theme}}

Brand colors:
{{brand_colors}}

Visual mood:
{{visual_mood}}

Image style:
{{image_style}}

Tone of voice:
{{tone_of_voice}}

Section focus:
{{section_focus}}

Special notes:
{{special_notes}}

Important business-context rules:
- Make the concept feel custom-made for {{business_name}}, not like a generic {{business_branch}} template.
- This is a first website concept, not a redesign.
- Do not mention "redesign" in the visible website copy.
- Do not imply that the business had a bad website before.
- Use the lack of a website as strategic context, not as criticism.
- Use the actual business branch, location, Google Business category, reviews, public photos, likely services, target customers, and local market context to shape the design.
- Do not invent hard factual claims that are not present in the dataset.
- Treat inferred services as design assumptions, not verified facts.
- If review data is not verified, use it only subtly or omit exact numbers from the visual copy.
- Do not show internal notes such as "not verified", "inferred", or "source unavailable" in the design.
- If business photos are available, make the visual concept feel inspired by the real business atmosphere.
- If business photos are not available, create a tasteful industry-appropriate visual direction based on the branch, location, competitors, and desired style.
- Competitor references should influence quality level and industry expectations, but the design must not copy competitors.
- Make the result feel like a premium first-website proposal from a high-end creative AI studio.
- The design should be visually impressive, but still believable as a real website.
- The copy and interface language should match the business country and audience. For German businesses, use German copy.

Creative direction:
The website is designed by a creative AI company focused on research in creativity, design, and conversion-oriented web experiences.
Because of that, the visuals should feel highly original, playful, art-directed, and strategically designed.

Make it feel like an Awwwards SOTD-level website in both concept and execution:
- premium typography
- strong visual hierarchy
- bold but purposeful layouts
- thoughtful text integration
- strong spacing system
- modern interaction feeling
- subtle motion cues
- scroll-storytelling atmosphere
- elegant UI components
- custom section structures
- high-end image treatment
- conversion-focused composition

Please go beyond standard layouts.
Do not rely only on simple text-left, image-right compositions.
Explore more experimental and varied layouts.
Feel free to go visually bold, but keep it purposeful, not random.

Use different section structures:
- fullscreen hero compositions
- strong background image sections
- editorial collage layouts
- image-led proof / impression sections
- diagram-inspired information sections
- process / journey sections
- premium service card systems
- local SEO / location sections
- contact / inquiry sections
- minimal but highly refined whitespace sections

Please use full background images, strong full-background color compositions, or rich visual surfaces.
Do not create plain, boring white template sections.
Keep the preferred theme as:
{{preferred_theme}}

Overall:
Stay visually consistent across the full set while making each section distinct.
The final result should look highly creative, thoughtful, premium, conversion-oriented, and visually impressive, with strong UX and a clear business purpose.

The generated website sections should feel custom-made for:
{{business_name}}

Use these key business strengths especially:
{{unique_selling_points}}

Use these review insights especially:
{{review_highlights}}

Use these services especially:
{{main_services}}

Use these inferred services carefully if needed:
{{inferred_services}}

Use these audiences especially:
{{target_customers}}

Use this positioning especially:
{{recommended_positioning}}

Use this website goal especially:
{{recommended_website_goal}}

Use this CTA especially:
{{primary_cta}}

Generate 8 different images total.
Do not combine them into one image.
Each image should represent one separate website section.
Do not create one long full-page website.
Create 8 distinct section visuals.

The 8 sections should roughly follow this structure:

1. Hero Section
Create a stunning opening section for {{business_name}}.
It should immediately communicate the business branch, location, positioning, and main value proposition.
Use strong typography, a memorable visual composition, and the primary CTA:
{{primary_cta}}

The hero should feel iconic, premium, trustworthy, and specifically designed for this business.
It should not look like a generic industry landing page.

2. Trust / Local Identity Section
Show who {{business_name}} is and why local customers should trust the business.
Use location, branch, Google Business category, review highlights, public reputation, and unique selling points.
This section should feel personal, local, premium, and credibility-building.

Relevant points:
{{unique_selling_points}}
{{review_highlights}}
{{city}} / {{region}}

3. Services / What We Offer Section
Present the main services or likely services of the business.
Use a clear but creative structure.
Avoid a boring generic card grid.
Make the services easy to understand, but visually impressive.

Main services:
{{main_services}}

Secondary services:
{{secondary_services}}

Inferred services:
{{inferred_services}}

If services are inferred, avoid overly specific claims and use broader service language.

4. Benefits / Why Choose Us Section
Highlight the strongest reasons to choose the business.
Use public social proof, customer review themes, location advantages, specialization, service quality, experience signals, or operational strengths where available.

Possible trust elements:
{{google_rating}}
{{google_review_count}}
{{review_highlights}}
{{unique_selling_points}}

If exact numbers are missing or unverified, use more general trust-building visual language instead.

5. Process / Customer Journey Section
Show how customers work with the business.
Create a process, journey, timeline, or step-by-step section.
Make the experience feel simple, professional, reassuring, and easy to start.

Use the business context and services to infer a suitable customer journey.
Do not invent legally sensitive, medical, financial, or unrealistic claims.
Use safe generic process language when the exact process is unknown.

6. Signature Service / Commercial Focus Section
Create a section for the strongest service, offer, or emotional selling point of the business.
This should be the section that makes the business feel especially desirable and commercially relevant.

Use these priorities:
{{section_focus}}

If no section focus is provided, select the most commercially valuable service from:
{{main_services}}

If the service is inferred, keep the copy broad and safe.

7. Gallery / Atmosphere / Proof Section
Create a highly visual section that shows the atmosphere, work, results, products, venue, team, process, or customer experience.
This section should feel immersive, premium, and emotionally convincing.
It should not look like a generic stock image grid.

If public business photos are available, make the section feel inspired by the real business.
If not, create a high-quality industry-appropriate visual system.

Use the following visual mood:
{{visual_mood}}

8. Contact / Inquiry Section
Create a conversion-focused final section.
Include the business name, location, contact details, opening hours if useful, and the primary CTA.

Include:
{{business_name}}
{{address}}
{{phone}}
{{email}}
{{opening_hours}}
{{city}} / {{region}}
CTA: {{primary_cta}}

This section should feel elegant, trustworthy, simple, and frictionless, while still highly designed.

Additional design requirements:
- integrate typography beautifully into the visual composition
- use layered compositions, elegant UI cards, subtle motion cues, and premium image crops
- some sections can be minimal and restrained, others can be expressive and immersive
- maintain a strong sense of pacing across the 8 images
- avoid generic templates
- avoid cheap corporate stock aesthetics
- avoid random decorative visuals without purpose
- avoid boring repetition between sections
- make every section feel useful for selling the business
- make the design feel like a serious premium first-website proposal, not just decorative concept art

Important output rule:
Generate exactly 8 different images.
Each image must be a separate website section.
Do not merge multiple sections into one image.
Do not create one long full-page website.
Create 8 distinct section visuals.
`;

/** Website Redesign Template — 1:1 aus der Nutzer-Vorlage. */
export const REDESIGN_TEMPLATE = `https://github.com/Leonxlnx/taste-skill

Based on the skill above, generate images for a website redesign concept for an already running business with an existing website.

Use the existing website, business data, public business profile, reviews, services, target customers, current presentation weaknesses, and design opportunities as the main information source and creative reference.

This is not a generic website concept.
This should feel like a highly intentional, premium, art-directed redesign proposal specifically made for this exact business.

The goal is to create a visual website redesign concept that can be used in a personalized outreach email.
The business owner should immediately understand:
"This was made specifically for our company, our industry, our customers, our current website, and our online potential."

This business already has a website.
Because of that, use the current website as a reference for:
- business identity
- existing content
- services
- visual assets
- tone
- strengths
- weaknesses
- missed conversion opportunities
- outdated UX or design patterns
- opportunities for a premium redesign

The concept should feel like a modernized, elevated version of the business:
- better first impression
- stronger trust-building
- clearer service explanation
- improved local positioning
- stronger conversion design
- better visual hierarchy
- better mobile and UX thinking
- more premium visual identity
- more emotional and persuasive presentation

Business dataset:

Business name:
{{business_name}}

Business branch:
{{business_branch}}

Sub-branch / specialization:
{{sub_branch}}

Website:
{{website_url}}

Has website:
{{has_website}}

Google Business Profile:
{{google_business_profile_url}}

Google Business category:
{{google_business_category}}

Location:
{{city}} / {{region}} / {{country}}

Address:
{{address}}

Phone:
{{phone}}

Email:
{{email}}

Opening hours:
{{opening_hours}}

Primary CTA:
{{primary_cta}}

Secondary CTAs:
{{secondary_ctas}}

Public social proof:
{{google_rating}}
{{google_review_count}}
Source: {{review_source}}
Verification status: {{review_verification_status}}

Review highlights:
{{review_highlights}}

Business photos available:
{{business_photos_available}}

Main services:
{{main_services}}

Secondary services:
{{secondary_services}}

Inferred services:
{{inferred_services}}

Target customers:
{{target_customers}}

Unique selling points:
{{unique_selling_points}}

Current website weaknesses / business presentation problems:
{{current_website_problems}}

Design opportunities:
{{design_opportunities}}

Competitor reference websites:
{{competitor_reference_websites}}

Recommended positioning:
{{recommended_positioning}}

Recommended website goal:
{{recommended_website_goal}}

Desired style:
{{desired_style}}

Preferred theme:
{{preferred_theme}}

Brand colors:
{{brand_colors}}

Visual mood:
{{visual_mood}}

Image style:
{{image_style}}

Tone of voice:
{{tone_of_voice}}

Section focus:
{{section_focus}}

Special notes:
{{special_notes}}

Important business-context rules:
- Make the concept feel custom-made for {{business_name}}, not like a generic {{business_branch}} template.
- This is a redesign concept for an existing website.
- Use the current website as business reference, but elevate it significantly.
- Preserve useful business identity signals where appropriate, but do not copy outdated design patterns.
- Use current website weaknesses only as redesign direction.
- Do not visually insult or criticize the current website.
- Do not show negative audit language in the design.
- Do not invent factual claims that are not present in the dataset.
- Treat inferred services as design assumptions, not verified facts.
- If review data is not verified, use it only subtly or omit exact numbers from the visual copy.
- Do not show internal notes such as "not verified", "inferred", or "source unavailable" in the design.
- Use the actual business branch, location, services, target customers, strengths, review themes, and website weaknesses to shape the redesign.
- Competitor references should influence quality level and industry expectations, but the design must not copy competitors.
- Make the result feel like a premium redesign proposal from a high-end creative AI studio.
- The design should be visually impressive, but still believable as a real website.
- The copy and interface language should match the business country and audience. For German businesses, use German copy.

Creative direction:
The website is redesigned by a creative AI company focused on research in creativity, design, and conversion-oriented web experiences.
Because of that, the visuals should feel highly original, playful, art-directed, and strategically designed.

Make it feel like an Awwwards SOTD-level website in both concept and execution:
- premium typography
- strong visual hierarchy
- bold but purposeful layouts
- thoughtful text integration
- strong spacing system
- modern interaction feeling
- subtle motion cues
- scroll-storytelling atmosphere
- elegant UI components
- custom section structures
- high-end image treatment
- conversion-focused composition

Please go beyond standard layouts.
Do not rely only on simple text-left, image-right compositions.
Explore more experimental and varied layouts.
Feel free to go visually bold, but keep it purposeful, not random.

Use different section structures:
- fullscreen hero compositions
- strong background image sections
- editorial collage layouts
- image-led gallery systems
- diagram-inspired information sections
- process / journey sections
- premium card systems
- local SEO / location sections
- contact / inquiry sections
- minimal but highly refined whitespace sections

Please use full background images, strong full-background color compositions, or rich visual surfaces.
Do not create plain, boring white template sections.
Keep the preferred theme as:
{{preferred_theme}}

Overall:
Stay visually consistent across the full set while making each section distinct.
The final result should look highly creative, thoughtful, premium, conversion-oriented, and visually impressive, with strong UX and a clear business purpose.

The generated website sections should feel custom-made for:
{{business_name}}

Use these key business strengths especially:
{{unique_selling_points}}

Use these website improvement opportunities especially:
{{design_opportunities}}

Use these current website weaknesses as redesign direction:
{{current_website_problems}}

Use these review insights especially:
{{review_highlights}}

Use these services especially:
{{main_services}}

Use these audiences especially:
{{target_customers}}

Use this positioning especially:
{{recommended_positioning}}

Use this website goal especially:
{{recommended_website_goal}}

Use this CTA especially:
{{primary_cta}}

Generate 8 different images total.
Do not combine them into one image.
Each image should represent one separate website section.
Do not create one long full-page website.
Create 8 distinct section visuals.

The 8 sections should roughly follow this structure:

1. Hero Section
Create a stunning opening section for {{business_name}}.
It should immediately communicate the business branch, location, positioning, main value proposition, and strongest reason to engage.
Use strong typography, a memorable visual composition, and the primary CTA:
{{primary_cta}}

The hero should feel iconic, premium, and specifically designed for this business.
It should feel like a major upgrade from the current website.
It should not look like a generic industry landing page.

2. About / Identity / Positioning Section
Show what makes {{business_name}} special.
Use the company's story, positioning, location, atmosphere, experience, customer trust, and unique selling points.
This section should feel editorial, premium, and trust-building.

Relevant points:
{{unique_selling_points}}
{{recommended_positioning}}

3. Services / Use Cases Section
Present the main services or use cases of the business.
Use a clear but creative structure.
Avoid a boring generic card grid.
Make the services easy to understand, but visually impressive.

Main services:
{{main_services}}

Secondary services:
{{secondary_services}}

Inferred services:
{{inferred_services}}

If services are inferred, avoid overly specific claims and use broader service language.

4. Facts / Trust / Advantages Section
Highlight factual reasons to trust the business.
Use numbers, ratings, experience, local relevance, capacity, reviews, quality indicators, or operational strengths where available.

Possible trust elements:
{{google_rating}}
{{google_review_count}}
{{review_highlights}}
{{unique_selling_points}}

If exact numbers are missing or unverified, use more general trust-building visual language instead.

5. Process / Customer Journey Section
Show how customers work with the business.
Create a process, journey, timeline, or step-by-step section.
Make the experience feel simple, professional, reassuring, and easy to start.

Use the business context and services to infer a suitable customer journey.
Do not invent legally sensitive, medical, financial, or unrealistic claims.
Use safe generic process language when the exact process is unknown.

6. Signature Offer / High-Value Service Section
Create a section for the strongest service, offer, or emotional selling point of the business.
This should be the section that makes the business feel especially desirable and commercially relevant.

Use these priorities:
{{section_focus}}

If no section focus is provided, select the most commercially valuable service from:
{{main_services}}

If the service is inferred, keep the copy broad and safe.

7. Gallery / Proof / Impression Section
Create a highly visual section that shows the atmosphere, work, results, products, venue, team, process, or customer experience.
This section should feel immersive, premium, and emotionally convincing.
It should not look like a generic stock image grid.

If current website images or public business photos are available, make the section feel inspired by the real business.
If not, create a high-quality industry-appropriate visual system.

Use the following visual mood:
{{visual_mood}}

8. Contact / Inquiry Section
Create a conversion-focused final section.
Include the business name, location, contact details, opening hours if useful, and the primary CTA.

Include:
{{business_name}}
{{address}}
{{phone}}
{{email}}
{{opening_hours}}
{{city}} / {{region}}
CTA: {{primary_cta}}

This section should feel elegant, trustworthy, simple, and frictionless, while still highly designed.

Additional design requirements:
- integrate typography beautifully into the visual composition
- use layered compositions, elegant UI cards, subtle motion cues, and premium image crops
- some sections can be minimal and restrained, others can be expressive and immersive
- maintain a strong sense of pacing across the 8 images
- avoid generic templates
- avoid cheap corporate stock aesthetics
- avoid random decorative visuals without purpose
- avoid boring repetition between sections
- make every section feel useful for selling the business
- make the design feel like a serious premium redesign proposal, not just decorative concept art

Important output rule:
Generate exactly 8 different images.
Each image must be a separate website section.
Do not merge multiple sections into one image.
Do not create one long full-page website.
Create 8 distinct section visuals.
`;

const EMPTY_PLACEHOLDER = "—";

function formatArray(values: readonly string[] | undefined): string {
  if (!values || values.length === 0) return EMPTY_PLACEHOLDER;
  return values.map((v) => `- ${v}`).join("\n");
}

function formatString(value: string | undefined): string {
  if (!value || value.trim().length === 0) return EMPTY_PLACEHOLDER;
  return value.trim();
}

function formatBoolean(value: boolean | undefined): string {
  if (value === true) return "true";
  if (value === false) return "false";
  return EMPTY_PLACEHOLDER;
}

function buildSubstitutions(profile: BusinessProfile): Record<string, string> {
  return {
    business_name: formatString(profile.business_name),
    business_branch: formatString(profile.business_branch),
    sub_branch: formatString(profile.sub_branch),
    website_url: formatString(profile.website_url),
    has_website: formatBoolean(profile.has_website),
    google_business_profile_url: formatString(profile.google_business_profile_url),
    google_business_category: formatString(profile.google_business_category),
    city: formatString(profile.city),
    region: formatString(profile.region),
    country: formatString(profile.country),
    address: formatString(profile.address),
    phone: formatString(profile.phone),
    email: formatString(profile.email),
    opening_hours: formatString(profile.opening_hours),
    google_rating: formatString(profile.google_rating),
    google_review_count: formatString(profile.google_review_count),
    review_source: formatString(profile.review_source),
    review_verification_status: formatString(profile.review_verification_status),
    review_highlights: formatArray(profile.review_highlights),
    business_photos_available: formatBoolean(profile.business_photos_available),
    main_services: formatArray(profile.main_services),
    secondary_services: formatArray(profile.secondary_services),
    inferred_services: formatArray(profile.inferred_services),
    target_customers: formatArray(profile.target_customers),
    unique_selling_points: formatArray(profile.unique_selling_points),
    current_website_problems: formatArray(profile.current_website_problems),
    no_website_opportunity: formatString(profile.no_website_opportunity),
    design_opportunities: formatArray(profile.design_opportunities),
    competitor_reference_websites: formatArray(profile.competitor_reference_websites),
    recommended_positioning: formatString(profile.recommended_positioning),
    recommended_website_goal: formatString(profile.recommended_website_goal),
    desired_style: formatString(profile.desired_style),
    preferred_theme: formatString(profile.preferred_theme),
    brand_colors: formatArray(profile.brand_colors),
    visual_mood: formatString(profile.visual_mood),
    image_style: formatString(profile.image_style),
    tone_of_voice: formatString(profile.tone_of_voice),
    primary_cta: formatString(profile.primary_cta),
    secondary_ctas: formatArray(profile.secondary_ctas),
    section_focus: formatArray(profile.section_focus),
    special_notes: formatArray(profile.special_notes),
  };
}

/**
 * Setzt alle `{{placeholder}}`-Tokens aus einem der Templates gegen die
 * Felder des Business-Profils ein. Arrays werden zu `- Item`-Listen,
 * leere Felder bekommen "—".
 *
 * Ersetzung laeuft einmal global per Regex — reicht weil Platzhalter
 * strikt snake_case sind und nicht geschachtelt vorkommen.
 */
export function buildPitchPrompt(
  profile: BusinessProfile,
  mode: PitchPromptMode,
): string {
  const template = mode === "redesign" ? REDESIGN_TEMPLATE : CREATION_TEMPLATE;
  const subs = buildSubstitutions(profile);
  return template.replace(/\{\{([a-z_]+)\}\}/g, (match, key: string) => {
    if (Object.prototype.hasOwnProperty.call(subs, key)) return subs[key];
    return match;
  });
}
