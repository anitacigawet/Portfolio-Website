import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

// Use the actual reduced-motion route for deterministic content/navigation tests.
// Full moving geometry and input locks are checked in a real browser.
vi.mock('framer-motion', async (importOriginal) => ({
  ...await importOriginal<typeof import('framer-motion')>(),
  useReducedMotion: () => true,
}));

describe('portfolio', () => {
  it('opens the gated showcase directory on hover and lists every showcase', () => {
    render(<App />);
    const trigger = screen.getByRole('button', { name: 'Showcase directory — open the gates' });
    const gate = trigger.parentElement!;
    const menu = screen.getByRole('navigation', { name: 'Showcase directory' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(within(menu).getAllByRole('link')).toHaveLength(8);
    expect(within(menu).getByRole('link', { name: /Project Ganymede/ })).toHaveAttribute(
      'href',
      'https://ganymede.scootsolute.org',
    );

    fireEvent.mouseEnter(gate);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(gate, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the business card, then presents every project with its original links', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'James Jones' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Z-SPAN' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next card' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open the envelope and read the deck' }));
    expect(screen.getByRole('article', { name: /A note from James/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'james@scootsolute.org' })).toHaveAttribute('href', 'mailto:james@scootsolute.org');

    fireEvent.click(screen.getByRole('button', { name: 'Next card' }));
    expect(screen.getByRole('heading', { name: 'Z-SPAN' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit zspan.org/i })).toHaveAttribute('href', 'https://zspan.org');

    const projects = [
      ['Job Matrix', 'https://jobmatrix.scootsolute.org', 'https://github.com/anitacigawet/Job-Matrix'],
      ['Project Ganymede', 'https://ganymede.scootsolute.org', 'https://github.com/anitacigawet/Project-Ganymede'],
      ['Fractal Framework', 'https://fractal.scootsolute.org', 'https://github.com/anitacigawet/fractal-framework'],
      ['The Cacti', 'https://cacti.scootsolute.org', 'https://github.com/anitacigawet/The-Cacti'],
      ['PrisonBreak', 'https://prisonbreak.scootsolute.org', 'https://github.com/anitacigawet/PrisonBreak'],
      ['Arizona Basin Monitor', 'https://water.scootsolute.org', 'https://github.com/anitacigawet/Water_Dashboard'],
      ['Who Runs Arizona', 'https://whorunsarizona.scootsolute.org', 'https://github.com/anitacigawet/Who-Runs-Arizona'],
    ];
    for (const [title, showcase, source] of projects) {
      fireEvent.click(screen.getByRole('button', { name: 'Next card' }));
      expect(screen.getAllByRole('article')).toHaveLength(1);
      const card = screen.getByRole('heading', { name: title }).closest('article')!;
      expect(within(card).getByRole('link', { name: 'View showcase' })).toHaveAttribute('href', showcase);
      expect(within(card).getByRole('link', { name: 'See the code here' })).toHaveAttribute('href', source);
      if (title === 'PrisonBreak') expect(within(card).getByText('Not legal advice.')).toBeInTheDocument();
      if (title === 'Arizona Basin Monitor') expect(within(card).getByText(/demonstration data only/i)).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole('button', { name: 'Next card' }));
    expect(screen.getByRole('heading', { name: 'Thank you for reading.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next card' })).toBeDisabled();
  });

  it('skips the opening, resets returning cards to their top, and reseals from home', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Skip to selected work' }));
    const details = screen.getByLabelText('Z-SPAN details');
    details.scrollTop = 240;
    fireEvent.scroll(details);
    fireEvent.click(screen.getByRole('button', { name: 'Next card' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous card' }));
    expect(details.scrollTop).toBe(0);
    expect(details).not.toHaveClass('is-scrolled');
    fireEvent.click(screen.getByRole('button', { name: 'Return the cards to the envelope and close it' }));
    expect(screen.getByRole('button', { name: 'Open the envelope and read the deck' })).toBeEnabled();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('routes header arrow keys to the deck while keeping reading keys inside the card', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Skip to selected work' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Next card' }), { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { name: 'Job Matrix' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByLabelText('Job Matrix details'), { key: 'ArrowDown' });
    expect(screen.getByRole('heading', { name: 'Job Matrix' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByLabelText('Job Matrix details'), { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Open the envelope and read the deck' })).toBeEnabled();
  });

  it('finishes reading the final card before closing, and ignores remaining wheel momentum', () => {
    const time = vi.spyOn(performance, 'now').mockReturnValue(1000);
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Skip to selected work' }));
    fireEvent.click(screen.getByRole('button', { name: 'Card 10: Thank you for reading' }));
    const final = screen.getByRole('heading', { name: 'Thank you for reading.' }).closest('.index-card-body')!;
    Object.defineProperties(final, { clientHeight: { value: 200 }, scrollHeight: { value: 400 } });
    fireEvent.wheel(final, { deltaY: 100 });
    expect(screen.getByRole('heading', { name: 'Thank you for reading.' })).toBeInTheDocument();

    final.scrollTop = 200;
    time.mockReturnValue(1300);
    fireEvent.wheel(final, { deltaY: 100 });
    const canvas = document.querySelector('.experience-canvas')!;
    expect(canvas).toHaveAttribute('data-phase', 'sealed');
    time.mockReturnValue(1340);
    fireEvent.wheel(canvas, { deltaY: 100 });
    expect(canvas).toHaveAttribute('data-phase', 'sealed');

    time.mockReturnValue(1700);
    fireEvent.wheel(canvas, { deltaY: 100 });
    expect(screen.getByRole('article', { name: /A note from James/ })).toBeInTheDocument();
    time.mockRestore();
  });

  it('returns the final card to the envelope with an upward swipe or PageDown', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Skip to selected work' }));
    fireEvent.click(screen.getByRole('button', { name: 'Card 10: Thank you for reading' }));
    const final = screen.getByRole('heading', { name: 'Thank you for reading.' });
    fireEvent.touchStart(final, { touches: [{ clientX: 150, clientY: 450 }] });
    fireEvent.touchMove(final, { touches: [{ clientX: 150, clientY: 350 }] });
    fireEvent.touchEnd(final, { touches: [] });
    expect(screen.getByRole('button', { name: 'Open the envelope and read the deck' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Open the envelope and read the deck' }));
    fireEvent.click(screen.getByRole('button', { name: 'Card 10: Thank you for reading' }));
    fireEvent.keyDown(screen.getByRole('heading', { name: 'Thank you for reading.' }), { key: 'PageDown' });
    expect(screen.getByRole('button', { name: 'Open the envelope and read the deck' })).toBeEnabled();
  });
});
