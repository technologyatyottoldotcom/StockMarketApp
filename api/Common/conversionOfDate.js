function convertDate(temp){
    return temp.getFullYear()+"-"+("0"+(temp.getMonth() +　1)).slice(-2)+"-"+("0"+(temp.getDate())).slice(-2);
}

function increaseDate(temp){
    temp = new Date(temp);
    temp = new Date(temp.setDate(temp.getDate()+1));
    temp = convertDate(temp);

    return temp;
}

module.exports = {convertDate, increaseDate};