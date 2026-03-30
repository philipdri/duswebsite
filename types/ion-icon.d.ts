import type * as React from "react";

type IonIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  name?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": IonIconProps;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": IonIconProps;
    }
  }
}

export {};
