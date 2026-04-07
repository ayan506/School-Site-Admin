import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Volume2, VolumeX, Menu, X, UserCircle } from "lucide-react";
import schoolSong from "@assets/Ilm_Ka_Naya_Safar_1775591762297.mp3";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const isDarkNav = location.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/favicon.svg" alt="MNI Logo" className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight text-primary">MNI Higher Secondary</span>
              <span className="text-xs text-secondary-foreground bg-secondary px-1 rounded inline-block w-fit">एम.एन.आई. उच्चतर माध्यमिक</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
            <Link href="/admin">
              <Button variant="outline" size="sm" className="ml-4 flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> Admin
              </Button>
            </Link>
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4">
            <NavLinks onClick={() => setIsMenuOpen(false)} />
            <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full mt-2">Admin Portal</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 border-t-4 border-primary">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4 text-white">MNI Higher Secondary School</h3>
            <p className="text-sm opacity-80">एम.एन.आई. उच्चतर माध्यमिक विद्यालय, संभल</p>
            <p className="text-sm mt-4 opacity-80">Dedicated to excellence in education and character building since our founding.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
              <Link href="/administrative" className="hover:text-primary transition-colors">Administration</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Contact Info</h4>
            <address className="not-italic text-sm opacity-80 flex flex-col gap-2">
              <p>Sambhal, Uttar Pradesh</p>
              <p>India</p>
              <p className="mt-2">Email: info@mnischool.edu.in</p>
            </address>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/20 text-center text-sm opacity-60">
          &copy; {new Date().getFullYear()} MNI Higher Secondary School. All rights reserved.
        </div>
      </footer>

      {/* Audio Player */}
      <AudioPlayer />
    </div>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const [location] = useLocation();
  
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Blog" },
    { href: "/administrative", label: "Administration" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {links.map(link => (
        <Link key={link.href} href={link.href} onClick={onClick}>
          <span className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-foreground"}`}>
            {link.label}
          </span>
        </Link>
      ))}
    </>
  );
}

function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const startedRef = useRef(false);

  const startPlaying = () => {
    if (startedRef.current || !audioRef.current) return;
    audioRef.current.volume = 1;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      startedRef.current = true;
    }).catch(() => {});
  };

  useEffect(() => {
    // Try immediate autoplay
    if (audioRef.current) {
      audioRef.current.volume = 1;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        startedRef.current = true;
      }).catch(() => {
        // Browser blocked autoplay — start on first interaction
        const events = ["click", "touchstart", "keydown", "scroll"];
        const handler = () => {
          startPlaying();
          events.forEach(e => document.removeEventListener(e, handler));
        };
        events.forEach(e => document.addEventListener(e, handler, { once: true, passive: true }));
      });
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 1;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        startedRef.current = true;
      }).catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={togglePlay}
        variant="default"
        size="icon"
        title={isPlaying ? "Stop music" : "Play music"}
        className="rounded-full w-12 h-12 shadow-xl bg-primary hover:bg-primary/90 text-white"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>
      <audio ref={audioRef} src={schoolSong} loop />
    </div>
  );
}
