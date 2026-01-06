# Wombatlabs.ai Website

A modern, responsive website for Wombatlabs - an AI-First Design Agency. 

## Features

- **Fully Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations** - Fade-in animations, glow effects, and transitions
- **Interactive Hover States** - All buttons, links, and cards have engaging hover effects
- **Modern UI/UX** - Dark theme with teal/cyan accent colors
- **Smooth Scrolling** - Navigation links smoothly scroll to sections
- **Performance Optimized** - Lightweight and fast loading
- **Mobile-Optimized Team Bios** - Expandable team member profiles with intuitive toggle controls
- **Contact Form Integration** - Formspree integration for contact form submissions

## File Structure

```
wombatlabs.ai/
├── index.html          # Main HTML structure
├── styles.css          # All styling, animations, and hover states
├── script.js           # JavaScript for interactions
├── wombat-logo.png     # Company logo
├── dan-harrison.jpg    # Team member photo
├── kevin-ho.jpg        # Team member photo
├── wrangler.jsonc      # Cloudflare Workers configuration
├── 404.html            # 404 error page
└── README.md           # This file
```

## Hover States Included

1. **Navigation Links** - Color change on hover
2. **Primary Buttons** - Scale up, glow effect, and background color change
3. **Secondary Buttons** - Background and border color changes
4. **Logo** - Glow effect on hover
5. **Service Cards** - Border color, background color, and icon scale changes
6. **Approach Section Cards** - Border color, number color, and arrow animation
7. **About Section Cards** - Glow effect and background color changes
8. **Footer Links** - Text color change
9. **Social Media Icons** - Background and text color changes

## Getting Started

### Local Development

1. Start a local server on port 8111:
   ```bash
   python3 -m http.server 8111
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8111
   ```

Alternatively, simply open `index.html` in a web browser. No build process or dependencies required.

### Cloudflare Workers Deployment

The site is configured for Cloudflare Workers using `wrangler.jsonc`. Deploy using:
```bash
wrangler pages deploy .
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Color Scheme

- **Background**: Dark blue-gray (HSL: 222 47% 6%)
- **Primary**: Teal/Cyan (HSL: 174 72% 56%)
- **Foreground**: Light gray (HSL: 210 40% 98%)
- **Muted**: Medium gray (HSL: 215 20% 55%)

## Typography

- **Font Family**: Outfit (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

## Sections

1. **Hero** - Main landing section with call-to-action
2. **About** - Company overview and key differentiators
3. **Approach** - 4-step process explanation
4. **Services** - 6 service offerings in a grid
5. **Team** - Team member profiles with expandable bios on mobile
6. **Contact** - Contact form section
7. **Footer** - Links and social media

## Team Section Features

- **Team Member Profiles** - Detailed bios for Dan Harrison (Founding Director) and Kevin Ho (Co-Founder & Lead Product Designer)
- **Mobile-Responsive Bios** - On mobile devices, bios show only the first paragraph by default with a "more" toggle button
- **Expandable Content** - Click "more" to expand and see full bio, click "less" to collapse
- **Interactive Arrows** - Green arrow icons indicate expand/collapse state (down arrow for "more", up arrow for "less")
- **Highlighted Keywords** - Important phrases in team bios are highlighted in bold

## Customization

All colors are defined as CSS variables in `:root` at the top of `styles.css`. You can easily customize the color scheme by modifying these variables.

## License

This is a recreation for educational/demonstration purposes.

