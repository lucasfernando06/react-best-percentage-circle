import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { PercentageCircle } from '../PercentageCircle';
import { IColorInterval } from 'src/types';

const intervals: IColorInterval[] = [
  {
    isActive: (value: number) => value < 15,
    color: 'rgb(0, 0, 0)',
  },
  {
    isActive: (value: number) => value >= 15,
    color: 'rgb(255, 255, 255)',
  },
];

const _userEvent = userEvent.setup({
  delay: null,
});

describe('Testing package default behaviour', () => {
  it('Should render basic circle without errors', () => {
    render(<PercentageCircle />);

    const svgElement = screen.getByTestId('svg');
    const primaryCircleElement = screen.getByTestId('primary-circle');
    const secondaryCircleElement = screen.getByTestId('secondary-circle');

    expect(svgElement).toBeInTheDocument();
    expect(primaryCircleElement).toBeInTheDocument();
    expect(secondaryCircleElement).toBeInTheDocument();
  });

  it('Should render with default size', () => {
    render(<PercentageCircle />);

    const primaryCircleElement = screen.getByTestId('primary-circle');
    const secondaryCircleElement = screen.getByTestId('secondary-circle');

    expect(primaryCircleElement).toHaveAttribute('cx', '150');
    expect(primaryCircleElement).toHaveAttribute('cy', '150');
    expect(secondaryCircleElement).toHaveAttribute('cx', '150');
    expect(secondaryCircleElement).toHaveAttribute('cy', '150');
  });

  it('Should render with default thickness', () => {
    render(<PercentageCircle />);

    const primaryCircleElement = screen.getByTestId('primary-circle');
    const secondaryCircleElement = screen.getByTestId('secondary-circle');

    expect(primaryCircleElement).toHaveAttribute('stroke-width', '10');
    expect(secondaryCircleElement).toHaveAttribute('stroke-width', '10');
  });

  it('Should render with default percentage and content', () => {
    render(<PercentageCircle />);

    const displayText = screen.getByTestId('display-text');
    expect(displayText).toHaveTextContent('0%');

    const primaryCircleElement = screen.getByTestId('primary-circle');
    expect(primaryCircleElement).toHaveAttribute('aria-valuenow', '0');
  });

  it('Should render with default primary color', () => {
    render(<PercentageCircle />);

    const primaryCircleElement = screen.getByTestId('primary-circle');
    const style = window.getComputedStyle(primaryCircleElement);

    expect(style.color).toBe('rgb(123, 104, 238)');
  });

  it('Should render with default secondary color', () => {
    render(<PercentageCircle />);

    const secondaryCircleElement = screen.getByTestId('secondary-circle');
    const style = window.getComputedStyle(secondaryCircleElement);

    expect(style.color).toBe('rgb(237, 241, 239)');
  });

  it('Should render with default primary shadow', () => {
    render(<PercentageCircle />);

    const primaryCircleElement = screen.getByTestId('primary-circle');
    const style = window.getComputedStyle(primaryCircleElement);

    expect(style.filter).toBe('drop-shadow(0 0 2px rgb(123, 104, 238))');
  });
});

describe('Testing package props', () => {
  it('Should render with custom size', () => {
    const size = 200;

    render(<PercentageCircle size={size} />);

    const primaryCircleElement = screen.getByTestId('primary-circle');
    const secondaryCircleElement = screen.getByTestId('secondary-circle');

    const sizeString = `${size}`;

    expect(primaryCircleElement).toHaveAttribute('cx', sizeString);
    expect(primaryCircleElement).toHaveAttribute('cy', sizeString);
    expect(secondaryCircleElement).toHaveAttribute('cx', sizeString);
    expect(secondaryCircleElement).toHaveAttribute('cy', sizeString);
  });

  it('Should render with custom thickness', () => {
    const thickness = 20;

    render(<PercentageCircle thickness={thickness} />);

    const primaryCircleElement = screen.getByTestId('primary-circle');
    const secondaryCircleElement = screen.getByTestId('secondary-circle');

    const thicknessString = `${thickness}`;

    expect(primaryCircleElement).toHaveAttribute(
      'stroke-width',
      thicknessString
    );
    expect(secondaryCircleElement).toHaveAttribute(
      'stroke-width',
      thicknessString
    );
  });

  it('Should render with custom content', async () => {
    const fn = vi.fn();

    const contentToDisplay = (percentage: number) => (
      <div onClick={fn} data-testid="custom-content">
        {percentage}%...
      </div>
    );

    render(
      <PercentageCircle percentage={50} contentToDisplay={contentToDisplay} />
    );

    const contentElement = screen.getByTestId('custom-content');
    expect(contentElement).toBeInTheDocument();

    await _userEvent.click(contentElement);

    expect(fn).toHaveBeenCalled();

    const displayText = screen.getByTestId('display-text');
    expect(displayText).toHaveTextContent('50%...');

    const primaryCircleElement = screen.getByTestId('primary-circle');
    expect(primaryCircleElement).toHaveAttribute('aria-valuenow', '50');
  });

  it('Should render with custom primary color', () => {
    const color = 'rgb(0, 0, 0)';

    render(<PercentageCircle primaryColor={color} />);

    const primaryCircleElement = screen.getByTestId('primary-circle');
    const style = window.getComputedStyle(primaryCircleElement);

    expect(style.color).toBe(color);
  });

  it('Should render with default secondary color', () => {
    const color = 'rgb(0, 0, 0)';

    render(<PercentageCircle secondaryColor={color} />);

    const secondaryCircleElement = screen.getByTestId('secondary-circle');
    const style = window.getComputedStyle(secondaryCircleElement);

    expect(style.color).toBe(color);
  });

  it('Should render with custom primary shadow', () => {
    const shadow = 'drop-shadow(0 0 5px rgb(123, 104, 238))';
    render(<PercentageCircle primaryShadowFilter={() => shadow} />);

    const primaryCircleElement = screen.getByTestId('primary-circle');
    const style = window.getComputedStyle(primaryCircleElement);

    expect(style.filter).toBe(shadow);
  });

  it('Should render with custom secondary shadow', () => {
    const shadow = 'drop-shadow(0 0 5px rgb(123, 104, 238))';
    render(<PercentageCircle secondaryShadowFilter={() => shadow} />);

    const secondaryCircleElement = screen.getByTestId('secondary-circle');
    const style = window.getComputedStyle(secondaryCircleElement);

    expect(style.filter).toBe(shadow);
  });

  it('Should render with custom color intervals', () => {
    const { rerender } = render(
      <PercentageCircle percentage={10} colorIntervals={intervals} />
    );

    let primaryCircleElement = screen.getByTestId('primary-circle');
    let style = window.getComputedStyle(primaryCircleElement);

    expect(style.color).toBe('rgb(0, 0, 0)');

    rerender(<PercentageCircle percentage={80} colorIntervals={intervals} />);

    primaryCircleElement = screen.getByTestId('primary-circle');
    style = window.getComputedStyle(primaryCircleElement);

    expect(style.color).toBe('rgb(255, 255, 255)');
  });

  it('Should render with automatic increment', async () => {
    vi.useFakeTimers();

    render(
      <PercentageCircle
        percentage={20}
        automaticIcrementDelayMs={1000}
        useAutomaticIcrement
      />
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    let displayText = screen.getByTestId('display-text');
    let primaryCircleElement = screen.getByTestId('primary-circle');

    expect(primaryCircleElement).toHaveAttribute('aria-valuenow', '10');
    expect(displayText).toHaveTextContent('10%');

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    displayText = screen.getByTestId('display-text');
    primaryCircleElement = screen.getByTestId('primary-circle');

    expect(primaryCircleElement).toHaveAttribute('aria-valuenow', '20');
    expect(displayText).toHaveTextContent('20%');

    // keeps 20

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    displayText = screen.getByTestId('display-text');
    primaryCircleElement = screen.getByTestId('primary-circle');

    expect(primaryCircleElement).toHaveAttribute('aria-valuenow', '20');
    expect(displayText).toHaveTextContent('20%');

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('Should render custom content on hover', async () => {
    const contentToDisplay = (percentage: number) => (
      <div data-testid="custom-content">{percentage}%!</div>
    );

    const contentToDisplayOnHover = (percentage: number) => (
      <div data-testid="custom-content-hover">Hovering {percentage}%!</div>
    );

    render(
      <PercentageCircle
        percentage={45}
        contentToDisplay={contentToDisplay}
        contentToDisplayOnHover={contentToDisplayOnHover}
      />
    );

    let contentElement = screen.queryByTestId('custom-content');
    let contentElementOnHover = screen.queryByTestId('custom-content-hover');

    expect(contentElement).toBeInTheDocument();
    expect(contentElement).toHaveTextContent('45%!');
    expect(contentElementOnHover).not.toBeInTheDocument();

    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();

    await _userEvent.hover(container);

    contentElement = screen.queryByTestId('custom-content');
    contentElementOnHover = screen.queryByTestId('custom-content-hover');

    expect(contentElementOnHover).toBeInTheDocument();
    expect(contentElementOnHover).toHaveTextContent('Hovering 45%!');
    expect(contentElement).not.toBeInTheDocument();

    await _userEvent.unhover(container);

    contentElement = screen.queryByTestId('custom-content');
    contentElementOnHover = screen.queryByTestId('custom-content-hover');

    expect(contentElement).toBeInTheDocument();
    expect(contentElement).toHaveTextContent('45%!');
    expect(contentElementOnHover).not.toBeInTheDocument();
  });

  it('Should render with custom cursor', () => {
    render(<PercentageCircle cursor="pointer" />);

    const container = screen.getByTestId('container');
    const style = window.getComputedStyle(container);

    expect(style.cursor).toBe('pointer');
  });

  it('Should render with custom functions', async () => {
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    render(
      <PercentageCircle
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );

    const container = screen.getByTestId('container');
    await _userEvent.click(container);

    expect(onClick).toHaveBeenCalled();

    await _userEvent.hover(container);

    expect(onMouseEnter).toHaveBeenCalled();

    await _userEvent.unhover(container);

    expect(onMouseLeave).toHaveBeenCalled();
  });
});

describe('Testing integrations', () => {
  it('Should render with automatic increment and color intervals.', async () => {
    vi.useFakeTimers();

    render(
      <PercentageCircle
        percentage={20}
        automaticIcrementDelayMs={1000}
        useAutomaticIcrement
        colorIntervals={intervals}
      />
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    let primaryCircleElement = screen.getByTestId('primary-circle');
    let style = window.getComputedStyle(primaryCircleElement);

    expect(style.color).toBe('rgb(0, 0, 0)');

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    primaryCircleElement = screen.getByTestId('primary-circle');
    style = window.getComputedStyle(primaryCircleElement);

    expect(style.color).toBe('rgb(255, 255, 255)');

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
});
