# Julian Rocks - Homepage

Produktionsreife Homepage mit Glasmorph-Design, vollständig responsiv und optimiert.

## ✨ Features

- ✅ Responsive Design (Mobile-First)
- ✅ Dark Mode
- ✅ Mobile Menu
- ✅ Sticky Navigation
- ✅ Smooth Scrolling
- ✅ Kontaktformular (validiert)
- ✅ Lazy Loading
- ✅ WCAG 2.1 Accessible
- ✅ SEO optimiert (robots.txt, sitemap.xml)
- ✅ DSGVO-konform (Impressum, Datenschutz)

## 📁 Projektstruktur

```
├── index.html          # Hauptseite
├── css/styles.css      # Styles
├── js/script.js        # JavaScript
├── images/             # Bilder
├── robots.txt          # SEO
├── sitemap.xml         # SEO
└── .htaccess           # Security & Performance
```

## 🚀 Schnellstart

**Lokal testen:**
```bash
python -m http.server 8000
# Dann: http://localhost:8000
```

**Deployment:**
- **Netlify** (empfohlen): Repo verbinden → Deploy
- **Vercel**: Repo importieren → Deploy
- **FTP**: Alle Dateien hochladen + SSL einrichten

## ⚙️ Wichtige Anpassungen vor dem Launch

### 1. Kontaktdaten
In `index.html` ändern:
- Email → `email@domain.de`
- Telefon → `+49 ...`
- Social Media Links

### 2. Formular konfigurieren
Wähle eine Option:

**Option A - Formspree** (einfach):
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

**Option B - Netlify Forms** (bei Netlify Hosting):
```html
<form name="contact" method="POST" netlify>
<input type="hidden" name="form-name" value="contact" />
```

**Option C - Backend API**:
In `js/script.js` bearbeiten

### 3. Farben anpassen
In `index.html` (~Zeile 50):
```javascript
colors: {
    "primary": "#5444e4",       // Hier ändern
    "primary-light": "#7c6ff0"
}
```

### 4. Bilder optimieren
- Lokal speichern in `images/` Ordner
- Mit TinyPNG komprimieren
- WebP Format verwenden

### 5. Rechtliches
- **Impressum** (`impressum.html`): Kontaktdaten einfügen
- **Datenschutz** (`datenschutz.html`): Hoster eintragen

## 🔍 FAQ

| Frage | Antwort |
|-------|---------|
| Formular sendet nicht? | Fehler in Browser Console prüfen (F12) |
| Bilder laden nicht? | Rechtsklick → Bild-URL überprüfen |
| Mobile Menu fehlt? | JavaScript aktiviert? Breakpoint < 640px? |
| Farben ändern? | Tailwind Config in `index.html` anpassen |

## 🛠 Anpassungen

Alle Texte sind direkt in `index.html` bearbeitbar. Externe Ressourcen:
- Tailwind CSS (CDN)
- Google Fonts: Inter
- Material Symbols

## 📊 Performance & Security

✅ Lazy Loading Images  
✅ GZIP Kompression  
✅ Browser Caching  
✅ HTTPS empfohlen  
✅ XSS & Clickjacking Protection  

## 🌐 Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

**Version**: 1.0.0 | **Status**: ✅ Production Ready | **Copyright © 2026 Julian Rocks**
