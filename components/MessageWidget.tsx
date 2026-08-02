"use client";

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * The message widget: a docked button that opens the enquiry form.
 *
 * Deliberately not a chat. A chat bubble promises someone is on the other end
 * right now, and nobody is.
 *
 * It opens in the middle of the screen rather than docked in a corner. Six
 * fields and a consent notice do not fit a corner card at any size — that
 * version needed an inner scrollbar on desktop and was unreadable on a phone.
 * Centred, the whole form is on screen at once and nothing scrolls.
 *
 * NOTHING IS SENT. This is a demo build with no backend — `output: "export"`
 * in next.config.mjs — so submitting validates the form and then says so
 * outright. No network request, no mailto, nothing stored. See `submit`.
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

/** Fraction of the scrollable distance that brings the form up by itself. */
const OPEN_AT = 0.4;

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

type Stage = "closed" | "prompt" | "form";

export function MessageWidget() {
  const [stage, setStage] = useState<Stage>("closed");
  const open = stage !== "closed";
  const [values, setValues] = useState<Record<Field, string>>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  // Set once the form has shown itself, and never unset. Being dismissed is an
  // answer; asking again is how a helper turns into a nuisance.
  const autoOpenSpent = useRef(false);

  const close = useCallback(() => {
    autoOpenSpent.current = true;
    setStage("closed");
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  /**
   * Open once the reader is more than 40% of the way down.
   *
   * Measured against the distance actually scrollable rather than the document
   * height, so it means "40% of the way through" on any screen instead of
   * firing at a fixed pixel depth. A page too short to scroll never triggers.
   */
  useEffect(() => {
    const onScroll = () => {
      if (autoOpenSpent.current) return;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= OPEN_AT) {
        autoOpenSpent.current = true;
        // Opening by itself must not take the screen. On a phone that means
        // the prompt — four lines and two ways to answer — and the form only
        // if it is asked for. With room to spare, go straight to the form.
        setStage(
          window.matchMedia("(min-width: 640px)").matches ? "form" : "prompt"
        );
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // in case the browser restored a mid-page scroll position
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (stage === "form") firstFieldRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // The centred form holds the page still behind it. The prompt does not —
    // it is an offer sitting in the corner, and freezing the page for it would
    // be the widget seizing the screen it was written to avoid seizing.
    //
    // Locking pairs with a padding-right equal to the scrollbar that just
    // disappeared; without it the whole page jumps sideways as it opens.
    if (stage !== "form") {
      return () => document.removeEventListener("keydown", onKey);
    }
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open, stage, close]);

  const set = (name: Field) => (v: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhone(v) : v,
    }));
    // Clear the error as soon as the field is touched again — leaving it up
    // mid-correction reads as the form arguing with the person filling it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  /**
   * Validate, then say what actually happens: nothing.
   *
   * The fields are still checked, so the form behaves like the real thing and
   * can be demonstrated properly — but there is no endpoint, no mailto and no
   * storage behind it, and the confirmation says so rather than showing a
   * "Message sent" that would be a lie.
   */
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

  return (
    <>
      {/* The dock. Above the header (z-50) and the map pop-out. */}
      <button
        ref={openerRef}
        type="button"
        onClick={() => setStage("form")}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-[3px] bg-ink px-5 py-3.5 font-mono text-[12px] uppercase tracking-widest text-limestone-pale shadow-[0_10px_30px_rgba(27,36,55,0.35)] transition-opacity duration-200 hover:bg-ink-soft sm:bottom-7 sm:right-7 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <path
            d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.7 8.7 0 0 1-3.9-.9L3 20.5l1.7-4.8a8.2 8.2 0 0 1-1.2-4.2A8.4 8.4 0 0 1 12 3.2a8.4 8.4 0 0 1 9 8.3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        Send a message
      </button>

      {/* The prompt. Only ever appears by itself, on a phone, and only asks —
          four lines in the corner, no scrim, page still scrollable behind it.
          `left-4 right-4` with `ml-auto` spans the width on a phone and caps on
          anything wider; there is no vw arithmetic here, so nothing can hang a
          hairline past the viewport edge. */}
      {stage === "prompt" && (
        <div
          role="dialog"
          aria-labelledby={fid("prompt-title")}
          className="fixed bottom-4 left-4 right-4 z-[61] ml-auto max-w-[24rem] rounded-[4px] border border-ink/12 bg-limestone-pale p-5 shadow-[0_20px_50px_rgba(27,36,55,0.28)] motion-safe:animate-[pop-in_280ms_cubic-bezier(0.2,0.9,0.3,1.15)]"
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id={fid("prompt-title")}
              className="display text-2xl leading-tight text-ink"
            >
              Speak with {site.agent.split(" ")[0]}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-1.5 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] text-ink-muted transition-colors hover:bg-limestone-deep hover:text-ink"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  d="M2 2l12 12M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                />
              </svg>
            </button>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Tell us what you&apos;re looking for and someone from the office
            will come back to you — usually the same day.
          </p>

          <div className="mt-4 space-y-2.5">
            <button
              type="button"
              onClick={() => setStage("form")}
              className="btn-solid w-full"
            >
              Leave your details
            </button>
            <a
              href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
              className="btn-line w-full gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              Call {site.phone}
            </a>
          </div>
        </div>
      )}

      {stage === "form" && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close the message form"
            onClick={close}
            className="absolute inset-0 cursor-default bg-ink/55 backdrop-blur-[3px] motion-safe:animate-[fade-in_200ms_ease-out]"
          />

          {/* Centred, and sized so the whole form is on screen. max-h is a
              safety net for short landscape phones, not the normal case. */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={fid("title")}
            className="relative flex max-h-[92dvh] w-full max-w-[32rem] flex-col overflow-hidden rounded-[4px] border border-ink/12 bg-limestone-pale shadow-[0_30px_70px_rgba(27,36,55,0.4)] motion-safe:animate-[pop-in_260ms_cubic-bezier(0.2,0.9,0.3,1.15)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-3 sm:px-6">
              <div>
                <p className="label">Send a message</p>
                <h2
                  id={fid("title")}
                  className="display mt-1 text-xl leading-tight text-ink"
                >
                  Tell us what you&apos;re looking for
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="-mr-1.5 -mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] text-ink-muted transition-colors hover:bg-limestone-deep hover:text-ink"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  <path
                    d="M2 2l12 12M14 2L2 14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                  />
                </svg>
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-brass-deep/40"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-brass-deep">
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
                    This site is built for demonstration purposes. The form
                    works, but it isn&apos;t connected to anything yet — your
                    message has not been sent anywhere and no details have been
                    stored.
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
                <div className="mt-1 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={reset} className="btn-line">
                    Back to the form
                  </button>
                  <button type="button" onClick={close} className="btn-solid">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                className="overflow-y-auto px-5 py-4 sm:px-6"
              >
                <fieldset className="border-0 p-0">
                  <legend className="label mb-2">Name</legend>
                  {/* Two columns at every width. They are short fields, and
                      stacking them is a whole row of height the modal spends
                      better on keeping the rest of the form unscrolled. */}
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

                <div className="mt-2.5 space-y-2.5">
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

                {/* Above the button, not below it: it is a condition of
                    pressing, so it has to be readable before you press. */}
                <p className="mt-3 rounded-[3px] border border-ink/10 bg-limestone/60 p-2.5 text-[10px] leading-snug text-ink-soft">
                  By providing your telephone number, you are consenting to
                  allow {site.name}{" "}
                  to contact you with informational communications via voice
                  call, AI voice call, and/or text message, or similar
                  automated means for real estate services.
                  To opt out reply &lsquo;stop&rsquo; at any time, or
                  &lsquo;help&rsquo; for assistance. Message and data rates may
                  apply. Message frequency may vary.
                </p>

                <button type="submit" className="btn-solid mt-3 w-full">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
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
            rows={3}
            className={`${shared.className} h-[clamp(2.75rem,8dvh,5rem)] resize-y`}
          />
        ) : (
          <input {...shared} ref={ref} type={type} inputMode={inputMode} />
        )}
        {error && (
          <p id={errorId} role="alert" className="mt-1 font-mono text-[10px] text-ink">
            {error}
          </p>
        )}
      </div>
    );
  }
);
