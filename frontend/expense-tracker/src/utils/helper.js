import moment from "moment";

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getInitials = (name) => {
  if(!name) return "";

  const words = name.split(" ");
  let initials = "";

  for(let i = 0; i < Math.min(words.length, 2); i++){
    initials += words[i][0];
  }

  return initials.toUpperCase();
}



export const addThousandsSeparator = (num) => {
  if(num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ?`${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};


export const prepareExpenseBarChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  return data.map(item => ({
    category: item?.category,
    amount: item?.amount,
  }));
};


export const prepareIncomeBarChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"),
    amount: Number(item.amount) || 0,
    source: item.source,
  }));
};

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
      month: moment(item?.date).format('Do MMM'),
      amount: item?.amount,
      category: item?.category,
    }));

    return chartData;
}