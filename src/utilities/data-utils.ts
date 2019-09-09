import _ from 'lodash';

function sortDataEntriesByDate(entryList: Array<any>, dateProp: string, descending: boolean = true): Array<any> {
    let datePropPresent = _.every(entryList, (entry) => {
        return entry.hasOwnProperty(dateProp);
    });

    if (!datePropPresent) {
        console.warn('sortDataEntriesByDate: cannot sort entries by Date property ' + dateProp)
        return entryList;
    };

    let sorted = _.sortBy(entryList, function (entry) {
        //element will be each array, so we just return a date from first element in it
        // let date:Date = isDate(entry[dateProp]) ? entry[dateProp] : new Date(entry[dateProp]);
        let date: Date = new Date(entry[dateProp]);
        return date.getTime();
    });

    if (descending) {
        sorted.reverse();
    }

    return sorted;
}

function getFirstOfDataEntries(entryList: Array<any>, count: number = 1): Array<any> {
    return entryList.slice(0, count);
}

export let DataEntryUtils = {
    sortDataEntriesByDate,
    getFirstOfDataEntries
}
