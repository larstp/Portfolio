import ContactSection from "../../components/ContactSection";
import AnimatedBackground from "../../components/AnimatedBackground";
import FeaturedProjects from "../../components/FeaturedProjects";
import Hero from "../../components/Hero";
import SkillsSection from "../../components/SkillsSection";
import ScrollIndicator from "../../components/ScrollIndicator";
import styles from "./Home.module.css";

function Home() {
  return (
    <>
      <AnimatedBackground />
      <ScrollIndicator />
      <main className={styles.page}>
        <Hero />
        <FeaturedProjects />
        <SkillsSection />
        <ContactSection />
      </main>
    </>
  );
}

export default Home;
