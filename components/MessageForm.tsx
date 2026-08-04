"use client";

import { forwardRef, useId, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * The enquiry form. One implementation, one place it is used: /contact.
 *
 * It was previously written to serve two frames — this page and a copy inside
 * the docked widget's modal — which is why it was split into a hook and a body
 * with a `layout` prop switching between them. The widget no longer carries a
 * form (see components/MessageWidget.tsx), so the split and the tighter of the
 * two layouts have gone with it, and the form is a single component again.
 *
 * NOTHING IS SENT. This is a demo build with no backend — `output: "export"` in
 * next.config.mjs — so submitting validates the form and then says so outright.
 * No network request, no mailto, nothing stored. See `submit` below.
 */

type Field =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "subject"
  | "message";

const EMPTY: Record<Field, string> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

/** Digits in, (817) 555-0142 out. Formats as far as the digits go. */
function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Validation is deliberately shallow: presence, and an address that could
 * plausibly route. Anything stricter — regex gauntlets for "real" addresses,
 * insisting on a phone number — turns away people who typed something
 * perfectly usable, and a rejected enquiry is worse than a slightly messy one.
 */
function validate(values: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.firstName.trim()) errors.firstName = "Please add your first name.";
  if (!values.lastName.trim()) errors.lastName = "Please add your last name.";
  if (!values.email.trim()) errors.email = "Please add an email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "That doesn't look like an email address.";
  if (values.phone && values.phone.replace(/\D/g, "").length < 10)
    errors.phone = "A phone number needs 10 digits.";
  if (!values.subject.trim()) errors.subject = "Please add a subject.";
  if (!values.message.trim()) errors.message = "Please write a message.";
  return errors;
}

export function MessageForm({ className = "" }: { className?: string }) {
  const [values, setValues] = useState<Record<Field, string>>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const set = (name: Field) => (v: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhone(v) : v,
    }));
    // Clear the error as soon as the field is touched again — leaving it up
    // mid-correction reads as the form arguing with the person filling it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  /** Validate, then say what actually happens: nothing. */
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const order: Field[] = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "subject",
        "message",
      ];
      const first = order.find((f) => found[f]);
      if (first) document.getElementById(fid(first))?.focus();
      return;
    }
    setSubmitted(true);
  }

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
  };

  const frame = `rounded-[4px] border border-ink/12 bg-limestone-pale ${className}`;

  if (submitted) {
    return (
      <div className={frame}>
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-brass-deep/40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-brass-deep"
            >
              <path
                d="M12 8.5v4.5m0 3.2v.1M12 3.5l9 15.5H3l9-15.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="display text-2xl text-ink">Nothing was sent</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              This site is built for demonstration purposes. The form works, but
              it isn&apos;t connected to anything yet — your message has not been
              sent anywhere and no details have been stored.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              To reach the office for real, call{" "}
              <a
                href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
                className="text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
              >
                {site.phone}
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${site.email}`}
                className="break-words text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
              >
                {site.email}
              </a>
              .
            </p>
          </div>
          <button type="button" onClick={reset} className="btn-line mt-1">
            Back to the form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={frame}>
      <form onSubmit={submit} noValidate className="p-6 sm:p-8">
        <fieldset className="border-0 p-0">
          <legend className="label mb-2">Name</legend>
          <div className="grid grid-cols-2 gap-2.5">
            <TextField
              id={fid("firstName")}
              ref={firstFieldRef}
              label="First name"
              required
              value={values.firstName}
              onChange={set("firstName")}
              error={errors.firstName}
              autoComplete="given-name"
            />
            <TextField
              id={fid("lastName")}
              label="Last name"
              required
              value={values.lastName}
              onChange={set("lastName")}
              error={errors.lastName}
              autoComplete="family-name"
            />
          </div>
        </fieldset>

        <div className="mt-3 space-y-3">
          <TextField
            id={fid("email")}
            label="Email address"
            required
            type="email"
            inputMode="email"
            value={values.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
          />
          <TextField
            id={fid("phone")}
            label="Phone"
            type="tel"
            inputMode="tel"
            placeholder="(###) ###-####"
            value={values.phone}
            onChange={set("phone")}
            error={errors.phone}
            autoComplete="tel"
          />
          <TextField
            id={fid("subject")}
            label="Subject"
            required
            value={values.subject}
            onChange={set("subject")}
            error={errors.subject}
          />
          <TextField
            id={fid("message")}
            label="Message"
            required
            multiline
            value={values.message}
            onChange={set("message")}
            error={errors.message}
          />
        </div>

        {/* Above the button, not below it: it is a condition of pressing, so it
            has to be readable before you press. */}
        <p className="mt-4 rounded-[3px] border border-ink/10 bg-limestone/60 p-2.5 text-[10px] leading-snug text-ink-soft">
          {/* The {" "} after the name is load-bearing: JSX trims the leading
              whitespace of a text node that wraps onto the next line, which
              silently printed "Ritchey Realtyto contact you". */}
          By providing your telephone number, you are consenting to allow{" "}
          {site.name}{" "}
          to contact you with informational communications via voice call, AI
          voice call, and/or text message, or similar automated means for real
          estate services. To opt out reply &lsquo;stop&rsquo; at any time, or
          &lsquo;help&rsquo; for assistance. Message and data rates may apply.
          Message frequency may vary.
        </p>

        <button type="submit" className="btn-solid mt-4 w-full">
          Submit
        </button>
      </form>
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  type?: string;
  inputMode?: "email" | "tel" | "text";
  placeholder?: string;
  autoComplete?: string;
};

/**
 * One field, one shape. Errors are wired through aria-describedby and
 * announced, and "(required)" is words rather than a bare asterisk so it
 * survives being read aloud.
 */
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      value,
      onChange,
      error,
      required,
      multiline,
      type = "text",
      inputMode,
      placeholder,
      autoComplete,
    },
    ref
  ) {
    const errorId = `${id}-error`;
    const shared = {
      id,
      value,
      placeholder,
      autoComplete,
      "aria-required": required || undefined,
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": error ? errorId : undefined,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => onChange(e.target.value),
      className: `mt-1 w-full rounded-[3px] border bg-limestone/50 px-3 py-[0.45rem] text-[15px] text-ink transition-colors duration-200 placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-brass-deep/40 ${
        error ? "border-ink/40 bg-limestone-deep/60" : "border-ink/20"
      }`,
    };

    return (
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="block truncate font-mono text-[10px] text-ink-soft"
        >
          {label}
          {required && <span className="ml-1 text-ink-muted">(required)</span>}
        </label>
        {multiline ? (
          <textarea
            {...shared}
            rows={6}
            className={`${shared.className} h-36 resize-y`}
          />
        ) : (
          <input {...shared} ref={ref} type={type} inputMode={inputMode} />
        )}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1 font-mono text-[10px] text-ink"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
