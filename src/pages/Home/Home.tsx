import ContactSection from "../../components/ContactSection";
import Hero from "../../components/Hero";
import styles from "./Home.module.css";

function Home() {
  return (
    <main className={styles.page}>
      <Hero />
      <ContactSection />
    </main>
  );
}

export default Home;
