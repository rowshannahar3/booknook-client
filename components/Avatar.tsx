/* Photo URLs can come from any host, so a plain <img> is used on purpose. */
export default function Avatar({ name, image, size = "size-10" }: { name?: string | null; image?: string | null; size?: string }) {
  const initial = (name?.trim()[0] ?? "?").toUpperCase();
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt={name ? `${name}'s photo` : "Profile photo"} className={`${size} rounded-full object-cover`} referrerPolicy="no-referrer" />
  ) : (
    <span className={`${size} grid place-items-center rounded-full bg-primary font-semibold text-primary-content`} aria-hidden="true">
      {initial}
    </span>
  );
}
