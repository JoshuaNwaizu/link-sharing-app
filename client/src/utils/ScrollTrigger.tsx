import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ScrollTriggerProps {
  children: React.ReactNode;
}

export const ScrollTrigger: React.FC<ScrollTriggerProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
      }}
    >
      {children}
    </motion.div>
  );
};
