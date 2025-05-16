
/*
    normalize value for when we have a min an max that is not 0 and but we want to get relatives values to it

    for example if a slider has a value from 0 to 100, but you want to represent other values like
    0 = 10, 100 = 50, so if my value is 19 what value represents?
*/

export const normalizeSliderValue = (value: number|null, maxValue: number, minValue: number) => {
    if (!value) return 0;
    return ((value - minValue) / (maxValue - minValue)) * 100;
}

export const normalizeValue = (value: number|null, maxValue: number, minValue: number) => {
    if (!value) return 0;
    return (value - minValue) / (maxValue - minValue);
}