declare module "react-native-web-lottie" {
  import React from "react";
  import type {
    Animated,
    StyleProp,
    ViewStyle,
    LayoutChangeEvent,
  } from "react-native";
  /**
   * Serialized animation as generated from After Effects
   */
  interface AnimationObject {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    nm: string;
    ddd: number;
    assets: never[];
    layers: never[];
  }

  /**
   * Properties of the AnimatedLottieView component
   */
  export interface AnimatedLottieViewProps {
    /**
     * The source of animation. Can be referenced as a local asset by a string, or remotely
     * with an object with a `uri` property, or it can be an actual JS object of an
     * animation, obtained (for example) with something like
     * `require('../path/to/animation.json')`
     */
    source: string | AnimationObject | { uri: string };

    /**
     * A number between 0 and 1, or an `Animated` number between 0 and 1. This number
     * represents the normalized progress of the animation. If you update this prop, the
     * animation will correspondingly update to the frame at that progress value. This
     * prop is not required if you are using the imperative API.
     */
    progress?: number | Animated.Value | Animated.AnimatedInterpolation;

    /**
     * The speed the animation will progress. This only affects the imperative API. The
     * default value is 1.
     */
    speed?: number;

    /**
     * The duration of the animation in ms. Takes precedence over speed when set.
     * This only works when source is an actual JS object of an animation.
     */
    duration?: number;

    /**
     * A boolean flag indicating whether or not the animation should loop.
     */
    loop?: boolean;

    /**
     * Style attributes for the view, as expected in a standard `View`:
     * http://facebook.github.io/react-native/releases/0.39/docs/view.html#style
     * CAVEAT: border styling is not supported.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * A boolean flag indicating whether or not the animation should start automatically when
     * mounted. This only affects the imperative API.
     */
    autoPlay?: boolean;

    /**
     * A boolean flag indicating whether or not the animation should size itself automatically
     * according to the width in the animation's JSON. This only works when source is an actual
     * JS object of an animation.
     */
    autoSize?: boolean;
  }

  /**
   * View hosting the lottie animation. In order to successfully import this definition in
   * your typescript file, you need to import the view as:
   *
   * `import LottieView = require("lottie-react-native");`
   *
   * Otherwise the compiler will give you issues and won't work.
   */
  class AnimatedLottieView extends React.Component<
    AnimatedLottieViewProps,
    unknown
  > {
    play(startFrame?: number, endFrame?: number): void;
    reset(): void;
    pause(): void;
    resume(): void;
  }

  // eslint-disable-next-line import/no-default-export
  export default AnimatedLottieView;
}
