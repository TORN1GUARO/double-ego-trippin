'use strict';
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!Element.prototype.animate) return;
  const active = new Set();
  const play = (element, frames, options) => {
    if (!element || preference.matches) return;
    const animation = element.animate(frames, options);
    active.add(animation);
    animation.finished.then(() => active.delete(animation), () => active.delete(animation));
  };
  preference.addEventListener?.('change', () => {
    if (preference.matches) active.forEach(animation => animation.cancel());
  });
  if (!preference.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        play(entry.target, [{opacity: 0, transform: 'translateY(18px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 650, easing: 'cubic-bezier(.2,.65,.3,1)'});
      });
    }, {threshold: .08});
    document.querySelectorAll('.hero-copy, .hero-art, .manifesto-body, .work-heading, .work-rows article, .practice-options, .situation-heading, .situation-grid, .about-portrait, .about-copy, .first-step-grid article, .contact-process, .closing').forEach(element => observer.observe(element));
  }
  document.querySelectorAll('[data-situation]').forEach(button => {
    button.addEventListener('click', () => {
      const panel = document.getElementById('recommendation');
      panel?.getAnimations().forEach(animation => animation.cancel());
      play(panel, [{opacity: .35, transform: 'translateY(7px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 320, easing: 'ease-out'});
    });
  });
  document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) play(detail.querySelector('.story-text, .practice-answer'), [{opacity: 0, transform: 'translateY(-4px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 280, easing: 'ease-out'});
    });
  });
  const dialog = document.getElementById('brief-dialog');
  document.querySelectorAll('#result-cta, #open-brief').forEach(button => {
    button.addEventListener('click', () => play(dialog, [{opacity: 0, transform: 'translateY(12px) scale(.985)'}, {opacity: 1, transform: 'translateY(0) scale(1)'}], {duration: 260, easing: 'ease-out'}));
  });
})();
