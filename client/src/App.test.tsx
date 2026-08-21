import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('portfolio', () => {
  it('presents the current focus and every released project', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /practical solutions to complicated problems/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Z-SPAN' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit zspan.org/i })).toHaveAttribute('href', 'https://zspan.org');

    const releasedProjects = [
      ['Job Matrix', 'https://jobmatrix.scootsolute.org', 'https://github.com/anitacigawet/Job-Matrix'],
      ['Project Ganymede', 'https://ganymede.scootsolute.org', 'https://github.com/anitacigawet/Project-Ganymede'],
      ['Fractal Framework', 'https://fractal.scootsolute.org', 'https://github.com/anitacigawet/fractal-framework'],
      ['The Cacti', 'https://cacti.scootsolute.org', 'https://github.com/anitacigawet/The-Cacti'],
      ['PrisonBreak', 'https://prisonbreak.scootsolute.org', 'https://github.com/anitacigawet/PrisonBreak'],
      ['Arizona Basin Monitor', 'https://water.scootsolute.org', 'https://github.com/anitacigawet/Water_Dashboard'],
      ['Who Runs Arizona', 'https://whorunsarizona.scootsolute.org', 'https://github.com/anitacigawet/Who-Runs-Arizona'],
    ];

    for (const [title, showcase, source] of releasedProjects) {
      const card = screen.getByRole('heading', { name: title }).closest('article');
      expect(card).not.toBeNull();
      expect(within(card!).getByRole('link', { name: 'View showcase' })).toHaveAttribute('href', showcase);
      expect(within(card!).getByRole('link', { name: 'See the code here' })).toHaveAttribute('href', source);
    }

    expect(screen.queryByRole('heading', { name: /the tool comes after the understanding/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /systems builder/i })).not.toBeInTheDocument();
    expect(screen.getByText(/thank you for reading/i)).toBeInTheDocument();
  });

  it('keeps the water prototype boundary visible', () => {
    render(<App />);
    expect(screen.getByText(/demonstration data only/i)).toBeInTheDocument();
  });
});
