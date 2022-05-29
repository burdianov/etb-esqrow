export enum DateType {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

const NumberInput = ({
  dateType,
  value,
  onChange
}: {
  dateType: DateType;
  value: number;
  onChange: (e: any) => void;
}) => {
  let name, min, max;

  switch (dateType) {
    case DateType.YEAR:
      name = 'year';
      min = 2022;
      max = 2099;
      break;
    case DateType.MONTH:
      name = 'month';
      min = 1;
      max = 12;
      break;
    case DateType.DAY:
      name = 'day';
      min = 1;
      max = 31;
      break;
    default:
      name = '';
      min = 1;
      max = 1;
      break;
  }

  return (
    <input
      id={name}
      name={name}
      type='number'
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
    />
  );
};

export default NumberInput;
