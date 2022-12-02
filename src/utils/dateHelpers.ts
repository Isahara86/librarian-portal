import moment, { Moment } from 'moment-timezone';

export const getDisabledDates = (
  firstActiveDate: Moment,
  lastActiveDate: Moment,
) => (currentDate: Moment) => (
  // Can not select days before firstActiveDate and lastActiveDate
  (currentDate < firstActiveDate.startOf('day') || currentDate > lastActiveDate.startOf('day'))
);

// Can not select days before today
export const getDisabledDatesBeforeToday = (currentDate: Moment) => currentDate < moment().startOf('day');

// Can not select days after today and today
export const getDisabledDatesAfterToday = (currentDate: Moment) => currentDate > moment().endOf('day');

// Can not select days before activeDate
export const getDisabledDatesBeforeDate = (activeDate: Moment) => (currentDate: Moment) => currentDate < activeDate.startOf('day');

// Can not select days after activeDate
export const getDisabledDatesAfterDate = (activeDate: Moment) => (currentDate: Moment) => currentDate > activeDate.startOf('day');
