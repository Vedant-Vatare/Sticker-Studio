const FormattedDate = ({ date, locale = 'en-IN' }) => {
  if (!date) return null;

  const formatedDate = new Date(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return <span>{formatedDate}</span>;
};

export default FormattedDate;
