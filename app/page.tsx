import { Hero } from "@/components/sections/Hero";
import { Heritage } from "@/components/sections/Heritage";
import { Collections } from "@/components/sections/Collections";
import { Shapes } from "@/components/sections/Shapes";
import { Craft } from "@/components/sections/Craft";
import { Paths } from "@/components/sections/Paths";
import { Process } from "@/components/sections/Process";
import { Trust } from "@/components/sections/Trust";
import { Inquiry } from "@/components/sections/Inquiry";

export default function Home() {
  return (
    <>
      <Hero />
      <Heritage />
      <Collections />
      <Shapes />
      <Craft />
      <Paths />
      <Process />
      <Trust />
      <Inquiry />
    </>
  );
}
