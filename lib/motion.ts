/** Central motion tokens. Keep in sync with the --duration-* and --ease-* CSS tokens. */
export const ease = {
  brand: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  fast: 0.18,
  standard: 0.38,
  entrance: 0.8,
  cinematic: 1.8,
};

export const transition = {
  fast: { duration: duration.fast, ease: ease.brand },
  standard: { duration: duration.standard, ease: ease.brand },
  entrance: { duration: duration.entrance, ease: ease.brand },
};
