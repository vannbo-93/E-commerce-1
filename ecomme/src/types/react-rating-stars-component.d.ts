/** @format */

declare module "react-rating-stars-component" {
  import { FC, ReactNode } from "react";

  export interface ReactStarsProps {
    /** Total number of stars. Default: 5 */
    count?: number;
    /** Initial or controlled rating value. Default: 0 */
    value?: number;
    /** Star size in pixels. Default: 15 */
    size?: number;
    /** Allow half-star ratings. Default: false */
    isHalf?: boolean;
    /** Allow interaction (click to rate). Default: true */
    edit?: boolean;
    /** Color of unfilled stars. Default: "gray" */
    color?: string;
    /** Color of filled/active stars. Default: "#ffd700" */
    activeColor?: string;
    /** Custom icon node for an empty star */
    emptyIcon?: ReactNode;
    /** Custom icon node for a half-filled star */
    halfIcon?: ReactNode;
    /** Custom icon node for a filled star */
    filledIcon?: ReactNode;
    /** Character used when no custom icons are given. Default: "★" */
    char?: string;
    /** Enable basic accessibility features. Default: true */
    a11y?: boolean;
    /** Fired whenever the rating changes (edit mode) */
    onChange?: (newValue: number) => void;
    /** Additional class name for the wrapper element */
    className?: string;
  }

  const ReactStars: FC<ReactStarsProps>;
  export default ReactStars;
}
