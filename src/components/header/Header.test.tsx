import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('<Header />', () => {
  it('should display <h1> tag with "Recruitment Task" text written in it.', () => {
    render(<Header />);

    const headingElement = screen.getByRole('heading', {
      name: 'Recruitment Task',
    });

    expect(headingElement).toBeInTheDocument();
  });
});
