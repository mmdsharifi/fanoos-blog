# اسکیل‌های ایجنت و فایل design.md

سلام دوستان! 👋

خوش اومدید به اولین جلسه سال ۱۴۰۵! خب امسال واقعاً سال هیجان‌انگیزیه برای ما دیزاینرا. کلی اتفاقات و آپدیت‌های جدید داره می‌افته — از جمله **Figma Design Agent** که وارد فاز بتا شده و کلی قابلیت‌های جذاب دیگه که هر کدومش می‌تونه نحوه کار ما رو متحول کنه.

سعی می‌کنم توی هفته‌های آینده کم‌کم همه این موضوعات رو پوشش بدیم. ولی خب، تصمیم گرفتیم با یه مفهوم پایه‌ای و خیلی کاربردی شروع کنیم: **Agent Skills**. امیدوارم مفید باشه!

---

## ⚡ Agent Skills چیه؟

فرض کن یه ایجنت هوشمند داری (مثل Claude یا Gemini) که باهاش کد می‌زنی یا UI درست می‌کنی. حالا این ایجنت به‌صورت پیش‌فرض یه سری توانایی‌ها داره، ولی اگه بخوای یه کار خاص رو **دقیق و تکرارپذیر** انجام بده — مثلاً هر بار که بگی «پست جدید بنویس» بره طبق یه فرمت مشخص عمل کنه — اینجاست که **Agent Skills** وارد بازی می‌شن.

### خب اسکیل دقیقاً چیه؟

اسکیل یه **پکیج آماده از دستورات + ریسورس‌ها** هست که توی یه فولدر مرتب شده و ایجنت وقتی نیاز داشته باشه خودش میاد ازش استفاده می‌کنه.

هر اسکیل شامل اینا می‌شه:

| فایل/فولدر | توضیح |
|-------------|-------|
| `SKILL.md` | ✅ مهم‌ترین فایل — دستورات + متادیتا |
| `scripts/` | اسکریپت‌های کمکی (اختیاری) |
| `references/` | مستندات اضافی (اختیاری) |
| `assets/` | تمپلیت‌ها و فایل‌های جانبی (اختیاری) |

### فایل SKILL.md چه شکلیه؟

این فایل دو بخش اصلی داره:

**۱. متادیتا (YAML Frontmatter):**

```yaml
---
name: my-awesome-skill
description: Generate blog posts for Fanoos blog with research and Persian tone
version: 1.0.0
---
```

اینجا `name` و `description` خیلی مهمن چون ایجنت بر اساس description تصمیم می‌گیره کی این اسکیل رو فعال کنه.

**۲. دستورات (Markdown Body):**

بدنه فایل شامل دستورات قدم‌به‌قدم، قوانین، و بهترین شیوه‌هاست. مثلاً:
- چه زمانی فعال بشه (Trigger Conditions)
- چه مراحلی رو طی کنه
- چه چیزایی رو رعایت کنه

### ایجنت چطوری از اسکیل استفاده می‌کنه؟

یه فرایند سه‌مرحله‌ای داره:

1. **کشف (Discovery):** ایجنت وقتی شروع به کار می‌کنه، فقط اسم و توضیح اسکیل‌ها رو می‌خونه
2. **فعال‌سازی (Activation):** وقتی درخواست کاربر با توضیح یه اسکیل مچ بشه، ایجنت کل `SKILL.md` رو لود می‌کنه
3. **اجرا (Execution):** ایجنت طبق دستورات عمل می‌کنه — اسکریپت اجرا می‌کنه، فایل می‌سازه، و...

> 💡 نکته مهم: اسکیل‌ها مثل **Lazy Loading** کار می‌کنن. تا وقتی لازم نباشن، لود نمی‌شن. این باعث می‌شه ایجنت سریع‌تر و بهینه‌تر کار کنه.

📖 مستندات کامل: [Agent Skills — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

---

## 🛠️ یه مثال واقعی: اسکیل بلاگ‌نویسی فانوس

حالا بیاید یه مثال واقعی ببینیم. ما توی همین جلسه تصمیم گرفتیم که خود فرایند نوشتن پست‌های بلاگ فانوس رو تبدیل به یه **اسکیل** کنیم — و همین پستی که الان داری می‌خونی، دقیقاً با همون اسکیل نوشته شده! ✨

فرایندش اینطوری کار می‌کنه:

1. من پیش‌نویس/موضوع رو به ایجنت می‌گم
2. ایجنت میره **ریسرچ** می‌کنه
3. یه **درفت** می‌نویسه به زبون خودمونی
4. بعد **پالیش و ادیت** می‌شه
5. و نهایتاً **پابلیش** می‌شه

<details>
<summary>👀 مشاهده فایل کامل اسکیل (SKILL.md)</summary>

````markdown
---
name: fanoos-blog-writer
description: Write, research, and publish blog posts for the Fanoos (فانوس) blog. Activate this skill when the user asks to write a new blog post, create a post draft, publish a post, or mentions 'fanoos blog', 'blog post', 'پست جدید', 'بلاگ فانوس', 'پست بنویس'. The blog is a Persian (Farsi) blog targeting designers learning about AI tools and workflows.
version: 1.0.0
---

# Fanoos Blog Writer Skill 📝🏮

## Trigger Conditions
Activate when the user mentions:
- "پست جدید" / "new post" / "blog post"
- "بلاگ فانوس" / "fanoos blog"
- "پست بنویس" / "write a post"
- "پابلیش" / "publish"
- "درفت" / "draft"
- Any request to create content for the Fanoos blog

## Blog Structure
The Fanoos blog is a static markdown blog located at the user's workspace. The structure:
```
fanoos-blog/
├── index.html           ← Main page (post list)
├── post.html            ← Single post view
├── css/style.css        ← Styles
├── js/app.js            ← Theme + markdown render
└── posts/
    ├── index.json       ← Post registry (MUST be updated)
    └── {slug}.md        ← Individual posts (pure markdown, NO frontmatter)
```

## Workflow: 4-Phase Process

### Phase 1: Research (ریسرچ) 🔍
1. Read the user's draft/topic/outline carefully
2. **Research the topic thoroughly** using web search and URL reading:
   - Find official documentation and primary sources
   - Understand technical concepts deeply
   - Collect practical examples and code samples
   - Find related resources and links
3. Organize findings into structured notes
4. Identify what's most relevant for **designers** specifically

### Phase 2: Draft (درفت) ✏️
1. Create the blog post markdown file in `posts/{slug}.md`
2. Follow these **content rules**:
   - **Language:** Persian/Farsi (فارسی), RTL
   - **Tone:** Informal, conversational (محاوره‌ای خودمونی)
     - Use "تو" (second person singular, not formal "شما")
     - Use colloquial forms: "خوش اومدی" not "خوش آمدید", "می‌شه" not "می‌شود"
     - Mix Persian and English tech terms naturally: "ایجنت", "دیزاین سیستم", "UI"
     - Short, punchy sentences
   - **Audience:** Designers who want to learn about AI tools — explain technical concepts simply
   - **Emojis:** Use sparingly but effectively (section headers, key points)
3. Follow this **post structure**:
   - `# Title` — H1 heading (this IS the post title)
   - Intro paragraph — warm, inviting, sets the context
   - `---` separator after intro
   - `## Section` headings for major topics
   - `### Subsection` headings for sub-topics
   - Use tables, code blocks, blockquotes, and lists for variety
   - Include relevant links
   - End with a summary table and casual sign-off ("خوش بگذره! ✌️" or similar)
4. **NO YAML frontmatter** in the .md file — metadata goes in index.json ONLY

### Phase 3: Polish (پالیش) ✨
1. Review the draft for:
   - Flow and readability
   - Technical accuracy
   - Consistent tone (stay informal!)
   - Proper markdown formatting
   - All links working
2. Update `posts/index.json` with the new post entry:
   ```json
   {
     "slug": "kebab-case-slug",
     "title": "عنوان فارسی پست",
     "excerpt": "خلاصه یک‌خطی فارسی — توضیح کوتاه محتوا",
     "date": "1405/MM/DD",
     "lastEdited": "YYYY-MM-DDTHH:MM:SS+03:30",
     "tags": ["تگ۱", "تگ۲"]
   }
   ```
   - **slug:** kebab-case, matches the .md filename (no `.md` extension)
   - **date:** Jalali/Shamsi calendar (۱۴۰۵/ماه/روز)
   - **lastEdited:** ISO 8601 with Tehran timezone (+03:30)
   - **tags:** Array of Persian strings
   - **Add new post at the TOP** of the JSON array (newest first)
3. Present the draft to the user for review

### Phase 4: Publish (پابلیش) 🚀
1. After user approval:
   - Finalize the markdown file
   - Ensure index.json is properly updated
   - Verify the post renders correctly by reviewing markdown syntax
2. Confirm to the user that the post is live

## Naming Conventions
- **Slugs:** Always kebab-case, descriptive in English: `agent-skills-design-md`, `figma-to-code-tips`
- **Files:** `posts/{slug}.md`
- **No spaces, no Persian characters in filenames**

## Content Guidelines

### DO ✅
- Explain technical concepts using simple analogies and comparisons
- Include practical examples and code snippets
- Add resource links for further reading
- Use tables for comparisons and summaries
- Use blockquotes for important tips (with 💡 or 🎯 emoji)
- Keep paragraphs short (2-3 sentences max)
- Add a summary/recap section at the end

### DON'T ❌
- Don't be formal or academic
- Don't assume the reader knows programming deeply
- Don't use long, complex sentences
- Don't skip the research phase — always verify information
- Don't put frontmatter (---) in the markdown files
- Don't forget to update index.json

## Date Conversion Reference
Approximate Jalali month mapping for 1405:
- فروردین (01): Mar 21 - Apr 20
- اردیبهشت (02): Apr 21 - May 21
- خرداد (03): May 22 - Jun 21
- تیر (04): Jun 22 - Jul 22
- مرداد (05): Jul 23 - Aug 22
- شهریور (06): Aug 23 - Sep 22
- مهر (07): Sep 23 - Oct 22
- آبان (08): Oct 23 - Nov 21
- آذر (09): Nov 22 - Dec 21
- دی (10): Dec 22 - Jan 20
- بهمن (11): Jan 21 - Feb 19
- اسفند (12): Feb 20 - Mar 20

## Example: Quick Post Creation
When user says: "یه پست بنویس درباره فیگما و AI"
1. Research: Search for Figma AI features, plugins, best practices
2. Draft: Create `posts/figma-ai-tools.md` with researched content in Persian
3. Polish: Review, add to index.json, present for approval
4. Publish: Finalize after user feedback
```
````
</details>

> 🎯 هدف: هر بار که بگم «پست جدید بنویس» ایجنت خودش بدونه باید چیکار کنه — بدون اینکه هر بار از اول توضیح بدم.

این دقیقاً همون قدرت Agent Skills هست! یه بار تعریفش می‌کنی، بعد بارها ازش استفاده می‌کنی.

---

## 🎨 فایل design.md چیه؟

حالا بیایم سر یه موضوع که مستقیم به ما دیزاینرا مربوطه: **فایل `design.md`**.

### مشکل چیه؟

وقتی با ایجنت‌های AI کد می‌زنی، یه مشکل رایج هست: **ناهماهنگی بصری**. یعنی ایجنت ممکنه هر بار یه رنگ، یه فاصله، یه فونت متفاوت استفاده کنه. بهش می‌گن **Visual Drift** (انحراف بصری).

### راه‌حل: design.md

فایل `design.md` یه سند مارک‌داونی هست که توی ریشه پروژه‌ات می‌ذاری و توش **دیزاین سیستم** پروژه رو مستند می‌کنی. ایجنت قبل از ساختن هر UI، اول این فایل رو می‌خونه و بعد طبق قوانینش عمل می‌کنه.

### تفاوتش با فایل‌های دیگه

| فایل | مخاطب | محتوا |
|------|--------|-------|
| `README.md` | انسان | معرفی پروژه، نحوه نصب |
| `AGENTS.md` | ایجنت AI | قوانین فنی، نحوه بیلد |
| `DESIGN.md` | ایجنت AI | **دیزاین سیستم و قوانین بصری** |

### ساختار فایل design.md

فایل از دو بخش تشکیل شده:

**۱. توکن‌های دیزاین (YAML Front Matter):**

```yaml
---
design_tokens:
  colors:
    primary: "#2E38FF"
    secondary: "#6366F1"
    background:
      light: "#FFFFFF"
      dark: "#0F172A"
    text:
      light: "#1E293B"
      dark: "#F1F5F9"
  typography:
    heading_font: "Estedad"
    body_font: "Vazirmatn"
    base_size: "16px"
    scale_ratio: 1.25
  spacing:
    unit: "8px"
    small: "8px"
    medium: "16px"
    large: "32px"
  border_radius:
    small: "6px"
    medium: "12px"
    large: "16px"
---
```

**۲. قوانین و راهنما (Markdown Body):**

```markdown
## اصول طراحی

- مینیمال و تمیز باشه
- فضای خالی (whitespace) زیاد باشه
- انیمیشن‌ها ظریف و نامحسوس باشن

## قوانین کامپوننت‌ها

### دکمه‌ها
- گوشه‌ها همیشه گرد (border-radius: 12px)
- رنگ پرایمری برای CTA
- حالت hover باید subtle باشه

### کارت‌ها
- سایه نرم (box-shadow ملایم)
- هیچ‌وقت کارت توی کارت نذارید
- فاصله داخلی: 24px

## ❌ نبایدها
- از رنگ قرمز خالص (#FF0000) استفاده نکنید
- متن تمام حروف بزرگ (uppercase) نداشته باشید
- فونت‌سایز کمتر از 14px ممنوع
```

### چرا مهمه؟

- **ثبات بصری:** ایجنت هر بار طبق همون دیزاین سیستم عمل می‌کنه
- **پل ارتباطی:** بین فیگما و کد، design.md اون لینک گمشده‌ست
- **داکیومنت زنده:** هر وقت دیزاین سیستمت عوض شد، فایل رو آپدیت می‌کنی و ایجنت خودکار سازگار می‌شه

---

## 🔗 لینک‌ها و ریسورس‌های مفید

توی جلسه چند تا ریسورس خیلی خوب هم معرفی کردیم:

### [Google Stitch](https://stitch.withgoogle.com/)
ابزار گوگل برای تبدیل دیزاین به کد با کمک AI. مستقیم از فیگما می‌تونی به کد مبتنی بر دیزاین سیستمت برسی. اینجاست که `design.md` وارد بازی می‌شه — Stitch از این فایل برای درک سبک بصری پروژه‌ات استفاده می‌کنه.

### [Skills.sh](https://www.skills.sh/)
یه دایرکتوری برای پیدا کردن اسکیل‌های آماده. اگه دنبال یه اسکیل خاص می‌گردی — مثلاً برای تست نویسی، کد ریویو، یا دیپلوی — احتمالاً اینجا پیداش می‌کنی.

### [Aura Build — Design Skills](https://www.aura.build/skills)
اسکیل‌های مخصوص دیزاین! اینجا اسکیل‌هایی پیدا می‌کنی که مستقیم به کار دیزاینرا میاد — از دیزاین سیستم گرفته تا UI/UX و اینتراکشن دیزاین.

---

## جمع‌بندی

| موضوع | خلاصه |
|-------|-------|
| Agent Skills | پکیج‌های ماژولار برای گسترش توانایی ایجنت |
| SKILL.md | فایل اصلی هر اسکیل — متادیتا + دستورات |
| design.md | دیزاین سیستم پروژه به‌صورت agent-native |
| Google Stitch | تبدیل دیزاین به کد با AI |
| Skills.sh | دایرکتوری اسکیل‌های آماده |
| Aura Build | اسکیل‌های مخصوص دیزاین |

تا جلسه بعدی، خوش بگذره! ✌️

موردی یا سوالی بود بهم [ایمیل بزنید](mailto:mohammadsha@systemgroup.net)

