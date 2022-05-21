import styles from "./CityCard.module.css"

function CityCard({city}) {
    return <a href={`https://www.wikidata.org/wiki/${city.wikiDataId}`} target="_blank" rel="noreferrer noopener" className={styles.card}>
        <h4>{city.name} , <span className={styles.cardItem}>{city.country}</span></h4>
        
    </a>
}

export default CityCard