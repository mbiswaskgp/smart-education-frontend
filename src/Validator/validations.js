const validPhonePrefixArr = ["9", "8", "7", "6"];

export const isEmpty = data => {
    return (
        data.length == 0 ||
        data == null ||
        data == undefined ||
        String(data).trim().length === 0 ||
        (Object.entries(data).length === 0 && data.constructor === Object)
    );
};

export const isNum = data => {
    if (parseInt(data) !== NaN) {
        return true;
    }
};

export const isEmail = data => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(data) == false) 
    {
        return false;
    }
    return true;
}