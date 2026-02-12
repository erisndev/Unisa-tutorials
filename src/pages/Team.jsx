import {
  PageTransition,
  FadeInUp,
  StaggerOnMount,
  StaggerItem,
  HoverCard,
} from "../components/motion";

const team = [
  {
    name: "Aisha Khan",
    role: "Lead Instructor",
    bio: "Passionate about turning complex concepts into simple, beginner-friendly lessons.",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Michael Smith",
    role: "Frontend Mentor",
    bio: "Helps learners build modern, responsive interfaces with HTML, CSS, React, and Tailwind.",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Naledi Dlamini",
    role: "Data Science Coach",
    bio: "Guides students through Python, data analysis, and real-world machine learning projects.",
    photo:
      "https://images.unsplash.com/photo-1524503033411-f9fadc2f6e10?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Daniel Johnson",
    role: "Student Success",
    bio: "Keeps learning on track with structured plans, check-ins, and motivation.",
    photo:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80",
  },
];

export default function TeamPage() {
  return (
    <PageTransition>
      <section className="page-hero">
        <div className="container section-sm">
          <FadeInUp>
            <span className="badge-primary mb-4">Our Team</span>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Meet the people behind Erisn
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Experienced tutors and coordinators dedicated to helping UNISA
              students succeed.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <StaggerOnMount className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <HoverCard>
                  <div className="card-interactive overflow-hidden h-full">
                    <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-base font-semibold">{member.name}</h3>
                      <p className="mt-0.5 text-sm text-primary font-medium">
                        {member.role}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerOnMount>
        </div>
      </section>
    </PageTransition>
  );
}
