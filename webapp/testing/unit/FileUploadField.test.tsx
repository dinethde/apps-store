// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileUploadField } from '@/views/admin/components/fields/FileUploadField'
import { createAppFormSchema } from '@/views/admin/create-app/createAppSchema'
import type { CreateAppFormValues } from '@/views/admin/create-app/createAppSchema'

// Everything the create-app schema needs, so the icon is the only field
// standing between the form and a valid state.
const VALID_EXCEPT_ICON = {
  name: 'Repro App',
  url: 'https://example.com',
  version: '1.0.0',
  description: 'A description long enough to pass validation',
  tagline: '',
  tagIds: ['tag-1'],
  userGroupIds: ['grp-1'],
  icon: undefined,
  status: false,
}

function Harness() {
  const form = useForm<CreateAppFormValues>({
    resolver: zodResolver(createAppFormSchema([])),
    defaultValues: VALID_EXCEPT_ICON,
    mode: 'onBlur',
  })

  return (
    <>
      <FileUploadField control={form.control} name="icon" label="App Icon" />
      <output data-testid="is-valid">{String(form.formState.isValid)}</output>
    </>
  )
}

function svgFile() {
  return new File(['<svg xmlns="http://www.w3.org/2000/svg" />'], 'icon.svg', {
    type: 'image/svg+xml',
  })
}

afterEach(() => cleanup())

describe('FileUploadField', () => {
  // The field commits on selection and never blurs on its own, so in a form
  // using mode: 'onBlur' react-hook-form would otherwise skip revalidation
  // and leave formState.isValid stale at false.
  it('marks the form valid once a valid icon is selected', async () => {
    render(<Harness />)

    const input = screen.getByLabelText('App Icon')
    await waitFor(() =>
      expect(screen.getByTestId('is-valid').textContent).toBe('false'),
    )

    fireEvent.change(input, { target: { files: [svgFile()] } })

    await waitFor(() =>
      expect(screen.getByTestId('is-valid').textContent).toBe('true'),
    )
    expect(screen.getByText('icon.svg')).toBeTruthy()
  })

  it('marks the form invalid again when the icon is removed', async () => {
    render(<Harness />)

    fireEvent.change(screen.getByLabelText('App Icon'), {
      target: { files: [svgFile()] },
    })
    await waitFor(() =>
      expect(screen.getByTestId('is-valid').textContent).toBe('true'),
    )

    fireEvent.click(screen.getByLabelText('Remove file'))

    await waitFor(() =>
      expect(screen.getByTestId('is-valid').textContent).toBe('false'),
    )
  })
})
