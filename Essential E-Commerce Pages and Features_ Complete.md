<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Essential E-Commerce Pages and Features: Complete Design Guide

Given your background building e-commerce and retail RAG pipelines, here's a comprehensive breakdown of must-have features, optimal placements, and pages for modern e-commerce websites and mobile apps.

***

### **Shop/Product Listing Page Features**

#### **Desktop Layout**

The shop page should include filters in a **left-hand sidebar** (most scalable for multiple filter options), with sorting options at the **top-right above the product grid**. Key features:[^1][^2][^3]

**Above the Fold:**

- Breadcrumb navigation at top[^1]
- Search bar (top center/right)[^1]
- Filter sidebar (left side)[^4][^3]
- Sorting dropdown (top right: relevance, price low-high, newest, rating)[^2][^3]
- Product grid starting immediately visible[^1]

**Product Cards Should Display:**

- High-quality product images (zoomable)[^5]
- Product name and brief description[^6]
- Price (with sale price if applicable)[^6]
- Quick "Add to Cart" button[^7]
- Wishlist/heart icon[^8][^9]
- Color/variant options preview[^6]
- Customer rating stars and review count[^10][^5]

**Additional Features:**

- Pagination or infinite scroll[^11]
- Quick view modal on hover[^7]
- Product comparison checkbox (below/above product image)[^12]
- "Items per page" selector[^11]
- Applied filters indicator with clear/remove option[^3]
- Category navigation/mega menu[^10][^1]


#### **Mobile Layout**

Mobile requires **vertical stacking** with filters accessible via a hamburger menu or bottom sheet:[^13][^14]

**Above the Fold (≈600px height):**[^15]

- Sticky header with logo, search, cart icons[^14]
- Breadcrumbs (condensed)[^1]
- Filter button (top left) and sort button (top right)[^13]
- Product grid (2-column layout with 4-column grid system)[^16]

**Mobile-Specific Optimizations:**

- Large tap targets (minimum 44x44px)[^13]
- Bottom navigation bar for cart, wishlist, account[^14]
- Filter/sort opens as full-screen overlay or bottom sheet[^13]
- Swipeable product carousels[^17]
- Sticky "Apply Filters" button at bottom when filtering[^13]
- Fast loading (compress images, skeleton screens)[^13]

***

### **Product Detail Page (PDP) Features**

#### **Desktop Layout**

**Above the Fold:**[^18]

- Large product images (left side, 50-60% width) with thumbnail gallery and zoom functionality[^5]
- Product name and brand (top right)[^5]
- Price and any discounts[^5]
- Star rating with review count (clickable)[^10][^5]
- Size/color/variant selectors[^6]
- Quantity selector[^6]
- Prominent "Add to Cart" CTA button[^5]
- "Add to Wishlist" heart icon[^8]
- Trust badges (secure checkout, free returns)[^19][^10]
- Estimated delivery date[^20]

**Below the Fold:**

- Detailed product description with specifications[^21][^5]
- Accordion sections for: shipping info, return policy, size guide, care instructions[^22]
- Customer reviews and ratings section[^22][^10]
- Customer Q\&A section[^22]
- Product FAQ accordion[^23]
- Related/recommended products carousel[^7]
- "Customers also bought" section[^7]
- Social proof (customer photos)[^5]
- Stock availability indicator[^21]


#### **Mobile Layout**

**Hierarchy:**[^18]

1. Product images (full-width, swipeable gallery)
2. Product name and price
3. Variant selectors (use dropdowns to save space)[^18]
4. Add to cart button (sticky at bottom)[^18]
5. **Accordion-style collapsible sections** for description, specs, reviews, shipping[^22]

**Mobile Optimizations:**

- Minimize text input (use dropdowns for address/ZIP)[^18]
- Compress images while maintaining quality[^16]
- Sticky buy box that follows scroll[^18]

***

### **Shopping Cart Page Features**

#### **Desktop Layout**[^24][^6]

**Main Content:**

- Detailed product summary table with:[^6]
    - Thumbnail images (clickable to PDP)
    - Product name, color, size, specifications
    - Price per item
    - Quantity selector (plus/minus buttons)
    - Subtotal per item
    - Remove/delete option
    - "Save for later" or "Move to wishlist" option[^7]

**Right Sidebar:**[^6]

- Order summary box:
    - Subtotal
    - Estimated shipping cost (or free shipping progress bar)[^20]
    - Tax estimate
    - Total (prominent)
- Promo code field[^25]
- "Proceed to Checkout" CTA button (prominent, high-contrast color)[^6]
- Continue shopping link[^6]
- Trust/security badges[^19]

**Additional Features:**

- Virtual "candy rack" for upsells/cross-sells (small, non-intrusive)[^7]
- Estimated delivery date display[^20]
- Shipping/return policy links[^6]
- Cart abandonment prevention messaging[^20]


#### **Mobile Cart Page**[^26][^13]

- Stack vertically (product list on top, summary below)
- Use large, thumb-friendly buttons (44x44px minimum)[^13]
- Sticky checkout button at bottom[^13]
- Show product images clearly despite small screen[^26]
- Collapsible order summary[^13]
- Simplified layout focusing on essentials[^26]

***

### **Checkout Page Features**

#### **Best Practices for All Devices**[^27][^28][^19]

**Layout Options:**

- **Single-page checkout** (preferred for mobile and faster conversions)[^28]
- **Multi-step with progress bar** (desktop alternative showing: Shipping → Payment → Review)[^20]

**Essential Elements:**

**Guest Checkout Option:**[^27][^28]

- Prominently offer "Continue as Guest"
- Optional account creation post-purchase[^27]

**Form Fields (Left Side):**[^19]

- Shipping information section
- Billing information (checkbox for "same as shipping")
- Minimal required fields only[^27]
- Autofill enabled[^20]
- Clear field labels and error messaging[^19]

**Order Summary (Right Sidebar/Top on Mobile):**[^19][^20]

- List of items with thumbnails
- Itemized pricing breakdown
- Shipping cost transparency[^27]
- Tax breakdown
- Total (prominent)

**Payment Section:**[^28][^19]

- Multiple payment options displayed (cards, PayPal, Apple Pay, Google Pay)[^20]
- Security badges (SSL, VeriSign, McAfee)[^19]
- One-click payment for returning customers[^28]

**Additional Features:**

- Order notes/special instructions field[^20]
- Newsletter opt-in (not required)[^20]
- Clear return policy link[^10]
- Customer support contact visible[^20]
- Mobile-responsive design (74% of traffic)[^19]


#### **Mobile Checkout Optimization**[^19][^13]

- Large buttons and ample spacing[^19]
- Single-column layout[^13]
- Sticky "Place Order" button at bottom[^13]
- Simplified payment entry[^13]
- Digital wallet options prominent (Apple Pay, Google Pay)[^20]

***

### **Other Essential E-Commerce Pages**

#### **1. Homepage**[^29][^17]

**Desktop:**

- Hero banner (not auto-rotating carousel; static or manual slideshow)[^17]
- Value propositions (free shipping, returns)[^29]
- Featured categories (visible without scrolling)[^17]
- Featured products or bestsellers[^29]
- Social proof (reviews, testimonials)[^10]
- Trust badges[^10]

**Mobile:**

- Category navigation exposed (not just in hamburger)[^17]
- Swipeable featured products[^17]
- Simplified hero (single CTA)[^15]


#### **2. User Account/Profile Page**[^30][^31]

**Must-Have Features:**

- Profile information (name, email, phone, photo, birthday)[^31][^30]
- Order history with reorder capability[^30]
- Saved addresses (shipping \& billing)[^32][^30]
- Payment methods (securely stored)[^32][^30]
- Wishlist access[^30]
- Notification preferences[^32]
- Account settings (password change, delete account)[^31]
- Loyalty points/rewards[^30]

**Layout:**

- Left sidebar navigation menu[^31]
- Main content area on right[^31]
- Essential info above fold[^31]


#### **3. Wishlist Page**[^33][^9][^8]

**Features:**

- Product thumbnails with key details[^8]
- Price and availability status[^8]
- "Add to Cart" button for each item[^33]
- Remove/delete option[^33]
- Privacy settings (public/private/shared)[^33]
- Share wishlist (social, email, link)[^8][^33]
- Move items between lists[^33]
- Download/print PDF option[^33]
- Sort and filter options[^8]
- "Save for later" integration with cart[^7]

**Placement:**

- Heart icon in top navigation (with item count)[^9]
- Widget in header for quick access[^33]


#### **4. Order Tracking Page**[^34][^35][^36]

**Must-Have Elements:**

- Order number and status[^34]
- Visual progress tracker/timeline[^36]
- Current shipment location[^34]
- Estimated delivery date[^35][^34]
- Shipping carrier and tracking number[^34]
- Direct tracking link to carrier site[^34]
- Order summary with product images[^34]
- Shipping and billing address[^34]
- Contact support options[^35][^36]
- Related products/upsells (subtle)[^35]

**Design:**

- Branded to match site design[^35]
- Mobile-responsive[^36]
- Real-time updates[^36]
- Self-service focused (reduces WISMO calls)[^35]


#### **5. Product Comparison Page**[^37][^38][^12]

**Features:**

- Side-by-side comparison table (limit 3-5 products)[^38][^37]
- Product images (clickable to PDP)[^12]
- Key specifications organized by category[^37][^12]
- Price comparison[^38]
- Customer ratings for each product[^12]
- "Add to Cart" button for each product[^12]
- Highlight differences (visual cues)[^37]
- Print/email/save comparison option[^12]
- Clear "back to results" button[^12]
- Tooltips for technical terms[^12]


#### **6. Search Results Page**[^32][^1]

- Similar layout to shop page
- Show search query prominently
- "Did you mean" suggestions for typos[^1]
- Filter and sort options[^1]
- Number of results displayed
- Related searches/suggestions


#### **7. About Us Page**[^39][^40]

- Brand story and mission[^40]
- Team information[^40]
- Company values[^40]
- Key milestones[^40]
- Physical location(s) if applicable[^40]


#### **8. Contact Us Page**[^41][^42]

**Essential Elements:**

- Contact form (name, email, message)[^41]
- Email address[^41]
- Phone number[^41]
- Physical address[^41]
- Business hours[^41]
- Social media links[^41]
- Link to FAQ/Help Center[^42]
- Google Maps integration[^41]
- Live chat option if available[^41]
- CAPTCHA for spam protection[^41]


#### **9. FAQ Page**[^43][^44][^42]

**Features:**

- Searchable question database[^43]
- Questions organized by category/topic[^42]
- Accordion-style expandable answers[^43]
- Contact Us button prominent[^42]
- Common topics:[^43]
    - Shipping and delivery
    - Returns and refunds
    - Payment methods
    - Product information
    - Account management
    - Order tracking


#### **10. Legal Pages**[^39][^29]

- Privacy Policy
- Terms and Conditions/Terms of Service[^39]
- Return/Refund Policy[^25]
- Shipping Policy[^32]
- Cookie Policy[^39]
- Accessibility Statement


#### **11. Blog/Content Pages**[^40]

- Industry insights
- Product guides
- Customer stories
- SEO-optimized content[^40]


#### **12. Store Locator (if applicable)**[^29][^39]

- Search by location/ZIP code[^39]
- Google Maps integration[^39]
- Store hours and contact info[^39]
- Directions link[^39]


#### **13. Order Confirmation/Thank You Page**[^45][^32]

- Order number[^32]
- Order summary[^32]
- Estimated delivery date[^32]
- Shipping details[^32]
- Contact support info[^32]
- Create account prompt (if guest checkout)[^32]
- Related product recommendations[^32]


#### **14. 404 Error Page**[^45]

- Friendly error message
- Search bar
- Links to popular categories
- Homepage link
- Help/contact option

***

### **Universal Navigation Features**

#### **Desktop Header**[^10][^1]

- Logo (top left, links to homepage)
- Main navigation menu/mega menu[^1]
- Search bar (top center/right)[^1]
- Account/login icon
- Wishlist icon with count
- Shopping cart icon with count and mini-cart preview[^24]


#### **Mobile Header**[^46][^14]

- Logo (center or left)
- Hamburger menu (left)
- Search icon
- Cart icon (right)
- Sticky/fixed on scroll[^46]


#### **Mobile Bottom Navigation Bar**[^14]

- Home
- Categories/Shop
- Wishlist
- Cart
- Account


#### **Footer (All Devices)**[^29][^1]

- Quick links (About, Contact, FAQ, Shipping, Returns)
- Customer service links
- Social media icons
- Newsletter signup
- Payment method icons
- Trust badges/certifications
- Copyright information

***

### **Key Design Principles Across All Pages**

1. **Mobile-First Responsive Design**[^23][^14]
    - 68% of e-commerce traffic is mobile[^13]
    - Touch-friendly tap targets (44x44px minimum)[^13]
    - Vertical stacking on mobile[^15]
    - Fast loading speed (compress images, minimize scripts)[^13]
2. **Trust Building**[^10]
    - Security badges throughout[^19]
    - Customer reviews prominently displayed[^10]
    - Clear return policy[^10]
    - Transparent pricing[^27]
    - Contact information accessible[^10]
3. **Consistency**[^35]
    - Consistent branding (colors, fonts, tone)[^42]
    - Uniform navigation across pages[^46]
    - Predictable layout patterns[^19]
4. **Accessibility**[^46][^1]
    - Clear labels and error messages[^19]
    - High contrast for CTAs[^6]
    - Keyboard navigation support
    - Screen reader compatible
5. **Performance**[^23][^13]
    - Fast page load times[^23]
    - Image optimization[^5]
    - Minimal required clicks[^28]
    - Progressive loading/skeleton screens[^13]

This comprehensive structure provides everything needed for a modern, conversion-optimized e-commerce platform on both web and mobile.[^47][^48][^49][^23][^1][^10][^32]
<span style="display:none">[^100][^101][^102][^103][^104][^105][^106][^107][^108][^109][^110][^111][^112][^113][^114][^115][^116][^117][^118][^50][^51][^52][^53][^54][^55][^56][^57][^58][^59][^60][^61][^62][^63][^64][^65][^66][^67][^68][^69][^70][^71][^72][^73][^74][^75][^76][^77][^78][^79][^80][^81][^82][^83][^84][^85][^86][^87][^88][^89][^90][^91][^92][^93][^94][^95][^96][^97][^98][^99]</span>

<div align="center">⁂</div>

[^1]: https://litextension.com/blog/ecommerce-website-features/

[^2]: https://www.linkedin.com/pulse/ecommerce-guide-category-sort-filter-linda-bustos

[^3]: https://delante.co/e-commerce-product-sorting-and-filtering/

[^4]: https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-filtering

[^5]: https://vwo.com/blog/ecommerce-product-page-design/

[^6]: https://www.abtasty.com/blog/shopping-cart-optimization/

[^7]: https://www.goinflow.com/blog/ecommerce-cart-checkout-design/

[^8]: https://thestory.is/en/journal/designing-wishlists-in-e-commerce/

[^9]: https://www.drip.com/blog/e-commerce-wishlist-examples

[^10]: https://www.shopify.com/in/blog/best-ecommerce-sites

[^11]: https://dev.to/webcraft-notes/optimizing-e-commerce-navigation-with-pagination-sorting-and-filter-features-3gon

[^12]: https://cxl.com/ecommerce-best-practices/product-comparison/

[^13]: https://www.justinmind.com/ui-design/shopping-cart

[^14]: https://onilab.com/blog/m-commerce-ux

[^15]: https://www.omniconvert.com/blog/above-the-fold-design/

[^16]: https://www.convertcart.com/blog/mobile-product-pages

[^17]: https://www.goinflow.com/blog/ecommerce-homepage-best-practices/

[^18]: https://www.mobiloud.com/blog/product-detail-pages-pdp-ecommerce

[^19]: https://www.digitalsilk.com/digital-trends/checkout-page-design-examples/

[^20]: https://www.convertcart.com/blog/how-do-i-increase-my-website-checkout-rate

[^21]: https://www.miquido.com/blog/ecommerce-app-features/

[^22]: https://www.goinflow.com/blog/product-page-design-examples/

[^23]: https://cyberchimps.com/blog/must-have-essentials-for-ecommerce-websites/

[^24]: https://onilab.com/blog/shopping-cart-ux

[^25]: https://nmgtechnologies.com/blog/must-have-pages-on-your-ecommerce-site

[^26]: https://www.convertcart.com/blog/mobile-cart-page-examples

[^27]: https://stripe.com/resources/more/checkout-optimization-tips-to-improve-conversion-rates

[^28]: https://juspay.io/blog/checkout-optimization-101-a-guide-to-improve-conversion-rates

[^29]: https://www.barrelny.com/posts/25-must-have-pages-for-your-ecommerce-website

[^30]: https://blog.getflits.com/9-features-on-a-customer-account-page-e-commerce/

[^31]: https://www.eleken.co/blog-posts/profile-page-design

[^32]: https://aureatelabs.com/guide/build-ecommerce-website-from-scratch/ecommerce-website-pages-list/

[^33]: https://yithemes.com/themes/plugins/yith-woocommerce-wishlist/

[^34]: https://plumrocket.com/blog/order-tracking-page

[^35]: https://www.lateshipment.com/blog/branded-parcel-tracking/

[^36]: https://www.trackorder.app/blogs/order-tracking-page-design

[^37]: https://belovdigital.agency/blog/how-to-create-effective-product-comparison-pages/

[^38]: https://www.linkedin.com/pulse/how-create-great-product-comparison-page-boost-jon-macdonald-srirc

[^39]: https://dokan.co/blog/4672/ecommerce-website-pages-list/

[^40]: https://www.oom.com.sg/best-ecommerce-website-pages/

[^41]: https://foxecom.com/blogs/all/shopify-contact-us-page-examples

[^42]: https://www.dropship.io/blog/e-commerce-faq-page-examples

[^43]: https://www.shopify.com/in/blog/120928069-how-to-create-faq-page

[^44]: https://www.ecommercepro.com/blogs/ecommerce-pro-blog/best-faq-page-examples-how-to-create-faqs-page-for-your-website

[^45]: https://crocoblock.com/blog/important-ecommerce-website-pages/

[^46]: https://www.mobiloud.com/blog/tips-to-design-and-optimize-a-mobile-friendly-e-commerce-website

[^47]: https://ijsrem.com/download/e-commerce-website-using-next-js/

[^48]: https://www.searchenginejournal.com/ecommerce-guide/must-have-website-features/

[^49]: https://support.ecwid.com/hc/en-us/articles/12342871972764-Best-practice-What-pages-to-add-on-an-ecommerce-website

[^50]: https://al-kindipublisher.com/index.php/jefas/article/view/10139

[^51]: https://www.semanticscholar.org/paper/ecdf531556fda898e1b6b59227ab5b02577a8587

[^52]: https://www.semanticscholar.org/paper/326e84cea8898fbe761098ad9dcc17103da4f8bf

[^53]: https://www.semanticscholar.org/paper/4d155c02fadcd4f323af055b2ed6e4e9cb577d9d

[^54]: https://www.semanticscholar.org/paper/f1f130e108335a5751db07876032c69fb130cd17

[^55]: https://www.semanticscholar.org/paper/606d66057d704b5f41c9ec7ff0a0e3c6cac71e21

[^56]: https://www.semanticscholar.org/paper/d9ac8b36309f13130f16e7d7d6bbad85702d0320

[^57]: https://arxiv.org/pdf/2108.05891.pdf

[^58]: https://www.ijfmr.com/papers/2023/6/8899.pdf

[^59]: https://tecnoscientifica.com/journal/jdmc/article/download/365/184

[^60]: https://www.ijfmr.com/papers/2023/3/2919.pdf

[^61]: http://www.jisem-journal.com/download/CJ4P6TDX.pdf

[^62]: https://www.ijfmr.com/papers/2023/5/7128.pdf

[^63]: https://www.mdpi.com/2071-1050/14/9/5328/pdf?version=1652088867

[^64]: https://www.ijfmr.com/papers/2024/5/29324.pdf

[^65]: https://razorpay.com/learn/conversion-rate-optimization-guide/

[^66]: https://www.techosquare.com/blog/online-store-features-list

[^67]: http://link.springer.com/10.1007/s10209-010-0186-8

[^68]: http://peer.asee.org/18108

[^69]: http://link.springer.com/10.1007/978-1-4302-4525-4

[^70]: https://www.semanticscholar.org/paper/54632673d72992688eb02f342cbf3ab0f00b2426

[^71]: https://www.semanticscholar.org/paper/5a980649d232666a2f48c2ccd519f6e03060d613

[^72]: https://www.semanticscholar.org/paper/a876370bdcec40a0963fdcf8ef4478c5f7db3922

[^73]: https://lupinepublishers.com/computer-science-journal/pdf/CTCSA.MS.ID.000131.pdf

[^74]: http://downloads.hindawi.com/journals/ahci/2017/6787504.pdf

[^75]: https://www.mdpi.com/2071-1050/12/6/2496/pdf

[^76]: https://www.mdpi.com/0718-1876/16/5/92/pdf?version=1621927658

[^77]: https://www.frontiersin.org/articles/10.3389/fnhum.2021.728895/pdf

[^78]: http://pdf.blucher.com.br/designproceedings/16ergodesign/0243.pdf

[^79]: http://thesai.org/Downloads/Volume11No8/Paper_39-Increasing_User_Satisfaction_of_Mobile_Commerce.pdf

[^80]: https://agilitycms.com/blog/why-user-profiles-are-essential-to-your-ecommerce-user-experience

[^81]: https://cmsmart.net/community/10-useful-features-of-successful-ecommerce-websites

[^82]: https://www.semanticscholar.org/paper/b35878f7e56a3473287c0f4abc1d4cbeddd9a965

[^83]: https://jurnal.unitri.ac.id/index.php/jast/article/view/1443

[^84]: https://www.semanticscholar.org/paper/0865f2bbb1263634fdcbc3af0b0e1e95056c32a4

[^85]: https://spir.aoir.org/ojs/index.php/spir/article/view/13395

[^86]: https://www.semanticscholar.org/paper/5a368e51317e0c052a2c79bea1d2fc848481ec4d

[^87]: https://www.semanticscholar.org/paper/66817832c74830a375e344825c4a90b3969b7bca

[^88]: https://www.semanticscholar.org/paper/4d944c3c53fab72e68a44194571a263cc5cef54c

[^89]: http://link.springer.com/10.1007/978-3-319-96071-5_1

[^90]: http://ric.zntu.edu.ua/article/view/241887

[^91]: http://link.springer.com/10.1007/s11528-012-0616-y

[^92]: https://ccsenet.org/journal/index.php/cis/article/download/19149/13941

[^93]: https://arxiv.org/abs/2406.17780v1

[^94]: https://arxiv.org/ftp/arxiv/papers/2004/2004.12923.pdf

[^95]: https://arxiv.org/pdf/2012.04681.pdf

[^96]: https://arxiv.org/pdf/1806.11226.pdf

[^97]: https://arxiv.org/pdf/2110.11072.pdf

[^98]: https://www.groovecommerce.com/ecommerce-blog/above-the-fold-website/

[^99]: https://dribbble.com/search/e-commerce-wishlist

[^100]: https://www.loopreturns.com/blog/design-best-practices-ecommerce-order-tracking-pages/

[^101]: https://www.ijraset.com/best-journal/build-a-job-application-with-django

[^102]: http://journal.unpar.ac.id/index.php/jrsi/article/view/1914

[^103]: https://www.semanticscholar.org/paper/6df4e47f50d7bd95c9b841f5f216d4093348ee70

[^104]: https://dl.acm.org/doi/10.1145/2991561.2998470

[^105]: https://www.semanticscholar.org/paper/f5afaf79c37271aa5ac1cd6350493b6aba3aa7ea

[^106]: https://www.semanticscholar.org/paper/82c941410b852418f6936de0f74f0c9d7ebc80d0

[^107]: http://link.springer.com/10.1007/1-4020-2148-8_16

[^108]: https://www.semanticscholar.org/paper/7abcbd0c4daa1f5ab082ccb17adefdc6218bf6ac

[^109]: http://link.springer.com/10.1007/11550822

[^110]: https://www.semanticscholar.org/paper/56d5945a273b91e5ddb1657b0188b009c9de2829

[^111]: https://arxiv.org/pdf/2409.07033.pdf

[^112]: https://arxiv.org/pdf/1809.06766.pdf

[^113]: https://arxiv.org/pdf/2003.04736.pdf

[^114]: http://arxiv.org/pdf/1903.12478.pdf

[^115]: https://arxiv.org/pdf/2409.02856.pdf

[^116]: https://www.jois.eu/files/11_1199_Chornous%20et%20al.pdf

[^117]: https://arxiv.org/pdf/2208.13480.pdf

[^118]: https://www.shopify.com/in/blog/product-comparison

