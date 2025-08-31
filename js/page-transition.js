class PageTransition {
    constructor() {
        this.progress = document.createElement('div');
        this.progress.className = 'page-progress';
        document.body.appendChild(this.progress);
        
        this.setupListeners();
        this.content = document.querySelector('.content-wrapper');
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href').endsWith('.html')) {
                e.preventDefault();
                this.loadPage(link.href);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.loadPage(window.location.href, false);
            }
        });
    }

    async loadPage(url, pushState = true) {
        this.startProgress();
        
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract the main content
            const newContent = doc.querySelector('.content-wrapper');
            if (newContent) {
                // Update the content
                this.content.innerHTML = newContent.innerHTML;
                
                // Update the title
                document.title = doc.title;
                
                // Update URL without page reload
                if (pushState) {
                    history.pushState({ path: url }, '', url);
                }

                // Scroll to anchor if present
                const hash = url.includes('#') ? url.split('#')[1] : null;
                if (hash) {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    window.scrollTo(0, 0);
                }
            }
        } catch (error) {
            console.error('Error loading page:', error);
        }

        this.completeProgress();
    }

    startProgress() {
        this.progress.style.width = '0%';
        this.progress.style.opacity = '1';
        this.progress.style.width = '30%';
        
        setTimeout(() => {
            this.progress.style.width = '70%';
        }, 100);
    }

    completeProgress() {
        this.progress.style.width = '100%';
        
        setTimeout(() => {
            this.progress.style.opacity = '0';
            setTimeout(() => {
                this.progress.style.width = '0%';
            }, 300);
        }, 200);
    }
}
