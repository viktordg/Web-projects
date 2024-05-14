//You have writen 182 chars, you have -42 chars left.
var age = 56;

    var maxDays = 90 * 365;
    var maxWeeks = 90 * 52;
    var maxMonths = 90 * 12;
    
    var currDays = maxDays - (age * 365);
    var currWeeks = maxWeeks - (age * 52);
    var currMonths = maxMonths - (age * 12);
    
    console.log("You have " + currDays + "days, " + currWeeks + " weeks, and " + currDays + " months left.");