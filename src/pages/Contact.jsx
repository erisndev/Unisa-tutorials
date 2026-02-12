import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition, FadeIn, FadeInUp } from "../components/motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <PageTransition>
      <section className="page-hero">
        <div className="container section-sm">
          <FadeInUp>
            <span className="badge-primary mb-4">Contact</span>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Get in touch
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Have a question about courses, tutorials, or pricing? Send us a
              message and we'll respond as soon as possible.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <FadeInUp delay={0.25} className="lg:col-span-2">
              <div className="card p-6 lg:p-8">
                {!sent ? (
                  <form onSubmit={onSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <input
                          className="input mt-1.5"
                          name="name"
                          value={form.name}
                          onChange={onChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                          className="input mt-1.5"
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={onChange}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        className="textarea mt-1.5 min-h-[160px]"
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <button className="btn-primary w-full" type="submit">
                      Send message
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/10 text-3xl mb-6"
                    >
                      ✉️
                    </motion.div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Message sent!
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      We'll reply to{" "}
                      <span className="font-medium text-foreground">
                        {form.email}
                      </span>{" "}
                      as soon as possible.
                    </p>
                    <button
                      className="btn-outline mt-6"
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setForm({ name: "", email: "", message: "" });
                      }}
                    >
                      Send another message
                    </button>
                  </div>
                )}
              </div>
            </FadeInUp>

            <div className="space-y-6">
              <FadeInUp delay={0.3}>
                <div className="card p-6">
                  <h3 className="text-sm font-semibold">Email & Phone</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Email
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        support@erisn.example
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Phone
                      </div>
                      <div className="mt-1 text-sm font-medium">+27 11 123 4567</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Hours
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        Mon–Fri, 09:00–17:00
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.35}>
                <div className="card p-6">
                  <h3 className="text-sm font-semibold">Location</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add a Google Maps embed here.
                  </p>
                  <div className="mt-4 grid h-44 place-items-center rounded-xl border-2 border-dashed bg-muted/30 text-sm text-muted-foreground">
                    📍 Map placeholder
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
