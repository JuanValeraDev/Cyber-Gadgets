import styles from "../../styles/Footer.module.css"

// Componente del pie de página
export default function Footer() {
    return (
        <footer className={`${styles.footer} dark:bg-primary-dark`}>
            <div className="container mx-auto text-center flex flex-col items-center">
                <p className="flex items-center justify-center gap-2">
                    Hecho con ❤️ por
                    <a href="https://www.linkedin.com/in/juan-valera-reales/" target="_blank" rel="noopener noreferrer" className="ml-1 underline">
                        JuanValeraDev
                    </a>
                    {/* Icono de derechos de autor */}
                    <img src="/images/copy.png" alt="Derechos de autor" style={{ width: "6%", height: "2%", marginLeft: "8px" }} />
                </p>
            </div>
        </footer>
    );
}
