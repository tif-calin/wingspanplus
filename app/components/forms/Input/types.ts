import type { InputHTMLAttributes } from 'react';

export type HtmlInputAttributes<
  InputType extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  RequiredFields extends keyof InputType
> = InputHTMLAttributes<InputType> & Pick<Required<InputType>, RequiredFields>;

export type InputProps = {
  /** Label for the input field */
  label: string;
  /**
   * How many columns (out of 12) the input should span.
   * @default 12
   */
  gridSpan?: number;
  /** Success state turns label text green. */
  status?: 'disabled' | 'error' | 'success';
} & (
  | ({ kind: 'number' | 'text'; } & HtmlInputAttributes<HTMLInputElement, 'name' | 'type'>)
  | ({ kind: 'select'; } & HtmlInputAttributes<HTMLSelectElement, 'name'>)
  | ({ kind: 'textarea'; } & HtmlInputAttributes<HTMLTextAreaElement, 'name'>)
);
