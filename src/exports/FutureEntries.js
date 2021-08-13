const moment = require('moment');
const {convertToUNIX} = require('./TimeConverter');


//please don't specify date in DD-MM-YYYY format for all months
/* right way */
//DD-M-YYYY (for month 1 to 9)
//DD-MM-YYYY (for month 10 to 12)

const holidays = [
        '26-1-2021',
        '11-3-2021',
        '29-3-2021',
        '2-4-2021',
        '14-4-2021',
        '21-4-2021',
        '13-5-2021',
        '21-7-2021',
        '19-8-2021',
        '10-9-2021',
        '15-10-2021',
        '4-11-2021'
];

const defaultStartTime = {
    startHour : 9,
    startMinute : 15,
    startSecond : 0
}
const defaultEndTime = {
    endHour : 15,
    endMinute : 29,
    endSecond : 0
}

function getNextMonths(days,isCount=true)
{
    //does not count saturday and sunday
    let nod = 0,incr = 1;
    let futureDays = [];
    
    if(isCount)
    {
        let today = moment();

        if(isWorkingDay(today))
        {
            futureDays.push({
                date : today.clone(),
                startHour : parseInt(today.format('H')),
                startMinute : parseInt(today.format('m')),
                startSecond : parseInt(today.format('s')),
                ...defaultEndTime
            })
        }
    }

    let addedDay = moment();
    
    while(nod < days)
    {
        addedDay = addedDay.add(1,'month').startOf('month').clone();
        nod++;
        // console.log(addedDay,nod);
        futureDays.push({
            date : addedDay.clone(),
            ...defaultStartTime,
            ...defaultEndTime
        });
    }

    // console.log(futureDays);

    return futureDays;
}

function getNextDays(days,isCount=true)
{
    //does not count saturday and sunday
    let nod = 0,incr = 1;
    let futureDays = [];
    
    if(isCount)
    {
        let today = moment();

        if(isWorkingDay(today))
        {
            futureDays.push({
                date : today.clone(),
                startHour : parseInt(today.format('H')),
                startMinute : parseInt(today.format('m')),
                startSecond : parseInt(today.format('s')),
                ...defaultEndTime
            })
        }
    }

    let addedDay = moment();
    
    while(nod < days)
    {
        addedDay = getNextWorkingDay(addedDay);
        nod++;
        // console.log(addedDay,nod);
        futureDays.push({
            date : addedDay.clone(),
            ...defaultStartTime,
            ...defaultEndTime
        });
    }

    // console.log(futureDays);

    return futureDays;
}

function getNextMinutes(curr,minutes)
{
    let today = curr;
    // console.log(today);
    let futureDays = [];

    let EnoughTime = isEnoughTime(today,minutes);

    if(EnoughTime.enough && EnoughTime.duration >= minutes)
    {
        let endTime = today.clone().add(minutes,'minutes');
        futureDays.push({
            date : today.clone(),
            startHour : parseInt(today.format('H')),
            startMinute : parseInt(today.format('m')),
            startSecond : parseInt(today.format('s')),
            endHour : parseInt(endTime.format('H')),
            endMinute : parseInt(endTime.format('m')),
            endSecond : parseInt(endTime.format('s'))
        })
    }
    else if(!EnoughTime.enough && EnoughTime.duration >= 5)
    {
        console.log('Mixed');
        console.log(EnoughTime.duration);

        let extra = minutes - EnoughTime.duration;


        futureDays.push({
            'date' : today.clone(),
            startHour : parseInt(today.format('H')),
            startMinute : parseInt(today.format('m')),
            startSecond : parseInt(today.format('s')),
            ...defaultEndTime
        });

        let nextDay = getNextWorkingDay(today);
        nextDay.set({
            'hour' : defaultStartTime.startHour,
            'minute' : defaultStartTime.startMinute,
            'second' : defaultStartTime.startSecond
        });

        nextDay.add(extra,'minutes');


        futureDays.push({
            'date' : today.clone(),
            ...defaultStartTime,
            endHour : parseInt(nextDay.format('H')),
            endMinute : parseInt(nextDay.format('m')),
            endSecond : parseInt(nextDay.format('s'))
        });

    }
    else
    {
        //check tomorrow
        let nextDay = getNextWorkingDay(today);
        nextDay.set({
            'hour' : defaultStartTime.startHour,
            'minute' : defaultStartTime.startMinute,
            'second' : defaultStartTime.startSecond
        });

        nextDay.add(minutes,'minutes');


        futureDays.push({
            'date' : today.clone(),
            ...defaultStartTime,
            endHour : parseInt(nextDay.format('H')),
            endMinute : parseInt(nextDay.format('m')),
            endSecond : parseInt(nextDay.format('s'))
        });
    }

    // console.log(futureDays);
    return futureDays;
    
}




function getNextWorkingDay(day)
{
    let isWD = false;
    let nextWorkingDay;
    while(!isWD)
    {
        let addedDay = day.add(1,'days');
        //if saturday or sunday then skip
        if(isWorkingDay(addedDay))
        {
            nextWorkingDay = addedDay.clone();
            isWD = true;
        }
    }

    return nextWorkingDay;
}

function isWorkingDay(day)
{
    if(day.format('d') !== '6' && day.format('d') !== '0' && !holidays.includes(day.format('DD-M-YYYY')))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function generatePointsMinutes(days,incr)
{
    let points = [];

    // console.log('generate points');

    days.forEach(day => {
        
        let startDT = day.date.clone().set({
            'hour' : day.startHour,
            'minute' : day.startMinute,
            'second' : day.startSecond
        });

        let endDT = day.date.clone().set({
            'hour' : day.endHour,
            'minute' : day.endMinute,
            'second' : day.endSecond
        });

        if(startDT < endDT)
        {
            // console.log(day,startDT,endDT);
            points = points.concat(getMinuteInterval(startDT,endDT,incr));
            // console.log(points[points.length-1])
        }

        

    });

    // console.log(points.length);
    return points;

}

function generatePointsDays(days)
{
    let points = [];

    console.log('generate points');

    days.forEach(day => {

        points.push({
            date : new Date(day.date.clone().set({
                    'hour' : day.startHour,
                    'minute' : day.startMinute,
                    'second' : day.startSecond
                }))
        })
        
        
    });

    console.log(points.length);
    return points;
}

function getMinuteInterval(startDate,endDate,incr)
{
    let interval = [];
    while(startDate < endDate)
    {
        interval.push(
            {
                date : new Date(startDate.add(incr,'minutes').clone())
            }
        );

    }
    // console.log(interval.length,interval[0],interval[interval.length-1]);
    return interval;
}

function isMarketClosed(curr)
{
    if(curr.format('H') >= 15 && curr.format('m') > 29)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isEnoughTime(day,time)
{
    if(isWorkingDay(day) && !isMarketClosed(day))
    {
        let EndTime = moment().set({
            'year' : day.get('year'),
            'month' : day.get('month'),
            'date' : day.get('date'),
            'hour' : 15,
            'minute' : 29,
            'second' : 0
        });
    
        let duration = moment.duration(EndTime.diff(day));
    
        return duration.asMinutes() >= time ? {
            'enough' : true,
            'duration' : parseInt(duration.asMinutes())
        } : {
            'enough' : false,
            'duration' : parseInt(duration.asMinutes())
        };
    }
    else
    {
        return false;
    }
}

export function getFuturePoints(lastPoint,range)
{

    let futureDaysArr,points;

    let curr = moment(lastPoint.date);

    switch(range){
        case 'D' : 
            futureDaysArr = getNextMinutes(curr,30);
            // console.log(futureDaysArr);
            points = generatePointsMinutes(futureDaysArr,1);
            // console.log(points);
            return points;
        
        case '1D' : 
            futureDaysArr = getNextMinutes(curr,60);
            // console.log(futureDaysArr);
            points = generatePointsMinutes(futureDaysArr,1);
            // console.log(points);
            return points;
        
        case '5D' : 
            futureDaysArr = getNextDays(1);
            // console.log(futureDaysArr);
            points = generatePointsMinutes(futureDaysArr,5);
            // console.log(points);
            return points;
        
        case '1M' : 
            futureDaysArr = getNextDays(4);
            // console.log(futureDaysArr);
            points = generatePointsMinutes(futureDaysArr,30);
            // console.log(points);
            return points;
        
        case '3M' : 
            futureDaysArr = getNextDays(10);
            // console.log(futureDaysArr);
            points = generatePointsMinutes(futureDaysArr,60);
            // console.log(points);
            return points;
        
        case '6M' : 
            futureDaysArr = getNextDays(30);
            // console.log(futureDaysArr);
            points = generatePointsMinutes(futureDaysArr,120);
            // console.log(points);
            return points;
        
        case 'YTD' : 
            futureDaysArr = getNextDays(30,false);
            // console.log(futureDaysArr);
            points = generatePointsDays(futureDaysArr);
            return points;
        
        case '1Y' : 
            futureDaysArr = getNextDays(90,false);
            // console.log(futureDaysArr);
            points = generatePointsDays(futureDaysArr);
            return points;
        
        case '5Y' : 
            futureDaysArr = getNextDays(120,false);
            // console.log(futureDaysArr);
            points = generatePointsDays(futureDaysArr);
            return points;

        case 'MAX' : 
            futureDaysArr = getNextMonths(60,false);
            // console.log(futureDaysArr);
            points = generatePointsDays(futureDaysArr);
            return points;

        default : 
            futureDaysArr = getNextDays(5);
            // console.log(futureDaysArr);
            points = generatePointsMinutes(futureDaysArr,60);
            // console.log(points);
            return points;
    }
    
}

export function getStartPointIndex(data,range,lastPoint,firstPoint)
{

    let first = moment().set({
        'date' : firstPoint.date.getDate(),
        'month' : firstPoint.date.getMonth(),
        'year' : firstPoint.date.getFullYear()
    });

    if(range === 'D')
    {
      return data.length - 120;
    }
    else if(range === '1D')
    {
      let indx = data.findIndex(d => {
        return d.date.getDate() == lastPoint.date.getDate() && d.date.getMonth() == lastPoint.date.getMonth() && d.date.getFullYear() == lastPoint.date.getFullYear()
      });
      return indx;
    }
    else if(range === '5D')
    {
        let found = false,index;
        let dt = moment().
        set({
            'date' : lastPoint.date.getDate(),
            'month' : lastPoint.date.getMonth(),
            'year' : lastPoint.date.getFullYear()
        })
        .subtract(5,'days');        
        // console.log(dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
        while(!found)
        {
            let indx = data.findIndex(d => {
                return d.date.getDate() === dt.get('date') && d.date.getMonth() === (dt.get('month')) && d.date.getFullYear() === dt.get('year');
            });
            // console.log(indx,dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
            if(indx === -1)
            {
                dt = dt.subtract(1,'days');
            }
            else
            {
                found = true;
                index = indx;
                break;
            }

            // console.log('checking .... ',dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
        }
        // console.log('INDEX :  -----> ',index);
        return index;
    }

    else if(range === '1M')
    {
        let found = false,index;
        let dt = moment().
        set({
            'date' : lastPoint.date.getDate(),
            'month' : lastPoint.date.getMonth(),
            'year' : lastPoint.date.getFullYear()
        })
        .subtract(1,'months');        
        console.log(dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
        if(dt < first)
        {
            index = 0;
        }
        else
        {
            while(!found)
            {
                let indx = data.findIndex(d => {
                    return d.date.getDate() === dt.get('date') && d.date.getMonth() === (dt.get('month')) && d.date.getFullYear() === dt.get('year');
                });
                console.log(indx,dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
                if(indx === -1)
                {
                    dt = dt.subtract(1,'days');
                }
                else
                {
                    found = true;
                    index = indx;
                    break;
                }
    
                console.log('checking .... ',dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
            }
        }
        
        console.log('INDEX :  -----> ',index);
        return index;
    }

    else if(range === '3M')
    {
        let found = false,index;
        let dt = moment().
        set({
            'date' : lastPoint.date.getDate(),
            'month' : lastPoint.date.getMonth(),
            'year' : lastPoint.date.getFullYear()
        })
        .subtract(3,'months');        
        console.log(dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
        if(dt < first)
        {
            index = 0;
        }
        else
        {
            while(!found)
            {
                let indx = data.findIndex(d => {
                    return d.date.getDate() === dt.get('date') && d.date.getMonth() === (dt.get('month')) && d.date.getFullYear() === dt.get('year');
                });
                console.log(indx,dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
                if(indx === -1)
                {
                    dt = dt.subtract(1,'days');
                }
                else
                {
                    found = true;
                    index = indx;
                    break;
                }

                console.log('checking .... ',dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
            }
        }
        
        console.log('INDEX :  -----> ',index);
        return index;
    }

    else if(range === '6M')
    {
        let found = false,index;
        let dt = moment().
        set({
            'date' : lastPoint.date.getDate(),
            'month' : lastPoint.date.getMonth(),
            'year' : lastPoint.date.getFullYear()
        })
        .subtract(6,'months');        
        console.log(dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
        if(dt < first)
        {
            index = 0;
        }
        else
        {
            while(!found)
            {
                let indx = data.findIndex(d => {
                    return d.date.getDate() === dt.get('date') && d.date.getMonth() === (dt.get('month')) && d.date.getFullYear() === dt.get('year');
                });
                console.log(indx,dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
                if(indx === -1)
                {
                    dt = dt.subtract(1,'days');
                }
                else
                {
                    found = true;
                    index = indx;
                    break;
                }
    
                console.log('checking .... ',dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
            }
        }
        
        console.log('INDEX :  -----> ',index);
        return index;
    }

    else if(range === 'YTD')
    {
        let found = false,index;
        let dt = moment().
        set({
            'date' : lastPoint.date.getDate(),
            'month' : lastPoint.date.getMonth(),
            'year' : lastPoint.date.getFullYear()
        })
        .startOf('year');        
        console.log(dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
        if(dt < first)
        {
            index = 0;
        }
        else
        {
            while(!found)
            {
                let indx = data.findIndex(d => {
                    return d.date.getDate() === dt.get('date') && d.date.getMonth() === (dt.get('month')) && d.date.getFullYear() === dt.get('year');
                });
                console.log(indx,dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
                if(indx === -1)
                {
                    dt = dt.add(1,'days');
                }
                else
                {
                    found = true;
                    index = indx;
                    break;
                }
    
                console.log('checking .... ',dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
            }
        }
      
        console.log('INDEX :  -----> ',index);
        return index;
    }
    else if(range === '1Y')
    {
        let found = false,index;
        let dt = moment().
        set({
            'date' : lastPoint.date.getDate(),
            'month' : lastPoint.date.getMonth(),
            'year' : lastPoint.date.getFullYear()
        })
        .subtract(1,'year');        
        console.log(dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
        if(dt < first)
        {
            index = 0;
        }
        else
        {
            while(!found)
            {
                let indx = data.findIndex(d => {
                    return d.date.getDate() === dt.get('date') && d.date.getMonth() === (dt.get('month')) && d.date.getFullYear() === dt.get('year');
                });
                console.log(indx,dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
                if(indx === -1)
                {
                    dt = dt.add(1,'days');
                }
                else
                {
                    found = true;
                    index = indx;
                    break;
                }

                console.log('checking .... ',dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
            }
        }
        
        console.log('INDEX :  -----> ',index);
        return index;
    }
    else if(range === '5Y')
    {
        let found = false,index;
        let dt = moment().
        set({
            'date' : lastPoint.date.getDate(),
            'month' : lastPoint.date.getMonth(),
            'year' : lastPoint.date.getFullYear()
        })
        .subtract(5,'year').startOf('year');        
        console.log(dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
        

        if(dt < first)
        {
            index = 0;
        }
        else
        {
            while(!found)
            {
                let indx = data.findIndex(d => {
                    return d.date.getDate() === dt.get('date') && d.date.getMonth() === (dt.get('month')) && d.date.getFullYear() === dt.get('year');
                });
                console.log(indx,dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
                if(indx === -1)
                {
                    dt = dt.add(1,'days');
                }
                else
                {
                    found = true;
                    index = indx;
                    break;
                }

                console.log('checking .... ',dt.format('D'),dt.format('MMM'),dt.format('YYYY'));
            }
        }
        
        console.log('INDEX :  -----> ',index);
        return index;
    }

    else if(range === 'MAX')
    {        
        return 0;
    }
    else
    {
        return data.length - 120;
    }
}

export function getEndOfDayMinutes(lastPoint)
{
    let last = moment(lastPoint.date);
    let curr = moment();

    if(isMarketClosed(curr))
    {
        return [];
    }
    else
    {
        // console.log(last);
        let startDT = last.clone().set({
            'hour' : last.get('hour'),
            'minute' : last.get('minutes'),
            'second' : last.get('seconds')
        });

        let endDT = last.clone().set({
            'hour' : defaultEndTime.endHour,
            'minute' : defaultEndTime.endMinute,
            'second' : defaultEndTime.endSecond
        });

        // console.log(startDT,endDT);
        let points = getMinuteInterval(startDT,endDT,1);
        // console.log(points);
        return points;
    }
}

export function generateMarketDay(date)
{
    let startDT = moment(date).clone().set({
        'hour' : defaultStartTime.startHour,
        'minute' : defaultStartTime.startMinute,
        'second' : defaultStartTime.startSecond
    });

    let endDT = moment(date).clone().set({
        'hour' : defaultEndTime.endHour,
        'minute' : defaultEndTime.endMinute,
        'second' : defaultEndTime.endSecond
    });

    // console.log(startDT,endDT);
    let points = getMinuteInterval(startDT,endDT,1);
    // console.log(points);
    return points;
}

export function filterBigData(data,range)
{

    let filteredData = [];
    let startUNIX = convertToUNIX(range);
    console.log(data.length,startUNIX,typeof data);
    if(range === '1Y')
    {
        filteredData = data.filter((d)=>{
            return moment(d.date).clone().unix() > startUNIX
        });
    }
    else if(range === '5Y')
    {
        filteredData = data.filter((d,i)=>{
            return moment(d.date).clone().unix() > startUNIX && i%5 === 0
        });
    }
    else
    {
        let start = data ? data[0] : null;
        if(start)
        {
            let m = moment(start.date).get('month');
            filteredData.push(start);

            data.forEach((d)=>{
                if(moment(d.date).get('month') !== m)
                {
                    filteredData.push(d);
                    m = moment(d.date).get('month');
                }
            })
        }        
    }

    console.log(filteredData.length);
    return filteredData;
}


