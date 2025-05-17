
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-serif font-bold text-xl text-newsweave-primary">Tokenizee</span>
            </Link>
            <p className="text-sm text-newsweave-muted mb-4">
              A decentralized tokenization platform for content creators, built on Arweave and AO.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-newsweave-primary hover:text-newsweave-secondary">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-newsweave-primary hover:text-newsweave-secondary">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-newsweave-dark mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-newsweave-muted hover:text-newsweave-primary">About</Link></li>
              <li><Link to="/how-it-works" className="text-newsweave-muted hover:text-newsweave-primary">How it Works</Link></li>
              <li><Link to="/developers" className="text-newsweave-muted hover:text-newsweave-primary">Developers</Link></li>
              <li><Link to="/dao" className="text-newsweave-muted hover:text-newsweave-primary">DAO</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-newsweave-dark mb-4">Join</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/writers" className="text-newsweave-muted hover:text-newsweave-primary">Writers</Link></li>
              <li><Link to="/curators" className="text-newsweave-muted hover:text-newsweave-primary">Curators</Link></li>
              <li><Link to="/developers" className="text-newsweave-muted hover:text-newsweave-primary">Developers</Link></li>
              <li><Link to="/community" className="text-newsweave-muted hover:text-newsweave-primary">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-newsweave-dark mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-newsweave-muted hover:text-newsweave-primary">Privacy</Link></li>
              <li><Link to="/terms" className="text-newsweave-muted hover:text-newsweave-primary">Terms</Link></li>
              <li><Link to="/cookies" className="text-newsweave-muted hover:text-newsweave-primary">Cookies</Link></li>
              <li><Link to="/licenses" className="text-newsweave-muted hover:text-newsweave-primary">Licenses</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-newsweave-muted">
            © {new Date().getFullYear()} Tokenizee. Built on <a href="https://www.arweave.org/" target="_blank" rel="noopener noreferrer" className="text-newsweave-primary hover:underline">Arweave</a> and <a href="https://ao.arweave.dev/" target="_blank" rel="noopener noreferrer" className="text-newsweave-primary hover:underline">AO</a>. All content permanently stored on the permaweb.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
