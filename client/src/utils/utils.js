export function textifyPriority(int){

    let priority = parseInt(int, 10)

    switch(priority){
        case 1:
            priority = 'Low'
            break
        case 2:
            priority = 'Medium'
            break
        case 3:
            priority = 'High'
            break
        default:
            priority = 'Medium'
            break
    }

    return priority
}
