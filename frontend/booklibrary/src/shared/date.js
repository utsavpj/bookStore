export function formatDate(utcDate) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    };
    const formattedDate = new Date(utcDate).toLocaleString("en-US", options);
    return formattedDate;
  }
  