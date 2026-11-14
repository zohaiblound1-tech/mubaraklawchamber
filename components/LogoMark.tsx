/** The chamber's scales-and-gavel mark: the hero image shown small on a white
 *  tile (the photo has a white background). Decorative, so it has empty alt
 *  text; the chamber name always appears next to it. */
export function LogoMark({ size, className = '' }: { size: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/scales-gavel-128.png"
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-md bg-white object-contain ${className}`}
    />
  );
}
