// components/Avatar.tsx
import Image from "next/image";

interface AvatarProps {
  id: string;
  alt: string;
}

export function Avatar({ id, alt }: AvatarProps) {
  return <Image src={`/avatars/${id}.png`} alt={alt} width={64} height={64} />;
}

export function AvatarOfMe() {
  return <Avatar id="free" alt="A portrait of me" />;
}

export default function Page() {
  return (
    <div>
      <h1>My Avatar</h1>
      <AvatarOfMe />
    </div>
  );
}
