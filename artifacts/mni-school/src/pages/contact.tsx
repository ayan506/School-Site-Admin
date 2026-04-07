import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
            <p className="text-2xl text-primary/90 font-serif">संपर्क करें</p>
            <p className="text-white/70 mt-4">हम आपकी सेवा में सदैव तत्पर हैं</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl font-bold text-secondary mb-2">संपर्क जानकारी</h2>
              <p className="text-muted-foreground mb-8">Contact Information</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">पता / Address</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      एम.एन.आई. उच्चतर माध्यमिक विद्यालय<br />
                      MNI Higher Secondary School<br />
                      संभल, उत्तर प्रदेश<br />
                      Sambhal, Uttar Pradesh — 244302
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">फोन / Phone</h3>
                    <p className="text-muted-foreground text-sm">+91 XXXXX XXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">ईमेल / Email</h3>
                    <p className="text-muted-foreground text-sm">info@mnischool.edu.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">कार्यालय समय / Office Hours</h3>
                    <p className="text-muted-foreground text-sm">
                      सोमवार – शनिवार: 8:00 AM – 2:00 PM<br />
                      Mon – Sat: 8:00 AM – 2:00 PM<br />
                      रविवार: बंद / Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map + Message Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl font-bold text-secondary mb-2">संदेश भेजें</h2>
              <p className="text-muted-foreground mb-6">Send a Message</p>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will get back to you soon."); }}>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    नाम / Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ईमेल / Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    विषय / Subject
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Subject of your message"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    संदेश / Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full border rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  संदेश भेजें / Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
