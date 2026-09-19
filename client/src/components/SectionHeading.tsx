import { motion } from "motion/react";

export default function SectionHeading({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-end justify-between gap-6"
    >
      <div>
        <p className="eyebrow mb-3">
          <span className="text-accent">{index}</span> / {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      <div className="mb-3 hidden h-px flex-1 bg-line sm:block" />
    </motion.div>
  );
}
