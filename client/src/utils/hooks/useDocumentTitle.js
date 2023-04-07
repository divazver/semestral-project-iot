import React, {useEffect, useState} from "react";

const useDocumentTitle = (title) => {
  const [documentTitle, setDocumentTitle] = useState(title);

  const baseTitle = process.env.REACT_APP_APP_TITLE;

  useEffect(() => {
    document.title = documentTitle
      ? `${documentTitle} | ${baseTitle}`
      : baseTitle;
  }, [documentTitle]);

  return [documentTitle, setDocumentTitle];
};

export default useDocumentTitle;
