import ContactSection from "../../components/ContactSection";
import FeaturedProjects from "../../components/FeaturedProjects";
import Hero from "../../components/Hero";
import ScrollIndicator from "../../components/ScrollIndicator";
import styles from "./Home.module.css";

function Home() {
  return (
    <>
      <ScrollIndicator />
      <main className={styles.page}>
        <Hero />
        <FeaturedProjects />
        <ContactSection />
      </main>
    </>
  );
}

export default Home;
