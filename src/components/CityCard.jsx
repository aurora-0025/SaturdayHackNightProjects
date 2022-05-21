import styles from "./CityCard.module.css"

function CityCard({city}) {
    return <div className={styles.card}>
        <h4>{city.name} , <span className={styles.cardItem}>{city.country}</span></h4>
        
    </div>
}

export default CityCard