import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Award, Target, Heart, Quote, UserCircle2 } from "lucide-react";

interface Settings {
  founder_name?: string;
  founder_photo?: string;
  founder_bio?: string;
  about_mission?: string;
  about_mission_hindi?: string;
  about_vision?: string;
  about_vision_hindi?: string;
}

export default function About() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const founderBioParagraphs = (settings.founder_bio || "").split("\n\n").filter(Boolean);

  return (
    <div>
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
          {/* Story */}
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
            
              </p>
              <p className="text-foreground/80 leading-relaxed mb-4">
                MNI Higher Secondary School, Sambhal, is built on the noble vision of our founder, Late Mr. Zaheer Ahmad Hashmi. He believed that education is a fundamental right that should be accessible to everyone.
​His Mission & Philosophy
​Inclusive Learning: His primary goal was to educate every child, regardless of their religion, background, or social status.
​Affordable Excellence: He was dedicated to providing quality education at the lowest possible cost, ensuring that financial constraints never stand in the way of a child's future.

                
                "Education is the birthright of every child, and cost should never be the barrier that keeps a student from reaching their full potential." ~ Syed Zaheer Ahmad Hashmi

                Today, we continue to honor his legacy by keeping his dream of "Education for All" alive and accessible.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                संभल स्थित एमएनआई हायर सेकेंडरी स्कूल, हमारे संस्थापक स्वर्गीय श्री जहीर अहमद हाशमी के महान दृष्टिकोण पर आधारित है। उनका मानना था कि शिक्षा एक मौलिक अधिकार है जो सभी के लिए सुलभ होना चाहिए।
उनका मिशन और दर्शन 
समावेशी शिक्षा: उनका प्राथमिक लक्ष्य प्रत्येक बच्चे को शिक्षित करना था, चाहे उनका धर्म, पृष्ठभूमि या सामाजिक स्थिति कुछ भी हो।
किफायती उत्कृष्टता: वे सभी बच्चों को उचित शिक्षा प्रदान करने के लिए समर्पित थे।
किफायती उत्कृष्टता: वे न्यूनतम संभव लागत पर गुणवत्तापूर्ण शिक्षा प्रदान करने के लिए समर्पित थे, यह सुनिश्चित करते हुए कि वित्तीय बाधाएं कभी भी किसी बच्चे के भविष्य के रास्ते में न आएं।

                "शिक्षा प्रत्येक बच्चे का जन्मसिद्ध अधिकार है, और लागत कभी भी वह बाधा नहीं बननी चाहिए जो किसी विद्यार्थी को अपनी पूर्ण क्षमता तक पहुँचने से रोके।" ~ सैयद ज़हीर अहमद हाशमी

                आज हम "सभी के लिए शिक्षा" के उनके सपने को जीवित और सुलभ बनाए रखकर उनकी विरासत का सम्मान करना जारी रखते हैं।

                
                
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border">
                <BookOpen className="w-24 h-24 text-primary/40" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">10+</div>
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
                content: settings.about_mission_hindi || "प्रत्येक छात्र को उच्च गुणवत्ता की शिक्षा और सर्वांगीण विकास का अवसर प्रदान करना।",
                contentEn: settings.about_mission || "To provide every student with high-quality education and opportunities for holistic development.",
              },
              {
                icon: Award,
                title: "हमारी दृष्टि",
                subtitle: "Our Vision",
                content: settings.about_vision_hindi || "एक ऐसे समाज का निर्माण जहाँ हर बच्चा शिक्षित, जागरूक और सशक्त हो।",
                contentEn: settings.about_vision || "To build a society where every child is educated, aware, and empowered.",
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

          {/* Founder Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-secondary mb-2">संस्थापक परिचय</h2>
              <p className="text-muted-foreground">About the Founder</p>
              <div className="w-16 h-1 bg-primary rounded mx-auto mt-4" />
            </div>

            <div className="bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/15 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-40 h-48 rounded-2xl overflow-hidden border-4 border-primary/25 shadow-lg bg-muted flex items-center justify-center">
                    {settings.founder_photo ? (
                      <img
                        src={settings.founder_photo}
                        alt={settings.founder_name || "Founder"}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <UserCircle2 className="w-20 h-20 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="text-center mt-3">
                    <p className="font-serif font-bold text-secondary text-sm">
                      {settings.founder_name || "Late Mr. Zaheer Ahmad Hashmi"}
                    </p>
                    <p className="text-xs text-primary font-medium mt-0.5">Founder</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-4">
                    <Quote className="w-8 h-8 text-primary/30 flex-shrink-0 mt-1" />
                    <h3 className="font-serif text-2xl font-bold text-secondary">
                      About the Founder: {settings.founder_name || "Late Mr. Zaheer Ahmad Hashmi"}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {founderBioParagraphs.length > 0 ? (
                      founderBioParagraphs.map((para, i) => {
                        if (para.startsWith('"') || para.startsWith('\u201c')) {
                          return (
                            <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                              <p className="text-foreground/90 font-medium italic text-sm leading-relaxed">{para}</p>
                            </blockquote>
                          );
                        }
                        const colonIdx = para.indexOf(":");
                        if (colonIdx > 0 && colonIdx < 50) {
                          const heading = para.substring(0, colonIdx);
                          const rest = para.substring(colonIdx + 1).trim();
                          return (
                            <div key={i}>
                              <h4 className="font-semibold text-secondary mb-1">{heading}:</h4>
                              <p className="text-foreground/80 text-sm leading-relaxed">{rest}</p>
                            </div>
                          );
                        }
                        return <p key={i} className="text-foreground/80 text-sm leading-relaxed">{para}</p>;
                      })
                    ) : (
                      <p className="text-muted-foreground text-sm">Founder information will appear here once added by the admin.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

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
              ].map(facility => (
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
