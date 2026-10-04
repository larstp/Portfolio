import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Button, ButtonLink } from "./Button";
import styles from "./ContactSection.module.css";

type SubmissionState = "idle" | "sending" | "success" | "error";

type ContactLink = {
  label: string;
  href: string;
  icon: string;
  external?: boolean;
};

const contactLinks: ContactLink[] = [
  {
    label: "E-Mail",
    href: "mailto:github.enviably914@passinbox.com",
    icon: "/icons/material-symbols_mail-rounded.svg",
  },
  {
    label: "GitHub",
    href: "https://github.com/larstp",
    icon: "/icons/mdi_github.svg",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/larstpet/",
    icon: "/icons/mdi_linkedin.svg",
    external: true,
  },
  {
    label: "SubStack",
    href: "https://substack.com/@larstp",
    icon: "/icons/bi_substack.svg",
    external: true,
  },
];

function ContactSection() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("sending");

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setSubmissionState("error");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("access_key", accessKey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { success?: boolean };

      if (!response.ok || !data.success) {
        throw new Error("Form submission failed");
      }

      form.reset();
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  }

  return (
    <section
      className={styles.contactSection}
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="content-width">
        <h2 className={styles.contactHeading} id="contact-heading">
          Say hello!
        </h2>
        <p className={styles.contactSubheading}>
          Do you have any projects you would be interested in collaborating on?
          Any tips or tricks, or maybe a good book recommendation? Feel free to
          send me a message!
        </p>

        <div className={styles.contactContent}>
          <div className={styles.contactFormContainer}>
            <form
              className={styles.contactForm}
              aria-label="Contact form"
              onSubmit={handleSubmit}
            >
              <label className={styles.srOnly} htmlFor="contact-name">
                Your name
              </label>
              <input
                className={styles.contactInput}
                id="contact-name"
                name="name"
                type="text"
                placeholder="Name"
                autoComplete="name"
                required
              />

              <label className={styles.srOnly} htmlFor="contact-email">
                Your email address
              </label>
              <input
                className={styles.contactInput}
                id="contact-email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
              />

              <label className={styles.srOnly} htmlFor="contact-message">
                Your message
              </label>
              <textarea
                className={styles.contactTextarea}
                id="contact-message"
                name="message"
                placeholder="Message"
                rows={6}
                required
              />

              <Button
                className={styles.contactSubmitButton}
                type="submit"
                disabled={submissionState === "sending"}
              >
                <img
                  className="btn-icon-md"
                  src="/icons/fa6-solid_shuttle-space.svg"
                  alt=""
                  aria-hidden="true"
                />
                {submissionState === "sending" ? "Sending..." : "Send message"}
              </Button>

              <p
                className={`${styles.contactStatus} ${
                  submissionState === "success"
                    ? styles.contactStatusSuccess
                    : submissionState === "error"
                      ? styles.contactStatusError
                      : ""
                }`}
                role="status"
                aria-live="polite"
              >
                {submissionState === "success"
                  ? "Message sent successfully."
                  : submissionState === "error"
                    ? "The contact form is not ready yet. Please use email instead."
                    : null}
              </p>
            </form>
          </div>

          <div className={styles.contactLinksContainer}>
            {contactLinks.map((link) => (
              <ButtonLink
                className={styles.contactLink}
                variant="ghost"
                href={link.href}
                key={link.label}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={
                  link.external
                    ? `${link.label} (opens in new tab)`
                    : link.label
                }
              >
                <img
                  className={styles.contactLinkIcon}
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                />
                <span className={styles.contactLinkText}>{link.label}</span>
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
