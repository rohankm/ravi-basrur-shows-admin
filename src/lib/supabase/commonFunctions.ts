export const formatAMPM = (gmtDate: Date): string => {
  if (typeof gmtDate !== "object") {
    return "Select Time";
  }

  // Calculate local time zone offset in minutes
  const localOffsetMinutes = new Date().getTimezoneOffset();

  // Adjust the GMT date for the local time zone offset
  const adjustedDate = new Date(gmtDate.getTime() - localOffsetMinutes * 60000);

  // Format the adjusted date to local time
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return adjustedDate.toLocaleTimeString("en-US", options);
};
