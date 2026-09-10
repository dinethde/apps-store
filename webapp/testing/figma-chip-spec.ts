/**
 * The Figma source of truth for the `Tag` component set
 * (file cDTpWX5NpLSFrMMUR0UUJz, node 596:7822), transcribed from
 * `get_design_context` and `get_variable_defs`.
 *
 * Colours are the resolved values of the design variables the design binds to,
 * which are the same values `src/styles/design-tokens.css` exports — so an
 * assertion failure means the component reached for the wrong token, not that
 * the token itself drifted.
 */
export const FIGMA_COLORS = {
  /** text/neutral/p2/active */
  textNeutralP2Active: 'rgb(54, 70, 89)',
  /** bg/surface/neutral/light/active */
  surfaceNeutralLightActive: 'rgb(255, 255, 255)',
  /** bg/surface/neutral/main/active */
  surfaceNeutralMainActive: 'rgb(249, 250, 251)',
  /** bg/surface/neutral/main/hover */
  surfaceNeutralMainHover: 'rgb(240, 243, 244)',
  /** bg/outline/neutral/light/active */
  outlineNeutralLightActive: 'rgb(224, 231, 235)',
  /** bg/outline/secondary/light/active and .../hover — both resolve to #80bdff */
  outlineSecondaryLight: 'rgb(128, 189, 255)',
  transparent: 'rgba(0, 0, 0, 0)',
} as const

export type ChipSpec = {
  /** The `data-testid` rendered by the /dev/chips gallery. */
  testId: string
  /** The variant name this Chip exposes. */
  variant: 'solid' | 'outline' | 'pill'
  /** The variant name Figma ships it under, for traceability. */
  figmaVariant: string
  figmaNodeId: string
  label: string
  backgroundColor: string
  borderWidth: string
  borderColor: string
  borderRadius: string
  /** top right bottom left */
  padding: string
  fontSize: string
  fontWeight: string
  letterSpacing: string
  color: string
  /** Present only on the removable chip. */
  gap?: string
}

export const CHIP_SPECS: Array<ChipSpec> = [
  {
    testId: 'chip-pill',
    variant: 'pill',
    figmaVariant: 'Property 1=Variant3',
    figmaNodeId: '596:7825',
    label: 'Favourites',
    backgroundColor: FIGMA_COLORS.surfaceNeutralLightActive,
    borderWidth: '1px',
    borderColor: FIGMA_COLORS.outlineSecondaryLight,
    borderRadius: '22px',
    padding: '4px 12px 4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.24px',
    color: FIGMA_COLORS.textNeutralP2Active,
  },
  {
    testId: 'chip-outline',
    variant: 'outline',
    figmaVariant: 'Property 1=Default',
    figmaNodeId: '544:14047',
    label: 'wso2-everyone',
    backgroundColor: FIGMA_COLORS.surfaceNeutralMainActive,
    borderWidth: '1px',
    borderColor: FIGMA_COLORS.outlineNeutralLightActive,
    borderRadius: '4px',
    padding: '4px 8px 4px 8px',
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.24px',
    color: FIGMA_COLORS.textNeutralP2Active,
  },
  {
    testId: 'chip-solid-removable',
    variant: 'solid',
    figmaVariant: 'Property 1=Variant5',
    figmaNodeId: '702:19117',
    label: 'Tag',
    backgroundColor: FIGMA_COLORS.surfaceNeutralMainHover,
    borderWidth: '0px',
    borderColor: FIGMA_COLORS.transparent,
    borderRadius: '4px',
    padding: '3px 6px 3px 6px',
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.24px',
    color: FIGMA_COLORS.textNeutralP2Active,
    gap: '4px',
  },
  {
    testId: 'chip-solid',
    variant: 'solid',
    figmaVariant: 'Property 1=Variant6',
    figmaNodeId: '830:14016',
    label: 'Tag',
    backgroundColor: FIGMA_COLORS.surfaceNeutralMainHover,
    borderWidth: '0px',
    borderColor: FIGMA_COLORS.transparent,
    borderRadius: '4px',
    padding: '3px 6px 3px 6px',
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.24px',
    color: FIGMA_COLORS.textNeutralP2Active,
  },
]

/**
 * The remove control deliberately departs from the design: Figma draws a 6px
 * cross, which is far too small a hit target, so the component renders it at
 * 12px. The chip's fill, padding and type still match the design exactly — it
 * is only the cross, and the width the wider cross implies, that differ.
 */
export const REMOVE_ICON = {
  size: 12,
  figmaSize: 6,
} as const

/**
 * Figma's hover twins. Both change exactly one property from their resting
 * variant, so the assertions stay scoped to that property.
 */
export const HOVER_SPECS = [
  {
    testId: 'chip-pill',
    figmaVariant: 'Property 1=hover',
    figmaNodeId: '596:7828',
    property: 'backgroundColor',
    expected: FIGMA_COLORS.transparent,
  },
  {
    testId: 'chip-outline',
    figmaVariant: 'Property 1=Variant2',
    figmaNodeId: '596:7823',
    property: 'backgroundColor',
    expected: FIGMA_COLORS.surfaceNeutralMainHover,
  },
] as const
