import { twMerge } from "tailwind-merge";

export enum VARIANTS {
  H1 = "text-lg text-elephant font-semibold",
  H1_BIG = "text-3xl text-elephant font-bold",
  H1_BIG2 = "text-5xl text-elephant font-bold",
  H2 = "text-base text-elephant font-semibold",
  // TODO: Remove typography component and use tailwind components instead
  H3 = "text-base text-elephant h3",
  BODY = "text-base text-elephant",
  BODY2 = "text-sm text-elephant-300",
  BODY3 = "text-sm text-elephant-300 font-semibold tracking-wider",
  BODY4 = "text-sm text-gray-400",
  BODY5 = "header-small-caps",
  LABEL = "text-sm text-elephant font-semibold",
}

interface TypographyProps {
  variant?: VARIANTS;
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
  [x: string]: any;
}

const mapVariantToTag: { [x: string]: keyof JSX.IntrinsicElements } = {
  [VARIANTS.H1]: "h1",
  [VARIANTS.H2]: "h2",
  [VARIANTS.H3]: "h3",
  [VARIANTS.H1_BIG]: "h1",
  [VARIANTS.H1_BIG2]: "h1",
  [VARIANTS.BODY]: "p",
  [VARIANTS.BODY2]: "p",
  [VARIANTS.BODY3]: "p",
  [VARIANTS.BODY4]: "p",
  [VARIANTS.BODY5]: "p",
  [VARIANTS.LABEL]: "p",
};

const Typography = ({
  variant = VARIANTS.BODY,
  component,
  children,
  className,
  ...props
}: TypographyProps) => {
  const Component = component || mapVariantToTag[variant];

  const classes = twMerge(variant, className);

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Typography;
