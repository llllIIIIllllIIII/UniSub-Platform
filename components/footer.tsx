'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (section: string) => {
    // TODO: Implement actual navigation or modal opening for these sections
    console.log(`Navigate to ${section} section`);
    alert(`${section} page coming soon!`);
  };

  return (
    <footer className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-t border-brand-light-blue/20 dark:border-dark-surface/50 mt-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-blue rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-2xl font-bold text-brand-dark dark:text-dark-text">Unisub</span>
            </div>
            <p className="text-gray-600 dark:text-dark-text-secondary mb-6 max-w-lg text-fluid-base leading-relaxed">
              The Future of Content Subscription: NFT Access Pass. 
              Transform your subscriptions into tradeable digital assets.
            </p>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
              Built for the hackathon - MVP Demo Version
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-brand-dark dark:text-dark-text mb-6 text-fluid-lg">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handleLinkClick('About')}
                  className="text-gray-600 dark:text-dark-text-secondary hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 text-fluid-base hover:translate-x-1 transform"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('Community')}
                  className="text-gray-600 dark:text-dark-text-secondary hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 text-fluid-base hover:translate-x-1 transform"
                >
                  Community
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('Privacy Policy')}
                  className="text-gray-600 dark:text-dark-text-secondary hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 text-fluid-base hover:translate-x-1 transform"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-brand-dark dark:text-dark-text mb-6 text-fluid-lg">Connect</h3>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handleLinkClick('Discord')}
                  className="text-gray-600 dark:text-dark-text-secondary hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 text-fluid-base hover:translate-x-1 transform"
                >
                  Discord
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('Twitter')}
                  className="text-gray-600 dark:text-dark-text-secondary hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 text-fluid-base hover:translate-x-1 transform"
                >
                  Twitter
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('GitHub')}
                  className="text-gray-600 dark:text-dark-text-secondary hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 text-fluid-base hover:translate-x-1 transform"
                >
                  GitHub
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-dark-surface/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
            © {currentYear} Unisub. Built for hackathon demonstration.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-gray-400 dark:text-dark-text-secondary">Powered by</span>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-dark-text-secondary">
              <span className="hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300">Next.js</span>
              <span>•</span>
              <span className="hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300">TailwindCSS</span>
              <span>•</span>
              <span className="hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300">Web3</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}