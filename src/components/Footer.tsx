export default function Footer({
  businessName,
  contactEmail,
}: {
  businessName: string;
  contactEmail: string;
}) {
  return (
    <footer className="mt-auto border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {businessName}
        </p>
        <a href={`mailto:${contactEmail}`} className="hover:text-accent">
          {contactEmail}
        </a>
      </div>
    </footer>
  );
}
