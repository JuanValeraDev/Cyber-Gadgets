import styles from "../styles/Footer.module.css"

export default function Footer() {
    return (
        <footer className={`${styles.footer} dark:bg-primary-dark `}>
            <div className="container mx-auto text-center">
                <p>Made with ❤️ by <a href={"https://www.linkedin.com/in/juan-valera-reales/"}
                                      target={"_blank"}>JuanValeraDev</a>
                </p>

            </div>
        </footer>
    );
}
