import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'h1',
      'h1-medium': 'h1-medium',
      h2: 'h2',
      'h2-medium': 'h2-medium',
      h3: 'h3',
      'h3-medium': 'h3-medium',
      h4: 'h4',
      'h4-medium': 'h4-medium',
      h5: 'h5',
      'h5-medium': 'h5-medium',
      p: 'p',
      'p-medium': 'p-medium',
      'p-m': 'p-m',
      'p-m-medium': 'p-m-medium',
      'p-s': 'p-s',
      'p-s-medium': 'p-s-medium',
      'p-xs': 'p-xs',
      'p-xs-medium': 'p-xs-medium',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

function Typography({
  as: Comp = 'p',
  variant,
  className,
  ...props
}: React.ComponentProps<'p'> &
  VariantProps<typeof typographyVariants> & {
    as?: React.ElementType
  }) {
  return (
    <Comp
      data-slot="typography"
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
