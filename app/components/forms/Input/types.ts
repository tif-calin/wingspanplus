import type { InputHTMLAttributes } from 'react';

export type HtmlInputAttributes<
  InputType extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  RequiredFields extends keyof InputType
> = InputHTMLAttributes<InputType> & Pick<Required<InputType>, RequiredFields>;
