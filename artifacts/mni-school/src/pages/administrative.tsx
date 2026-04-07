import { useListStaff } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { UserCircle2 } from "lucide-react";

export default function Administrative() {
  const { data: staff, isLoading } = useListStaff();

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Administration</h1>
            <p className="text-2xl text-primary/90 font-serif">प्रशासन</p>
            <p className="text-white/70 mt-4">Meet the team leading our institution</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-secondary mb-2">हमारी प्रशासनिक टीम</h2>
            <p className="text-muted-foreground">Our Administrative Team</p>
          </div>

          {isLoading && (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-card border rounded-xl p-6 animate-pulse text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && (!staff || staff.length === 0) && (
            <div className="text-center py-20 text-muted-foreground">
              <UserCircle2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No staff members added yet.</p>
            </div>
          )}

          {staff && staff.length > 0 && (
            <>
              {/* Principal first — full width card */}
              {staff
                .filter(s => s.role.toLowerCase().includes("principal") && !s.role.toLowerCase().includes("vice"))
                .map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="mb-10 max-w-sm mx-auto"
                  >
                    <StaffCard member={member} featured />
                  </motion.div>
                ))}

              {/* Rest of staff */}
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {staff
                  .filter(s => !(s.role.toLowerCase().includes("principal") && !s.role.toLowerCase().includes("vice")))
                  .map((member, i) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      <StaffCard member={member} />
                    </motion.div>
                  ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

interface StaffMember {
  id: number;
  name: string;
  nameHindi: string;
  role: string;
  roleHindi: string;
  photoUrl?: string | null;
  order: number;
}

function StaffCard({ member, featured = false }: { member: StaffMember; featured?: boolean }) {
  return (
    <div className={`bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow text-center ${featured ? "p-10 border-primary/30 border-2" : "p-6"}`}>
      <div className={`rounded-full overflow-hidden mx-auto mb-4 border-4 ${featured ? "w-32 h-32 border-primary/30" : "w-20 h-20 border-border"} flex items-center justify-center bg-muted`}>
        {member.photoUrl ? (
          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <UserCircle2 className={`text-muted-foreground/40 ${featured ? "w-20 h-20" : "w-12 h-12"}`} />
        )}
      </div>
      {featured && <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Principal / प्राचार्य</div>}
      <h3 className={`font-serif font-bold text-foreground ${featured ? "text-xl mb-1" : "text-base mb-1"}`}>{member.name}</h3>
      <p className="text-muted-foreground text-sm mb-2">{member.nameHindi}</p>
      <span className={`inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold`}>
        {member.role}
      </span>
      <p className="text-muted-foreground text-xs mt-1">{member.roleHindi}</p>
    </div>
  );
}
