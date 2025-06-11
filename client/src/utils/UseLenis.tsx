import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchInertiaMultiplier: 2,
    });

    // Add exclusion for the links container
    lenis.on('scroll', () => {
      const linksContainer = document.querySelector('.custom-scrollbar');
      if (linksContainer) {
        const rect = linksContainer.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
          lenis.stop();
        } else {
          lenis.start();
        }
      }
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
};
