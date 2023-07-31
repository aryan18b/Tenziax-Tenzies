function Dice(prop){
    const styles = {
        backgroundColor :  prop.isHeld ? " #59E391" : "rgb(255, 255, 255)"
    }
    return (
        <div 
            
            onClick={prop.toggleHeld} 
            className="dice"
            style={styles}           
            >
            {prop.value}
            
        </div>
    )
}

export default Dice