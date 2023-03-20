import { useEffect, useMemo, useState, useRef } from "react";

import { container, svgContainer, valueContainer } from "./styles";
import {
  IColorInterval,
  IPercentageCircle,
  IPercentageCircleStyle,
} from "./types";

export const PercentageCircle = ({
  size,
  thickness,
  percentage,
  contentToDisplay,
  contentToDisplayOnHover,
  primaryColor,
  secondaryColor,
  colorIntervals,
  strokeLinecap,
  primaryShadowFilter,
  secondaryShadowFilter,
  useAutomaticIcrement,
  automaticIcrementDelayMs,
  onMouseEnter,
  onMouseLeave,
  onClick,
  cursor,
}: IPercentageCircle) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [internalPercentage, setInternalPercentage] = useState<number>(
    !useAutomaticIcrement ? percentage : 0
  );

  useEffect(() => {
    if (!useAutomaticIcrement) return;

    clearInterval(timerRef.current as NodeJS.Timeout);

    timerRef.current = setInterval(() => {
      setInternalPercentage((prev) => prev + 1);
    }, automaticIcrementDelayMs);

    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, []);

  useEffect(() => {
    if (useAutomaticIcrement && internalPercentage === percentage)
      clearInterval(timerRef.current as NodeJS.Timeout);
  }, [internalPercentage]);

  useEffect(() => {
    if (useAutomaticIcrement) return;
    setInternalPercentage(percentage);
  }, [percentage]);

  const circleReference = 2 * Math.PI * ((size - thickness) / 2);

  const circleStyle: IPercentageCircleStyle = useMemo(() => {
    return {
      strokeDasharray: circleReference.toFixed(3),
      strokeDashoffset: `${(
        ((100 - internalPercentage) / 100) *
        circleReference
      ).toFixed(3)}px`,
    };
  }, [circleReference, internalPercentage]);

  const renderCircle = (
    primaryCircle: boolean = false,
    newValue: string = "0",
    colorParams: string = secondaryColor!,
    zIndex: number = 1
  ) => (
    <circle
      data-testid={primaryCircle ? "primary-circle" : "secondary-circle"}
      aria-valuenow={primaryCircle ? internalPercentage : 100}
      cx={size}
      cy={size}
      r={(size - thickness) / 2}
      fill="none"
      strokeWidth={thickness}
      style={{
        stroke: "currentcolor",
        strokeDasharray: circleStyle.strokeDasharray,
        strokeDashoffset: newValue,
        strokeLinecap,
        color: colorParams,
        zIndex,
        filter: primaryCircle
          ? primaryShadowFilter && primaryShadowFilter(colorParams)
          : secondaryShadowFilter && secondaryShadowFilter(colorParams),
      }}
    ></circle>
  );

  const svgViewbox: string = useMemo(() => {
    return `${size / 2} ${size / 2} ${size} ${size}`;
  }, [size]);

  const activeInterval: IColorInterval | undefined | null = useMemo(() => {
    const isUsingIntervals = colorIntervals && colorIntervals.length > 0;
    if (!isUsingIntervals) return null;

    return colorIntervals.find((x) => x.isActive(internalPercentage));
  }, [internalPercentage]);

  const activeColor: string = useMemo(() => {
    if (activeInterval) return activeInterval.color;
    return primaryColor!;
  }, [activeInterval]);

  const handleMouseEnter = () => {
    if (onMouseEnter) onMouseEnter();
    if (contentToDisplayOnHover) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) onMouseLeave();
    if (contentToDisplayOnHover) setIsHovering(false);
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      data-testid="container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        ...container,
        width: size,
        height: size,
        cursor: cursor ?? "",
      }}
    >
      <div style={svgContainer}>
        <svg
          data-testid="svg"
          viewBox={svgViewbox}
          style={{ overflow: "visible" }}
        >
          {renderCircle()}
          {renderCircle(true, circleStyle.strokeDashoffset, activeColor, 2)}
        </svg>
      </div>
      <div data-testid="display-text" style={valueContainer}>
        {isHovering
          ? contentToDisplayOnHover!(internalPercentage, activeInterval)
          : contentToDisplay(internalPercentage, activeInterval)}
      </div>
    </div>
  );
};

const defaultProps: IPercentageCircle = {
  size: 150,
  thickness: 10,
  percentage: 0,
  contentToDisplay: (percentage) => `${percentage}%`,
  primaryColor: "rgb(123, 104, 238)",
  secondaryColor: "rgb(237, 241, 239)",
  strokeLinecap: "round",
  primaryShadowFilter: (color: string) => `drop-shadow(0 0 2px ${color})`,
  useAutomaticIcrement: false,
  automaticIcrementDelayMs: 10,
};

PercentageCircle.defaultProps = defaultProps;
