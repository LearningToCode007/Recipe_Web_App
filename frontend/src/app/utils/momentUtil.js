import moment from "moment";

export const formatMomentDate = (date) => {
  return moment(date).format("MM-DD-YYYY");
};

export const formatMomentTime = (time) => {
  // Assuming time is in HH:mm:ss format
  return moment(time, "HH:mm").format("hh:mm A");
};

export const isDateBefore = (date1, date2) => {
  // Parse the dates using moment
  const momentDate1 = moment(date1, "MM-DD-YYYY");
  const momentDate2 = moment(date2, "MM-DD-YYYY");

  // Check if date1 is before date2
  return momentDate1.isBefore(momentDate2);
};

export const isDateAfter = (date1, date2) => {
  // Parse the dates using moment
  const momentDate1 = moment(date1, "MM-DD-YYYY");
  const momentDate2 = moment(date2, "MM-DD-YYYY");

  // Check if date1 is after date2
  return momentDate1.isAfter(momentDate2);
};

export const isTimeBefore = (time1, time2) => {
  // Parse the times using moment
  const momentTime1 = moment(time1, "HH:mm");
  const momentTime2 = moment(time2, "HH:mm");

  // Check if time1 is before time2
  return momentTime1.isBefore(momentTime2);
};

export const isTimeAfter = (time1, time2) => {
  // Parse the times using moment
  const momentTime1 = moment(time1, "HH:mm");
  const momentTime2 = moment(time2, "HH:mm");

  // Check if time1 is after time2
  return momentTime1.isAfter(momentTime2);
};
