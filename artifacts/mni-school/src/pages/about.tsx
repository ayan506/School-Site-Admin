import { motion } from "framer-motion";
import { BookOpen, Award, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">About Us</h1>
            <p className="text-2xl text-primary/90 font-serif">हमारे बारे में</p>
            <p className="text-white/70 mt-4 max-w-xl mx-auto">
              Sambhal's premier institution for higher secondary education
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="font-serif text-3xl font-bold text-secondary mb-4">हमारी कहानी</h2>
              <p className="text-lg font-serif text-muted-foreground mb-2">Our Story</p>
              <div className="w-12 h-1 bg-primary rounded mb-6" />
              <p className="text-foreground/80 leading-relaxed mb-4">
                एम.एन.आई. उच्चतर माध्यमिक विद्यालय, संभल — उत्तर प्रदेश के संभल जिले में स्थित एक प्रतिष्ठित शिक्षण संस्थान है।
                यह विद्यालय दशकों से क्षेत्र के बच्चों को गुणवत्तापूर्ण शिक्षा प्रदान कर रहा है।
              </p>
              <p className="text-foreground/80 leading-relaxed mb-4">
                MNI Higher Secondary School, Sambhal is a distinguished educational institution in the Sambhal district of Uttar Pradesh, dedicated to providing quality education and holistic development to students from the region.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                हमारा लक्ष्य प्रत्येक छात्र को शैक्षणिक उत्कृष्टता के साथ-साथ नैतिक मूल्यों और सामाजिक जिम्मेदारी की शिक्षा देना है।
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border">
                <BookOpen className="w-24 h-24 text-primary/40" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">30+</div>
                <div className="text-xs">Years of Excellence</div>
              </div>
            </div>
          </motion.div>

          {/* Mission, Vision, Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: "हमारा लक्ष्य",
                subtitle: "Our Mission",
                content: "प्रत्येक छात्र को उच्च गुणवत्ता की शिक्षा और सर्वांगीण विकास का अवसर प्रदान करना।",
                contentEn: "To provide every student with high-quality education and opportunities for holistic development.",
              },
              {
                icon: Award,
                title: "हमारी दृष्टि",
                subtitle: "Our Vision",
                content: "एक ऐसे समाज का निर्माण जहाँ हर बच्चा शिक्षित, जागरूक और सशक्त हो।",
                contentEn: "To build a society where every child is educated, aware, and empowered.",
              },
              {
                icon: Heart,
                title: "हमारे मूल्य",
                subtitle: "Our Values",
                content: "ज्ञान, सत्य, अनुशासन, सेवा और राष्ट्रप्रेम हमारे विद्यालय की आधारशिला हैं।",
                contentEn: "Knowledge, truth, discipline, service, and patriotism are the cornerstones of our school.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border rounded-xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-secondary mb-1">{item.title}</h3>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-4">{item.subtitle}</p>
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">{item.content}</p>
                <p className="text-xs text-muted-foreground leading-relaxed italic">{item.contentEn}</p>
              </motion.div>
            ))}
          </div>

          {/* Facilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl font-bold text-secondary mb-2 text-center">सुविधाएं</h2>
            <p className="text-center text-muted-foreground mb-10">Our Facilities</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "विज्ञान प्रयोगशाला", en: "Science Lab" },
                { label: "कंप्यूटर कक्ष", en: "Computer Room" },
                { label: "पुस्तकालय", en: "Library" },
                { label: "खेल मैदान", en: "Sports Ground" },
                { label: "सभागार", en: "Auditorium" },
                { label: "स्मार्ट क्लासरूम", en: "Smart Classrooms" },
                { label: "छात्रावास", en: "Hostel" },
                { label: "स्वास्थ्य कक्ष", en: "Health Room" },
              ].map((facility) => (
                <div key={facility.label} className="bg-accent/40 border border-accent rounded-lg p-4 text-center">
                  <div className="font-medium text-accent-foreground text-sm">{facility.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{facility.en}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
