import moment from 'moment-timezone';

export const convertToAmPm = (time: string) => {
  const H = +time.substring(0, 2);
  const h = (H % 12) || 12;
  const ampm = H < 12 ? 'AM' : 'PM';

  return `${h}:${time.substring(3, 5)} ${ampm}`;
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const convertToReadableDate = (date: string) => {
  const todayDate = moment().startOf('day');
  const tomorrowDate = moment(todayDate).add(1, 'days').startOf('day');

  const formattedDate = moment(date, 'YYYY-MM-DD').startOf('day');

  if (formattedDate.format('YYYY-MM-DD') === todayDate.format('YYYY-MM-DD')) {
    return `Today, ${todayDate.format('DD')} ${todayDate.format('MMM')}`;
  }

  if (formattedDate.format('YYYY-MM-DD') === tomorrowDate.format('YYYY-MM-DD')) {
    return `Tomorrow, ${tomorrowDate.format('DD')} ${tomorrowDate.format('MMM')}`;
  }

  return `${days[formattedDate.day()]}, ${formattedDate.format('DD')} ${formattedDate.format('MMM')}`;
};

export const renderDateTime = (date: number | undefined) => date && (
  <>
    <div>
      { moment(date).format('MM/DD/YYYY') }
    </div>
    <div>
      { moment(date).format('hh:mm A') }
    </div>
  </>
);
