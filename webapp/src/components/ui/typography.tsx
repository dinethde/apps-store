import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-h1',
      'h1-medium': 'text-h1-medium',
      h2: 'text-h2',
      'h2-medium': 'text-h2-medium',
      h3: 'text-h3',
      'h3-medium': 'text-h3-medium',
      h4: 'text-h4',
      'h4-medium': 'text-h4-medium',
      h5: 'text-h5',
      'h5-medium': 'text-h5-medium',
      p: 'text-p',
      'p-medium': 'text-p-medium',
      'p-m': 'text-p-m',
      'p-m-medium': 'text-p-m-medium',
      'p-s': 'text-p-s',
      'p-s-medium': 'text-p-s-medium',
      'p-xs': 'text-p-xs',
      'p-xs-medium': 'text-p-xs-medium',
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
