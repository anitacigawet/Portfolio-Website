import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('portfolio', () => {
  it('presents the current focus and every released project', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /useful ways through complicated problems/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Z‑SPAN' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit zspan.org/i })).toHaveAttribute('href', 'https://zspan.org');

    for (const title of ['Job Matrix', 'Project Ganymede', 'Fractal Framework', 'The Cacti', 'PrisonBreak', 'Arizona Basin Monitor', 'Who Runs Arizona']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
  });

  it('keeps the water prototype boundary visible', () => {
    render(<App />);
    expect(screen.getByText(/demonstration data only/i)).toBeInTheDocument();
  });
});
